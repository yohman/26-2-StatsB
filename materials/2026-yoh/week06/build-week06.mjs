import {writeFileSync,mkdirSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import M from '../../../assets/week6-math.js';
import P from '../../../assets/week5-math.js';
import {annotateJapaneseTerms,terminologyStyle} from '../week05/terms-week05.mjs';
import {teach} from './lesson-week06.mjs';
import {style} from './style-week06.mjs';
import {die as dieFaceSvg} from './dice-samples-week06.mjs';
import {zDistanceComparison,zPurposeGraphic} from './z-comparison-week06.mjs';
const here=dirname(fileURLToPath(import.meta.url));mkdirSync(resolve(here,'images'),{recursive:true});
const course='https://yohman.github.io/26-2-StatsB/',slides=[],notes=[],mapping=[];
const old='other material/2025 yoh/08 Chi and T Distributions/w8 Chi Squared.md',cltOld='other material/2025 yoh/07 確率分布_2_連続確率分布/w8.pdf';
const ruby=s=>s.split(' ').map(t=>{const[a,b]=t.split(':');return b?`<ruby>${a}<rt>${b}</rt></ruby>`:a;}).join('');
const term=(ja,en)=>`${ja}<span class="en">${en}</span>`;
const names={clt:term(ruby('中:ちゅう 心:しん 極:きょく 限:げん 定:てい 理:り'),'Central limit theorem'),t:term(ruby('t 分:ぶん 布:ぷ'),'Student’s t-distribution'),chi:term(ruby('カイ 二:に 乗:じょう 分:ぶん 布:ぷ'),'Chi-square distribution'),df:term(ruby('自:じ 由:ゆう 度:ど'),'Degrees of freedom'),uv:term(ruby('標:ひょう 本:ほん 不:ふ 偏:へん 分:ぶん 散:さん'),'Unbiased sample variance')};
const math=s=>`\n\n$$\n${s}\n$$\n\n`,big=s=>`<p class="big">${s}</p>`,small=s=>`<p class="small">${s}</p>`;
const go=(mode,label='やってみよう！')=>`[${label}](${course}agenda.html?p&activity=w6-${mode}#week-06)`;
const tryLink=(mode,label)=>`<aside class="explore-link"><a href="${course}agenda.html?p&activity=w6-${mode}#week-06">やってみよう！ ${label} ↗</a></aside>`;
const resource=(file,label)=>`<a target="_blank" rel="noopener" href="${course}viewer.html?p&file=materials%2F2026-yoh%2Fweek06%2F${file}&week=W06&title=${encodeURIComponent(label)}">${label} ↗</a>`;
const normalLink=()=>`<aside class="resource">${resource('standard-normal-table.pdf','標準正規分布表')}</aside>`;
const tLink=()=>`<aside class="resource">${resource('t-table.pdf','t分布表')}</aside>`;
// The registry transcribes the printed textbook, not simplified substitute notation.
const F={
 individualZ:{tex:String.raw`Z=\frac{X-E(X)}{\sqrt{\operatorname{Var}(X)}}=\frac{X-\mu}{\sigma}`,page:'123（標準化を1個の値Xに適用・前回の復習）'},
 mean:{tex:String.raw`\bar{x}=\frac{1}{n}(x_1+x_2+\cdots+x_n)`,page:'122（脚注2）'},
 z:{tex:String.raw`Z=\frac{\bar X-E(\bar X)}{\sqrt{Var(\bar X)}}=\frac{\bar X-\mu_x}{\sqrt{\frac{\sigma_x^2}{n}}}`,page:'123（上段）'},
 zWords:{tex:String.raw`Z=\frac{\bar X-\mu_x}{\sqrt{\frac{\sigma_x^2}{n}}}=\frac{\text{標本平均}-\text{母平均}}{\sqrt{\frac{\text{母分散}}{\text{標本数}}}}`,page:'123（上段）'},
 t:{tex:String.raw`T=\frac{\bar X-\mu_x}{\sqrt{\frac{\widehat{\sigma_x^2}}{n}}}`,page:'125（下段）'},
 uv:{tex:String.raw`\widehat{\sigma_x^2}=\frac{1}{n-1}\sum(X_i-\bar X)^2`,page:'126（上段）'},
 central:{tex:String.raw`\Pr(-t_{\alpha}(\nu)<T<t_{\alpha}(\nu))=0.90`,page:'127（例②）'},
 u:{tex:String.raw`U_0=\frac{\sum_{i=1}^{n}(x_i-\mu_x)^2}{\sigma_x^2}`,page:'128（平方和の分解・左辺）'},
 decomposition:{tex:String.raw`U_0=\frac{\sum_{i=1}^{n}(x_i-\mu_x)^2}{\sigma_x^2}=\frac{\sum_{i=1}^{n}(x_i-\bar X)^2}{\sigma_x^2}+\frac{n(\bar X-\mu_x)^2}{\sigma_x^2}`,page:'128（平方和の分解）'},
 chi:{tex:String.raw`U\sim\chi^2(\nu)`,page:'128（冒頭）'}
};
let part='opening',challengeNumber=0;
const variations={roadmap:'roadmap', 'clt-title':'title-clt','t-title':'title-t','chi-title':'title-chi','df-title':'title-df','uv-title':'title-uv','t-table-title':'title-table','clt-meaning':'punch','exact-normal':'soft-pink','clt-explore':'cta-dice','z-formula':'inverse','unknown-variance':'inverse punch','t-formula':'inverse','variance-conventions':'plum','variance-challenge':'plum','t-challenge':'mint','table-challenge':'paper','counts-to-squares':'paper','student-population':'sunshine','chi-definition':'punch','chi-notation':'inverse','u-formula':'paper','chi-decomposition':'inverse','chi-moments':'mint','summary':'paper','al':'plum'};
function add(id,title,body,{layout='plain',book='',official='',source='',formula='',ja,en}={}){
 if(!ja||!en)throw Error(`Missing notes: ${id}`);const page=slides.length+1;
 const variation=variations[id]||'';
 slides.push(`<!-- _class: ${layout}${variation?' '+variation:''} -->\n\n## ${title}\n\n${body}${book?`\n\n<aside class="formula-ref">教科書 p.${book}</aside>`:''}`);
 const clean=title.replace(/<rt>.*?<\/rt>/g,'').replace(/<[^>]*>/g,' ');
 notes.push({page,title:clean,ja,en});mapping.push({page,id,title:clean,part,layout,variation,textbook:book,official,source,formula});
}
const section=p=>part=p;
const topic=(id,title,ja,en)=>add(id,title,'',{layout:'topic',ja,en});
const zTransitions={
 'individual-z-review':{key:'individualZ',tex:String.raw`Z=\frac{X-E(X)}{\sqrt{\operatorname{Var}(X)}}=\frac{\textcolor{#B65C16}{X}-\mu}{\textcolor{#13768C}{\sigma}}`,labels:['1人の値 X','Individual observation','個人の標準偏差 σ','SD of individual values']},
 'z-formula':{key:'z',tex:String.raw`Z=\frac{\bar X-E(\bar X)}{\sqrt{Var(\bar X)}}=\frac{\textcolor{#FFB45B}{\bar X}-\mu_x}{\textcolor{#72D6EA}{\sqrt{\frac{\sigma_x^2}{n}}}}`,labels:['標本平均 X̄','Sample mean','標本平均の標準偏差','SD of sample means']}
};
for(const entry of Object.values(zTransitions))F[entry.key].highlightTex=entry.tex;
const formula=(id,title,key,official,ja,en)=>{
 const transition=zTransitions[id],labels=transition?.labels;
 const caption=labels?`<div class="formula-caption"><span class="z-orange">${labels[0]}<span class="en">${labels[1]}</span></span><span class="z-blue">${labels[2]}<span class="en">${labels[3]}</span></span></div>`:'';
 add(id,title,math(transition?.tex||F[key].tex)+caption,{layout:`hero-math${key==='decomposition'?' long':''}${transition?' z-transition':''}`,book:F[key].page,official,formula:key,ja,en});
};
const photo=(id,title,path,caption,position,ja,en,source,extra='')=>add(id,title,`<div class="photo-image" style="background-image:url('${path}');background-position:${position};${extra}"></div><div class="photo-caption">${caption}</div>`,{layout:'photo-story',ja,en,source});
function fig(name,config){writeFileSync(resolve(here,`images/${name}.svg`),P.chart({lo:0,hi:0,...config}));return `![width:1060px](images/${name}.svg)`;}
function bars(name,values,labels,{mean=null,max=null,title='',ylabel='点',comparison=null,meanLabelLeft=false}={}){
 const W=1050,H=380,L=75,R=35,T=50,base=305,pw=W-L-R,ph=base-T,ymax=max||Math.max(...values,...(comparison||[]))*1.2,X=i=>L+(i+.5)*pw/values.length,Y=v=>base-v/ymax*ph,bw=pw/values.length*.45;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${title}"><g font-family="Arial,Hiragino Sans,sans-serif" fill="#294c5c" font-size="22"><text x="${L}" y="27">${title}</text>${[0,.5,1].map(f=>`<path d="M${L} ${Y(ymax*f)}H${W-R}" stroke="#dbe4e6"/><text x="${L-12}" y="${Y(ymax*f)+7}" text-anchor="end">${Number((ymax*f).toFixed(2))}</text>`).join('')}${comparison?comparison.map((v,i)=>`<rect x="${X(i)-bw*.8}" y="${Y(v)}" width="${bw*.8}" height="${base-Y(v)}" fill="none" stroke="#176d82" stroke-width="3"/>`).join(''):''}${values.map((v,i)=>`<rect x="${X(i)+(comparison?0:-bw/2)}" y="${Y(v)}" width="${comparison?bw*.8:bw}" height="${base-Y(v)}" fill="#c77b44"/><text x="${X(i)+(comparison?bw*.4:0)}" y="${Y(v)-10}" text-anchor="middle">${v}</text><text x="${X(i)}" y="${base+35}" text-anchor="middle">${labels[i]}</text>`).join('')}${mean!==null?`<path d="M${L} ${Y(mean)}H${W-R}" stroke="#176d82" stroke-dasharray="8 6" stroke-width="3"/><text x="${meanLabelLeft?L+12:W-R}" y="${Y(mean)-10}" text-anchor="${meanLabelLeft?'start':'end'}">平均 ${mean}</text>`:''}<path d="M${L} ${T}V${base}H${W-R}" fill="none" stroke="#657c85"/><text x="${W-R}" y="${H-8}" text-anchor="end">${ylabel}</text></g></svg>`;
 writeFileSync(resolve(here,`images/${name}.svg`),svg);return `![width:1060px](images/${name}.svg)`;
}
function dice(name,n){let p=[1];for(let j=0;j<n;j++){const next=Array(p.length+6).fill(0);p.forEach((v,k)=>{for(let d=1;d<=6;d++)next[k+d]+=v/6;});p=next;}const bins=Array(26).fill(0);p.forEach((v,sum)=>{if(v)bins[Math.min(25,Math.floor((sum/n-1)/.2+1e-9))]+=v;});
 const L=70,base=305,bw=940/26,Y=v=>base-v/.3*250;
 writeFileSync(resolve(here,`images/${name}.svg`),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1050 380"><g font-family="Arial,Hiragino Sans,sans-serif" font-size="23" fill="#294c5c"><text x="70" y="27">1標本は${n}回の出目。平均を1つ作る。</text>${[0,.1,.2,.3].map(v=>`<path d="M70 ${Y(v)}H1010" stroke="#dbe4e6"/><text x="58" y="${Y(v)+7}" text-anchor="end">${Math.round(v*100)}%</text>`).join('')}${bins.map((v,i)=>`<rect x="${L+i*bw+1}" y="${Y(v)}" width="${bw-2}" height="${base-Y(v)}" fill="#176d82"/>`).join('')}${[1,2,3,4,5,6].map(v=>n===1?dieFaceSvg(v,L+(v-1)/.2*bw+bw/2-12,325):`<text x="${L+(v-1)/.2*bw}" y="340" text-anchor="middle">${v}</text>`).join('')}<path d="M${L+12.5*bw} 45V${base}" stroke="#bd743f" stroke-dasharray="7 5"/><text x="${L+12.5*bw}" y="370" text-anchor="middle">3.5</text><text x="1010" y="370" text-anchor="end">標本平均</text></g></svg>`);return `![width:1060px](images/${name}.svg)`;}
const curry=[9,49,46,11,28],curryChart=bars('curry-scores',curry,['1試合目','2試合目','3試合目','4試合目','5試合目'],{max:60,mean:28.6,meanLabelLeft:true,title:'保存した5試合の得点。最新の成績ではない。'});
const curryRawChart=bars('curry-raw',curry,['1試合目','2試合目','3試合目','4試合目','5試合目'],{max:60,title:'保存した5試合：実際の得点。最新の成績ではない。'});
const tcurve=(name,df,extra={})=>fig(name,{min:-4,max:4,pdf:x=>M.tPdf(x,df),xlabel:'t',title:`t分布：自由度${df}`,yMax:.48,...extra});
const challengeReferences={
 'clt-challenge':[F.z.tex],
 'variance-challenge':[F.mean.tex,F.uv.tex],
 't-challenge':[F.mean.tex,F.uv.tex,F.t.tex,String.raw`\nu=n-1`],
 'table-challenge':[String.raw`\alpha=\frac{1-\text{中央の確率}}{2}`,String.raw`\Pr(-t_\alpha(\nu)<T<t_\alpha(\nu))=1-2\alpha`],
 'chi-challenge':[F.u.tex,String.raw`\nu=n\quad(\text{母平均・母分散が既知})`]
};
function challenge(id,title,body,book,official,ja,en,minutes=4){
 const refs=challengeReferences[id];if(!refs)throw Error(`Missing challenge formula reference: ${id}`);
 const reference=`<div class="challenge-formulas"><p>参考公式（文字のみ）<span class="en">Formula reference · substitute the given values yourself</span></p><div class="challenge-formula-list">${refs.map(tex=>`<div>\n\n${math(tex)}\n\n</div>`).join('')}</div></div>`;
 challengeNumber++;add(id,`チャレンジ${challengeNumber}　${title}`,`<p class="time">自分で解く　${minutes}分（最後の1分は隣と確認）</p>\n\n${body}\n\n${reference}`,{layout:'challenge',book,official,ja:ja+' 参考公式は文字のままです。与えられた値を自分で対応させ、代入して計算してもらいます。',en:en+' The reference formulas remain symbolic. Students must identify and substitute the given values themselves.'});
}
function worked(id,title,{given,key,sub,result,graphic,book,official,ja,en,link=''}){add(id,`答え合わせ${challengeNumber}　${title}`,`<div class="work-copy">\n\n${small('① 与えられた条件')}\n\n${given}\n\n${small('② 公式（文字のまま）')}\n\n${math(F[key].tex)}\n\n${small('③ 数値を代入')}\n\n${math(sub)}\n\n</div><div class="work-chart">\n\n${graphic}\n\n</div><p class="conclusion">④ ${result}</p>${link}`,{layout:'worked',book:book||F[key].page,official,formula:key,ja,en});}
const zComparison=stage=>zDistanceComparison(here,stage);
teach({add,section,topic,formula,photo,fig,bars,dice,tcurve,challenge,worked,math,big,small,go,tryLink,normalLink,tLink,names,term,ruby,M,F,curryChart,curryRawChart,zComparison,zPurposeGraphic,old,cltOld,here});
writeFileSync(resolve(here,'w6.md'),`---\nmarp: true\ntheme: default\nsize: 16:9\npaginate: true\nmath: katex\nfooter: '統計学B · Week 6'\n---\n\n<style>${style}\n${terminologyStyle}</style>\n\n${slides.map(annotateJapaneseTerms).join('\n\n---\n\n')}\n`);
writeFileSync(resolve(here,'w6.notes.json'),JSON.stringify({deck:'materials/2026-yoh/week06/w6.pdf',slides:notes},null,2)+'\n');
const official='materials/2026-tsumura/26_06_確率分布_連続確率分布_後半_v3.pdf';
writeFileSync(resolve(here,'source-map.json'),JSON.stringify({official,formulaRegistry:F,slides:mapping,decisions:['Rebuilt from original dice, Curry, Pearson and student-sampling narratives.','Core order matches official slides4–7,9–21,23.','Preserve textbook mu_x, sigma_x squared and hatted sigma_x squared; no s substitute.','Categorical student sampling motivates the topic; no additional goodness-of-fit formula or test.','Saved Curry values are historical examples, not current NBA claims.','Correct historical Curry sum142 to143.','No n30 rule or formal rejection decision for real NBA scores.','No AL homework cell answers.','Flow review: condensed repeated t lookups and categorical detour; retained all five guided challenges.','The worked t example uses Curry9/49/46/11/28; new fictional practice uses24/28/30/32/36 with the same benchmark27.4 and df4.','Score comparison precedes a fresh mean65 Z exercise.']},null,2)+'\n');
const range=ids=>{const pages=mapping.filter(s=>ids.includes(s.part)).map(s=>s.page);return `${Math.min(...pages)}–${Math.max(...pages)}`;};
const coverage=[['4–5',['die-population','sample-mean','one-sample']],['6–7',['dice-1','dice-4','dice-25','clt-meaning','exact-normal','clt-explore']],['9',['z-formula','unknown-variance','t-formula','t-conditions','t-challenge','t-answer']],['10–11',['df-example','uv-formula','variance-challenge','curry-deviations','curry-variance-answer']],['12–13',['t-shape']],['15–19',['table-comparison','t-central-example-3']],['20–21',['table-challenge','table-answer']],['23',['chi-definition','chi-notation','chi-shape','u-formula','chi-challenge','chi-answer','chi-decomposition','chi-decomposition-example','chi-moments']],['24',['summary']]].map(([official,ids])=>({official,ids,pages:ids.map(id=>{const s=mapping.find(s=>s.id===id);if(!s)throw Error(`Missing coverage: ${id}`);return s.page;})}));
writeFileSync(resolve(here,'audit.json'),JSON.stringify({rebuilt:true,slides:slides.length,sections:['clt','t','chi'].map(p=>({topic:p,pages:range([p])})),coverage,sourceExtraction:[{file:cltOld,used:'Dice and repeated sample means'},{file:old,used:'Curry9/49/46/11/28; benchmark27.4; Gosset; Pearson;60:40 and20-student samples'}],textbookVerification:{source:'Private chapter2 section2 scans, printed pp122–129',method:'Visual comparison of p123 Z, p125 T, p126 hatted variance, p128 decomposition',registry:F},corrections:['Historical Curry sum142 corrected to143.','No n30 cutoff or automatic rejection conclusion.','Student60:40 is fictional; no real students classified.','Known-mean squared sum df=n; residual term df=n-1.','Categorical motivation distinguished from exact normal squared sum.','t-table cells are boundary coordinates, not probabilities.'],pacing100Minutes:[{minutes:'0–28',pages:range(['opening','clt']),activity:'Video, dice means, CLT and Z challenge'},{minutes:'28–73',pages:range(['t']),activity:'Student, Curry, df, variance and t-table challenges'},{minutes:'73–97',pages:range(['chi']),activity:'Pearson,20-student story, squared sum and decomposition'},{minutes:'97–100',pages:range(['closing']),activity:'Summary and independent AL'}],optional:['Research another player’s scores after class.','Anonymous height data instead of dice.','Repeated board runs.','Proof of the decomposition; identify pieces without proving.'],dataPolicy:'Fictional or anonymous numeric input in browser memory only. No upload, persistence or real students classified by gender.'},null,2)+'\n');
console.log(`${slides.length} slides. ${['clt','t','chi'].map(p=>`${p} ${range([p])}`).join('; ')}. Challenges ${mapping.filter(s=>s.layout==='challenge').map(s=>s.page).join(', ')}.`);
