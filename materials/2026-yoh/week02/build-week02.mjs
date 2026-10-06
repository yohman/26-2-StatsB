import { readFileSync, writeFileSync } from 'node:fs';
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
  newSlide(6, String.raw`## 100円のくじ、買う？\n\n<!-- _class: lottery-example -->\n\n$X$ = 賞金（円）。0円：70% ／ 100円：25% ／ 1,000円：5%。\n\n$$\begin{aligned}E(X)&=\sum_x x\Pr(X=x)\\&=0\Pr(X=0)+100\Pr(X=100)+1000\Pr(X=1000)\\&=0\times0.70+100\times0.25+1000\times0.05\\&=75\text{ 円}\end{aligned}$$\n\n**平均の損益：75円 − 100円 = −25円**\n\n<small>1枚あたり平均25円の損。毎回25円失うわけではありません。</small>`),
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
const activityOrder = ['roulette', 'al-discrete', 'discrete', 'combinations', 'batting', 'probability', 'al-continuous'];
const activity = (id, label, week = 2) => {
  const number = activityOrder.indexOf(id) + 1;
  const title = week === 2 && number ? `${String(number).padStart(2, '0')} ${label.replace(/^\d{2} /, '')}` : label;
  return `[${title}](https://yohman.github.io/26-2-StatsB/agenda.html?activity=${id}#week-${String(week).padStart(2, '0')})`;
};
const divider = (number, title, pages, question) => `## 教科書　第2章・第2節　確率分布\n\n<!-- _class: book-divider -->\n<!-- _footer: 2-${number} ${title} ／ 教科書 p.${pages} -->\n\n<div class="book-heading"><span class="book-number">2-${number}</span><span>${title}</span></div>\n\n<div class="book-page">教科書 p.${pages}</div>\n\n${question}`;
const demo = (links, question) => `## やってみる\n\n${question}\n\n${links.join('\n\n')}\n\n<small>リンクから講義ページの該当タブを開きます。</small>`;
const select = (...numbers) => numbers.map(n => slides[n - 1]);
const blocks = [
  {n:1,title:'確率変数',pages:'117',question:'何が起きるか分からない。その結果を、数で表す。',body:[
    ...select(9),
    `## くじの賞金を $X$ とする\n\n0円、100円、1,000円。引く前には、どれになるか分からない。\n\n<large>$X\\in\\{0,100,1000\\}$</large>\n\n引いた後の賞金が、観測した値 $x$。`,
    `## 5回投げて、ロボットは何回？\n\n表はロボット、裏はヤギ。$X$ = 5回中の表の回数。\n\n<large>$X\\in\\{0,1,2,3,4,5\\}$</large>\n\n0回も、取りうる結果に含めます。`,
    demo([activity('coin','コイン投げを開く',1)],'投げる前に、$X$ が取りうる値を挙げてみよう。')
  ]},
  {n:2,title:'期待値',pages:'117',question:'同じことを何度も繰り返すと、平均はいくら？',body:[
    ...select(10,11,12,13),
    `## 起こりやすさで重みをつける\n\n<large>$E(X)=\\sum_x x\\Pr(X=x)$</large>\n\n「結果の値 × その結果の確率」を、全部足す。\n\nサイコロは、どの目も確率 $1/6$。くじは、賞金ごとに確率が違う。`,
    ...select(14,2,3),
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
    demo([activity('al-continuous','07 AL：2つの積分'),activity('normal','正規分布',5),activity('t','t 分布',6),activity('chi','カイ二乗分布',6)],'まず密度と面積の違いを確認。正規・t・カイ二乗は後の週で再び扱います。')
  ]},
  {n:6,title:'確率分布の平均値と分散',pages:'129',question:'分布の中心と、そこからのばらつきを求める。',body:[
    `## 同じ平均、違う待ち時間\n\n配達ロボットA：いつも10分。\n\n配達ロボットB：半分は2分、半分は18分。\n\n<large>どちらも平均10分。</large>\n\n授業前に頼むなら、どちらが安心？`,
    `## 離散分布の平均と分散\n\n$\\mu=E(X)=\\sum_x x\\Pr(X=x)$\n\n$\\sigma^2=\\sum_x(x-\\mu)^2\\Pr(X=x)$\n\n平均は「値 × 確率」の合計。\n分散は「平均からの距離の二乗 × 確率」の合計。`,
    `## 連続分布でも、重みをつけて足す\n\n$\\mu=\\int_{-\\infty}^{+\\infty}xf(x)\\,dx$\n\n$\\sigma^2=\\int_{-\\infty}^{+\\infty}(x-\\mu)^2f(x)\\,dx$\n\n<large>$\\int f(x)\\,dx=1$ は確率の合計。</large>\n\n$\\int xf(x)\\,dx$ は平均。同じ面積計算でも、足すものが違います。`,
    `## ALワークシートで確かめる\n\n**離散**：各行の $x_i\\Pr(X=x_i)$ を足すと $5/3\\approx1.6667$。\n\n**連続**：$f(x)=x$、$0\\le x\\le\\sqrt2$。\n\n$\\int_0^{\\sqrt2}f(x)\\,dx=1$\n\n$E(X)=\\int_0^{\\sqrt2}xf(x)\\,dx=\\dfrac{2\\sqrt2}{3}\\approx0.9428$`,
    demo([activity('al-discrete','06 AL：期待値'),activity('al-continuous','07 AL：2つの積分')],'各項を確認して、ワークシートのセルを埋めよう。')
  ]}
];
const orderedSlides = [slides[0].replace('離散確率分布と二項分布','教科書 第2章 第2節　p.117–129'),
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
section.lottery-example { font-size: 28px; }
section.lottery-example h2 { font-size: 48px; margin-bottom: 22px; }
section.lottery-example mjx-container[display="true"] { font-size: 105%; margin: 22px 0; }
section.lottery-example p { margin: 12px 0; }
section.lottery-example small { font-size: 22px; }
`;
const styledSlides = orderedSlides.map(slide => {
  const isTextbookFormula = slide.includes('<!-- Adapted from textbook') ||
    /^## (離散分布の平均と分散|連続分布でも|バッテリーが|正規分布|\$t\$ 分布)/m.test(slide);
  return isTextbookFormula ? slide.replace(/^(##[^\n]*)$/m, '$1\n\n<!-- _class: book-reference -->') : slide;
});
const output = `${preface.replace('</style>', `${bookStyles}\n</style>`)}\n\n${styledSlides.join('\n\n')}\n`.replace(/[ \t]+$/gm, '');
writeFileSync(resolve(here, 'w2.md'), output);
process.stdout.write(`Created w2.md with ${orderedSlides.length} slides in six textbook sections.\n`);
