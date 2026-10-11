const assert=require('node:assert/strict');
const {build,choose,binomial,poisson}=require('../assets/exam-practice.js');
const cases={coin:{total:10,heads:6},monty:{strategy:'switch'},lineup:{n:5,k:2},pairs:{},batting:{n:5,p:.32,k:3},nba:{n:5,p:.93,k:4,tail:true},binomial:{n:10,p:.5,k:2},bernoulli:{p:.5,k:1},discrete:{k:2},poisson:{lambda:5,k:3},costco:{lambda:10,k:5,rate:5,minutes:20},roulette:{stake:100},lottery:{},dice:{},delivery:{},'al-discrete':{},continuous:{band:1},'al-continuous':{slices:4},disease:{population:100000,error:1},events:{expression:'B|A'}};
for(const [type,state] of Object.entries(cases))for(const lang of ['ja','en']){
  const result=build(type,state,lang);
  for(const [key,value] of Object.entries(result)){
    assert.equal(typeof value,'string',`${type}.${key}`);
    assert(value.length>0);
    assert(!/NaN|undefined|Infinity/.test(value),`${type}.${key}: ${value}`);
  }
}
assert.equal(choose(5,2),10);
assert(build('nba',cases.nba,'en').given.includes(String.raw`\quad`));
assert(build('batting',cases.batting,'en').rule.includes(String.raw`\pi`));
assert(build('nba',cases.nba,'en').answer.includes(String.raw`\ge`));
assert(build('poisson',cases.poisson,'en').given.includes(String.raw`\lambda`));
assert(build('lottery',{},'en').worked.includes(String.raw`\times`));
assert(build('events',{expression:'B|A'},'en').worked.includes(String.raw`\mid`));
assert.equal(build('dice',{},'en').answer,'E(X)=3.5');
assert(build('lottery',{},'en').answer.includes('75-100=-25'));
assert(build('disease',cases.disease,'en').answer.includes('0.0989'));
assert(build('al-continuous',cases['al-continuous'],'en').answer.includes('0.9428'));
assert(build('events',{expression:'B|A'},'en').worked.includes('frac{2}{4}'));
assert(build('events',{expression:'A|B'},'en').worked.includes('frac{2}{3}'));
for(const expr of ['A','B','C','D','A∩B','A∩C','B∩C','A∪B','A∪C','B∪C','D|B','B|D'])assert(build('events',{expression:expr},'en'));
for(const n of [1,5,10])for(const p of [0,.32,1])assert(Math.abs(Array.from({length:n+1},(_,k)=>binomial(n,p,k)).reduce((a,b)=>a+b,0)-1)<1e-10);
assert(Math.abs(Array.from({length:100},(_,k)=>poisson(5,k)).reduce((a,b)=>a+b,0)-1)<1e-10);
assert(build('nba',{n:5,p:.93,k:0,tail:true},'en').answer.includes('100'));
assert(build('costco',{lambda:5,k:0,tail:true},'en').answer.includes('100'));
console.log('All bilingual worked-question models and numerical checks passed.');
