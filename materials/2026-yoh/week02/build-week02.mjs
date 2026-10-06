import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const sourceDirectory = resolve(here, '../../../other material/2025 yoh/05 確率分布_1_離散確率分布 二項分布');
const source = readFileSync(resolve(sourceDirectory, 'w5.md'), 'utf8');
const styleEnd = source.indexOf('</style>') + '</style>'.length;
if (styleEnd < 8) throw new Error('Yoh source style was not found');

const preface = source.slice(0, styleEnd);
const sections = source.slice(styleEnd).split(/(?=^#{1,3}(?:\s|$))/m)
  .filter(part => /^#{1,3}(?:\s|$)/.test(part));
if (sections.length !== 46) throw new Error(`Expected 46 source sections; found ${sections.length}`);

const sourceAssetBase = '../../../other material/2025 yoh/05 確率分布_1_離散確率分布 二項分布/';
function fromYoh(number) {
  let slide = sections[number - 1].trim();
  slide = slide.replace(/!\[([^\]]*)\]\((?:<)?([^)>]+)(?:>)?\)/g, (match, alt, path) => {
    if (/^(?:https?:|data:)/.test(path)) return match;
    return `![${alt}](<${sourceAssetBase}${path}>)`;
  });
  if (number === 21) slide = slide.replace('role a dice', 'roll a die');
  if (number === 27) slide = slide.replace('n回の試行からk回の成功', 'n回の試行からx回の成功');
  for (const tag of ['xxl','large','center']) {
    const opens = (slide.match(new RegExp(`<${tag}>`, 'g')) || []).length;
    const closes = (slide.match(new RegExp(`</${tag}>`, 'g')) || []).length;
    if (opens > closes) slide += `\n${`</${tag}>`.repeat(opens - closes)}`;
  }
  return `<!-- Yoh 2025 source PDF slide ${number}; original w5.md section ${number} -->\n${slide}`;
}

const newSlide = (sourcePage, markdown) => `<!-- Adapted from Tsumura 2026 Week 2 slide ${sourcePage}; new editable teaching slide -->\n${markdown.trim().replaceAll(String.raw`\n`, String.fromCharCode(10))}`;
const textbookSlide = (printedPage, markdown) => `<!-- Adapted from textbook 2-2 Probability Distributions, printed p.${printedPage}; new editable teaching slide -->\n${markdown.trim().replaceAll(String.raw`\n`, String.fromCharCode(10))}`;
const slides = [
  `# 統計学B\n\n<large>第2週　確率分布</large>\n\n離散確率分布と二項分布`,
  fromYoh(2),
  fromYoh(6),
  fromYoh(9),
  fromYoh(10),
  fromYoh(11),
  fromYoh(12),
  `## 5.26% は「1回あたり」の平均損失\n\n100円を1回賭けると、期待損失は **5.26円**。\n\n100円を100回賭けると、合計1万円に対する期待損失は **526円**。\n\n<small>米国式ルーレットの赤・黒への等額の賭けを想定。</small>`,
  newSlide(4, String.raw`## 確率変数 $X$\n\nサイコロを振る前、出る目はまだ分かりません。\n\n$X$ = 出た目　　$X\in\{1,2,3,4,5,6\}$\n\n出たあとに観測した値を $x$ と書きます。`),
  fromYoh(20),
  fromYoh(21),
  fromYoh(22),
  fromYoh(23),
  newSlide(6, String.raw`## 100円のくじ、買う？\n\n<!-- _class: lottery-example -->\n\n$X$ = 賞金（円）。0円：70% ／ 100円：25% ／ 1,000円：5%。\n\n$$\begin{aligned}E(X)&=\sum_x x\Pr(X=x)\\&=0\Pr(X=0)+100\Pr(X=100)+1000\Pr(X=1000)\\&=0\times0.70+100\times0.25+1000\times0.05=75\text{ 円}\end{aligned}$$\n\n<div class="lottery-results"><div class="lottery-prize"><div class="lottery-result-label">もらう賞金の平均（期待値）</div><div class="lottery-result-number">75<span>円</span></div><div class="lottery-result-detail">何度も引いたときの平均賞金</div></div><div class="lottery-loss"><div class="lottery-result-label">代金100円を引いた平均損益</div><div class="lottery-result-number">−25<span>円</span></div><div class="lottery-result-detail">75円 − 100円 = −25円</div></div></div>\n\n<div class="lottery-takeaway">1枚あたり、平均 <strong>25円の損</strong>。毎回25円失うわけではありません。</div>`),
  newSlide(10, String.raw`## 賞金の「地図」が確率分布\n\n$X$ = くじの賞金。取りうる値は **0円、100円、1,000円**。\n\n$Pr(X=0)=0.70\qquad Pr(X=100)=0.25\qquad Pr(X=1000)=0.05$\n\n<large>$0.70+0.25+0.05=1$</large>\n\n値とその確率を並べたものが、確率分布です。`),
  newSlide(11, String.raw`## ロボット工場の検品\n\n5台のロボットを検品。$X$ = 不良品の台数。\n\n<large>$X\in\{0,1,2,3,4,5\}$</large>\n\n「2台が不良」のように、**数えられる値**を取るので離散確率分布。\n\n<small>問い：5台のうち、2台が不良になる確率をどう数える？</small>`),
  newSlide(12, String.raw`## 台数か、動いた時間か\n\n**離散**：5台のうち壊れたロボットは何台？　$0,1,2,3,4,5$\n\n**連続**：1台のバッテリーは何時間動く？　$2.1,2.13,2.137,\ldots$\n\n<large>台数は数える。時間は測る。</large>\n\n<small>今日は「何回起きた？」という離散の問いに進みます。</small>`),
  newSlide(14, String.raw`## 同じロボットでも、問いが違う\n\n**ベルヌーイ**：この1台は動く？　成功か失敗か。\n\n**二項**：同じ条件で5台試すと、何台動く？\n\n**ポアソン**：修理センターに1時間で何件の依頼が来る？\n\n<small>何を数えるか、どんな条件かで分布を選びます。</small>`),
  newSlide(15, String.raw`## 最初の成功まで待つと？\n\n**幾何**：動くロボットが初めて出るのは何台目？\n\n**負の二項**：3台の動くロボットがそろうまで、不良品は何台？\n\n<large>成功の数？　成功までの待ち？</large>\n\n<small>今日は問いの違いだけ。計算の中心は二項分布です。</small>`),
  newSlide(14, String.raw`## ロボットとヤギを5つ並べる\n\n1回ごとに、ロボット 🤖 かヤギ 🐐 がそれぞれ50%で独立に出る。\n\n<large>🤖　🐐　🤖　🐐　🐐</large>\n\n$X$ = 5回中に出たロボットの数。これは二項分布？\n\n<small>5回と決まっている／結果は2種類／独立／毎回同じ確率なら、Yes。</small>\n\n2体のロボットは何通り？　講義ページの「やってみる」で探そう。`),
  fromYoh(24),
  fromYoh(25),
  fromYoh(26),
  fromYoh(27),
  fromYoh(28),
  fromYoh(29),
  fromYoh(32),
  fromYoh(33),
  fromYoh(34),
  fromYoh(35),
  fromYoh(36),
  textbookSlide('118–119', String.raw`## 5打席で、ちょうど3安打\n\n1打席の安打確率を $\pi=0.32$ とし、5打席が独立だと仮定。\n\n<large>安　安　安　凡　凡</large>\n\nこの**特定の順序**になる確率は $0.32^3\times0.68^2$。\n\n3安打を達成する順序は、これだけではありません。`),
  textbookSlide('119–120', String.raw`## 3安打になる順序は10通り\n\n<large>$\binom{5}{3}=\frac{5!}{3!\,2!}=10$</large>\n\n$Pr(X=3)=\binom{5}{3}(0.32)^3(0.68)^2\approx0.151519$\n\n5打席で3安打になる確率は **約15.2%**。\n\n<small>$X\sim B(5,0.32)$ は「5回試して成功回数を数える二項分布」。</small>`),
  textbookSlide('120', String.raw`## 5打席の平均とばらつき\n\n<large>$E(X)=n\pi=5\times0.32=1.6$ 安打</large>\n\n$Var(X)=n\pi(1-\pi)=5\times0.32\times0.68=1.088$ 安打$^2$\n\n1.6安打は、5打席のセットを何度も繰り返したときの平均。\n\n<small>1回の試合で「1.6安打」という結果が出るわけではありません。</small>`),
  textbookSlide('120, 130', String.raw`## まれな不良品を数える\n\n1000個の製品で、1個ごとの不良率が0.2%なら、平均不良数は $\lambda=1000\times0.002=2$。\n\n$Pr(X=x)\approx\dfrac{e^{-\lambda}\lambda^x}{x!}$\n\n<large>$Pr(X=0)\approx e^{-2}=0.1353$</large>\n\n<small>不良品ゼロのロットは約13.5%。ポアソン分布では $E(X)=Var(X)=\lambda$。</small>`),
];

// Follow the textbook's six numbered subsections inside Chapter 2, Section 2.
// Keep the source slides editable and retain Yoh's image-led examples.
const activityOrder = ['lottery', 'roulette', 'al-discrete', 'discrete', 'probability', 'combinations', 'batting', 'al-continuous', 'normal-w2'];
const activity = (id, label, week = 2) => {
  const aliases = {dice:'lottery',delivery:'lottery','class-pairs':'lottery','t-w2':'normal-w2','chi-w2':'normal-w2'};
  const number = activityOrder.indexOf(aliases[id] || id) + 1;
  const title = week === 2 && number ? `${String(number).padStart(2, '0')} ${label.replace(/^\d{2} /, '')}` : label;
  return `[${title}](https://yohman.github.io/26-2-StatsB/agenda.html?activity=${id}#week-${String(week).padStart(2, '0')})`;
};
const divider = (number, title, pages, question) => `## 教科書　第2章・第2節　確率分布\n\n<!-- _class: book-divider -->\n<!-- _footer: 2-${number} ${title} ／ 教科書 p.${pages} -->\n\n<div class="book-heading"><span class="book-number">2-${number}</span><span>${title}</span></div>\n\n<div class="book-page">教科書 p.${pages}</div>\n\n${question}`;
const demoExamples = {
  lottery: {title:'くじの賞金と、払ったお金',sample:'結果の例：0円　100円　0円　1,000円　0円',math:String.raw`E(X)=0(0.70)+100(0.25)+1000(0.05)=75\text{ 円}`,reading:'この5枚の賞金平均は220円。繰り返すと青い平均線は75円に近づく傾向。100円の代金を引くと、期待損益は−25円／枚。'},
  dice: {title:'サイコロの出目と、その平均',sample:'結果の例：2　6　1　3　　この4回の平均は3',math:String.raw`E(X)=1\frac16+2\frac16+\cdots+6\frac16=3.5`,reading:'1回の結果xは整数。青い線は、それまでの出目の平均。3.5の目がなくても、平均は3.5に近づく。'},
  coin: {title:'コインの表は、毎回50%？',sample:'5回の例：🤖　🐐　🐐　🤖　🐐　　表は2回',math:String.raw`\text{実測の表の割合}=\frac25=40\%\qquad\Pr(\text{表})=50\%`,reading:'少ない回数では50%から離れることもある。横軸は投げた回数、縦軸はその時点までの表の割合。'},
  roulette: {title:'ルーレットの1回と、長い平均',sample:'赤に100円：赤なら＋100円 ／ 黒・0・00なら−100円',math:String.raw`E(X)=100\frac{18}{38}-100\frac{20}{38}\approx-5.26\text{ 円}`,reading:'単発では勝つこともある。グラフの累積損益と、1回あたりの平均を区別しよう。100円の賭け金に対して、平均損失は約5.26%。'},
  discrete: {title:'数える値と、測る値',sample:'数える：5回中の表は0〜5回 ／ 測る：身長は170.1、170.12…cm',math:String.raw`\Pr(X=2)={}_5C_2(0.5)^5=\frac{10}{32}=31.25\%`,reading:'左の棒1本は「ちょうど2回」の確率。右の曲線では、区間の面積が確率。スライダーを0幅にすると、1点の確率は0。'},
  probability: {title:'何を数えるかで、分布が変わる',sample:'1回の成功？ ／ 5回中の成功数？ ／ 1分間の発生数？',math:String.raw`\begin{aligned}\text{ベルヌーイ}:&\quad \Pr(X=1)=p\\\text{二項}:&\quad \Pr(X=x)={}_nC_xp^x(1-p)^{n-x}\\\text{ポアソン}:&\quad\Pr(X=x)=e^{-\lambda}\lambda^x/x!\end{aligned}`,reading:'条件を決めると、理論の棒の高さが決まる。1,000回試した実測の棒と比べよう。'},
  poisson: {title:'平均2件でも、0件の日がある',sample:'1分間の発生数の例：0件　3件　1件　2件　4件',math:String.raw`\lambda=2\qquad\Pr(X=0)=\frac{e^{-2}2^0}{0!}\approx13.53\%`,reading:'λは平均発生数。毎回2件とは限らない。ポアソンのタブでλ=2を選び、0件の実測の棒と理論値を比べよう。'},
  combinations: {title:'ロボット2体は、どこに並ぶ？',sample:'並びの例：🤖🤖🐐🐐🐐　　🤖🐐🤖🐐🐐　　🐐🐐🐐🤖🤖',math:String.raw`{}_5C_2=\frac{5!}{2!\,3!}=\frac{5\times4}{2\times1}=10`,reading:'これは10通りのうち3通り。ロボットの位置を変えて新しい並びを保存。nやxを変えると、公式と並びの数が一緒に変わる。'},
  'class-pairs': {title:'22人から、2人の組を作る',sample:'1番と2番 ／ 2番と1番　　この2つは同じ1組',math:String.raw`{}_{22}C_2=\frac{22!}{2!\,20!}=\frac{22\times21}{2}=231`,reading:'最初の人を22通り、次の人を21通りで選ぶ。逆順の重複を2で割る。実際に2人をクリックして、組の記録を増やそう。'},
  batting: {title:'5打席で3安打になる確率',sample:'安・安・安・凡・凡　　安・凡・安・凡・安　　順序が違っても3安打',math:String.raw`\Pr(X=3)=\underbrace{{}_5C_3}_{10\text{ 通り}}\underbrace{(0.32)^3(0.68)^2}_{1\text{ 通りの確率}}\approx15.15\%`,reading:'1試合は5打席のセット。1,000試合繰り返すと、3安打の棒が理論値に近づく傾向。1打席の打率32%と、3安打の確率を区別しよう。'},
  'al-discrete': {title:'AL：値と確率を、1行ずつ掛ける',sample:'値x：−1、0、1、2、3、4　　確率：1/4、1/12、1/6、1/12、1/12、1/3',math:String.raw`E(X)=-\frac14+0+\frac16+\frac16+\frac14+\frac43=\frac53`,reading:'12枚のくじは確率の図。値4のくじは4枚なので、確率は4/12。行をクリックすると「値×確率」の寄与が見える。'},
  'al-continuous': {title:'AL：長方形を足すと、積分になる',sample:'同じ区間0〜√2でも、f(x)=x と x f(x)=x² は違う面積',math:String.raw`\int_0^{\sqrt2}x\,dx=1\qquad E(X)=\int_0^{\sqrt2}x^2\,dx=\frac{2\sqrt2}{3}`,reading:'左の面積は確率の合計1。右は値で重みをつけた面積で、平均は約0.9428。分割を細かくして、足し算を積分に近づけよう。'},
  'normal-w2': {title:'正規分布の中心と幅',sample:'μ=60、σ=10なら、平均±2σは40〜80',math:String.raw`X\sim N(60,10^2)\qquad\Pr(40\le X\le80)\approx95.45\%`,reading:'μを動かすと曲線の中心が動く。σを大きくすると広がる。曲線の下の面積と、生成したデータの割合を比べよう。'},
  't-w2': {title:'小さい標本で、平均を調べる',sample:'標本サイズn=3なら自由度2 ／ n=30なら自由度29',math:String.raw`T=\frac{\bar X-\mu}{s/\sqrt n}\qquad\mathrm{df}=n-1`,reading:'毎回、正規母集団から標本を取り、t値を計算。小標本ではsの推定が不安定なので裾が厚い。nを増やすと標準正規の曲線に近づく。'},
  'chi-w2': {title:'ばらつきを、二乗して足す',sample:'同じ正規母集団から標本を取り、標本ごとの分散s²を調べる',math:String.raw`\chi^2=\frac{(n-1)s^2}{\sigma^2}\qquad\mathrm{df}=n-1`,reading:'値は0以上。少ない自由度では、右側に長い裾が見える。nを変え、1,000回の実測と理論の曲線を比べよう。'},
  delivery: {title:'同じ平均でも、安心感は違う',sample:'ロボットA：10、10、10…分 ／ B：2分か18分が半々',math:String.raw`E(B)=\frac{2+18}{2}=10\qquad\mathrm{Var}(B)=\frac{(2-10)^2+(18-10)^2}{2}=64`,reading:'Aの分散は0、Bは64分²。Bの平均線は10分に近づいても、1回の配達は2分か18分。平均とばらつきは別の情報。'}
};
const demo = (links, question) => {
  let id = links[0].match(/activity=([^#]+)/)[1];
  if (id==='probability' && question.startsWith('ポアソンを')) id='poisson';
  let d=demoExamples[id];
  if(id==='dice' && question.startsWith('サイコロを1回')) d={title:'振る前のX、振ったあとのx',sample:'振る前：1〜6のどれか ／ 振ったあとの例：4',math:String.raw`X\in\{1,2,3,4,5,6\}\qquad x=4`,reading:'「1回試す」を押すと、候補から1つの目が決まる。表の実測列に今回の結果が加わる。次に振る前は、またXの値が分からない。'};
  if(id==='lottery' && question.startsWith('くじを1,000回引く')) d={title:'賞金の頻度が、確率分布を形づくる',sample:'賞金：0円 ／ 100円 ／ 1,000円　　理論の確率：70% ／ 25% ／ 5%',math:String.raw`\Pr(X=0)+\Pr(X=100)+\Pr(X=1000)=0.70+0.25+0.05=1`,reading:'実測列は「その賞金の回数÷引いた枚数」。回数を増やすと、それぞれの割合が理論の確率に近づく傾向がある。'};
  if(id==='discrete' && question.startsWith('台数は')) d={title:'連続の確率は、区間の面積',sample:'身長モデル：平均170cm、標準偏差6cm　　164〜176cmの区間',math:String.raw`\Pr(164\le X\le176)=\Pr(-1\le Z\le1)\approx68.27\%`,reading:'右のスライダーで塗る範囲を広げると、面積も確率も増える。範囲を1点に縮めると確率0。左の棒1本の確率と比べよう。'};
  if (id==='batting' && question.includes('平均1.6')) d={title:'5打席の平均とばらつき',sample:'1試合の安打数は0〜5の整数。1.6安打という1試合はない。',math:String.raw`E(X)=5(0.32)=1.6\qquad\mathrm{Var}(X)=5(0.32)(0.68)=1.088`,reading:'5打席セットを繰り返し、各安打数の実測の棒を作る。分布の中心を平均、中心からの広がりを分散で表す。'};
  if (!d) throw new Error(`Missing simulation explanation: ${id}`);
  const names={lottery:'くじ',dice:'サイコロ',roulette:'ルーレット','al-discrete':'AL期待値',discrete:'離散と連続',combinations:'並び方',batting:'打率',probability:'分布','al-continuous':'AL積分','normal-w2':'正規','t-w2':'t','chi-w2':'カイ二乗',delivery:'配達',coin:'コイン','class-pairs':'2人の組'};
  return `## やってみる：${d.title}\n\n<!-- _class: simulation-guide -->\n\n<div class="demo-example">${d.sample}</div>\n\n$$${d.math}$$\n\n${d.reading}\n\n<div class="demo-task">${question.replace('{}'+ '_nC_x', '$'+ '{}_nC_x' +'$')}</div>\n\n${links.map(link=>link.replace(/\[[^\]]+\]/, `[やってみよう！${links.length===1?'':'（'+names[link.match(/activity=([^#]+)/)[1]]+'）'}]`)).join('　')}\n\n<!-- 数列は説明用の例。確率・期待値は理論値。ライブの実測値は試行ごとに変わります。 -->`;
};
const select = (...numbers) => numbers.map(n => slides[n - 1]);
const blocks = [
  {n:1,title:'確率変数',pages:'117',question:'何が起きるか分からない。その結果を、数で表す。',body:[
    `## くじの賞金を $X$ とする\n\nまだ開いていないくじ。賞金はいくら？\n\n<large>$X\\in\\{0,100,1000\\}$</large>\n\n偶然の結果によって値が決まる「賞金の額」が確率変数 $X$。\n\n<small>$x$ は具体的な値。$Pr(X=100)$ は「賞金が100円になる確率」。</small>`,
    ...select(9),
    `## 5回投げて、ロボットは何回？\n\n<large>🤖 表（ロボット）　🐐 裏（ヤギ）</large>\n\n$X$ = 5回中の表（ロボット）の回数。\n\n<large>$X\\in\\{0,1,2,3,4,5\\}$</large>\n\n0回も、取りうる結果に含めます。`,
    demo([activity('coin','コイン投げを開く',1)],'投げる前に、$X$ が取りうる値を挙げてみよう。')
  ]},
  {n:2,title:'期待値',pages:'117',question:'同じことを何度も繰り返すと、平均はいくら？',body:[
    ...select(10,11,12,13),
    `## 起こりやすさで重みをつける\n\n<large>$E(X)=\\sum_x x\\Pr(X=x)$</large>\n\n「結果の値 × その結果の確率」を、全部足す。\n\nサイコロは、どの目も確率 $1/6$。くじは、賞金ごとに確率が違う。`,
    ...select(2,3),
    `## 赤に100円賭けると\n\n赤18個なら利益100円。黒18個と緑2個なら損失100円。\n\n$E(X)=(+100)\\frac{18}{38}+(-100)\\frac{20}{38}$\n\n<large>$E(X)\\approx-5.26$ 円</large>\n\n<small>米国式ルーレット。賞金ではなく、賭け金を差し引いた利益を $X$ とします。</small>`,
    slides[4].replace('Why does the house always win?', 'Why does the house have an advantage?'),
    ...select(7,8),
    `## 期待値と、実際の結果\n\n1回の結果は +100円か −100円。期待値は −5.26円。\n\n100回なら、期待損益は約 −526円。\n\n<large>勝って終わることもあります。</large>\n\n<small>回数を増やすと、賭け金あたりの平均損益は −5.26%に近づく傾向があります。</small>`,
    demo([activity('roulette','01 ルーレット'),activity('al-discrete','06 AL：期待値')],'1回の結果と、長く繰り返したときの平均を比べよう。')
  ]},
  {n:3,title:'確率分布',pages:'118',question:'何が起きる？ それぞれ、どれくらい起こりやすい？',body:[
    ...select(15,16,17),
    demo([activity('discrete','04 離散と連続')],'台数は数える。時間は測る。グラフの違いを確かめよう。')
  ]},
  {n:4,title:'離散確率分布',pages:'118–120',question:'決めた回数の成功と、まれな出来事を数える。',body:[
    ...select(18,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35),
    demo([activity('combinations','02 ロボットの並び'),activity('batting','03 打率'),activity('probability','05 確率分布')],'並び方を数え、二項分布の公式に結びつけよう。ポアソン分布との違いも比べよう。')
  ]},
  {n:5,title:'連続確率分布',pages:'121–128',question:'時間や長さの確率は、曲線の下の面積で考える。',body:[
    `## バッテリーが4〜6時間もつ確率\n\n<large>$\\Pr(4\\le X\\le6)=\\int_4^6 f(x)\\,dx$</large>\n\n曲線の高さは確率密度。4〜6の間の面積が確率。\n\n全体の面積は1。連続分布では、1つの点の確率は0。`,
    `## 正規分布\n\nロボット部品の長さが、中心のまわりに左右対称にばらつくモデル。\n\n<large>$X\\sim N(\\mu,\\sigma^2)$</large>\n\n平均 $\\mu$ が中心、標準偏差 $\\sigma$ が幅を決めます。\n\n<small>教科書 p.122–124。標本平均と標準化は第5週で詳しく扱います。</small>`,
    `## $t$ 分布とカイ二乗分布\n\n**$t$ 分布**：母分散が未知のとき、標本から平均を調べる。\n\n$T=\\dfrac{\\bar X-\\mu}{s/\\sqrt n}$　自由度 $n-1$\n\n**カイ二乗分布**：標準化した値の二乗和。分散を調べるときに使う。\n\n<small>正規母集団からの独立な標本を想定。教科書 p.125–128。第6週で詳しく扱います。</small>`,
    demo([activity('al-continuous','AL：2つの積分')],'密度の面積は1。値を掛けた面積は平均。この違いを確かめよう。')
  ]},
  {n:6,title:'確率分布の平均値と分散',pages:'129',question:'分布の中心と、そこからのばらつきを求める。',body:[
    `## 同じ平均、違う待ち時間\n\n配達ロボットA：いつも10分。\n\n配達ロボットB：半分は2分、半分は18分。\n\n<large>どちらも平均10分。</large>\n\n授業前に頼むなら、どちらが安心？`,
    `## 離散分布の平均と分散\n\n$\\mu=E(X)=\\sum_x x\\Pr(X=x)$\n\n$\\sigma^2=\\sum_x(x-\\mu)^2\\Pr(X=x)$\n\n平均は「値 × 確率」の合計。\n分散は「平均からの距離の二乗 × 確率」の合計。`,
    `## 連続分布でも、重みをつけて足す\n\n$\\mu=\\int_{-\\infty}^{+\\infty}xf(x)\\,dx$\n\n$\\sigma^2=\\int_{-\\infty}^{+\\infty}(x-\\mu)^2f(x)\\,dx$\n\n<large>$\\int f(x)\\,dx=1$ は確率の合計。</large>\n\n$\\int xf(x)\\,dx$ は平均。同じ面積計算でも、足すものが違います。`,
    `## ALワークシートで確かめる\n\n**離散**：各行の $x_i\\Pr(X=x_i)$ を足すと $5/3\\approx1.6667$。\n\n**連続**：$f(x)=x$、$0\\le x\\le\\sqrt2$。\n\n$\\int_0^{\\sqrt2}f(x)\\,dx=1$\n\n$E(X)=\\int_0^{\\sqrt2}xf(x)\\,dx=\\dfrac{2\\sqrt2}{3}\\approx0.9428$`,
    demo([activity('al-discrete','06 AL：期待値'),activity('al-continuous','07 AL：2つの積分')],'各項を確認して、ワークシートのセルを埋めよう。')
  ]}
];
const lotteryOpening = `## 100円のくじ、買う？\n\n<!-- _class: lottery-opening -->\n<!-- _footer: 統計学B 第2週 ／ 教科書 第2章 第2節 p.117–129 -->\n\n![bg left:30% fit](images/kuji-ticket.png)\n\n1枚 **100円**。<br>まだ開いていないくじを、手に持っています。\n\n<large>0円　／　100円　／　1,000円</large>\n\n賞金の確率は、順に **70%　／　25%　／　5%**。\n\n買う？ 買わない？ その理由は？\n\n<!-- Lottery-ticket illustration generated with OpenAI image generation. -->`;
// Each concrete example gets a nearby implementation, rather than a distant list of links.
// Drop section-end link lists now that each example has its own worked guide.
for(const block of blocks.filter(b=>[4,5,6].includes(b.n))) block.body.pop();
const expectationBlock=blocks.find(b=>b.n===2);
expectationBlock.body[expectationBlock.body.length-1]=demo([activity('al-discrete','AL：期待値')],'各行の値×確率を確認し、期待値の計算をALワークシートで実践しよう。');
const followups = [
  [/## 確率変数 \$X\$/, 'dice', 'サイコロを1回振る。Xの候補は1〜6、今回のxはどれ？'],
  [/original w5.md section 23 /, 'dice', '1,000回振ってみよう。出目は整数でも、平均は3.5に近づく？'],
  [/## 赤に100円賭けると/, 'roulette', '100円を赤に賭けて1回、次に1,000回。実測の平均損益と −5.26円を比べよう。'],
  [/## 賞金の「地図」/, 'lottery', 'くじを1,000回引く。表の「実測」が70%・25%・5%に近づくか確認しよう。'],
  [/## ロボット工場の検品/, 'discrete', '5回中の成功数を不良台数と考える。棒をクリックし、0〜5台の確率を比べよう（ここでは不良率50%）。'],
  [/## 同じロボットでも/, 'probability', '1回ならベルヌーイ、回数固定なら二項、時間内の発生数ならポアソン。モデルを切り替えて試そう。'],
  [/## ロボットとヤギを5つ/, 'combinations', 'n=5、x=2。ロボット2体の並びを作り、10通りを見つけよう。'],
  [/original w5.md section 29 /, 'class-pairs', '22人から2人をクリックして組を作る。順序を逆にしても同じ組。22×21÷2=231組を確かめよう。'],
  [/original w5.md section 36 /, 'combinations', 'nとxを変え、並び方の数と {}_nC_x の値が一致することを確認しよう。'],
  [/## 5打席で、ちょうど3安打/, 'batting', 'n=5、π=0.32、x=3。「安安安凡凡」だけの確率と、全10通りの確率を比べよう。'],
  [/## 3安打になる順序/, 'batting', '5打席を1,000試合。3安打の棒が約15.2%になるか、理論値と比べよう。'],
  [/## 5打席の平均/, 'batting', '同じ5打席セットを繰り返す。安打数の平均1.6と分散1.088を、分布の中心と幅に結びつけよう。'],
  [/## まれな不良品/, 'probability', 'ポアソンを選び、λ=2で1,000回。0個の棒を確認。理論では約13.5%。'],
  [/## バッテリーが/, 'al-continuous', '長方形の数を増やし、密度の面積を足す。まずALの f(x)=x で積分を目で確かめよう。'],
  [/## 正規分布/, 'normal-w2', 'μを動かすと中心、σを動かすと幅が変わる。1,000個の値を生成して曲線と比べよう。'],
  [/## \$t\$ 分布/, 't-w2', '標本サイズを3から30へ。t分布の裾はどう変わる？ 次はカイ二乗のタブで右側の裾を比べよう。'],
  [/## 同じ平均、違う待ち時間/, 'delivery', '配達ロボットBを1,000回。2分と18分だけでも平均10分。Aの分散0とBの分散64を比べよう。'],
  [/## ALワークシートで/, 'al-discrete', '値×確率を1行ずつ計算し、6行の合計5/3を確かめよう。次は「AL：2つの積分」へ。']
];
for (const block of blocks) block.body = block.body.flatMap(slide => {
  const followup = followups.find(([pattern])=>pattern.test(slide));
  if(followup?.[1]==='t-w2') return [slide,
    demo([activity('t-w2','t分布を動かす')],'標本サイズを3から30へ。t分布の裾はどう変わる？'),
    demo([activity('chi-w2','カイ二乗分布を動かす')],'nを変えて、ばらつきの統計量を1,000回生成。負の値が出ないことと、右側の裾を確認しよう。')];
  return followup ? [slide, demo([activity(followup[1],'実例を動かす')],followup[2])] : [slide];
});
const lotteryDefinition = blocks[0].body.shift();
const orderedSlides = [lotteryOpening, lotteryDefinition, slides[14], slides[13],
  demo([activity('lottery','くじを引く')],'1枚引いて、次に1,000枚。賞金の平均75円と、1枚あたりの損益 −25円に近づくか試そう。'),
  ...blocks.flatMap(block => [divider(block.n,block.title,block.pages,block.question),
    ...block.body.map(slide => slide.replace(/^(#{1,3}[^\n]*)$/m, `$1\n\n<!-- _footer: 2-${block.n} ${block.title} ／ 教科書 p.${block.pages} -->`))])];
// A distinct textbook visual language, without changing Yoh's white story slides.
const bookStyles = `
section.book-divider {
  background: #eaf5fb; color: #17374b; text-align: left;
  padding: 80px 90px; justify-content: center;
  border-top: 12px solid #4aa8cd;
}
section.book-divider h2 {
  font-size: 24px; font-weight: 600; color: #287c9f;
  margin: 0 0 48px; letter-spacing: .04em;
}
.book-heading {
  display: flex; align-items: center; gap: 24px;
  font-size: 50px; font-weight: 700; line-height: 1.4;
  padding-bottom: 25px; border-bottom: 6px dotted #63b1d0;
}
.book-number {
  background: #4aa8cd; color: white; border-radius: 999px;
  padding: 3px 25px; font-size: 38px; flex-shrink: 0;
}
.book-page { color: #287c9f; font-size: 30px; font-weight: 600; margin-top: 28px; }
section.book-divider p { font-size: 30px; line-height: 1.65; margin-top: 28px; }
section.book-reference { background: #f2f9fc; border-top: 8px solid #4aa8cd; }
section.book-reference h2 { color: #287c9f; }
section.book-reference footer, section.book-divider footer { color: #287c9f; }
section.lottery-example { font-size: 26px; padding: 44px 70px; }
section.lottery-example h2 { font-size: 48px; margin: 0 0 18px; }
section.lottery-example mjx-container[display="true"] { font-size: 105%; margin: 18px 0 26px; }
section.lottery-example p { margin: 8px 0; }
.lottery-results { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; margin: 8px 0 24px; }
.lottery-result-label { font-size: 26px; font-weight: 600; }
.lottery-result-number { font-size: 92px; font-weight: 700; line-height: 1.15; margin: 8px 0; }
.lottery-result-number span { font-size: 40px; margin-left: 8px; }
.lottery-prize .lottery-result-number { color: #287c9f; }
.lottery-loss .lottery-result-number { color: #ac493e; }
.lottery-result-detail { font-size: 23px; color: #59616a; }
.lottery-takeaway { font-size: 24px; }
.lottery-takeaway strong { color: #ac493e; }
section.lottery-opening { font-size: 28px; padding: 55px; }
section.lottery-opening h2 { font-size: 48px; }
section.lottery-opening large { font-size: 1.65em; }
section.simulation-guide { background:#edf5ef; text-align:left; padding:48px 70px; font-size:25px; justify-content:center; }
section.simulation-guide h2 { font-size:39px; color:#276044; margin:0 0 22px; }
section.simulation-guide .demo-example { font-size:24px; font-weight:600; color:#385246; margin-bottom:8px; }
section.simulation-guide mjx-container[display="true"] { font-size:110%; margin:18px 0; }
section.simulation-guide p { margin:12px 0; line-height:1.6; }
section.simulation-guide .demo-task { font-size:22px; color:#546757; margin-top:8px; }
section.simulation-guide a { color:#15718b; font-weight:700; font-size:24px; }
section.simulation-guide footer { color:#546757; }
section.al-calculation { font-size: 28px; padding: 48px 70px; }
section.al-calculation h2 { font-size: 42px; margin-bottom: 22px; }
section.al-calculation mjx-container[display="true"] { font-size: 115%; margin: 22px 0; }
section.al-calculation .al-calculation-result { color: #287c9f; font-size: 38px; font-weight: 700; margin: 14px 0; }
section.al-calculation small { font-size: 23px; }
`;
// Requested edits refer to the original 74-slide teaching deck, before renumbering.
const removedSlides = new Set([15,22,23,24,25]);
const revisedOrder = orderedSlides.map((slide,index) => ({number:index+1,slide}));
// Match only the title line, leaving its body and source notes unchanged.
revisedOrder[8].slide = revisedOrder[8].slide.replace(/^##[^\n]*/m, '## コインを５回投げて、ロボットは何回？');
const [weightingFormula] = revisedOrder.splice(16,1);
revisedOrder.splice(12,0,weightingFormula);
const revisedSlides = revisedOrder.filter(item => !removedSlides.has(item.number)).map(item => item.slide);
const styledSlides = revisedSlides.map(slide => {
  const isTextbookFormula = slide.includes('<!-- Adapted from textbook') ||
    /^## (離散分布の平均と分散|連続分布でも|バッテリーが|正規分布|\$t\$ 分布)/m.test(slide);
  return isTextbookFormula ? slide.replace(/^(##[^\n]*)$/m, '$1\n\n<!-- _class: book-reference -->') : slide;
});
// Keep the agreed 28-slide Week 2 boundary; the remaining textbook sections belong to Week 3.
if (styledSlides.length !== 69) throw new Error('Recheck the 28-slide split after changing the source deck.');
const week3Activities = new Set(['probability','combinations','batting','normal-w2','t-w2','chi-w2','delivery','class-pairs']);
const relink = slide => slide.replace(/(agenda\.html\?activity=([^#]+))#week-02/g,
  (match, url, id) => week3Activities.has(id) ? `${url}#week-03` : match);
const deck = slides => `${preface.replace('</style>', `${bookStyles}\n</style>`)}\n\n${slides.map(relink).join('\n\n')}\n`.replace(/[ \t]+$/gm, '');
const alBridge = [
  `## AL 02：積分を知らなくても、意味はわかる\n\n<!-- _class: book-divider -->\n\n<div class="book-heading"><span class="book-number">AL 02</span><span>2つの空欄、2つの質問</span></div>\n\n<div class="book-page">先取り：教科書 p.121・p.129</div>\n\n上の空欄：確率を全部足すと？\n\n下の空欄：平均の値はいくつ？`,
  String.raw`## まず、ロボの配達時間を想像しよう

<!-- _class: book-reference -->

$X$ = 配達にかかる時間（説明用の例）。

$0\le X\le\sqrt2\approx1.414$ 時間。$f(x)=x$。

0時間から約1.414時間まで、途中の値も取れます。

**大きい値ほど密度が高い。高さではなく、面積が確率。**

<small>連続確率変数。f(x)は、その時刻ぴったりの確率ではありません。</small>`,
  String.raw`## 上の空欄：三角形の面積を求める

<!-- _class: book-reference -->

![height:245px](../../../assets/images/al-continuous-triangle.svg)

$$\frac12\times\sqrt2\times\sqrt2=1$$

**確率の合計は1、つまり100%。**`,
  String.raw`## 積分の記号は「小さな面積を全部足す」

<!-- _class: book-reference -->

$$\int_{0}^{\sqrt2}f(x)\,dx=1$$

**下の0から、上の√2まで**、細い長方形の面積を足す。

長方形の面積 = 高さ $f(x)$ × 小さな幅 $dx$。

<small>∫（インテグラル）は「足し合わせる」。dxは「小さな幅」。<br>長方形を限りなく細かくして、面積を全部足します。</small>`,
  String.raw`## 下の空欄：くじの平均と同じ！

<!-- _class: book-reference -->

くじ：**賞金 × 確率** を全部足した。

今度は：**時間 × 小さな区間の確率** を全部足す。

$$E(X)=\sum_x x\Pr(X=x)\quad\longrightarrow\quad\int_0^{\sqrt2}xf(x)\,dx$$

<small>小さな区間の確率は、およそ f(x) × dx。だから x × f(x) × dx を足します。</small>`,
  String.raw`## まずは簡単な例：0〜6で同じ密度

<!-- _class: book-reference al-calculation -->
<!-- Adapted from Tsumura 2026 Week 2 slide 8: continuous uniform expectation. -->

$f(x)=\frac16$（$0\le x\le6$）。どの区間も、同じ幅なら同じ確率。

$$\begin{aligned}
E(X)&=\int_0^6 xf(x)\,dx=\frac16\int_0^6 x\,dx\\
&=\left[\frac{x^2}{12}\right]_0^6\\
&=\frac{6^2}{12}-\frac{0^2}{12}=3
\end{aligned}$$

<div class="al-calculation-result">平均は3。0〜6のちょうど真ん中。</div>

<small>$x$ の積分は $x^2/2$。$1/6$ を掛けると $x^2/12$。<br>角括弧は「上の端 − 下の端」。AL 02も同じ手順です。</small>`,
  String.raw`## AL 02：同じ手順で、平均を求める

<!-- _class: book-reference al-calculation -->

$f(x)=x$、区間は $0\le x\le\sqrt2$。だから $xf(x)=x^2$。

$$\begin{aligned}E(X)&=\int_0^{\sqrt2}xf(x)\,dx=\int_0^{\sqrt2}x^2\,dx\\&=\left[\frac{x^3}{3}\right]_0^{\sqrt2}\\&=\frac{(\sqrt2)^3}{3}-\frac{0^3}{3}=\frac{2\sqrt2}{3}\approx0.9428\end{aligned}$$

<div class="al-calculation-result">下の空欄：平均の値は約0.9428</div>

<small>$x^2$ を積分すると $x^3/3$。上の端√2を入れ、下の端0の値を引きます。<br>0.9428は確率ではありません。配達の例なら約56.6分です。</small>`,
  String.raw`## ALの2つの空欄を整理しよう

<!-- _class: book-reference -->

$$\underbrace{\int_0^{\sqrt2}x\,dx}_{\text{確率の合計}}=\left[\frac{x^2}{2}\right]_0^{\sqrt2}=1$$

$$\underbrace{\int_0^{\sqrt2}x^2\,dx}_{\text{平均の値}}=\left[\frac{x^3}{3}\right]_0^{\sqrt2}\approx0.9428$$

**まず三角形 → 次に値×確率 → 最後に空欄を埋める。**

[やってみよう！ AL 02](https://yohman.github.io/26-2-StatsB/agenda.html?activity=al-continuous#week-02)`
].map(slide => `${slide}\n\n<!-- _footer: AL 02 先取り ／ 教科書 p.121・p.129 -->`);
writeFileSync(resolve(here, 'w2.md'), deck([...styledSlides.slice(0,28), ...alBridge]));
const week3Directory = resolve(here, '../week03');
mkdirSync(week3Directory, {recursive:true});
writeFileSync(resolve(week3Directory, 'w3.md'), deck(styledSlides.slice(28)));
process.stdout.write(`Created Week 2 (${28 + alBridge.length} slides, including ${alBridge.length} AL bridge slides) and Week 3 (41 slides).\n`);
