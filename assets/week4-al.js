/* Week 4: worksheet-aligned experiments; theoretical probabilities never use sample counts. */
(() => {
  const choose=(n,k)=>{if(k<0||k>n)return 0;let c=1;for(let i=1;i<=Math.min(k,n-k);i++)c=c*(n-i+1)/i;return c;};
  const binomial=(n,p,k)=>choose(n,k)*p**k*(1-p)**(n-k);
  const poisson=(mean,k)=>{let v=Math.exp(-mean);for(let i=1;i<=k;i++)v*=mean/i;return v;};
  const gachaChance=(n,p)=>-Math.expm1(n*Math.log1p(-p));
  const variance=(n,p)=>n*p*(1-p);
  if(typeof document==='undefined'){module.exports={choose,binomial,poisson,gachaChance,variance};return;}
  const dual=(en,ja)=>`<span class="lang-en">${en}</span><span class="lang-ja" lang="ja">${ja}</span>`;
  const t=(en,ja)=>document.documentElement.dataset.language==='en'?en:ja;
  const pct=p=>(100*p).toFixed(2)+'%';
  const num=n=>Number(n.toFixed(6)).toLocaleString('en-US',{maximumFractionDigits:6});
  const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
  const math=(source,fallback)=>`<div data-display-math="${escape(source)}">${fallback}</div>`;
  function setMath(node,source,fallback){if(node.dataset.displayMath===source)return;if(!node.childNodes.length)node.textContent=fallback;delete node.dataset.mathReady;node.dataset.displayMath=source;}
  const defaults={hits:{n:5,p:.32},gacha:{n:100,p:.0005},defects:{n:3500,p:.002}};
  function markup(kind){
    const hits=kind==='hits',gacha=kind==='gacha';
    const title=hits?dual('AL 01 · Robo at bat','AL 01 · ロボットの打率'):gacha?dual('AL 02 · Robo’s gacha','AL 02 · ロボットのガチャ'):dual('AL 03 · Robot factory inspection','AL 03 · ロボット工場の検品');
    const prompt=hits?dual('A .320 hitter has five at-bats. Find the probability of every possible hit count.','打率0.32の選手が5打席。0本から5本まで、各安打数の確率を求めよう。'):gacha?dual('A rare robot drops with probability 0.05% per draw. What is the chance of at least one rare in 100 draws?','レア排出率0.05％で100回引く。レアが1個以上当たる確率は？'):dual('Two items in every 1,000 are defective. Estimate the defect count in a shipment of 3,500 using Poisson.','1,000個中2個が不良品。3,500個を出荷するときの不良品数をポアソン分布で近似しよう。');
    return `<header class="w4-heading"><p>${dual('TEXTBOOK · pp.118–120','教科書 · p.118–120')}</p><h4>${title}</h4><p>${prompt}</p></header>
    <div class="w4-formula activity-formula-card"><strong>${dual('FORMULA → SUBSTITUTION → RESULT','公式 → 代入 → 答え')}</strong><div data-w4-symbolic></div><div data-w4-substitution></div><p data-w4-reading></p></div>
    <div class="w4-columns"><section class="w4-play"><div class="w4-settings"><details><summary>${dual('Change the numbers','数値を変えてみる')}</summary><label>${hits?dual('At-bats n','打席数 n'):gacha?dual('Draws per set n','1セットの回数 n'):dual('Shipment size n','出荷数 n')} <output data-w4-n-value></output><input data-w4-n aria-label="${t('Number of trials','試行回数')}" type="range" min="${hits?1:gacha?10:500}" max="${hits?20:gacha?2000:10000}" step="${hits?1:gacha?10:100}" value="${defaults[kind].n}"></label><label>${hits?dual('Batting probability (%)','打率（％）'):gacha?dual('Rare rate (%)','レア率（％）'):dual('Defects per 1,000','1,000個あたりの不良品数')} <output data-w4-p-value></output><input data-w4-p aria-label="${t('Success or defect rate','成功率・不良率')}" type="range" min="${hits?1:gacha?.01:.5}" max="${hits?99:gacha?1:5}" step="${hits?1:gacha?.01:.5}" value="${defaults[kind].p*(kind==='defects'?1000:100)}"></label><button data-w4-default>${dual('Worksheet values','課題の数値に戻す')}</button></details></div>
    ${hits?`<label class="w4-highlight">${dual('Hit count x to examine','注目する安打数 x')} <output data-w4-x-value>3</output><input data-w4-x aria-label="${t('Hit count x','安打数 x')}" type="range" min="0" max="5" value="3"></label>`:''}
    <div class="w4-stage" data-w4-stage aria-hidden="true"><div class="w4-robo" data-w4-robo></div>${gacha?'<div class="w4-machine"><div class="w4-globe">● ● ●<br>● ● ●</div><div class="w4-knob">＋</div><div class="w4-chute" data-w4-reveal>?</div></div>':hits?'<div class="w4-bat">🏏</div><div class="w4-ball">⚾</div>':'<div class="w4-conveyor" data-w4-reveal>📦　📦　📦</div>'}</div>
    <div class="w4-latest" data-w4-latest role="status"></div><div class="w4-tokens" data-w4-tokens></div>
    <div class="w4-actions"><button data-w4-run="1">${hits?dual('Play 1 game','1試合'):gacha?dual('Pull 1 set','1セット引く'):dual('Inspect 1 shipment','1便を検品')}</button><button data-w4-run="100">${dual('100 sets','100セット')}</button><button data-w4-run="1000">${dual('1,000 sets','1,000セット')}</button><button data-w4-stop hidden>${dual('Stop','停止')}</button><button class="w4-reset" data-w4-reset>${dual('Reset','リセット')}</button></div><p class="w4-progress" data-w4-progress role="status"></p>
    <p class="w4-assumptions">${gacha?dual('Independent draws with a constant rate. No pity system. No real money is involved.','独立・排出率一定。天井や確率アップはない授業モデル。実際のお金は使いません。'):dual('Independent outcomes and a constant rate; an illustrative classroom model.','独立・率一定の授業モデルです。')}</p></section>
    <section class="w4-results"><h5>${dual('What the formula predicts, what we observed','公式の予測と、実際に試した結果')}</h5><div class="w4-key"><span>${dual('Theory · green outline','理論 · 緑の枠')}</span><span>${dual('Observed · orange bars','実測 · オレンジの棒')}</span></div><svg viewBox="0 0 720 300" data-w4-chart role="img" aria-label="${t('Probability distribution: fixed theory versus simulated proportions','確率分布：固定した理論とシミュレーションの割合')}"></svg>
    <div class="w4-metrics"><div><span>${dual('Completed sets','完了セット数')}</span><b data-w4-count>0</b></div><div><span>${dual(gacha?'Sets with a rare':'Observed mean count',gacha?'レアが出たセットの割合':'実測の平均個数')}</span><b data-w4-observed>—</b></div><div><span>${dual('Expected count E(X)','期待値 E(X)')}</span><b data-w4-mean></b></div><div><span>${dual('Variance Var(X)','分散 Var(X)')}</span><b data-w4-variance></b></div></div><p class="w4-aha" data-w4-aha></p></section></div>
    <details class="w4-worksheet"><summary>${dual('Connect this to the worksheet','ワークシートのどこに入る？')}</summary><div data-w4-sheet></div></details>`;
  }
  function setup(root){
    if(root.dataset.ready)return;root.dataset.ready='true';const kind=root.dataset.week4Al,hits=kind==='hits',gacha=kind==='gacha';root.innerHTML=markup(kind);
    const q=s=>root.querySelector(s);let n=defaults[kind].n,p=defaults[kind].p,x=3,count=0,sum=0,winning=0,hist=[],running=false,epoch=0,sheetKey='';
    const robot=window.statsbMontyCharacters?.robot||'🤖';const goat=window.statsbMontyCharacters?.goat||'🐐';q('[data-w4-robo]').innerHTML=robot;
    function reset(){epoch++;running=false;count=0;sum=0;winning=0;hist=[];q('[data-w4-tokens]').replaceChildren();q('[data-w4-stage]').classList.remove('is-running');if(q('[data-w4-reveal]'))q('[data-w4-reveal]').textContent=gacha?'?':'📦　📦　📦';q('[data-w4-latest]').textContent=t('Predict first, then try.','まず予想してから、試そう。');q('[data-w4-progress]').textContent='';syncControls();render();}
    function syncControls(){root.querySelectorAll('[data-w4-run], [data-w4-n], [data-w4-p], [data-w4-x], [data-w4-default]').forEach(e=>e.disabled=running);q('[data-w4-stop]').hidden=!running;}
    function render(){
      const mean=n*p,v=variance(n,p);q('[data-w4-n-value]').textContent=n.toLocaleString();q('[data-w4-p-value]').textContent=kind==='defects'?num(p*1000):pct(p);
      if(hits){q('[data-w4-x]').max=n;x=Math.min(x,n);q('[data-w4-x]').value=x;q('[data-w4-x-value]').textContent=x;}
      const symbolic=hits?String.raw`\Pr(X=x)={}_nC_x\pi^x(1-\pi)^{n-x}`:gacha?String.raw`\Pr(X\ge1)=1-\Pr(X=0)=1-(1-\pi)^n`:String.raw`\lambda=n\pi,\quad \Pr(X=x)\approx\frac{\lambda^xe^{-\lambda}}{x!},\quad E(X)\approx\operatorname{Var}(X)\approx\lambda`;
      const sub=hits?String.raw`\Pr(X=${x})={}_{${n}}C_{${x}}(${num(p)})^{${x}}(${num(1-p)})^{${n-x}}=${binomial(n,p,x).toFixed(6)}`:gacha?String.raw`\Pr(X\ge1)=1-(1-${num(p)})^{${n}}=${gachaChance(n,p).toFixed(6)}\approx${(100*gachaChance(n,p)).toFixed(2)}\%`:String.raw`\lambda=${n}\times${num(p)}=${num(mean)},\quad E(X)\approx${num(mean)},\quad\operatorname{Var}(X)\approx${num(mean)}`;
      setMath(q('[data-w4-symbolic]'),symbolic,t('Probability model','確率モデル'));setMath(q('[data-w4-substitution]'),sub,t('Substituting the given values','与えられた値を代入'));
      q('[data-w4-reading]').textContent=hits?t(`X is hits in ${n} at-bats. Exactly ${x} hits: ${pct(binomial(n,p,x))}. Each bar is a different possible X.`,`Xは${n}打席の安打数。ちょうど${x}本の確率は${pct(binomial(n,p,x))}。各棒が、それぞれのXの値です。`):gacha?t(`100% minus the chance of zero rares. Expected rares per set: ${num(mean)}; this is not the chance of getting a rare.`,`100％から「レア0個」の確率を引く。1セットの期待レア数は${num(mean)}個。これは当たる確率ではありません。`):t(`The exact binomial mean is ${num(mean)}, variance ${num(v)}. Poisson approximates both by ${num(mean)}.`,`正確な二項分布では期待値${num(mean)}個、分散${num(v)}個²。ポアソン近似では両方を${num(mean)}とします。`);
      q('[data-w4-count]').textContent=count.toLocaleString();q('[data-w4-observed]').textContent=count?(gacha?pct(winning/count):num(sum/count)):'—';q('[data-w4-mean]').textContent=num(mean);q('[data-w4-variance]').textContent=num(kind==='defects'?mean:v);
      q('[data-w4-aha]').textContent=gacha?t(`A set means ${n} draws, not one draw. ${pct((1-p)**n)} of sets have no rare; repeats are independent.`,`1セットは${n}回。1回のガチャではありません。レア0個のセットは理論上${pct((1-p)**n)}。引き直しても各回の確率は同じ。`):hits?t('Adding every theoretical bar gives 100%. More games help the orange bars resemble the fixed green prediction, but not monotonically.','理論の棒を全部足すと100％。試合を増やすと実測は理論に近づきやすいですが、毎回近づくとは限りません。'):t(`An expected ${num(mean)} defects does not fix the count in each shipment. The orange bars show the variation between shipments.`,`期待値${num(mean)}個でも、毎便${num(mean)}個とは限りません。便ごとのばらつきをオレンジの棒で見よう。`);
      chart();const key=`${n}:${p}:${document.documentElement.dataset.language}`;if(key!==sheetKey){sheetKey=key;sheet();}
    }
    function chart(){
      const mean=n*p,last=hits?n:Math.min(n,Math.max(5,Math.ceil(mean+4*Math.sqrt(mean)+2)));
      const model=k=>kind==='defects'?poisson(mean,k):binomial(n,p,k);
      const theory=Array.from({length:last+1},(_,k)=>model(k));
      // Include the remaining probability mass in an explicitly labelled final bin.
      const tail=Math.max(0,1-theory.reduce((a,b)=>a+b,0));if(!hits)theory.push(tail);
      const max=Math.min(1,Math.max(...theory)*1.22);const width=620/theory.length;
      let svg=`<title>${t('Probability of each count','各個数になる確率')}</title><desc>${t('Green outlines show fixed theory. Orange bars show observations on the same fixed scale.','緑の枠は固定した理論。オレンジの棒は、同じ固定尺度で表示した実測。')}</desc>`;
      for(let i=0;i<=4;i++){const y=245-i*205/4;svg+=`<path d="M65 ${y}H690" stroke="#deddd4"/><text x="55" y="${y+4}" text-anchor="end">${(100*max*i/4).toFixed(0)}%</text>`;}
      theory.forEach((v,k)=>{const center=65+(k+.5)*width;const observed=count?(k===last+1?hist.slice(last+1).reduce((a,b)=>a+(b||0),0):hist[k]||0)/count:0;const h=v/max*205,oh=Math.min(observed,max)/max*205;
        svg+=`<rect x="${center-width*.37}" y="${245-oh}" width="${width*.33}" height="${oh}" fill="#ca7650"/><rect x="${center+width*.03}" y="${245-h}" width="${width*.33}" height="${h}" fill="none" stroke="${hits&&k===x?'#17584c':'#287e72'}" stroke-width="2"/>`;
        if(width>24||k%5===0||k===last+1)svg+=`<text x="${center}" y="265" text-anchor="middle">${k===last+1?'≥'+k:k}</text>`;
        if(observed>max)svg+=`<text x="${center}" y="25" text-anchor="middle" fill="#a85836">${pct(observed)}</text>`;
      });
      svg+=`<text x="690" y="292" text-anchor="end">${t('Count X per set','1セットの個数 X')}</text>`;q('[data-w4-chart]').innerHTML=svg;
    }
    function sheet(){
      if(hits){const rows=Array.from({length:n+1},(_,k)=>`<tr><th>${k}</th><td>${choose(n,k)}</td><td>${num(p**k)}</td><td>${num((1-p)**(n-k))}</td><td>${pct(binomial(n,p,k))}</td></tr>`).join('');q('[data-w4-sheet]').innerHTML=`<p>${dual('Worksheet: 打率の事例_応用 · D6 = π, D7 = n. Columns H × I × J produce G. Default rows 7–12 cover x = 0…5.','シート「打率の事例_応用」：D6＝π、D7＝n。H列×I列×J列をG列へ。課題の7〜12行はx＝0〜5。')}</p><div class="w4-table-wrap"><table><thead><tr><th>x</th><th>H: nCx</th><th>I: πˣ</th><th>J: (1−π)ⁿ⁻ˣ</th><th>G: Pr(X=x)</th></tr></thead><tbody>${rows}</tbody></table></div>`;}
      else q('[data-w4-sheet]').innerHTML=gacha?`<p>${dual('Worksheet: ガチャの事例. D6 = 0.0005 (0.05%), D7 = 100. D9: 1 − G7. D10: sum G8:G107. D12: nπ. D13: nπ(1−π).','シート「ガチャの事例」：D6＝0.0005（0.05％）、D7＝100。D9は1−G7、D10はG8:G107の合計、D12はnπ、D13はnπ(1−π)。')}</p><p>${dual('With the default values: 4.8782%, E(X)=0.05, Var(X)=0.049975.','課題の数値では、4.8782％、E(X)=0.05、Var(X)=0.049975。')}</p>`:`<p>${dual('Worksheet: 不良品の事例. D7 = 2/1000, D8 = 3500. D10 is the mean nπ; D11 is the Poisson variance nπ.','シート「不良品の事例」：D7＝2/1000、D8＝3500。D10は期待値nπ、D11はポアソン近似の分散nπ。')}</p><p>${dual('Default result: mean 7, approximate variance 7. Exact binomial variance: 6.986.','課題の結果：期待値7、近似の分散7。二項分布の正確な分散は6.986。')}</p>`;
    }
    async function run(sets){if(running)return;running=true;const token=++epoch;syncControls();
      const fast=sets>1;for(let i=0;i<sets&&running&&token===epoch;i++){
        q('[data-w4-stage]').classList.remove('is-running');void q('[data-w4-stage]').offsetWidth;q('[data-w4-stage]').classList.add('is-running');
        // Draw actual independent Bernoulli outcomes; do not force convergence or a rare reward.
        let k=0;const outcomes=[];for(let j=0;j<n;j++){const hit=Math.random()<p;if(hit)k++;if(hits)outcomes.push(hit);
          if(gacha&&!fast&&(j%Math.ceil(n/120)===0||j===n-1)){
            q('[data-w4-reveal]').innerHTML=hit?robot:goat;
            q('[data-w4-progress]').textContent=t(`Draw ${j+1} / ${n}: ${k} rare so far`,`${j+1} / ${n}回：ここまでレア${k}個`);
            await new Promise(resolve=>setTimeout(resolve,12));if(!running||token!==epoch)return;
          }
        }
        await new Promise(resolve=>setTimeout(resolve,fast?24:450));if(!running||token!==epoch)break;
        count++;sum+=k;if(k>0)winning++;hist[k]=(hist[k]||0)+1;
        q('[data-w4-latest]').textContent=hits?t(`Last game: ${k} hits in ${n} at-bats`,`直近の試合：${n}打席で${k}本`):gacha?t(`Last ${n} draws: ${k} rare robot${k===1?'':'s'}`,`直近の${n}回：レアロボット ${k}個`):t(`Last shipment: ${k} defects in ${n} items`,`直近の便：${n}個中、不良品${k}個`);
        q('[data-w4-tokens]').innerHTML=hits?outcomes.map(hit=>`<span class="${hit?'is-hit':''}">${hit?'⚾':'×'}</span>`).join(''):'';
        if(gacha)q('[data-w4-reveal]').innerHTML=k?robot:goat;
        if(!hits&&!gacha)q('[data-w4-reveal]').textContent=`📦 ${k} / ${n}`;
        // Update the visual every set; math is unchanged and stays rendered.
        render();q('[data-w4-progress]').textContent=t(`${i+1} / ${sets} sets completed`,`${i+1} / ${sets}セット完了`);
      }
      if(token===epoch){running=false;q('[data-w4-stage]').classList.remove('is-running');syncControls();}
    }
    root.querySelectorAll('[data-w4-run]').forEach(b=>b.addEventListener('click',()=>run(Number(b.dataset.w4Run))));
    q('[data-w4-stop]').addEventListener('click',()=>{epoch++;running=false;syncControls();q('[data-w4-stage]').classList.remove('is-running');});
    q('[data-w4-reset]').addEventListener('click',reset);
    q('[data-w4-default]').addEventListener('click',()=>{n=defaults[kind].n;p=defaults[kind].p;x=3;q('[data-w4-n]').value=n;q('[data-w4-p]').value=p*(kind==='defects'?1000:100);reset();});
    for(const name of ['n','p'])q('[data-w4-'+name+']').addEventListener('input',()=>{n=+q('[data-w4-n]').value;p=+q('[data-w4-p]').value/(kind==='defects'?1000:100);reset();});
    q('[data-w4-x]')?.addEventListener('input',()=>{x=+q('[data-w4-x]').value;render();});
    new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['data-language']});reset();
  }
  const init=()=>document.querySelectorAll('[data-week4-al]').forEach(setup);
  document.addEventListener('statsb:agenda-rendered',init);init();
})();
