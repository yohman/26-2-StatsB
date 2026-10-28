const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const M=require('../assets/week5-math.js');
const near=(a,b,e=1e-6)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
const integrate=(f,a,b,n=10000)=>{let s=0;const dx=(b-a)/n;for(let i=0;i<n;i++)s+=f(a+(i+.5)*dx)*dx;return s;};
near(M.upper(0),.5);near(M.upper(1.96),.025,3e-6);near(M.upper(2),.0227501);
near(M.normalCdf(-1.96),M.upper(1.96));near(M.normalCdf(1)+M.normalCdf(-1),1);
near(integrate(x=>M.normalPdf(x),-8,8),1);
near(integrate(()=>1/20,5,10),.25);near(integrate(x=>2*x/400,0,20),1);
near(M.triangularCdf(10,20),.25);near(M.triangularCdf(-1,20),0);near(M.triangularCdf(21,20),1);
const mom=M.uniformMoments(12);assert.equal(mom.mean,6);assert.equal(mom.variance,12);
near(integrate(x=>x/12,0,12),mom.mean);near(integrate(x=>(x-6)**2/12,0,12),mom.variance);
for(const n of [4,16,64])near(M.midpointAreas(n).total,1-1/(4*n*n),1e-12);
assert.deepEqual(M.midpointAreas(4).rectangles.map(r=>r.area),[.01171875,.10546875,.29296875,.57421875]);
assert(M.midpointAreas(4).total<M.midpointAreas(16).total);
assert(M.midpointAreas(16).total<M.midpointAreas(64).total);
near(integrate(x=>3*x*x/8000,0,20),1,1e-8);
near(integrate(x=>.5*x*x,0,4),.5*integrate(x=>x*x,0,4),1e-10);
const scaling=M.chart({min:0,max:4,pdf:x=>.5*x*x,lo:0,hi:4,yMax:20,comparisonCurves:[{fn:x=>x*x}],markers:[{x:4,y:8}]});
assert(!scaling.includes('NaN'));
assert(scaling.includes('stroke-dasharray="7 5"'));
assert(scaling.includes('cx="676" cy="174.8"'),'At x=4, half of 16 is 8 on the shared 0–20 vertical scale');
for(let z=0;z<3.09;z+=.01){assert.ok(M.upper(z)>0);assert.ok(M.upper(z)<=.5);}
const cfg={min:-4,max:4,pdf:x=>M.normalPdf(x),lo:1.96,hi:4};
const a=M.chart(cfg),b=M.chart({...cfg,samples:[1,1,1,2]});
assert.ok(!a.includes('NaN'));assert.ok(!b.includes('NaN'));
const curve=s=>s.match(/<path d="([^"]+)" fill="none" stroke="#176d82"/)[1];
assert.equal(curve(a),curve(b),'observations must not move or rescale the model');
const root=path.resolve(__dirname,'..');
const deck=fs.readFileSync(path.join(root,'materials/2026-yoh/week05/w5.md'),'utf8');
const sourceMap=JSON.parse(fs.readFileSync(path.join(root,'materials/2026-yoh/week05/source-map.json')));
const slideCount=sourceMap.slides.length;
const slideBodies=deck.split(/\n\n---\n\n/);
assert.equal(slideBodies.length,slideCount);
assert.equal(slideCount,60);
const bodyFor=title=>{
  const item=sourceMap.slides.find(s=>s.title===title);
  assert(item,`Missing slide: ${title}`);
  return slideBodies[item.slide-1];
};
const challenges=sourceMap.slides.filter(s=>s.layout==='challenge');
assert.equal(challenges.length,8);
assert.deepEqual(challenges.map(s=>s.slide),[34,36,44,47,50,53,55,57]);
for(const item of challenges){
  assert.equal(item.practiceFocus,'z-scores-and-table');
  assert(sourceMap.slides[item.slide].practiceAnswer,'Every challenge is followed by its protected worked answer');
}
assert(!challenges.some(s=>/ラーメン|積分|一様/.test(s.title)));
const finalHint=bodyFor('チャレンジ⑦　70点以上は、何％？').replace(/<rt>[^<]*<\/rt>/g,'').replace(/<[^>]*>/g,'');
assert(finalHint.includes('1つ目は平均、2つ目は分散。標準偏差は分散の平方根。'));
assert(!finalHint.includes('2.275'),'The hint must not reveal the answer');
const personal=bodyFor('チャレンジ②　自分の身長を、zに直そう');
for(const value of ['168.4cm','5.2cm','154.9cm','5.1cm','6,041','7,171','2024','20歳以上','全国補正値','001742496.pdf'])assert(personal.includes(value));
assert(!personal.includes('1.653846'),'Keep the personal-height answer on its protected answer slide');
assert(!/20〜29|170\.3|157\.6|2023|001435374/.test(personal),'Do not retain the old young-adult reference');
const yoh=bodyFor('答え合わせ② · Yohの177cmを、全国の成人男性と比べる');
assert(yoh.includes('\\frac{177-168.4}{5.2}'));
assert(yoh.includes('1.653846'));
near((177-168.4)/5.2,1.653846153846,1e-10);
const heightChart=fs.readFileSync(path.join(root,'materials/2026-yoh/week05/images/practice-personal-height.svg'),'utf8');
for(const label of ['男性20歳以上','2024','168.4','Yoh 177cm','はz=1.65','1σ = 5.2cm','実測分布ではない'])assert(heightChart.includes(label));
for(const title of ['答え合わせ① · 標準偏差を出してから、標準化','答え合わせ② · Yohの177cmを、全国の成人男性と比べる'])assert(sourceMap.slides.find(s=>s.title===title).layout.includes('graph-led'));
for(const item of sourceMap.slides.filter(s=>s.practiceAnswer)){
  const body=slideBodies[item.slide-1];
  for(const label of ['① 与えられた条件','② 公式','③ 代入','④ 答え'])assert(body.includes(label));
  assert(body.includes('!['),'Every solution has an explanatory chart');
}
const formulas=sourceMap.slides.filter(s=>s.layout.includes('hero-math'));
assert.equal(formulas.length,4);
for(const item of sourceMap.slides.slice(20,24)){
  assert(slideBodies[item.slide-1].includes('ロボット'),'Slides 21–24 retain the concrete robot example');
  assert(slideBodies[item.slide-1].includes('実測データではありません'),'Classroom assumptions remain explicit');
  assert(slideBodies[item.slide-1].includes('!['),'Each example has its own explanatory chart');
}
for(const item of sourceMap.slides){
  const body=slideBodies[item.slide-1];
  if(item.tableLookup){
    assert(body.includes('normal-upper-tail-table.html'));
    assert(body.includes('target="_blank"'));
  }
  if(/\$/.test(body)){
    assert(item.formulaRef?.pages,`Missing textbook page on ${item.title}`);
    assert(body.includes('class="formula-ref"'));
    assert(body.replace(/<rt>[^<]*<\/rt>/g,'').replace(/<[^>]*>/g,'').includes(item.formulaRef.label));
  }
}
for(const item of formulas){
  const body=slideBodies[item.slide-1].replace(/<!--[\s\S]*?-->/g,'').replace(/<aside class="(?:stat-terms|formula-ref)"[\s\S]*?<\/aside>/g,'').trim();
  assert.equal((body.match(/\$\$/g)||[]).length,2);
  assert(!body.includes('\\begin{aligned}'));
  assert(!body.includes('!['));
  assert.match(body,/\$\$\s*$/);
}
assert.equal(sourceMap.slides.find(s=>s.title==='正規分布の密度').formulaRef.pages,'122');
const zSource=sourceMap.slides.find(s=>s.title==='標準化の公式').formulaRef;
assert.equal(zSource.pages,'123');
assert.equal(zSource.relation,'application','Do not present the individual-value application as a verbatim sample-mean formula');
assert(bodyFor('標準化の公式').includes('津村18'));
const centered=bodyFor('標準化すると、分布の平均は0');
assert(centered.includes('E(Z)=0'));
assert(centered.includes('\\frac{\\mu-\\mu}{\\sigma}=0'));
assert(centered.includes('standardized-mean-zero'));
assert(!/Q\(|cx\^2|8000|rectangle-midpoint|\\operatorname\{erf\}|\\bar X/.test(deck),'No extra notation, density-fitting or sample-mean detour');
assert(!deck.includes('\\frac1{20}'));
assert(!deck.includes('\\frac1{12}'));
assert(bodyFor('分散と標準偏差を、取り違えない').includes('\\sqrt{36}=6'));
assert(bodyFor('答え合わせ① · 標準偏差を出してから、標準化').includes('\\frac{146-160}{7}=-2'));
assert(bodyFor('答え合わせ③ · 1.2の行、0.08の列').includes('0.10027'));
assert(bodyFor('答え合わせ④ · 左右対称を使う').includes('0.20045'));
assert(bodyFor('答え合わせ⑤ · 全体1から、右の尾を引く').includes('0.91149'));
assert(bodyFor('答え合わせ⑥ · 異なる二つの尾を引く').includes('0.62465'));
assert(bodyFor('答え合わせ⑦ · 元の点数から、上側確率へ').includes('2.275'));
const exam=bodyFor('チャレンジ⑧　期末試験形式：S評価は何点から？');
for(const value of ['N(55,10^2)','70点以上','上位5％','1.65','8分'])assert(exam.includes(value));
assert(!/6\.681|71\.5|72点/.test(exam),'The exam question must not reveal either answer');
assert.equal(sourceMap.slides[56].examSource.question,'問4(1)(2)');
assert(bodyFor('答え合わせ⑧ (1) · 70点以上の割合').includes('0.06681=6.681'));
assert(bodyFor('答え合わせ⑧ (2) · 上位5％の境界を、点数に戻す').includes('72点以上'));
near(M.upper(1.5),.06681,5e-6);
near(55+1.65*10,71.5);
near(M.upper(1.28),.10027,5e-6);
near(M.upper(.84),.20045,5e-6);
near(1-M.upper(1.35),.91149,5e-6);
near(1-M.upper(.5)-M.upper(1.5),.62465,1e-5);
for(const title of ['待ち時間なら、こんな形も考えられる','全体の面積は、1＝100％','区間の確率は、その部分の面積']){
  assert(bodyFor(title).includes('王道家の実測データではありません'));
  assert(bodyFor(title).includes('!['));
}
for(const [title,image] of [['ラーメン店の行列','ramen-queue-history-supplied.png'],['なんでんかんでんのラーメン','nandenkanden-ramen-supplied.png'],['王道家、この行列、何分待つ？','oudouya-kashiwa-night-supplied.png'],['王道家のラーメンとご飯','oudouya-ramen-rice-supplied.png']])
  assert(bodyFor(title).includes(`images/${image}`));
['paris100-video.jpg','paris100-finish.jpg','paris100-omega-scan.jpg','omega-stopwatch.png'].forEach((name,i)=>assert(slideBodies[i].includes(`images/${name}`)));
assert(bodyFor('標準偏差が小さいと、狭い山').includes('story-normal-narrow'));
assert(bodyFor('標準偏差が大きいと、広い山').includes('story-normal-wide'));
const pageFor=title=>sourceMap.slides.find(s=>s.title===title).slide;
assert(!sourceMap.slides.some(s=>['分散','期待値：たくさんのロボットの平均身長','ロボット工場：中心と、ばらつきを知りたい'].includes(s.title)),'Remove the redundant moments section');
assert(pageFor('正規分布の密度')<pageFor('標準化の公式'));
assert.equal(sourceMap.slides.at(-1).title,'ここからは、ALに自分で取り組もう。');
assert(sourceMap.slides.at(-1).sourceBeats.includes(143));
for(const key of ['normal','table'])assert(deck.includes(`activity=w5-${key}`));
assert(sourceMap.curriculum.some(s=>s.tsumura==='20–26'));
assert(!deck.includes('Yohの2025'));
assert(!/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(deck));
assert(sourceMap.decisions.some(d=>/Chi-square/.test(d.defer||'')));
const week=fs.readFileSync(path.join(root,'content/weeks/05-normal.md'),'utf8');
assert.match(week,/week05\/w5.pdf\) \{primary\}/);assert.match(week,/前半v6.pdf\) \{supplementary\}/);
assert.match(week,/date: 2026-10-28/);
assert(!week.includes('{yoh}'),'The three archived Yoh decks are not listed in Week 5');
const viewer=fs.readFileSync(path.join(root,'viewer.html'),'utf8');
assert.ok(viewer.includes("file === 'materials/2026-yoh/week05/normal-upper-tail-table.html'"));
assert.ok(viewer.includes("frame.sandbox = ''"),'Table preview must remain script-free');
console.log('Week 5: density/CDF/moments/normal-table mathematics, fixed model scale, scope, and links passed.');
(async()=>{
  const pdfjs=require('../assets/vendor/pdfjs/pdf.min.js');
  pdfjs.GlobalWorkerOptions.workerSrc=path.join(root,'assets/vendor/pdfjs/pdf.worker.min.js');
  const pdf=await pdfjs.getDocument({data:new Uint8Array(fs.readFileSync(path.join(root,'materials/2026-yoh/week05/w5.pdf')))}).promise;
  const {isChallengeText}=require('../assets/slide-challenge-guard.js');
  const challenges=[],destinations=[];
  assert.equal(pdf.numPages,slideCount);
  for(let i=1;i<=pdf.numPages;i++){
    const page=await pdf.getPage(i),text=(await page.getTextContent()).items.map(x=>x.str).join('');
    if(isChallengeText(text))challenges.push(i);
    assert.ok(!text.includes('$F('));assert.ok(!text.includes('**'));
    const annotations=await page.getAnnotations();
    if(sourceMap.slides[i-1].tableLookup)assert(annotations.some(a=>a.url?.includes('normal-upper-tail-table.html')),`Table link must be clickable on page ${i}`);
    for(const a of annotations)if(a.url)destinations.push(a.url);
  }
  assert.deepEqual(challenges,sourceMap.slides.filter(s=>s.layout==='challenge').map(s=>s.slide));
  for(const key of ['normal','table'])assert.ok(destinations.some(d=>d.includes(`activity=w5-${key}`)));
  assert.ok(destinations.some(d=>d.includes('normal-upper-tail-table.html')));
  assert.ok(destinations.includes('https://www.youtube.com/watch?v=GHw-eTs4Yes'));
  assert.ok(destinations.includes('https://www.hodinkee.com/articles/olympics-2024-mens-100m-photo-finish'));
  assert.ok(destinations.some(d=>d.includes('activity=w5-stopwatch')));
  await pdf.destroy();
  console.log(`Final PDF: ${slideCount} individual story beats; ${formulas.length} isolated formulas; answer guards on ${challenges.join(', ')}; focused exploration links, formula references and table links verified.`);
})().catch(error=>{console.error(error);process.exitCode=1;});
