window.buildFoundationLessons = function ({
  M,tex,step,math,plot,result,note,action,controls,slider,options,section,deck,slide,link,
  chart,bars,curve,bindSlider,choices,renderResult,counts,zArea,diceMeans,tShape,standardize,bias,
  binomial,poissonFormula,individualZ,averageZ,tStatistic,varianceFormula,meanFormula,lottery,conditional
}) {

  const title = (ja,en,book,formula,notes) => ({
    title:ja,book,notes,theme:'dark',html:math(formula)+`<p class="english">${ja} · ${en}</p>`
  });
  const paragraph = text => `<p>${text}</p>`;
  const big = text => `<p class="lesson-story">${text}</p>`;
  const answer = text => `<p class="lesson-result">${text}</p>`;
  const explain = (ja,en,book,prompt,reveals,notes) =>
    slide(ja,en,book,prompt+reveals.map((value,i)=>step(i+1,value)).join(''),notes);
  const exercise = (ja,book,prompt,hint,notes) => ({
    ...slide(ja,'Independent practice',book,prompt+`<details><summary>参考公式</summary>${math(hint)}</details>`,notes),
    challenge:true
  });
  const art = (week,file) => `../week${String(week).padStart(2,'0')}/images/${file}`;
  const photo = (week,file,ja,credit,url,notes) => ({
    title:ja,theme:'space',notes,
    html:`<a class="photo-link" target="_blank" rel="noopener" href="${url}"><img class="full-photo" src="${art(week,file)}" alt="${ja}"><div class="photo-caption"><h1>${ja}</h1><p>${credit} ↗</p></div></a>`
  });
  const agenda = week => `../../../agenda.html?p#week-${String(week).padStart(2,'0')}`;
  const normalTable = link('../week05/normal-upper-tail-table.html?p','標準正規分布表');
  const poissonTable = link('../../resources/poisson-table.pdf','ポアソン分布表');
  const tTable = link('../week06/t-table.html?p','t分布表');
  const al = (week,ja,notes) => slide('AL', 'Independent worksheet', '',big(ja)+link(agenda(week),'教材とワークシート'),notes);

  function animate(count,period,tick,complete) {
    let index=0;
    const clock=setInterval(()=>{
      tick(index++);
      if(index===count){clearInterval(clock);complete?.();}
    },period);
    return ()=>clearInterval(clock);
  }
  const barsFor = (ja,en,book,prompt,values,labels,selected,steps,notes,max=1) =>
    slide(ja,en,book,prompt+plot+steps.map((item,i)=>step(i+1,item)).join(''),notes,
      body=>{bars(body,values,{labels,max,highlight:i=>selected.includes(i),label:ja});});

  const doors=slide('扉を変える？','Monty Hall','113–115',
    '<div class="door-row"><button data-door="0">①</button><button data-door="1">②</button><button data-door="2">③</button></div>'+
    result+controls(action('もう一度'))+step(1,note('司会者は景品の場所を知っていて、毎回、選ばれなかったハズレの扉を開ける。'))+
    step(2,answer('残る：1/3　｜　変える：2/3')),
    'Invite a volunteer to choose a door. The host always opens an unchosen losing door. In a second round ask the room to commit to one strategy. Reveal the theoretical comparison after playing.',
    body=>{
      const buttons=[...body.querySelectorAll('[data-door]')];
      let prize,first,open,done;
      const write=(message)=>renderResult(body,message);
      function reset(){
        prize=Math.floor(Math.random()*3);first=-1;open=-1;done=false;
        buttons.forEach((b,i)=>{b.disabled=false;b.className='';b.textContent=['①','②','③'][i];});
        write('最初の扉を選ぶ');
      }
      buttons.forEach((button,i)=>button.onclick=()=>{
        if(done||i===open) return;
        if(first<0){
          first=i;open=[0,1,2].find(v=>v!==first&&v!==prize);
          button.classList.add('picked');buttons[open].textContent='🐐';buttons[open].disabled=true;
          write('残る扉か、別の扉か。');
          return;
        }
        done=true;
        buttons.forEach((b,j)=>{b.disabled=true;b.textContent=j===prize?'🚗':'🐐';});
        write((i===first?'残った':'変えた')+' → '+(i===prize?'当たり':'ハズレ'));
      });
      body.querySelector('[data-action]').onclick=reset;reset();
    },'cream');

  const sampleVotes=slide('この5人で、全員を説明できる？','Population, sample and sampling error','102–105',
    note('授業用モデル：40人のうち24人が賛成。無作為に、重複なしで抽出。')+
    '<div class="population-grid" aria-label="40人の母集団"></div>'+
    options(['5人を選ぶ','20人を選ぶ'])+result+
    step(1,note('母集団の割合は60%。標本から求めた割合との差が、今回の標本誤差。')),
    'Predict how much the sample percentage might change. Draw twice at n=5, then twice at n=20. Identify the parameter, estimator, and realized estimate.',
    body=>{
      const grid=body.querySelector('.population-grid');
      const population=Array.from({length:40},(_,i)=>(i*17)%40<24);
      function draw(selection){
        grid.innerHTML=population.map((yes,i)=>`<span class="${selection.includes(i)?'picked':''} ${yes?'yes':'no'}">${yes?'●':'○'}</span>`).join('');
      }
      draw([]);
      choices(body,i=>{
        const n=i?20:5, pool=Array.from({length:40},(_,j)=>j);
        const picked=Array.from({length:n},()=>pool.splice(Math.floor(Math.random()*pool.length),1)[0]);
        const yes=picked.filter(j=>population[j]).length;
        draw(picked);renderResult(body,`標本の賛成 ${yes}/${n} = ${yes/n*100}%`);
      });
    });

  const events=slide('どの目を数える？','Union, intersection and complement','106–112',
    big('A：偶数　／　B：4以上')+
    '<div class="dice-row"></div>'+options(['A ∪ B','A ∩ B','A の余事象'])+result+
    step(1,math(tex`P(A\cup B)=P(A)+P(B)-P(A\cap B)`)),
    'Point to 4 and 6, which belong to both events. Ask how the union rule avoids counting them twice. Contrast the union with a mutually exclusive pair such as odd versus even.',
    body=>{
      choices(body,i=>{
        const sets=[[2,4,5,6],[4,6],[1,3,5]], selected=sets[i];
        body.querySelector('.dice-row').innerHTML=Array.from({length:6},(_,j)=>`<span class="${selected.includes(j+1)?'picked':''}">${'⚀⚁⚂⚃⚄⚅'[j]}</span>`).join('');
        renderResult(body,selected.join('・')+`　→　${selected.length}/6`);
      },0);
    });

  const coin=slide('公平なコインでも、途中は揺れる','Independence and long-run frequency','113–115',
    plot+controls(action('100回 ▶')+'<button data-reset>リセット</button>')+result+
    step(1,note('前の結果を知っても、次の表の確率は1/2。独立なら積で求める。')),
    'Run twice. The path changes even though each flip is generated with p=0.5. Ask whether a run of tails changes the next flip.',
    body=>{
      let stop=()=>{},series=[];
      const button=body.querySelector('[data-action]');
      function paint(){
        const coords=series.map((v,i)=>`${50+800*i/99},${177-145*v}`).join(' ');
        chart(body,`<path d="M50 104.5H850" stroke="#bc754a" stroke-dasharray="6 5"/><text x="855" y="112">50%</text><polyline points="${coords}" fill="none" stroke="#16786f" stroke-width="4"/><text x="800" y="211">100回</text>`,'表の累積割合と理論値50%');
      }
      function reset(){stop();series=[];paint();button.disabled=false;renderResult(body,'');}
      body.querySelector('[data-reset]').onclick=reset;
      button.onclick=()=>{reset();button.disabled=true;let heads=0;
        stop=animate(100,22,i=>{heads+=Math.random()<.5;series.push(heads/(i+1));paint();renderResult(body,`表 ${heads}/${i+1}　${(heads/(i+1)*100).toFixed(1)}%`);},()=>{button.disabled=false;});
      };
      reset();return ()=>stop();
    });

  const amount=slide('賞金と、手元に残る額','Random variable and probability distribution','117–118',
    note('10枚のくじ：0円×7、100円×2、500円×1。')+
    options(['賞金 X','純利益 X − 100'])+plot+result+
    step(1,note('横軸は結果、縦の棒はその結果の確率。合計は1。')),
    'Name X before drawing and x after observing the number. Switching to net profit shifts each possible outcome by 100 yen while keeping every probability fixed.',
    body=>{choices(body,i=>{
      const values=[0,100,500].map(v=>v-100*i);
      bars(body,[.7,.2,.1],{labels:values.map(v=>v+' 円'),max:1,label:'くじの確率分布'});
      renderResult(body,i?'−100円、0円、400円':'0円、100円、500円');
    },0);});

  const payout=slide('100円のくじ、いくらなら得？','Expected value','117・129',
    note('当たり10%、100円20%、0円70%。代金は100円。')+
    plot+slider('当たりの賞金 (円)',100,1100,500,100)+step(1,result),
    'Predict the break-even jackpot. Change only the biggest prize and leave the probabilities fixed. Reveal the expected profit, then ask why it is not a guarantee.',
    body=>{bindSlider(body,v=>{
      bars(body,[.7,.2,.1],{labels:['0円','100円',v+'円'],max:1,highlight:i=>i===2,label:'くじの賞金の確率'});
      renderResult(body,`平均の純利益 0.1 × ${v} + 20 − 100 = ${v/10-80} 円`);
    });});

  const dieMean=slide('一度も出ない3.5が、平均？','Expected value and repeated trials','117',
    plot+controls(action('サイコロを60回 ▶'))+result+step(1,math(tex`E[X]=\frac{1+2+3+4+5+6}{6}=3.5`)),
    'Run the dice. The average approaches a quantity that need not be a possible outcome. Reset and run again to show variation.',
    body=>{
      const button=body.querySelector('[data-action]');
      let stop=()=>{};
      bars(body,Array(6).fill(0),{labels:[1,2,3,4,5,6],max:25});
      button.onclick=()=>{
        button.disabled=true;const tally=Array(6).fill(0);let sum=0;
        stop=animate(60,35,i=>{const value=1+Math.floor(Math.random()*6);sum+=value;tally[value-1]++;
          bars(body,tally,{labels:[1,2,3,4,5,6],max:Math.max(25,...tally),highlight:j=>j===value-1,label:'各出目の回数'});
          renderResult(body,`${'⚀⚁⚂⚃⚄⚅'[value-1]}　${i+1}回の平均 ${(sum/(i+1)).toFixed(2)}`);
        },()=>{button.disabled=false;});
      };return ()=>stop();
    });

  const shape=slide('数える量？ 測る量？','Discrete and continuous','118・121',
    options(['ヒットの本数','配達時間'])+plot+result+
    step(1,note('台数や本数は棒を足す。連続量では、区間の面積を読む。')),
    'Use the same question format with two different units. Name the possible values first. For continuous time explain what the shaded area represents.',
    body=>{choices(body,i=>{
      if(i)curve(body,{pdf:x=>x>=0&&x<=20?.005*x:0,min:0,max:20,height:.11,shade:x=>x>=10&&x<=15,marks:[[10,'10分'],[15,'15分']],label:'配達時間の密度モデル'});
      else bars(body,[.25,.45,.25,.05],{labels:[0,1,2,3],max:1,highlight:i=>i===2,label:'安打数の確率'});
      renderResult(body,i?'10〜15分の確率 → 色の面積':'ちょうど2本の確率 → 2の棒');
    },0);});

  const combinations=slide('失敗の場所を1つ選ぶ','Combinations','118–119',
    '<div class="shot-row" aria-label="五つのシュートの位置"></div>'+
    options(['1本目','2本目','3本目','4本目','5本目'])+
    step(1,math(tex`{}_5C_4={}_5C_1=5`))+step(2,note('どの順番も、成功4回・失敗1回なら確率は同じ。')),
    'Let the class move the one miss across five positions. Every position gives a different sequence with four successes. This is the combinatorial factor.',
    body=>{choices(body,i=>{body.querySelector('.shot-row').innerHTML=Array.from({length:5},(_,j)=>j===i?'<span class="miss">×</span>':'<span>🏀</span>').join('');},0);});

  const batting=slide('5打席を、試合ごとに数える','Binomial model and observed frequencies','118–120',
    note('授業用モデル：各打席は独立、安打率32%。青緑＝理論、オレンジ＝実測。')+
    plot+controls(action('100試合 ▶')+'<button data-reset>リセット</button>')+result,
    'Before running, predict the modal count. Watch the running experiment converge toward the fixed theoretical bars. The two series share one fixed probability scale.',
    body=>{
      let stop=()=>{},n=0,observed=Array(6).fill(0);
      const model=observed.map((_,i)=>M.choose(5,i)*.32**i*.68**(5-i));
      const button=body.querySelector('[data-action]');
      const render=()=>{
        const toBar=(i,h,color,offset)=>`<rect x="${75+130*i+offset}" y="${178-h*145}" width="38" height="${h*145}" fill="${color}"/>`;
        chart(body,model.map((p,i)=>toBar(i,p,'#16786f',0)+toBar(i,n?observed[i]/n:0,'#d57a3e',41)+`<text x="${114+130*i}" y="206" text-anchor="middle">${i}安打</text>`).join('')+'<path d="M50 178H850" stroke="#788d8f"/>','理論と実測の安打数別割合');
        renderResult(body,`${n} 試合`);
      };
      function reset(){stop();n=0;observed.fill(0);button.disabled=false;render();}
      body.querySelector('[data-reset]').onclick=reset;
      button.onclick=()=>{reset();button.disabled=true;stop=animate(100,28,()=>{
        let hits=0;for(let i=0;i<5;i++) hits+=Math.random()<.32;
        observed[hits]++;n++;render();
      },()=>{button.disabled=false;});};
      reset();return ()=>stop();
    });

  const category = slide('問題の条件から、分布を選ぶ','Binomial versus Poisson','118–120',
    options(['5打席','混雑時の10分','薄い不良率で大量検査'])+result+
    step(1,note('先に X が何を数えるか、次に回数や確率の条件を書く。')),
    'Ask for the model before revealing the equation. A rare-event binomial can be approximated with Poisson; compare the known number of trials with the fixed observation window.',
    body=>{choices(body,i=>renderResult(body,[
      '二項：決まった5回のうち、何回成功したか。',
      'ポアソン：一定時間に何件起きたか。平均件数を使う。',
      'ポアソン近似：nが大きく、πが小さいときに λ = nπ。'
    ][i]));});

  const sensor=exercise('6個のセンサーを検品','118–120',
    big('6個。各センサーが不良の確率は10%。')+paragraph('独立とする。① 1個以上が不良の確率。② 不良数の期待値と分散。'),
    tex`P(X\geq1)=1-P(X=0)\qquad E[X]=n\pi`,
    'Give five minutes. Ask students to define X before substituting and to distinguish a probability from an expected count.');
  const sensorAnswer=barsFor('0個を除いた棒を足す','Worked binomial answer','118–120',
    note('不良数 X。n = 6、π = 0.10。'),Array.from({length:7},(_,i)=>M.choose(6,i)*.1**i*.9**(6-i)),
    [0,1,2,3,4,5,6],[1,2,3,4,5,6],[
      math(tex`P(X\geq1)=1-{}_6C_0(0.1)^0(0.9)^6\approx46.86\%`),
      answer('期待値 6 × 0.1 = 0.6個　／　分散 6 × 0.1 × 0.9 = 0.54個²')
    ],'Reveal the complement first, then separate the mean count and variance from the probability.');

  const stopwatch=slide('ぴったり1.000000秒に止める','Precision and measurement','121',
    '<div class="stop-face"><output>0.000000</output><small>秒</small></div>'+
    controls(action('スタート')+'<button data-reset>記録を消す</button>')+
    '<p data-history class="secondary"></p>'+step(1,note('表示の桁を決めると、同じ表示になる時間に幅ができる。連続モデルでは、区間の確率を考える。')),
    'Invite a student to aim for one second with the same button. Repeat several times. The display precision is not the timing accuracy. Use the window around one second to introduce an interval.',
    body=>{
      const display=body.querySelector('output');
      const button=body.querySelector('[data-action]');
      const scores=[];
      let start=null,frame;
      const tick=()=>{display.value=((performance.now()-start)/1000).toFixed(6);frame=requestAnimationFrame(tick);};
      function reset(){cancelAnimationFrame(frame);start=null;display.value='0.000000';button.textContent='スタート';}
      button.onclick=()=>{
        if(start===null){start=performance.now();button.textContent='ストップ';tick();return;}
        const elapsed=(performance.now()-start)/1000;
        reset();display.value=elapsed.toFixed(6);
        scores.unshift(elapsed.toFixed(6));
        body.querySelector('[data-history]').textContent='直近の記録　'+scores.slice(0,5).join('　·　');
      };
      body.querySelector('[data-reset]').onclick=()=>{scores.length=0;body.querySelector('[data-history]').textContent='';reset();};
      return ()=>cancelAnimationFrame(frame);
    },'space');

  const ramen=slide('何分待つ？ 高さより面積','Density and interval probability','121–122',
    note('授業用の待ち時間モデル（0〜20分）。王道家の実測値とは別の例。')+
    plot+options(['0〜5分','15〜20分'])+step(1,result),
    'First compare the equal-width slices. In the classroom model density rises toward longer waits. Ask which area is larger. The numbers follow from the toy shape, not from restaurant data.',
    body=>{choices(body,i=>{
      const lo=i?15:0,hi=lo+5;
      curve(body,{pdf:x=>x/200,min:0,max:20,height:.105,shade:x=>x>=lo&&x<=hi,
        marks:[[0,'0'],[5,'5'],[10,'10'],[15,'15'],[20,'20分']],label:'同じ幅の二つの待ち時間区間'});
      renderResult(body,`${lo}〜${hi}分：全体の ${((hi**2-lo**2)/4).toFixed(2)}%`);
    },0);});

  const spread=slide('平均を固定して、山を広げる','Normal distribution and standard deviation','122–123・129',
    note('ロボットの身長のモデル。平均160 cm。色の範囲は155〜165 cm。')+
    plot+slider('標準偏差 σ (cm)',3,10,5)+step(1,result),
    'Keep the interval and mean fixed. Increase sigma and ask why the proportion inside the same tolerance decreases. Variance is sigma squared, with units cm squared.',
    body=>{bindSlider(body,sd=>{
      curve(body,{pdf:x=>M.normalPdf(x,160,sd),min:130,max:190,height:.145,
        shade:x=>x>=155&&x<=165,marks:[[155,'155'],[160,'160'],[165,'165 cm']],label:'ロボットの身長と検査範囲'});
      renderResult(body,`分散 ${sd**2} cm²　／　範囲内 ${(100*(M.normalCdf(5/sd)-M.normalCdf(-5/sd))).toFixed(1)}%`);
    });});

  const tails=slide('表は右側。欲しい面積は？','Upper tail, lower tail, and interval','124–125・202',
    options(['右側','左側','中央'])+plot+step(1,result)+normalTable,
    'Use z=1.96. Start by pointing to row 1.9 and column .06. Reveal 0.025, then change the target region and ask students to combine the same information.',
    body=>{choices(body,i=>{
      const q=1.96;
      curve(body,{pdf:M.normalPdf,shade:x=>[x>=q,x<=q,Math.abs(x)<=q][i],
        marks:[[-q,'−1.96'],[q,'1.96']],label:'標準正規分布で選択した面積'});
      renderResult(body,['行1.9 × 列0.06 → 0.0250','1 − 0.0250 = 0.9750','1 − 2 × 0.0250 = 0.9500'][i]);
    },0);});

  const heightZ=slide('177cmを、標準偏差で測る','Height as a z-score','123',
    note('2024年国民健康・栄養調査。日本の20歳以上を対象とする全国補正値。')+
    options(['男性：168.4 ± 5.2 cm','女性：154.9 ± 5.1 cm'])+
    slider('比較する身長 (cm)',140,185,177,.1)+plot+step(1,result)+
    link('https://www.mhlw.go.jp/content/001742496.pdf#page=2','厚生労働省・第14表'),
    'Allow students to enter an example height without sharing it. Draw the mean marker and the observation, and reveal the scaled difference. A normal curve is only a visual reference for the chosen center and scale here.',
    body=>{
      let group=0,height=177;
      const draw=()=>{
        const [mean,sd]=[[168.4,5.2],[154.9,5.1]][group];
        const z=(height-mean)/sd,x=v=>54+(v-135)*14;
        chart(body,`<path d="M54 132H854" stroke="#809498"/><path d="M${x(mean)} 87H${x(height)}" stroke="#db8248" stroke-width="7"/><circle cx="${x(mean)}" cy="87" r="9" fill="#16786f"/><circle cx="${x(height)}" cy="87" r="7" fill="#d57a3e"/><text x="${x(mean)}" y="45" text-anchor="middle">平均 ${mean}</text><text x="${x(height)}" y="180" text-anchor="middle">${height} cm</text>`,'平均から身長までの距離');
        renderResult(body,`z = (${height} − ${mean}) ÷ ${sd} = ${z.toFixed(2)}`);
      };
      bindSlider(body,value=>{height=value;draw();});
      choices(body,i=>{group=i;draw();},0);
    });

  const galton=slide('落ちる球を、1つずつ追う','Galton board','122–123',
    '<div class="lesson-graph tall-graph"></div>'+options(['1球','100球'])+result+
    step(1,note('各段で左右を選ぶ。行き先は、右に進んだ回数で決まる。')),
    'Use one ball to show a path. Then release 100 balls. The bin counts are a live outcome of eight independent left/right steps. Bridge from the count of right steps to sampling means in the next experiment.',
    body=>{
      const bins=Array(9).fill(0),rows=8;
      let request,balls=[],done=0,total=0;
      const peg=(r,i)=>450+(i-r/2)*64;
      const draw=(elapsed)=>{
        let pegs='',dots='',cols='';
        for(let r=0;r<rows;r++) for(let i=0;i<=r;i++) pegs+=`<circle cx="${peg(r,i)}" cy="${29+31*r}" r="4" fill="#688085"/>`;
        balls.forEach(ball=>{
          const time=(elapsed-ball.delay)/105;
          if(time<0 || ball.landed)return;
          if(time>=rows){ball.landed=true;bins[ball.path.at(-1)]++;done++;return;}
          const r=Math.floor(time),f=time-r;
          const x=peg(r,ball.path[r])+(peg(r+1,ball.path[r+1])-peg(r,ball.path[r]))*f;
          dots+=`<circle cx="${x}" cy="${14+31*time}" r="6" fill="#d27d37"/>`;
        });
        cols=bins.map((n,i)=>`<rect x="${peg(8,i)-23}" y="${335-Math.min(n*2,75)}" width="46" height="${Math.min(n*2,75)}" fill="#217d74"/><text x="${peg(8,i)}" y="359" text-anchor="middle">${n}</text>`).join('');
        body.querySelector('.lesson-graph').innerHTML=`<svg viewBox="0 0 900 375" role="img" aria-label="落下する球と各列の個数">${pegs}${cols}${dots}</svg>`;
        renderResult(body,`${done} / ${total} 球`);
      };
      draw(0);
      choices(body,i=>{
        cancelAnimationFrame(request);bins.fill(0);done=0;total=i?100:1;
        balls=Array.from({length:total},(_,j)=>{
          const path=[0];for(let r=0;r<rows;r++)path.push(path.at(-1)+(Math.random()<.5?0:1));
          return {path,delay:j*18,landed:false};
        });
        if(matchMedia('(prefers-reduced-motion: reduce)').matches){draw(4000);return;}
        const start=performance.now();
        const advance=now=>{draw(now-start);if(done<total)request=requestAnimationFrame(advance);};
        request=requestAnimationFrame(advance);
      });return ()=>cancelAnimationFrame(request);
    });

  function varianceTable(ja,values,unit,notes) {
    const stats=M.summary(values);
    const n=values.length;
    const header='<thead><tr><th>記録</th><th>平均との差</th><th>偏差²</th></tr></thead>';
    const rows=values.map(v=>`<tr><td>${v}</td><td class="reveal" data-step="2">${v-stats.mean}</td><td class="reveal" data-step="3">${(v-stats.mean)**2}</td></tr>`).join('');
    return slide(ja,'Mean, deviations, squared deviations','122・126',
      `<div class="calc-grid"><table>${header}<tbody>${rows}</tbody></table><div>`+
      step(1,answer(`平均 ${stats.mean} ${unit}`))+step(3,paragraph(`偏差二乗和 ${stats.ss} ${unit}²`))+
      step(4,answer(`÷ ${n} → ${stats.variance.toFixed(2)} ${unit}²`))+
      step(5,answer(`÷ ${n-1} → ${stats.s2.toFixed(2)} ${unit}²`))+'</div></div>',
      notes);
  }

  const chiShape=slide('χ²は、ゼロより右にある','Chi-square distribution','127–128',
    plot+slider('自由度 ν',2,20,4)+step(1,note('正規モデルで、標準化したずれの二乗を足した量を扱う。分散の推定に戻ってくる。')),
    'Show the nonnegative axis and asymmetry at low degrees of freedom. The formal variance interval comes later.',
    body=>{bindSlider(body,df=>curve(body,{pdf:x=>M.chiPdf(x,df),min:0,max:38,height:.5,
      marks:[[0,'0'],[10,'10'],[20,'20'],[30,'30']],label:`自由度${df}のカイ二乗分布`}));});

  const liveStopwatch='https://statsb-live-stopwatch.ykawano421126.chatgpt.site/';
  const classSample=slide('5人を選んで、クラスを推定','Class population and sample','122',
    note('授業用デモ。18人が1回ずつ記録したと仮定。実際の授業はライブ教室へ。')+
    plot+controls(action('5人を無作為抽出'))+result+step(1,answer('全員の平均：1.027秒'))+
    link(liveStopwatch,'ライブ教室'),
    'Leave the class mean concealed at first. Draw five several times and compare. In class, use the live dashboard to collect real results before this step.',
    body=>{
      const values=[.86,.87,.91,.92,.93,.96,.98,.99,1,1.02,1.04,1.05,1.06,1.08,1.12,1.16,1.22,1.31];
      const draw=sample=>{
        const x=v=>60+(v-.8)*1470;
        chart(body,'<path d="M60 149H840" stroke="#809498"/>'+values.map((v,i)=>`<circle cx="${x(v)}" cy="${56+(i%3)*26}" r="${sample.includes(i)?10:6}" fill="${sample.includes(i)?'#d57a3e':'#80a7a6'}"/>`).join('')+
          [0.8,1,1.2,1.3].map(v=>`<text x="${x(v)}" y="184" text-anchor="middle">${v.toFixed(1)}</text>`).join(''),'クラス全員の秒数と抽出された五人');
      };
      draw([]);
      body.querySelector('[data-action]').onclick=()=>{
        const pool=values.map((_,i)=>i);
        const sampled=Array.from({length:5},()=>pool.splice(Math.floor(Math.random()*pool.length),1)[0]);
        draw(sampled);renderResult(body,sampled.map(i=>values[i].toFixed(2)).join(' · ')+`　平均 ${M.mean(sampled.map(i=>values[i])).toFixed(3)}秒`);
      };
    });

  const pointFish=slide('測れた5匹から、何を答える？','Parameter, estimator, and estimate','131–132',
    '<div class="fish-row"></div>'+controls(action('次の標本'))+result+
    step(1,note('母数：海全体の平均 μ。推定量：標本平均 X̄。推定値：今回の X̄ の値。'))+
    step(2,note('毎回の標本は変わる。今週は、未知の母数に1つの数値を答える。')),
    'First use the same sample from the lecture: 40, 45, 50, 55, 60 kg. Then redraw. The estimator is the rule; the estimate changes even when the population is fixed.',
    body=>{
      let fish=[40,45,50,55,60];
      const write=()=>{
        body.querySelector('.fish-row').innerHTML=fish.map(v=>`<span><i style="font-size:${v/13}cqw">🐟</i><b>${v} kg</b></span>`).join('');
        renderResult(body,`標本平均 ${fish.join(' + ')} ÷ 5 → ${M.mean(fish).toFixed(1)} kg`);
      };
      write();
      body.querySelector('[data-action]').onclick=()=>{fish=Array.from({length:5},()=>30+Math.round(Math.random()*40));write();};
    });

  const estimators=slide('平均は同じでも、推定の揺れが違う','Unbiasedness, efficiency and consistency','131–132',
    note('授業用モデル：30〜70 kgから等確率に独立抽出。母平均50 kg。')+
    plot+options(['最初の1匹','5匹の平均','25匹の平均'])+
    step(1,result)+step(2,note('中心が50 → 不偏性。5匹を使えるとき、最初だけより平均のばらつきが小さい → 有効性。nを増やすと母平均へ集中 → 一致性。')),
    'Both the first fish and the sample mean are unbiased. Compare them on a fixed horizontal and vertical scale, then increase n while keeping the same averaging rule. Each graph uses 300 independent samples.',
    body=>{
      choices(body,i=>{
        const n=[1,5,25][i], bins=Array(20).fill(0);
        for(let k=0;k<300;k++){
          let sum=0;for(let j=0;j<n;j++)sum+=30+40*Math.random();
          bins[Math.min(19,Math.floor((sum/n-30)/2))]++;
        }
        bars(body,bins,{max:300,labels:bins.map((_,j)=>30+2*j),highlight:j=>j===10,label:'推定値のヒストグラム。横軸は重さ。'});
        renderResult(body,`推定値の中心 50 kg　／　理論上の標準偏差 ${(40/Math.sqrt(12*n)).toFixed(2)} kg`);
      },0);
    });

  const newsCharts=slide('低下したのは、何の割合？','Reading the unit of observation','',
    options(['読解','数学'])+'<figure class="news-figure"><img alt="学区ごとの得点の変化のヒストグラム"></figure>'+
    step(1,result)+link('https://www.nytimes.com/2026/05/13/upshot/test-scores-school-districts-us.html','The New York Times · 2026.5.13'),
    'Look at the bars to the left of zero before showing the percent. The denominator is districts with the required data, not individual students. Toggle subjects to compare proportions.',
    body=>{choices(body,i=>{
      const img=body.querySelector('img');
      img.src=art(8,i?'nyt-math-histogram.png':'nyt-reading-histogram.png');
      renderResult(body,`データのある学区の ${i?70:83}% で低下`);
    },0);});

  function normalProblem(label,mean,sd,value,kind='right') {
    const z=(value-mean)/sd, q=1-M.normalCdf(z), left=kind==='left';
    return [
      exercise(label,'123–125・202',big(`平均 ${mean} ／ 標準偏差 ${sd}`)+
        paragraph(`正規モデルで、${value} ${left?'以下':'以上'}の割合を求める。`)+normalTable,individualZ,
        'Give students three minutes. Ask them to sketch and mark the correct side before looking up the table.'),
      slide(label+'：答え','Worked normal probability','123–125・202',
        note(`平均 ${mean}、標準偏差 ${sd}、境界 ${value}`)+plot+
        step(1,math(tex`z=\frac{${value}-${mean}}{${sd}}=${z.toFixed(2)}`))+
        step(2,answer(`${left?'左側':'右側'} ≈ ${((left?1-q:q)*100).toFixed(2)}%`)),
        left?'Use the right-tail table and subtract from one. For negative z, use symmetry first.':'Read the upper-tail table for positive z. For negative z, use its mirror and subtract from one.',
        body=>{curve(body,{pdf:M.normalPdf,shade:x=>left?x<=z:x>=z,marks:[[0,'0'],[z,`z=${z.toFixed(2)}`]],label:'求める確率の範囲'});})
    ];
  }

  function probabilityProblem(label,n,p,k,tail=false) {
    const probability=i=>M.choose(n,i)*p**i*(1-p)**(n-i);
    const values=Array.from({length:n+1},(_,i)=>probability(i));
    const selected=tail?[k,n]:[k];
    return [
      exercise(label,'118–120',big(`独立な ${n} 回　／　成功確率 ${p*100}%`)+
        paragraph(`① ちょうど${k}回の確率。${tail?` ② ${k}回以上の確率。`:''}`),binomial,
        'Define X first. Ask which bars are included, then substitute.'),
      barsFor(label+'：答え','Worked probability','118–120',
        note(`n = ${n}、π = ${p}、x = ${k}`),values,values.map((_,i)=>i),selected,[
          math(tex`P(X=${k})={}_{${n}}C_{${k}}(${p})^{${k}}(${(1-p).toFixed(2)})^{${n-k}}\approx ${(values[k]*100).toFixed(2)}\%`),
          ...(tail?[math(tex`P(X\geq${k})=P(X=${k})+(${p})^${n}\approx ${((values[k]+values[n])*100).toFixed(2)}\%`)]:[])
        ],'Point to the highlighted bars when combining the probabilities.',.5)
    ];
  }

  function poissonProblem(label,n,p) {
    const lambda=n*p,q=Math.exp(-lambda);
    return [
      exercise(label,'120・204',big(`n = ${n}　／　1回の確率 π = ${p}`)+paragraph('ポアソン近似で、1回以上の確率を表から求めよう。')+poissonTable,
        tex`\lambda=n\pi,\quad P(X\ge1)=1-P(X=0)`,'Start the clock after students identify what counts as one event. Use the table.'),
      barsFor(label+'：答え','Worked Poisson approximation','120・204',
        note('表で0の行を探す。'),[q,1-q],['0回','1回以上'],[1],[
          math(tex`\lambda=${n}\times${p}=${lambda},\qquad P(X=0)\approx${q.toFixed(4)}`),
          answer(`1 − ${q.toFixed(4)} ≈ ${((1-q)*100).toFixed(2)}%`)
        ],'Show that the second bar combines every positive count. This is a model-based approximation.')
    ];
  }

  const formulas = {
    mean:title('標本平均','Sample mean','122',meanFormula,'Point to the sum and the number of observations.'),
    variance:title('標本不偏分散','Unbiased sample variance','126',varianceFormula,'Use the squared deviations from the sample mean and divide by n−1.'),
    z:title('個体の標準化','Individual Z','123',individualZ,'The denominator is the population standard deviation for one observation.'),
    zbar:title('標本平均の標準化','Sample mean Z','123',averageZ,'Ask students to locate the n in the denominator.'),
    t:title('t分布','Student’s t','125',tStatistic,'The hat denotes the variance estimated from the sample.'),
    binomial:title('二項分布','Binomial distribution','118',binomial,'Read the combination factor and one sequence’s probability separately.'),
    poisson:title('ポアソン分布','Poisson distribution','120',poissonFormula,'Read λ as the expected count. Use the table for probabilities.'),
    moments:title('二項分布の期待値と分散','Binomial mean and variance','120',tex`E[X]=n\pi,\qquad \operatorname{Var}(X)=n\pi(1-\pi)`,'Name the count and squared-count units.'),
  };

  const binaryMoments=slide('当たりの数は、どのくらい揺れる？','Binomial mean and variance','120',
    note('独立なガチャを10回。')+plot+slider('当たり確率 (%)',5,95,25,5)+step(1,result),
    'Keep the number of draws at ten. Ask where the spread is greatest. Contrast the position of the probability bars with the expected count.',
    body=>{bindSlider(body,value=>{
      const p=value/100,n=10;
      const probabilities=Array.from({length:n+1},(_,i)=>M.choose(n,i)*p**i*(1-p)**(n-i));
      bars(body,probabilities,{max:1,highlight:i=>i===Math.round(n*p),label:'10回の当たり数の分布'});
      renderResult(body,`期待値 ${(n*p).toFixed(2)}個　／　分散 ${(n*p*(1-p)).toFixed(2)}個²`);
    });});

  const finalNormalQuestion=exercise('期末試験形式：S評価は何点から？','123–125・202',
    big('試験の得点：平均55点、標準偏差10点。')+paragraph('正規モデル。① 70点以上は何％？ ② 上位5%に入る最低の整数得点は？ ②は z = 1.65 を使用。')+normalTable,
    individualZ,'Allow eight minutes. Students should calculate a z-score in the first question and reverse the calculation for the second.');
  const finalNormalAnswer=slide('点数 → Z、Z → 点数','Worked exam practice','123–125・202',
    plot+options(['① 70点以上','② 上位5%'])+step(1,result),
    'Reveal one answer at a time. The upper-tail cutoff is 71.5 using the given z. The smallest eligible integer is 72.',
    body=>{choices(body,i=>{
      const z=i?1.65:1.5, x=i?71.5:70;
      curve(body,{pdf:M.normalPdf,shade:v=>v>=z,marks:[[0,'55点'],[z,x+'点']],label:'試験得点の右側の面積'});
      renderResult(body,i?'55 + 10 × 1.65 = 71.5 → 72点以上':'z = (70 − 55) ÷ 10 = 1.50 → 右側 6.68%');
    },0);});

  const curryT=slide('5試合からTまで計算する','Worked one-sample t','125–126',
    note('Curryを題材にした架空の練習得点。24, 28, 30, 32, 36点。基準は27.4点。')+
    step(1,math(tex`\bar X=150/5=30\qquad\sum(X_i-30)^2=80`))+
    step(2,math(tex`\widehat{\sigma_x^2}=80/4=20\qquad\sqrt{20/5}=2`))+
    step(3,answer('T = (30 − 27.4) ÷ 2 = 1.3　／　自由度4')),
    'Stay with these same five scores throughout the reveal. Distinguish the sample standard deviation from the standard error. Then use the t slide for a probability or cutoff question.');

  const classFlow=explain('5人から全員へ','Live one-second activity','122–126',
    big('記録を集める → 5人を抽出')+link(liveStopwatch,'ライブ教室を開く'),[
      paragraph('抽出した5人の平均と不偏分散を紙で計算。'),paragraph('ステップを表示してから、全員の平均を公開。')
    ],'Keep the dashboard projected during submission. Do not display the class mean before students calculate the sample result. Use the demo on the next slide if needed.');

  const japan=slide('日本の過去と比べると？','Same country, different years','',
    '<figure class="news-figure"><img src="'+art(8,'japan-elementary-trends.svg')+'" alt="日本の小6の国語・算数の平均スコアの推移"></figure>'+
    step(1,answer('小6国語：505.8 → 489.9　（2016 → 2024）'))+
    link('https://www.mext.go.jp/content/20250731-mxt_chousa02-000044035-05.pdf','文部科学省・経年変化分析調査'),
    'Read the domestic study on its own scale. A high international rank and change over time answer different questions. Then ask how the study selects schools and students.');


  const cdfSlide=slide('同じ身長モデルを、二つの図で見る','Density and cumulative distribution','121–122',
    plot+slider('境界 x (cm)',145,175,165,.5)+step(1,result),
    'Move the boundary. The shaded area on the density curve is exactly the height on the cumulative graph at that boundary. The two vertical axes have different units.',
    body=>{bindSlider(body,value=>{
      const x=(v,offset)=>offset+(v-140)*8,y=(v)=>177-v*140;
      const trace=(fn,offset)=>Array.from({length:81},(_,i)=>{
        const v=140+i*.5;
        return x(v,offset)+','+y(fn(v));
      }).join(' ');
      const density=v=>M.normalPdf(v,160,5)/.085;
      const f=v=>M.normalCdf((v-160)/5);
      const area=Array.from({length:101},(_,i)=>140+(value-140)*i/100).map(v=>x(v,45)+','+y(density(v))).join(' ');
      chart(body,
        '<text x="45" y="24">密度 f(x)</text><text x="510" y="24">累積 F(x)</text><path d="M45 177H365M510 177H830" stroke="#809498"/>'+
        `<polygon points="45,177 ${area} ${x(value,45)},177" fill="#e8a475"/><polyline points="${trace(density,45)}" fill="none" stroke="#1d605d" stroke-width="3"/><polyline points="${trace(f,510)}" fill="none" stroke="#1d605d" stroke-width="3"/><path d="M510 ${y(f(value))}H${x(value,510)}V177" fill="none" stroke="#b97544" stroke-dasharray="5 4"/><circle cx="${x(value,510)}" cy="${y(f(value))}" r="6" fill="#d58047"/><text x="${x(value,45)}" y="207" text-anchor="middle">${value} cm</text><text x="${x(value,510)}" y="207" text-anchor="middle">${value} cm</text>`,
        '曲線の下の左側面積と累積分布の高さを比較');
      renderResult(body,`左の色の面積 ＝ 右の点の高さ ＝ ${(100*f(value)).toFixed(2)}%`);
    });});

  const teamExercise=exercise('学園祭の受付チーム','119',
    big('7人から3人を選ぶ。')+paragraph('並べる順番は区別しない。選び方は何通り？'),
    tex`{}_nC_x=\frac{n!}{x!(n-x)!}`,'Let students calculate independently. Ask how many ordered lists refer to the same three-person team.');
  const teamAnswer=explain('並べた6通りを、1チームに','Worked combinations','119',big('A・B・C　／　A・C・B　／　B・A・C<br>B・C・A　／　C・A・B　／　C・B・A'),[
    math(tex`{}_7C_3=\frac{7\times6\times5}{3\times2\times1}=35`),answer('35チーム')
  ],'Each displayed order names the same team. Count ordered selections, then divide by six.');

  const deliveryExercise=exercise('配達の待ち時間を読む','121–122',
    big('累積確率：5分まで20%、10分まで55%。')+paragraph('5〜10分の確率は？ 2つの累積確率から求める。'),
    tex`P(a\le X\le b)=F(b)-F(a)`,'Ask students which portion is included in both accumulated probabilities.');
  const deliveryAnswer=barsFor('左からの累積を、引き算する','Worked cumulative probability','121–122',
    note('F(5) = 0.20、F(10) = 0.55。'),[.2,.35,.45],['5分まで','5〜10分','10分より後'],[1],
    [math(tex`F(10)-F(5)=0.55-0.20=0.35`),answer('5〜10分：35%')],
    'The first two bars together are F(10). Subtract the first bar to isolate the interval.');

  const commuteExercise=exercise('ロボット5体の身長','126',
    big('152、156、160、164、168 cm。')+paragraph('① 標本平均。② 標本の分散。③ 母分散の不偏推定。'),
    varianceFormula,'Students should show a vertical calculation table, as on the worksheet.');

  const lotteryExercise=exercise('100円を払う価値はある？','117',
    big('300円が20%、100円が30%、0円が50%。')+paragraph('① 賞金の期待値。② 代金100円を引いた純利益の期待値。'),
    tex`E[X]=\sum_x xP(X=x)`,'Allow a few minutes. A prize of exactly 100 yen produces a zero net payoff.');
  const lotteryAnswer=barsFor('確率で重みをつける','Worked expected value','117',
    note('各棒の賞金 × 確率を足す。'),[.5,.3,.2],['0円','100円','300円'],[2],[
      math(tex`E[X]=0(0.5)+100(0.3)+300(0.2)=90\ \text{円}`),answer('純利益の期待値：90円 − 100円 = −10円')
    ],'Explain why the expected profit is not the probability of losing.');


  const centralExercise=exercise('中央の身長に入る割合','123–125・202',
    big('身長 X：平均160 cm、標準偏差5 cm。')+
    paragraph('正規モデルで、155〜170 cmの割合を求める。2つの境界をZにしよう。')+normalTable,
    individualZ,'Let students draw the asymmetrical interval and mark both tails independently.');
  const centralAnswer=slide('左と右で、引く面積が違う','Worked central probability','123–125・202',
    plot+step(1,answer('155 → z = −1.00　／　170 → z = 2.00'))+
    step(2,math(tex`P(-1\le Z\le2)=1-0.1587-0.0228=0.8185`)),
    'Use the symmetry for the left tail and the table for the right tail. Use the rounded table values, giving 81.85 percent.',
    body=>{curve(body,{pdf:M.normalPdf,shade:x=>x>=-1&&x<=2,marks:[[-1,'−1'],[2,'2']],label:'区間に含まれる標準正規分布の面積'});});

  const meanExercise=exercise('4人の標本平均のZ','123–125',
    big('母平均50点、母標準偏差10点。')+paragraph('正規母集団から独立に4人を抽出。平均60点以上の確率を表で求める。')+normalTable,
    averageZ,'Ask whether the denominator is 10 or 5. Then ask students to mark where to read the right tail.');
  const meanAnswer=slide('平均のものさしは5点','Worked sample-mean Z','123–125',
    plot+step(1,math(tex`Z=\frac{60-50}{10/\sqrt4}=2.00`))+step(2,answer('上側 0.0228 → 約2.28%')),
    'The distribution used here is the standardized distribution of the sample mean, with the population standard deviation known.',
    body=>{curve(body,{pdf:M.normalPdf,shade:x=>x>=2,marks:[[0,'50点'],[2,'60点']],label:'標本平均60点以上の上側確率'});});

  const compareSamples=slide('六つの標本平均を、母平均と比べる','Sampling error across repeated samples','131–132',
    note('母平均28点と分かっている練習用の得点。各ボタンは5個の記録。')+
    options(['A','B','C','D','E','F'])+result+plot+
    step(1,note('母平均28点より上の標本も、下の標本もある。推定値は標本ごとに変わる。')),
    'Ask each student to calculate all six sample means on paper. Click A through F to plot the computed means cumulatively. The dashed line is the known population mean used for comparison.',
    body=>{
      const samples=[[24,25,28,30,33],[18,23,24,27,28],[29,30,31,34,36],[22,24,28,29,32],[26,28,30,31,35],[21,24,26,28,31]];
      const seen=new Set(),x=v=>50+(v-22)*66.5;
      const draw=()=>{
        const ref=x(28);
        chart(body,`<path d="M50 170H850" stroke="#839a99"/><path d="M${ref} 28V170" stroke="#357d76" stroke-dasharray="5 4"/><text x="${ref}" y="23" text-anchor="middle">母平均28</text>`+
          [...seen].sort().map(i=>`<circle cx="${x(M.mean(samples[i]))}" cy="${45+i*20}" r="7" fill="#d57a3e"/><text x="${x(M.mean(samples[i]))+13}" y="${51+i*20}">${'ABCDEF'[i]} ${M.mean(samples[i]).toFixed(1)}</text>`).join('')+
          [22,24,26,28,30,32,34].map(v=>`<text x="${x(v)}" y="200" text-anchor="middle">${v}</text>`).join(''),'六つの標本平均と基準28点');
      };
      draw();
      choices(body,i=>{seen.add(i);draw();renderResult(body,`${samples[i].join('・')} → 平均 ${M.mean(samples[i]).toFixed(1)} 点`);});
      const heading=body.querySelector('.secondary');
      heading.insertAdjacentHTML('afterend','<details><summary>計算用の6組</summary>'+samples.map((row,i)=>`<span class="sample-data">${'ABCDEF'[i]}　${row.join('・')}</span>`).join('')+'</details>');
    });

  return {
    1:deck('推測統計と確率',[],
      section('扉がひらく',doors,
        explain('扉を変えると、いつ当たる？','Conditional reasoning','113–115',big('最初の選択は、3通り。'),[
          paragraph('初めから当たりを選ぶ確率は1/3。変えるとハズレ。'),
          answer('最初にハズレを選ぶ確率は2/3。変えると当たり。')
        ],'Ask students to describe which initial choice makes switching win.')),
      section('母集団・標本・推定',sampleVotes,
        explain('標本から、その先へ','Inferential process','102–105',big('40人のうち、5人を見た。'),[
          paragraph('全員の賛成割合 → 母数。'),paragraph('標本の賛成割合を使う → 推定量。'),answer('今回の抽出で出た数字 → 推定値。')
        ],'Use the last run as the realized estimate. Ask what changes if another sample is drawn.')),
      section('確率を数える',events,
        title('余事象','Complement','112',tex`P(A^{c})=1-P(A)`,'Ask how to count everything outside the selected event.'),
        explain('並べると、足し方が見える','Probability axioms','109–111',big('起こり得る結果を全部そろえる。'),[
          paragraph('確率は0以上。全事象の確率は1。'),answer('同時に起こらない事象は、そのまま足せる。')
        ],'Use odd and even die faces. Then return to the overlap in A and B.')),
      section('条件付き確率と独立',
        title('条件付き確率','Conditional probability','113–115',tex`P(A\mid B)=\frac{P(A\cap B)}{P(B)},\quad P(B)>0`,'Point to the denominator: within the condition B.'),
        conditional,coin,
        title('独立','Independence','114–115',tex`P(A\cap B)=P(A)P(B)`,'Ask how each toss is generated, then contrast independent events with mutually exclusive outcomes of a single die.'),
        al(1,'対象と、調べた標本を書こう。','Hand off the population, sample and bias worksheet.'))),
    2:deck('確率変数と期待値',[],
      section('くじの100円',
        explain('このくじ、買う？','Lottery and expected profit','117',big('代金100円。最大500円。'),[paragraph('10枚中、当たりは500円が1枚、100円が2枚。7枚は0円。')],'Take a vote before showing the distribution. Ask what information would change the decision.'),
        amount,title('期待値','Expected value','117・129',tex`E[X]=\sum_x xP(X=x)`,'Multiply every result by its probability.'),
        payout,lottery),
      section('サイコロとルーレット',dieMean,
        explain('当たりやすさと、平均収益','European roulette','117–118',
          big('0を含む37区画。100円を赤に賭ける。'),[
            paragraph('当たり18区画で純利益＋100円。ハズレ19区画で−100円。'),
            math(tex`E[X]=100\frac{18}{37}-100\frac{19}{37}=-\frac{100}{37}\approx-2.70\text{円}`)
          ],'Ask whether an almost one-half winning probability guarantees a fair bet. Use the net profit convention.')),
      section('離散と連続',shape,
        explain('確率分布という地図','Probability distribution','118・121',big('横軸に、起こりうる値。'),[
          paragraph('離散量：縦の棒に確率。'),answer('連続量：曲線の下の面積に確率。')
        ],'Point to the quantity on the x-axis and to the area or bar that answers the question.'),
        lotteryExercise,lotteryAnswer,
        al(2,'まず、結果と確率を1行ずつ。','Use the assigned worksheet independently.'))),
    3:deck('二項分布とポアソン分布',[],
      section('シュートの回数を読む',
        photo(3,'curry-full-court-still.jpg','5本連続。本当に？','Sports Illustrated · 動画','https://www.youtube.com/watch?v=xt5vzE0QCvk','Use the clip as a hook. Its visual claim is not data for the exercise. Switch to a hypothetical free-throw model.'),
        explain('1本なら？ 5本なら？','Bernoulli and binomial trials','118',big('成功か失敗。成功確率は毎回 π。'),[
          paragraph('1本の結果 → ベルヌーイ。'),paragraph('独立な5本の成功数 → 二項分布。')
        ],'Ask what has to be held fixed across the shots.'),
        combinations,teamExercise,teamAnswer,formulas.binomial,counts(false),formulas.moments,batting,
        sensor,sensorAnswer),
      section('到着を、時間で区切る',
        explain('コストコの10分間','Counts in a fixed time window','120',big('何人来るかは、数えてみるまで分からない。'),[
          paragraph('X：10分間に到着する人数。λ：その10分間の平均人数。'),answer('平均5人でも、毎回5人とは限らない。')
        ],'Contrast a fixed observation window with a fixed number of trials. Stress stable conditions for a Poisson count model.'),
        formulas.poisson,counts(true),
        explain('分布表で、λとxを合わせる','Poisson table lookup','204',big('λ = 2。ちょうど0人の確率は？')+poissonTable,[
          answer('λ = 2の列 × x = 0の行 → 0.1353'),paragraph('1人以上なら 1 − 0.1353 = 0.8647。')
        ],'Open the table. Ask a student to point at the row and column before revealing.'),
        ...poissonProblem('窓口の問い合わせ',150,.02),category,al(3,'X・n・π または λ を、先に書く。','Point students to the worksheet and the separate practice quiz.'))),
    4:deck('離散確率分布の復習',[],
      section('AIコンパニオンのニュース',
        photo(4,'ai-companions.png','AIの友だち、もう普通？','記事と調査の紹介','https://www.commonsensemedia.org/research/talk-trust-and-trade-offs-how-and-why-teens-use-ai-companions','The report gives 72% of teens ever using AI companions. The classroom model rounds to 75% for calculation. Ask what “ever used” measures.'),
        ...probabilityProblem('6人の選択授業',6,.75,5,true),counts(false,false,true),
        formulas.moments,binaryMoments),
      section('クマが現れる日は？',
        photo(4,'poisson-bears.png','クマが現れる日は？','Associated Press','https://apnews.com/article/japan-bear-attack-army-12a2a3233790deeefd9ec379d0121f33','The article illustrates why the count matters. The probabilities that follow are classroom assumptions. Count days with a sighting, one maximum per day.'),
        ...poissonProblem('100日間で1日以上',100,.02),counts(true,true),category,
        explain('λは、平均になる','Poisson mean and variance','120',math(tex`E[X]=\operatorname{Var}(X)=\lambda=n\pi`),[
          answer('100日 × 0.02 = 2日（期待値）'),paragraph('分散は2日²。確率は、分布表から読む。')
        ],'Separate the expected count, variance, and probability.')),
      section('ガチャ・不良品・AL',
        ...poissonProblem('80回のガチャ',80,.01),
        ...poissonProblem('2,500個のセンサー',2500,.002),
        al(4,'AL 01 打率　／　AL 02 ガチャ　／　AL 03 不良品','Students now work independently. Point to the worksheet tabs and corresponding explorations.'))),
    5:deck('確率密度と標準化',[],
      section('写真判定と1秒',
        photo(5,'paris100-video.jpg','誰が先に着いた？','日本テレビ · パリ2024','https://www.youtube.com/watch?v=GHw-eTs4Yes','Pause the race just before the finish. Ask the room who won.'),
        photo(5,'paris100-omega-scan.jpg','0.005秒差','OMEGA · 写真判定','https://www.hodinkee.com/articles/olympics-2024-mens-100m-photo-finish','The scan shows the torso at the finish line. Lyles 9.784 and Thompson 9.789. Then invite someone to use the stopwatch.'),
        stopwatch),
      section('密度と面積',
        {title:'何分待つ？',theme:'space',notes:'Ask how students might measure waiting time. The next slide uses a classroom model independent of the store.',html:`<img class="full-photo ramen-photo" src="${art(5,'oudouya-kashiwa-night-supplied.png')}" alt="柏の王道家の行列"><div class="photo-caption"><h1>何分待つ？</h1></div>`},
        ramen,
        title('確率密度と区間','Density and area','121–122',tex`P(a\le X\le b)=F(b)-F(a)=\int_a^b f(x)\,dx`,'F is the cumulative area up to x. Point to the left accumulation for each endpoint, then subtract. Whole area is one.'),
        cdfSlide,deliveryExercise,deliveryAnswer,spread),
      section('標準化と分布表',formulas.z,heightZ,zArea,tails,
        ...normalProblem('ロボットの身長',160,5,167.5),
        ...normalProblem('50点未満の割合',60,10,50,'left'),
        ...normalProblem('70点以上は何％？',50,10,70),
        ...normalProblem('負のZの右側',160,5,155),
        ...normalProblem('上の基準より下',160,5,166,'left')),
      section('期末試験形式とAL',centralExercise,centralAnswer,finalNormalQuestion,finalNormalAnswer,
        al(5,'元の単位 → Z → 表 → 面積。','Hand over the worksheet after the practice.'))),
    6:deck('標本平均・t・χ²',[],
      section('ガルトンボード',
        photo(6,'galton-opening.jpg','球は、どこに集まる？','Galton board · 動画','https://www.youtube.com/watch?v=zeJD6dqJ5lo','Use the physical demonstration before the interactive board.'),galton,
        diceMeans,
        explain('中心極限定理','Central limit theorem','122–123',big('標本ごとに、平均を1つ。'),[
          paragraph('独立・同分布で有限の分散をもつ標本を考える。'),
          answer('標本が大きくなると、標準化した標本平均の分布が正規分布に近づく。')
        ],'The die itself does not become normal. Use the histogram of means, on the same axis. Its unstandardized spread shrinks with n.')),
      section('一つの値と平均のZ',formulas.z,formulas.zbar,
        explain('同じ10点差。分母が変わる。','Standard error','123',note('母平均50点、母標準偏差10点。観測値または観測した平均は60点。'),[
          math(tex`n=1:\ Z=10/10=1`),math(tex`n=4:\ Z=10/(10/\sqrt4)=2`),math(tex`n=25:\ Z=10/(10/\sqrt{25})=5`)
        ],'Same difference. Compare the scale of an individual with the standard error for averages.'),meanExercise,meanAnswer),
      section('Gosset・Curry・t',
        photo(6,'gosset.jpg','William Sealy Gosset','“Student” · 1908 · 肖像：Public domain','https://academic.oup.com/biomet/article-abstract/6/1/1/225634','At Guinness, Gosset asked how to reason from a small sample when variance must be estimated.'),
        formulas.variance,formulas.t,curryT,tShape,
        exercise('中央90%を残す境界','126–127・203',big('5試合。自由度4。')+paragraph('左右それぞれの面積を出し、t表で境界を読む。')+tTable,
          tex`\alpha_{\mathrm{right}}=(1-0.90)/2`,'Have students show the row and column first.'),
        slide('右側0.05 × 行4','Worked t-table lookup','203',plot+
          step(1,answer('右側5% → 0.05。自由度4 → 2.1318。'))+step(2,answer('中央90%：−2.1318 〜 2.1318')),
          'Explain why the lower cutoff is the negative of the upper cutoff.',
          body=>{curve(body,{pdf:x=>M.tPdf(x,4),shade:x=>Math.abs(x)<=2.1318,marks:[[-2.1318,'−2.1318'],[2.1318,'2.1318']],label:'t分布の中央90%'});})),
      section('カイ二乗分布',chiShape,
        title('標準化したずれの二乗和','Chi-square statistic','127–128',
          tex`U=\sum_{i=1}^{n}\left(\frac{X_i-\mu_x}{\sigma_x}\right)^2`,'Here μ and σ are the population parameters. Independent standard normal terms squared and summed give χ² with n degrees of freedom.')),
      section('AL',al(6,'何の分布か。自由度は何か。','Move to the independent worksheet.'))),
    7:deck('クラスのデータを標準化する',[],
      section('1秒チャレンジと標本',classFlow,classSample,
        explain('平均とばらつきは、別の問い','Center and variability','122・126',big('1秒に近いクラス？ 毎回そろうクラス？'),[
          paragraph('平均 → 記録の中心。'),answer('分散 → 平均の周りで、記録がどれほど散らばるか。')
        ],'Return to the actual class or use the anonymous demonstration sample.')),
      section('縦に並べて不偏分散',formulas.mean,formulas.variance,
        varianceTable('ロボット5体で列を作る',[156,158,160,162,164],'cm','Reveal the mean, signed deviations, squares, and both variances. Ask which answers the descriptive question and which estimates the population variance.'),
        commuteExercise,varianceTable('別の5体：答え',[152,156,160,164,168],'cm','Compare with the earlier sample: both means are 160, but squared deviations increase by a factor of four.'),
        explain('S²しかないとき','Convert raw to unbiased sample variance','134 脚注2',note('ロボット5体。標本分散 S² = 8 cm²。'),[
          math(tex`\sum(X_i-\bar X)^2=5\times8=40`),answer('不偏分散：40 ÷ 4 = 10 cm²')
        ],'Multiply by n to recover the sum of squared deviations before dividing by n−1.')),
      section('3つの標準化',formulas.z,formulas.zbar,formulas.t,standardize,tails,
        ...normalProblem('167.5cm以上のロボット',160,5,167.5)),
      section('AL',al(7,'平均・偏差二乗・表の読み取り。','Students work independently through all three sheets.'))),
    8:deck('点推定と標本の偏り',[],
      section('世界から日本へ',
        photo(8,'nyt-phone-photo.png','米国の学力は、どう変わった？','Zack Wittman / The New York Times','https://www.nytimes.com/2026/05/13/upshot/test-scores-school-districts-us.html','Start with the article and ask who was observed.'),newsCharts,japan,
        photo(8,'phone-ban-ap.webp','学校で、スマホを預ける。','Dylan Lovan / AP · 動画','https://apnews.com/article/schools-cellphone-bans-social-media-parents-d6464fbfdfae83189c752fe0c40fd060','Use the school video as the story’s close. The trends do not isolate a cause.')),
      section('海全体と、手元の5匹',
        {title:'海全体の平均を知りたい',theme:'space',notes:'Let the image sit first. Ask what can be measured in the time available.',html:`<img class="full-photo" src="${art(8,'maguro-population.svg')}" alt="海に散らばる大きさと向きが異なる多数のマグロ"><div class="photo-caption"><h1>全部は、測れない。</h1></div>`},
        pointFish,formulas.mean,
        explain('母平均の点推定','Point estimate','131–132',big('40、45、50、55、60 kg'),[
          math(tex`\widehat{\mu}_x=\bar X=250/5=50\,\mathrm{kg}`),
          answer('5匹から推定した、群れ全体の平均。どれだけ外れ得るかは、次週。')
        ],'Emphasize that 50 kg is the estimate from this sample, and that the margin has not been determined.'),compareSamples),
      section('不偏性・有効性・一致性',
        title('不偏性','Unbiasedness','131–132',tex`E[\widehat{\theta}]=\theta`,'Read theta (シータ). The expected value is over repeated draws, while theta is fixed.'),
        explain('θを、魚の問題に置き換える','Unbiasedness of the sample mean','131–132',math(tex`E[\widehat{\theta}]=\theta`),[
          paragraph('右の θ（シータ） → 群れ全体の平均 μ。'),paragraph('左の θ̂ → 各標本から求めた平均 X̄。'),math(tex`E[\bar X]=\mu`)
        ],'Point at the right parameter and then the hatted estimator. Explain that both sides refer to population mean after substitution.'),
        estimators,bias),
      section('分散の点推定',
        formulas.variance,varianceTable('マグロ5匹の偏差と二乗',[40,45,50,55,60],'kg','Use the same fish as before. Compare dividing by 5 and dividing by 4. The unbiased variance estimate is 62.5 kg².'),
        exercise('通学時間の点推定','132',big('23、31、34、39、43 分。')+
          paragraph('無作為標本とする。① 母平均の点推定。② 母分散の不偏推定。表に偏差と二乗を書く。'),varianceFormula,
          'Allow five minutes. Keep each squared deviation in the corresponding row.'),
        varianceTable('通学時間：答え',[23,31,34,39,43],'分','Reveal the mean, the signed deviations and the squares. Compare the two denominators.')),
      section('20分クイズとAL',
        slide('期末試験形式クイズ','Three questions · 20 minutes','',
          big('正規分布　／　点推定　／　t分布表')+link('../week08/quiz.html?p','問題を開く'),
          'Give twenty minutes for individual work. Open the separate worked-answer page when ready.'),
        al(8,'標本の大きさを変えて、結果を比べる。','Give students time to complete the assigned work independently.')))
  };
};
