const assert = require('node:assert/strict');
const fs = require('node:fs');
const html = fs.readFileSync('assets/worksheet-previews/w04/index.html', 'utf8');
for (const tex of ['{}_nC_x', '\\pi^x', '(1-\\pi)^{n-x}', 'X_i']) {
  assert(html.includes(`data-worksheet-tex="${tex}"`), `Missing rendered ${tex}`);
}
assert.equal((html.match(/<table\b/g) || []).length, 3);
assert.equal((html.match(/data-worksheet-tex=/g) || []).length, 21);
assert(!html.includes('data-mjx-error'));
assert(!/<script\b/.test(html), 'Preview must work in the sandbox without scripts');
assert(!/<font[^>]*>nCx/.test(html), 'Flattened formula must be replaced');
console.log('All three worksheet sections retain script-free LaTeX notation.');
