// Pre-render worksheet notation: the read-only viewer intentionally blocks scripts.
// Install mathjax-full, or set MATHJAX_PACKAGE to an existing package directory.
const fs = require('node:fs');
const path = require('node:path');
const {createRequire} = require('node:module');
const load = process.env.MATHJAX_PACKAGE
  ? createRequire(path.resolve(process.env.MATHJAX_PACKAGE, 'package.json'))
  : require;
const {mathjax} = load('mathjax-full/js/mathjax.js');
const {TeX} = load('mathjax-full/js/input/tex.js');
const {SVG} = load('mathjax-full/js/output/svg.js');
const {liteAdaptor} = load('mathjax-full/js/adaptors/liteAdaptor.js');
const {RegisterHTMLHandler} = load('mathjax-full/js/handlers/html.js');
const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);
const document = mathjax.document('', {
  InputJax: new TeX(), OutputJax: new SVG({fontCache: 'none'})
});
const escape = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
function math(tex) {
  const output = document.convert(tex, {display: false});
  const svg = adaptor.innerHTML(output).replace('<svg ', '<svg aria-hidden="true" ');
  if (svg.includes('data-mjx-error')) throw new Error(`Invalid TeX: ${tex}`);
  return `<span class="worksheet-math" role="img" aria-label="${escape(tex)}" data-worksheet-tex="${escape(tex)}">${svg}</span>`;
}
const labels = new Map([
  ['Xi', () => math('X_i')],
  ['nCx πx (1-π)n-x', () => math(String.raw`{}_nC_x\,\pi^x(1-\pi)^{n-x}`)],
  ['nCx', () => math('{}_nC_x')],
  ['πx', () => math(String.raw`\pi^x`)],
  ['(1-π)n-x', () => math(String.raw`(1-\pi)^{n-x}`)],
  ['起こる確率π', () => '起こる確率 ' + math(String.raw`\pi`)],
  ['試行回数n', () => '試行回数 ' + math('n')],
  ['n回中x回起こる組み合わせ', () => math('n') + '回中' + math('x') + '回起こる組み合わせ']
]);
const file = path.resolve(__dirname, '../assets/worksheet-previews/w04/index.html');
let html = fs.readFileSync(file, 'utf8');
html = html.replace('href="../../worksheet-preview.css"', 'href="../../worksheet-preview.css?v=20261019-latex"');
let count = 0;
html = html.replace(/(<font\b[^>]*>)([^<]+)(<\/font>)/g, (all, start, text, end) => {
  const render = labels.get(text);
  if (render) { count++; return start + render() + end; }
  if (text.includes('不良品の数をXとすると')) {
    count++;
    return start + text.replace('数をXとすると', '数を' + math('X') + 'とすると') + end;
  }
  return all;
});
fs.writeFileSync(file, html);
console.log(`Week 4 worksheet: rendered ${count} mathematical labels (safe to rerun).`);
