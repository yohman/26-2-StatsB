const assert=require('node:assert/strict');
const fs=require('node:fs');
const root='materials/2026-yoh/week04/';
const files=['w4','news-ai-companions','news-ai-news-errors','news-genz-ai-anger','news-poisson-bears','news-poisson-cyber'];
let charts=0;
for(const name of files){
 const slides=fs.readFileSync(root+name+'.md','utf8').split(/\n---\n/).filter(s=>/^## /m.test(s));
 for(let i=0;i<slides.length;i++){
  const s=slides[i];
  if(/^<!-- _class: challenge-check worked-answer -->/m.test(s))assert(/_class: (answer-visual|companion-chart)/.test(slides[i+1]),name+' answer needs next-slide visual');
  for(const svg of s.matchAll(/<svg\b[^>]*class="(?:answer-visual-chart|companion-distribution)"[\s\S]*?<\/svg>/g)){
   const probabilities=[...svg[0].matchAll(/data-probability="([^"]+)"/g)].map(m=>Number(m[1]));
   assert(probabilities.length>1);
   assert(probabilities.every(p=>p>=0&&p<=1));
   assert(Math.abs(probabilities.reduce((a,b)=>a+b,0)-1)<1e-10,name+' chart must include all probability mass');
   charts++;
  }
 }
}
assert.equal(charts,23); // 13 lecture distributions + 10 news distributions; model-selection uses a table.
console.log(`${charts} editable distributions conserve probability; every worked answer has its visual follow-up.`);
