/* Week 6: shared, testable models. No student records leave the browser. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.StatsBWeek6=api;})(typeof window==='undefined'?globalThis:window,()=>{
  const mean=x=>x.reduce((a,b)=>a+b,0)/x.length;
  function summary(x){if(x.length<2||x.some(v=>!Number.isFinite(v)))throw Error('At least two finite observations required');const m=mean(x),ss=x.reduce((a,b)=>a+(b-m)**2,0);return {n:x.length,mean:m,ss,variance:ss/x.length,s2:ss/(x.length-1),s:Math.sqrt(ss/(x.length-1)),se:Math.sqrt(ss/(x.length-1)/x.length),df:x.length-1};}
  function logGamma(z){const c=[676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];if(z<.5)return Math.log(Math.PI)-Math.log(Math.sin(Math.PI*z))-logGamma(1-z);z--;let x=.99999999999980993;c.forEach((v,i)=>x+=v/(z+i+1));const t=z+7.5;return .5*Math.log(2*Math.PI)+(z+.5)*Math.log(t)-t+Math.log(x);}
  const normal=(x,m=0,s=1)=>Math.exp(-.5*((x-m)/s)**2)/(s*Math.sqrt(2*Math.PI));
  const tPdf=(x,df)=>Math.exp(logGamma((df+1)/2)-logGamma(df/2)-.5*Math.log(df*Math.PI)-(df+1)/2*Math.log1p(x*x/df));
  const chiPdf=(x,df)=>x<=0?(df===2?.5:0):Math.exp((df/2-1)*Math.log(x)-x/2-df/2*Math.log(2)-logGamma(df/2));
  const randomNormal=()=>Math.sqrt(-2*Math.log(Math.max(Number.EPSILON,Math.random())))*Math.cos(2*Math.PI*Math.random());
  const tStatistic=(x,target)=>{const a=summary(x);return a.se>0?(a.mean-target)/a.se:NaN;};
  const chiStatistic=z=>z.reduce((s,v)=>s+v*v,0);
  function resample(x,n){return Array.from({length:n},()=>x[Math.floor(Math.random()*x.length)]);}
  function binomial(n){let c=1;return Array.from({length:n+1},(_,k)=>{if(k)c*= (n-k+1)/k;return c/2**n;});}
  // Upper-tail quantiles, rounded to four decimals. Matches textbook convention.
  const columns=[.1,.05,.025,.01,.005];
  const table={1:[3.0777,6.3138,12.7062,31.8205,63.6567],2:[1.8856,2.9200,4.3027,6.9646,9.9248],3:[1.6377,2.3534,3.1824,4.5407,5.8409],4:[1.5332,2.1318,2.7764,3.7469,4.6041],5:[1.4759,2.0150,2.5706,3.3649,4.0321],8:[1.3968,1.8595,2.3060,2.8965,3.3554],10:[1.3722,1.8125,2.2281,2.7638,3.1693],20:[1.3253,1.7247,2.0860,2.5280,2.8453],30:[1.3104,1.6973,2.0423,2.4573,2.7500],60:[1.2958,1.6706,2.0003,2.3901,2.6603]};
  return {mean,summary,normal,tPdf,chiPdf,randomNormal,tStatistic,chiStatistic,resample,binomial,columns,table};
});
