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
  const api={TARGET,formatSeconds,summary,roundedBucket,chartBounds};
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
        <div class="sw-history-heading"><h5>${dual('Recent attempts','最近の記録')}</h5><button type="button" data-clear>${dual('Clear trials','記録を消す')}</button></div><ol class="sw-history" data-history></ol>
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
      q('[data-history]').innerHTML=trials.slice(-6).map((seconds,i)=>{const hit=Math.abs(seconds-TARGET)<=tolerance+1e-12;return `<li><span>#${trials.length-Math.min(6,trials.length)+i+1}</span><b>${formatSeconds(seconds,6)} s</b><span>${t(hit?'Within window':'Outside window',hit?'範囲内':'範囲外')}</span></li>`;}).reverse().join('')||`<li>${t('No trials yet.','まだ記録がありません。')}</li>`;
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
