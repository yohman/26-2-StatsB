const assert=require('node:assert/strict');
(async()=>{
  const {heightZChart}=await import('../materials/2026-yoh/week05/height-z-chart.mjs');
  const robot=heightZChart({mean:160,sd:7,observations:[{x:146,name:'146cm'},{x:167,name:'167cm'}]});
  for(const label of ['139','146','153','160','167','174','181','146cmはz=−2','167cmはz=1','1σ = 7cm'])assert(robot.includes(label));
  const dots=[...robot.matchAll(/<circle cx="([^"]+)"/g)].map(m=>Number(m[1]));
  assert.equal(dots.length,2);
  for(const [i,z] of [-2,1].entries())assert(Math.abs(dots[i]-(90+(z+3.5)/7*972))<1e-8,'Each observation uses the same cm-to-z linear mapping');
  const adult=heightZChart({mean:168.4,sd:5.2,observations:[{x:177,name:'Yoh 177cm'}],schematic:true});
  for(const label of ['152.8','158','163.2','168.4','173.6','178.8','184','177','1.65','1σ = 5.2cm','実測分布ではない'])assert(adult.includes(label));
  const x=Number(adult.match(/<circle cx="([^"]+)"/)[1]);
  assert(Math.abs(x-(90+((177-168.4)/5.2+3.5)/7*972))<1e-8,'Do not place Yoh at the rounded z instead of his exact height');
  for(const sd of [0,-1,NaN,Infinity])assert.throws(()=>heightZChart({mean:160,sd}));
  console.log('Height/z charts: dual scales, exact observed positions, SD spacing and schematic disclosure verified.');
})().catch(error=>{console.error(error);process.exitCode=1;});
