(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.FutureStats=factory();})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 const mean=a=>a.reduce((s,v)=>s+v,0)/a.length;
 function summary(a){const n=a.length,m=mean(a),ss=a.reduce((s,v)=>s+(v-m)**2,0);return {n,mean:m,ss,variance:ss/n,s2:ss/(n-1),sd:Math.sqrt(ss/(n-1)),se:Math.sqrt(ss/(n*(n-1))),df:n-1};}
 function lg(z){const c=[676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];if(z<.5)return Math.log(Math.PI)-Math.log(Math.sin(Math.PI*z))-lg(1-z);z--;let x=.99999999999980993;c.forEach((v,i)=>x+=v/(z+i+1));const t=z+7.5;return .5*Math.log(2*Math.PI)+(z+.5)*Math.log(t)-t+Math.log(x);}
 function betaFraction(a,b,x){let c=1,d=1-(a+b)*x/(a+1);d=1/(Math.abs(d)<1e-30?1e-30:d);let h=d;for(let m=1;m<250;m++){let aa=m*(b-m)*x/((a+2*m-1)*(a+2*m));d=1+aa*d;if(Math.abs(d)<1e-30)d=1e-30;c=1+aa/c;if(Math.abs(c)<1e-30)c=1e-30;d=1/d;h*=d*c;aa=-(a+m)*(a+b+m)*x/((a+2*m)*(a+2*m+1));d=1+aa*d;if(Math.abs(d)<1e-30)d=1e-30;c=1+aa/c;if(Math.abs(c)<1e-30)c=1e-30;d=1/d;const del=d*c;h*=del;if(Math.abs(del-1)<3e-13)break;}return h;}
 function beta(x,a,b){if(x<=0)return 0;if(x>=1)return 1;const v=Math.exp(lg(a+b)-lg(a)-lg(b)+a*Math.log(x)+b*Math.log1p(-x));return x<(a+1)/(a+b+2)?v*betaFraction(a,b,x)/a:1-v*betaFraction(b,a,1-x)/b;}
 function gammaP(a,x){if(x<=0)return 0;if(x<a+1){let term=1/a,sum=term;for(let n=1;n<500;n++){term*=x/(a+n);sum+=term;if(Math.abs(term)<Math.abs(sum)*1e-14)break;}return sum*Math.exp(-x+a*Math.log(x)-lg(a));}let b=x+1-a,c=1e30,d=1/b,h=d;for(let i=1;i<500;i++){const an=-i*(i-a);b+=2;d=an*d+b;if(Math.abs(d)<1e-30)d=1e-30;c=b+an/c;if(Math.abs(c)<1e-30)c=1e-30;d=1/d;const del=d*c;h*=del;if(Math.abs(del-1)<1e-14)break;}return 1-Math.exp(-x+a*Math.log(x)-lg(a))*h;}
 const normalPdf=(x,m=0,s=1)=>Math.exp(-.5*((x-m)/s)**2)/(s*Math.sqrt(2*Math.PI));
 const normalCdf=x=>{if(x===0)return .5;const p=gammaP(.5,x*x/2);return x<0?(1-p)/2:(1+p)/2;};
 const tPdf=(x,df)=>Math.exp(lg((df+1)/2)-lg(df/2)-.5*Math.log(df*Math.PI)-(df+1)/2*Math.log1p(x*x/df));
 const tCdf=(x,df)=>{const q=.5*beta(df/(df+x*x),df/2,.5);return x<0?q:1-q;};
 const chiPdf=(x,df)=>x<=0?0:Math.exp((df/2-1)*Math.log(x)-x/2-df/2*Math.log(2)-lg(df/2));
 const chiCdf=(x,df)=>gammaP(df/2,x/2);
 function inverse(cdf,p,lo=-20,hi=20){while(cdf(hi)<p)hi*=2;for(let i=0;i<90;i++){const mid=(lo+hi)/2;if(cdf(mid)<p)lo=mid;else hi=mid;}return (lo+hi)/2;}
 const tq=(alpha,df)=>inverse(x=>tCdf(x,df),1-alpha);
 const chiq=(alpha,df)=>inverse(x=>chiCdf(x,df),1-alpha,0,Math.max(30,df*3));
 const zq=alpha=>inverse(normalCdf,1-alpha);
 const normal=()=>Math.sqrt(-2*Math.log(Math.max(Number.EPSILON,Math.random())))*Math.cos(2*Math.PI*Math.random());
 function ci(a,confidence=.95){const s=summary(a),q=tq((1-confidence)/2,s.df);return {...s,q,lower:s.mean-q*s.se,upper:s.mean+q*s.se};}
 function varianceCi(a,confidence=.95){const s=summary(a),alpha=(1-confidence)/2,high=chiq(alpha,s.df),low=chiq(1-alpha,s.df);return {...s,high,low,lower:s.ss/high,upper:s.ss/low};}
 function regression(points){const n=points.length,x=points.map(p=>p[0]),y=points.map(p=>p[1]),xm=mean(x),ym=mean(y),sxx=x.reduce((s,v)=>s+(v-xm)**2,0),sxy=x.reduce((s,v,i)=>s+(v-xm)*(y[i]-ym),0),b=sxy/sxx,a=ym-b*xm,residuals=x.map((v,i)=>y[i]-a-b*v),sse=residuals.reduce((s,v)=>s+v*v,0),sst=y.reduce((s,v)=>s+(v-ym)**2,0),r2=1-sse/sst,df=n-2,se=Math.sqrt(sse/df/sxx),t=b/se,p=2*(1-tCdf(Math.abs(t),df));return {n,a,b,sse,sst,r2,adjusted:1-(1-r2)*(n-1)/df,se,t,p,df,residuals,xm,ym};}
 const choose=(n,k)=>{let r=1;for(let i=1;i<=k;i++)r=r*(n-i+1)/i;return r;};
 return {mean,summary,normalPdf,normalCdf,tPdf,tCdf,chiPdf,chiCdf,tq,chiq,zq,normal,ci,varianceCi,regression,choose};
});
