const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const M=require('../assets/week5-math.js');
const positive=M.normalTableLookup(1.28);
assert.equal(positive.row,12);assert.equal(positive.col,8);
assert.equal(positive.tail,.10027);assert.equal(positive.probability,.10027);
assert.equal(M.normalTableLookup(-1).probability,.84134);
assert.equal(M.normalTableLookup(0).probability,.5);
assert.equal(M.normalTableLookup(1.428571).lookupZ,1.43);
assert.equal(M.normalTableLookup(1.428571).rounded,true);
assert.equal(M.normalTableLookup(.995).lookupZ,1);
assert.equal(M.normalTableLookup(3.09).inRange,true);
assert.equal(M.normalTableLookup(3.10).inRange,false);
assert.equal(M.normalTableLookup(-14).tail,null);
assert.throws(()=>M.normalTableLookup(NaN),RangeError);

class Element{
  constructor(dataset={}){this.dataset=dataset;this.listeners={};this.value='';this.innerHTML='';this.textContent='';this.classList={add(){},remove(){}};}
  addEventListener(type,fn){this.listeners[type]=fn;}
  setAttribute(key,value){this[key]=value;}
}
function setup(kind='normal',language='ja'){
  const elements=new Map(),root=new Element({week5Lab:kind});
  const inputs=(kind==='normal'?['mu','variance','x']:kind==='table'?['z','left']:[]).map(input=>new Element({input}));
  const runs=kind==='table'?[]:[1,100,1000].map(run=>new Element({run}));
  const modes=kind==='table'?['upper','negative','lower','central','interval'].map(mode=>new Element({mode})):[];
  const normalModes=kind==='normal'?['upper','cutoff'].map(normalMode=>new Element({normalMode})):[];
  const get=selector=>{
    if(!elements.has(selector))elements.set(selector,new Element());
    return elements.get(selector);
  };
  root.querySelector=get;
  root.querySelectorAll=selector=>selector.split(',').flatMap(s=>s==='[data-input]'?inputs:s==='[data-run]'?runs:s==='[data-mode]'?modes:s==='[data-normal-mode]'?normalModes:s==='[data-preset]'||s==='[data-change]'||s==='[data-default]'?[get(s)]:[]);
  const document={documentElement:{dataset:{language}},querySelectorAll:()=>[root],addEventListener(){}};
  let observer;
  const context={window:{StatsBWeek5Math:M},document,MutationObserver:class{constructor(fn){observer=fn;}observe(){}},setTimeout:fn=>fn()};
  vm.runInNewContext(fs.readFileSync('assets/week5-explorations.js','utf8'),context);
  const input=(name,value)=>{const el=inputs.find(el=>el.dataset.input===name);el.value=String(value);el.listeners.input();};
  return {root,get,input,runs,modes,normalModes,language:value=>{document.documentElement.dataset.language=value;observer();}};
}
(async()=>{
  const lab=setup();
  assert(lab.root.innerHTML.includes('data-lookup'));
  assert(lab.get('[data-lookup]').innerHTML.includes('aria-current="true">0.15866'));
  assert.equal(lab.get('[data-answer]').textContent,'15.87%');
  assert(lab.get('[data-lookup-calculation]').innerHTML.includes('15.866'));
  assert(lab.get('[data-substitution]').innerHTML.includes('\\sqrt{25}'));
  assert(lab.get('[data-question]').textContent.includes('ロボット'));
  assert(lab.root.innerHTML.includes('target="_blank"'));
  lab.input('x',155);
  assert(lab.get('[data-lookup-calculation]').innerHTML.includes('1-0.15866'));
  assert.equal(lab.get('[data-answer]').textContent,'84.13%');
  lab.input('variance',49);lab.input('x',170);
  assert(lab.get('[data-lookup]').innerHTML.includes('aria-current="true">0.07636'));
  assert(lab.get('[data-lookup-calculation]').innerHTML.includes('1.43'));
  assert(lab.get('[data-lookup-calculation]').innerHTML.includes('丸めて'));
  const lookupBefore=lab.get('[data-lookup]').innerHTML;
  await lab.runs[0].listeners.click();
  assert.equal(lab.get('[data-lookup]').innerHTML,lookupBefore,'Measurements do not change the table prediction');
  lab.input('mu',30);lab.input('variance',25);lab.input('x',100);
  assert(lab.get('[data-lookup]').innerHTML.includes('範囲'));
  assert(!lab.get('[data-lookup]').innerHTML.includes('aria-current'));
  lab.language('en');
  assert(lab.get('[data-lookup]').innerHTML.includes('outside this printed table'));
  lab.get('[data-default]').listeners.click();
  assert.equal(lab.get('[data-answer]').textContent,'15.87%');
  assert(lab.get('[data-lookup]').innerHTML.includes('Row'));
  lab.get('[data-preset]').value='exam';lab.get('[data-preset]').listeners.change();
  assert.equal(lab.get('[data-answer]').textContent,'6.68%');
  lab.normalModes.find(el=>el.dataset.normalMode==='cutoff').listeners.click();
  assert.equal(lab.get('[data-answer]').textContent,'71.5 points');
  assert(lab.get('[data-reading]').textContent.includes('72 points'));
  assert(lab.get('[data-substitution]').innerHTML.includes('1.65'));
  const cutoffTable=lab.get('[data-lookup]').innerHTML;
  await lab.runs[0].listeners.click();
  assert.equal(lab.get('[data-lookup]').innerHTML,cutoffTable,'Sampling must not move the cutoff or table');
  const table=setup('table');
  assert(table.get('[data-lookup]').innerHTML.includes('aria-current="true">0.02500'));
  table.modes.find(el=>el.dataset.mode==='lower').listeners.click();
  assert.equal(table.get('[data-answer]').textContent,'97.50%');
  table.modes.find(el=>el.dataset.mode==='interval').listeners.click();
  table.input('z',1.5);table.input('left',-.5);
  assert.equal(table.get('[data-answer]').textContent,'62.47%');
  assert(table.get('[data-substitution]').innerHTML.includes('0.62465'));
  assert.equal((table.get('[data-lookup]').innerHTML.match(/aria-current="true"/g)||[]).length,2);
  table.input('left',.5);
  assert.equal(table.get('[data-answer]').textContent,'24.17%');
  table.input('left',2);
  assert.equal(table.get('[data-answer]').textContent,'0.00%','Reversed boundaries are clamped');
  const site=fs.readFileSync('assets/stats-site.js','utf8');
  assert(site.includes("['stopwatch','normal','table'].map"));
  for(const kind of ['area','cdf','moments']){
    assert(!site.includes(`'week-5-${kind}-tab'`),'Removed tabs cannot remain route destinations');
    assert.equal(setup(kind).root.innerHTML,'','Legacy labs no longer initialize');
  }
  assert(!fs.readFileSync('assets/week5-explorations.js','utf8').includes('Q(z)'),'Use the notation taught in the deck');
  console.log('Normal lookup: positive/negative/zero z, rounding, table limits, slider updates, language, resets and simulation stability passed.');
})().catch(error=>{console.error(error);process.exitCode=1;});
