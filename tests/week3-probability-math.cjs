const {test} = require('node:test');
const assert = require('node:assert/strict');
const {choose,binomial,poisson,tail,arrivals} = require('../assets/week3-story-explorations.js');
const close = (a,b,tol=1e-9) => assert.ok(Math.abs(a-b)<tol, `${a} differs from ${b}`);
test('Textbook binomial example, NBA examples and normalization', () => {
  assert.equal(choose(5,3),10); assert.equal(choose(5,0),1);
  close(binomial(5,.32,3),.151519232);
  close(binomial(5,.93,5),.6956883693);
  close(tail(x=>binomial(5,.93,x),4),.9575065728);
  for(const p of [0,.05,.32,.93,1]) close(Array.from({length:21},(_,i)=>binomial(20,p,i)).reduce((a,b)=>a+b),1);
});
test('Costco exact and tail probabilities, duration scaling', () => {
  close(poisson(5,3),.14037389581428056);
  close(tail(x=>poisson(5,x),5),.5595067149347877);
  close(tail(x=>poisson(5,x),0),1);
  close(poisson(0,0),1); close(poisson(0,1),0);
  close(Array.from({length:120},(_,i)=>poisson(30,i)).reduce((a,b)=>a+b),1);
});
test('Seeded Poisson process produces the expected mean and count probabilities', () => {
  let seed=42; const random=()=>((seed=(1664525*seed+1013904223)>>>0)/2**32);
  let sum=0,three=0; const trials=30000;
  for(let i=0;i<trials;i++) {const times=arrivals(5,random);sum+=times.length;three+=times.length===3;assert.ok(times.every((t,j)=>t>=0&&t<1&&(!j||t>times[j-1])));}
  close(sum/trials,5,.06);close(three/trials,poisson(5,3),.01);
  assert.deepEqual(arrivals(0,random),[]);
});
