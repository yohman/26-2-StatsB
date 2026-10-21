// Editable result charts for Week 4 exercises, generated from their model parameters.
const choose=(n,k)=>{let c=1;for(let j=1;j<=k;j++)c=c*(n-j+1)/j;return c;};
const bin=(n,p,x)=>choose(n,x)*p**x*(1-p)**(n-x);
const pois=(l,x)=>{let p=Math.exp(-l);for(let j=1;j<=x;j++)p*=l/j;return p;};
export const answerVisualStyle=`<style>
section.answer-visual{padding:36px 62px 66px;background:#fbfaf6}
section.answer-visual h2{font-size:37px;margin-bottom:12px}
.answer-visual-summary{font-size:25px;font-weight:700;color:#215d45;margin:10px 0}
.answer-visual-legend{font-size:20px;margin:8px 0;color:#40555f}
.answer-visual-legend b{color:#176d82}.answer-visual-legend strong{color:#a57020}
.answer-visual-chart{display:block;width:100%;height:325px}
section.answer-visual .note{font-size:18px;margin-top:10px}
.answer-models{font-size:24px;width:100%;margin-top:30px}
.answer-models th,.answer-models td{padding:18px 22px;border-bottom:2px solid #d9e1e3}
.answer-models td:last-child{color:#176d82;font-weight:700}
</style>`;
const clean=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const percent=q=>q>0&&q*100<.005?'&lt;0.01%':`${(q*100).toFixed(q<.001?2:1)}%`;
export function distributionVisual({title,n,p,lambda,cutoff,select=()=>false,second=()=>false,legend='青：求めた結果　灰：それ以外',summary='',unit='個',note='',moments=false,labelZero=false}){
 const poisson=lambda!==undefined, mean=poisson?lambda:n*p, variance=poisson?lambda:n*p*(1-p);
 const max=cutoff??(poisson?Math.ceil(mean+4*Math.sqrt(mean))+1:n);
 const masses=Array.from({length:max+1},(_,x)=>poisson?pois(lambda,x):bin(n,p,x));
 const hasTail=poisson||max<n;
 if(hasTail)masses.push(Math.max(0,1-masses.reduce((a,b)=>a+b,0)));
 const ymax=Math.ceil(Math.max(...masses)*10)/10, left=95,right=1080,bottom=246,height=190,step=(right-left)/masses.length;
 const labels=masses.map((_,x)=>hasTail&&x===masses.length-1?`${x}+`:String(x));
 const bars=masses.map((q,x)=>{
  const cx=left+step*(x+.5),h=q/ymax*height,color=select(x)?'#176d82':second(x)?'#be8530':'#bdcbd0';
  return `<rect data-count="${labels[x]}" data-probability="${q}" x="${cx-step*.34}" y="${bottom-h}" width="${step*.68}" height="${h}" fill="${color}"/>${masses.length<=10||select(x)||(labelZero&&x===0)?`<text x="${cx}" y="${bottom-h-10}" text-anchor="middle" fill="${color==='#bdcbd0'?'#40555f':color}" font-size="19">${percent(q)}</text>`:''}<text x="${cx}" y="275" text-anchor="middle" font-size="18">${labelZero&&x===0?'0日':labels[x]}</text>`;
 }).join('');
 const mx=left+step*(mean+.5);
 const marker=moments&&mean<=max?`<path d="M${mx} 42V250" stroke="#9b5146" stroke-width="3" stroke-dasharray="7 5"/><text x="${mx}" y="26" text-anchor="middle" fill="#9b5146" font-size="21">平均 ${Number(mean.toFixed(6))}${unit}</text>`:'';
 const svg=`<svg class="answer-visual-chart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1120 325" role="img" aria-label="${clean(title)}"><g font-family="Hiragino Sans,Noto Sans JP,sans-serif" fill="#40555f">${Array.from({length:5},(_,i)=>{const y=bottom-height*i/4;return `<path d="M${left} ${y}H${right}" stroke="#d9e1e3"/><text x="80" y="${y+6}" text-anchor="end" font-size="18">${Number((ymax*100*i/4).toFixed(1))}%</text>`;}).join('')}${bars}${marker}<path d="M${left} ${bottom}H${right}" stroke="#71848e"/><text x="1080" y="314" text-anchor="end" font-size="20">X（${unit}）${hasTail?'　末尾はまとめた確率':''}</text></g></svg>`;
 const momentNote=moments?`平均は赤い破線。分散 ${Number(variance.toFixed(8))}${unit}² は、この平均からの距離の2乗を確率で重みづけした値。`:'';
 const visibleLegend=moments&&!masses.some((_,x)=>select(x)||second(x))?'灰：各結果の確率　赤い破線：期待値':legend;
 return `<!-- _class: answer-visual -->\n\n## ${title}\n\n<div class="answer-visual-summary">${summary}</div>\n\n<div class="answer-visual-legend">${visibleLegend}</div>\n\n${svg}\n\n<div class="note">${momentNote} ${note}</div>`;
}
export function newsAnswerVisual(e,moments=false,poisson=false){
 const base={title:moments?'図で確認　平均と、結果のばらつき':'図で確認　答えに含める棒',n:e.n,p:e.p,lambda:poisson?e.lambda:undefined,unit:e.id==='poisson-bears'?'日':e.id==='ai-news-errors'?'件':e.id==='poisson-cyber'?'個':'人',moments,labelZero:e.id==='poisson-bears'&&!moments,...(e.id==='poisson-bears'&&!moments?{legend:'灰：0日（100日間、一度もクマが現れない）　青：1日以上'}:{})};
 if(moments)return distributionVisual({...base,summary:`期待値 ${Number((poisson?e.lambda:e.n*e.p).toFixed(6))}${base.unit}。分散 ${Number((poisson?e.lambda:e.n*e.p*(1-e.p)).toFixed(8))}${base.unit}²。`,legend:'灰：各結果の確率　赤い破線：期待値',note:'一番高い棒と、期待値の位置は同じとは限らない。'});
 const threshold=poisson?(e.id==='poisson-bears'?1:3):e.atLeast;
 return distributionVisual({...base,select:x=>threshold!==undefined?x>=threshold:x===e.x,summary:poisson?`求めた確率：約${(100*e.answer).toFixed(1)}％（配布表の値で計算）`:`求めた確率：約${(100*e.answer).toFixed(2)}％`,note:poisson?'棒はポアソンモデルの丸め前の確率。解答は配布表の小数第3位を使うため、丸めの差がある。':e.assumption});
}
export function attachLectureVisuals(slides){
 const specs=[
  ['答えは7.29％', {n:5,p:.1,select:x=>x===2,summary:'ちょうど2人：7.29％。青い1本だけを読む。',unit:'人'}],
  ['期待値は、確率ではなく個数',{n:5,p:.1,moments:true,summary:'期待値0.5人、分散0.45人²。',unit:'人'}],
  ['2回と3回の確率を足す',{n:5,p:.4,select:x=>x===2,second:x=>x===3,legend:'青：2回 34.56％　＋　黄：3回 23.04％',summary:'2〜3回成功：57.6％。',unit:'回'}],
  ['遅れるのは、全台成功の反対',{n:7,p:.8,select:x=>x===5,second:x=>x<7&&x!==5,moments:true,legend:'青：ちょうど5台　青＋黄：6台以下＝少なくとも1台遅れる',summary:'ちょうど5台：27.53％。1台以上遅れる：79.03％。',unit:'台'}],
  ['期待個数と当選確率を分ける',{n:80,p:.01,cutoff:5,select:x=>x>=1,moments:true,summary:'1個以上：55.25％。平均0.8個、分散0.792個²。'}],
  ['1個以下は、0個と1個',{lambda:5,select:x=>x<=1,moments:true,summary:'0個と1個を足して約4.1％。平均5個、近似分散5個²。',note:'解答は配布表の丸め値。棒は丸め前のモデル。'}],
  ['ワークシートの4列は、式の4部分',{n:5,p:.32,select:x=>x===3,summary:'H×I×Jで得た0.151519232は、青い3本安打の棒の高さ。',unit:'本'}],
  ['最頻値と、長い目で見た平均',{n:5,p:.32,select:x=>x===1,moments:true,summary:'最多は1本。期待値は1.6本。異なる意味を持つ2つの値。',unit:'本'}],
  ['AL 02　1個以上は、0個の反対',{n:100,p:.0005,cutoff:3,select:x=>x>=1,summary:'灰の0個は95.12％。青の1個以上を全部足して4.88％。'}],
  ['AL 02　「期待値0.05個」の意味',{n:100,p:.0005,cutoff:3,moments:true,summary:'平均0.05個、分散0.049975個²。ほとんどの100回セットは0個。'}],
  ['AL 03　平均個数が、ポアソンの母数',{lambda:7,moments:true,summary:'平均7個。近似の分散7個²。便ごとの不良品数は変わる。'}],
  ['AL 03　なぜ分散も7でよい？',{lambda:7,moments:true,summary:'二項の分散6.986個²、ポアソン近似7個²。',note:'棒はポアソン近似。平均はどちらも7個。分散の差は0.014個²。'}]
 ];
 const output=[];
 for(const s of slides){output.push(s);const title=s.match(/^## (.+)$/m)?.[1];
  if(title?.includes('何が固定されているか'))output.push(`<!-- _class: answer-visual -->\n\n## 図で確認　条件からモデルを選ぶ\n\n<table class="answer-models"><tr><th>場面</th><th>確認する条件</th><th>答え</th></tr><tr><td>A シュート</td><td>5回・独立・成功率一定</td><td>二項分布</td></tr><tr><td>B 不良品</td><td>多数・低い不良率・近似の指定</td><td>ポアソン近似 λ＝nπ＝5</td></tr><tr><td>C 天井つきガチャ</td><td>外れるほど成功率が上がる</td><td>通常の二項は使えない</td></tr></table>\n\n<div class="note">「独立」「一定」を確認してから、式を選ぶ。</div>`);
  else {const spec=specs.find(([key])=>title?.includes(key));if(spec)output.push(distributionVisual({title:`図で確認　${title.replace(/^答え合わせ[①-⑳]?　/,'')}`,...spec[1]}));}
 }
 return output;
}
