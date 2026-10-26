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
    const japanese=deck[slide.slide-1].match(/<aside class="stat-terms"[\s\S]*?<\/aside>/)[0];
    assert(japanese.replace(/<rt>[^<]*<\/rt>/g,'').replace(/<[^>]*>/g,'').includes(ja));
    assert.match(japanese,/<ruby>[^<]+<rt>[ぁ-ゖー]+<\/rt><\/ruby>/);
    assert(deck[slide.slide-1].includes(`lang="en">${en}</span>`));
  }
}
for(const term of ['確率変数','確率密度関数','累積分布関数','期待値','分散','標準偏差','正規分布','標準化','標本平均','標準誤差'])assert(dictionary.has(term));
const style=fs.readFileSync(path.join(root,'materials/2026-yoh/week05/terms-week05.mjs'),'utf8');
assert.match(style,/stat-term-ja\{font-size:22px/);
assert.match(style,/stat-term-en\{font-size:18px/);
console.log(`Bilingual terminology: ${dictionary.size} consistent terms across all ${map.slides.length-4} statistical slides; Japanese primary, English secondary.`);
(async()=>{
  const {glossary,readings,rubyTerm,annotateJapaneseTerms}=await import('../materials/2026-yoh/week05/terms-week05.mjs');
  for(const key of Object.keys(glossary)){
    assert(readings[key],`Reading supplied for ${key}`);
    assert.match(rubyTerm(key),/<ruby>[^<]+<rt>[ぁ-ゖー]+<\/rt><\/ruby>/);
  }
  assert.equal(rubyTerm('rounding'),'<ruby>丸<rt>ま</rt></ruby>め');
  assert(rubyTerm('intervalProbability').includes('</ruby>の<ruby>'));
  const math='$$\n\\text{分散}=1\n$$',link='[標準化](https://example.com/分散)',image='![確率](images/分散.svg)';
  const result=annotateJapaneseTerms(`## 期待値\n\n${math}\n\n${link}\n\n${image}\n\n<div title="分散">分散</div>`);
  assert(result.includes('## <ruby>期待値<rt>きたいち</rt></ruby>'));
  assert(result.includes(math));assert(result.includes(link));assert(result.includes(image));
  assert(result.includes('<div title="分散"><ruby>分散<rt>ぶんさん</rt></ruby></div>'));
  console.log('Book-style ruby: all readings supplied, okurigana preserved, and formulas, links and image paths protected.');
})().catch(error=>{console.error(error);process.exitCode=1;});
