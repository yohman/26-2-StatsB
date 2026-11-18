window.buildAdvancedLessons = function ({
  M,tex,step,math,plot,result,note,action,controls,slider,options,section,deck,slide,link,
  chart,bars,curve,bindSlider,choices,renderResult,intervalWidth,testing,regression,
  relativeSpread,varianceFormula,individualZ,binomial,regressionModel
}) {
  const p = text => `<p>${text}</p>`;
  const big = text => `<p class="lesson-story">${text}</p>`;
  const answer = text => `<p class="lesson-result">${text}</p>`;
  const intro = (ja,en,html,notes,theme='dark') => slide(ja,en,'',html,notes,undefined,theme);
  const explain = (ja,en,book,prompt,steps,notes,mount) =>
    slide(ja,en,book,prompt+steps.map((item,i)=>step(i+1,item)).join(''),notes,mount);
  const formula = (ja,en,book,expression,notes) => ({
    title:ja,book,notes,theme:'dark',html:math(expression)+`<p class="english">${ja} · ${en}</p>`
  });
  const practice = (ja,book,prompt,hint,notes) => ({
    ...slide(ja,'Independent practice',book,prompt+`<details><summary>参考公式</summary>${math(hint)}</details>`,notes),
    challenge:true
  });
  const al = (week,task,notes) => intro('AL','Independent worksheet',
    big(task)+link(`../../../agenda.html?p#week-${week}`,'ワークシートを開く'),notes,'cream');
  const tTable=link('../week06/t-table.html?p','t分布表');
  const zTable=link('../week05/normal-upper-tail-table.html?p','標準正規分布表');
  const chiTable=link('chi-table.html?p','χ²分布表');
  const fmt=(value,places=2)=>Number(value).toFixed(places);
  const pct=value=>fmt(100*value,2)+'%';
  const known=tex`\bar X\pm z_{0.025}\frac{\sigma_x}{\sqrt n}`;
  const unknown=tex`\bar X\pm t_{0.025}(n-1)\sqrt{\frac{\widehat{\sigma_x^2}}{n}}`;
  const chiCI=tex`\left[\frac{(n-1)\widehat{\sigma_x^2}}{\chi^2_{0.025}},\quad\frac{(n-1)\widehat{\sigma_x^2}}{\chi^2_{0.975}}\right]`;
  const oneMeanT=tex`T=\frac{\bar X-\mu_0}{\sqrt{\widehat{\sigma_x^2}/n}}`;
  const twoProp=tex`Z=\frac{\hat p_B-\hat p_A}{\sqrt{\hat p(1-\hat p)(1/n_A+1/n_B)}}\ ,\quad\hat p=\frac{x_A+x_B}{n_A+n_B}`;
  const axis='<path d="M60 168H840" stroke="#839498"/>';
  const tick=(x,y,text)=>`<text x="${x}" y="${y}" text-anchor="middle">${text}</text>`;
  const dot=(x,y,fill='#16786f',r=7)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
  const line=(x1,y1,x2,y2,stroke='#16786f',width=3)=>`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round"/>`;
  function interval(body,{low,high,center,min,max,unit=''}) {
    const x=value=>80+(value-min)/(max-min)*740;
    chart(body,axis+line(x(low),110,x(high),110,'#d57a3e',10)+
      line(x(low),97,x(low),123,'#b05d32')+line(x(high),97,x(high),123,'#b05d32')+
      tick(x(low),155,fmt(low))+tick(x(high),155,fmt(high))+
      (center===undefined?'':dot(x(center),110)+tick(x(center),68,fmt(center)))+tick(830,204,unit),
      `区間 ${fmt(low)} 〜 ${fmt(high)} ${unit}`);
  }

  const fishShops=slide('同じ50kg、どちらの売場がそろう？','Same mean, different spread','132・135',
    note('架空のマグロの記録。平均はどちらも50 kg。')+options(['売場A','売場B','両方'])+plot+step(1,result),
    'Predict based on the points. Reveal the spread after comparing the centers. Use this to decide whether the question asks for a mean or a variance.',
    body=>{choices(body,i=>{
      const groups=[[40,45,50,55,60],[47,48,50,52,53]];
      const x=v=>80+(v-38)*33;
      const rows=groups.map((g,j)=>i===j||i===2?
        tick(57,55+j*63,j?'B':'A')+g.map(v=>dot(x(v),50+j*63,j?'#d57a3e':'#16786f')).join(''):'').join('');
      chart(body,axis+line(x(50),24,x(50),168,'#789297',1)+rows+[40,45,50,55,60].map(v=>tick(x(v),200,v)).join(''),'二つの売場の重さと同じ中心');
      renderResult(body,'標本不偏分散　A：62.5 kg²　／　B：6.5 kg²');
    },2);},'cream');

  const method=slide('先に、何の区間かを決める','Choose Z, t, or chi-square','133–136',
    options(['電池の平均','得点の平均','重さのばらつき'])+
    '<p class="lesson-story" data-scenario></p>'+step(1,result),
    'Select a scenario, then ask what parameter is sought and whether population variance is known. Reveal the classification. Start with the batteries and contrast all three.',
    body=>{choices(body,i=>{
      body.querySelector('[data-scenario]').textContent=[
        '電池の母平均を推定。母標準偏差は既知。',
        '5試合の得点から母平均を推定。母分散は未知。',
        'トマトの重さがどれほど散らばるか。母分散を推定。'
      ][i];
      renderResult(body,['Z：母平均を推定（母分散は既知）','t：母平均を推定（母分散は未知）','χ²：正規母集団の母分散'][i]);
    },0);});

  const scores=[18,19,20,21,22],scoreSummary=M.summary(scores);
  const tWorked=explain('5回の得点から、母平均の区間','Student’s t interval','133・203',
    big('18、19、20、21、22 点')+tTable,[
      math(tex`\bar X=20,\quad\widehat{\sigma_x^2}=10/4=2.5`),
      p('自由度4、右側0.025 → 2.7764'),
      math(tex`20\pm2.7764\sqrt{2.5/5}\quad\Rightarrow\quad[18.04,\,21.96]\text{ 点}`)
    ],'Assume independent normal observations. Ask students to find the right-tail column on the table before revealing the value. Interpret this as an interval for the model mean.');
  const tWidth=slide('同じ5試合、信頼係数を変える','Confidence level and width','133',
    plot+options(['90%','95%','99%'])+step(1,result),
    'The observations, mean and degrees of freedom stay fixed. Ask where the extra coverage comes from and why the interval widens.',
    body=>{choices(body,i=>{
      const level=[.90,.95,.99][i],margin=M.tq((1-level)/2,4)*scoreSummary.se;
      interval(body,{low:20-margin,high:20+margin,center:20,min:15,max:25,unit:'点'});
      renderResult(body,`${Math.round(level*100)}%区間の幅 ${fmt(2*margin)} 点`);
    },1);});
  const varianceBounds=slide('χ²は、割る順番が逆になる','Variance interval bounds','135–136',
    note('独立な正規標本。n = 6、偏差二乗和 = 30 分²。')+plot+
    options(['右側0.025 → 下限','右側0.975 → 上限'])+result+
    step(1,answer('母分散の95%信頼区間：2.34 〜 36.09 分²'))+chiTable,
    'Ask students to find the larger critical value first. The common numerator stays 30. A larger divisor gives the lower bound. Keep the unit squared.',
    body=>{const small=M.chiq(.975,5),large=M.chiq(.025,5);
      choices(body,i=>{
        const q=i?small:large;
        curve(body,{pdf:x=>M.chiPdf(x,5),min:0,max:18,height:.17,
          shade:x=>i?x<=q:x>=q,marks:[[q,fmt(q,4)]],label:'自由度5のχ²分布と選んだ境界'});
        renderResult(body,`30 ÷ ${fmt(q,4)} ≈ ${fmt(30/q)} 分²`);
      },0);
    });

  function meanPractice(useT) {
    const center=useT?18:100,s=useT?Math.sqrt(10):10,n=useT?5:25;
    const q=useT?M.tq(.025,4):M.zq(.025),m=q*s/Math.sqrt(n);
    const label=useT?'別の5回の練習得点':'電池25台の平均充電時間';
    return [
      practice(label,'133–134',big(useT?'14、16、18、20、22 点':'平均100分、母標準偏差10分。')+
        p('独立な正規標本。母平均の95%信頼区間を求め、単位を添える。')+
        (useT?tTable:zTable),useT?unknown:known,'Let students choose the distribution from the conditions, then compute both bounds.'),
      explain(label+'：答え','Worked confidence interval','133–134',plot,[
        p(useT?'平均18点、偏差二乗和40。不偏分散40 ÷ 4 = 10点²。':'標準誤差は10 ÷ √25 = 2分。'),
        math(useT?tex`18\pm2.7764\sqrt{10/5}`:tex`100\pm1.96\frac{10}{\sqrt{25}}`),
        answer(`${fmt(center-m)} 〜 ${fmt(center+m)} ${useT?'点':'分'}`)
      ],'Point to the center and both endpoints. Ask the student to name the population parameter estimated.',
      body=>{interval(body,{low:center-m,high:center+m,center,min:center-7,max:center+7,unit:useT?'点':'分'});})
    ];
  }

  const cups=slide('ミルクが先の4杯はどれ？','The lady tasting tea','138–142',
    '<div class="door-row tea-cups"></div>'+controls(action('判定する')+'<button data-reset>新しい8杯</button>')+result+
    step(1,math(tex`{}_8C_4=70\quad\Rightarrow\quad P(4\text{杯正解})=1/70\approx1.43\%`)),
    'Fisher’s tasting experiment gives an exact null model. Four cups of each preparation are assigned at random. Select four first, then reveal. Under guessing every set of four has equal probability.',
    body=>{
      const correct=new Set(),picked=new Set(),row=body.querySelector('.tea-cups'),submit=body.querySelector('[data-action]');
      let done=false;
      row.innerHTML=Array.from({length:8},(_,i)=>`<button data-cup="${i}" aria-label="${i+1}杯目" aria-pressed="false">${i+1}</button>`).join('');
      const buttons=[...row.querySelectorAll('button')];
      const update=()=>{
        buttons.forEach((b,i)=>{
          b.classList.toggle('picked',picked.has(i));
          b.classList.toggle('milk-first',done&&correct.has(i));
          b.disabled=done;
          b.setAttribute('aria-pressed',String(picked.has(i)));
        });
        submit.disabled=picked.size!==4||done;
      };
      const reset=()=>{
        correct.clear();picked.clear();done=false;
        const room=buttons.map((_,i)=>i);
        for(let i=0;i<4;i++)correct.add(room.splice(Math.floor(Math.random()*room.length),1)[0]);
        renderResult(body,'4杯を選ぶ');update();
      };
      buttons.forEach((b,i)=>b.onclick=()=>{
        if(picked.has(i))picked.delete(i);else if(picked.size<4)picked.add(i);
        renderResult(body,`${picked.size} / 4 杯`);update();
      });
      submit.onclick=()=>{done=true;update();renderResult(body,`4杯中 ${[...picked].filter(i=>correct.has(i)).length}杯正解　／　青緑＝ミルクが先`);};
      body.querySelector('[data-reset]').onclick=reset;
      reset();
    },'cream');

  const testingSteps=explain('仮説検定の7手順','Seven-step testing workflow','138–142',
    big('200 mL表示の飲料。平均は違う？'),[
      p('① 方法を選ぶ　② H₀・H₁を書く　③ 有意水準を決める'),
      p('④ データを集める　⑤ 検定統計量を計算する'),
      answer('⑥ 棄却するか判断　⑦ 問いの言葉に戻す')
    ],'Frame the null as a model. Set the direction and error rate before reading the sample. Report the decision in context.');

  const tailTest=slide('違う？ 少ない？ 問いが変わると、尾が変わる','One-sided versus two-sided tests','139–142',
    note('H₀：母平均200 mL。自由度4。α = 5%。')+options(['異なる（両側）','少ない（左側）'])+plot+step(1,result),
    'Select the alternative before examining observations. Explain the long-run Type I error under H0. For two-sided alpha five percent each tail gets 2.5%.',
    body=>{choices(body,i=>{
      const q=M.tq(i?.05:.025,4);
      curve(body,{pdf:x=>M.tPdf(x,4),min:-5,max:5,
        shade:x=>i?x<=-q:Math.abs(x)>=q,marks:i?[[-q,'−'+fmt(q,4)]]:[[-q,'−'+fmt(q,4)],[q,fmt(q,4)]],
        label:'選んだ対立仮説に対応する棄却域'});
      renderResult(body,i?'H₁：μ < 200　／　左側5%':'H₁：μ ≠ 200　／　左右2.5%ずつ');
    },0);});

  const observedT=slide('観測値より極端な面積は？','p-value','148–150',
    note('飲料の例。両側検定。自由度4、観測T ≈ −2.83。')+plot+
    options(['p値の領域','棄却域 α = 5%'])+step(1,result),
    'Compare the area determined by the observed statistic with the preselected rejection area. The p-value is computed under the null model. It is not a posterior probability.',
    body=>{choices(body,i=>{
      const observed=10/Math.sqrt(62.5/5),q=i?M.tq(.025,4):observed;
      curve(body,{pdf:x=>M.tPdf(x,4),shade:x=>Math.abs(x)>=q,min:-5,max:5,
        marks:[[-q,'−'+fmt(q,3)],[q,fmt(q,3)]],label:'帰無仮説の下の両側面積'});
      renderResult(body,i?'事前に決めた基準：α = 0.05':`P(|T| ≥ ${fmt(observed,3)}｜H₀) ≈ ${fmt(2*(1-M.tCdf(observed,4)),4)}`);
    },0);});

  const proportions=slide('2つの応援席、支持率は違う？','Two-proportion z test','145–148',
    note('独立な無作為標本。Aは50人中20人が支持。Bも50人。H₀：母比率が等しい。')+
    plot+slider('Bの支持人数',15,39,30)+step(1,result),
    'Begin at B=30. Have students compute the pooled proportion, then see how increasing the difference affects the z statistic and decision. Use the supplied normal approximation.',
    body=>{bindSlider(body,b=>{
      const pool=(20+b)/100, z=(b/50-.4)/Math.sqrt(pool*(1-pool)*.04), pv=2*(1-M.normalCdf(Math.abs(z)));
      bars(body,[.4,b/50],{labels:['A：40%',`B：${b*2}%`],max:1,highlight:i=>i===1,label:'二つの標本支持率'});
      renderResult(body,`全体の比率 ${fmt(pool)}　／　Z = ${fmt(z)}　／　両側p = ${fmt(pv,4)}`);
    });});

  const data=[[10,7],[15,13],[20,13],[25,21],[30,22],[35,25]];
  function scatter(body,points,fit,marker,labels=['出場時間（分）','得点'],color=()=> '#16786f') {
    const x=v=>65+v/42*760,y=v=>180-v/37*149;
    let fittedLine='';
    if (fit) {
      const low=fit.b?Math.max(6,Math.min(-fit.a/fit.b,(37-fit.a)/fit.b)):6;
      const high=fit.b?Math.min(40,Math.max(-fit.a/fit.b,(37-fit.a)/fit.b)):40;
      if (high>=low) fittedLine=line(x(low),y(fit.a+low*fit.b),x(high),y(fit.a+high*fit.b),'#d57a3e',4);
    }
    const content=axis+line(65,181,65,30,'#839498',1)+
      [10,20,30,40].map(v=>tick(x(v),204,v)).join('')+
      [10,20,30].map(v=>tick(42,y(v)+6,v)).join('')+
      points.map(([px,py],i)=>dot(x(px),y(py),color(i))).join('')+
      fittedLine+
      (marker?line(x(marker[0]),y(marker[1]),x(marker[0]),169,'#94aca7',1)+dot(x(marker[0]),y(marker[1]),'#d57a3e',9):'')+
      tick(120,26,labels[1])+tick(760,216,labels[0]);
    chart(body,content,'散布図と選択した回帰モデル');
  }

  const pairing=slide('出場時間と得点、どちらを予測する？','Explanatory and outcome variables','191–192',
    note('6試合の架空のバスケットボール記録。')+options(['出場時間 → 得点','得点 → 出場時間'])+plot+step(1,result),
    'Keep the same observations. Swap the axes and ask what the new slope would measure. Emphasize that the model direction is a choice tied to the question.',
    body=>{choices(body,i=>{
      const points=i?data.map(([x,y])=>[y,x]):data;
      const fit=M.regression(points);
      scatter(body,points,fit,null,i?['得点','出場時間（分）']:undefined);
      renderResult(body,i?`得点が1点多いと、予測出場時間は ${fmt(fit.b)} 分長い。`:`1分長いと、予測得点は ${fmt(fit.b)} 点高い。`);
    },0);},'cream');

  const prediction=slide('直線は、何点と予測する？','Predict a fitted value','191–192',
    plot+slider('出場時間（分）',5,40,25)+step(1,result),
    'At 25 minutes read the prediction. Then move outside the original 10–35 minute data range and label extrapolation.',
    body=>{const fit=M.regression(data);bindSlider(body,x=>{
      const y=fit.a+x*fit.b;
      scatter(body,data,fit,[x,y]);
      renderResult(body,`${fmt(fit.a,4)} + ${fmt(fit.b,4)} × ${x} ≈ ${fmt(y)} 点${x<10||x>35?'（観測範囲外）':''}`);
    });});

  const excelOutput=slide('1試合が、回帰の結果を動かす','Read the regression output','190–194',
    note('6試合。最後の試合（35分）の得点だけを変える。')+plot+slider('最後の得点',8,35,25)+
    step(1,'<div data-output class="output-grid"></div>')+
    step(2,note('傾きの検定：H₀：母回帰係数 β = 0。p値は、効果の大きさと区別する。')),
    'Read the slope with units, then R² and the slope p-value. Changing a point with an extreme x value can affect the fitted slope and its precision.',
    body=>{bindSlider(body,last=>{
      const points=data.map(([x,y],i)=>[x,i===5?last:y]),fit=M.regression(points);
      scatter(body,points,fit,null,undefined,i=>i===5?'#b95330':'#16786f');
      const values=[['傾き',fmt(fit.b,4)],['標準誤差',fmt(fit.se,4)],['t値',fmt(fit.t,3)],['p値',fmt(fit.p,4)],['R²',fmt(fit.r2,3)]];
      body.querySelector('[data-output]').innerHTML=values.map(([name,value])=>`<span>${name}<b>${value}</b></span>`).join('');
    });});

  const excelColumns=slide('Excelで、どちらをYに入れる？','Excel Regression · Input Y and Input X','191–194',
    big('A列：試合　／　B列：出場分　／　C列：得点')+
    options(['Y：C列、X：B列','Y：B列、X：C列'])+result+
    step(1,note('データ → データ分析 → 回帰分析。見出しを含めたら「ラベル」。観測数も確認。')),
    'Ask which quantity should be predicted. In Excel enter C as Input Y and B as Input X. On Windows enable the Analysis ToolPak through Add-ins, and on Mac through Tools → Excel Add-ins if Data Analysis is absent.',
    body=>{choices(body,i=>renderResult(body,i?'その設定は、得点から出場時間を予測する。':'この設定は、出場時間から得点を予測する。'));});

  const confounding=slide('アイスが売れると、熱中症が増える？','Confounding and spurious correlation','195',
    note('架空の観測。横：アイスの販売数、縦：熱中症件数。')+options(['すべての日','涼しい日','暑い日'])+plot+
    step(1,answer('気温が、アイスの販売数と熱中症の両方に関係。')),
    'Ask for an explanation of the positive overall association. Separate cool and hot days to see how group membership produces the pooled trend. These classroom numbers are simulated.',
    body=>{const cool=[[7,6],[10,8],[14,5],[16,8],[18,6]],hot=[[23,23],[25,25],[29,22],[33,26],[37,23]];
      choices(body,i=>{
        const sample=i===1?cool:i===2?hot:cool.concat(hot);
        scatter(body,sample,M.regression(sample),null,['アイス販売数','熱中症件数'],
          j=>i===2||i===0&&j>=cool.length?'#aa5941':'#287b79');
      },0);
    });

  const adjusted=slide('変数を増やすと、当てはまりは？','Adjusted R²','192–193',
    note('架空のモデル比較。観測数10。通常の R² を 0.20 に固定。')+
    plot+slider('説明変数の数',1,6,1)+step(1,result),
    'Contrast the unadjusted statistic with adjusted R². Here R² is held fixed as a thought experiment so students can isolate the penalty for adding predictors. Explain negative values as weak fit after the penalty.',
    body=>{bindSlider(body,k=>{
      const r=1-(1-.2)*9/(9-k);
      const x=v=>110+(v+1.5)/2*700;
      chart(body,axis+line(x(0),28,x(0),168,'#839498',1)+
        line(x(0),67,x(.2),67,'#16786f',9)+line(x(0),122,x(r),122,'#d57a3e',9)+
        tick(x(.2)+68,74,'R²')+tick(x(r),108,'調整済み')+tick(x(0),199,'0'),
        '通常のR²と調整済みR²の比較');
      renderResult(body,`R² = 0.20　／　調整済みR² = ${fmt(r,3)}`);
    });});

  const interpretation=slide('この出力から、何が言える？','Interpreting a coefficient and p-value','190–192',
    big('傾き ＋0.6 点／分　　p = 0.14')+
    options(['効果はゼロ','証拠は十分でない','出場時間を増やせば得点が上がる'])+result+
    step(1,note('5%水準。係数の単位、推定の不確かさ、因果関係を分けて読む。')),
    'Ask students to defend a sentence. A p-value above .05 is insufficient evidence against a zero slope under the model. The estimated association remains +0.6 points per minute.',
    body=>{choices(body,i=>renderResult(body,[
      'この標本では、傾き0を棄却できない。0と証明したわけではない。',
      'その通り。推定値は＋0.6点／分。5%水準での証拠は十分でない。',
      'この分析は関連を推定。時間を増やした場合の効果は別の問い。'
    ][i]));});

  const binaryFit=slide('勝ち・負けを直線で予測すると？','Model choice for binary outcomes','193–195',
    note('モデル例：勝ち＝1、負け＝0。直線の予測は 0.10 + 0.03 × 出場分。')+
    plot+slider('出場時間（分）',0,40,35)+step(1,result),
    'Move past 30 minutes. Ask whether a response outside 0–1 can be interpreted as a probability. The point is to match the model to the response type.',
    body=>{bindSlider(body,n=>{
      const x=v=>60+v/40*780,y=v=>161-v*95;
      const prediction=.1+.03*n;
      chart(body,axis+line(x(0),y(1),x(40),y(1),'#809998',1)+
        line(x(0),y(.1),x(40),y(1.3),'#16786f',3)+dot(x(n),y(prediction),'#d57a3e')+
        tick(x(0),y(1)-6,'1')+tick(x(0),165,'0')+tick(x(40),199,'40分'),
        '0から1の範囲と線形予測の比較');
      renderResult(body,`予測 ${fmt(prediction)}${prediction>1?' → 確率の上限1を超える':' → 0〜1の範囲内'}`);
    });});

  const exam1=practice('試験形式 ① 6本のシュート','118–120',
    big('各シュートは独立。成功確率0.60。')+p('① ちょうど4本成功の確率。② 成功本数の期待値と分散。'),
    binomial,'Allow six minutes. Ask students to show the combination factor and keep the probability separate from the expected count.');
  const exam2=practice('試験形式 ② ロボットの身長','123–125・202',
    big('母平均160 cm、標準偏差5 cm。')+p('正規モデル。① 170 cm以上の確率。② 150〜170 cmの確率。')+zTable,
    individualZ,'Allow seven minutes. Circle the region sought for each part before using the right-tail table.');
  const exam3=practice('試験形式 ③ 回帰の読み取り','190–192',
    big('予測得点 ＝ 2 ＋ 0.6 × 出場分')+p('傾きのp値は0.14。① 30分の予測。② 傾きの単位と意味。③ 5%水準で傾き0を棄却できる？'),
    regressionModel,'Allow seven minutes. Separate prediction, interpretation, and the statistical decision.');

  const scoreTest=practice('5試合で、平均30点と違う？','143–145・203',
    big('28、30、32、34、36 点')+p('独立な正規標本。H₀：μ = 30。両側5%で検定する。')+tTable,
    oneMeanT,'Use a new simulated five-score set, separate from the worksheet. Have students state the alternative and calculate t.');
  const scoreAnswer=explain('違いの証拠は、十分か？','Worked one-sample t test','143–145',
    plot,[math(tex`T=\frac{32-30}{\sqrt{10/5}}=1.4142`),
      answer('1.4142 は −2.7764〜2.7764 の内側。H₀は棄却できない。')],
    'Sample mean 32, unbiased variance 10, df 4. Report the conclusion as evidence about the mean.',
    body=>{const q=M.tq(.025,4);curve(body,{pdf:x=>M.tPdf(x,4),min:-5,max:5,
      shade:x=>Math.abs(x)>=q,marks:[[-q,'−2.7764'],[Math.sqrt(2),'T=1.4142'],[q,'2.7764']],label:'観測Tと両側の棄却域'});});


  const smallGap=practice('支持率44%と56%：差は有意？','145–148',
    big('A：22/50　／　B：28/50')+p('両側5%。全体の比率、Z、結論を示す。')+zTable,
    twoProp,'Give five minutes. Ask students to compare these recruitment numbers with the earlier 20 and 30 example.');
  const smallGapAnswer=explain('12ポイント差を、標準誤差で割る','Worked difference in proportions','147–148',
    plot,[math(tex`\hat p=0.50,\quad Z=(0.56-0.44)/0.10=1.20`),
      answer('両側p ≈ 0.2301。5%水準でH₀を棄却できない。')],
    'The sample difference is 12 percentage points. Under the null the difference is not sufficiently unusual at the specified level.',
    body=>{curve(body,{pdf:M.normalPdf,shade:x=>Math.abs(x)>=1.2,marks:[[-1.2,'−1.20'],[1.2,'1.20']],label:'Zで見た両側p値'});});

  const regressionPractice=practice('この回帰の結論を一文で','190–192',
    big('回帰係数 ＋0.45 点／分。p = 0.18。')+
    p('① 傾きを単位付きで説明。② 5%水準で判断。③ この結果から因果関係を言えるか？'),
    regressionModel,'Students should interpret the fitted association and describe the evidence, separately.');
  const regressionAnswer=explain('推定値と証拠は別の数字','Worked slope interpretation','190–192',plot,[
    p('出場時間1分あたり、予測得点は0.45点高い。'),
    answer('0.18 > 0.05。傾き0は棄却できない。関連を調べる回帰の結果。')
  ],'Show the illustrative positive slope, then highlight that the reported p-value concerns uncertainty. The line drawn here illustrates the slope only.',
  body=>{scatter(body,[],{a:3,b:.45},[20,12]);});

  const poissonReview=explain('200個に1%なら、平均は何個？','Poisson approximation','120・204',
    big('1個の不良率1%。200個を独立に調べる。'),[
      math(tex`\lambda=n\pi=200(0.01)=2`),
      answer('表で P(X=0) ≈ 0.1353。少なくとも1個 ≈ 86.47%。')
    ],'Identify a fixed number of rare trials. Use the table at λ=2, x=0 and take the complement.');

  return {
    10:deck('区間推定を、条件から選ぶ',[],
      section('売場のマグロ',fishShops,method,
        explain('同じ標本でも、問いは二つ','Mean versus variance','133–136',
          big('中心はどこ？　／　どれだけ散らばる？'),[
            p('母平均の区間：元の単位。点・分・kg。'),
            answer('母分散の区間：単位を二乗。点²・分²・kg²。')
          ],'Have a student name the target and the units before any formula appears.')),
      section('母平均：母分散が既知',formula('既知分散の95%区間','Known-variance mean interval','134 脚注1',known,
        'The normal z cutoff is 1.96. Point to the given population standard deviation.'),
        intervalWidth,...meanPractice(false)),
      section('母平均：母分散が未知',
        formula('標本不偏分散','Unbiased sample variance','126・132',varianceFormula,'Recover the sum of squared deviations first.'),
        formula('未知分散の95%区間','Student’s t interval','133',unknown,'Choose df n−1 and the 0.025 upper-tail column.'),
        tWorked,tWidth,...meanPractice(true)),
      section('母分散：χ²',
        formula('母分散の95%信頼区間','Chi-square variance interval','135–136',chiCI,
          'Both critical values use df n−1. The upper-tail 0.025 critical value goes under the lower interval bound.'),
        practice('母分散の上下限','135–136',big('正規標本6回。偏差二乗和30分²。')+
          p('自由度、二つのχ²値、母分散の95%信頼区間を求めよう。')+chiTable,chiCI,
          'Have students write the upper-tail column beside each denominator.'),
        varianceBounds),
      section('AL',
        al(10,'得点・ネジの長さ・電池・トマト。','Students complete the worksheet on their own. Ask them to record the target parameter, distribution and units for each case.'))),
    11:deck('仮説検定',[],
      section('紅茶で、偶然を考える',cups,testingSteps,tailTest),
      section('母平均の検定',
        formula('母平均の検定統計量','One-sample t statistic','145',oneMeanT,'Distinguish the hypothesized mean in the numerator from the sample mean.'),
        explain('200 mL表示の飲料を測った','Worked one-sample test','143–145',
          big('180、185、190、195、200 mL。'),[
            p('独立な正規標本。H₀：μ = 200。H₁：μ ≠ 200。α = 0.05。'),
            math(tex`\bar X=190,\quad\widehat{\sigma_x^2}=250/4=62.5`),
            math(tex`T=\frac{190-200}{\sqrt{62.5/5}}\approx-2.83`)
          ],'Calculate the mean and unbiased variance from the five values. The critical value appears on the next slide.'),
        testing,observedT,scoreTest,scoreAnswer),
      section('母比率の差',
        formula('母比率の差のZ','Pooled two-proportion z statistic','147',twoProp,'The pooled estimate uses the common proportion under H0.'),
        proportions,
        explain('20人と30人：結論まで','Worked two-proportion test','146–148',
          big('A：20/50　／　B：30/50'),[
            math(tex`\hat p=(20+30)/(50+50)=0.50`),
            math(tex`Z=\frac{0.60-0.40}{\sqrt{0.50(0.50)(1/50+1/50)}}=2.00`),
            answer('両側p ≈ 0.0455。5%水準で母比率が等しいというH₀を棄却。')
          ],'Check both sides of the normal distribution. A 20 percentage-point sample difference and a p-value answer different questions.'),smallGap,smallGapAnswer),
      section('AL',al(11,'ポテトの重量・2社の満足度。','Have students follow all seven steps and write the conclusion in the language of the problem.'))),
    12:deck('回帰分析',[],
      section('バスケの記録を、点にする',
        intro('出場時間が長いと、得点も多い？','From records to a scatterplot',big('6試合。2列の記録。'),
          'Ask what we want to predict and what information can explain it. The next slide uses synthetic data.'),
        pairing,
        explain('点が右上がり。それだけで何が言える？','Association and causation','191–192・195',
          big('横：出場時間。縦：得点。'),[
            p('試合での役割、相手、展開が、両方に関係するかもしれない。'),
            answer('図から読み取るのは、観測された関連。')
          ],'Ask for examples of other variables and the mechanism by which each could affect both recorded values.')),
      section('回帰式と最小二乗法',
        formula('単回帰モデル','Simple linear regression model','191–192',regressionModel,'Introduce the intercept, slope and error term.'),
        formula('残差二乗和','Sum of squared residuals','193–194',tex`\sum_i(y_i-\hat y_i)^2`,
          'Show that the distance is vertical with y as the outcome, and the squares prevent cancellation.'),
        regression,prediction,
        practice('30分の予測得点','191–192',big('予測得点＝1.5＋0.65×出場分。')+
          p('30分の予測得点と、傾きの意味を単位付きで説明。'),regressionModel,
          'Have students show the substitution and write a sentence interpreting the slope.'),
        explain('傾きは点／分','Worked prediction','191–192',plot,[
          math(tex`1.5+0.65\times30=21.0\ \text{点}`),
          answer('出場時間が1分長いと、予測得点は0.65点高い。')
        ],'Point to the fitted value at x=30. In context this is a model prediction for a game.',
        body=>{scatter(body,[],{a:1.5,b:.65},[30,21]);})),
      section('Excelの出力',excelColumns,excelOutput,
        explain('回帰表を読む順序','Slope, fit and significance','190–194',
          big('何を説明するモデル？'),[
            p('傾き：1単位の差が、予測値で何単位の差になるか。'),
            p('R²：観測したyのばらつきのうち、直線が説明した割合。'),
            answer('p値：モデルの仮定の下で、傾き0への証拠。')
          ],'Review independent errors, constant error variance and the conditions for inference. Ask whether a large R² alone proves a causal relationship.'),regressionPractice,regressionAnswer),
      section('AL',al(12,'変数を決める → 散布図 → 回帰表。','Students complete their worksheet. Have them report slope with units, R² and the slope-test conclusion.'))),
    13:deck('解釈と期末試験の復習',[],
      section('数字は、単位と一緒に',
        intro('その結論、どこまで言える？','Interpreting results',big('係数　／　ばらつき　／　証拠'),
          'Ask students to explain a result aloud before computing anything.'),
        explain('同じ「10」でも、単位が違う','Variance and standard deviation','189–190',
          big('重さを kg で測ったら？'),[
            p('分散：平均との差を二乗するので kg²。'),answer('標準偏差：分散の平方根なので kg。')
          ],'Compare absolute spread next with the coefficient of variation.'),
        relativeSpread,interpretation,pairing,adjusted,binaryFit,confounding,
        explain('全員を測ったら？','Census and assumptions','194・196',
          big('今日の教室の全員が対象。'),[
            p('この集団の平均は、全員の値から直接計算できる。'),
            answer('別の日や別のクラスに一般化するなら、対象と抽出の条件を考える。')
          ],'Differentiate a census of this classroom from inference about a broader population.')),
      section('確率と推測の道具を確認',poissonReview,method,tailTest),
      section('試験形式：20分',
        intro('3問、20分','Exam-style practice',big('① 二項分布　② 正規分布　③ 回帰')+
          p('条件、計算、単位。最後に答えを一文で。')+link('../week13/quiz.html?p','3問をまとめて開く'),
          'Have students work individually. Spend six minutes on binomial, seven on normal probability, and seven on regression. Each question has its own confirmation before the solution.'),
        exam1,
        {...explain('確率と、平均の本数を分ける','Worked binomial probability','118–120',plot,[
          math(tex`P(X=4)={}_6C_4(0.6)^4(0.4)^2=0.31104`),
          answer('31.10%　／　期待値 3.6本　／　分散 1.44本²')
        ],'Highlight only the bar for exactly four. Compute mean and variance separately.',
        body=>{bars(body,Array.from({length:7},(_,i)=>M.choose(6,i)*.6**i*.4**(6-i)),{max:.5,highlight:i=>i===4,label:'ちょうど4本の確率'});}),anchor:'exam-answer'},
        exam2,
        slide('右側の尾と、中央の範囲','Worked normal probability','123–125・202',
          plot+options(['170cm以上','150〜170cm'])+step(1,result),
          'Toggle the requested region. Standardize both cutoffs; use the right-tail table and symmetry.',
          body=>{choices(body,i=>{
            curve(body,{pdf:M.normalPdf,shade:x=>i?Math.abs(x)<=2:x>=2,marks:[[-2,'150 cm'],[2,'170 cm']],label:'標準正規分布の選んだ範囲'});
            const q=1-M.normalCdf(2);
            renderResult(body,i?`−2 ≤ Z ≤ 2 → 1 − 2 × ${fmt(q,5)} ≈ ${pct(1-2*q)}`:`Z ≥ 2 → ${fmt(q,5)} ≈ ${pct(q)}`);
          },0);}),
        exam3,
        explain('予測20点。傾きの判断は別。','Worked regression interpretation','190–192',plot,[
          math(tex`2+0.6\times30=20\ \text{点}`),
          p('1分長いと、予測得点は0.6点高い。'),
          answer('p = 0.14 > 0.05。傾き0を棄却できない。')
        ],'Mark the predicted point on the line, then interpret the coefficient and the evidence separately.',
        body=>{scatter(body,[],{a:2,b:.6},[30,20]);})),
      section('試験当日',
        intro('期末試験の確認','Final examination',big('計算の前に問い。<br>計算の後に意味。')+
          note('試験範囲・形式・持ち込みは、UNIPAの最新案内を確認。'),
          'Close by having students state which tool they chose and why, then direct them to the official exam notice.')))
  };
};
