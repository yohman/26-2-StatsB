/* Change givens beside the worked answer. Live controls share the original model;
   fixed textbook exercises use an explicitly separate practice variant. */
(() => {
  const t=(en,ja)=>document.documentElement.dataset.language==='en'?en:ja;
  const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
  const field=(selector,en,ja)=>({selector,en,ja});
  function liveFields(root,type) {
    const F=field;
    if(type==='batting')return [F('[data-batting-n]','At-bats n','打席数 n'),F('[data-batting-p]','Hit probability π','打率 π'),F('[data-batting-x]','Hits x','安打数 x')];
    if(type==='nba')return [F('[data-story-n]','Shots n','投球回数 n'),F('[data-story-p]','Success chance (%)','成功率（％）'),F('[data-story-x]','Makes x','成功数 x'),F('[data-story-mode]','Exactly / at least','ちょうど／以上')];
    if(type==='costco')return [F('[data-story-rate]','Arrivals per 10 minutes','10分間の平均人数'),F('[data-story-minutes]','Window (minutes)','観察時間（分）'),F('[data-story-x]','Arrivals x','到着人数 x'),F('[data-story-mode]','Exactly / at least','ちょうど／以上')];
    if(type==='lineup')return [F('[data-combination-n]','Positions n','位置数 n'),F('[data-combination-k]','Robots k','ロボット数 k')];
    if(type==='roulette')return [F('[data-stake]','Bet (yen)','賭け金（円）')];
    if(type==='disease')return [F('[data-test-population]','1 fault per N robots','N体に1体が故障'),F('[data-test-error]','Error rate (%)','誤判定率（％）')];
    if(type==='discrete')return [F('[data-w2-discrete-k]','Robot faces k','ロボットの回数 k')];
    if(type==='continuous')return [F('[data-w2-continuous-band]','Interval half-width (σ)','区間の半幅（σ）')];
    if(['binomial','bernoulli','poisson'].includes(type))return [
      ...(type==='binomial'?[F('[data-w2-n]','Trials n','試行回数 n')]:[]),
      type==='poisson'?F('[data-w2-lambda]','Average arrivals λ','平均到着数 λ'):F('[data-w2-p]','Success chance (%)','成功率（％）'),
      F('[data-exam-k]','Count k to calculate','求める回数 k')];
    if(type==='normal')return [F('[data-dist-mean]','Mean μ (cm)','平均 μ（cm）'),F('[data-dist-sd]','SD σ (cm)','標準偏差 σ（cm）'),F('[data-dist-band]','Interval','区間')];
    if(type==='t'||type==='chi')return [F('[data-dist-n]','Sample size n','標本サイズ n'),...(type==='t'?[F('[data-dist-exam-mean]','Sample mean (cm)','標本平均（cm）')]:[]),F('[data-dist-exam-sd]','Sample SD s (cm)','標本標準偏差 s（cm）')];
    return [];
  }
  // Deliberately bounded variants: probabilities remain valid, and a new triangular
  // endpoint always changes its slope too so total probability remains one.
  const fixed={
    coin:[['n','Tosses n','投げる回数 n',1,30,1,10],['p','Robot probability p','ロボットの確率 p',0,1,.05,.5]],
    monty:[['doors','Doors N','ドア数 N',3,30,1,3]],
    lottery:[['cost','Ticket price (yen)','くじ1枚の価格（円）',0,500,5,100],['prize','Top prize (yen)','最高賞金（円）',100,5000,100,1000],['jackpot','Top-prize probability','最高賞金の確率',0,.75,.01,.05]],
    dice:[['six','Chance of rolling 6','6が出る確率',0,1,.01,1/6]],
    delivery:[['early','Fast delivery (min)','早い配達（分）',1,10,1,2],['late','Slow delivery (min)','遅い配達（分）',11,40,1,18],['lateProbability','Chance of slow delivery','遅い配達の確率',0,1,.05,.5]],
    pairs:[['n','Students n','学生数 n',2,40,1,22]],
    'al-discrete':[['fours','Number of cards showing 4','4のカードの枚数',1,12,1,4]],
    'al-continuous':[['limit','Maximum delivery time b (h)','配達時間の上限 b（時間）',.5,4,.1,Math.sqrt(2)]],
    events:[['oCount','Tickets labeled o (others: one each)','oのくじの枚数（他は各1枚）',1,10,1,1]]
  };
  function probabilities(type,s) {
    if(type==='coin')return Array.from({length:s.n+1},(_,k)=>({x:k,p:choose(s.n,k)*s.p**k*(1-s.p)**(s.n-k)}));
    if(type==='monty')return [{x:t('Stay','そのまま'),p:1/s.doors},{x:t('Switch','変更'),p:1-1/s.doors}];
    if(type==='lottery')return [0,100,s.prize].map((x,i)=>({x,p:[.75-s.jackpot,.25,s.jackpot][i]}));
    if(type==='dice')return Array.from({length:6},(_,i)=>({x:i+1,p:i===5?s.six:(1-s.six)/5}));
    if(type==='delivery')return [{x:s.early,p:1-s.lateProbability},{x:s.late,p:s.lateProbability}];
    if(type==='al-discrete')return [-1,0,1,2,3,4].map((x,i)=>({x,p:[3,1,2,1,1,s.fours][i]/(8+s.fours)}));
    if(type==='events')return ['o','p','q','r','s','t','u','v','w'].map(x=>({x,p:(x==='o'?s.oCount:1)/(8+s.oCount)}));
    return [];
  }
  function choose(n,k){let v=1;for(let i=1;i<=k;i++)v*= (n-i+1)/i;return v;}
  function chart(type,s) {
    if(type==='al-continuous') {
      const b=s.limit,c=2/b,scale=Math.min(260/b,110/c),left=70,right=left+b*scale,top=130-c*scale;
      return `<svg viewBox="0 0 480 160" role="img" aria-label="${esc(t('Normalized triangular density; area = 1; equal unit scale on both axes','確率密度の三角形。面積は1、縦横は同じ単位目盛り'))}"><path d="M${left} 130L${right} ${top}V130Z" fill="#d8e9e2" stroke="#17675d" stroke-width="2"/><path d="M${left} ${top-8}V130H${right+12}" fill="none" stroke="#8d9993"/><text x="${left-12}" y="145">0</text><text x="${right}" y="148" text-anchor="middle">b=${b.toFixed(3)} h</text><text x="${right+9}" y="${Math.max(15,top-5)}">f(b)=${c.toFixed(3)}</text><text x="360" y="98" text-anchor="middle">${t('Area = 1 · 100%','面積＝1・100％')}</text><text x="${left-32}" y="20">f(x)</text></svg>`;
    }
    if(type==='pairs')return `<p class="number-variant-count">🤖 ${s.n} ${t('students','人')} → <strong>${s.n*(s.n-1)/2}</strong> ${t('unique pairs','通り')}</p>`;
    const rows=probabilities(type,s),w=394/rows.length;
    // A fixed 0–100% scale makes probability changes visually comparable.
    return `<svg viewBox="0 0 480 160" role="img" aria-label="${esc(t('Practice model probabilities, fixed zero to one hundred percent scale','練習モデルの確率。0〜100％の固定目盛り'))}"><path d="M46 15V130H450" fill="none" stroke="#8d9993"/><text x="8" y="23">100%</text><text x="22" y="132">0%</text>${rows.map((r,i)=>{const x=48+i*w,h=110*r.p;return `<rect x="${x+2}" y="${130-h}" width="${Math.max(2,w-5)}" height="${h}" rx="2" fill="#287e72"><title>${esc(r.x)}: ${(100*r.p).toFixed(2)}%</title></rect>${rows.length<12||i%3===0?`<text x="${x+w/2}" y="147" text-anchor="middle">${esc(r.x)}</text>`:''}${rows.length<8?`<text x="${x+w/2}" y="${Math.max(12,125-h)}" text-anchor="middle">${(r.p*100).toFixed(1)}%</text>`:''}`;}).join('')}</svg>`;
  }
  function setup(root) {
    if(root.dataset.numberControls)return;
    const exam=root.querySelector(':scope > .exploration-exam'),dist=root.matches('[data-distribution-simulation]');
    if(!exam&&!dist)return;
    root.dataset.numberControls='true';
    const panel=document.createElement('details');panel.className='example-number-options';
    panel.innerHTML='<summary></summary><p data-number-note></p><div class="example-number-body"><div class="example-number-fields"></div><button type="button" data-number-reset></button><div data-number-chart hidden></div></div>';
    if(exam)exam.querySelector('header').after(panel);else root.querySelector('[data-dist-scenario]').before(panel);
    let type='',mode='',defaults={},variant={},signature='',refreshing=false,queued=false;
    const fields=panel.querySelector('.example-number-fields');
    const current=()=>dist?[root.dataset.distributionType,{}]:window.StatsExamPractice.read(root);
    function writeVariant() {
      root.dispatchEvent(new CustomEvent('statsb:exam-variant',{detail:{type,values:variant}}));
      panel.querySelector('[data-number-chart]').innerHTML=chart(type,variant);
    }
    function refresh() {
      queued=false;
      if(refreshing)return;
      refreshing=true;
      const [nextType]=current(),changed=type!==nextType;type=nextType;
      const live=liveFields(root,type).filter(f=>root.querySelector(f.selector));
      mode=live.length?'live':fixed[type]?'variant':'events';
      panel.dataset.numberMode=mode;
      const en=document.documentElement.dataset.language==='en';
      panel.querySelector('summary').textContent=t('Change the numbers','数値を変えてみる');
      panel.querySelector('[data-number-reset]').textContent=t('Restore original values','元の数値に戻す');
      panel.querySelector('[data-number-reset]').hidden=mode==='events';
      panel.querySelector('[data-number-note]').textContent=mode==='live'?t('Change a given value: the question, substitution, answer and original chart update together. Changing model settings starts a fresh comparison.', '与えられた数値を変えると、問題・代入・答え・元のグラフが連動します。モデルの設定を変えると比較を新しく始めます。'):mode==='variant'?t('Practice variant only. These controls change the worked example and practice chart here; the original textbook game or AL worksheet below stays unchanged.', '別の数値で練習。ここにある計算と練習グラフだけを変更します。下の元のゲーム・教科書・AL課題の数値は変わりません。'):t('Figure 6 has fixed membership, so its numbers must not be invented. Choose a different event in the grid below to change the matching count and denominator.', '図6の構成は固定なので数を勝手には変えません。下のグリッドで別の事象を選ぶと、該当数と分母が変わります。');
      const key=JSON.stringify([type,en,live.map(f=>{const x=root.querySelector(f.selector);return [f.selector,x.tagName,x.min,x.max,x.step,x.disabled,x.tagName==='SELECT'?[...x.options].map(o=>[o.value,o.text]):null];})]);
      if(changed){defaults={};variant={};delete root.dataset.examVariant;}
      if(key!==signature) {
        signature=key;fields.replaceChildren();
        if(mode==='live')for(const f of live) {
          const source=root.querySelector(f.selector);
          if(!(f.selector in defaults))defaults[f.selector]=source.value;
          const label=document.createElement('label');label.innerHTML=`<span>${esc(en?f.en:f.ja)}</span>`;
          const proxy=document.createElement(source.tagName==='SELECT'?'select':'input');
          if(proxy.tagName==='SELECT')proxy.innerHTML=source.innerHTML;
          else {proxy.type=source.type==='range'?'range':'number';for(const a of ['min','max','step'])if(source.hasAttribute(a))proxy.setAttribute(a,source.getAttribute(a));}
          proxy.dataset.numberSource=f.selector;proxy.value=source.value;proxy.disabled=source.disabled;
          const out=document.createElement('output');out.textContent=source.value;label.append(proxy,out);fields.append(label);
          proxy.addEventListener(proxy.tagName==='SELECT'?'change':'input',()=>{
            const target=root.querySelector(f.selector);if(!target||target.disabled)return;
            if(proxy.type==='number'&&!proxy.validity.valid)return;
            target.value=proxy.value;target.dispatchEvent(new Event('input',{bubbles:true}));target.dispatchEvent(new Event('change',{bubbles:true}));out.textContent=target.value;queue();
          });
        }
        if(mode==='variant')for(const [name,enLabel,jaLabel,min,max,step,initial] of fixed[type]) {
          if(!(name in variant))variant[name]=initial;
          const label=document.createElement('label');label.innerHTML=`<span>${esc(en?enLabel:jaLabel)}</span>`;
          const input=document.createElement('input');input.type='number';input.min=min;input.max=max;input.step=step;
          if(Math.abs(initial/step-Math.round(initial/step))>1e-6)input.step='any';
          // Irrational defaults remain exact until a student edits them.
          input.value=Number(variant[name].toFixed(6));input.dataset.variantField=name;
          label.append(input);fields.append(label);
          input.addEventListener('input',()=>{
            const invalid=input.value===''||!Number.isFinite(input.valueAsNumber)||input.valueAsNumber<min||input.valueAsNumber>max||step===1&&!Number.isInteger(input.valueAsNumber);
            input.setAttribute('aria-invalid',String(invalid));
            if(invalid){input.setCustomValidity(t(`Enter ${step===1?'a whole number':'a number'} from ${min} to ${max}.`, `${min}〜${max}の${step===1?'整数':'数値'}を入力してください。`));input.reportValidity();return;}
            input.setCustomValidity('');variant[name]=input.valueAsNumber;writeVariant();
          });
        }
      }
      if(mode==='live')panel.querySelectorAll('[data-number-source]').forEach(proxy=>{
        const source=root.querySelector(proxy.dataset.numberSource);if(!source)return;
        if(document.activeElement!==proxy)proxy.value=source.value;
        proxy.disabled=source.disabled;proxy.nextElementSibling.textContent=source.value;
      });
      panel.querySelector('[data-number-chart]').hidden=mode!=='variant';
      if(mode==='variant')panel.querySelector('[data-number-chart]').innerHTML=chart(type,variant);
      refreshing=false;
    }
    function queue(){if(!queued){queued=true;requestAnimationFrame(refresh);}}
    panel.querySelector('[data-number-reset]').addEventListener('click',()=>{
      if(mode==='live')for(const [selector,value] of Object.entries(defaults)){const target=root.querySelector(selector);if(!target||target.disabled)continue;target.value=value;target.dispatchEvent(new Event('input',{bubbles:true}));target.dispatchEvent(new Event('change',{bubbles:true}));}
      else {variant=Object.fromEntries(fixed[type].map(([name,,,,,,value])=>[name,value]));if(panel.open)writeVariant();else root.dispatchEvent(new CustomEvent('statsb:exam-variant',{detail:null}));signature='';}
      queue();
    });
    panel.addEventListener('toggle',()=>{
      if(mode!=='variant')return;
      if(panel.open)writeVariant();else root.dispatchEvent(new CustomEvent('statsb:exam-variant',{detail:null}));
    });
    root.addEventListener('input',queue);root.addEventListener('change',queue);root.addEventListener('click',queue);
    new MutationObserver(records=>{if(records.some(r=>!panel.contains(r.target)&&(r.type==='attributes'||!exam?.contains(r.target))))queue();}).observe(root,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['hidden','aria-pressed','aria-selected','disabled','min','max']});
    new MutationObserver(queue).observe(document.documentElement,{attributes:true,attributeFilter:['data-language']});
    refresh();
  }
  const scan=()=>document.querySelectorAll('[data-exam-practice],[data-distribution-simulation]').forEach(setup);
  new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&(n.matches?.('.exploration-exam,[data-distribution-simulation]')||n.querySelector?.('.exploration-exam,[data-distribution-simulation]')))))requestAnimationFrame(scan);}).observe(document.body,{childList:true,subtree:true});
  document.addEventListener('statsb:agenda-rendered',()=>requestAnimationFrame(scan));
  requestAnimationFrame(scan);
})();
