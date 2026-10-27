/* Exam-style continuous-distribution explorations; no worksheet answer cells. */
(() => {
  const M=window.StatsBWeek5Math;
  const t=(en,ja)=>document.documentElement.dataset.language==='en'?en:ja;
  const dual=(en,ja)=>`<span class="lang-en">${en}</span><span class="lang-ja" lang="ja">${ja}</span>`;
  const math=(tex,fallback)=>`<div data-display-math="${tex.replaceAll('&','&amp;').replaceAll('"','&quot;')}">${fallback}</div>`;
  const pct=x=>(100*x).toFixed(2)+'%';
  const n=M.number;
  const control=(key,en,ja,min,max,step,value)=>`<label class="w5-control">${dual(en,ja)} <output data-value="${key}">${value}</output><input type="range" data-input="${key}" min="${min}" max="${max}" step="${step}" value="${value}"></label>`;
  const titles={area:['Ramen: probability is an area','ラーメン待ち：確率は面積'],cdf:['By this time: cumulative probability','ここまでに：累積確率'],moments:['Robot delivery: expectation & variance','ロボット配達：期待値と分散'],normal:['Exam scores: convert X to Z','試験の点数：XをZに変える'],table:['Read the upper-tail normal table','上側確率の正規分布表を読む']};
  function lookupView(lookup){
    if(!lookup.inRange)return `<p class="w5-lookup-warning">${t(`|z| = ${n(Math.abs(lookup.z))} is outside this printed table (0.00–3.09). No table cell is selected. The answer shown uses numerical calculation, not a table lookup.`,`|z|＝${n(Math.abs(lookup.z))}は、この表の範囲（0.00〜3.09）外です。該当するセルはありません。表示した答えは表の値ではなく、数値計算によるものです。`)}</p>`;
    const {row,col,lookupZ,tail}=lookup;
    return `<p class="w5-lookup-convention">${t('Upper-tail table · area to the RIGHT of a positive z · textbook p.124','上側確率の表：正のzより右側の面積 · 教科書 p.124')}</p>
      <p class="w5-lookup-address">${t('Row','行')} <b>${(row/10).toFixed(1)}</b> ＋ ${t('column','列')} <b>${(col/100).toFixed(2)}</b> ＝ <b>${lookupZ.toFixed(2)}</b></p>
      <div class="w5-table-wrap"><table class="w5-table"><caption>${t('Highlighted intersection = upper-tail probability','色付きの交点＝表から読む上側確率')}</caption><thead><tr><th scope="col">z</th>${Array.from({length:10},(_,i)=>`<th scope="col" class="${col===i?'is-col':''}">${(i/100).toFixed(2)}</th>`).join('')}</tr></thead><tbody>${lookup.rows.map(r=>`<tr><th scope="row" class="${r===row?'is-row':''}">${(r/10).toFixed(1)}</th>${Array.from({length:10},(_,i)=>`<td class="${r===row&&i===col?'is-answer':r===row?'is-row':col===i?'is-col':''}"${r===row&&i===col?' aria-current="true"':''}>${M.upper((r*10+i)/100).toFixed(5)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
      <p class="w5-lookup-value">${t('Read the highlighted cell','色付きのセルを読む')}：<strong>${tail.toFixed(5)}</strong></p>`;
  }
  function setup(root){
    if(root.dataset.ready)return;root.dataset.ready='true';const kind=root.dataset.week5Lab,isNormal=kind==='normal',isTable=kind==='table';
    let b=kind==='moments'?12:20,lo=5,hi=10,mu=50,sd=10,x=60,z=1.96,samples=[],mode='upper',epoch=0,busy=false;
    const robot=window.statsbMontyCharacters?.robot||'🤖';
    root.innerHTML=`<header class="w5-heading"><h4>${dual(...titles[kind])}</h4><p>${dual('Change the given values → follow the formula → explain the shaded area.','与えられた値を変える → 式をたどる → 色の面積を説明する。')}</p></header>
      <div class="w5-formula"><strong>${dual('FORMULA · KEEP THIS','公式 · 覚える形')}</strong><div data-symbolic></div></div>
      <div class="w5-grid"><section class="w5-card"><h5>${dual('① Given & question','① 与えられた値・問題')}</h5><p data-question></p>
      ${isTable?control('z','Positive magnitude |z|','正の大きさ |z|',0,3.09,.01,z):isNormal?control('mu','Population mean μ','母平均 μ',30,70,5,mu)+control('sd','Population SD σ','母標準偏差 σ',5,20,1,sd)+control('x','Score x','点数 x',0,100,1,x):control('b','Maximum wait b (minutes)','待ち時間の上限 b（分）',10,40,2,b)+(kind==='area'?control('lo','From a (minutes)','どこから a（分）',0,20,1,lo)+control('hi','To c (minutes)','どこまで c（分）',0,20,1,hi):kind==='cdf'?control('hi','By c (minutes)','c分以内',0,20,1,hi):'')}
      <button type="button" data-change>${dual('Change the numbers','数値を変えてみる')}</button><button type="button" data-default>${dual('Original question','元の問題')}</button>
      <div class="w5-substitution"><strong>${dual('② Substitute','② 数値を代入')}</strong><div data-substitution></div><p class="w5-answer" data-answer></p><p data-reading></p></div></section>
      <section class="w5-card"><h5>${dual('③ See what the answer means','③ 答えを図で確かめる')}</h5>
      ${isTable?`<div class="w5-modes">${[['upper','Right tail','右側'],['negative','Left of −z','−zの左側'],['lower','Left of +z','＋zの左側'],['central','Between −z and z','−z〜＋z']].map(([id,en,ja])=>`<button type="button" data-mode="${id}" aria-pressed="${id==='upper'}">${dual(en,ja)}</button>`).join('')}</div>`:''}
      <div data-chart class="w5-chart"></div><div class="w5-key"><span>${dual('Model (fixed)','理論（固定）')}</span><span>${dual('Requested probability','求める確率')}</span>${!isTable?`<span>${dual('Measured (histogram)','実測（ヒストグラム）')}</span>`:''}</div>
      ${isTable||isNormal?`<section class="w5-lookup"><h5>${dual('④ Derive the answer from the table','④ 表から答えを導く')}</h5><div data-lookup></div><div class="w5-lookup-calculation" data-lookup-calculation></div><a class="w5-table-link" href="viewer.html?file=materials%2F2026-yoh%2Fweek05%2Fnormal-upper-tail-table.html&title=Standard%20normal%20table&week=W05&return=agenda.html%23week-05" target="_blank" rel="noopener">${dual('Open the complete table','分布表の全体を開く')} ↗</a></section>`:''}
      ${!isTable?`<div class="w5-actions"><span class="w5-robot" data-robot>${robot}</span><button type="button" data-run="1">${dual('Measure 1','1回測る')}</button><button type="button" data-run="100">${dual('100 measurements','100回')}</button><button type="button" data-run="1000">${dual('1,000 measurements','1,000回')}</button><button type="button" data-stop hidden>${dual('Stop','停止')}</button><button type="button" data-reset>${dual('Reset','リセット')}</button></div><p class="w5-status" data-status role="status"></p><div class="w5-results" data-results></div>`:''}
      <p class="w5-note" data-note></p></section></div>`;
    const q=s=>root.querySelector(s);
    function reset(){epoch++;busy=false;samples=[];q('[data-robot]')?.classList.remove('is-running');sync();draw();}
    function sync(){root.querySelectorAll('[data-run],[data-input],[data-change],[data-default]').forEach(el=>el.disabled=busy);if(q('[data-stop]'))q('[data-stop]').hidden=!busy;}
    function setInputs(){const vals={b,lo,hi,mu,sd,x,z};root.querySelectorAll('[data-input]').forEach(el=>{if(['lo','hi'].includes(el.dataset.input))el.max=b;el.value=vals[el.dataset.input];q(`[data-value="${el.dataset.input}"]`).textContent=n(vals[el.dataset.input]);});}
    function draw(){
      setInputs();let formula,sub,answer,reading,question,graphic,note;const metrics=[];
      if(kind==='area'){
        answer=(hi-lo)/b;formula=String.raw`\Pr(a\le X\le c)=\int_a^c f(x)\,dx,\qquad f(x)=\frac1b\ (0\le x\le b)`;
        question=t(`A ramen shop models waiting time X as uniform from 0 to ${b} minutes. Find the probability of waiting ${lo}–${hi} minutes.`,`ラーメン店の待ち時間Xは0〜${b}分の一様分布とする。${lo}〜${hi}分待つ確率を求めよ。`);
        sub=String.raw`\Pr(${lo}\le X\le${hi})=\int_{${lo}}^{${hi}}\frac1{${b}}dx=(${hi}-${lo})\times\frac1{${b}}=${n(answer)}`;
        reading=t(`Width ${hi-lo} min × height 1/${b} per min. The density is not a probability at a point.`,`横幅${hi-lo}分 × 高さ1/${b}（1/分）。高さそのものは1点の確率ではない。`);
        graphic=M.chart({max:b,pdf:()=>1/b,lo,hi,mean:b/2,samples,title:t('Uniform density f(x)','一様分布の密度 f(x)'),xlabel:t('Wait (minutes)','待ち時間（分）'),labels:[{x:lo,text:'a'},{x:hi,text:'c'}]});
      }else if(kind==='cdf'){
        answer=M.triangularCdf(hi,b);formula=String.raw`F(c)=\Pr(X\le c)=\int_{-\infty}^{c}f(x)\,dx,\quad f(x)=\frac{2x}{b^2}\ (0\le x\le b)`;
        question=t(`A different shop has increasing density f(x)=2x/b², from 0 to ${b} min. What fraction waits no more than ${hi} min?`,`別の店では0〜${b}分で密度が右上がり f(x)=2x/b²。${hi}分以内に呼ばれる確率は？`);
        sub=String.raw`F(${hi})=\int_0^{${hi}}\frac{2x}{${b}^2}dx=\frac{${hi}^2}{${b}^2}=${n(answer)}`;
        reading=t('Left: the accumulated area. Right: that SAME number is the height of F(c). F never decreases.','左：ここまでの面積。右：その同じ数値がF(c)の高さになる。Fは減少しない。');
        graphic=`<div class="w5-cdf-pair">${M.chart({max:b,pdf:x=>2*x/b**2,lo:0,hi,samples,title:'PDF · f(x)',xlabel:t('Minutes','分'),labels:[{x:hi,text:'c'}]})}${M.chart({max:b,pdf:x=>M.triangularCdf(x,b),lo:hi,hi,cdf:true,point:{x:hi,y:answer},title:'CDF · F(x)',xlabel:t('Minutes','分'),labels:[{x:hi,text:`c = ${hi}`} ]})}</div>`;
      }else if(kind==='moments'){
        const m=M.uniformMoments(b);answer=m.mean;formula=String.raw`\mu=E(X)=\int xf(x)dx,\qquad\operatorname{Var}(X)=\int(x-\mu)^2f(x)dx`;
        question=t(`A robot takes a uniformly distributed 0–${b} minutes per delivery. Find expected time, variance, and standard deviation.`,`配達ロボットの所要時間Xは0〜${b}分の一様分布。期待値・分散・標準偏差を求めよ。`);
        sub=String.raw`\begin{aligned}E(X)&=\int_0^{${b}}x\frac1{${b}}dx=\frac{${b}}2=${n(m.mean)}\\\operatorname{Var}(X)&=\int_0^{${b}}(x-${n(m.mean)})^2\frac1{${b}}dx=\frac{${b}^2}{12}=${n(m.variance)}\\\sigma&=\sqrt{${n(m.variance)}}\approx${n(m.sd)}\end{aligned}`;
        reading=t(`Expected time ${n(m.mean)} min; variance ${n(m.variance)} min²; SD ${n(m.sd)} min. Expectation is not a guaranteed outcome.`,`期待値${n(m.mean)}分、分散${n(m.variance)}分²、標準偏差${n(m.sd)}分。毎回この時間になるわけではない。`);
        graphic=M.chart({max:b,pdf:()=>1/b,lo:b/2-m.sd,hi:b/2+m.sd,mean:m.mean,samples,title:t('Same mean, wider range → greater spread','範囲を広げると、ばらつきも大きくなる'),xlabel:t('Delivery time (minutes)','配達時間（分）'),labels:[{x:m.mean-m.sd,text:'μ − σ'},{x:m.mean+m.sd,text:'μ + σ'}]});
        metrics.push([t('Variance (min²)','分散（分²）'),n(m.variance)]);
      }else if(isNormal){
        z=(x-mu)/sd;const lookup=M.normalTableLookup(z);answer=lookup.probability;formula=String.raw`X\sim N(\mu,\sigma^2),\qquad Z=\frac{X-\mu}{\sigma}\sim N(0,1)`;
        question=t(`Assume scores follow N(${mu}, ${sd**2}). What is the probability of scoring ${x} or higher? σ=${sd} is the population SD.`,`得点XはN(${mu}, ${sd**2})に従うとする。${x}点以上の確率は？ 母標準偏差σ＝${sd}。`);
        sub=String.raw`\begin{aligned}z&=\frac{${x}-${mu}}{${sd}}\approx${lookup.signedZ.toFixed(2)}\\\Pr(X\ge${x})&=\Pr(Z\ge${n(z)})\approx${answer.toFixed(5)}\end{aligned}`;
        reading=t(`z = ${n(z)}: ${n(Math.abs(z))} population SDs ${z<0?'below':'above'} the mean. This is ONE score, not a sample mean.`,`z＝${n(z)}：平均より標準偏差${n(Math.abs(z))}個分${z<0?'下':'上'}。これは1人の得点で、標本平均ではありません。`);
        q('[data-lookup]').innerHTML=lookupView(lookup);
        if(lookup.inRange){
          const calculation=z<0?String.raw`\begin{aligned}\Pr(Z\ge-${lookup.lookupZ.toFixed(2)})&=1-\Pr(Z>${lookup.lookupZ.toFixed(2)})\\&=1-${lookup.tail.toFixed(5)}\\&=${answer.toFixed(5)}\end{aligned}`:String.raw`\Pr(Z\ge${lookup.lookupZ.toFixed(2)})=${lookup.tail.toFixed(5)}`;
          q('[data-lookup-calculation]').innerHTML=`<p>${z<0?t('For a negative z, symmetry gives the area left of +|z|. Subtract the table value from 1.','zが負なら、左右対称より＋|z|の左側と同じ面積。表の値を全体1から引きます。'):t('For a nonnegative z, read the upper-tail value directly.','zが0以上なら、表の上側確率をそのまま使います。')}</p>${math(calculation,t('Probability from the table','表から求める確率'))}<p class="w5-lookup-rounding">${lookup.rounded?t(`Exact z = ${n(z)}; round to ${lookup.signedZ.toFixed(2)} for the table. The displayed answer is this table approximation.`,`z＝${n(z)}を小数第2位の${lookup.signedZ.toFixed(2)}に丸めて表を読みます。表示した答えは、この表による近似です。`):t('Table probabilities are rounded to 5 decimal places. Multiply by 100 to express the answer as a percentage.','表の確率は小数第5位に丸めています。100を掛けると百分率になります。')}</p>${math(String.raw`${answer.toFixed(5)}\times100=${(answer*100).toFixed(3)}\%`,pct(answer))}`;
        }else q('[data-lookup-calculation]').innerHTML='';
        graphic=M.chart({min:Math.min(mu-4*sd,x-sd),max:Math.max(mu+4*sd,x+sd),pdf:v=>M.normalPdf(v,mu,sd),lo:x,hi:Infinity,mean:mu,samples,title:t('Normal density: area to the right of x','正規密度：x以上の面積'),xlabel:t('Score','点数'),labels:[{x,text:`x = ${x}`}]});
        metrics.push(['z',n(z)]);
      }else{
        const tail=Number(M.upper(z).toFixed(5));answer=mode==='lower'?1-tail:mode==='central'?1-2*tail:tail;
        formula=String.raw`Q(z)=\Pr(Z>z),\qquad Z\sim N(0,1)`;
        question=t('This table gives RIGHT-tail area Q(z), NOT area from zero to z. Locate the row (first decimal) and column (second decimal).','この表は右側の面積Q(z)。0からzまでの面積ではない。行は小数第1位、列は小数第2位。');
        const expr=mode==='upper'?String.raw`\Pr(Z>${n(z)})`:mode==='negative'?String.raw`\Pr(Z<-${n(z)})`:mode==='lower'?String.raw`\Pr(Z<${n(z)})`:String.raw`\Pr(-${n(z)}<Z<${n(z)})`;
        sub=String.raw`Q(${n(z)})=${tail.toFixed(5)},\quad ${expr}=${mode==='lower'?`1-${tail.toFixed(5)}`:mode==='central'?`1-2\times${tail.toFixed(5)}`:tail.toFixed(5)}=${n(answer)}`;
        reading=t(mode==='upper'?'Read directly.':mode==='negative'?'By symmetry, the left tail at −z equals the right tail at +z.':mode==='lower'?'Everything minus the right tail.':'Everything minus both equal tails.',mode==='upper'?'表をそのまま読む。':mode==='negative'?'左右対称なので、−zの左側＝＋zの右側。':mode==='lower'?'全体1から右側の面積を引く。':'全体1から左右の尾を両方引く。');
        const min=-4,max=4,a=mode==='upper'?z:mode==='lower'?min:mode==='negative'?min:-z,c=mode==='upper'?max:mode==='lower'?z:mode==='negative'?-z:z;
        graphic=M.chart({min,max,pdf:M.normalPdf,lo:a,hi:c,mean:0,title:t('Shaded area = requested probability','色の面積＝求める確率'),xlabel:'z',ticks:[-4,-2,0,2,4]});
        q('[data-lookup]').innerHTML=lookupView(M.normalTableLookup(z));
      }
      q('[data-symbolic]').innerHTML=math(formula,t('The general formula','文字のままの公式'));q('[data-substitution]').innerHTML=math(sub,t('Calculation using the selected values','選んだ値を入れた計算'));
      q('[data-question]').textContent=question;q('[data-answer]').textContent=kind==='moments'?`${n(answer)} ${t('min','分')}`:pct(answer);q('[data-reading]').textContent=reading;q('[data-chart]').innerHTML=graphic;
      note=isTable?t('Table values are rounded to 5 decimals, just like a printed lookup table. If your table gives 0-to-z areas instead, the arithmetic is different.','表は小数第5位に丸めています。0〜zの面積を示す別の表では、計算方法が変わるので表の図を必ず確認。'):isNormal?t('Illustrative normal population, independent measurements. Standardizing a non-normal variable does NOT make it normal. Samples do not rescale the theoretical curve.','授業用の正規母集団から独立に測定。正規分布でない変数を標準化しても、正規分布にはならない。実測を増やしても理論の曲線・目盛りは固定。'):t('Illustrative model, not real shop data. Each click measures one new wait. Green histogram = observations; blue curve = fixed model. ↑ indicates a bar above the fixed scale.','実際の店のデータではなく授業モデル。1回＝新しい待ち時間を1つ測定。緑の棒は実測、青い線は固定した理論。↑は固定目盛りを超えた棒。');
      if(kind==='cdf')note=t('The rising PDF and the curved CDF describe the same triangular model. The integral includes the entire density to the LEFT of c.','右上がりのPDFと曲線のCDFは同じ三角形モデル。積分はcの左側にある密度の面積を全部足す。');
      q('[data-note]').textContent=note;
      // Keep the selected intersection visible without scrolling the whole page.
      if(isNormal||isTable){
        const wrap=q('[data-lookup] .w5-table-wrap'),cell=q('[data-lookup] .is-answer');
        if(wrap&&cell&&wrap.scrollWidth>wrap.clientWidth)wrap.scrollLeft=Math.max(0,cell.offsetLeft+cell.offsetWidth/2-wrap.clientWidth/2);
      }
      if(!isTable){
        const sampleMean=samples.length?samples.reduce((a,v)=>a+v,0)/samples.length:null;
        const inside=samples.filter(v=>kind==='normal'?v>=x:kind==='area'?v>=lo&&v<=hi:kind==='cdf'?v<=hi:false).length;
        const second=kind==='moments'?[t('Measured mean (min)','実測の平均（分）'),sampleMean===null?'—':n(sampleMean)]:[t('Measured share','実測の割合'),samples.length?pct(inside/samples.length):'—'];
        const modelLabel=kind==='moments'?t('Expected time (min)','期待値（分）'):isNormal?(M.normalTableLookup(z).inRange?t('Table approximation','表の近似確率'):t('Numerical model (outside table)','数値計算（表の範囲外）')):t('Model probability','理論確率');
        q('[data-results]').innerHTML=[[t('Measurements','測定回数'),samples.length.toLocaleString()],second,...metrics,[modelLabel,kind==='moments'?n(answer):pct(answer)]].slice(0,4).map(([a,v])=>`<div><span>${a}</span><b>${v}</b></div>`).join('');
        q('[data-status]').textContent=samples.length?t(`Latest: ${n(samples.at(-1))}. Each observation is random; the formula stays fixed.`,`今回の実現値：${n(samples.at(-1))}。測定結果は変わるが、公式の予測は変わらない。`):t('Predict first, then measure.','まず予想してから、測ろう。');
      }
    }
    root.querySelectorAll('[data-input]').forEach(el=>el.addEventListener('input',()=>{const v=Number(el.value);({b:()=>{b=v;lo=Math.min(lo,b);hi=Math.min(hi,b);},lo:()=>{lo=v;hi=Math.max(lo,hi);},hi:()=>{hi=v;lo=Math.min(lo,hi);},mu:()=>mu=v,sd:()=>sd=v,x:()=>x=v,z:()=>z=v})[el.dataset.input]();reset();}));
    root.querySelectorAll('[data-mode]').forEach(el=>el.addEventListener('click',()=>{mode=el.dataset.mode;root.querySelectorAll('[data-mode]').forEach(e=>e.setAttribute('aria-pressed',String(e===el)));draw();}));
    q('[data-default]').addEventListener('click',()=>{b=kind==='moments'?12:20;lo=5;hi=10;mu=50;sd=10;x=60;z=1.96;mode='upper';root.querySelectorAll('[data-mode]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.mode===mode)));reset();});
    q('[data-change]').addEventListener('click',()=>{if(isTable)z=[.67,1,1.28,1.64,1.96,2.33].find(value=>value>z)??.67;else if(isNormal){mu=mu===50?60:50;sd=sd===10?5:10;x=mu+(mu===60?2:1)*sd;}else {b=b===20?12:20;lo=b===12?2:5;hi=b===12?8:10;}reset();});
    q('[data-reset]')?.addEventListener('click',reset);q('[data-stop]')?.addEventListener('click',()=>{epoch++;busy=false;q('[data-robot]').classList.remove('is-running');sync();});
    root.querySelectorAll('[data-run]').forEach(el=>el.addEventListener('click',async()=>{if(busy)return;busy=true;sync();q('[data-robot]').classList.add('is-running');const token=++epoch,total=Number(el.dataset.run);for(let i=0;i<total;i++){if(token!==epoch)return;samples.push(isNormal?mu+sd*M.randomNormal():kind==='cdf'?b*Math.sqrt(Math.random()):b*Math.random());if(i%20===0||i===total-1){draw();await new Promise(r=>setTimeout(r,total===1?220:20));}}if(token===epoch){busy=false;q('[data-robot]').classList.remove('is-running');sync();}}));
    new MutationObserver(draw).observe(document.documentElement,{attributes:true,attributeFilter:['data-language']});draw();
  }
  const init=()=>document.querySelectorAll('[data-week5-lab]').forEach(setup);
  document.addEventListener('statsb:agenda-rendered',init);init();
})();
