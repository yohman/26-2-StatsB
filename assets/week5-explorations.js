/* Exam-style continuous-distribution explorations; no worksheet answer cells. */
(() => {
  const M=window.StatsBWeek5Math;
  const t=(en,ja)=>document.documentElement.dataset.language==='en'?en:ja;
  const dual=(en,ja)=>`<span class="lang-en">${en}</span><span class="lang-ja" lang="ja">${ja}</span>`;
  const math=(tex,fallback)=>`<div data-display-math="${tex.replaceAll('&','&amp;').replaceAll('"','&quot;')}">${fallback}</div>`;
  const pct=x=>(100*x+1e-9).toFixed(2)+'%';
  const n=M.number;
  const control=(key,en,ja,min,max,step,value)=>`<label class="w5-control">${dual(en,ja)} <output data-value="${key}">${value}</output><input type="range" data-input="${key}" min="${min}" max="${max}" step="${step}" value="${value}"></label>`;
  const titles={normal:['Robot heights: SD and z-scores','ロボットの身長：標準偏差とzスコア'],table:['Read the normal table: tails and intervals','正規分布表：上側・下側・区間']};
  function lookupView(lookup){
    if(!lookup.inRange)return `<p class="w5-lookup-warning">${t(`|z| = ${n(Math.abs(lookup.z))} is outside this printed table (0.00–3.09). No table cell is selected. The answer shown uses numerical calculation, not a table lookup.`,`|z|＝${n(Math.abs(lookup.z))}は、この表の範囲（0.00〜3.09）外です。該当するセルはありません。表示した答えは表の値ではなく、数値計算によるものです。`)}</p>`;
    const {row,col,lookupZ,tail}=lookup;
    return `<p class="w5-lookup-convention">${t('Upper-tail table · area to the RIGHT of a positive z · textbook p.124','上側確率の表：正のzより右側の面積 · 教科書 p.124')}</p>
      <p class="w5-lookup-address">${t('Row','行')} <b>${(row/10).toFixed(1)}</b> ＋ ${t('column','列')} <b>${(col/100).toFixed(2)}</b> ＝ <b>${lookupZ.toFixed(2)}</b></p>
      <div class="w5-table-wrap"><table class="w5-table"><caption>${t('Highlighted intersection = upper-tail probability','色付きの交点＝表から読む上側確率')}</caption><thead><tr><th scope="col">z</th>${Array.from({length:10},(_,i)=>`<th scope="col" class="${col===i?'is-col':''}">${(i/100).toFixed(2)}</th>`).join('')}</tr></thead><tbody>${lookup.rows.map(r=>`<tr><th scope="row" class="${r===row?'is-row':''}">${(r/10).toFixed(1)}</th>${Array.from({length:10},(_,i)=>`<td class="${r===row&&i===col?'is-answer':r===row?'is-row':col===i?'is-col':''}"${r===row&&i===col?' aria-current="true"':''}>${M.upper((r*10+i)/100).toFixed(5)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
      <p class="w5-lookup-value">${t('Read the highlighted cell','色付きのセルを読む')}：<strong>${tail.toFixed(5)}</strong></p>`;
  }
  function setup(root){
    if(root.dataset.ready||!['normal','table'].includes(root.dataset.week5Lab))return;root.dataset.ready='true';const kind=root.dataset.week5Lab,isNormal=kind==='normal',isTable=kind==='table';
    let mu=160,sd=5,x=165,z=1.96,left=-.5,preset='robot',samples=[],mode='upper',epoch=0,busy=false;
    const robot=window.statsbMontyCharacters?.robot||'🤖';
    root.innerHTML=`<header class="w5-heading"><h4>${dual(...titles[kind])}</h4><p>${dual('Change the given values → follow the formula → explain the shaded area.','与えられた値を変える → 式をたどる → 色の面積を説明する。')}</p></header>
      <div class="w5-formula"><strong>${dual('FORMULA · textbook pp.123–125','公式 · 教科書 p.123–125')}</strong><div data-symbolic></div></div>
      <div class="w5-grid"><section class="w5-card"><h5>${dual('① Given & question','① 与えられた値・問題')}</h5><p data-question></p>
      ${isNormal?`<label class="w5-control">${dual('Scenario','場面')} <select data-preset><option value="robot">${t('Robot heights','ロボットの身長')}</option><option value="exam">${t('Exam scores','試験の点数')}</option></select></label><div class="w5-modes"><button type="button" data-normal-mode="upper" aria-pressed="true">${dual('Value to probability','値から確率へ')}</button><button type="button" data-normal-mode="cutoff" aria-pressed="false">${dual('Top 5% cutoff','上位5％の境界')}</button></div>`:''}
      ${isTable?control('z','Positive z / right boundary','正のz・区間の右の境界',0,3.09,.01,z):control('mu','Mean μ','平均 μ',30,190,.1,mu)+control('variance','Variance σ²','分散 σ²',1,400,.01,sd**2)+`<div data-boundary-control>${control('x','Boundary x (cm or points)','境界 x（cm または点）',0,210,.1,x)}</div>`}
      ${isTable?`<div data-left-control hidden>${control('left','Left boundary a','区間の左の境界 a',-3.09,3.09,.01,left)}</div>`:''}
      <button type="button" data-change>${dual('Change the numbers','数値を変えてみる')}</button><button type="button" data-default>${dual('Original question','元の問題')}</button>
      <div class="w5-substitution"><strong>${dual('② Substitute','② 数値を代入')}</strong><div data-substitution></div><p class="w5-answer" data-answer></p><p data-reading></p></div></section>
      <section class="w5-card"><h5>${dual('③ See what the answer means','③ 答えを図で確かめる')}</h5>
      ${isTable?`<div class="w5-modes">${[['upper','Right tail','右側'],['negative','Left of −z','−zの左側'],['lower','Left of +z','＋zの左側'],['central','Between −z and z','−z〜＋z'],['interval','Unequal interval','左右の幅が違う区間']].map(([id,en,ja])=>`<button type="button" data-mode="${id}" aria-pressed="${id==='upper'}">${dual(en,ja)}</button>`).join('')}</div>`:''}
      <div data-chart class="w5-chart"></div><div class="w5-key"><span>${dual('Model (fixed)','理論（固定）')}</span><span>${dual('Requested probability','求める確率')}</span>${!isTable?`<span>${dual('Simulated observations','模擬観測（ヒストグラム）')}</span>`:''}</div>
      <section class="w5-lookup"><h5>${dual('④ Derive the answer from the table','④ 表から答えを導く')}</h5><div data-lookup></div><div class="w5-lookup-calculation" data-lookup-calculation></div><a class="w5-table-link" href="viewer.html?p=&file=materials%2F2026-yoh%2Fweek05%2Fnormal-upper-tail-table.html&title=Standard%20normal%20table&week=W05&return=agenda.html%3Fp%23week-05" target="_blank" rel="noopener noreferrer">${dual('Open the complete table in a new tab','分布表の全体を新しいタブで開く')} ↗</a></section>
      ${!isTable?`<div class="w5-actions"><span class="w5-robot" data-robot>${robot}</span><button type="button" data-run="1">${dual('Measure 1','1回測る')}</button><button type="button" data-run="100">${dual('100 measurements','100回')}</button><button type="button" data-run="1000">${dual('1,000 measurements','1,000回')}</button><button type="button" data-stop hidden>${dual('Stop','停止')}</button><button type="button" data-reset>${dual('Reset','リセット')}</button></div><p class="w5-status" data-status role="status"></p><div class="w5-results" data-results></div>`:''}
      <p class="w5-note" data-note></p></section></div>`;
    const q=s=>root.querySelector(s);
    function reset(){epoch++;busy=false;samples=[];q('[data-robot]')?.classList.remove('is-running');sync();draw();}
    function sync(){root.querySelectorAll('[data-run],[data-input],[data-change],[data-default],[data-mode],[data-normal-mode],[data-preset]').forEach(el=>el.disabled=busy);if(q('[data-stop]'))q('[data-stop]').hidden=!busy;}
    function setInputs(){const vals={mu,variance:sd**2,x,z,left};root.querySelectorAll('[data-input]').forEach(el=>{el.value=vals[el.dataset.input];q(`[data-value="${el.dataset.input}"]`).textContent=n(vals[el.dataset.input]);});}
    function draw(){
      setInputs();let formula,sub,answer,reading,question,graphic,note;const metrics=[];
      if(isNormal){
        const cutoff=mode==='cutoff',score=preset==='exam',unit=score?t('points','点'):'cm',boundary=cutoff?mu+1.65*sd:x;
        q('[data-boundary-control]').hidden=cutoff;
        z=cutoff?1.65:(x-mu)/sd;const lookup=M.normalTableLookup(z);answer=lookup.probability;
        formula=String.raw`X\sim N(\mu,\sigma^2),\quad\sigma=\sqrt{\sigma^2},\quad z=\frac{x-\mu}{\sigma}`;
        question=t(`Assume ${score?'scores':'robot heights'} follow N(${n(mu)}, ${n(sd**2)}). ${cutoff?'Find the top 5% boundary, using the given z = 1.65.':`Find the probability of ${n(x)} ${unit} or higher.`}`,`${score?'得点':'ロボットの身長'}XはN(${n(mu)}, ${n(sd**2)})に従うとする。${cutoff?'上側5％のz＝1.65として、上位5％の境界は？':`${n(x)}${unit}以上の確率は？`}`);
        sub=cutoff?String.raw`\begin{aligned}\sigma&=\sqrt{${n(sd**2)}}=${n(sd)}\\1.65&=\frac{x-${n(mu)}}{${n(sd)}}\\x&=${n(mu)}+1.65\times${n(sd)}=${n(boundary)}\end{aligned}`:String.raw`\begin{aligned}\sigma&=\sqrt{${n(sd**2)}}=${n(sd)}\\z&=\frac{${n(x)}-${n(mu)}}{${n(sd)}}\approx${lookup.signedZ.toFixed(2)}\\\Pr(X\ge${n(x)})&\approx\Pr(Z\ge${lookup.signedZ.toFixed(2)})\approx${answer.toFixed(5)}\end{aligned}`;
        reading=cutoff?t(`Continuous boundary: ${n(boundary)} ${unit}.${score?` Integer scores: ${Math.ceil(boundary)} points or higher.`:''} The supplied z is rounded, so this is approximately 5%.`,`連続モデルの境界は${n(boundary)}${unit}。${score?`整数の得点なら${Math.ceil(boundary)}点以上。`:''}指定されたzは近似値。尾の面積は約5％。`):t(`One SD is ${n(sd)} ${unit}. Divide by SD, not variance. The mean maps to z = 0. This is an individual value, not a sample mean.`,`標準偏差1個分は${n(sd)}${unit}。分散で割らない。平均の位置はz＝0。これは個々の値であり、標本平均ではありません。`);
        q('[data-lookup]').innerHTML=lookupView(lookup);
        if(lookup.inRange){
          const calculation=z<0?String.raw`\begin{aligned}\Pr(Z\ge-${lookup.lookupZ.toFixed(2)})&=1-\Pr(Z>${lookup.lookupZ.toFixed(2)})\\&=1-${lookup.tail.toFixed(5)}\\&=${answer.toFixed(5)}\end{aligned}`:String.raw`\Pr(Z\ge${lookup.lookupZ.toFixed(2)})=${lookup.tail.toFixed(5)}`;
          q('[data-lookup-calculation]').innerHTML=`<p>${z<0?t('For a negative z, symmetry gives the area left of +|z|. Subtract the table value from 1.','zが負なら、左右対称より＋|z|の左側と同じ面積。表の値を全体1から引きます。'):t('For a nonnegative z, read the upper-tail value directly.','zが0以上なら、表の上側確率をそのまま使います。')}</p>${math(calculation,t('Probability from the table','表から求める確率'))}<p class="w5-lookup-rounding">${lookup.rounded?t(`Exact z = ${n(z)}; round to ${lookup.signedZ.toFixed(2)} for the table. The displayed answer is this table approximation.`,`z＝${n(z)}を小数第2位の${lookup.signedZ.toFixed(2)}に丸めて表を読みます。表示した答えは、この表による近似です。`):t('Table probabilities are rounded to 5 decimal places. Multiply by 100 to express the answer as a percentage.','表の確率は小数第5位に丸めています。100を掛けると百分率になります。')}</p>${math(String.raw`${answer.toFixed(5)}\times100=${(answer*100).toFixed(3)}\%`,pct(answer))}`;
        }else q('[data-lookup-calculation]').innerHTML='';
        graphic=M.chart({min:Math.min(mu-4*sd,boundary-sd),max:Math.max(mu+4*sd,boundary+sd),pdf:v=>M.normalPdf(v,mu,sd),lo:boundary,hi:Infinity,mean:mu,samples,title:t('Normal model: area to the right of x','正規分布モデル：x以上の面積'),xlabel:t(`Value (${unit}); ticks are one SD apart`,`値（${unit}）・目盛り間隔＝標準偏差1個分`),ticks:[-3,-2,-1,0,1,2,3].map(k=>mu+k*sd),labels:[{x:boundary,text:`${n(boundary)} ${unit} / z=${n(z)}`}]});
        metrics.push(['z',n(z)]);
      }else{
        const tail=Number(M.upper(z).toFixed(5));answer=mode==='lower'?1-tail:mode==='central'?1-2*tail:tail;
        formula=mode==='lower'?String.raw`\Pr(Z<z)=1-\Pr(Z>z)`:mode==='negative'?String.raw`\Pr(Z<-z)=\Pr(Z>z)`:mode==='central'?String.raw`\Pr(-z<Z<z)=1-2\Pr(Z>z)`:String.raw`\Pr(Z>z),\qquad Z\sim N(0,1)`;
        question=t('This table gives RIGHT-tail area, not area from zero to z. Locate the row (first decimal) and column (second decimal).','この表は右側の面積。0からzまでの面積ではない。行は小数第1位、列は小数第2位。');
        const expr=mode==='upper'?String.raw`\Pr(Z>${n(z)})`:mode==='negative'?String.raw`\Pr(Z<-${n(z)})`:mode==='lower'?String.raw`\Pr(Z<${n(z)})`:String.raw`\Pr(-${n(z)}<Z<${n(z)})`;
        sub=String.raw`${expr}=${mode==='lower'?`1-${tail.toFixed(5)}`:mode==='central'?`1-2\times${tail.toFixed(5)}`:tail.toFixed(5)}=${n(answer)}`;
        reading=t(mode==='upper'?'Read directly.':mode==='negative'?'By symmetry, the left tail at −z equals the right tail at +z.':mode==='lower'?'Everything minus the right tail.':'Everything minus both equal tails.',mode==='upper'?'表をそのまま読む。':mode==='negative'?'左右対称なので、−zの左側＝＋zの右側。':mode==='lower'?'全体1から右側の面積を引く。':'全体1から左右の尾を両方引く。');
        q('[data-left-control]').hidden=mode!=='interval';
        if(mode==='interval'){
          const lowerLookup=M.normalTableLookup(left),fLeft=1-lowerLookup.probability,fRight=1-tail;answer=fRight-fLeft;
          formula=String.raw`\Pr(a<Z<b)=F(b)-F(a)`;
          sub=String.raw`\begin{aligned}F(${n(left)})&=${left<0?fLeft.toFixed(5):'1-'+lowerLookup.tail.toFixed(5)+'='+fLeft.toFixed(5)}\\F(${n(z)})&=1-${tail.toFixed(5)}=${fRight.toFixed(5)}\\\Pr(${n(left)}<Z<${n(z)})&=${fRight.toFixed(5)}-${fLeft.toFixed(5)}=${answer.toFixed(5)}\end{aligned}`;
          reading=t('Read both boundaries separately. Do not double one tail.','左右の境界を別々に読む。同じ尾を2倍しない。');
        }
        const min=-4,max=4,a=mode==='interval'?left:mode==='upper'?z:mode==='lower'?min:mode==='negative'?min:-z,c=mode==='upper'?max:mode==='lower'?z:mode==='negative'?-z:z;
        graphic=M.chart({min,max,pdf:M.normalPdf,lo:a,hi:c,mean:0,title:t('Shaded area = requested probability','色の面積＝求める確率'),xlabel:'z',ticks:[-4,-2,0,2,4]});
        q('[data-lookup]').innerHTML=(mode==='interval'?'<h6>'+t('Left boundary','左の境界')+'</h6>'+lookupView(M.normalTableLookup(left))+'<h6>'+t('Right boundary','右の境界')+'</h6>':'')+lookupView(M.normalTableLookup(z));
        q('[data-lookup-calculation]').innerHTML=math(String.raw`${answer.toFixed(5)}\times100=${(answer*100).toFixed(3)}\%`,pct(answer));
      }
      q('[data-symbolic]').innerHTML=math(formula,t('The general formula','文字のままの公式'));q('[data-substitution]').innerHTML=math(sub,t('Calculation using the selected values','選んだ値を入れた計算'));
      q('[data-question]').textContent=question;q('[data-answer]').textContent=isNormal&&mode==='cutoff'?`${n(mu+1.65*sd)} ${preset==='exam'?t('points','点'):'cm'}`:pct(answer);q('[data-reading]').textContent=reading;q('[data-chart]').innerHTML=graphic;
      note=isTable?t('Table values are rounded to 5 decimals. Draw the requested region first. Textbook pp.124–125.','表は小数第5位に丸めています。先に欲しい部分を描こう。教科書 p.124–125。'):t('Classroom normal model, not actual robot-factory measurements. The standardized mean is 0 and SD is 1. Standardizing a non-normal variable does not make it normal. Observations do not rescale the theoretical curve.','授業用の正規モデル。工場の実測データではありません。標準化後は平均0、標準偏差1。ただし標準化だけで正規分布になるわけではありません。観測を増やしても理論の曲線・目盛りは固定。');
      q('[data-note]').textContent=note;
      // Keep the selected intersection visible without scrolling the whole page.
      if(isNormal||isTable){
        const wrap=q('[data-lookup] .w5-table-wrap'),cell=q('[data-lookup] .is-answer');
        if(wrap&&cell&&wrap.scrollWidth>wrap.clientWidth)wrap.scrollLeft=Math.max(0,cell.offsetLeft+cell.offsetWidth/2-wrap.clientWidth/2);
      }
      if(!isTable){
        const inside=samples.filter(v=>v>=(mode==='cutoff'?mu+1.65*sd:x)).length;
        const second=[t('Observed share','模擬観測の割合'),samples.length?pct(inside/samples.length):'—'];
        const modelLabel=M.normalTableLookup(z).inRange?t('Table approximation','表の近似確率'):t('Numerical model (outside table)','数値計算（表の範囲外）');
        q('[data-results]').innerHTML=[[t('Observations','測定回数'),samples.length.toLocaleString()],second,...metrics,[modelLabel,pct(answer)]].map(([a,v])=>`<div><span>${a}</span><b>${v}</b></div>`).join('');
        q('[data-status]').textContent=samples.length?t(`Latest: ${n(samples.at(-1))}. Each observation is random; the formula stays fixed.`,`今回の実現値：${n(samples.at(-1))}。測定結果は変わるが、公式の予測は変わらない。`):t('Predict first, then measure.','まず予想してから、測ろう。');
      }
    }
    root.querySelectorAll('[data-input]').forEach(el=>el.addEventListener('input',()=>{const v=Number(el.value);({mu:()=>mu=v,variance:()=>sd=Math.sqrt(v),x:()=>x=v,z:()=>{z=v;left=Math.min(left,z);},left:()=>left=Math.min(v,z)})[el.dataset.input]();reset();}));
    root.querySelectorAll('[data-mode]').forEach(el=>el.addEventListener('click',()=>{mode=el.dataset.mode;root.querySelectorAll('[data-mode]').forEach(e=>e.setAttribute('aria-pressed',String(e===el)));draw();}));
    root.querySelectorAll('[data-normal-mode]').forEach(el=>el.addEventListener('click',()=>{mode=el.dataset.normalMode;root.querySelectorAll('[data-normal-mode]').forEach(e=>e.setAttribute('aria-pressed',String(e===el)));reset();}));
    if(isNormal)q('[data-preset]').addEventListener('change',()=>{preset=q('[data-preset]').value;mu=preset==='exam'?55:160;sd=preset==='exam'?10:5;x=preset==='exam'?70:165;reset();});
    q('[data-default]').addEventListener('click',()=>{mu=160;sd=5;x=165;z=1.96;left=-.5;preset='robot';if(isNormal)q('[data-preset]').value=preset;mode='upper';root.querySelectorAll('[data-mode]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.mode===mode)));root.querySelectorAll('[data-normal-mode]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.normalMode===mode)));reset();});
    q('[data-change]').addEventListener('click',()=>{if(isTable&&mode==='interval'){left=left===-.5?-.84:-.5;z=left===-.84?1.28:1.5;}else if(isTable)z=[.67,1,1.28,1.64,1.96,2.33].find(value=>value>z)??.67;else{sd=sd===5?7:5;x=mu+(sd===7?2:1)*sd;}reset();});
    q('[data-reset]')?.addEventListener('click',reset);q('[data-stop]')?.addEventListener('click',()=>{epoch++;busy=false;q('[data-robot]').classList.remove('is-running');sync();});
    root.querySelectorAll('[data-run]').forEach(el=>el.addEventListener('click',async()=>{if(busy)return;busy=true;sync();q('[data-robot]').classList.add('is-running');const token=++epoch,total=Number(el.dataset.run);for(let i=0;i<total;i++){if(token!==epoch)return;samples.push(mu+sd*M.randomNormal());if(i%20===0||i===total-1){draw();await new Promise(r=>setTimeout(r,total===1?220:20));}}if(token===epoch){busy=false;q('[data-robot]').classList.remove('is-running');sync();}}));
    new MutationObserver(draw).observe(document.documentElement,{attributes:true,attributeFilter:['data-language']});draw();
  }
  const init=()=>document.querySelectorAll('[data-week5-lab]').forEach(setup);
  document.addEventListener('statsb:agenda-rendered',init);init();
})();
