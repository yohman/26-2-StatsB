const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../assets/distribution-simulations.js'), 'utf8');
const code = source.slice(source.indexOf('    function examAnswer()'), source.indexOf('    function modelAndRange()'));
for (const kind of ['normal', 't', 'chi']) {
  for (const language of ['en', 'ja']) {
    const context = { kind, mean: 60, sd: 10, band: 2, n: 5, examMean: 64, examSd: kind === 't' ? 8 : 12, latestSample: [], values: [],
      fmt: value => Number(value.toFixed(3)).toString(), math: (tex,fallback) => `${tex} ${fallback}`,
      t: (en, ja) => language === 'en' ? en : ja };
    vm.createContext(context);
    vm.runInContext(code, context);
    const empty = vm.runInContext('examMarkup()', context);
    if (kind !== 'normal') assert(empty.includes('1,000'));
    if (kind === 'normal') assert(empty.includes('95.45'));
    else assert.equal(vm.runInContext('examAnswer()', context), kind === 't' ? 4/(8/Math.sqrt(5)) : 5.76);
    context.latestSample = kind === 'normal' ? [60] : [-1,0,0,0,1];
    context.values = [kind === 'chi' ? 2 : 0];
    const populated = vm.runInContext('examMarkup()', context);
    assert(!populated.includes('NaN'));
    assert(populated.includes(kind === 'normal' ? '60.0' : kind === 'chi' ? '5.76' : '1.118'));
    assert(populated.includes('cm'));
  }
}
console.log('Distribution exam questions: English/Japanese, formula substitution, known answers, and measured robots passed.');
