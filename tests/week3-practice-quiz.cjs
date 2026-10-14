const assert=require('node:assert/strict');
const fs=require('node:fs');
const {choose,binomial,poisson}=require('../assets/exam-practice.js');
const {isChallengeText}=require('../assets/slide-challenge-guard.js');
const slides=fs.readFileSync('materials/2026-yoh/week03/practice-quiz.md','utf8').split(/\n---\n/).filter(s=>/^## /m.test(s));
assert.equal(slides.length,7);
assert.deepEqual(slides.flatMap((s,i)=>isChallengeText(s.replace(/<!--[\s\S]*?-->/g,'').replace(/^## /m,''))?[i+1]:[]),[2,4,6]);
assert.equal(choose(8,3),56);
assert.equal(choose(8,3)-choose(6,3),36);
assert.equal(choose(6,1),6);
assert(Math.abs(binomial(8,.75,6)-.31146240234375)<1e-12);
assert(Math.abs(binomial(8,.75,7)+binomial(8,.75,8)-.3670806884765625)<1e-12);
assert.equal(8*.75*.25,1.5);
assert(Math.abs(poisson(3,2)-.22404180765538775)<1e-12);
assert(Math.abs(1-(.050+.149+.224)-.577)<1e-12);
assert(slides[5].includes(String.raw`$\lambda$`));
assert(slides[6].includes(String.raw`\Pr(X=x)`));
assert(!/2\.71828/.test(slides[6]));
assert(fs.readFileSync('content/weeks/03-poisson.md','utf8').includes('practice-quiz.pdf'));
(async()=>{
  const pdfjs=require('../assets/vendor/pdfjs/pdf.min.js');
  pdfjs.GlobalWorkerOptions.workerSrc=require('node:path').resolve('assets/vendor/pdfjs/pdf.worker.min.js');
  const pdf=await pdfjs.getDocument({data:new Uint8Array(fs.readFileSync('materials/2026-yoh/week03/practice-quiz.pdf'))}).promise;
  assert.equal(pdf.numPages,7);
  const guarded=[];
  for(let n=1;n<=pdf.numPages;n++){
    const content=await(await pdf.getPage(n)).getTextContent();
    if(isChallengeText(content.items.map(x=>x.str||'').join('')))guarded.push(n);
  }
  assert.deepEqual(guarded,[2,4,6]);
  await pdf.destroy();
  console.log('Optional quiz: three problems, worked arithmetic and PDF reveal guards verified.');
})().catch(error=>{console.error(error);process.exitCode=1;});
