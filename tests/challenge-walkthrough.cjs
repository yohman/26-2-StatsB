const assert=require('node:assert/strict');
const fs=require('node:fs');
for(const file of ['w3.md','practice-quiz.md']) {
  const slides=fs.readFileSync(`materials/2026-yoh/week03/${file}`,'utf8').split(/\n---\n/).filter(s=>/^## /m.test(s));
  const worked=slides.filter(s=>/^<!-- _class: challenge-check/m.test(s));
  assert.equal(worked.length,3);
  for(const slide of worked) {
    const stages=['① 与えられた条件','② 公式（文字のまま）','③ 数値を代入・計算','④ 答え・意味'];
    const positions=stages.map(label=>slide.indexOf(label));
    assert(positions.every(p=>p>=0));
    assert(positions.every((p,i)=>!i||p>positions[i-1]));
    const general=slide.slice(positions[1],positions[2]);
    assert(general.includes('$$'));
    assert(!/0\.85|0\.75|0\.15|0\.25|4\.5/.test(general),'General formula must precede numerical substitution');
    assert(slide.includes('worked-answer'));
  }
}
console.log('All six answers use given conditions, symbolic formula, substitution, and interpreted result.');
