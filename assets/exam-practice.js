/* One shared teaching pattern; numerical answers always use the live controls. */
(() => {
  const choose = (n,k) => {
    if (k<0 || k>n) return 0;
    let result=1;
    for(let i=1;i<=Math.min(k,n-k);i++) result*= (n-i+1)/i;
    return Math.round(result);
  };
  const binomial = (n,p,k) => choose(n,k)*p**k*(1-p)**(n-k);
  const poisson = (lambda,k) => {let p=Math.exp(-lambda);for(let i=1;i<=k;i++)p*=lambda/i;return p;};
  const fmt = x => Number(x.toFixed(4)).toString();
  const percent = x => `${(100*x).toFixed(2)}%`;
  const erf = x => {const sign=x<0?-1:1; x=Math.abs(x);const z=1/(1+.3275911*x);return sign*(1-(((((1.061405429*z-1.453152027)*z+1.421413741)*z-.284496736)*z+.254829592)*z)*Math.exp(-x*x));};
  function build(type,s={},lang='ja') {
    const t=(en,ja)=>lang==='en'?en:ja;
    let question,given,rule,worked,answer,meaning;
    if(type==='coin') {
      const n=s.total||10, h=s.heads||0;
      question=t(`A fair robot/goat coin is tossed ${n} times. How many robot faces do we expect? What share did we observe?`, `公平なロボット／ヤギのコインを${n}回投げる。ロボットは平均何回？実際の割合は？`);
      given=String.raw`n=${n},\quad p=0.5`;
      rule=String.raw`E(H)=np,\qquad\widehat p=\frac{H}{n}`;
      worked=String.raw`E(H)=${n}\times0.5=${n/2}`;
      answer=s.total?String.raw`\widehat p=\frac{${h}}{${n}}\approx${fmt(100*h/n)}\%`:String.raw`E(H)=5\quad(n=10)`;
      meaning=t('The expected count is an average, not a promise. Toss to fill in H and compare H/n with 50%. Each next toss still has probability 1/2.', '期待回数は平均であって保証ではありません。投げてHを数え、H/nを50％と比べよう。次の1回の表の確率は常に1/2です。');
    } else if(type==='monty') {
      const switching=s.strategy==='switch';
      question=t(`Three doors hide one robot and two goats. What is the win probability if you ${switching?'switch':'stay'} after the host reveals a goat?`, `3つのドアにロボット1体とヤギ2匹。司会者がヤギを見せたあと、${switching?'変更':'そのまま'}の勝率は？`);
      given=String.raw`\text{robot}=1,\quad\text{doors}=3`;
      rule=String.raw`\Pr(\mathrm{stay\ wins})=\frac13,\quad\Pr(\mathrm{switch\ wins})=1-\frac13`;
      worked=switching?String.raw`1-\frac13=\frac23`:String.raw`\frac{1}{3}`;
      answer=String.raw`\Pr(\mathrm{win})=\frac{${switching?2:1}}3\approx${switching?'66.67':'33.33'}\%`;
      meaning=t('The host knows the prize location, always opens an unchosen goat door, and always offers a switch. Switching wins exactly when the first choice was a goat. Compare formula probability with wins ÷ games—not with the share choosing a strategy.', '司会者は当たりを知り、選ばれていないヤギのドアを必ず開け、必ず変更を提案します。最初にヤギを選んだ場合に変更で勝てます。公式と比べるのは「勝ち数÷試合数」です。');
    } else if(type==='lineup'||type==='pairs') {
      const n=type==='pairs'?22:s.n,k=type==='pairs'?2:s.k;
      question=t(`How many ways can we choose ${k} ${type==='pairs'?'students from '+n:'robot positions in a line of '+n+' robots/goats'}?`, type==='pairs'?`${n}人から${k}人の組を作ると何通り？`:`${n}個の位置のうち${k}個をロボット、残りをヤギにすると何通り？`);
      given=String.raw`n=${n},\quad k=${k}`;rule=String.raw`{}_nC_k=\frac{n!}{k!(n-k)!}`;
      worked=String.raw`{}_{${n}}C_{${k}}=\frac{${n}!}{${k}!(${n}-${k})!}`;answer=`{}_{${n}}C_{${k}}=${choose(n,k)}`;
      meaning=t('Choose positions, not identities: swapping two identical robots makes no new arrangement. For pairs, A–B and B–A are the same pair. Find arrangements, then check your count against the formula.', '選ぶのは位置です。同じロボット同士を交換しても別の並びにはなりません。2人の組ではA–BとB–Aは同じ。並びや組を見つけ、公式の答えと比べよう。');
    } else if(['batting','nba','binomial','bernoulli','discrete'].includes(type)) {
      const n=type==='bernoulli'?1:type==='discrete'?5:s.n,p=type==='discrete'?.5:s.p,k=type==='discrete'?s.k:Math.min(n,s.k);
      const tail=s.tail&&type==='nba';
      const probability=tail?1-Array.from({length:k},(_,i)=>binomial(n,p,i)).reduce((a,b)=>a+b,0):binomial(n,p,k);
      const story=type==='batting'||type==='binomial'?t('robot hits','ロボットの安打'):type==='nba'?t('robot free-throw makes','ロボットのフリースロー成功'):t('robot faces (not goats)','ロボットの表（ヤギは裏）');
      question=t(`In ${n} independent attempts, each with success chance ${percent(p)}, what is the chance of ${tail?'at least':'exactly'} ${k} ${story}?`, `${n}回の独立な試行、1回の成功率${percent(p)}。${story}が${tail?`${k}回以上`:`ちょうど${k}回`}になる確率は？`);
      given=String.raw`n=${n},\quad p=${fmt(p)},\quad k=${k}`;
      rule=type==='bernoulli'?String.raw`\Pr(X=1)=p,\quad\Pr(X=0)=1-p`:String.raw`\Pr(X=k)={}_nC_k p^k(1-p)^{n-k}`;
      if(type==='batting'||type==='nba') {
        given=String.raw`n=${n},\quad\pi=${fmt(p)},\quad x=${k}`;
        rule=String.raw`\Pr(X=x)={}_nC_x\pi^x(1-\pi)^{n-x}`;
      }
      worked=tail?String.raw`\Pr(X\ge${k})=1-\sum_{j=0}^{${k-1}}{}_{${n}}C_j(${fmt(p)})^j(${fmt(1-p)})^{${n}-j}`:String.raw`\Pr(X=${k})=${choose(n,k)}\times(${fmt(p)})^{${k}}\times(${fmt(1-p)})^{${n-k}}`;
      if(tail&&k===0) worked=String.raw`\Pr(X\ge0)=1`;
      answer=String.raw`\Pr(X${tail?String.raw`\ge`:'='}${k})\approx${fmt(probability)}\approx${fmt(100*probability)}\%`;
      meaning=t('The combination factor counts valid orders. The powers give the chance of one order; multiply to include all orders. One simulated round is a whole set of attempts. Compare the share of matching rounds with this probability—not the success rate of a single attempt.', '組合せは条件に合う順番の数。べき乗の部分は1通りの順番の確率。それらを掛けます。シミュレーションの1回は試行の1セット。この条件を満たしたセットの割合を答えと比べます。1回の成功率とは別です。');
    } else if(type==='poisson'||type==='costco') {
      const lambda=s.lambda,k=s.k,tail=!!s.tail;
      const probability=tail?1-Array.from({length:k},(_,i)=>poisson(lambda,i)).reduce((a,b)=>a+b,0):poisson(lambda,k);
      question=type==='poisson'?t(`Goats pass a gate independently, averaging ${fmt(lambda)} per minute. What is the chance of exactly ${k} goats in one minute?`, `ヤギが一定の平均到着率で独立にゲートを通る。1分間に平均${fmt(lambda)}匹。ちょうど${k}匹になる確率は？`):t(`Robot shoppers arrive independently at a constant average rate. In one ${s.minutes||10}-minute window, what is the chance of ${tail?'at least':'exactly'} ${k} arrivals?`, `ロボット客が一定の平均到着率で独立に到着。${s.minutes||10}分間に${tail?`${k}人以上`:`ちょうど${k}人`}来る確率は？`);
      given=s.rate?String.raw`\lambda=${s.rate}\times\frac{${s.minutes}}{10}=${fmt(lambda)},\quad k=${k}`:String.raw`\lambda=${fmt(lambda)},\quad k=${k}`;
      rule=String.raw`\Pr(X=k)=\frac{e^{-\lambda}\lambda^k}{k!}`;
      worked=tail?(k===0?String.raw`\Pr(X\ge0)=1`:String.raw`\Pr(X\ge${k})=1-\sum_{j=0}^{${k-1}}\frac{e^{-${fmt(lambda)}}${fmt(lambda)}^j}{j!}`):String.raw`\Pr(X=${k})=\frac{e^{-${fmt(lambda)}}${fmt(lambda)}^{${k}}}{${k}!}`;
      answer=String.raw`\Pr(X${tail?String.raw`\ge`:'='}${k})\approx${fmt(probability)}\approx${fmt(100*probability)}\%`;
      meaning=t('λ is the average number in the chosen window, not a probability or a maximum. Each simulated round counts NEW arrivals in one window. Count matching windows ÷ total windows and compare with the answer.', 'λは指定時間内の平均人数。確率でも上限でもありません。1回のシミュレーションで、その時間内に新しく到着した人数を数えます。条件を満たした時間枠の数÷全時間枠を答えと比べよう。');
    } else if(type==='roulette') {
      const b=s.stake;
      question=t(`Bet ¥${b} on red or black on an American wheel. What is the expected NET profit per spin?`, `0と00のあるルーレットで赤か黒に${b}円賭ける。1回の純損益の期待値は？`);
      given=String.raw`\Pr(\mathrm{win})=\frac{18}{38},\quad\Pr(\mathrm{lose})=\frac{20}{38}`;
      rule=String.raw`E(X)=\sum_x x\Pr(X=x)`;
      worked=String.raw`E(X)=(+${b})\frac{18}{38}+(-${b})\frac{20}{38}=-\frac{${2*b}}{38}`;
      answer=String.raw`E(X)\approx-${fmt(2*b/38)}\quad\text{yen per spin}`;
      meaning=t('A win earns one stake in net profit; a loss loses one stake. Over m spins the expected total is m × E(X). Actual profit varies and can be positive; a loss is not guaranteed after any finite number of spins.', '当たりの純利益は賭け金1回分、外れは1回分の損失。m回なら期待合計はm×E(X)。実際の損益は変動し、有限回では利益で終わることもあります。');
    } else if(['lottery','dice','delivery','al-discrete'].includes(type)) {
      const values=type==='lottery'?[0,100,1000]:type==='dice'?[1,2,3,4,5,6]:type==='delivery'?[2,18]:[-1,0,1,2,3,4];
      const weights=type==='lottery'?[.7,.25,.05]:type==='dice'?Array(6).fill(1/6):type==='delivery'?[.5,.5]:[3,1,2,1,1,4].map(x=>x/12);
      const probs=type==='dice'?Array(6).fill(String.raw`\frac16`):type==='al-discrete'?[String.raw`\frac14`,String.raw`\frac1{12}`,String.raw`\frac16`,String.raw`\frac1{12}`,String.raw`\frac1{12}`,String.raw`\frac13`]:weights.map(String);
      const mean=values.reduce((sum,x,i)=>sum+x*weights[i],0);
      question=type==='lottery'?t('A ¥100 robot lottery pays ¥0, ¥100, or ¥1,000 with chances 70%, 25%, and 5%. Find the expected prize and net profit.', '100円のロボットくじ。賞金0円・100円・1,000円の確率は70％・25％・5％。賞金と純損益の期待値は？'):type==='dice'?t('A robot rolls a fair six-sided die. What is the expected number?', 'ロボットが公平な6面サイコロを振る。出目の期待値は？'):type==='delivery'?t('Robot B delivers in 2 or 18 minutes with equal probability. Find the mean and variance. Compare with A, which always takes 10 minutes.', '配達ロボットBは2分か18分、確率は半々。平均と分散を求め、必ず10分のAと比べよう。'):t('The AL bag has 12 cards: three −1s, one 0, two 1s, one 2, one 3, four 4s. Find the expected card value.', 'ALの袋に12枚：−1が3枚、0が1枚、1が2枚、2が1枚、3が1枚、4が4枚。引く数の期待値は？');
      given=String.raw`x\in\{${values.join(',')}\},\quad\sum_x\Pr(X=x)=1`;
      rule=String.raw`E(X)=\sum_x x\Pr(X=x)`;
      worked=String.raw`E(X)=${values.map((x,i)=>String.raw`${x<0?'('+x+')':x}\times${probs[i]}`).join('+')}\approx${fmt(mean)}`;
      answer=type==='lottery'?String.raw`E(\mathrm{profit})=75-100=-25\ \text{yen}`:type==='delivery'?String.raw`\mathrm{Var}(X)=\tfrac12(2-10)^2+\tfrac12(18-10)^2=64`:type==='al-discrete'?String.raw`E(X)=\frac53\approx1.6667`:`E(X)=${fmt(mean)}`;
      meaning=type==='delivery'?t('Same mean, different reliability: A has variance 0; B has variance 64 min². Watch the measured average, but remember an average does not reveal spread.', '平均は同じでも安定性は違う。Aの分散は0、Bは64分²。平均だけではばらつきは分かりません。'):t('Multiply each value by its probability, then add. The formula is exact for the model; the observed average is a random check. Put the ticket back between AL draws. An expectation need not be a possible single result.', '各値×その確率を足します。公式はモデルの正確な答え、実測平均はランダムな確認。ALでは引いたカードを毎回戻します。期待値は1回で出る値とは限りません。');
    } else if(type==='continuous'||type==='al-continuous') {
      if(type==='continuous') {
        const band=s.band,lo=170-band*6,hi=170+band*6,probability=band===0?0:erf(band/Math.sqrt(2));
        question=t(`Robot height X is normal with mean 170 cm and SD 6 cm. Find Pr(${fmt(lo)} ≤ X ≤ ${fmt(hi)}).`, `ロボットの身長は平均170cm・標準偏差6cmの正規分布。${fmt(lo)}〜${fmt(hi)}cmになる確率は？`);
        given=String.raw`\mu=170,\quad\sigma=6`;rule=String.raw`Z=\frac{X-\mu}{\sigma}`;
        worked=String.raw`\frac{${fmt(lo)}-170}{6}=-${band},\quad\frac{${fmt(hi)}-170}{6}=${band}`;
        answer=String.raw`\Pr(-${band}\le Z\le${band})\approx${fmt(100*probability)}\%`;
        meaning=t('Read an area from the normal table. The slider changes the interval and therefore its area. At zero width the probability is zero; density height is not probability.', '正規分布表で面積を読みます。スライダーで区間が変わると面積も変わります。幅0なら確率0。密度の高さは確率ではありません。');
      } else {
        const slices=s.slices||4, width=Math.sqrt(2)/slices;
        question=t('Robot delivery time has density f(x)=x for 0 ≤ x ≤ √2 hours (zero outside). Find total probability and expected delivery time.', 'ロボットの配達時間の密度はf(x)=x、0≤x≤√2時間（範囲外は0）。確率の合計と平均配達時間を求めよう。');
        given=String.raw`f(x)=x,\quad0\le x\le\sqrt2,\quad\Delta x=\frac{\sqrt2}{${slices}}\approx${fmt(width)}`;
        rule=String.raw`\Pr(a\le X\le b)=\int_a^b f(x)\,dx,\quad E(X)=\int x f(x)\,dx`;
        worked=String.raw`\int_0^{\sqrt2}x\,dx=\left[\frac{x^2}{2}\right]_0^{\sqrt2}=1`;
        answer=String.raw`E(X)=\int_0^{\sqrt2}x^2\,dx=\left[\frac{x^3}{3}\right]_0^{\sqrt2}=\frac{2\sqrt2}{3}\approx0.9428\ \text{hours}`;
        meaning=t('Left: probability is area (width × density). Right: weight each small probability by its delivery time. The extra x makes x·f(x)=x²; integrating x² gives x³/3. Rectangles visualize the sum; the integral gives the exact answer.', '左：確率は面積（幅×密度）。右：小さな確率にその配達時間を掛けます。xをもう1つ掛けてx·f(x)=x²。x²の積分はx³/3。長方形で足し算を体感し、積分で正確な答えを得ます。');
      }
    } else if(type==='disease') {
      const N=s.population,e=s.error/100,p=1/N,pos=p*(1-e)+(1-p)*e,post=p*(1-e)/pos;
      question=t(`Only 1 in ${N.toLocaleString()} robots has a fault. A detector has ${s.error}% false positives and ${s.error}% false negatives. Given a positive result, what is the probability of a real fault?`, `${N.toLocaleString()}体に1体のロボットが故障。偽陽性率・偽陰性率はいずれも${s.error}％。陽性だったとき、本当に故障している確率は？`);
      given=String.raw`A=\text{positive},\quad B=\text{fault},\quad\Pr(B)=\frac1{${N}},\quad e=${fmt(e)}`;
      rule=String.raw`\Pr(B\mid A)=\frac{\Pr(A\cap B)}{\Pr(A)}`;
      worked=String.raw`\Pr(A)=\frac1{${N}}(${fmt(1-e)})+\left(1-\frac1{${N}}\right)(${fmt(e)})`;
      answer=String.raw`\Pr(B\mid A)=\frac{\frac1{${N}}(${fmt(1-e)})}{${pos.toPrecision(7)}}\approx${fmt(100*post)}\%`;
      meaning=t('First count BOTH ways to test positive: a real fault correctly detected, or a healthy robot falsely flagged. Divide real positives by ALL positives. “99% accurate” does not mean “99% chance of a fault after a positive.” This mirrors the disease exercise; it is a teaching model.', '陽性には2通り：本当の故障を検出した場合と、正常なのに誤って陽性となった場合。「真の陽性÷全ての陽性」で求めます。「99％正確」と「陽性なら99％故障」は別です。病気の問題と同じ構造の授業用モデルです。');
    } else if(type==='events') {
      const sets={A:['o','p','r','s'],B:['o','r','u'],C:['t','w'],D:['o','p','q','r','s','t']};
      const expr=s.expression||'A',conditional=expr.includes('|'),union=expr.includes('∪'),intersection=expr.includes('∩');
      const [a,b]=expr.split(conditional?'|':union?'∪':intersection?'∩':' '),base=conditional?sets[b].length:9;
      const hits=conditional||intersection?sets[a].filter(x=>sets[b].includes(x)).length:union?new Set([...sets[a],...sets[b]]).size:sets[a].length;
      const tex=expr.replace('|','\\mid ').replace('∩','\\cap ').replace('∪','\\cup ');
      question=t(`Nine equally likely outcomes o–w. Use Figure 6 to find Pr(${expr}).`, `o〜wの9つの結果は同じ確率。図6を使ってPr(${expr})を求めよう。`);
      given=String.raw`\Omega=\{o,p,q,r,s,t,u,v,w\},\quad |\Omega|=9`;
      rule=conditional?String.raw`\Pr(${a}\mid ${b})=\frac{|${a}\cap ${b}|}{|${b}|}`:String.raw`\Pr(E)=\frac{|E|}{|\Omega|}`;
      worked=String.raw`\Pr(${tex})=\frac{${hits}}{${base}}`;
      answer=String.raw`\Pr(${tex})\approx${fmt(hits/base)}=${fmt(100*hits/base)}\%`;
      meaning=t('Count the highlighted matching squares for the numerator. For a conditional probability, the given event—not all nine squares—is the denominator. Change the event to see exactly which squares count.', '分子は条件に合う色付きマスの数。条件付き確率の分母は9マス全部ではなく、与えられた事象のマスだけ。事象を変えて、数えるマスの変化を見よう。');
    } else return null;
    return {question,given,rule,worked,answer,meaning};
  }
  if(typeof document==='undefined') {module.exports={build,choose,binomial,poisson};return;}
  const roots='[data-coin-simulation],[data-monty-game],[data-event-simulation],[data-test-simulation],[data-combination-simulation],[data-batting-simulation],[data-week2-discrete],[data-week2-families],[data-al-expectation],[data-example-lab],[data-roulette],[data-week3-story]';
  const escape = x=>String(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
  const textNumber=(root,selector)=>Number((root.querySelector(selector)?.textContent||'0').replace(/[^\d.-]/g,''));
  function state(root) {
    const value=(selector,fallback)=>{const v=Number(root.querySelector(selector)?.value);return Number.isFinite(v)&&root.querySelector(selector)?v:fallback;};
    if(root.matches('[data-coin-simulation]'))return ['coin',{total:textNumber(root,'[data-toss-count]'),heads:textNumber(root,'[data-heads-count]')}];
    if(root.matches('[data-monty-game]'))return ['monty',{strategy:root.querySelector('[data-monty-strategy]').value}];
    if(root.matches('[data-event-simulation]'))return ['events',{expression:(root.querySelector('[data-event-formula]')?.textContent.match(/Pr\(([^)]+)\)/)||[])[1]||'A'}];
    if(root.matches('[data-test-simulation]'))return ['disease',{population:value('[data-test-population]',100000),error:value('[data-test-error]',1)}];
    if(root.matches('[data-combination-simulation]'))return ['lineup',{n:value('[data-combination-n]',5),k:value('[data-combination-k]',2)}];
    if(root.matches('[data-batting-simulation]'))return ['batting',{n:value('[data-batting-n]',5),p:value('[data-batting-p]',.32),k:value('[data-batting-x]',3)}];
    if(root.matches('[data-week2-discrete]'))return root.querySelector('#w2-measure-panel')?.hidden?['discrete',{k:value('[data-w2-discrete-k]',2)}]:['continuous',{band:value('[data-w2-continuous-band]',1)}];
    if(root.matches('[data-week2-families]')) {
      const type=root.querySelector('[data-w2-model]:not([hidden])')?.dataset.w2Model||'binomial';
      const n=type==='bernoulli'?1:value('[data-w2-n]',10);
      return [type,{n,p:value('[data-w2-p]',50)/100,lambda:value('[data-w2-lambda]',2),k:Math.min(type==='poisson'?20:n,value('[data-exam-k]',type==='bernoulli'?1:2))}];
    }
    if(root.matches('[data-al-expectation]'))return [root.dataset.alExpectation==='discrete'?'al-discrete':'al-continuous',{slices:value('[data-al-slices]',4)}];
    if(root.matches('[data-example-lab]'))return [root.classList.contains('is-pairs')?'pairs':root.querySelector('[data-example][aria-pressed="true"]')?.dataset.example||'lottery',{}];
    if(root.matches('[data-roulette]'))return ['roulette',{stake:Math.max(1,Math.min(100000,Math.round(value('[data-stake]',100))))}];
    const nba=root.dataset.week3Story==='nba',rate=value('[data-story-rate]',5),minutes=value('[data-story-minutes]',10);
    return [nba?'nba':'costco',{n:value('[data-story-n]',5),p:value('[data-story-p]',93)/100,k:value('[data-story-x]',3),rate,minutes,lambda:rate*minutes/10,tail:root.querySelector('[data-story-mode]')?.value==='tail'}];
  }
  function attach(root) {
    if(root.dataset.examPractice||!root.children.length)return;
    root.dataset.examPractice='true';
    const box=document.createElement('section');box.className='exploration-exam';
    box.setAttribute('aria-label','Worked exam question / 試験問題の解き方');
    box.innerHTML='<header></header><p data-exam-question></p><label data-exam-control hidden><span></span><input type="range" min="0" max="20" step="1" value="2" data-exam-k><output></output></label><div class="exploration-exam-grid"><article data-exam-given></article><article data-exam-worked></article><article data-exam-answer></article></div><p data-exam-meaning></p>';
    root.firstElementChild.after(box);
    let signature='',timer;
    function update() {
      const [type,s]=state(root),lang=document.documentElement.dataset.language||'ja',en=lang==='en';
      if(s.population!==undefined&&(!Number.isInteger(s.population)||s.population<2||s.population>1e8||s.error<0||s.error>50))return;
      if(!Object.values(s).every(x=>typeof x!=='number'||Number.isFinite(x)))return;
      const next=JSON.stringify([type,s,lang]);if(signature===next)return;signature=next;
      const lesson=build(type,s,lang);if(!lesson)return;
      const control=box.querySelector('[data-exam-control]');control.hidden=!root.matches('[data-week2-families]');
      if(!control.hidden) {const input=control.querySelector('input');input.max=type==='poisson'?20:s.n;input.value=s.k;control.querySelector('span').textContent=en?'Exam question: count k':'問題で求める回数 k';control.querySelector('output').textContent=s.k;}
      box.querySelector('header').textContent=en?'EXAM PRACTICE · Question → formula → answer':'試験の練習 · 問題 → 公式 → 答え';
      box.querySelector('[data-exam-question]').textContent=lesson.question;
      const math=tex=>`<div data-display-math="${escape(tex)}" aria-label="${escape(tex)}"></div>`;
      box.querySelector('[data-exam-given]').innerHTML=`<b>① ${en?'Given':'与えられた値'}</b>${math(lesson.given)}`;
      box.querySelector('[data-exam-worked]').innerHTML=`<b>② ${en?'Formula → substitute':'公式 → 代入'}</b>${math(lesson.rule)}${math(lesson.worked)}`;
      box.querySelector('[data-exam-answer]').innerHTML=`<b>③ ${en?'Answer':'答え'}</b>${math(lesson.answer)}`;
      box.querySelector('[data-exam-meaning]').textContent=lesson.meaning;
    }
    const queue=()=>{clearTimeout(timer);timer=setTimeout(update,80);};
    root.addEventListener('input',queue);root.addEventListener('change',queue);root.addEventListener('click',queue);
    new MutationObserver(records=>{if(records.some(r=>!box.contains(r.target)))queue();}).observe(root,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['hidden','aria-selected','aria-pressed','class']});
    new MutationObserver(queue).observe(document.documentElement,{attributes:true,attributeFilter:['data-language']});
    update();
  }
  let queued=false;
  const scan=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;document.querySelectorAll(roots).forEach(attach);});};
  document.addEventListener('statsb:agenda-rendered',scan);
  new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&(n.matches?.(roots)||n.querySelector?.(roots)))))scan();}).observe(document.body,{childList:true,subtree:true});
  scan();
})();
