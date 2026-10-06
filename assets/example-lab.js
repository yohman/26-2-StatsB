(() => {
  const t=(en,ja)=>document.documentElement.dataset.language==='en'?en:ja;
  const bi=(en,ja)=>`<span class="lang-en">${en}</span><span class="lang-ja" lang="ja">${ja}</span>`;
  const escapeHtml=text=>String(text).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
  const inline=(source,fallback=source)=>`<span data-inline-math="${escapeHtml(source)}">${escapeHtml(fallback)}</span>`;
  const scenarios = {
    lottery: {title:'100円のくじ', unit:'円', values:[0,100,1000], probabilities:[.7,.25,.05], cost:100, icon:'🎟️', story:`${inline('X')} は開く前の賞金。引いた結果が ${inline('x')}。賞金の平均と、${inline('100')}円を払ったあとの損益を分けて見よう。`},
    dice: {title:'サイコロ', unit:'', values:[1,2,3,4,5,6], probabilities:Array(6).fill(1/6), cost:0, icon:'🎲', story:`${inline('X')} は出る目。出たあとには ${inline(String.raw`x=1,2,\ldots,6`,'x=1,2,…,6')} のどれか。平均${inline('3.5')}でも、${inline('3.5')}の目は出ません。`},
    delivery: {title:'配達ロボットB', unit:'分', values:[2,18], probabilities:[.5,.5], cost:0, icon:'🤖', story:`Aは毎回${inline('10')}分で分散${inline('0')}。Bは${inline('2')}分か${inline('18')}分で、平均${inline('10')}分でも分散${inline('64')}分${inline('^2','²')}。平均だけでは安心感の違いが見えません。`}
  };
  const english={
    lottery:{title:'¥100 lottery',unit:' yen',story:`${inline('X')} is the prize before opening the ticket; ${inline('x')} is the result you actually get. Compare the average prize with profit after paying ${inline('100')} yen.`},
    dice:{title:'Dice',unit:'',story:`${inline('X')} is the number rolled. After rolling, ${inline(String.raw`x=1,2,\ldots,6`,'x=1,2,…,6')} is one actual result. The average can be ${inline('3.5')}, but you cannot roll ${inline('3.5')}.`},
    delivery:{title:'Delivery robot B',unit:' min',story:`Robot A always takes ${inline('10')} minutes: variance ${inline('0')}. Robot B takes ${inline('2')} or ${inline('18')} minutes: the same mean ${inline('10')}, but variance ${inline('64')} min${inline('^2','²')}. The average alone hides this difference in reliability.`}
  };
  const scenario=id=>({...scenarios[id],title:t(english[id].title,scenarios[id].title),unit:t(english[id].unit,scenarios[id].unit),story:t(english[id].story,scenarios[id].story)});
  function setup(root) {
    if (root.dataset.ready) return;
    root.dataset.ready='true';
    root.innerHTML = `<header><p class="section-kicker">${bi('Textbook p.117 & 129','教科書 p.117・129')}</p><h4>${bi('From one result to averages and variation','1回の結果から、平均とばらつきへ')}</h4></header>
      <div class="example-choices" aria-label="例を選ぶ">${Object.entries(scenarios).map(([id,s])=>`<button type="button" data-example="${id}" aria-pressed="false">${s.icon} ${s.title}</button>`).join('')}</div>
      <p data-example-story></p><div class="example-layout"><div><div class="example-result" aria-live="polite"><span data-example-icon></span><strong data-example-last>?</strong><small>${bi('This observed value','今回の実現値')} ${inline('x')}</small></div><div class="example-actions"><button type="button" data-example-run="1">${bi('Try once','1回試す')}</button><button type="button" data-example-run="1000">${bi('Try 1,000 times','1,000回試す')}</button><button type="button" data-example-reset>${bi('Reset','リセット')}</button></div></div>
      <div><table class="example-table"><thead><tr><th>${inline('x')}</th><th>${inline(String.raw`\Pr(X=x)`,'Pr(X=x)')}</th><th>${inline(String.raw`x\Pr(X=x)`,'x Pr(X=x)')}</th><th>${bi('Observed','実測')}</th></tr></thead><tbody data-example-rows></tbody></table><p>${bi('Add each row’s value × probability to get the expectation.','各行の「値 × 確率」を足すと期待値。')}</p><div class="example-formula" data-example-formula></div><p data-example-variance></p></div></div>
      <section class="example-summary" aria-label="試行結果"><dl class="example-metrics" data-example-metrics></dl><p class="example-accounting" data-example-status aria-live="polite"></p></section>
      <h5>${bi('What happens to the average as we repeat?','繰り返すと、平均はどうなる？')}</h5><svg data-example-chart viewBox="0 0 720 220" role="img"></svg><p class="week2-aha">${bi('Blue: observed mean. Dashed line: theoretical expectation. More trials tend to bring them closer, but not on every step.','青：実測平均 ／ 点線：理論の期待値。たくさん試すと近づく傾向があります。毎回、近づくとは限りません。')}</p>`;
    const pairs = document.createElement('section');
    pairs.className='example-pairs';
    pairs.innerHTML=`<h5>${bi('Choose a pair from 22 students','22人から、2人の組を作る')}</h5><p>${bi('Click two students. A–B and B–A are the same pair.','2人をクリック。AさんとBさん、BさんとAさんは同じ1組。')}</p><div class="example-students"></div><p data-pair-status aria-live="polite"></p><div class="example-formula">₂₂C₂ = 22! / (2! × 20!) = 22 × 21 / 2 = 231</div><button type="button" data-pairs-reset>${bi('Reset discovered pairs','組の記録をリセット')}</button>`;
    root.append(pairs);
    pairs.hidden=true;
    const pairButton=document.createElement('button');pairButton.type='button';pairButton.innerHTML=`🤖 ${bi('Pairs from 22','22人の組')}`;pairButton.setAttribute('aria-pressed','false');root.querySelector('.example-choices').append(pairButton);
    function showPairs() {generation++;busy=false;root.classList.add('is-pairs');pairs.hidden=false;root.querySelectorAll('[data-example]').forEach(b=>b.setAttribute('aria-pressed','false'));pairButton.setAttribute('aria-pressed','true');}
    pairButton.addEventListener('click',showPairs);
    let selected=[], found=new Set();
    function pairStatus(){pairs.querySelector('[data-pair-status]').textContent=selected.length===2?t(`Students ${selected[0]} and ${selected[1]} · ${found.size} / 231 unique pairs found`,`${selected[0]}番と${selected[1]}番 ／ 見つけた異なる組 ${found.size} / 231組`):t('Select two students.','まだ組を選んでいません。');}
    for(let i=1;i<=22;i++) {
      const b=document.createElement('button');b.type='button';b.textContent=`${i} 🤖`;b.setAttribute('aria-pressed','false');
      pairs.querySelector('.example-students').append(b);
      b.addEventListener('click',()=>{
        if(selected.length===2) {selected=[];pairs.querySelectorAll('.example-students button').forEach(button=>button.setAttribute('aria-pressed','false'));}
        if(selected.includes(i)) {selected=selected.filter(x=>x!==i);b.setAttribute('aria-pressed','false');pairStatus();return;}
        selected.push(i);b.setAttribute('aria-pressed','true');
        if(selected.length===2) found.add([...selected].sort((a,b)=>a-b).join(','));
        pairStatus();
      });
    }
    pairs.querySelector('[data-pairs-reset]').addEventListener('click',()=>{selected=[];found.clear();pairs.querySelectorAll('.example-students button').forEach(b=>b.setAttribute('aria-pressed','false'));pairStatus();});
    let kind='lottery', counts=[], points=[], n=0, sum=0, last=null, busy=false, generation=0;
    const q=s=>root.querySelector(s);
    const mean=()=>scenarios[kind].values.reduce((s,x,i)=>s+x*scenarios[kind].probabilities[i],0);
    async function formula() {
      const s=scenario(kind), target=q('[data-example-formula]');
      const source=String.raw`E(X)=\sum_x x\Pr(X=x)=${s.values.map((x,i)=>String.raw`${x}\times${kind==='dice'?String.raw`\frac{1}{6}`:s.probabilities[i].toFixed(2)}`).join('+')}=${mean()}`;
      target.textContent=`E(X) = ${s.values.map((x,i)=>`${x} × ${kind==='dice'?'1/6':s.probabilities[i]}`).join(' + ')} = ${mean()}${s.unit}`;
      if(window.MathJax?.tex2chtmlPromise) {
        const current=kind;
        await MathJax.startup.promise;
        const rendered=await MathJax.tex2chtmlPromise(source,{display:true});
        if(current===kind) {target.replaceChildren(rendered); MathJax.startup.document.reset(); MathJax.startup.document.updateDocument();}
        const pairMath=await MathJax.tex2chtmlPromise(String.raw`{}_{22}C_2=\frac{22!}{2!\,20!}=\frac{22\times21}{2}=231`,{display:true});
        pairs.querySelector('.example-formula').replaceChildren(pairMath);
        MathJax.startup.document.reset();MathJax.startup.document.updateDocument();
      }
    }
    function chart() {
      const s=scenario(kind), mu=mean(), lo=0, hi=Math.max(mu*1.5,...points.map(p=>p.y),1);
      const x=p=>48+(p.x-1)/Math.max(1,n-1)*648, y=v=>180-(v-lo)/(hi-lo)*152;
      const path=points.map((p,i)=>`${i?'L':'M'}${x(p).toFixed(1)},${y(p.y).toFixed(1)}`).join(' ');
      q('[data-example-chart]').innerHTML=`<line x1="48" x2="696" y1="180" y2="180" stroke="#aaa"/><line x1="48" x2="696" y1="${y(mu)}" y2="${y(mu)}" stroke="#a15e40" stroke-dasharray="5 5"/><text x="48" y="${Math.max(15,y(mu)-8)}" fill="#a15e40">E(X)=${mu}${s.unit}</text><path d="${path}" fill="none" stroke="#16869c" stroke-width="2.5"/>${points.length?`<circle cx="${x(points.at(-1))}" cy="${y(points.at(-1).y)}" r="4" fill="#16869c"/>`:''}<text x="48" y="207">${t("1 trial","1回")}</text><text x="696" y="207" text-anchor="end">${n}${t(" trials","回")}</text>`;
    }
    function draw() {
      const s=scenario(kind);
      q('[data-example-icon]').textContent=s.icon;
      q('[data-example-last]').textContent=last===null?'?':`${last}${s.unit}`;
      q('[data-example-rows]').innerHTML=s.values.map((v,i)=>`<tr${last===v?' class="is-last"':''}><td>${v}${s.unit}</td><td>${(100*s.probabilities[i]).toFixed(2)}%</td><td>${(v*s.probabilities[i]).toFixed(2)}</td><td>${n?(100*counts[i]/n).toFixed(1)+'%':'—'}</td></tr>`).join('');
      const format=(value,decimals=0)=>value.toLocaleString('ja-JP',{minimumFractionDigits:decimals,maximumFractionDigits:decimals});
      const spending=n*s.cost, net=sum-spending;
      const netClass=net<0?'is-loss':net>0?'is-gain':'';
      const metrics=[[t('Trials','試行回数'),format(n),t(' trials','回'),''],[s.cost?t('Average prize per ticket','1枚あたり平均賞金'):t('Observed mean','実測平均'),n?format(sum/n,2):'—',s.unit,'']];
      if(s.cost) metrics.push([t('Average profit / loss per ticket','1枚あたり平均損益'),n?format(sum/n-s.cost,2):'—',s.unit,netClass],[t('Total spent (¥100 per ticket)','合計支出（1枚100円）'),format(spending),s.unit,''],[t('Total prizes won','獲得した賞金の合計'),format(sum),s.unit,''],[t('Total profit / loss','合計損益'),format(net),s.unit,`is-net ${netClass}`]);
      const metricList=q('[data-example-metrics]');
      metricList.classList.toggle('is-money',Boolean(s.cost));
      metricList.innerHTML=metrics.map(([label,value,unit,style])=>`<div class="example-metric ${style}"><dt>${label}</dt><dd>${value}<small>${unit}</small></dd></div>`).join('');
      q('[data-example-status]').hidden=!s.cost;
      q('[data-example-status]').textContent=s.cost?t(`Prizes ¥${format(sum)} − Spending ¥${format(spending)} = Profit / loss ¥${format(net)}`,`賞金 ${format(sum)}円 − 支出 ${format(spending)}円 = 損益 ${format(net)}円`):'';
      chart();
    }
    function reset() {generation++;busy=false;counts=scenarios[kind].values.map(()=>0);points=[];n=0;sum=0;last=null;root.querySelectorAll('[data-example-run]').forEach(b=>b.disabled=false);draw();}
    function select(id) {
      root.classList.remove('is-pairs');pairs.hidden=true;pairButton.setAttribute('aria-pressed','false');kind=id;
      updateCopy();
      reset();root.querySelectorAll('[data-example]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.example===id)));formula();
    }
    function updateCopy(){
      q('[data-example-story]').innerHTML=scenario(kind).story;
      q('[data-example-variance]').innerHTML=kind==='delivery'
        ? `${inline(String.raw`\mathrm{Var}(X)=\frac12(2-10)^2+\frac12(18-10)^2=64`,'Var(X)=½(2−10)²+½(18−10)²=64')} ${t('min','分')}${inline('^2','²')}. ${t('Both A and B have','AもBも')} ${inline('E(X)=10')} ${t('min.','分。')}`
        : scenarios[kind].cost?`${t('Expected profit / loss:','期待損益：')}${inline('E(X)-100=75-100=-25','E(X) − 100 = 75 − 100 = −25')}${t(' yen per ticket.','円／枚。')}`
        : `${inline('E(X)=3.5')} ${t('is the average of many rolls. Every individual result is a whole number.','は多くの出目を平均した値。実現値は必ず整数。')}`;
      root.querySelectorAll('[data-example]').forEach(b=>b.textContent=`${scenario(b.dataset.example).icon} ${scenario(b.dataset.example).title}`);
      q('.example-choices').setAttribute('aria-label',t('Choose an example','例を選ぶ'));
      q('.example-summary').setAttribute('aria-label',t('Trial results','試行結果'));
      q('[data-example-chart]').setAttribute('aria-label',t('Observed mean by trial count. Blue: observed mean. Dashed: expectation.','試行回数と実測平均。青は実測平均、点線は期待値。'));
    }
    root.querySelectorAll('[data-example]').forEach(b=>b.addEventListener('click',()=>select(b.dataset.example)));
    root.querySelectorAll('[data-example-run]').forEach(b=>b.addEventListener('click',async()=>{
      if(busy) return;busy=true;const token=generation;
      root.querySelectorAll('[data-example-run]').forEach(button=>button.disabled=true);
      const rounds=Number(b.dataset.exampleRun);
      for(let j=0;j<rounds;j++) {
        if(token!==generation) return;
        const s=scenarios[kind];let r=Math.random(),i=0;while(i<s.values.length-1&&r>=s.probabilities[i]) {r-=s.probabilities[i];i++;}
        last=s.values[i];counts[i]++;n++;sum+=last;
        if(n<100||n%5===0||j===rounds-1) points.push({x:n,y:sum/n});
        if(points.length>2000) points=points.filter((_,i)=>i%2===0);
        if(rounds===1||j%10===0||j===rounds-1) {draw();q('[data-example-last]').animate([{transform:'scale(.8)',opacity:.5},{transform:'scale(1)',opacity:1}],{duration:100});await new Promise(resolve=>setTimeout(resolve,20));}
      }
      if(token===generation) {busy=false;root.querySelectorAll('[data-example-run]').forEach(button=>button.disabled=false);}
    }));
    q('[data-example-reset]').addEventListener('click',reset);
    const requested=new URLSearchParams(location.search).get('activity');
    select(scenarios[requested]?requested:'lottery');
    if(requested==='class-pairs') showPairs();
    pairStatus();
    new MutationObserver(()=>{updateCopy();pairStatus();draw();formula();}).observe(document.documentElement,{attributes:true,attributeFilter:['data-language']});
    document.querySelector('script[src*="mathjax"]')?.addEventListener('load',()=>formula());
  }
  const initialize=()=>document.querySelectorAll('[data-example-lab]').forEach(setup);
  document.addEventListener('statsb:agenda-rendered',initialize);
  new MutationObserver(initialize).observe(document.body,{childList:true,subtree:true});
  initialize();
})();
