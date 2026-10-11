const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const read = name => fs.readFileSync(path.join(__dirname, '../assets', name), 'utf8');
const element = () => ({
  style: { setProperty() {} }, children: [],
  setAttribute() {}, append(...nodes) { this.children.push(...nodes); },
  replaceChildren(...nodes) { this.children = nodes; }
});
const document = { createElement: element };
const t = english => english;

// Exercise the actual rendering functions with empty, extreme, and large samples.
const families = read('week2-probability-simulations.js');
const familyDraw = families.slice(families.indexOf('    function draw() {', families.indexOf('const rules =')), families.indexOf('    function makeControl'));
for (const type of ['binomial', 'bernoulli', 'poisson']) {
  const chart = element();
  const context = { document, t, type, chart, status: {}, aha: {},
    probabilities: () => [0.2, 0.5, 0.3], counts: [0, 0, 0], trials: 0 };
  vm.createContext(context);
  vm.runInContext(familyDraw + '\ndraw();', context);
  const heights = () => chart.children.map(node => node.innerHTML.match(/is-predicted" style="height:([\d.]+)%/)[1]);
  const initial = heights();
  for (const [trials, counts] of [[1, [1, 0, 0]], [1000, [210, 480, 310]]]) {
    Object.assign(context, { trials, counts });
    vm.runInContext('draw()', context);
    assert.deepEqual(heights(), initial, `${type}: model bars moved`);
  }
  assert.deepEqual(initial, ['20', '50', '30']);
}

const batting = read('batting-simulation.js');
const battingDraw = batting.slice(batting.indexOf('    function drawChart()'), batting.indexOf('    function updateRate()'));
const chart = element();
const context = { document, t, chart, n: 2, x: 1, games: 0, counts: [0,0,0],
  model: () => [0.25,0.5,0.25], batchStatus: {}, modelNote: {}, updateCalculation() {} };
vm.createContext(context);
vm.runInContext(battingDraw + '\ndrawChart();', context);
const modelHeights = () => chart.children.map(bin => bin.children[0].children[1].style.height);
const initial = modelHeights();
for (const [games, counts] of [[1, [1,0,0]], [1000, [240,510,250]]]) {
  Object.assign(context, { games, counts });
  vm.runInContext('drawChart()', context);
  assert.deepEqual(modelHeights(), initial);
}
assert.deepEqual(initial, ['25%', '50%', '25%']);

const density = read('distribution-simulations.js');
assert(!density.match(/const maxY = .*\.\.\.hist/), 'Density scale must not depend on samples');
assert(density.includes('yPos(Math.min(value, maxY))'), 'Outlying sample bars stay within chart');
assert(read('week3-story-explorations.js').includes('const maxY = 1;'));
assert(read('example-lab.js').includes('hi=Math.max(...s.values,1)'));
console.log('Fixed model scales: probability models, batting, NBA/Costco, expectation, and density checks passed.');
