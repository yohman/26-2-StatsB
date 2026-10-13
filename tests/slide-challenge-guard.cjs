const assert=require('node:assert/strict');
const fs=require('node:fs');
const {isChallengeText}=require('../assets/slide-challenge-guard.js');
for(const number of ['①','②','③'])assert(isChallengeText(`チャレンジ${number} 問題 自分で解く 10分`));
assert(isChallengeText('チャ レンジ ②\n自分 で解く'));
assert(!isChallengeText('答え合わせ① 成功率'));
assert(!isChallengeText('二項分布：式を3つに分ける'));
assert(isChallengeText('チャレンジ① ⾃分で解く 10分 ラボは答え合わせで使おう'));
assert(!isChallengeText('答え合わせ① チャレンジ① 自分で解く'));
const deck=fs.readFileSync('materials/2026-yoh/week03/w3.md','utf8');
const slides=deck.split(/\n---\n/).filter(s=>/^## /m.test(s));
const detected=slides.flatMap((s,i)=>isChallengeText(s.replace(/<!--[\s\S]*?-->/g,'').replace(/^## /m,''))?[i+1]:[]);
assert.deepEqual(detected,[10,21,36]);
for(const file of ['agenda.html','viewer.html']){
  const html=fs.readFileSync(file,'utf8');
  assert(html.indexOf('assets/slide-challenge-guard.js')<html.indexOf('assets/slide-browsing.js'));
  assert(html.includes('assets/slide-challenge-guard.css'));
}
assert(fs.readFileSync('viewer.html','utf8').includes('confirmSlideAdvance(pdf,activePage,targetPage,viewer)'));
assert(fs.readFileSync('assets/slide-browsing.js','utf8').includes('confirmSlideAdvance(pdf,pageNumber,target,card)'));
const sandbox={window:{},document:{addEventListener(){},querySelectorAll(){return [];}}};
require('node:vm').runInNewContext(fs.readFileSync('assets/slide-browsing.js','utf8'),sandbox);
const listeners={},surface={addEventListener(name,callback){listeners[name]=callback;}};
let next=0,previous=0;
sandbox.window.bindSlideSwipe(surface,()=>previous++,()=>next++);
listeners.touchstart({touches:[{clientX:200,clientY:50}]});
listeners.touchend({touches:[],changedTouches:[{clientX:100,clientY:52}]});
assert.equal(next,1);
listeners.touchstart({touches:[{clientX:100,clientY:50}]});
listeners.touchend({touches:[],changedTouches:[{clientX:200,clientY:52}]});
assert.equal(previous,1);
listeners.touchstart({touches:[{clientX:100,clientY:50}]});
listeners.touchend({touches:[],changedTouches:[{clientX:110,clientY:152}]});
assert.equal(next+previous,2,'Vertical scroll must not navigate');
console.log('Challenge recognition and shared viewer/thumbnail navigation guards passed.');
// Test actual exported PDF text, not just the Markdown. Japanese fonts may emit
// compatibility radicals that otherwise make the browser check silently miss.
(async()=>{
  const pdfjs=require('../assets/vendor/pdfjs/pdf.min.js');
  pdfjs.GlobalWorkerOptions.workerSrc=require('node:path').resolve('assets/vendor/pdfjs/pdf.worker.min.js');
  const pdf=await pdfjs.getDocument({data:new Uint8Array(fs.readFileSync('materials/2026-yoh/week03/w3.pdf'))}).promise;
  const actual=[];
  for(let n=1;n<=pdf.numPages;n++){
    const page=await pdf.getPage(n),content=await page.getTextContent();
    if(isChallengeText(content.items.map(x=>x.str||'').join('')))actual.push(n);
  }
  assert.deepEqual(actual,[10,21,36]);
  await pdf.destroy();
  console.log('Exported PDF challenge pages detected correctly: 10, 21, 36.');
})().catch(error=>{console.error(error);process.exitCode=1;});
