const assert=require('node:assert/strict');
const data=require('../materials/2026-yoh/week06/t-table-data.js');
const model=require('../assets/week6-math.js');
assert.equal(data.rows.length,35);
assert.deepEqual(data.alpha,[.25,.2,.1,.05,.025,.01,.005,.0005]);
for(const row of data.rows){
 assert.equal(row.values.length,8);
 row.values.forEach((v,i)=>{assert(Number.isFinite(v)&&v>0);if(i)assert(v>row.values[i-1]);});
}
for(let r=1;r<data.rows.length;r++)for(let c=0;c<8;c++)assert(data.rows[r].values[c]<data.rows[r-1].values[c]);
for(const [df,values] of Object.entries(model.table)){
 const row=data.rows.find(row=>row.df===df);assert(row);
 values.forEach((v,c)=>assert.equal(row.values[data.alpha.indexOf(model.columns[c])],v));
}
assert.equal(data.rows.find(r=>r.df==='4').values[4],2.7764);
assert.equal(data.rows.find(r=>r.df==='4').values[3],2.1318);
assert.equal(data.rows.find(r=>r.df==='inf').values[4],1.96);
console.log('Full t table: 35 rows, 8 upper-tail columns, matching lecture values, monotonic quantiles and normal-limit row.');
