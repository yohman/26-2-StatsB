const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const context = vm.createContext({console, URLSearchParams});
const source = fs.readFileSync(path.join(root, 'assets/stats-site.js'), 'utf8');
vm.runInContext(source.replace(/setupLanguage\(\);\s*setupMenu\(\);\s*loadAgenda\(\);\s*$/, ''), context);
for (const name of fs.readdirSync(path.join(root, 'content/weeks'))) {
  context.markdown = fs.readFileSync(path.join(root, 'content/weeks', name), 'utf8');
  const week = vm.runInContext('parseWeek(markdown, "test.md")', context);
  context.week = week;
  const markup = vm.runInContext('assignmentTabs(week)', context);
  if ([3,4].includes(week.week)) {
    assert.equal((markup.match(/role="tab"/g) || []).length, 1);
    assert.match(markup, /Reference for Activity 1/);
    assert.match(markup, /Poisson distribution table/);
  }
  for (const item of week.materials.filter(item => item.href.endsWith('.xlsx'))) {
    assert(!/解答|answer|課題/i.test(item.href));
    assert(fs.existsSync(path.join(root, `assets/worksheet-previews/w${String(week.week).padStart(2,'0')}/index.html`)));
    assert.match(markup, /activity-resource-preview/);
    assert.match(markup, /activity-resource-download/);
    assert.match(markup, /XLSX/);
  }
}
console.log('Activity grouping, student-only worksheets, and preview files passed.');
