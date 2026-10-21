const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('assets/preview-access.js','utf8');
function boot(href){
  let redirect, ready;
  const links=[];
  const document={documentElement:{style:{}},currentScript:{src:new URL('assets/preview-access.js',href).href},body:{},querySelectorAll:()=>links,addEventListener:(name,fn)=>{if(name==='DOMContentLoaded')ready=fn;}};
  const context={URL,location:{href,replace:v=>redirect=v},document,MutationObserver:class{observe(){}}};
  vm.runInNewContext(source,context);
  return {document,links,redirect,ready};
}
const root='https://yohman.github.io/26-2-StatsB/';
for(const page of ['index.html','agenda.html','viewer.html','review.html','teaching-plan.html']){
  assert(fs.readFileSync(page,'utf8').includes('assets/preview-access.js?v=20261021-week-preview'));
  assert.equal(boot(root+page).redirect,undefined);
  assert.equal(boot(root+page+'?preview=all').redirect,undefined);
  assert.equal(boot(root+page+'?p').redirect,undefined);
}
for(const root of ['http://127.0.0.1:8133/','http://localhost:8133/','http://[::1]:8133/','file:///tmp/'])assert.equal(boot(root+'agenda.html').redirect,undefined);
const run=boot(root+'agenda.html?p&preview=all#week-04');
function anchor(raw){return {href:new URL(raw,root).href,getAttribute:()=>raw,hasAttribute:()=>false,setAttribute:(_,value)=>{raw=value;},value:()=>raw};}
const viewer=anchor('viewer.html?file=materials/test.pdf&return=agenda.html%23week-04');
const external=anchor('https://www.nytimes.com/');
const pdf=anchor('materials/test.pdf');
run.links.push(viewer,external,pdf);run.ready();
const target=new URL(viewer.value());
assert(target.searchParams.has('p'));
assert.equal(target.searchParams.get('preview'),'all');
assert(new URL(target.searchParams.get('return')).searchParams.has('p'));
assert.equal(new URL(target.searchParams.get('return')).searchParams.get('preview'),'all');
assert.equal(external.value(),'https://www.nytimes.com/');
assert.equal(pdf.value(),'materials/test.pdf');
const siteContext=vm.createContext({URLSearchParams});
vm.runInContext(fs.readFileSync('assets/stats-site.js','utf8').replace(/setupLanguage\(\);\s*setupMenu\(\);\s*loadAgenda\(\);\s*$/,''),siteContext);
for(const [href,all] of [[root+'agenda.html',false],[root+'agenda.html?preview=all',false],[root+'agenda.html?p',true]]){
 siteContext.testLocation=new URL(href);
 const mode=vm.runInContext('agendaPreviewMode(testLocation)',siteContext);
 assert.equal(mode.expandAll,all);assert.equal(mode.previewAll,all);
 siteContext.mode=mode;
 assert.equal(vm.runInContext('weekIsLocked({week:4,date:"2026-10-21"},mode.previewAll,"2026-10-21")',siteContext),false);
 assert.equal(vm.runInContext('weekIsLocked({week:5,date:"2026-10-28"},mode.previewAll,"2026-10-21")',siteContext),!all);
}
vm.runInContext('weekSummary=()=>"";lectureSection=()=>"";inClassSection=()=>"";homeworkSection=()=>"";',siteContext);
for(const [number,date] of [[1,'2026-09-30'],[4,'2026-10-21'],[5,'2026-10-28']]){
 siteContext.week={week:number,date};
 const markup=vm.runInContext('weekCard(week,null,false,"2026-10-21",4,false)',siteContext);
 assert.equal(markup.startsWith('<details'),number<=4);
 assert.equal(/<details[^>]* open>/.test(markup),number===4);
 const preview=vm.runInContext('weekCard(week,null,true,"2026-10-21",4,true)',siteContext);
 assert(/<details[^>]* open>/.test(preview));
}
console.log('Public access restored; Week 4 released and expanded alone; ?p opens all weeks.');
