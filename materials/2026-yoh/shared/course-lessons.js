(() => {
  'use strict';

  const M = window.FutureStats;
  const tex = String.raw;
  const step = (number, html) => `<div class="reveal" data-step="${number}">${html}</div>`;
  const math = line => `<div class="lesson-math">\\[${line}\\]</div>`;
  const plot = '<div class="lesson-graph"></div>';
  const result = '<p class="lesson-result" aria-live="polite"></p>';
  const key = '<span style="color:#16786f">●</span>';
  const note = text => `<p class="secondary">${text}</p>`;
  const action = caption => `<button data-action>${caption}</button>`;
  const controls = html => `<div class="lesson-controls">${html}</div>`;
  const slider = (label,min,max,initial,increment=1) =>
    controls(`<label>${label} <input type="range" min="${min}" max="${max}" step="${increment}" value="${initial}"> <output>${initial}</output></label>`);
  const options = labels => controls(labels.map((label,i)=>`<button data-choice="${i}" aria-pressed="false">${label}</button>`).join(''));
  const section = (title,...items) => ({title,items});
  const deck = (title,challenges,...sections) => ({title,challenges,sections});
  const renderResult = (body,text) => { body.querySelector('.lesson-result').textContent = text; };

  const rubyTerms = {
    '区間推定':'く かん すい てい', '母平均':'ぼ へい きん', '母分散':'ぼ ぶん さん',
    '条件付き確率':'じょう けん _ _ かく りつ', '期待値':'き たい ち',
    '標準化':'ひょう じゅん か', '標本平均':'ひょう ほん へい きん',
    '不偏分散':'ふ へん ぶん さん', '自由度':'じ ゆう ど',
    '中心極限定理':'ちゅう しん きょく げん てい り', '有意水準':'ゆう い すい じゅん',
    '一致性':'いっ ち せい', '不偏性':'ふ へん せい', '回帰直線':'かい き ちょく せん',
    '残差':'ざん さ', '変動係数':'へん どう けい すう', '棄却':'き きゃく',
    '信頼区間':'しん らい く かん', '二項分布':'に こう ぶん ぷ', '確率':'かく りつ'
  };
  function ruby(text) {
    const pattern = new RegExp(Object.keys(rubyTerms).join('|'),'g');
    return text.replace(pattern,term => [...term].map((character,i) => {
      const reading = rubyTerms[term].split(' ')[i];
      return reading && reading !== '_' ? `<ruby>${character}<rt>${reading}</rt></ruby>` : character;
    }).join(''));
  }
  function slide(title, english, book, html, notes, mount, theme) {
    return {title,book,notes,mount,theme,
      html: `<h2>${ruby(title)}</h2><p class="english">${english}</p>${html}`};
  }
  const link = (href,label) => `<a href="${href}" target="_blank" rel="noopener">${label} ↗</a>`;
  const lab = (week,mode,title,notes) => ({
    title,notes,lab:true,
    html:`<iframe class="lesson-lab" title="${title}" src="explore.html?week=${week}&mode=${mode}"></iframe>`
  });

  function chart(body,svg,label) {
    body.querySelector('.lesson-graph').innerHTML =
      `<svg viewBox="0 0 900 218" role="img" aria-label="${label}">${svg}</svg>`;
  }
  function bars(body,values,{highlight=()=>false,max=Math.max(...values),labels=values.map((_,i)=>i),label}={}) {
    const width=800/values.length;
    const baseline=177;
    const rects=values.map((value,i)=>{
      const height=max ? value/max*145 : 0;
      const x=50+i*width;
      return `<rect x="${x+width*.09}" y="${baseline-height}" width="${width*.82}" height="${height}" fill="${highlight(i)?'#d57a3e':'#68a49c'}"><title>${labels[i]} · ${value.toFixed(3)}</title></rect>` +
        (labels[i] !== '' && (values.length<=16 || i%4===0) ? `<text x="${x+width*.5}" y="206" text-anchor="middle">${labels[i]}</text>` : '');
    }).join('');
    chart(body,rects+`<path d="M48 ${baseline}H854" stroke="#627980"/>`,label || '棒グラフ');
  }
  function curve(body,{pdf,min=-4,max=4,height=.42,shade=()=>false,marks=[],label}) {
    const x=v=>50+(v-min)/(max-min)*800;
    const y=v=>176-v/height*145;
    const values=Array.from({length:241},(_,i)=>min+(max-min)*i/240);
    const points=values.map(v=>`${x(v)},${y(pdf(v))}`).join(' ');
    const area=values.slice(0,-1).map((v,i)=>{
      const next=values[i+1];
      return shade((v+next)/2) ? `M${x(v)},176 L${x(v)},${y(pdf(v))} L${x(next)},${y(pdf(next))} L${x(next)},176Z` : '';
    }).join(' ');
    chart(body,`<path d="${area}" fill="#e5a16d"/><path d="M50 176H850" stroke="#788d8f"/><polyline points="${points}" fill="none" stroke="#254f56" stroke-width="3"/>`+
      marks.map(([v,t])=>`<path d="M${x(v)} 176V${y(pdf(v))}" stroke="#5b7778" stroke-dasharray="4 4"/><text x="${x(v)}" y="205" text-anchor="middle">${t}</text>`).join(''),label);
  }
  function bindSlider(body,draw) {
    const input=body.querySelector('input[type=range]');
    const update=()=>{
      const value=Number(input.value);
      body.querySelector('output').textContent=value;
      draw(value);
    };
    input.oninput=update;
    update();
  }
  function choices(body,draw,initial=null) {
    const buttons=[...body.querySelectorAll('[data-choice]')];
    const select=which=>{
      buttons.forEach((button,i)=>{
        button.classList.toggle('selected',i===which);
        button.setAttribute('aria-pressed',String(i===which));
      });
      draw(which);
    };
    buttons.forEach((button,i)=>button.onclick=()=>select(i));
    if (initial!==null) select(initial);
  }

  const intervalChoice=slide('どの分布を使う？','Choose Z, t or chi-square','133–136',
    '<p class="lesson-story">電池16台、標本平均120分。<br>母分散は未知。求めるのは<strong>母平均</strong>の区間。</p>'+
    options(['Z','t','χ²'])+result+
    step(1,math(tex`120\pm t_{0.025}(15)\sqrt{\widehat{\sigma_x^2}/16}`)),
    'Ask students to select the target first, then decide whether population variance is given. Reveal the interval expression only after they have chosen.',
    body=>{choices(body,i=>renderResult(body,[
      'Z：母分散が既知なら使える。今回は未知。',
      't：母分散の代わりに標本不偏分散を使う。',
      'χ²：正規母集団の母分散の区間に使う。'
    ][i]));},'cream');

  const intervalWidth=slide('標本を増やすと、幅は？','Sample size and margin of error','134 脚注1',
    note('架空の電池：標本平均120分・母標準偏差10分（既知）・信頼係数95%')+
    math(tex`120\pm1.96\frac{10}{\sqrt n}`)+plot+slider('標本数 n',16,100,16)+result,
    'Change n from 16 to 64. Ask students to predict the width before moving the slider. Keep both the sample mean and population SD fixed.',
    body=>{bindSlider(body,n=>{
      const margin=19.6/Math.sqrt(n);
      const x=v=>450+(v-120)*60;
      chart(body,`<line x1="60" x2="840" y1="134" y2="134" stroke="#899d9d"/><line x1="${x(120-margin)}" x2="${x(120+margin)}" y1="98" y2="98" stroke="#db8248" stroke-width="9" stroke-linecap="round"/><circle cx="450" cy="98" r="9" fill="#16786f"/><text x="450" y="61" text-anchor="middle">120分</text><text x="${x(120-margin)}" y="168" text-anchor="middle">${(120-margin).toFixed(2)}</text><text x="${x(120+margin)}" y="168" text-anchor="middle">${(120+margin).toFixed(2)}</text>`,'母平均の区間の幅');
      renderResult(body,`幅 ${(2*margin).toFixed(2)} 分`);
    });});

  const testing=slide('境界と、観測した値を比べる','Two-sided t test','141–145',
    plot+slider('標本平均 (mL)',185,215,190,.5)+
    note('架空の飲料：基準200 mL・n = 5・標本不偏分散62.5 mL²・両側5%')+
    step(1,result),
    'Start at 190 mL. Ask where the statistic lands relative to the two critical values before revealing the decision. Reset the comparison at 200, then move to 210.',
    body=>{bindSlider(body,mean=>{
      const t=(mean-200)/Math.sqrt(62.5/5), boundary=M.tq(.025,4);
      curve(body,{pdf:x=>M.tPdf(x,4),min:-5,max:5,shade:x=>Math.abs(x)>=boundary,
        marks:[[-boundary,'−2.7764'],[boundary,'2.7764'],[t,'T='+t.toFixed(2)]],label:'両側5%の棄却域と観測したT'});
      renderResult(body,`p ≈ ${(2*(1-M.tCdf(Math.abs(t),4))).toFixed(4)} · ${Math.abs(t)>boundary?'棄却する':'棄却できない'}`);
    });});

  const regression=slide('残差を二乗すると、どの直線？','Least squares','193–194',
    plot+slider('傾き b',0,1.2,.30,.01)+result+
    step(1,note('傾きを動かすたび、切片は平均点を通る位置に合わせる。直線の左と右で、ずれがどう変わるか見よう。')),
    'Ask students to minimize the squared residuals by dragging. The intercept is adjusted to pass through the centroid at every slope. These are synthetic practice observations.',
    body=>{const points=[[10,7],[15,13],[20,13],[25,21],[30,22],[35,25]], fit=M.regression(points);
      bindSlider(body,b=>{
        const a=fit.ym-b*fit.xm,x=v=>70+21*v,y=v=>180-4.4*v;
        const ss=points.reduce((sum,[px,py])=>sum+(py-a-b*px)**2,0);
        chart(body,`<path d="M70 15V180H845" fill="none" stroke="#829797"/><path d="M${x(10)} ${y(a+10*b)}L${x(35)} ${y(a+35*b)}" stroke="#163d49" stroke-width="3"/>`+
          points.map(([px,py])=>`<path d="M${x(px)} ${y(py)}V${y(a+b*px)}" stroke="#d48843" stroke-width="3"/><circle cx="${x(px)}" cy="${y(py)}" r="6" fill="#16786f"/>`).join('')+
          '<text x="69" y="15">得点</text><text x="810" y="210">出場分</text>','出場時間と得点の散布図、回帰直線、残差');
        renderResult(body,`残差二乗和 ${ss.toFixed(2)} 点²`);
      });
    });

  const relativeSpread=slide('同じ標準偏差、違う変動係数','Coefficient of variation','189–190',
    note('架空の魚の重さ。標準偏差は、どちらも10 kg。')+
    math(tex`CV=\frac{\sigma}{\mu}`)+plot+slider('Bの平均 (kg)',30,100,100,5)+
    step(1,result),
    'Fish group A has mean 50 kg. Ask whether the same absolute variation is large relative to the weight. Move B toward 50 kg and compare the ratios.',
    body=>{bindSlider(body,mean=>{
      bars(body,[100*10/50,100*10/mean],{labels:['A · 50 kg',`B · ${mean} kg`],max:36,highlight:i=>i===1,label:'相対的なばらつき'});
      renderResult(body,`A 20.0%　／　B ${(1000/mean).toFixed(1)}%`);
    });});

  const conditional=slide('条件付き確率：偶数と分かったら？','Conditional probability','110–112',
    '<p>公平なサイコロ。出た目が偶数だと分かった。</p><p>その目が「2」である確率は？</p>'+
    plot+controls(action('偶数だけ表示'))+
    step(1,math(tex`\Pr(2\mid\text{偶数})=\frac{1/6}{3/6}=\frac13`)),
    'First view all outcomes. Click the filter to reduce the sample space to the even faces. The numerator is one eligible face out of three.',
    body=>{let filtered=false;const draw=()=>bars(body,Array.from({length:6},(_,i)=>!filtered||i%2?1:0),{labels:[1,2,3,4,5,6],highlight:i=>i===1,label:filtered?'偶数2・4・6':'サイコロの6つの目'});body.querySelector('[data-action]').onclick=e=>{filtered=!filtered;e.target.textContent=filtered?'全部の目を表示':'偶数だけ表示';draw();};draw();},'cream');

  const lottery=slide('100円のくじ、平均でいくら戻る？','Expected value','117',
    note('授業用のくじ。10枚中、500円が1枚、100円が2枚、0円が7枚。')+
    plot+step(1,math(tex`E[X]=500\cdot0.1+100\cdot0.2+0\cdot0.7=70\ \text{円}`))+
    step(2,'<p class="lesson-result">賞金の平均70円 − 代金100円 ＝ 平均30円の赤字</p>'),
    'Ask students for the payoff times the probability of each bar. Compare expected payout and expected profit. The chance of any prize is a different question.',
    body=>{bars(body,[.7,.2,.1],{labels:['0円 · 70%','100円 · 20%','500円 · 10%'],max:1,label:'賞金ごとの確率分布'});});

  function counts(poisson, bears=false, companions=false) {
    const n=companions?6:5, target=n-1, initial=companions?75:60;
    return slide(poisson?(bears?'クマが現れる日：0日を引く':'0件を引くと、1件以上'):(companions?'6人のAI利用経験：5人か、5人以上か？':'5本。ちょうど？ それ以上？'),
      poisson?'Poisson and the complement':'Binomial probability',poisson?'120・204':'118–120',
      note(poisson?(bears?'100日間。各日の出現確率を1〜5%と仮定。λ = 100π。':'10分間の到着。平均件数 λ を動かそう。'):(companions?'授業用の6人のモデル。各人を独立、利用経験率を同じと仮定。':'5本のフリースロー。各回独立。成功確率 π を動かそう。'))+
      plot+slider(poisson?'λ':'π (%)',poisson?1:10,poisson?5:90,poisson?2:initial,poisson?.25:5)+
      (poisson?'':options(['ちょうど'+target+(companions?'人':'本'), target+(companions?'人':'本')+'以上']))+step(1,result),
      poisson?'Start with the zero bar. Ask which outcomes enter “at least one.” The last bar aggregates x ≥ 12.':
        'Hold the number of trials fixed. Ask students to identify the outcome bars for the exact count and then the upper tail before revealing the probability.',
      body=>{
        let tail=false,value=poisson?2:initial;
        const draw=()=>{
          let values,labels;
          if (poisson) {
            values=[Math.exp(-value)];
            for(let i=1;i<12;i++) values.push(values.at(-1)*value/i);
            values.push(Math.max(0,1-values.reduce((a,b)=>a+b,0)));
            labels=values.map((_,i)=>i===12?'12+':i);
          } else {
            const p=value/100;
            values=Array.from({length:n+1},(_,i)=>M.choose(n,i)*p**i*(1-p)**(n-i));
          }
          bars(body,values,{max:1,labels,highlight:i=>poisson?i>=1:i===target||i===n&&tail,label:'確率質量関数。オレンジが求める確率。'});
          const probability=poisson?1-values[0]:values[target]+(tail?values[n]:0);
          renderResult(body,poisson?`P(X ≥ 1) = 1 − P(X = 0) = ${(100*probability).toFixed(2)}%`:
            `P(X ${tail?'≥':'='} ${target}) = ${(100*probability).toFixed(2)}%`);
        };
        bindSlider(body,v=>{value=v;draw();});
        if(!poisson) choices(body,i=>{tail=!!i;draw();},0);
      });
  }

  const zArea=slide('境界を動かすと、右側確率は？','Standard normal upper tail','123–125・202',
    note('ロボットの身長。母平均160 cm、母標準偏差5 cmの正規モデル。')+
    plot+slider('身長 (cm)',150,175,169.8,.1)+
    step(1,result)+link('../week05/normal-upper-tail-table.html?p','標準正規分布表'),
    'Ask what the table entry measures. Start at 169.8 cm, so z = 1.96. Click reveal to see the numerical translation and tail probability. Move through 160 cm to read both signs.',
    body=>{bindSlider(body,height=>{
      const z=(height-160)/5;
      curve(body,{pdf:M.normalPdf,min:-4,max:4,shade:x=>x>=z,marks:[[z,z.toFixed(2)]],label:'標準正規分布の上側確率'});
      renderResult(body,`z = (${height} − 160) / 5 = ${z.toFixed(2)}　／　右側 ${(100*(1-M.normalCdf(z))).toFixed(2)}%`);
    });});

  const diceMeans=slide('1組のサイコロ、1つの標本平均','Central limit theorem','122–123',
    options(['4回で1組','25回で1組'])+plot+controls(action('100組 ▶')+'<button data-reset aria-label="リセット">↺</button>')+
    '<p data-dice class="secondary"></p>'+
    step(1,note('平均の中心は3.5のまま。1組を大きくすると、標本平均が3.5付近に集まる。')),
    'Predict first. Each group contributes one mean. With four rolls the only possible means are quarter steps; the apparent gaps are possible-value gaps. With 25 rolls more mean values are possible. Compare the spreads on the same scale.',
    body=>{
      const counts=Array(21).fill(0);
      let n=4,timer=null,trials=0;
      const draw=()=>bars(body,counts,{max:100,labels:counts.map((_,i)=>1+i/4),label:'標本平均のヒストグラム、横軸1〜6、刻み0.25'});
      const run=body.querySelector('[data-action]');
      const stop=()=>{clearInterval(timer);timer=null;run.disabled=false;};
      const reset=()=>{stop();counts.fill(0);trials=0;draw();body.querySelector('[data-dice]').textContent='1組 → 平均1個 → 棒を1つ足す';};
      choices(body,i=>{n=i?25:4;reset();},0);
      run.onclick=()=>{
        reset();run.disabled=true;
        timer=setInterval(()=>{
          const dice=Array.from({length:n},()=>1+Math.floor(Math.random()*6));
          const mean=M.mean(dice);
          counts[Math.round((mean-1)*4)]++;
          trials++;
          body.querySelector('[data-dice]').textContent=`最後の組 ${dice.map(x=>'⚀⚁⚂⚃⚄⚅'[x-1]).join(' ')}　平均 ${mean.toFixed(2)}　(${trials}/100)`;
          draw();
          if(trials===100) stop();
        },36);
      };
      body.querySelector('[data-reset]').onclick=reset;
      return stop;
    });

  const tShape=slide('自由度が増えると、tの形は？','Student’s t · Degrees of freedom','125–127・203',
    note('両側に2.5%ずつ。オレンジの領域は、合わせて5%。')+
    plot+slider('自由度 ν',2,40,4)+step(1,result)+link('../week06/t-table.html?p','t分布表'),
    'Hold the two tail probabilities fixed. Small df needs wider cutoffs. Use the df = 4 row first, then move the slider up and compare with normal ±1.96.',
    body=>{bindSlider(body,df=>{
      const q=M.tq(.025,df);
      curve(body,{pdf:x=>M.tPdf(x,df),min:-6,max:6,shade:x=>Math.abs(x)>=q,marks:[[-q,(-q).toFixed(3)],[q,q.toFixed(3)]],label:'t分布の中央95%と両端'});
      renderResult(body,`中央95%の境界 ±${q.toFixed(4)}　／　標準正規なら ±1.9600`);
    });});

  const standardize=slide('同じ162 cm、分母を選ぶ','Individual Z, sample-mean Z, and Student’s t','123–126',
    note('基準は160cm。個体または5体の平均を比較する。既知ならσ = 5 cm。未知なら不偏分散10 cm²。')+
    options(['1体の Z','5体の平均の Z','5体の平均の T'])+
    '<div class="lesson-math" data-score></div>'+plot+step(1,result),
    'The numerator stays at two centimeters. Ask students what changes: the random variable and its scale. Read the right-tail area using the distribution selected by the model.',
    body=>{
      choices(body,i=>{
        const scale=[5,5/Math.sqrt(5),Math.sqrt(10/5)][i],z=2/scale;
        const score=body.querySelector('[data-score]');
        const words=['(162 − 160) ÷ 5','(162 − 160) ÷ (5 / √5)','(162 − 160) ÷ √(10 / 5)'];
        score.textContent=words[i];
        curve(body,{pdf:i===2?x=>M.tPdf(x,4):M.normalPdf,shade:x=>x>=z,marks:[[z,z.toFixed(2)]],label:'選んだ標準化と右側の面積'});
        const tail=1-(i===2?M.tCdf(z,4):M.normalCdf(z));
        renderResult(body,`${i===2?'T':'Z'} = ${z.toFixed(4)}　／　右側 ≈ ${(100*tail).toFixed(2)}%${i===2?'（自由度4）':''}`);
      },1);
    });

  const bias=slide('大きい魚だけ測ると？','Selection bias and consistency','131–132',
    note('授業用モデル。200匹全体の平均は50kg。上位50匹だけを選ぶ方法と比べる。')+
    options(['全体から無作為','上位50匹から無作為'])+plot+slider('標本数 n',5,50,5,5)+
    step(1,result),
    'Ask whether larger samples fix the selection rule. Both sampling distributions narrow, but their centers differ. The draw is without replacement from the displayed eligible group.',
    body=>{
      const all=Array.from({length:200},(_,i)=>30+40*i/199);
      let selected=all,n=5;
      const r=()=>{const bins=Array(18).fill(0);const mean=M.mean(selected);for(let i=0;i<300;i++){const pool=[...selected];let sum=0;for(let j=0;j<n;j++){const k=j+Math.floor(Math.random()*(pool.length-j));[pool[j],pool[k]]=[pool[k],pool[j]];sum+=pool[j];}bins[Math.max(0,Math.min(17,Math.floor((sum/n-34)/2)))]++;}bars(body,bins,{max:300,labels:bins.map((_,i)=>i%2?'':34+2*i),highlight:i=>i===8,label:'標本平均の分布。基準50 kgはオレンジ。'});renderResult(body,`選べる魚の平均 ${mean.toFixed(1)} kg　／　母集団全体 50.0 kg`);};
      bindSlider(body,v=>{n=v;r();});
      choices(body,i=>{selected=i?all.slice(-50):all;r();},0);
    });

  const monty = slide('扉を変える？','Monty Hall','110–112',
    '<p>最初に選んだ扉は①。司会者は景品のない扉を1枚開ける。</p>'+
    options(['①に残る','残った扉へ変える'])+plot+result+
    step(1,note('最初から当たり：1/3。最初が外れ：2/3。その2/3では、変更すると当たる。')),
    'Ask for a prediction. The host knows the prize location and always opens an unchosen losing door. Click a strategy to simulate 100 independent rounds.',
    body=>{
      choices(body,i=>{
        const prizes=Array.from({length:100},()=>Math.floor(Math.random()*3));
        const wins=prizes.filter(prize=>i?prize!==0:prize===0).length;
        bars(body,[wins,100-wins],{labels:['当たり','はずれ'],max:100,highlight:j=>j===0,label:'100回の結果'});
        renderResult(body,`100回中 ${wins}回当たり`);
      });
      bars(body,[0,0],{labels:['当たり','はずれ'],max:100,label:'作戦を選択すると100回の結果を表示'});
    },'cream');

  const tea = lab(11,'tea','紅茶とミルク：4杯を選ぶ','Let students select four cups first. Then compare the success count with the exact number of equally likely choices.');
  const examReview = slide('どの道具を使う？','Choose the statistical tool','118–150',
    '<p class="lesson-story">同じ確率で独立に、6本のシュート。<br>成功がちょうど4本の確率を求めたい。</p>'+
    options(['二項分布','t分布','回帰分析'])+result+
    step(1,math(tex`\Pr(X=4)=\binom64\pi^4(1-\pi)^2`)),
    'Ask students to identify the quantity and the model before revealing the formula.',
    body=>{choices(body,i=>renderResult(body,['二項分布：独立で成功確率が同じ6回の成功数。','t分布：例えば、母分散が未知のときの標本平均の推測。','回帰分析：説明変数と目的変数の関係を調べる。'][i]));});


  // These replace formula-only pages while preserving their textbook notation.
  const formulaPage = (page,title,en,book,expression,notes) => ({
    sourcePage:page,title,book,notes,theme:'dark',
    html:math(expression)+`<p class="english">${ruby(title)} · ${en}</p>`
  });
  const meanFormula = tex`\bar X=\frac{1}{n}\sum_{i=1}^{n}X_i`;
  const varianceFormula = tex`\widehat{\sigma_x^2}=\frac{1}{n-1}\sum_{i=1}^{n}(X_i-\bar X)^2`;
  const individualZ = tex`Z=\frac{X-\mu_x}{\sigma_x}`;
  const averageZ = tex`Z=\frac{\bar X-\mu_x}{\sqrt{\sigma_x^2/n}}`;
  const tStatistic = tex`T=\frac{\bar X-\mu_x}{\sqrt{\widehat{\sigma_x^2}/n}}`;
  const binomial = tex`\Pr(X=x)={}_nC_x\,\pi^{x}(1-\pi)^{n-x}`;
  const poissonFormula = tex`\Pr(X=x)=\frac{e^{-\lambda}\lambda^x}{x!}`;
  const regressionModel = tex`y_i=a+bx_i+u_i`;

  window.CourseLessons = {
    10:deck('どの区間を作る？',[10,18,25],
      section('魚の平均と、ばらつき','1-6',intervalChoice),
      section('母平均：母分散が既知',formulaPage(7,'既知分散の区間推定','Known-variance 95% interval','134 脚注1',tex`\bar X\pm1.96\sqrt{\sigma_x^2/n}`,'Point to the specified population variance and the standard error. Then apply the rule to the batteries.'),'8-11',intervalWidth),
      section('母平均：母分散が未知','13',formulaPage(14,'母平均の区間推定','Unknown-variance 95% interval','133',tex`\bar X\pm t_{0.025}(n-1)\sqrt{\widehat{\sigma_x^2}/n}`,'Locate the degrees of freedom and the estimated variance. Ask students which t-table column they need.'),'15-19',lab(10,'mean-ci','t区間：標本を入れ替える','Edit the five practice values and compare the point estimate, standard error and width.')),
      section('母分散：χ²','21-22',formulaPage(23,'母分散の信頼区間','Population variance · 95% interval','136',tex`\left[\frac{\sum(X_i-\bar X)^2}{\chi^2_{0.025}(n-1)},\quad\frac{\sum(X_i-\bar X)^2}{\chi^2_{0.975}(n-1)}\right]`,'Point at the two upper-tail critical values. The larger denominator gives the lower bound.'),'24-26',lab(10,'variance-ci','χ²：二つの境界','Use both upper-tail table columns, then match the larger denominator to the lower endpoint.')),
      section('AL：条件から分布を選ぶ','28-31')),
    11:deck('仮説検定',[24,33],
      section('紅茶から考える偶然','1-3',tea),
      section('仮説・有意水準・棄却域','5-14',formulaPage(15,'母平均の検定統計量','One-sample t statistic','145',tex`T=\frac{\bar X-\mu_0}{\sqrt{\widehat{\sigma_x^2}/n}}`,'Highlight the null mean in the numerator; then use the drink example.')),
      section('母平均の検定とp値','16-22',testing,'24-26'),
      section('母比率の差','27-31',lab(11,'proportions','二つの母比率を比べる','Change only the support counts and compare the estimated difference with its uncertainty.'),'33-38')),
    12:deck('回帰分析',[17,28],
      section('NBAの散布図：xとy','1-6',formulaPage(7,'回帰モデル','Simple linear regression model','191–192',regressionModel,'Point at y, x, and the error term. Ask students to identify the units from the basketball example.'),'8'),
      section('直線と残差','9-12',regression,'14-18'),
      section('Excelの出力を読む','19-26',lab(12,'output','点を変えてExcel形式の出力を見る','Move one observation. Read slope and its unit first, then compare R² and the slope p-value.'),'28-29'),
      section('自分のデータ・AL','30',lab(12,'pairs','ペアデータから散布図へ','Use anonymous pairs and keep x and y matched.'),'32-35')),
    13:deck('解釈と総合復習',[27,32,38],
      section('単位と変動係数','1-7',relativeSpread,'8'),
      section('係数・有意性・交絡','9-17',lab(13,'interpret','その説明は、どこまで言える？','Have students defend their choice in words before revealing feedback.'),'19-22'),
      section('試験形式の復習','23-26',examReview,'27-39',lab(13,'review','新しい数値で、もう一問','Pick a topic, solve independently, then reveal the worked example.'),'42-43')),
    1:deck('推測統計と確率',[],
      section('モンティ・ホール','1-5','8-10',monty),
      section('標本から母集団へ','11-22'),
      section('事象と確率','25-36','37>38>39>40>41>42'),
      section('確率の計算','43-58',conditional)),
    2:deck('確率変数と期待値',[],
      section('100円のくじ','1-5',lottery),
      section('確率変数と期待値','6-17'),
      section('確率分布・AL','18-30')),
    3:deck('二項分布とポアソン分布',[10,21,36],
      section('NBA・組合せ','1-12',formulaPage(13,'二項分布','Binomial distribution','118',binomial,'Read the three factors aloud: number of orders, success powers, and failure powers.'),'14'),
      section('二項分布の確率','15-16',counts(false),'18-22'),
      section('ポアソンと分布表','23-25',formulaPage(26,'ポアソン分布','Poisson distribution','120',poissonFormula,'Introduce the expression. Use the table for the actual probability calculation.'),'27-31',counts(true),'33-38')),
    4:deck('離散確率分布の復習',[3,6,16,22,25,33,36,39],
      section('AIの友だち：二項分布','1-15',counts(false,false,true),'16-19'),
      section('クマの出現日：ポアソン近似','20-29',formulaPage(30,'ポアソン分布','Poisson distribution','120',poissonFormula,'Connect the mean count λ to nπ for the bear-day approximation.'),'31-32',counts(true,true)),
      section('総合演習とAL','33-47')),
    5:deck('確率密度と標準化',[34,36,60],
      section('写真判定から、時間の測定へ','1-13'),
      section('ラーメンの待ち時間・密度・面積','14-24'),
      section('正規分布とZ','25-36','37>38>39>40>41>42'),
      section('上側確率表と区間','43-44','45>46>47>48','49-51','52>53>54','55-57','58>59',zArea,'60-62','63>64>65>66>67>68','69>70>71>72>73>74','75')),
    6:deck('標本平均・t・χ²',[32,51,56,68],
      section('ガルトンボードと中心極限定理','1-7','8>10>12','9>11>13','14-16',diceMeans,'17-18'),
      section('個体のZと標本平均のZ','19-21',formulaPage(22,'標本平均の標準化','Sample mean Z score','123',averageZ,'Compare the denominator with the individual Z score on the previous slide.'),'23-28','29>30>31','32-33'),
      section('Curry・tと不偏分散','34-39',formulaPage(40,'標本平均の標準化','Sample mean t statistic','125',tStatistic,'Point at the hat. This is the estimated variance used to calculate standard error.'),'41-44','46-47',formulaPage(48,'標本不偏分散','Unbiased sample variance','126',varianceFormula,'Ask students to find the center first, square the deviations, and divide by n−1.'),'49-51','52>53>54>55','56','57>58>59','60'),
      section('表と左右の境界',tShape,'62-69'),
      section('カイ二乗分布','70-76')),
    7:deck('クラスのデータを標準化する',[21,47,75],
      section('1秒チャレンジと標本','1-6'),
      section('平均・偏差・不偏分散','7-8',formulaPage(9,'標本平均','Sample mean','122',meanFormula,'Add the five recorded values and divide by the count.'),'10-14','15>16>17>18','19-21','22>23>24>25','26-30'),
      section('標準化と上側確率','31-34',formulaPage(35,'個体の標準化','Individual Z score','123',individualZ,'The numerator is one observation minus the population mean.'),'36-47','48>49>50',zArea),
      section('X・標本平均・T','52',formulaPage(53,'標本平均の標準化','Sample mean Z score','123',averageZ,'The random variable here is an average of five.'),'54>55>56>57>58','59',formulaPage(60,'標本平均の標準化','Student’s t statistic','125',tStatistic,'Compare the estimated variance here with the known variance used in Z.'),'61>62>63>64','65>66>67>68',standardize),
      section('ALと追加チャレンジ','70-75','76>77>78>79>80>81>82')),
    8:deck('点推定と標本の偏り',[23,48],
      section('米国から日本へ：学力調査','1-10'),
      section('前回の復習とマグロの標本','11-24'),
      section('不偏性・有効性・一致性','25','26>27>28>29','30-34','35>36>37','38',bias,'39'),
      section('点推定：母平均と母分散','40-42','43>44>45>46','47-48','49>50','51'),
      section('20分クイズとAL','52-55')),
    14:deck('期末試験',[],
      section('試験当日',
        slide('期末試験','Final examination','', '<p class="lesson-story">2027年1月13日（水）<br>10:40–12:20</p>'+note('範囲・形式・持ち込みはUNIPAの最新案内を確認。'),
          'Use the official UNIPA announcement for the examination rules. The practice material is for preparation.','', 'dark')),
      section('直前の確認',examReview,
        slide('使う道具を、問いから選ぶ','Review by topic','',
          '<p>確率 → 数える対象と条件を確認</p><p>推定・検定 → 母数と仮定を確認</p><p>回帰 → 係数と単位を読む</p>'+
          link('course-slides.html?week=13&p','第13週の総合復習')+'<br>'+link('../textbook-guide.html?p#week-14','教科書ページ対応表'),
          'Direct students to the course review and textbook guide.')))
  };
})();
