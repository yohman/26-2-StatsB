import {createWeek5Story,storyStyle} from './story-week05.mjs';
import {createWeek5Notes} from './notes-week05.mjs';
import {glossary,slideTermKeys,terminology,terminologyStyle,annotateJapaneseTerms} from './terms-week05.mjs';

// Preserve the long-form source. This editorial pass combines routine steps,
// while retaining sequences in which the changing image or withheld answer matters.
export function createWeek5CompactStory(options){
  const full=createWeek5Story(options),originalNotes=createWeek5Notes(full.mapping).slides;
  const slides=[],mapping=[],narration=[];
  const math=tex=>`$$\n${tex}\n$$`;
  const figure=n=>full.slides[n-1].match(/!\[[^\]]*\]\([^\n]+?\)/)?.[0]||'';
  const formula=n=>full.slides[n-1].match(/\$\$\n([\s\S]+?)\n\$\$/)?.[1]||'';
  const sourceBody=n=>full.slides[n-1].replace(/^<!-- _class: [^>]+ -->\n\n## [^\n]+\n\n/,'').replace(/\n\n<!--[\s\S]*$/,'');
  function add(title,body,layout,ids,ja,en){
    const source=full.mapping[ids[0]-1];
    mapping.push({...source,slide:slides.length+1,title,layout,sourceBeats:ids});
    slides.push(`<!-- _class: ${layout} -->\n\n## ${title}\n\n${body}`);
    const first=originalNotes[ids[0]-1];
    narration.push({page:slides.length,title,ja:ja||first.ja,en:en||first.en});
  }
  const keep=(n,ja,en)=>{const s=full.mapping[n-1];add(s.title,sourceBody(n),s.layout,[n],ja,en);};
  const paired=(title,tex,graphic,after,ids,ja,en)=>add(title,`<div class="worked-copy">\n\n${tex.map(math).join('\n\n')}\n\n</div>\n\n<div class="worked-visual">\n\n${graphic}\n\n</div>\n\n${after||''}`,'worked',ids,ja,en);

  const video='https://www.youtube.com/watch?v=GHw-eTs4Yes';
  const finish='https://worldathletics.org/competitions/olympic-games/the-xxxiii-olympic-games-7153115/news/article/paris-2024-olympics-report-men-100m';
  const omega='https://www.hodinkee.com/articles/olympics-2024-mens-100m-photo-finish';
  function opening(title,body,layout,ja,en,sources){
    add(title,body,layout,[1],ja,en);
    const item=mapping.at(-1);
    for(const key of Object.keys(item))if(!['slide','title','layout','sourceBeats'].includes(key))delete item[key];
    item.sourceBeats=[];item.sources=sources;
    narration.at(-1).sources=sources;
  }
  opening('パリ2024 · 男子100m決勝',`<a class="media-link" href="${video}"><img src="images/paris100-video.jpg" alt="パリ2024 男子100m決勝の動画サムネイル"><span class="media-action">▶ 動画を見る / Watch the race</span></a>`,'race-media race-video',
    `今日は、まずこのレースを見よう。最後の瞬間、誰が勝ったと思う？ 動画を止めて予想してもらい、次の写真へ進みます。出典：日本テレビのパリ2024男子100m決勝動画。${video}`,
    `Watch the race first. Who do you think won? Pause at the finish and ask for predictions before showing the photograph. Source: Nippon TV's Paris 2024 men's 100m final video. ${video}`,[video]);
  opening('この写真だけで、分かる？',`<a class="media-link" href="${finish}"><img src="images/paris100-finish.jpg" alt="ライルズとトンプソンがフィニッシュラインに到達する写真"></a><span class="media-credit">Photo © Dan Vernon / World Athletics</span>`,'race-media race-finish',
    `この瞬間の写真だけなら、誰が先に到着したように見える？ 判定するのは頭や足ではなく、胴体がフィニッシュラインに達した順番です。次に、判定用の画像を見よう。写真：Dan Vernon / World Athletics。${finish}`,
    `Who looks first in this ordinary photograph? The finish is judged by the torso reaching the line, rather than the head or foot. Next, show the image used for the decision. Photo: Dan Vernon / World Athletics. ${finish}`,[finish]);
  opening('0.005秒を、見る。',`<a class="media-link" href="${omega}"><img src="images/paris100-omega-scan.jpg" alt="OMEGAの公式フィニッシュスキャン。胴体の到着位置を示す赤い判定線"><span class="media-action">OMEGAの写真判定について ↗</span></a><span class="media-credit">Photo courtesy OMEGA · judging-area crop</span>`,'race-media race-scan',
    `これは普通の一瞬の写真ではありません。フィニッシュラインを細く連続して撮り、時間の順につなげた画像です。赤い線で胴体を判定します。公式表示は2人とも9.79秒ですが、細かく読むとライルズ9.784秒、トンプソン9.789秒。差は0.005秒です。陸上の公式タイムには独自の記録規則があり、普通の四捨五入の例には使いません。投影用に判定領域を大きく表示しています。クリックで全画像と解説を開けます。画像提供：OMEGA。${omega}`,
    `This scan joins successive narrow views of the finish line across time. The red lines mark the athletes' torsos. Both official times read 9.79 seconds, while the finer readings are 9.784 for Lyles and 9.789 for Thompson, a gap of 0.005 seconds. Athletics has its own time-recording rules, so do not use those official times as an ordinary rounding example. The slide enlarges the judging area. Click to see the complete image and explanation. Photo courtesy OMEGA. ${omega}`,[omega]);
  opening('今度は、自分で1秒。',`<img class="watch-photo" src="images/omega-stopwatch.png" alt="OMEGAの文字を入れた授業用ストップウォッチ。小数6桁のデジタル表示">\n\n<div class="watch-invitation"><h3>ぴったり1秒で、<br>止められる？</h3><p>1.000000 秒</p><a href="https://yohman.github.io/26-2-StatsB/agenda.html?p&amp;activity=w5-stopwatch#week-05">やってみよう！</a><small>授業用の再現 / Classroom recreation<br>OMEGA公式の計測器ではありません。</small></div>`,'watch-bridge',
    'では、今度は自分で測ろう。スタートとストップは同じボタン。1.000000秒ぴったりを狙って、何回か止めてみてください。表示が細かくなるほど、ぴったり一致は難しく見えるよね。そこで「0.9秒から1.1秒までなら？」と条件を変えます。この範囲なら、どれだけ入ったかな。表示の小数6桁は、マイクロ秒の測定精度を保証しません。これはブラウザの時計を使う授業用の再現で、OMEGA公式製品ではありません。',
    'Now try timing one second yourself. Use the same button to start and stop. Aim for 1.000000 seconds several times. More displayed digits make an exact match look harder. Then ask how many results fall between 0.9 and 1.1 seconds. An interval gives us a useful condition to count. Six displayed decimal places do not guarantee microsecond accuracy. This classroom recreation uses the browser clock and is not an official OMEGA product.',[]);
  add('身長、何cmまで測る？',`${figure(12)}\n\n${math(String.raw`160\quad 160.0\quad 160.000\ldots`)}\n\nどこまで正確に測りますか？`,'precision',[12,13,14,15],
    'ロボットの身長は160cm。でも、小数第1位、第2位と測ると、もっと細かい値が見えてくる。「ぴったり160」と「丸めて160」は同じ条件かな？',
    'The robot is 160 centimetres tall. With more decimal places, we can measure more precisely. Is exactly 160 the same condition as a rounded measurement of 160?');
  keep(16);
  add('「160cmと記録」は、区間の話',`${math(String.raw`\Pr(159.5\le X<160.5)>0`)}\n\n1点の幅は0。丸めた記録には、幅がある。`,'explain',[17,18,19,20],
    '160cmの人が存在しないという意味ではありません。一点は幅0なので確率も0。四捨五入して160cmになる区間には幅があり、この付近に密度があれば正の確率があります。',
    'A zero point probability does not mean nobody can have that height. An exact point has zero width. A rounded measurement covers an interval, with positive probability where the density is positive.');
  keep(22);
  keep(23,'この山は確率密度です。同じ幅で比べれば、高いところほど結果を含みやすい。ただし、縦の高さそのものを確率とは読みません。','This is probability density. For equal-width intervals, higher density means more probability. The curve’s height alone is not a probability.');
  keep(25);
  keep(26);
  const rectangleFigure=(count,highlight=null)=>options.fig(`rectangle-midpoint-${count}${highlight===null?'':`-${highlight}`}`,{max:20,pdf:x=>3*x*x/8000,lo:0,hi:0,rectangles:count,rectangleLabels:count===4,rectangleHighlight:highlight,yMax:.19,title:`${count}個の長方形 · 中点の高さ`,xlabel:'x'});
  add('まず、4個の長方形。',`${math(String.raw`f(x)=\frac{3x^2}{8000}\qquad(0\le x\le20)`)}\n\n${rectangleFigure(4)}\n\n幅は5。高さは、それぞれの区間の中央で読む。`,'model-visual',[29],
    'ここでは曲がった密度f(x)=3x²/8000を使います。0〜20を4等分するので幅は5。中央は2.5、7.5、12.5、17.5です。その場所の密度を長方形の高さにして、幅かける高さを足しましょう。',
    'Use the curved density f(x)=3x²/8000 on zero to twenty. Four equal intervals have width five and midpoints 2.5, 7.5, 12.5 and 17.5. Read each height at its midpoint, then add width times height.');
  paired('1個目は、「幅 × 高さ」',[String.raw`\Delta x=\frac{20}{4}=5,\qquad x_1^*=2.5`,String.raw`f(2.5)=\frac{3(2.5)^2}{8000}=0.00234375`,String.raw`A_1=5\times0.00234375=0.01171875`],options.fig('rectangle-first-closeup',{min:0,max:5,pdf:x=>3*x*x/8000,lo:0,hi:0,rectangles:1,rectangleLabels:true,rectangleHighlight:0,yMax:.012,title:'1個目だけを拡大 · 縦軸の目盛りも拡大',xlabel:'x',ticks:[0,2.5,5]}),'色を付けた1個目の面積。',[29],
    'まず一つだけ計算しよう。最初の区間0〜5の中央は2.5。fに2.5を入れると高さ0.00234375。それに幅5を掛けて面積0.01171875です。高さそのものと、面積を区別してください。',
    'Calculate only the first rectangle. The midpoint of zero to five is 2.5. Substituting into f gives height 0.00234375. Multiply by width five to obtain area 0.01171875. Distinguish height from area.');
  paired('4個を足すと、98.4375％',[String.raw`S_4=\sum_{i=1}^{4}A_i`,String.raw`\begin{aligned}S_4={}&0.01171875+0.10546875\\&+0.29296875+0.57421875\end{aligned}`,String.raw`=0.984375=98.4375\%`],rectangleFigure(4),'長方形の合計は、曲線の下の面積1の近似。',[29],
    '残りの中央は7.5、12.5、17.5。どれも5×f(中央)で計算します。4個の面積を足すと0.984375。曲線の下の本当の面積1より少し小さい。確率の合計が不足しているのではなく、長方形で近似したための差です。',
    'Apply five times f(midpoint) to the remaining rectangles. The four areas sum to 0.984375, slightly below the true curved area of one. This is approximation error, not missing probability in the density.');
  paired('16個なら、99.9023％',[String.raw`\Delta x=\frac{20}{16}=1.25`,String.raw`S_{16}=1.25\bigl[f(0.625)+\cdots+f(19.375)\bigr]`,String.raw`=0.9990234375\approx99.9023\%`],rectangleFigure(16),String.raw`最初の面積：$1.25\times f(0.625)=0.00018310546875$`,[30],
    '今度は16等分。幅1.25で、最初の中央は0.625です。同じ幅かける高さを16回計算して足すと0.9990234375。本当の面積1との差は、4個のときより小さくなりました。',
    'With sixteen intervals, each width is 1.25 and the first midpoint is 0.625. Add sixteen width-times-height contributions to get 0.9990234375. The gap from the true area of one is smaller than with four rectangles.');
  paired('64個なら、99.9939％',[String.raw`\Delta x=\frac{20}{64}=0.3125`,String.raw`S_{64}=0.3125\bigl[f(0.15625)+\cdots+f(19.84375)\bigr]`,String.raw`=0.9999389648\ldots\approx99.9939\%`],rectangleFigure(64),String.raw`最初の面積：$0.3125\times f(0.15625)\approx0.00000286102$`,[31],
    '64等分なら幅0.3125。最初の中央は0.15625で、高さはfにこの値を入れて読みます。64個の合計は約0.999939です。少しずつ幅を小さくすると、長方形の合計が曲線の面積に近づいていきます。',
    'With sixty-four intervals, width is 0.3125 and the first midpoint is 0.15625. Evaluate f at each midpoint and add the sixty-four areas to get about 0.999939. Finer rectangles bring the sum closer to the curved area.');
  paired('積分なら、面積はちょうど1。',[String.raw`\int_0^{20}\frac{3x^2}{8000}\,dx`,String.raw`=\left[\frac{x^3}{8000}\right]_0^{20}`,String.raw`=\frac{20^3-0^3}{8000}=1`],options.fig('rectangle-exact-area',{max:20,pdf:x=>3*x*x/8000,lo:0,hi:20,yMax:.19,title:'曲線の下の全体の面積 = 1',xlabel:'x'}),'4個：0.984375　16個：0.999023　64個：0.999939',[32],
    '積分は幅を限りなく細かくした先の面積です。3x²の積分でx³になり、上端20と下端0を入れると8000÷8000で1。4個、16個、64個の計算が、この値に近づく流れを確認してください。',
    'The integral gives the limiting area as widths shrink towards zero. Integrating 3x² gives x³. Evaluate at twenty and zero to obtain 8000 divided by 8000, exactly one. Compare this with the four-, sixteen- and sixty-four-rectangle sums.');
  add('小さな面積を、全部足す',`${math(String.raw`\sum_i f(x_i)\Delta x\ \longrightarrow\ \int_a^b f(x)\,dx`)}\n\n小片は「高さ × 幅」。全体の面積は ${String.raw`$\int_{-\infty}^{\infty}f(x)\,dx=1$`}。`,'explain',[32,33,34,35],
    '一つの面積は、高さかける幅。Σはそれを全部足す記号です。欲しい区間だけなら、その区間の確率。取りうる値を全部含めれば、合計は1になります。',
    'Each little area is height times width. The summation adds them. Integrating a chosen interval gives its probability, while integrating over every possible value gives total probability 1.');
  add('ラーメン、あと何分？',`授業用モデル：待ち時間は0〜20分で一様。\n\n${math(String.raw`f(x)=\frac1{20}\quad(0\le x\le20)`)}\n\n${figure(39)}`,'model-visual',[36,37,38,39],
    '実際のお店の調査ではなく、0〜20分の一様分布を仮定します。全体の幅20に高さ1/20を掛けて面積は1。区間の確率を出すには、その区間の幅を掛けよう。',
    'Assume a uniform wait from zero to twenty minutes for this classroom model. Width twenty times height one twentieth gives total area 1. An interval probability needs that interval’s width.');
  keep(40);
  add('答え合わせ① · 面積の計算',`${math(formula(41))}\n\n${math(String.raw`\Pr(5\le X\le10)=\int_5^{10}\frac1{20}\,dx`)}\n\n${math(String.raw`=(10-5)\times\frac1{20}=0.25=25\%`)}`,'calculation answer',[41,42,43],
    'まず区間の確率の公式を書き、下端5、上端10、密度1/20を入れます。横幅5に高さ1/20を掛けて25％。式の各数字を、自分の図と対応させてください。',
    'Start with the interval-probability formula, then insert bounds five and ten and density one twentieth. Width five times height one twentieth gives 25 percent. Match each value to your sketch.');
  add('この面積が、25％',`${figure(44)}\n\n${options.tryIt('area')}`,'visual-link',[44,45],
    '全体20分のうち、同じ高さの5分ぶんだから4分の1です。やってみようで区間を動かす前に、広げたら面積がどう変わるか予想してみよう。',
    'Five of the twenty minutes at the same height give one quarter of the area. Predict what will happen when you widen the interval, then test it interactively.');
  keep(47,'F(c)は「cまで」の累積確率です。密度の左側からcまでの面積を集めます。小さいfが密度、大きいFが累積を表すことに注意しよう。','F(c) accumulates probability up to c. It adds the area under the density from the far left through c. Lowercase f denotes density, and uppercase F denotes cumulative probability.');
  keep(48);
  keep(49,'前の密度の色の面積が、こちらでは高さ0.25として現れます。cを右へ動かせば、足した面積は減りません。Fは0から1へ累積していきます。','The shaded density area now appears as a height of 0.25. Moving c right can only add area or leave it unchanged. The CDF accumulates from 0 towards 1.');
  add('別の店では、20〜60分なら？',`${math(String.raw`F(20)=0.10,\qquad F(60)=0.90`)}\n\n20分以内は10％、60分以内は90％。\n\n**20分より長く、60分以内に呼ばれる確率は？**`,'explain',[52,53,54,55,56,57],
    'ここからは別のお店の、新しい仮定です。60分までの90％には、20分までの10％も入っています。欲しい区間だけを取り出すには、どうすればよいかな？',
    'These are new assumptions for another restaurant. The ninety percent up to sixty minutes already includes the ten percent up to twenty. How can we isolate the interval between them?');
  paired('累積確率の差で、80％',[formula(58),String.raw`\Pr(20<X\le60)=0.90-0.10=80\%`],figure(60),options.tryIt('cdf'),[58,59,60,61],
    '大きい累積から、小さい累積を引くと80％。図は、この累積の値に合う密度の一例です。やってみようでは、同じ確率がfでは面積、Fでは高さになる対応を見よう。',
    'Subtract the earlier cumulative probability from the later one to get eighty percent. This chart shows one compatible density. Explore how probability appears as area under f and height on F.');
  keep(62);
  keep(65,'くじやサイコロでは「値かける確率」を足しました。連続でも同じです。小さな幅の確率f(x)dxに値xを掛け、全体で足したものが期待値です。','For a lottery or die roll, we added value times probability. The continuous version weights each small probability contribution f(x)dx by x and accumulates across the distribution.');
  paired('配達ロボットの期待時間は、6分',[String.raw`E(X)=\int_0^{12}x\frac1{12}\,dx`,String.raw`=\left[\frac{x^2}{24}\right]_0^{12}=6\text{ 分}`],figure(73),'授業用モデル：0〜12分の一様分布、密度1/12。',[68,69,70,71,72,73],
    'ロボットは0〜12分で一様に到着すると仮定します。期待値の公式に密度1/12を入れ、上端と下端で計算すると6分。図のつり合う中心です。毎回6分で来るという約束ではありません。',
    'Assume a uniform delivery time from zero to twelve minutes. Insert density one twelfth into the expectation formula and evaluate at the endpoints to get six minutes, the balance point on the chart.');
  keep(75,'同じ期待時間でも、毎回ほぼ同じか、大きく変わるかでは違うよね。平均との差を二乗して、確率で重みを付けて足す。それが分散です。','The same expected wait can come with very different variability. Variance weights the squared distance from the mean by probability and adds those contributions.');
  add('分散から、標準偏差へ',`${math(String.raw`\operatorname{Var}(X)=\int_0^{12}(x-6)^2\frac1{12}\,dx`)}\n\n${math(String.raw`=\left[\frac{(x-6)^3}{36}\right]_0^{12}=12\text{ 分}^2`)}\n\n${math(String.raw`\sigma=\sqrt{\operatorname{Var}(X)}=\sqrt{12}\approx3.46\text{ 分}`)}`,'calculation',[77,78,79,80,81,82],
    '中心6からのずれを二乗して積分します。上端と下端を入れると、216から−216を引いて36で割るので12。分散の単位は分の二乗です。平方根を取ると標準偏差約3.46分になります。',
    'Integrate squared deviations from six. The endpoint calculation is (216 − (−216))/36 = 12, in minutes squared. Taking the square root gives a standard deviation of about 3.46 minutes.');
  add('中心と、ばらつきを見る',`${figure(83)}\n\n${options.tryIt('moments')}`,'visual-link',[83,84],
    '中心は6分、色はそこから標準偏差一つぶんの範囲です。色の面積が分散12を表すわけではありません。配達時間の幅を変えて、中心とばらつきがどう変わるか確かめよう。',
    'The centre is six minutes, and the shading marks one standard deviation each way. Its area is not the variance. Explore how changing the delivery window changes the mean and spread.');
  keep(85);
  add('正規分布：中心と、ばらつき',`${math(String.raw`X\sim N(\mu,\sigma^2)\qquad E(X)=\mu,\quad\operatorname{Var}(X)=\sigma^2`)}\n\n${figure(86)}`,'model-visual',[86,87,88,89],
    '左右対称の釣鐘型です。Nの最初の数が平均μ、二つ目が分散σ²。この書き方で二つ目を標準偏差と間違えないようにしよう。',
    'This bell is symmetric. In N(μ,σ²), the first parameter is the mean and the second is the variance. Do not read the second parameter as the standard deviation.');
  keep(90);
  keep(91);
  keep(92);
  keep(95,'毎回あの密度を積分する代わりに、中心を0、標準偏差を1にそろえます。平均との差を標準偏差で割ると「中心から何個ぶん？」という位置になります。もとが正規なら、Zは標準正規分布です。','Instead of integrating each normal density afresh, put its centre at zero and its standard deviation at one. The formula measures distance from the mean in standard deviation units. Normal X gives standard normal Z.');
  paired('60点は、標準偏差1個ぶん上',[String.raw`z=\frac{x-\mu}{\sigma}`,String.raw`z=\frac{60-50}{10}=1`],figure(106),`仮定：平均50点、標準偏差10点の正規分布。\n\n${options.tryIt('normal')}`,[98,99,100,101,102,103,104,105,106,107,108],
    '授業用に平均50、標準偏差10の正規モデルを考えます。60点を標準化するとz=1。これは100％ではなく、標準偏差一つぶん上という位置です。平均や標準偏差を変えて、同じ60点を比べてみよう。',
    'For a hypothetical normal score model with mean fifty and standard deviation ten, a score of sixty gives z = 1. That describes location, not 100 percent probability. Explore how the same score changes meaning under different parameters.');
  keep(109);
  add('この表は、右側の面積',`${math(String.raw`Q(z)=\Pr(Z>z)`)}\n\n${figure(111)}\n\n${options.tableLink}`,'model-visual',[110,111,112],
    '使うのは上側確率の表です。zより右の色の面積を読みます。別の種類の表では意味が違うので、表の小さな図や説明を先に確認しよう。','Our table reports upper-tail probability: the shaded area to the right of z. Other tables use different conventions, so check the table’s diagram first.');
  keep(114,'z=1.96を探します。まず1.9の行。小数第1位までの部分で、行を決めてください。','Locate z = 1.96. First use 1.9 to choose the row. Keep your finger on that row.');
  keep(115);
  keep(116);
  paired('1.96より右は、2.5％',[formula(117)],figure(118),'',[117,118],
    '行1.9と列0.06の交点は0.02500。表の数字は右の尾の面積で、100を掛けると2.5％です。どこの確率か、図を指さして説明してみよう。',
    'Row 1.9 and column 0.06 meet at 0.02500. That is the right-tail area, or 2.5 percent. Point to the region your answer describes.');
  paired('−1.96より左も、2.5％',[formula(121)],figure(120),'左右対称なので、同じ距離の尾は同じ面積。',[119,120,121],
    'マイナス1.96より左なら、左右対称を使います。右の1.96より先と同じ面積なので2.5％。マイナスの位置でも、確率がマイナスにはなりません。',
    'Use symmetry for the region below negative 1.96. It matches the right tail above positive 1.96, so its probability is also 2.5 percent.');
  paired('＋1.96より左は、97.5％',[formula(124),String.raw`\Pr(Z<1.96)=1-0.02500=97.5\%`],figure(126),'',[122,123,124,125,126],
    '今度はプラス1.96より左の全部。全体1から、小さい右の尾を引きます。答えが大きい確率になっていることを、図の色の広さでも確認しよう。',
    'For everything below positive 1.96, subtract the small right tail from 1. The large shaded region confirms why the answer is 97.5 percent.');
  paired('真ん中は、両方の尾を引く',[formula(128),String.raw`1-2(0.15866)=0.68268\approx68.27\%`],figure(130),`教科書の丸め値では68.28％。\n\n${options.tryIt('table')}`,[127,128,129,130,131],
    '−1から＋1の中央は、左右の尾を二回引きます。この表なら約68.27％。教科書の丸め値で68.28％になるのは矛盾ではありません。やってみようで右、左、真ん中を切り替えてみよう。',
    'For the central interval from negative one to positive one, remove both tails. Our table gives about 68.27 percent. The textbook’s rounding gives 68.28 percent. Explore the different shaded regions.');
  keep(132);
  paired('答え合わせ② · 70点以上',[String.raw`z=\frac{x-\mu}{\sigma}=\frac{70-50}{\sqrt{100}}=2`,String.raw`Q(2)=0.02275`,String.raw`\Pr(X\ge70)=\Pr(Z\ge2)=2.275\%`],figure(137),'表：2.0の行、0.00の列。',[133,134,135,136,137],
    '分散100の平方根が標準偏差10です。70点を標準化すると2。表の2.0の行、0.00の列を読むと0.02275なので、右側の確率は2.275％です。',
    'The standard deviation is the square root of one hundred. Standardizing seventy gives z = 2. Read row 2.0 and column 0.00 to get 0.02275, or 2.275 percent.');
  keep(138);
  paired('答え合わせ③ · 30〜70点',[formula(139),formula(140),String.raw`\Pr(-2\le Z\le2)=1-2(0.02275)=95.45\%`],figure(142),'',[139,140,141,142],
    '両端を標準化すると−2と＋2です。全体1から、先ほどの尾0.02275を二回引いて95.45％。式の引き算が、図のどの部分に対応するかを説明してみよう。',
    'Standardize the two boundaries to negative two and positive two. Subtract the previous tail probability twice from 1 to get 95.45 percent. Match the subtraction to the chart.');
  add('確率は、面積。',`ここからは、ALワークシートに自分で取り組もう。`,'statement',[143,144],
    '欲しい確率がどの面積なのかを、最初に描いてください。ここからはALに自分で取り組みます。各セルの答えは示しません。何が与えられ、何を求めるのかを整理しよう。',
    'Begin by sketching the probability region you need. Now work independently on the AL worksheet. Individual cell answers are not supplied. Identify the givens and what each question asks.');
  add('補足：1人の点数と、n人の平均',`教科書 p.123\n\n${math(String.raw`\text{1人：}\quad Z=\frac{X-\mu}{\sigma}`)}\n\n${math(String.raw`\text{平均：}\quad Z=\frac{\bar X-\mu}{\sigma/\sqrt n}`)}`,'calculation',[145,146,147,148,149],
    '補足です。独立なn人の平均は、1人の値よりばらつきが小さく、標準偏差はσ/√n。問題が個人の値なのか、標本平均なのかを確認しよう。正規母集団なら独立な標本の平均も正規分布です。',
    'Optional extension: the mean of n independent observations has standard deviation σ/√n. Check whether a problem concerns one value or a sample mean. Independent samples from a normal population have a normally distributed mean.');
  add('標準化だけでは、形は変わらない。',`平均0・標準偏差1にそろえても、\nもとの分布が正規とは限らない。`,'statement',[150,151],
    '標準化は中心と尺度を変える操作なので、山の形そのものは変わりません。一般の母集団の標本平均を正規近似するには、有限分散などの条件と十分な標本数が必要です。',
    'Standardization changes centre and scale, while preserving the distribution’s shape. A normal approximation for sample means from other populations needs conditions such as finite variance and a sufficiently large sample.');
  if(slides.length!==56)throw Error(`Expected 56 edited slides, got ${slides.length}`);
  if(slideTermKeys.length!==slides.length)throw Error('Statistical terminology must follow the slide order');
  slides.forEach((slide,i)=>{
    const keys=slideTermKeys[i];
    mapping[i].terms=keys.map(key=>({ja:glossary[key][0],en:glossary[key][1]}));
    if(keys.length)slides[i]=annotateJapaneseTerms(slide).replace(/<!-- _class: (.*?) -->/,'<!-- _class: $1 has-stat-terms -->')+'\n\n'+terminology(keys);
  });
  return {slides,mapping,notes:{version:1,deck:'materials/2026-yoh/week05/w5.pdf',slides:narration}};
}

export const compactStyle=storyStyle.replace('</style>',`
section.race-media{padding:0;background:#000;display:block}section.race-media h2,section.race-media footer,section.race-media::after{display:none}section.race-media .media-link{position:absolute;inset:0;display:block}section.race-media img{position:absolute;inset:0;width:1280px;height:720px;max-width:none;max-height:none;object-fit:cover}section.race-finish img{object-position:center 64%}section.race-scan img{object-position:center 43%}section.race-media .media-action{position:absolute;bottom:38px;left:45px;padding:12px 20px;background:#000c;color:white;border-radius:6px;font-size:25px;font-weight:700}section.race-media .media-credit{position:absolute;right:18px;bottom:10px;font-size:14px;color:white;background:#000b;padding:3px 8px}
section.watch-bridge{background:#ede5da;padding:0;display:block}section.watch-bridge h2{display:none}section.watch-bridge .watch-photo{position:absolute;left:95px;top:50px;width:535px;height:585px;object-fit:contain;max-height:none}section.watch-bridge .watch-invitation{position:absolute;left:710px;top:150px;width:510px}section.watch-bridge h3{font-size:49px;line-height:1.5;margin:0 0 20px}section.watch-bridge .watch-invitation p{font-size:35px;margin:0 0 32px}section.watch-bridge a{display:inline-block;background:#a51c30;color:white;text-decoration:none;font-size:30px;padding:14px 25px;border-radius:7px;font-weight:700}section.watch-bridge small{display:block;font-size:16px;color:#756d61;margin-top:30px;line-height:1.6}
section.explain{font-size:30px}section.explain h2{font-size:43px}section.explain .katex-display{font-size:43px}section.explain p{margin:24px 0}
section.precision img{height:160px}section.precision .katex-display{font-size:54px}section.precision p{font-size:30px;margin:16px 0}
section.calculation .katex-display{font-size:43px;margin:32px 0}section.calculation h2{font-size:43px}section.calculation.answer{background:#edf5ef}
section.model-visual{padding:36px 65px 45px}section.model-visual h2{font-size:41px;margin-bottom:10px}section.model-visual p{font-size:25px;margin:10px 0}section.model-visual .katex-display{font-size:34px;margin:8px 0}section.model-visual img{height:355px;width:1030px;object-fit:contain}
section.visual-link{padding:34px 60px 45px}section.visual-link h2{font-size:43px;margin-bottom:8px}section.visual-link img{height:440px;width:1030px;object-fit:contain}section.visual-link p{font-size:25px;margin:8px 0}
section.worked{display:grid;grid-template-columns:1.1fr 1fr;grid-template-rows:auto 1fr auto;gap:14px 26px;padding:45px 55px 55px;text-align:left;align-content:center;align-items:center}section.worked h2{grid-column:1/-1;font-size:43px;margin:0 0 8px}section.worked .worked-copy{min-width:0}section.worked .worked-copy .katex-display{font-size:27px;text-align:left;margin:26px 0}section.worked .worked-visual{min-width:0}section.worked img{width:100%;height:320px;object-fit:contain}section.worked>p{grid-column:1/-1;font-size:22px;margin:0}section.worked .worked-visual p{margin:0}
section.worked a,section.visual-link a,section.model-visual a{display:inline-block;background:#176d82;color:white;text-decoration:none;border-radius:7px;padding:8px 19px;font-size:23px;font-weight:700}section.model-visual a{font-size:21px;padding:7px 17px}
${terminologyStyle}
</style>`);
