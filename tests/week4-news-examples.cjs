const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
(async()=>{
  const {newsExamples}=await import(pathToFileURL(path.resolve('materials/2026-yoh/week04/news-examples.mjs')));
  assert.equal(newsExamples.length,3);
  const choose=(n,k)=>{let c=1;for(let j=1;j<=k;j++)c=c*(n-j+1)/j;return c;};
  const pdfjs=require('../assets/vendor/pdfjs/pdf.min.js');
  pdfjs.GlobalWorkerOptions.workerSrc=path.resolve('assets/vendor/pdfjs/pdf.worker.min.js');
  for(const e of newsExamples){
    const answer=e.atLeast===1?1-(1-e.p)**e.n:choose(e.n,e.x)*e.p**e.x*(1-e.p)**(e.n-e.x);
    assert(Math.abs(answer-e.answer)<1e-12,e.id);
    const base=`materials/2026-yoh/week04/news-${e.id}`;
    const md=fs.readFileSync(base+'.md','utf8');
    const slides=md.split(/\n---\n/).filter(s=>/^## /m.test(s));
    assert.equal(slides.length,4);
    for(const token of ['記事を読む','元データ',e.article,e.primary,`images/${e.thumbnail}`])assert(slides[0].includes(token));
    assert(slides[1].includes('授業用の仮定'));
    assert(slides[2].includes(e.formula));
    assert(slides[2].includes(e.substitution));
    assert(slides[3].includes(e.calculation));
    const pdf=await pdfjs.getDocument({data:new Uint8Array(fs.readFileSync(base+'.pdf'))}).promise;
    assert.equal(pdf.numPages,4);
    for(let i=1;i<=4;i++){
      const page=await pdf.getPage(i),text=(await page.getTextContent()).items.map(t=>t.str).join('');
      assert(!text.includes('katex-error'));
      if(i===4)assert(text.includes((e.answer*100).toFixed(e.id==='ai-news-errors'?1:2)),e.id+' answer text');
    }
    const links=(await(await pdf.getPage(1)).getAnnotations()).filter(a=>a.subtype==='Link').map(a=>a.url);
    assert(links.includes(e.article));assert(links.includes(e.primary));
    await pdf.destroy();
    assert(fs.statSync(`assets/slide-previews/week04-news-${e.id}.png`).size>1000);
  }
  const context=vm.createContext({URLSearchParams});
  vm.runInContext(fs.readFileSync('assets/stats-site.js','utf8').replace(/setupLanguage\(\);\s*setupMenu\(\);\s*loadAgenda\(\);\s*$/,''),context);
  context.md=fs.readFileSync('content/weeks/04-al-discrete.md','utf8');
  const markup=vm.runInContext('lectureSection(parseWeek(md,"test"))',context);
  assert(markup.includes('ニュース例題の候補 · 各4枚'));
  for(const e of newsExamples)assert(markup.includes(`news-${e.id}.pdf`));
  assert(markup.includes('Yoh&#39;s Week 4 lecture'));
  console.log('Three four-slide news decks: arithmetic, source links, assumptions, PDF answers, thumbnails and Week 4 placement verified.');
})().catch(error=>{console.error(error);process.exitCode=1;});
