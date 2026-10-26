/* A human timing experiment, not random draws from an assumed distribution. */
(function(global){
  'use strict';
  const TARGET=1;
  function formatSeconds(seconds,places=6){return Math.max(0,seconds).toFixed(places).padStart(places+3,'0');}
  function summary(trials,tolerance){
    const hits=trials.filter(seconds=>Math.abs(seconds-TARGET)<=tolerance+1e-12).length;
    return {count:trials.length,hits,share:trials.length?hits/trials.length:null};
  }
  function roundedBucket(value,places){const half=.5*10**(-places);return {low:value-half,high:value+half};}
  function chartBounds(zoom){const half=1/zoom;return {low:Math.max(0,TARGET-half),high:TARGET+half};}
  function recordLists(trials){
    const records=trials.map((seconds,i)=>({seconds,attempt:i+1,error:seconds-TARGET}));
    return {latest:records.slice(-10).reverse(),best:[...records].sort((a,b)=>{
      const difference=Math.abs(a.error)-Math.abs(b.error);
      return Math.abs(difference)<1e-12?a.attempt-b.attempt:difference;
    }).slice(0,10)};
  }
  function bellModel(trials){
    if(trials.length<5)return {kind:'reference',count:trials.length,mean:TARGET,sd:.1};
    let mean=0,squares=0;
    trials.forEach((value,i)=>{const difference=value-mean;mean+=difference/(i+1);squares+=difference*(value-mean);});
    const sd=Math.sqrt(Math.max(0,squares/(trials.length-1)));
    return {kind:sd>0?'fitted':'degenerate',count:trials.length,mean,sd};
  }
  function bellGraphic(trials,tolerance,labels={}){
    const model=bellModel(trials),{mean,sd}=model;
    const low=0,high=Math.max(2,mean+4*sd,...trials.map(v=>v*1.05)),left=56,right=720,top=28,base=180,bins=20,width=high/bins;
    const X=x=>left+(x-low)/high*(right-left),counts=Array(bins).fill(0);
    trials.forEach(v=>counts[Math.min(bins-1,Math.floor(v/width))]++);
    const pdf=x=>sd>0?Math.exp(-.5*((x-mean)/sd)**2)/(sd*Math.sqrt(2*Math.PI)):0;
    const peak=sd>0?pdf(mean):0,max=Math.max(peak,...counts.map(n=>trials.length?n/trials.length/width:0),1)*1.15;
    const Y=y=>base-y/max*(base-top);
    // Include the mean explicitly, even when a very narrow fitted peak falls between uniform x samples.
    const xs=[...Array.from({length:401},(_,i)=>i*high/400),...Array.from({length:161},(_,i)=>mean+(i-80)*sd/20)].filter(x=>x>=0&&x<=high).sort((a,b)=>a-b);
    const path=xs.map((x,i)=>`${i?'L':'M'}${X(x).toFixed(3)},${Y(pdf(x)).toFixed(3)}`).join(' ');
    const bars=counts.map((n,i)=>`<rect x="${X(i*width)+1}" y="${Y(trials.length?n/trials.length/width:0)}" width="${(right-left)/bins-2}" height="${base-Y(trials.length?n/trials.length/width:0)}" class="sw-bell-bar"/>`).join('');
    return `<svg viewBox="0 0 760 230" role="img" aria-label="${labels.chart||'Observed histogram and illustrative normal curve'}"><text x="${left}" y="16">${labels.density||'Density'}</text><rect x="${X(TARGET-tolerance)}" y="${top}" width="${X(TARGET+tolerance)-X(TARGET-tolerance)}" height="${base-top}" class="sw-window"/>${bars}${sd>0?`<path d="${path}" class="sw-bell-curve ${model.kind}"/>`:''}<line x1="${X(TARGET)}" x2="${X(TARGET)}" y1="${top}" y2="${base}" class="sw-target-line"/><text x="${X(TARGET)}" y="${top+12}" text-anchor="middle">${labels.target||'Target'} 1 s</text><path d="M${left},${top}V${base}H${right}" class="sw-axis" fill="none"/>${[0,.5,1].map(f=>`<text x="${left-8}" y="${Y(max*f)+4}" text-anchor="end">${(max*f).toFixed(1)}</text>`).join('')}${Array.from({length:5},(_,i)=>i*high/4).map(v=>`<text x="${X(v)}" y="205" text-anchor="middle">${v.toFixed(high>10?1:2)}</text>`).join('')}<text x="${right}" y="225" text-anchor="end">${labels.seconds||'Seconds'}</text></svg>`;
  }
  const api={TARGET,formatSeconds,summary,roundedBucket,chartBounds,recordLists,bellModel,bellGraphic};
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(!global.document)return;
  const dual=(en,ja)=>`<span class="lang-en" lang="en">${en}</span><span class="lang-ja" lang="ja">${ja}</span>`;
  const t=(en,ja)=>document.documentElement.dataset.language==='en'?en:ja;
  function setup(root){
    if(root.dataset.ready)return;root.dataset.ready='true';
    const places=6,tolerance=.1;
    let running=false,started=0,elapsed=0,frame=0,trials=[],zoom=1;
    root.classList.add('stopwatch-lab');
    const ticks=Array.from({length:60},(_,i)=>`<i class="${i%5===0?'major':''}" style="--tick:${i}" aria-hidden="true"></i>`).join('');
    root.innerHTML=`<header class="w5-heading"><div><p class="sw-eyebrow">${dual('THE 1-SECOND CHALLENGE','1秒チャレンジ')}</p><h4>${dual('Can you stop at exactly 1 second?','ぴったり1秒で、止められる？')}</h4></div><p>${dual('Press Start, then Stop as close to 1 second as you can. Try a few times.','スタートを押し、1秒ぴったりを狙ってストップ。何回か試してみよう。')}</p></header>
      <div class="sw-layout"><section class="sw-instrument" aria-label="${t('Stopwatch','ストップウォッチ')}">
        <div class="sw-watch" aria-hidden="true"><div class="sw-loop"></div><div class="sw-crown"></div><div class="sw-side"></div><div class="sw-case"><div class="sw-face">${ticks}<b class="sw-n n0">60</b><b class="sw-n n10">10</b><b class="sw-n n20">20</b><b class="sw-n n30">30</b><b class="sw-n n40">40</b><b class="sw-n n50">50</b><div class="sw-brand"><span class="sw-omega">Ω</span><br>OMEGA<br><small>STOPWATCH</small></div><div class="sw-hand" data-hand></div><div class="sw-pin"></div><span class="sw-target-label">TARGET · ${TARGET} SEC</span></div></div></div>
        <div class="sw-display"><span class="sw-display-label">ELAPSED / SEC</span><output data-time aria-label="Elapsed seconds / 経過秒数">00.000000</output><span class="sw-display-state" data-clock-state>READY</span></div>
        <div class="sw-buttons"><button type="button" data-toggle data-running="false">${dual('Start','スタート')}</button></div>
        <p class="sw-status" role="status" data-status></p>
        <p class="sw-recreation">${dual('Classroom recreation · not an official OMEGA timer','授業用の再現 · OMEGA公式の計測器ではありません')}</p>
        <p class="sw-precision-note">${dual('Six decimal places ≠ microsecond accuracy. This readout uses the browser clock, whose resolution varies by device.','小数6桁の表示 ≠ マイクロ秒の精度。ブラウザの時計を使うため、時間の分解能は端末によって異なります。')}</p>
      </section><section class="sw-observations">
        <h5>${dual('An exact value, or a window?','ぴったり1点？ それとも、範囲？')}</h5>
        <div class="sw-last" data-last></div>
        <div class="w5-formula"><strong>${dual('OBSERVED SHARE · YOUR TRIALS','実測の割合 · 自分の記録')}</strong><div data-probability></div></div>
        <div class="sw-chart-toolbar" role="group" aria-label="Chart zoom / グラフの拡大"><button type="button" data-zoom-in aria-label="Zoom in / 拡大">＋</button><button type="button" data-zoom-out aria-label="Zoom out / 縮小">−</button><button type="button" data-zoom-reset>${dual('Reset view','表示を戻す')}</button><button type="button" data-zoom-fit>${dual('Show all','全記録を表示')}</button><output data-zoom-level></output></div>
        <div class="sw-chart-legend"><span class="sw-legend-within">${dual('Within window','範囲内')}</span><span class="sw-legend-outside">${dual('Outside window','範囲外')}</span></div>
        <div class="sw-chart" data-plot></div>
        <p class="sw-chart-note">${dual('Zoom with + / − or scroll over the chart. Hover, tap, or focus a dot to read its seconds. Edge triangles mark records outside the view. Zoom changes the view, not the success window or results.','＋ / − またはグラフ上のスクロールで拡大・縮小。点に触れるか、マウスやキーボードで選ぶと秒数を表示。表示範囲の外の記録は端の三角です。拡大しても、成功の範囲や記録は変わりません。')}</p>
        <section class="sw-bell-panel"><h5>${dual('Your records and a bell curve','記録の形と、ベル曲線')}</h5><p class="sw-bell-terms">${dual('Normal distribution · illustrative fit','正規分布 <small>Normal distribution</small> · 参考の当てはめ')}</p><div class="sw-chart" data-bell></div><div class="sw-bell-legend"><span>${dual('Bars: observed density','棒：実測の密度')}</span><span>${dual('Line: illustrative normal curve','線：参考の正規曲線')}</span></div><p class="sw-bell-summary" data-bell-summary></p><p class="sw-chart-note" data-bell-note></p></section>
        <div class="sw-history-heading"><h5>${dual('Your records','自分の記録')}</h5><button type="button" data-clear>${dual('Clear trials','記録を消す')}</button></div>
        <div class="sw-records-grid"><section><h6>${dual('Top 10','トップ10')}</h6><p class="sw-records-note">${dual('Closest to 1 second. Ties: earlier attempt first.','1秒に近い順。同じずれなら、先の記録を優先。')}</p><ol class="sw-history sw-best" data-best aria-label="Top 10 records / トップ10"></ol></section><section><h6>${dual('Last 10','直近10回')}</h6><p class="sw-records-note">${dual('Newest first.','新しい記録から表示。')}</p><ol class="sw-history" data-history aria-label="Last 10 attempts / 直近10回"></ol></section></div>
        <p class="sw-model-note">${dual('X = your next stopping time. These are your observations, not a uniform or normal model.','X＝次に止めるまでの時間。これは自分の実測で、一様分布や正規分布を仮定していません。')}</p>
      </section></div>`;
    const q=selector=>root.querySelector(selector);
    function paint(){
      q('[data-time]').textContent=formatSeconds(elapsed,places);
      q('[data-hand]').style.transform=`translateX(-50%) rotate(${elapsed*6}deg)`;
      q('[data-clock-state]').textContent=running?'RUNNING':trials.length?'STOPPED':'READY';
    }
    function tick(){if(!running)return;elapsed=(performance.now()-started)/1000;paint();frame=requestAnimationFrame(tick);}
    function draw(){
      const s=summary(trials,tolerance),last=trials.at(-1),decimals=tolerance<.1?2:1;
      q('[data-toggle]').textContent=running?t('Stop','ストップ'):t('Start','スタート');
      q('[data-toggle]').dataset.running=String(running);
      q('[data-clear]').disabled=running||!trials.length;
      q('[data-probability]').textContent=`${(TARGET-tolerance).toFixed(decimals)} ≤ X ≤ ${(TARGET+tolerance).toFixed(decimals)} ${t('seconds','秒')} · ${s.hits} / ${s.count} = ${s.share===null?'—':(100*s.share).toFixed(1)+'%'}`;
      if(last===undefined){q('[data-last]').textContent=t('Your first result will appear here.','最初の結果がここに表示されます。');}
      else{
        const error=last-TARGET,bucket=roundedBucket(Number(last.toFixed(places)),places),hit=Math.abs(error)<=tolerance+1e-12;
        q('[data-last]').innerHTML=`<p class="sw-error ${hit?'within':''}">${error>=0?'+':'−'}${Math.abs(error).toFixed(6)} s <span>${t(error>=0?'late':'early',error>=0?'遅い':'早い')}</span></p><p>${t(`At ${places} decimal places, the display is ${formatSeconds(last,places)}.`,`小数${places}桁では ${formatSeconds(last,places)} と表示されます。`)}</p><p class="sw-rounding">${t('Recorded values that round to that display:','この表示に丸められる記録値の範囲：')}<br>${bucket.low.toFixed(places+1)} ≤ x &lt; ${bucket.high.toFixed(places+1)} s<br>${t('This describes rounding, not the physical accuracy of the clock.','これは丸めの説明で、時計の測定精度を保証する範囲ではありません。')}</p>`;
      }
      q('[data-status]').textContent=running?t('Running. Stop when you think it is 1 second.','計測中。1秒だと思ったらストップ。'):last===undefined?t('Ready when you are.','準備ができたらスタート。'):t('Result saved. Start begins a new attempt from zero.','記録しました。スタートで0秒から次の挑戦。');
      const records=recordLists(trials),empty=`<li>${t('No trials yet.','まだ記録がありません。')}</li>`;
      q('[data-history]').innerHTML=records.latest.map(({seconds,attempt,error})=>{
        const hit=Math.abs(error)<=tolerance+1e-12;
        return `<li class="${hit?'within':'outside'}"><span>#${attempt}</span><b>${formatSeconds(seconds,6)} s<small>${t(hit?'Within window':'Outside window',hit?'範囲内':'範囲外')}</small></b></li>`;
      }).join('')||empty;
      q('[data-best]').innerHTML=records.best.map(({seconds,attempt,error},i)=>{
        const hit=Math.abs(error)<=tolerance+1e-12;
        return `<li class="${hit?'within':'outside'}"><span>${i+1}<small>#${attempt}</small></span><b>${formatSeconds(seconds,6)} s<small>${t('Error','ずれ')} ${error>=0?'+':'−'}${Math.abs(error).toFixed(6)} s</small></b></li>`;
      }).join('')||empty;
      const {low,high}=chartBounds(zoom),tickPlaces=Math.min(6,Math.max(1,Math.ceil(-Math.log10((high-low)/4))+1));
      const position=seconds=>50+Math.max(0,Math.min(1,(seconds-low)/(high-low)))*660;
      const marks=trials.map((seconds,i)=>{
        const px=position(seconds),py=55+(i%4)*17,hit=Math.abs(seconds-TARGET)<=tolerance+1e-12;
        const label=`#${i+1} · ${seconds.toFixed(6)} s · ${t(hit?'Within window':'Outside window',hit?'範囲内':'範囲外')}`;
        const shape=seconds<low?`<path d="M${px+6} ${py-5}l-8 5 8 5z"/>`:seconds>high?`<path d="M${px-6} ${py-5}l8 5-8 5z"/>`:`<circle cx="${px}" cy="${py}" r="5"/>`;
        const tx=Math.max(150,Math.min(610,px));
        return `<g class="sw-point ${hit?'within':'outside'}" tabindex="0" role="img" aria-label="${label}"><title>${label}</title><circle class="sw-point-hit" cx="${px}" cy="${py}" r="11"/>${shape}<g class="sw-point-tooltip" pointer-events="none"><rect x="${tx-145}" y="${py-35}" width="290" height="26" rx="4"/><text x="${tx}" y="${py-17}" text-anchor="middle">${label}</text></g></g>`;
      }).join('');
      q('[data-plot]').innerHTML=`<svg viewBox="0 0 760 160" role="group" aria-label="${t('Recorded stopping times around 1 second','1秒付近の停止時間の記録')}"><rect x="${position(TARGET-tolerance)}" y="25" width="${position(TARGET+tolerance)-position(TARGET-tolerance)}" height="92" class="sw-window"/><line x1="${position(TARGET)}" y1="20" x2="${position(TARGET)}" y2="120" class="sw-target-line"/><text x="${position(TARGET)}" y="14" text-anchor="middle">${t('TARGET 1','目標 1秒')}</text><line x1="50" x2="710" y1="120" y2="120" class="sw-axis"/>${Array.from({length:5},(_,i)=>low+i*(high-low)/4).map(v=>`<text x="${position(v)}" y="145" text-anchor="middle">${v.toFixed(tickPlaces)} s</text>`).join('')}${marks}</svg>`;
      q('[data-zoom-level]').textContent=`${Number(zoom.toPrecision(4))}×`;
      q('[data-zoom-in]').disabled=zoom>=10000;
      q('[data-zoom-out]').disabled=zoom<=.01;
      const bell=bellModel(trials);
      q('[data-bell]').innerHTML=bellGraphic(trials,tolerance,{chart:t('Recorded stopping times and an illustrative normal curve','停止時間の実測と参考の正規曲線'),density:t('Density','密度 / Density'),target:t('Target','目標'),seconds:t('Seconds','秒 / Seconds')});
      q('[data-bell-summary]').textContent=bell.kind==='fitted'?t(`Fitted to ${bell.count} attempts · mean ${bell.mean.toFixed(6)} s · sample SD ${bell.sd.toFixed(6)} s`,`${bell.count}回の記録から当てはめ · 平均 ${bell.mean.toFixed(6)} 秒 · 標準偏差 ${bell.sd.toFixed(6)} 秒`):bell.kind==='reference'?t('Reference only: assumed mean 1 s and SD 0.1 s. After 5 attempts, the line uses your measured mean and sample SD.','最初は参考図：平均1秒・標準偏差0.1秒を仮定。5回記録すると、自分の平均と標本標準偏差で曲線を描きます。'):t('All recorded times are identical. A fitted bell curve needs nonzero spread.','記録がすべて同じ値です。ばらつきが0のため、ベル曲線は当てはめられません。');
      q('[data-bell-note]').textContent=t('The line is an illustrative normal fit, not evidence that stopping times follow a normal distribution. Height is density, not probability. The shaded band marks 0.9–1.1 s. The observed share above is counted from your records, not this curve.','曲線は参考の正規モデルで、停止時間が正規分布に従う証拠ではありません。高さは密度で、確率ではありません。帯は0.9〜1.1秒。上の実測の割合は、この曲線ではなく記録を数えた値です。');
      paint();
    }
    q('[data-toggle]').addEventListener('click',()=>{
      if(running){elapsed=(performance.now()-started)/1000;running=false;cancelAnimationFrame(frame);trials.push(elapsed);draw();}
      else{elapsed=0;started=performance.now();running=true;draw();frame=requestAnimationFrame(tick);}
    });
    q('[data-clear]').addEventListener('click',()=>{if(running)return;trials=[];elapsed=0;draw();});
    function setZoom(value){zoom=Math.max(.01,Math.min(10000,value));draw();}
    q('[data-zoom-in]').addEventListener('click',()=>setZoom(zoom*2));
    q('[data-zoom-out]').addEventListener('click',()=>setZoom(zoom/2));
    q('[data-zoom-reset]').addEventListener('click',()=>setZoom(1));
    q('[data-zoom-fit]').addEventListener('click',()=>setZoom(trials.length?1/Math.max(.001,...trials.map(v=>Math.abs(v-TARGET)*1.1)):1));
    q('[data-plot]').addEventListener('wheel',event=>{if(!event.deltaY)return;event.preventDefault();setZoom(zoom*(event.deltaY<0?1.25:.8));},{passive:false});
    q('[data-plot]').addEventListener('click',event=>event.target.closest('.sw-point')?.focus());
    new MutationObserver(draw).observe(document.documentElement,{attributes:true,attributeFilter:['data-language']});
    draw();
  }
  const init=()=>document.querySelectorAll('[data-week5-stopwatch]').forEach(setup);
  document.addEventListener('statsb:agenda-rendered',init);init();
})(typeof window==='undefined'?globalThis:window);
