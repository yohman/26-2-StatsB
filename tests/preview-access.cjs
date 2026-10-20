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
  assert(fs.readFileSync(page,'utf8').includes('assets/preview-access.js?v=20261020'));
  assert.equal(boot(root+page).redirect,root+'unavailable.html');
  assert.equal(boot(root+page+'?preview=all').redirect,root+'unavailable.html');
  assert.equal(boot(root+page+'?p').redirect,undefined);
}
for(const root of ['http://127.0.0.1:8133/','http://localhost:8133/','http://[::1]:8133/','file:///tmp/'])assert.equal(boot(root+'agenda.html').redirect,undefined);
const run=boot(root+'agenda.html?p#week-04');
function anchor(raw){return {href:new URL(raw,root).href,getAttribute:()=>raw,hasAttribute:()=>false,setAttribute:(_,value)=>{raw=value;},value:()=>raw};}
const viewer=anchor('viewer.html?file=materials/test.pdf&return=agenda.html%23week-04');
const external=anchor('https://www.nytimes.com/');
const pdf=anchor('materials/test.pdf');
run.links.push(viewer,external,pdf);run.ready();
const target=new URL(viewer.value());
assert(target.searchParams.has('p'));
assert(new URL(target.searchParams.get('return')).searchParams.has('p'));
assert.equal(external.value(),'https://www.nytimes.com/');
assert.equal(pdf.value(),'materials/test.pdf');
console.log('Public ?p visibility gate, local exemption and preview-preserving navigation verified.');
