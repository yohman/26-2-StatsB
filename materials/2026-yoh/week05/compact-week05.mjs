import {createWeek5Story,storyStyle} from './story-week05.mjs';
import {createWeek5Notes} from './notes-week05.mjs';
import {glossary,terminology,terminologyStyle,annotateJapaneseTerms} from './terms-week05.mjs';
import probability from '../../../assets/week5-math.js';

// Preserve the long-form source. This editorial pass combines routine steps,
// while retaining sequences in which the changing image or withheld answer matters.
export function createWeek5CompactStory(options){
  const full=createWeek5Story(options),originalNotes=createWeek5Notes(full.mapping).slides;
  const slides=[],mapping=[],narration=[];
  const math=tex=>`$$\n${tex}\n$$`;
  const figure=n=>full.slides[n-1].match(/!\[[^\]]*\]\([^\n]+?\)/)?.[0]||'';
  const formula=n=>(full.slides[n-1].match(/\$\$\n([\s\S]+?)\n\$\$/)?.[1]||'').replace(/Q\(([^)]+)\)/g,'\\Pr(Z>$1)');
  const sourceBody=n=>full.slides[n-1].replace(/^<!-- _class: [^>]+ -->\n\n## [^\n]+\n\n/,'').replace(/\n\n<!--[\s\S]*$/,'');
  function vocabulary(ids,layout){
    if(/queue-story|race-media|watch-bridge/.test(layout))return [];
    const n=ids[0];
    if(n<=15)return ['measurement'];
    if(n===16)return ['randomVariable','pointProbability'];
    if(n<=20)return ['interval','intervalProbability'];
    if(n===22)return ['continuous'];
    if(n===23)return ['density','normal'];
    if(n===25)return ['intervalProbability'];
    if(n===26)return ['integral','intervalProbability'];
    if(n<=35)return ['density','probability'];
    if(n<=61)return ['cdf','cumulative'];
    if(n===62)return ['expectation','variance'];
    if(n<=74)return ['expectation'];
    if(n<=84)return ['variance','sd'];
    if(n<=89)return ['normal','mean','sd'];
    if(n<=91)return ['sd','normal'];
    if(n===92)return ['density','normal'];
    if(n<=108)return ['standardization','zScore'];
    if(n<=118)return ['normalTable','upperTail'];
    if(n<=121)return ['lowerTail','upperTail'];
    if(n<=126)return ['lowerTail','upperTail'];
    if(n<=131)return ['central','upperTail'];
    if(n<=137)return ['standardization','upperTail'];
    return ['standardization','normalTable'];
  }
  function formulaSource(ids){
    const n=ids[0];
    if(n<=35)return {pages:'121–122',label:'教科書 p.121–122 · 確率密度と面積（例への適用）'};
    if(n<=61)return {pages:'121–122',label:'教科書 p.121–122 · 分布関数と区間の確率'};
    if(n<=84)return {pages:'129',label:'教科書 p.129 · 期待値と分散'};
    if(n<=89)return {pages:'122–123,129',label:'教科書 p.122–123・129 · 正規分布、平均と分散'};
    if(n<=94)return {pages:'122',label:'教科書 p.122 · 正規分布の確率密度'};
    if(n<=108)return {pages:'123',relation:'application',label:'教科書 p.123 · 標準化の考え方をXに適用 ／ 津村18'};
    if(n<=118)return {pages:'124',label:'教科書 p.124 · 上側確率と表の読み方'};
    if(n<=126)return {pages:'124–125',label:'教科書 p.124–125 · 左右対称・全体から引く'};
    if(n<=131)return {pages:'122,125',relation:'application',label:'教科書 p.122・125 · 区間の差と両側の尾'};
    return {pages:'123–125',relation:'application',label:'教科書 p.123–125 · 標準化と表の例への適用'};
  }
  function add(title,body,layout,ids,ja,en){
    const source=full.mapping[ids[0]-1];
    const formulaRef=/\$/.test(body+title)?formulaSource(ids):null;
    const keys=vocabulary(ids,layout);
    mapping.push({...source,slide:slides.length+1,title,layout,sourceBeats:ids,termKeys:keys,...(formulaRef?{formulaRef}:{})});
    if(formulaRef)body+=`\n\n<aside class="formula-ref">${formulaRef.label}</aside>`;
    slides.push(`<!-- _class: ${layout} -->\n\n## ${title}\n\n${body}`);
    const first=originalNotes[ids[0]-1];
    narration.push({page:slides.length,title,ja:ja||first.ja,en:en||first.en,...(formulaRef?{formulaRef}:{})});
  }
  const keep=(n,ja,en)=>{const s=full.mapping[n-1];add(s.title,sourceBody(n),s.layout,[n],ja,en);};
  const paired=(title,tex,graphic,after,ids,ja,en)=>add(title,`<div class="worked-copy">\n\n${tex.map(math).join('\n\n')}\n\n</div>\n\n<div class="worked-visual">\n\n${graphic}\n\n</div>\n\n${after||''}`,'worked',ids,ja,en);

  const zFormula=String.raw`z=\frac{x-\mu}{\sigma}`;
  const practice=(no,title,given,question,ids,ja,en,minutes=3)=>{
    add(`チャレンジ${no}　${title}`,`<div class="pause">自分で解く　${minutes}分</div>\n\n${given}\n\n**${question}**`,'challenge',ids,ja,en);
    mapping.at(-1).practiceFocus='z-scores-and-table';
  };
  const solution=(no,title,given,symbolic,substitution,graphic,result,ids,ja,en)=>{
    add(`答え合わせ${no} · ${title}`,`<div class="worked-copy">\n\n<p class="given">① 与えられた条件：${given}</p>\n\n<p class="step-label">② 公式（文字のまま）</p>\n\n${math(symbolic)}\n\n<p class="step-label">③ 代入・計算</p>\n\n${substitution.map(math).join('\n\n')}\n\n</div>\n\n<div class="worked-visual">\n\n${graphic}\n\n</div>\n\n④ 答え・意味：${result}`,'worked practice-answer',ids,ja,en);
    mapping.at(-1).practiceAnswer=true;
  };

  const video='https://www.youtube.com/watch?v=GHw-eTs4Yes';
  const finish='https://worldathletics.org/competitions/olympic-games/the-xxxiii-olympic-games-7153115/news/article/paris-2024-olympics-report-men-100m';
  const omega='https://www.hodinkee.com/articles/olympics-2024-mens-100m-photo-finish';
  function opening(title,body,layout,ja,en,sources){
    add(title,body,layout,[1],ja,en);
    const item=mapping.at(-1);
    for(const key of Object.keys(item))if(!['slide','title','layout','sourceBeats','termKeys'].includes(key))delete item[key];
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
  add('今日のゴール：標準化して、表で読む',`標準偏差を確認する。\n\n値をzに直す。\n\n右・左・区間の面積を、表から求める。\n\n**このあと何度か、自分で解く時間を取ります。**`,'explain',[95],
    '今日の中心は、ALに必要な標準化と表の読み方です。標準偏差を確認し、平均との差を割ってzを求め、欲しい領域を描き、表を読みます。途中のチャレンジはすべてこの練習。ALそのもののセルの答えは示さず、別の数値で練習します。',
    'Today concentrates on standardization and table reading for the AL. Check the standard deviation, find z, sketch the required region, then read the table. Every classroom challenge practices these skills with separate values, without supplying the homework cell answers.');
  add('身長、何cmまで測る？',`${figure(12)}\n\n${math(String.raw`160\quad 160.0\quad 160.000\ldots`)}\n\n「ぴったり160cm」と「155〜165cm」は、同じ？`,'precision',[12,13,14,15],
    'ロボットの身長を160cmと呼んでも、小数を細かくするともっと詳しい値が見えてきます。「ぴったり160cm」と「155〜165cmの範囲に入る」は同じ条件かな？ このあとも同じ155〜165cmの区間を使います。まず一点と幅のある範囲の違いを考えよう。',
    'Calling a robot 160 cm tall leaves its finer measurement unspecified. Is exactly 160 cm the same condition as a height between 155 and 165 cm? Keep that same interval throughout the coming example. First distinguish an exact point from a range with width.');
  keep(16);
  add('155〜165cmなら、区間に幅がある',`${math(String.raw`\Pr(155\le X\le165)>0`)}\n\nぴったり160cmという1点の幅は0。\n\n155〜165cmという区間には、10cmの幅がある。`,'explain',[17,18,19,20],
    'ぴったり160cmの確率が0でも、その値が実現しないという意味ではありません。一点は幅0です。一方、155〜165cmには10cmの幅がある。この区間に密度があるモデルなら確率は正になります。次の図でも同じ区間を色で示し、式に155と165を代入して実際の確率を計算します。',
    'Zero probability at exactly 160 cm does not mean that value cannot occur. A point has no width. In contrast, the interval from 155 to 165 cm is ten centimetres wide and has positive probability in our height model. Use this same interval in the shaded graph and then substitute 155 and 165 into the probability formula.');
  keep(22);
  const heightPdf=x=>Math.exp(-0.5*((x-160)/5)**2)/(5*Math.sqrt(2*Math.PI));
  const heightFigure=(id,lo,hi)=>options.fig(id,{min:140,max:180,pdf:heightPdf,lo,hi,mean:160,ticks:[140,150,155,160,165,170,180],yMax:.1,title:'ロボットの身長 · 正規分布の仮定',xlabel:'身長（cm）'});
  add('ロボットの身長は、160cm付近に集まる',`同じ型のロボットでも、身長には小さな違いがある。\n\n${heightFigure('density-robot-height',0,0)}\n\n授業用モデル：平均160cm、標準偏差5cmの正規分布。`,'model-visual',[23],
    'さっきの身長の話を、たくさんのロボットに広げよう。同じ型でも製造の違いで少しずつ身長が違う、と仮定します。今回は平均160cm、標準偏差5cmの正規分布です。160cm付近に集まり、そこから離れるほど少なくなる左右対称の釣鐘型。横軸は身長cm、縦軸は確率密度です。この形を正規分布と呼びますが、すべての確率密度がこの形になるわけではありません。パラメータは実測ではなく授業用の仮定です。',
    'Extend the earlier height story to many robots of the same type. Assume small manufacturing differences and a normal height model with mean 160 cm and standard deviation 5 cm. Heights cluster around 160, with fewer far from the centre on either side. The horizontal axis is height in centimetres; the vertical axis is probability density. This symmetric bell is a normal distribution, one possible density shape. These parameters are classroom assumptions, not measurements.');
  add('155〜165cmの確率は、この面積',`${heightFigure('density-robot-height-area',155,165)}\n\n曲線の高さではなく、155〜165cmの下の面積を見る。`,'visual-link',[25],
    'このロボットの身長が155〜165cmに入る確率は、色を付けた面積です。155と165の間を横にたどって、その上の密度を積み上げるイメージ。160での高さ一つを確率とは読みません。この正規分布なら中央の面積は約68％ですが、ここでは数値計算を急がず、確率は面積という対応を確認します。計算や表の読み方は後半で扱います。',
    'For this height model, the chance of a height between 155 and 165 cm is the shaded area. Accumulate the density across that interval rather than reading the curve’s height at 160 as a probability. Under this normal model the area is about 68 percent, but focus first on probability as area. The later normal-distribution section explains the calculation and table.');
  keep(26);
  add('確率密度には、いろいろな形がある',`釣鐘型は、正規分布の形。\n\n値の集まり方が違えば、密度の形も変わる。\n\n**どの形でも、区間の確率は曲線の下の面積。**`,'explain',[23,25,26],
    'ここで一度止めよう。確率密度という言葉は釣鐘型の別名ではありません。身長には今回は正規モデルを使いました。一方、待ち時間なら違う集まり方をするかもしれません。正規分布を無理に曲げるのではなく、別の現象に別のモデルを選ぶのです。密度は0以上で全体の面積は1。形が変わっても、区間の確率を面積で読むルールは同じ。次は柏のお店で並ぶ場面に切り替えます。',
    'Pause here: probability density is not another name for a bell curve. We chose a normal model for heights; waiting times may cluster differently. We are switching phenomena and models, not bending a normal distribution into another shape. Every density is nonnegative and has total area one. Whatever its shape, interval probability remains area underneath. Next, switch to joining a queue at a restaurant in Kashiwa.');
  opening('ラーメン店の行列',`<img src="images/ramen-queue-history-supplied.png" alt="なんでんかんでんの店先に続く夜の行列。利用者提供の白黒写真と元のキャプション。">`,'race-media queue-story queue-history',
    'この行列、何を待っていると思う？ 添付画像の説明には「なんでんかんでん」とあります。ラーメンを食べるために並ぶ、という身近な場面から考えよう。何人並んでいるかが見えても、自分が座るまで何分かかるかは、この写真だけでは分かりません。次は並んででも食べたいラーメンの写真、その次に柏の王道家の行列です。画像は利用者提供で、元のキャプションもそのまま示しています。',
    'What are these people queuing for? The supplied image identifies the ramen shop as Nandenkanden. Start with the familiar experience of waiting for ramen. Even when we can see the queue, the photograph alone cannot tell us how many minutes until we are seated. Next show the ramen itself, then the Oudouya queue in Kashiwa. This user-supplied image retains its original caption.', ['User-supplied image: images/ramen-queue-history-supplied.png']);
  opening('なんでんかんでんのラーメン',`<img src="images/nandenkanden-ramen-supplied.png" alt="なんでんかんでんの文字が入った器に盛られたラーメン。利用者提供の写真。">`,'race-media queue-story queue-bowl',
    '行列の先にあるのは、この一杯。「これを食べたいから並ぶ」という気持ちは分かるよね。では、食べたい気持ちとは別に、どれくらい待つかをどう考えればいいだろう？ 次は柏の王道家の行列を見て、待ち時間のモデルにつなげます。この写真は利用者提供で、数値モデルの実測データではありません。',
    'Here is the bowl at the end of the queue. Wanting to eat it explains why someone might join the line. But how should we think about the time we will spend waiting? Next, look at the Oudouya queue in Kashiwa and introduce the hypothetical waiting-time model. This user-supplied photograph is a story image, not measured data for that model.', ['User-supplied image: images/nandenkanden-ramen-supplied.png']);
  opening('王道家、この行列、何分待つ？',`<img src="images/oudouya-kashiwa-night-supplied.png" alt="夜の柏・王道家の店先から歩道へ続く行列。利用者提供の写真。">`,'race-media queue-story queue-portrait',
    'みんな、柏の王道家で並んだことある？ 友達とラーメンを食べに来たら、この行列。「座れるまで何分かな？」と考えるよね。この写真だけでは待ち時間の確率は分かりません。次から計算しやすい授業用のモデルを仮定します。モデルの数値は実測値ではなく、実際には20分を超えて待つこともあります。写真は利用者提供です。',
    'Have you queued at Oudouya in Kashiwa? Imagine arriving with classmates and seeing this line. How many minutes until we can sit down? A photograph cannot tell us the waiting-time distribution. Next we will assume a convenient classroom model, not measured Oudouya data. Actual waits can exceed twenty minutes. This photograph was supplied by the user.', ['User-supplied image: images/oudouya-kashiwa-night-supplied.png']);
  opening('王道家のラーメンとご飯',`<img src="images/oudouya-ramen-rice-supplied.png" alt="赤いカウンターに並ぶ王道家のラーメンとご飯。利用者提供の写真。">`,'race-media queue-story queue-bowl',
    '行列の先には、このラーメンとご飯。友達と「早く食べたいね」と話しながら待つ場面を想像しよう。では、座れるまで何分待つだろう？ 次から待ち時間を授業用のモデルで考えます。写真から確率や待ち時間が分かるわけではなく、モデルの数値は王道家の実測データではありません。',
    'Here is the ramen and rice at the end of the queue. Imagine waiting with friends, looking forward to this meal. How many minutes until we can sit down? Next, consider that waiting time through a classroom model. The photograph does not supply probabilities or measured waiting times, and the model is not based on observed Oudouya data.', ['User-supplied image: images/oudouya-ramen-rice-supplied.png']);
  const ramenFigure=(id,lo,hi)=>options.fig(id,{max:20,pdf:x=>3*x*x/8000,lo,hi,yMax:.19,title:'形を読むための授業用イメージ',xlabel:'待ち時間（分）',ticks:[0,5,10,15,20]});
  add('待ち時間なら、こんな形も考えられる',`列に並んでから座れるまでの時間を、X分とする。\n\n${ramenFigure('ramen-shape-only',0,0)}\n\n身長の釣鐘型とは、違う形。\n\n<small>形を読むための仮定です。王道家の実測データではありません。</small>`,'model-visual queue-model',[29],
    '横軸を身長から、列に並んでから席に案内されるまでの分数に切り替えます。この右に上がる曲線は、形を読むための授業用イメージです。実際の王道家で待ち時間を調べた結果ではありません。釣鐘型だけが確率密度ではないことを確認しよう。ここでは曲線の式を作ったり、係数を求めたりする必要はありません。次は教科書p.121と同じように、全体の面積と区間の面積を見ます。',
    'Switch the horizontal axis from height to minutes between joining the queue and being seated. This rising curve is a classroom illustration, not measured Oudouya waiting-time data. Its purpose is to show that a density need not be bell-shaped. We will not construct a formula or solve for a coefficient. As on textbook page 121, read the complete area and the area over a chosen interval.');
  add('全体の面積は、1＝100％',`${ramenFigure('ramen-total-area',0,20)}\n\nどんな形の確率密度でも、全体の面積は1。\n\n<small>この図の0〜20分は授業用の仮定。王道家の実測データではありません。</small>\n\n<small class="book-note">教科書 p.121 · 全体の確率は1</small>`,'model-visual queue-model',[32],
    '教科書p.121の全体の面積の話です。取りうる値を全部含めた面積は1、つまり100％。曲線の高さが1という意味ではありません。この図では授業用に0〜20分の範囲に収まる分布を描いたので、その範囲の全体が100％です。現実の王道家の待ち時間を保証しているのではなく、実際には20分を超えることもあります。式を導くのではなく、全体の面積の意味を確認します。',
    'This illustrates the total-area rule on textbook page 121. Include every possible value and the area is one, or one hundred percent. The curve itself does not need height one. This illustrative model assumes a zero-to-twenty-minute range, so its full area is one. That assumption does not guarantee seating within twenty minutes at the actual shop. Focus on the meaning of total area, without deriving a density formula.');
  add('区間の確率は、その部分の面積',`${ramenFigure('ramen-interval-area',15,20)}\n\n色の面積＝15〜20分待つ確率。\n\n0〜5分待つより、15〜20分待つほうが起こりやすい。\n\n<small>同じ5分幅の面積を比較。授業用の仮定で、王道家の実測データではありません。</small>`,'model-visual queue-model',[26,32],
    '教科書p.121〜122と同じように、区間の確率を面積として読みます。色の部分は15〜20分待つ確率です。0〜5分と15〜20分は同じ5分幅。この図では右側の面積が大きいので、15〜20分待つほうが起こりやすい。高さの数値そのものが確率なのではありません。今日はこの曲線から細かな百分率を手計算しません。ここで必要なのは、区間を選び、その下の面積が確率だと理解することです。',
    'Read interval probability as area, as on textbook pages 121–122. The shading represents a wait of fifteen to twenty minutes. Compare it with zero to five: both intervals have width five, but the right-hand area is larger. Thus fifteen to twenty is more likely in this hypothetical picture. Height alone is not probability. We will not calculate a numerical percentage from this illustrative curve; identify the interval and the area underneath.');
  const robotAssumption='授業用の仮定：ロボットの身長は平均160cm、標準偏差5cmの正規分布。実測データではありません。';
  const robotChart=(id,extra={})=>options.fig(id,{min:140,max:180,pdf:heightPdf,lo:0,hi:0,mean:160,ticks:[140,150,155,160,165,170,180],xlabel:'ロボットの身長（cm）',title:'ロボット工場 · 身長の分布（仮定）',...extra});
  paired('ロボットが、155〜165cmに収まる確率',[
    String.raw`\Pr(a\le X\le b)=\int_a^b f(x)\,dx`,
    String.raw`\Pr(155\le X\le165)=\int_{155}^{165}f(x)\,dx`,
  ],robotChart('robot-interval-example',{lo:155,hi:165}),`出荷条件が155〜165cmなら、色の面積が条件を満たす割合。\n\n<small>${robotAssumption}</small>`,[26,32],
    'さっきのロボット工場に戻ろう。出荷できる身長を155〜165cmと決めたら、何割が条件を満たす？ Xは1体の身長です。一般式のaに155、bに165を入れると右の色の面積になります。積分の手計算はせず、区間と面積の対応を読もう。この授業用モデルなら約68％です。実測の合格率ではありません。',
    'Return to the robot factory. Suppose the shipping requirement is a height between 155 and 165 cm. X is the height of one robot. Replacing a and b with those limits identifies the shaded area, or the fraction meeting the requirement. We are reading the integral as area, not doing hand integration. The classroom normal model gives about 68 percent, not a measured factory pass rate.');
  paired('160cm以下のロボットは、何割？',[
    String.raw`F(c)=\Pr(X\le c)`,
    String.raw`F(160)=\Pr(X\le160)=0.50`,
  ],robotChart('robot-cumulative-question',{lo:140,hi:160}),`160cm以下＝左側から160cmまで、すべて含める。\n\n<small>${robotAssumption}</small>`,[47],
    '今度は160cm以下なら入れる作業スペースを考えよう。155という下限はなく、160以下を全部数えます。このモデルは160を中心に左右対称なので半分、50％です。Fのかっこは上限を表します。F(160)は160cmの1点の確率ではなく、160cm以下をすべて含む確率です。',
    'Imagine a workspace accepting robots no taller than 160 cm. Include every height up to 160, with no lower cutoff at 155. Symmetry around 160 gives one half, or 50 percent. The argument of F is the upper limit. F(160) is not the probability at one exact height; it is the probability accumulated through that height.');
  add('密度の図：160cmまでの「面積」',`${robotChart('robot-cumulative-density',{lo:140,hi:160})}\n\n${math(String.raw`\Pr(X\le160)=0.50`)}\n\n色の面積が50％。曲線の高さを50％とは読まない。\n\n<small>${robotAssumption}</small>`,'model-visual robot-example',[48],
    '同じ条件を密度の図で見よう。横軸はロボットの身長、縦軸は密度。160までの色の面積が50％です。160での曲線の高さが0.50なのではありません。画面の140より左にも非常に小さい尾が続きますが、図では省略しています。次の図では、この同じ50％を高さとして描きます。',
    'Read the same condition on the density plot. The horizontal axis is robot height and the vertical axis is density. The shaded area through 160 is 50 percent; the density height at 160 is not 0.50. The tiny tail below the displayed 140 cm boundary continues beyond the plot. Next represent this same accumulated probability as a height.');
  add('累積分布の図：同じ50％を「高さ」にする',`${robotChart('robot-cumulative-function',{pdf:x=>probability.normalCdf((x-160)/5),cdf:true,mean:null,yMax:1,title:'160cm以下の割合を、高さで読む',point:{x:160,y:.5}})}\n\n${math(String.raw`F(160)=0.50`)}\n\n横160cmから上へ進むと、縦0.50＝50％。\n\n<small>${robotAssumption}</small>`,'model-visual robot-example',[49],
    'ロボットは同じ、問いも160cm以下で同じ。変わったのは縦軸です。今は累積確率なので、横160から曲線まで上がり、左に読むと0.50。直前の密度の面積が、この図の高さになりました。横の身長を大きくすれば、含めるロボットは増えるので曲線は下がりません。',
    'The robots and the question are unchanged: what fraction are no taller than 160 cm? The vertical axis now measures cumulative probability. Move up from 160 to the curve, then left to read 0.50. The previous density area becomes the height on this graph. Increasing the height threshold includes more robots, so the cumulative curve cannot decrease.');
  add('ロボット工場：中心と、ばらつきを知りたい',`${robotChart('robot-moments-question')}\n\n設計の中心は160cm。実際の身長は、その周りに散らばる。\n\n**中心を表すのが期待値。散らばりを表すのが分散。**\n\n<small>${robotAssumption}</small>`,'model-visual robot-example',[62],
    '工場の担当者なら、合格する割合だけでなく、中心はどこか、どれくらいばらつくかも知りたいよね。ここでは中心160cm、その周りに小さな違いがある、と仮定しています。次の2枚は教科書p.129の期待値と分散の定義をこの身長に結び付けます。新しい積分計算の課題にはしません。',
    'A factory manager needs more than a pass percentage: where is the centre, and how much do heights vary around it? Our assumed model centres at 160 cm with manufacturing variation around that value. The next two slides connect the textbook definitions of expected value and variance to this height scenario. They are conceptual illustrations, not new hand-integration exercises.');
  paired('期待値：たくさんのロボットの平均身長',[
    String.raw`E(X)=\int_{-\infty}^{\infty}x f(x)\,dx`,
    String.raw`E(X)=160\ \mathrm{cm}`,
  ],robotChart('robot-expectation-example'),`このモデルの中心は160cm。全員が160cmという意味ではない。\n\n<small>${robotAssumption}</small>`,[65],
    '期待値のXをロボットの身長として読もう。身長に起こりやすさを掛けて全体を足すと、長い目で見た平均になります。このモデルは中心160の左右対称な正規分布なので期待値は160cm。積分を暗算した結果ではなく、与えたモデルの性質です。全員が160cmとは言っていません。',
    'Read X as robot height. Weight each height by how often it occurs and add across the distribution to obtain the long-run average. Our symmetric normal model has expected height 160 cm. We use the given model property rather than pretending to calculate the integral mentally. Individual robots still vary; expected height does not mean every robot is 160 cm tall.');
  paired('分散',[
    String.raw`\operatorname{Var}(X)=\int_{-\infty}^{\infty}(x-\mu)^2f(x)\,dx`,
    String.raw`\mu=160,\quad\sigma=5\ \mathrm{cm}`,
    String.raw`\operatorname{Var}(X)=5^2=25\ \mathrm{cm}^2`,
  ],robotChart('robot-variance-example',{lo:155,hi:165,labels:[{x:155,text:'μ − σ'},{x:165,text:'μ + σ'}]}),`ロボットの身長が160cmから、どれくらい散らばるか。\n\n<small>${robotAssumption}</small>`,[75],
    '同じロボットの身長で分散を読もう。xから中心160を引き、その差を二乗して、起こりやすさで重み付けして足します。ここでは標準偏差5cmをモデルの条件として与えているので、分散は5の二乗で25平方cmです。分散25と標準偏差5を混同しないでね。図の155と165は中心から標準偏差1個ぶん離れた位置です。',
    'Variance describes the spread of robot heights around 160 cm. Subtract the mean, square the difference, then weight it by the density and accumulate. The model gives standard deviation 5 cm, so variance is 25 square centimetres. Distinguish variance 25 from standard deviation 5. The highlighted 155 and 165 boundaries lie one standard deviation on each side of the centre.');
  keep(85);
  add('正規分布：中心と、ばらつき',`${math(String.raw`X\sim N(\mu,\sigma^2)\qquad E(X)=\mu,\quad\operatorname{Var}(X)=\sigma^2`)}\n\n${figure(86)}`,'model-visual',[86,87,88,89],
    '左右対称の釣鐘型です。Nの最初の数が平均μ、二つ目が分散σ²。この書き方で二つ目を標準偏差と間違えないようにしよう。',
    'This bell is symmetric. In N(μ,σ²), the first parameter is the mean and the second is the variance. Do not read the second parameter as the standard deviation.');
  keep(90);
  keep(91);
  add('分散と標準偏差を、取り違えない',`分散は、標準偏差を2乗したもの。\n\n${math(String.raw`\sigma^2=36\quad\Rightarrow\quad \sigma=\sqrt{36}=6`)}\n\n**標準化で割るのは、36ではなく6。**`,'explain',[95],
    '標準化では、分母は分散の平方根です。ここは新しい公式を増やす話ではなく、σ²という記号をσに戻す平方根の計算です。分散36と与えられたら標準偏差は6。36で割ってはいけません。次の問題では、どちらが与えられたかを最初に確認しよう。',
    'Standardization divides by the square root of variance. This is simply reading σ² and taking its square root to recover σ, not an extra distribution formula. A variance of thirty-six means standard deviation six. Do not divide by thirty-six. Always identify which quantity the question supplies.');

  add('正規分布の密度',math(String.raw`f(x)=\frac{1}{\sqrt{2\pi\sigma^2}}\exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)`),'hero-math long',[92],
    '教科書p.122にある密度です。今日はこの式に数を入れて積分することはしません。平均と分散が変わると曲線が変わること、そして毎回積分する代わりに標準化して一つの表を使うことへつなげます。',
    'This density appears on textbook page 122. We will not evaluate its integral by hand. It explains why mean and variance determine the curve, and motivates standardizing so a single table can replace repeated integration.');
  keep(95,'毎回あの密度を積分する代わりに、中心を0、標準偏差を1にそろえます。平均との差を標準偏差で割ると「中心から何個ぶん？」という位置になります。もとが正規なら、Zは標準正規分布です。','Instead of integrating each normal density afresh, put its centre at zero and its standard deviation at one. The formula measures distance from the mean in standard deviation units. Normal X gives standard normal Z.');
  paired('60点は、標準偏差1個ぶん上',[String.raw`z=\frac{x-\mu}{\sigma}`,String.raw`z=\frac{60-50}{10}=1`],figure(106),`仮定：平均50点、標準偏差10点の正規分布。\n\n${options.tryIt('normal')}`,[98,99,100,101,102,103,104,105,106,107,108],
    '授業用に平均50、標準偏差10の正規モデルを考えます。60点を標準化するとz=1。これは100％ではなく、標準偏差一つぶん上という位置です。平均や標準偏差を変えて、同じ60点を比べてみよう。',
    'For a hypothetical normal score model with mean fifty and standard deviation ten, a score of sixty gives z = 1. That describes location, not 100 percent probability. Explore how the same score changes meaning under different parameters.');
  practice('①','ロボットの身長をzに直す','正規分布を仮定。平均160cm、分散49cm²。','標準偏差は？ 身長146cmと167cmを、それぞれzに直すと？',[95],
    '最初は表を使いません。分散と標準偏差を区別し、二つの身長を標準化してください。平均より上か下かも、符号と対応させて考えよう。この問題は練習用で、ALのセルを埋める答えではありません。',
    'No table is needed yet. Distinguish variance from standard deviation and standardize the two heights. Connect the sign of z with being above or below the mean. These practice values are separate from the AL homework.');
  solution('①','標準偏差を出してから、標準化','平均160cm、分散49cm²、身長146cm・167cm。',zFormula,
    [String.raw`\sigma=\sqrt{49}=7`,String.raw`z_1=\frac{146-160}{7}=-2`,String.raw`z_2=\frac{167-160}{7}=1`],
    options.fig('practice-z-heights',{min:132,max:188,pdf:x=>Math.exp(-.5*((x-160)/7)**2)/(7*Math.sqrt(2*Math.PI)),lo:0,hi:0,mean:160,yMax:.08,ticks:[132,146,160,167,174,188],labels:[{x:146,text:'146cm: z = −2'},{x:167,text:'167cm: z = 1'}],title:'平均から標準偏差何個分、離れている？',xlabel:'身長（cm）'}),
    '146cmは平均より2個分下。167cmは1個分上。zは確率ではなく位置。',[95],
    '分散49の平方根を取って標準偏差7。146から160を引いて7で割ると−2、167なら1です。図で平均より左と右を確認しよう。zの値そのものを百分率にしないことが重要です。',
    'Take the square root of forty-nine to get standard deviation seven. Substituting the first height gives negative two; the second gives positive one. Match these positions to the chart. A z-score describes location, not a probability percentage.');
  keep(109);
  add('この表は、右側の面積',`${math(String.raw`\Pr(Z>z)`)}\n\n${figure(111)}\n\n${options.tableLink}`,'model-visual',[110,111,112],
    '使うのは上側確率の表です。zより右の色の面積を読みます。別の種類の表では意味が違うので、表の小さな図や説明を先に確認しよう。','Our table reports upper-tail probability: the shaded area to the right of z. Other tables use different conventions, so check the table’s diagram first.');
  keep(114,'z=1.96を探します。まず1.9の行。小数第1位までの部分で、行を決めてください。','Locate z = 1.96. First use 1.9 to choose the row. Keep your finger on that row.');
  keep(115);
  keep(116);
  paired('1.96より右は、2.5％',[formula(117)],figure(118),'',[117,118],
    '行1.9と列0.06の交点は0.02500。表の数字は右の尾の面積で、100を掛けると2.5％です。どこの確率か、図を指さして説明してみよう。',
    'Row 1.9 and column 0.06 meet at 0.02500. That is the right-tail area, or 2.5 percent. Point to the region your answer describes.');
  practice('②','行と列を、自分で探す','Zは標準正規分布に従う。z＝1.28。',String.raw`$\Pr(Z>1.28)$ は？ 行・列・表の値・百分率を書く。`,[114],
    '教科書の1.96と同じ手順を、別の値で試そう。どの行と列を使ったかも残してください。表が上側確率を示すことと、百分率への換算を忘れずに。まだ次の答え合わせを開かず、自分で表を探します。',
    'Repeat the textbook lookup procedure with a different z. Record the row and column as well as the probability. Confirm that this is an upper-tail table and convert the decimal to a percentage before revealing the next slide.');
  solution('②','1.2の行、0.08の列','標準正規分布、z＝1.28。',String.raw`\Pr(Z>z)`,
    [String.raw`1.28=1.2+0.08`,String.raw`\Pr(Z>1.28)=0.10027`,String.raw`0.10027\times100=10.027\%`],
    options.normal('practice-table-128',1.28,4,{title:'色の面積：1.28より右',labels:[{x:1.28,text:'1.28'}]}),
    '1.28より右の確率は約10.03％。',[114],
    '1.2の行を見つけ、0.08の列との交点を読みます。0.10027を百分率にすると10.027％。図の右の小さな面積が答えです。1.28をそのまま確率として読んだり、0.10027％と書いたりしないようにしよう。',
    'Use row 1.2 and column 0.08. Their intersection is 0.10027, which is 10.027 percent. The answer is the small right-tail area on the chart. Do not interpret 1.28 as a probability or label the decimal probability as a percentage without multiplying by one hundred.');
  paired('−1.96より左も、2.5％',[formula(121)],figure(120),'左右対称なので、同じ距離の尾は同じ面積。',[119,120,121],
    'マイナス1.96より左なら、左右対称を使います。右の1.96より先と同じ面積なので2.5％。マイナスの位置でも、確率がマイナスにはなりません。',
    'Use symmetry for the region below negative 1.96. It matches the right tail above positive 1.96, so its probability is also 2.5 percent.');
  practice('③','マイナスのzなら、どちら側？','Zは標準正規分布に従う。',String.raw`$\Pr(Z<-0.84)$ を求め、曲線に求める部分を塗る。`,[121],
    '負のzが出たときは、確率まで負になるわけではありません。左右対称を利用し、表のどこを読めばよいか考えてください。まず欲しい左側の面積を図に塗ってから、表を使おう。',
    'A negative z does not produce negative probability. Use symmetry to decide which positive-z table entry is relevant. Shade the requested left-hand region first, then look up the corresponding entry.');
  solution('③','左右対称を使う','標準正規分布、境界は−0.84。',String.raw`\Pr(Z<-z)=\Pr(Z>z)`,
    [String.raw`\Pr(Z<-0.84)=\Pr(Z>0.84)`,String.raw`=0.20045=20.045\%`],
    options.normal('practice-negative-084',-4,-.84,{title:'色の面積：−0.84より左',labels:[{x:-.84,text:'−0.84'}]}),
    '0.8の行・0.04の列。約20.05％。',[121],
    '教科書p.124の左右対称と同じ方法です。−0.84より左は、＋0.84より右と同じ。表の0.8行、0.04列で0.20045を読み、約20.05％になります。求める面積は平均0の左です。',
    'Apply the symmetry used on textbook page 124. The region below negative 0.84 matches the region above positive 0.84. Row 0.8 and column 0.04 give 0.20045, about 20.05 percent. The requested region lies left of zero.');
  paired('＋1.96より左は、97.5％',[formula(124),String.raw`\Pr(Z<1.96)=1-0.02500=97.5\%`],figure(126),'',[122,123,124,125,126],
    '今度はプラス1.96より左の全部。全体1から、小さい右の尾を引きます。答えが大きい確率になっていることを、図の色の広さでも確認しよう。',
    'For everything below positive 1.96, subtract the small right tail from 1. The large shaded region confirms why the answer is 97.5 percent.');
  practice('④','表の値が、そのまま答えになる？','Zは標準正規分布に従う。',String.raw`$\Pr(Z<1.35)$ を求める。表はどちら側の面積を示している？`,[124],
    '今度は正の境界より左を求めます。表から読める部分と、問題が求める部分は同じでしょうか？ 全体の面積が1であることを使って考えよう。答えは図の面積の広さとも照らし合わせます。',
    'This time the requested region lies below a positive boundary. Compare that region with the area reported by the table. Use total area one, and check whether your numerical answer matches the size of the region you shaded.');
  solution('④','全体1から、右の尾を引く','標準正規分布、境界は1.35。',String.raw`\Pr(Z<z)=1-\Pr(Z>z)`,
    [String.raw`\Pr(Z>1.35)=0.08851`,String.raw`\Pr(Z<1.35)=1-0.08851`,String.raw`=0.91149=91.149\%`],
    options.normal('practice-complement-135',-4,1.35,{title:'色の面積：1.35より左',labels:[{x:1.35,text:'1.35'}]}),
    '1.3の行・0.05の列。求める左側は約91.15％。',[124],
    '表の1.3行と0.05列で、まず右側0.08851を読みます。しかし欲しいのは左側なので1から引きます。0.91149、約91.15％。小さい尾の8.851％と、求める大きい面積を取り違えないようにしよう。',
    'First read the right-tail probability 0.08851 at row 1.3 and column 0.05. The question asks for the left side, so subtract from one. The result is 0.91149, about 91.15 percent. Distinguish the small omitted tail from the large requested area.');
  paired('真ん中は、両方の尾を引く',[formula(128),String.raw`1-2(0.15866)=0.68268\approx68.27\%`],figure(130),`教科書の丸め値では68.28％。\n\n${options.tryIt('table')}`,[127,128,129,130,131],
    '−1から＋1の中央は、左右の尾を二回引きます。この表なら約68.27％。教科書の丸め値で68.28％になるのは矛盾ではありません。やってみようで右、左、真ん中を切り替えてみよう。',
    'For the central interval from negative one to positive one, remove both tails. Our table gives about 68.27 percent. The textbook’s rounding gives 68.28 percent. Explore the different shaded regions.');
  practice('⑤','左右の幅が違う区間','Zは標準正規分布に従う。',String.raw`$\Pr(-0.50<Z<1.50)$ は？ 左右の尾を別々に求める。`,[128],
    '中央の区間でも、左右が対称とは限りません。今回は境界の距離が違います。同じ尾を2回引く方法が使えるかを考え、必要な二つの表の値を探してください。図を描くと引く場所が分かります。',
    'A central interval need not be symmetric. The two boundaries are different distances from zero. Decide whether subtracting the same tail twice would work, then find the two separate table values. Sketching the interval will show which areas to remove.',4);
  solution('⑤','異なる二つの尾を引く','標準正規分布、区間−0.50〜1.50。',String.raw`\Pr(a<Z<b)=F(b)-F(a)`,
    [String.raw`F(-0.50)=0.30854`,String.raw`F(1.50)=1-0.06681=0.93319`,String.raw`0.93319-0.30854=0.62465`,String.raw`=62.465\%`],
    options.normal('practice-asymmetric-interval',-.5,1.5,{title:'色の面積：−0.50から1.50まで',labels:[{x:-.5,text:'−0.50'},{x:1.5,text:'1.50'}]}),
    '約62.47％。同じ尾を2回引かない。',[128],
    '教科書p.122の累積の差とp.124〜125の左右対称・補集合を組み合わせます。左の尾は0.30854、右の尾は0.06681で異なる値です。1から両方を引くと0.62465。式では左側の累積を差し引く形でも同じです。約62.47％になります。',
    'Combine the interval difference on textbook page 122 with symmetry and complements on pages 124–125. The left tail is 0.30854 and the right tail is 0.06681, so they cannot be doubled as if equal. Subtracting both from one gives 0.62465, or about 62.47 percent. The displayed cumulative difference is equivalent.');
  add('チャレンジ⑥　70点以上は、何％？',sourceBody(132),'challenge',[132],
    '最後は元の単位の点数から始めます。分散から標準偏差を確認し、境界の点数を標準化し、求める面積を描いて表を読もう。この練習では途中式も必ず残し、ALに一人で取り組む準備をします。',
    'Finish by starting in the original score units. Identify the standard deviation from the variance, standardize the boundary, sketch the region, and read the table. Keep the intermediate steps as preparation for independent AL work.');
  mapping.at(-1).practiceFocus='z-scores-and-table';
  solution('⑥','元の点数から、上側確率へ','平均50点、分散100点²、境界70点。',zFormula,
    [String.raw`\sigma=\sqrt{100}=10,\quad z=\frac{70-50}{10}=2`,String.raw`\Pr(X\ge70)=\Pr(Z\ge2)`,String.raw`=0.02275=2.275\%`],
    figure(137),'表の2.0行・0.00列。70点以上は約2.28％。',[133],
    'まず与えられた分散100の平方根を取って標準偏差10。標準化の公式の文字を確認してから70、50、10を入れ、z=2です。表の2.0行・0.00列で0.02275を読むので2.275％。元の点数で欲しかった右側の面積と一致しているか確かめよう。',
    'Start from the givens: variance one hundred means standard deviation ten. Check the symbolic standardization rule, then insert seventy, fifty and ten to get z=2. Row 2.0 and column 0.00 give 0.02275, or 2.275 percent. Confirm that this is the right-hand region originally requested.');
  add('ここからは、ALに自分で取り組もう。',`標準偏差を確認。zに直す。表を読み、面積を選ぶ。\n\n[ALワークシートを開く](https://yohman.github.io/26-2-StatsB/viewer.html?p&file=assets%2Fworksheet-previews%2Fw05%2Findex.html&title=AL&week=W05&source=weeks%2F05-continuous-distributions-i%2F05_AL用ワークシート.xlsx)\n\n${options.tableLink}\n\n各セルの答えは示しません。`,'statement',[143,144],
    '欲しい確率がどの面積なのかを、最初に描いてください。ここからはALに自分で取り組みます。各セルの答えは示しません。何が与えられ、何を求めるのかを整理しよう。',
    'Begin by sketching the probability region you need. Now work independently on the AL worksheet. Individual cell answers are not supplied. Identify the givens and what each question asks.');
  if(slides.length!==57)throw Error(`Expected 57 focused slides, got ${slides.length}`);
  slides.forEach((slide,i)=>{
    const keys=mapping[i].termKeys;
    mapping[i].terms=keys.map(key=>({ja:glossary[key][0],en:glossary[key][1]}));
    if(keys.length)slides[i]=annotateJapaneseTerms(slide).replace(/<!-- _class: (.*?) -->/,'<!-- _class: $1 has-stat-terms -->')+'\n\n'+terminology(keys);
  });
  return {slides,mapping,notes:{version:1,deck:'materials/2026-yoh/week05/w5.pdf',slides:narration}};
}

export const compactStyle=storyStyle.replace('</style>',`
section.robot-height-answer .worked-copy .katex-display{font-size:23px;margin:18px 0}section.robot-height-answer .given{font-size:22px;margin:0 0 12px}section.robot-height-answer .lookup-note{font-size:20px;line-height:1.6;margin:8px 0}section.robot-height-answer .worked-visual img{height:290px}
section.queue-story img{object-position:center center}section.race-media.queue-history,section.race-media.queue-bowl{background:#fff}section.race-media.queue-history img,section.race-media.queue-portrait img,section.race-media.queue-bowl img{object-fit:contain}section.queue-model p{margin:5px 0}section.queue-model small{font-size:19px;color:#687b84}section.model-visual.queue-model.has-stat-terms img{height:260px}section.queue-model>p:last-of-type{position:absolute;bottom:120px;left:65px;right:65px}
section.race-media{padding:0;background:#000;display:block}section.race-media h2,section.race-media footer,section.race-media::after{display:none}section.race-media .media-link{position:absolute;inset:0;display:block}section.race-media img{position:absolute;inset:0;width:1280px;height:720px;max-width:none;max-height:none;object-fit:cover}section.race-finish img{object-position:center 64%}section.race-scan img{object-position:center 43%}section.race-media .media-action{position:absolute;bottom:38px;left:45px;padding:12px 20px;background:#000c;color:white;border-radius:6px;font-size:25px;font-weight:700}section.race-media .media-credit{position:absolute;right:18px;bottom:10px;font-size:14px;color:white;background:#000b;padding:3px 8px}
section.watch-bridge{background:#ede5da;padding:0;display:block}section.watch-bridge h2{display:none}section.watch-bridge .watch-photo{position:absolute;left:95px;top:50px;width:535px;height:585px;object-fit:contain;max-height:none}section.watch-bridge .watch-invitation{position:absolute;left:710px;top:150px;width:510px}section.watch-bridge h3{font-size:49px;line-height:1.5;margin:0 0 20px}section.watch-bridge .watch-invitation p{font-size:35px;margin:0 0 32px}section.watch-bridge a{display:inline-block;background:#a51c30;color:white;text-decoration:none;font-size:30px;padding:14px 25px;border-radius:7px;font-weight:700}section.watch-bridge small{display:block;font-size:16px;color:#756d61;margin-top:30px;line-height:1.6}
section.explain{font-size:30px}section.explain h2{font-size:43px}section.explain .katex-display{font-size:43px}section.explain p{margin:24px 0}
section.precision img{height:160px}section.precision .katex-display{font-size:54px}section.precision p{font-size:30px;margin:16px 0}
section.calculation .katex-display{font-size:43px;margin:32px 0}section.calculation h2{font-size:43px}section.calculation.answer{background:#edf5ef}
section.model-visual{padding:36px 65px 45px}section.model-visual h2{font-size:41px;margin-bottom:10px}section.model-visual p{font-size:25px;margin:10px 0}section.model-visual .katex-display{font-size:34px;margin:8px 0}section.model-visual img{height:355px;width:1030px;object-fit:contain}
section.robot-example small,section.worked small{font-size:17px;color:#687b84}section.model-visual.robot-example.has-stat-terms img{height:270px}section.robot-example p{margin:7px 0}section.robot-example .katex-display{font-size:30px;margin:6px 0}
section.visual-link{padding:34px 60px 45px}section.visual-link h2{font-size:43px;margin-bottom:8px}section.visual-link img{height:440px;width:1030px;object-fit:contain}section.visual-link p{font-size:25px;margin:8px 0}
section.worked{display:grid;grid-template-columns:1.1fr 1fr;grid-template-rows:auto 1fr auto;gap:14px 26px;padding:45px 55px 55px;text-align:left;align-content:center;align-items:center}section.worked h2{grid-column:1/-1;font-size:43px;margin:0 0 8px}section.worked .worked-copy{min-width:0}section.worked .worked-copy .katex-display{font-size:27px;text-align:left;margin:26px 0}section.worked .worked-visual{min-width:0}section.worked img{width:100%;height:320px;object-fit:contain}section.worked>p{grid-column:1/-1;font-size:22px;margin:0}section.worked .worked-visual p{margin:0}
section.worked a,section.visual-link a,section.model-visual a{display:inline-block;background:#176d82;color:white;text-decoration:none;border-radius:7px;padding:8px 19px;font-size:23px;font-weight:700}section.model-visual a{font-size:21px;padding:7px 17px}
section .formula-ref{position:absolute;top:13px;right:32px;max-width:1170px;font-size:17px;color:#176d82;font-weight:500;line-height:1.25}section.practice-answer{padding-top:65px}section.practice-answer .given{font-size:21px;line-height:1.6;margin:0 0 12px}section.practice-answer .step-label{font-size:18px;color:#176d82;margin:6px 0}section.practice-answer .worked-copy .katex-display{font-size:22px;margin:12px 0}section.practice-answer .worked-copy{align-self:center}section .book-note{font-size:19px;color:#176d82}section.queue-model .book-note{color:#176d82}section.practice-answer .katex-display>.katex{text-align:left}
${terminologyStyle}
</style>`);
