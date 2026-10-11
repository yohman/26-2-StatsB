const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../assets/distribution-simulations.js'), 'utf8');
const code = source.slice(source.indexOf('    function scenarioMarkup()'), source.indexOf('    function modelAndRange()'));
for (const kind of ['normal', 't', 'chi']) {
  for (const language of ['en', 'ja']) {
    const context = { kind, mean: 60, sd: 10, n: 5, latestSample: [], values: [],
      t: (en, ja) => language === 'en' ? en : ja };
    vm.createContext(context);
    vm.runInContext(code, context);
    const empty = vm.runInContext('scenarioMarkup()', context);
    assert(empty.includes('1,000'));
    if (kind !== 'normal') assert(empty.includes('5,000'));
    context.latestSample = kind === 'normal' ? [60] : [-1,0,0,0,1];
    context.values = [kind === 'chi' ? 2 : 0];
    const populated = vm.runInContext('scenarioMarkup()', context);
    assert(!populated.includes('NaN'));
    assert(populated.includes(kind === 'normal' ? '60.0' : kind === 'chi' ? '2.000' : '0.000'));
    assert(populated.includes('cm'));
  }
}
console.log('Distribution scenarios: English/Japanese, sample counts, and latest examples passed.');
