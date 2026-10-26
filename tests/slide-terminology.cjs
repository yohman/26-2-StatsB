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
  if(slide.slide<=4||slide.layout.includes('queue-story')){assert.equal(terms.length,0,'Story images stay uncluttered');continue;}
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
console.log(`Bilingual terminology: ${dictionary.size} consistent terms across all ${map.slides.filter(s=>s.terms.length).length} statistical slides; Japanese primary, English secondary.`);
(async()=>{
  const {glossary,readings,rubyTerm,annotateJapaneseTerms}=await import('../materials/2026-yoh/week05/terms-week05.mjs');
  for(const key of Object.keys(glossary)){
    assert(readings[key],`Reading supplied for ${key}`);
    assert.match(rubyTerm(key),/<ruby>[^<]+<rt>[ぁ-ゖー]+<\/rt><\/ruby>/);
  }
  assert.equal(rubyTerm('rounding'),'<ruby>丸<rt>まる</rt></ruby>め');
  assert(annotateJapaneseTerms('丸めた').includes('<ruby>丸<rt>まる</rt></ruby>めた'));
  assert(!deck.join('\n').includes('<ruby>丸<rt>ま</rt></ruby>'));
  assert(rubyTerm('intervalProbability').includes('</ruby>の<ruby>'));
  const math='$$\n\\text{分散}=1\n$$',link='[標準化](https://example.com/分散)',image='![確率](images/分散.svg)';
  const result=annotateJapaneseTerms(`## 期待値\n\n${math}\n\n${link}\n\n${image}\n\n<div title="分散">分散</div>`);
  assert(result.includes('## <ruby>期<rt>き</rt></ruby><ruby>待<rt>たい</rt></ruby><ruby>値<rt>ち</rt></ruby>'));
  assert(result.includes(math));assert(result.includes(link));assert(result.includes(image));
  assert(result.includes('<div title="分散"><ruby>分<rt>ぶん</rt></ruby><ruby>散<rt>さん</rt></ruby></div>'));
  for(const slide of deck){
    for(const match of slide.matchAll(/<ruby>([^<]+)<rt>([^<]+)<\/rt><\/ruby>/g))assert.equal([...match[1]].length,1,'Each reading is anchored to one character');
  }
  assert(style.includes('ruby-align:center'));
  assert(!style.includes('ruby-align:space-around'));
  assert(style.includes('section h1 rt,section h2 rt,section h3 rt'));
  assert(style.includes('font-size:.28em'));
  const pdfjs=require('../assets/vendor/pdfjs/pdf.min.js');
  pdfjs.GlobalWorkerOptions.workerSrc=path.join(root,'assets/vendor/pdfjs/pdf.worker.min.js');
  const pdf=await pdfjs.getDocument({data:new Uint8Array(fs.readFileSync(path.join(root,'materials/2026-yoh/week05/w5.pdf')))}).promise;
  const variancePage=map.slides.find(slide=>slide.title==='分散から、標準偏差へ').slide;
  const text=(await(await pdf.getPage(variancePage)).getTextContent()).items;
  for(const [kanji,kana] of [['分','ぶん'],['散','さん'],['標','ひょう'],['準','じゅん'],['偏','へん'],['差','さ']]){
    const base=text.find(item=>item.str===kanji&&item.height>25&&item.transform[5]>430);
    assert(base,`Title character ${kanji} exists in the final PDF`);
    const reading=text.find(item=>item.str===kana&&item.height>0&&item.height<12&&item.transform[5]>base.transform[5]);
    assert(reading,`Title reading ${kana} exists above ${kanji}`);
    assert(Math.abs((base.transform[4]+base.width/2)-(reading.transform[4]+reading.width/2))<0.2,`${kana} is centered above ${kanji}`);
    assert(Math.abs(reading.height/base.height-0.28)<0.01,'Large-title readings use the smaller 28% size');
  }
  await pdf.destroy();
  console.log('Final PDF: each title reading is centered above its kanji, with smaller 28% title text.');
  console.log('Book-style ruby: all readings supplied, okurigana preserved, and formulas, links and image paths protected.');
})().catch(error=>{console.error(error);process.exitCode=1;});
