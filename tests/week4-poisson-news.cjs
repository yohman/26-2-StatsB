const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {pathToFileURL}=require('node:url');
(async()=>{
 const {poissonExamples}=await import(pathToFileURL(path.resolve('materials/2026-yoh/week04/poisson-news-examples.mjs')));
 const pdfjs=require('../assets/vendor/pdfjs/pdf.min.js');
 pdfjs.GlobalWorkerOptions.workerSrc=path.resolve('assets/vendor/pdfjs/pdf.worker.min.js');
 const {isChallengeText}=require('../assets/slide-challenge-guard.js');
 for(const e of poissonExamples){
  assert.equal(e.n?e.n*e.p:e.rate*e.time,e.lambda);
  const base=`materials/2026-yoh/week04/news-${e.id}`;
  const md=fs.readFileSync(base+'.md','utf8');
  if(e.id==='poisson-bears'){
   assert.equal(e.n,100);assert.equal(e.p,.02);
   assert(!md.includes('\\lambda=rt')&&!md.includes('n=2000'));
   assert(md.includes('100\\times0.02=2')&&md.includes('授業用の仮定'));
  }
  const slides=md.split(/\n---\n/).filter(s=>/^## /m.test(s));
  assert.equal(slides.length,8);
  assert(slides[4].includes('<svg')&&slides[7].includes('<svg'));
  assert(Math.abs(1-e.cells.reduce((a,b)=>a+b,0)-e.answer)<1e-10);
  for(const token of [e.article,e.primary,e.assumption,e.caution,'教科書 p.120','分布表を開く'])assert(md.includes(token));
  const pdf=await pdfjs.getDocument({data:new Uint8Array(fs.readFileSync(base+'.pdf'))}).promise;
  assert.equal(pdf.numPages,8);
  const text=async n=>(await(await pdf.getPage(n)).getTextContent()).items.map(t=>t.str).join('');
  assert(isChallengeText(await text(3)),e.id+' must guard the answer');
  assert(isChallengeText(await text(6)),e.id+' must guard the moments answer');
  for(const label of ['① 与えられた条件','② 公式（文字のまま）','③ 数値を代入・計算','④ 答え・意味'])assert(md.includes(label));
  assert((await text(4)).includes((100*e.answer).toFixed(1)));
  const links=(await(await pdf.getPage(4)).getAnnotations()).filter(a=>a.subtype==='Link').map(a=>a.url);
  assert(links.some(u=>u.includes('viewer.html?')&&u.includes('week=W04')));
  await pdf.destroy();
  assert(fs.statSync(`assets/slide-previews/week04-news-${e.id}.png`).size>1000);
 }
 const context=vm.createContext({URLSearchParams});
 vm.runInContext(fs.readFileSync('assets/stats-site.js','utf8').replace(/setupLanguage\(\);\s*setupMenu\(\);\s*loadAgenda\(\);\s*$/,''),context);
 context.md=fs.readFileSync('content/weeks/04-al-discrete.md','utf8');
 const markup=vm.runInContext('lectureSection(parseWeek(md,"test"))',context);
 assert(markup.includes('id="week-4-news-binomial-tab"'));
 assert(markup.includes('id="week-4-news-poisson-tab"'));
 assert(markup.includes('aria-labelledby="week-4-news-poisson-tab" hidden'));
 assert(markup.includes('Poisson exercises')&&markup.includes('ポアソン分布の演習'));
 for(const e of poissonExamples)assert(markup.includes(`news-${e.id}.pdf`));
 console.log('Poisson arithmetic, rate-times-time means, eight-page visual-answer PDFs, answer guards and bilingual exercise tabs verified.');
})().catch(e=>{console.error(e);process.exitCode=1});
