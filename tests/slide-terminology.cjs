const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const map=JSON.parse(fs.readFileSync(path.join(root,'materials/2026-yoh/week05/source-map.json')));
const deck=fs.readFileSync(path.join(root,'materials/2026-yoh/week05/w5.md'),'utf8').split(/\n\n---\n\n/);
const dictionary=new Map();
for(const slide of map.slides){
  const terms=slide.terms;
  assert(Array.isArray(terms));
  if(slide.slide<=4){assert.equal(terms.length,0,'Story images stay uncluttered');continue;}
  assert(terms.length>=1&&terms.length<=3,'Only the key terms for the current concept');
  assert.match(deck[slide.slide-1],/class="stat-terms"/);
  for(const {ja,en} of terms){
    assert(ja&&en);
    if(dictionary.has(ja))assert.equal(dictionary.get(ja),en,'Repeated terms use the same translation');
    dictionary.set(ja,en);
    assert(deck[slide.slide-1].includes(`lang="ja">${ja}</span>`));
    assert(deck[slide.slide-1].includes(`lang="en">${en}</span>`));
  }
}
for(const term of ['確率変数','確率密度関数','累積分布関数','期待値','分散','標準偏差','正規分布','標準化','標本平均','標準誤差'])assert(dictionary.has(term));
const style=fs.readFileSync(path.join(root,'materials/2026-yoh/week05/terms-week05.mjs'),'utf8');
assert.match(style,/stat-term-ja\{font-size:22px/);
assert.match(style,/stat-term-en\{font-size:18px/);
console.log(`Bilingual terminology: ${dictionary.size} consistent terms across all 48 statistical slides; Japanese primary, English secondary.`);
