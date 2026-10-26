/* Shared numerical model for the Week 5 lecture charts and explorations. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.StatsBWeek5Math=api;})(typeof window==='undefined'?globalThis:window,()=>{
  const normalPdf=(x,mu=0,sd=1)=>Math.exp(-.5*((x-mu)/sd)**2)/(sd*Math.sqrt(2*Math.PI));
  // Abramowitz-Stegun 7.1.26; absolute CDF error < 8e-8.
  function normalCdf(z){if(z===0)return .5;const a=Math.abs(z)/Math.SQRT2,t=1/(1+.3275911*a);const erf=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-a*a);return .5*(1+Math.sign(z)*erf);}
  const upper=z=>1-normalCdf(z);
  const uniformCdf=(x,b)=>Math.max(0,Math.min(1,x/b));
  const triangularCdf=(x,b)=>uniformCdf(x,b)**2;
  const uniformMoments=b=>({mean:b/2,variance:b*b/12,sd:b/Math.sqrt(12)});
  const randomNormal=()=>Math.sqrt(-2*Math.log(Math.max(Number.EPSILON,Math.random())))*Math.cos(2*Math.PI*Math.random());
  const number=x=>Number(x.toFixed(4)).toString();
  function midpointAreas(n,b=20){
    const width=b/n,rectangles=Array.from({length:n},(_,i)=>{const midpoint=(i+.5)*width,height=3*midpoint**2/b**3;return {midpoint,height,area:width*height};});
    return {width,rectangles,total:rectangles.reduce((sum,r)=>sum+r.area,0)};
  }
  const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
  function chart({min=0,max=20,pdf=x=>1/20,lo=5,hi=10,mean=null,ticks=null,samples=[],title='確率密度 f(x)',xlabel='x',cdf=false,rectangles=0,rectangleLabels=false,rectangleHighlight=null,labels=[],yMax=null,point=null}={}){
    const W=700,H=330,L=62,R=24,T=38,B=64,base=H-B,pw=W-L-R,ph=base-T;
    const xs=Array.from({length:401},(_,i)=>min+(max-min)*i/400);
    const ymax=yMax??(cdf?1.08:Math.max(...xs.map(x=>pdf(x)),.001)*1.28);
    const X=x=>L+(x-min)/(max-min)*pw,Y=y=>base-y/ymax*ph;
    const points=xs.map(x=>[X(x),Y(pdf(x))]),path=points.map(([x,y],i)=>`${i?'L':'M'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
    const a=Math.max(min,lo),b=Math.min(max,hi),area=b>a?Array.from({length:201},(_,i)=>a+(b-a)*i/200):[];
    const pointMarker=point?`<path d="M${L},${Y(point.y)}H${X(point.x)}V${base}" fill="none" stroke="#af6339" stroke-dasharray="5 4"/><circle cx="${X(point.x)}" cy="${Y(point.y)}" r="6" fill="#af6339"/><text x="${L+8}" y="${Y(point.y)-10}" fill="#af6339" font-weight="bold">${number(point.y)}</text>`:'';
    const shade=(area.length?`<path d="M${X(a)},${base} ${area.map(x=>`L${X(x)},${Y(pdf(x))}`).join(' ')} L${X(b)},${base}Z" fill="#d99361" opacity=".45"/>`:'')+pointMarker;
    const histogram=Array(24).fill(0),bw=(max-min)/24;
    samples.forEach(v=>{if(v>=min&&v<=max)histogram[Math.min(23,Math.floor((v-min)/bw))]++;});
    const bars=histogram.map((n,i)=>{const y=n/Math.max(1,samples.length)/bw,clipped=y>ymax;return `<rect x="${X(min+i*bw)+1}" y="${Y(Math.min(y,ymax))}" width="${pw/24-2}" height="${base-Y(Math.min(y,ymax))}" fill="#287f74" opacity=".35"/>${clipped?`<text x="${X(min+(i+.5)*bw)}" y="${T+13}" text-anchor="middle">↑</text>`:''}`;}).join('');
    const rects=rectangles?Array.from({length:rectangles},(_,i)=>{const dx=(max-min)/rectangles,x=min+i*dx;return `<rect x="${X(x)}" y="${Y(pdf(x+dx/2))}" width="${pw/rectangles}" height="${base-Y(pdf(x+dx/2))}" fill="${rectangleHighlight===i?'#d99361':'#287f74'}" fill-opacity="${rectangleHighlight===i?'.65':'.1'}" stroke="#287f74"/>${rectangleLabels?`<text x="${X(x+dx/2)}" y="${base+44}" text-anchor="middle" fill="#176d82">A${i+1}</text>`:''}`;}).join(''):'';
    const xt=ticks||Array.from({length:5},(_,i)=>min+(max-min)*i/4);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${escape(title)}"><title>${escape(title)}</title><g font-family="Arial,Hiragino Sans,sans-serif" font-size="15" fill="#425560"><text x="${L}" y="22" font-weight="bold">${escape(title)}</text>${[0,.5,1].map(f=>{const y=ymax*f;return `<line x1="${L}" x2="${W-R}" y1="${Y(y)}" y2="${Y(y)}" stroke="#dce3e3"/><text x="${L-8}" y="${Y(y)+5}" text-anchor="end">${number(y)}</text>`;}).join('')}${shade}${rects}${cdf?'':bars}<path d="${path}" fill="none" stroke="#176d82" stroke-width="3.5"/>${mean!==null?`<line x1="${X(mean)}" x2="${X(mean)}" y1="${T}" y2="${base}" stroke="#176d82" stroke-dasharray="5 5"/><text x="${X(mean)}" y="${T-7}" text-anchor="middle">μ = ${number(mean)}</text>`:''}${labels.map(({x,text})=>`<line x1="${X(x)}" x2="${X(x)}" y1="${T+25}" y2="${base}" stroke="#ae653c" stroke-dasharray="4 3"/><text x="${X(x)}" y="${T+20}" text-anchor="middle">${escape(text)}</text>`).join('')}<path d="M${L},${T}V${base}H${W-R}" stroke="#61737c" fill="none"/>${xt.map(x=>`<path d="M${X(x)},${base}v6" stroke="#61737c"/><text x="${X(x)}" y="${base+25}" text-anchor="middle">${number(x)}</text>`).join('')}<text x="${W-R}" y="${H-8}" text-anchor="end">${escape(xlabel)}</text></g></svg>`;
  }
  return {normalPdf,normalCdf,upper,uniformCdf,triangularCdf,uniformMoments,randomNormal,number,midpointAreas,chart};
});
