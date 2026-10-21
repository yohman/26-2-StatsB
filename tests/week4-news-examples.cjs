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
  const {isChallengeText}=require('../assets/slide-challenge-guard.js');
  pdfjs.GlobalWorkerOptions.workerSrc=path.resolve('assets/vendor/pdfjs/pdf.worker.min.js');
  for(const e of newsExamples){
    const answer=e.atLeast===1?1-(1-e.p)**e.n:choose(e.n,e.x)*e.p**e.x*(1-e.p)**(e.n-e.x);
    assert(Math.abs(answer-e.answer)<1e-12,e.id);
    const base=`materials/2026-yoh/week04/news-${e.id}`;
    const md=fs.readFileSync(base+'.md','utf8');
    const slides=md.split(/\n---\n/).filter(s=>/^## /m.test(s));
    assert.equal(slides.length,8);
    assert(slides[4].includes('<svg')&&slides[7].includes('<svg'));
    for(const token of ['記事を読む','元データ',e.article,e.primary,`images/${e.thumbnail}`])assert(slides[0].includes(token));
    assert(slides[1].includes('授業用の仮定'));
    assert(slides[2].includes(e.formula));
    if(e.id==='ai-companions')assert(!slides[2].includes(e.substitution)&&slides[2].includes('ヒント'));
    else assert(slides[2].includes(e.substitution));
    assert(slides[3].includes(e.calculation));
    const pdf=await pdfjs.getDocument({data:new Uint8Array(fs.readFileSync(base+'.pdf'))}).promise;
    assert.equal(pdf.numPages,8);
    if(e.id==='ai-companions'){
      const tail=Array.from({length:e.n-e.x+1},(_,i)=>choose(e.n,i+e.x)*e.p**(i+e.x)*(1-e.p)**(e.n-i-e.x)).reduce((a,b)=>a+b,0);
      assert.equal(e.n,6);
      assert.equal(e.p,0.75);
      assert(Math.abs(tail-e.tailAnswer)<1e-12);
      assert(slides[1].includes('6人のクラス')&&slides[1].includes('選択授業'));
      assert(slides[1].includes('\\Pr(X\\ge5)'));
      assert(slides[1].includes('実測値は72％')&&slides[1].includes('調査結果ではない'));
      assert(slides[2].includes('自分で公式に代入'));
      assert(slides[3].includes('1458')&&slides[3].includes('729')&&slides[3].includes('2187'));
      assert.equal((slides[4].match(/data-count=/g)||[]).length,7);
      for(let x=0;x<=6;x++)assert(slides[4].includes(`data-count="${x}"`));
      assert(!md.includes('30人')&&!md.includes('41.80')&&!md.includes('68.68'));
      const chartText=(await(await pdf.getPage(5)).getTextContent()).items.map(t=>t.str).join('');
      for(const percentage of ['35.60','53.39','17.80'])assert(chartText.includes(percentage));
      const probabilityText=(await(await pdf.getPage(3)).getTextContent()).items.map(t=>t.str).join('');
      assert(isChallengeText(probabilityText));
    }
    const challengeText=(await(await pdf.getPage(6)).getTextContent()).items.map(t=>t.str).join('');
    assert(isChallengeText(challengeText),e.id+' moments answer must be guarded');
    for(const label of ['① 与えられた条件','② 公式（文字のまま）','③ 数値を代入・計算','④ 答え・意味'])assert(slides[6].includes(label));
    assert(slides[5].includes('期待値と分散'));
    assert(slides[6].includes(Number((e.n*e.p*(1-e.p)).toFixed(8)).toString()));
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
  assert(markup.includes('任意のシナリオ'));
  for(const e of newsExamples)assert.equal(markup.includes(`news-${e.id}.pdf`),e.id!=='ai-companions');
  assert(markup.includes('Yoh&#39;s Week 4 lecture'));
  console.log('News decks: probability and moments, source links, assumptions, answer guards and Week 4 placement verified.');
})().catch(error=>{console.error(error);process.exitCode=1;});
