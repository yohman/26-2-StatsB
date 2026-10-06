(() => {
  const red = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
  const pockets = ['0','28','9','26','30','11','7','20','32','17','5','22','34','15','3','24','36','13','1','00','27','10','25','29','12','8','19','31','18','6','21','33','16','4','23','35','14','2'];
  const translations = new Map();
  const t = (en,ja) => { translations.set(en,[en,ja]); translations.set(ja,[en,ja]); return document.documentElement.dataset.language === 'en' ? en : ja; };
  function init(root) {
    if (root.dataset.ready) return;
    root.dataset.ready = 'true';
    let n=0, wins=0, profit=0, stakeTotal=0, history=[], expected=[], running=false, generation=0, angle=0;
    const money = x => `${x<0?'−':x>0?'+':''}¥${Math.abs(x).toLocaleString('en-US',{maximumFractionDigits:2})}`;
    const plain = x => `¥${x.toLocaleString()}`;
    root.innerHTML = `<section class="roulette-lab">
      <p class="section-kicker">${t('TEXTBOOK §2 · EXPECTED VALUE','教科書 第2節・期待値')}</p>
      <h4>${t('Almost 50/50. Still not a fair game.','ほぼ半々。でも、公平ではない。')}</h4>
      <p>${t('American roulette: 18 red, 18 black, and two green pockets. Bet on red or black; a win earns a profit equal to your stake.','アメリカンルーレット：赤18・黒18・緑2。赤か黒に賭けます。当たれば賭け金と同額の利益、外れれば賭け金を失います。')}</p>
      <div class="roulette-layout"><div class="roulette-play">
        <div class="roulette-wheel-wrap"><span class="roulette-pointer">▼</span><div class="roulette-wheel" data-wheel>${pockets.map((p,i)=>`<span style="transform:rotate(${(i+.5)*360/38}deg) translateY(-102px) rotate(90deg)">${p}</span>`).join('')}</div><div class="roulette-hub" data-pocket>?</div></div>
        <div class="roulette-result" data-result role="status">${t('Choose a color. Spin the wheel.','色を選んで、回してみよう。')}</div>
        <div class="roulette-controls"><label>${t('Stake per spin','1回の賭け金')} <input data-stake type="number" min="1" max="100000" step="1" value="100"></label><label>${t('Bet on','賭ける色')}<select data-color><option value="red">${t('Red','赤')}</option><option value="black">${t('Black','黒')}</option></select></label></div>
        <div class="roulette-actions"><button data-one>${t('Spin once','1回まわす')}</button><label>${t('Spins','回数')}<select data-count><option>100</option><option selected>1000</option><option>10000</option></select></label><button data-many>${t('Go','連続で回す')}</button><button data-stop disabled>${t('Stop','停止')}</button><button data-reset>${t('Reset','リセット')}</button></div>
      </div><div class="roulette-data"><div class="roulette-stats" data-stats></div><h5>${t('Running profit / loss','累積の利益・損失')}</h5><svg data-chart viewBox="0 0 600 280" role="img" aria-label="Actual profit and expected profit over spins"></svg><p class="roulette-key"><span>● ${t('Actual result','実際の結果')}</span><span>┄ ${t('Expected result','期待値の累計')}</span></p><p data-rate></p><div class="roulette-recent" data-recent aria-label="Recent spin results"></div></div></div>
      <div class="roulette-expectation"><h5>${t('Why −¥5.26 per ¥100?','なぜ100円あたり −5.26円？')}</h5><div class="roulette-probability"><span>${t('18 wins','18個は当たり')}<b>18 / 38</b></span><span>${t('20 losses (including 0 and 00)','20個は外れ（0・00を含む）')}<b>20 / 38</b></span></div><div class="roulette-formula" data-formula></div><p>${t('In 38 equally likely outcomes, 18 stakes are won and 20 are lost: a net loss of 2 stakes. 2 ÷ 38 = 5.26%.','38個の同じ確率の結果では、18回分の利益と20回分の損失。差は賭け金2回分の損失です。2 ÷ 38 = 5.26%。')}</p><strong>${t('An average, not a guarantee.','平均であって、保証ではありません。')}</strong><p>${t('You may finish ahead, even after many spins. The average loss per yen wagered tends toward 5.26% as the number of independent bets grows; it does not get closer on every spin. This is a classroom model, not real-money gambling.','何回まわしても、利益で終わる可能性はあります。独立な試行を増やすと、賭けた金額あたりの平均損失は5.26%に近づく傾向があります。毎回近づくわけではありません。授業用のモデルで、実際のお金は使いません。')}</p></div>
    </section>`;
    const q=s=>root.querySelector(s), wheel=q('[data-wheel]');
    wheel.style.background=`conic-gradient(${pockets.map((p,i)=>`${p==='0'||p==='00'?'#338568':red.has(+p)?'#b6474e':'#303c43'} ${i*360/38}deg ${(i+1)*360/38}deg`).join(',')})`;
    function stake(){return Math.max(1,Math.min(100000,Math.round(+q('[data-stake]').value||100)));}
    async function formula(){const b=stake(), el=q('[data-formula]'), source=`E(X)=(+${b})\\frac{18}{38}+(-${b})\\frac{20}{38}=-${b}\\frac{2}{38}\\approx-${(b*2/38).toFixed(2)}\\text{ 円}`;el.dataset.source=source;if(!el.querySelector('mjx-container'))el.textContent=`E(X) = (+${b}) × 18/38 + (−${b}) × 20/38 = ${money(-b*2/38)}`;try{if(window.MathJax?.tex2chtmlPromise){await MathJax.startup.promise;const node=await MathJax.tex2chtmlPromise(source,{display:true});if(el.dataset.source===source)el.replaceChildren(node);}}catch{}}
    function draw(){
      q('[data-stats]').innerHTML=`<div>${t('Spins','回数')}<b>${n.toLocaleString()}</b></div><div>${t('Wins / losses','勝ち / 負け')}<b>${wins} / ${n-wins}</b></div><div>${t('Total wagered','賭け金の合計')}<b>${plain(stakeTotal)}</b></div><div>${t('Your profit','あなたの損益')}<b class="${profit>=0?'positive':'negative'}">${money(profit)}</b></div>`;
      q('[data-rate]').textContent=n?t(`Actual profit per ¥100 wagered: ${money(profit/stakeTotal*100)} · Expected: −¥5.26`,`賭け金100円あたりの実際の損益：${money(profit/stakeTotal*100)} · 期待値：−¥5.26`):t('The dashed line predicts an average loss, not your next result.','点線は平均の予測。次の結果を当てる線ではありません。');
      const low=Math.min(0,...history,...expected), high=Math.max(0,...history), pad=Math.max(100,(high-low)*.12), lo=low-pad, hi=high+pad;
      const x=i=>50+i/Math.max(1,n)*525, y=v=>235-(v-lo)/(hi-lo)*205;
      const path=arr=>[0,...arr].map((v,i)=>i===0||i===n||i%Math.max(1,Math.ceil(n/500))===0?`${x(i)},${y(v)}`:null).filter(Boolean).join(' ');
      q('[data-chart]').innerHTML=`<line x1="50" y1="${y(0)}" x2="575" y2="${y(0)}" stroke="#c8c8bf"/><text x="4" y="${y(0)+4}">¥0</text><polyline points="${path(expected)}" fill="none" stroke="#bd8542" stroke-width="2" stroke-dasharray="7 5"/><polyline points="${path(history)}" fill="none" stroke="#267f86" stroke-width="3"/><text x="50" y="265">0</text><text x="500" y="265">${n} ${t('spins','回')}</text><text x="50" y="18">${money(hi-pad)}</text><text x="50" y="235">${money(lo+pad)}</text>`;
    }
    function busy(value){running=value;for(const s of ['[data-one]','[data-many]','[data-stake]','[data-color]','[data-count]'])q(s).disabled=value;q('[data-stop]').disabled=!value;}
    function result(i,b,color){const p=pockets[i], green=p==='0'||p==='00', win=!green&&(red.has(+p)?'red':'black')===color;const change=win?b:-b;n++;wins+=+win;profit+=change;stakeTotal+=b;history.push(profit);expected.push(-stakeTotal*2/38);q('[data-pocket]').textContent=p;q('[data-result]').className=`roulette-result ${win?'positive':'negative'}`;q('[data-result]').textContent=t(`${p} · ${win?'WIN':'LOSS'} ${money(change)}`,`${p} · ${win?'当たり！':'外れ'} ${money(change)}`);const chip=document.createElement('span');chip.textContent=p;chip.style.background=green?'#338568':red.has(+p)?'#b6474e':'#303c43';q('[data-recent]').prepend(chip);while(q('[data-recent]').children.length>18)q('[data-recent]').lastChild.remove();draw();}
    const pause=ms=>new Promise(r=>setTimeout(r,ms));
    async function run(count){if(running)return;const token=++generation,b=stake(),color=q('[data-color]').value;busy(true);for(let j=0;j<count;j++){if(token!==generation)break;const i=Math.floor(Math.random()*38);const speed=count===1?1200:count<=1000?35:12;angle+=count===1?1080:90;angle+=((360-(i+.5)*360/38)-angle%360+360)%360;wheel.style.transition=`transform ${speed}ms ${count===1?'cubic-bezier(.12,.7,.1,1)':'linear'}`;wheel.style.transform=`rotate(${angle}deg)`;q('[data-result]').textContent=t('Spinning…','回転中…');await pause(speed);if(token!==generation)break;result(i,b,color);if(count>1)await pause(15);}if(token===generation)busy(false);}
    q('[data-one]').onclick=()=>run(1);q('[data-many]').onclick=()=>run(+q('[data-count]').value);q('[data-stop]').onclick=()=>{generation++;busy(false);q('[data-result]').className='roulette-result';q('[data-result]').textContent=t('Paused. Results kept.','停止 · 結果は保存');};q('[data-reset]').onclick=()=>{generation++;busy(false);n=wins=profit=stakeTotal=0;history=[];expected=[];q('[data-recent]').replaceChildren();q('[data-pocket]').textContent='?';q('[data-result]').className='roulette-result';q('[data-result]').textContent=t('Choose a color. Spin the wheel.','色を選んで、回してみよう。');draw();};q('[data-stake]').oninput=formula;q('[data-stake]').onchange=()=>{q('[data-stake]').value=stake();formula();};
    new MutationObserver(()=>{const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);while(walker.nextNode()){const node=walker.currentNode,pair=translations.get(node.textContent);if(pair&&!node.parentElement.closest('mjx-container'))node.textContent=document.documentElement.dataset.language==='en'?pair[0]:pair[1];}draw();}).observe(document.documentElement,{attributes:true,attributeFilter:['data-language']});
    draw();formula();
  }
  const scan=()=>document.querySelectorAll('[data-roulette]').forEach(init);
  new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});scan();
})();
