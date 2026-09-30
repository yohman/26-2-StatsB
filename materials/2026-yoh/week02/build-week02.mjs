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
  return `<!-- Yoh 2025 source PDF slide ${number}; original w5.md section ${number} -->\n${slide}`;
}

const newSlide = (sourcePage, markdown) => `<!-- Adapted from Tsumura 2026 Week 2 slide ${sourcePage}; new editable teaching slide -->\n${markdown.trim().replaceAll(String.raw`\n`, String.fromCharCode(10))}`;
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
  newSlide(6, String.raw`## 100円のくじ、買う？\n\n賞金は **0円（70%）・100円（25%）・1,000円（5%）**。\n\n$E(X)=0\times0.70+100\times0.25+1000\times0.05=75$ 円\n\n<large>75円 − 100円 = −25円</large>\n\n平均すると、1枚につき25円の損。毎回25円失うわけではありません。`),
  newSlide(10, String.raw`## 賞金の「地図」が確率分布\n\n$X$ = くじの賞金。取りうる値は **0円、100円、1,000円**。\n\n$Pr(X=0)=0.70\qquad Pr(X=100)=0.25\qquad Pr(X=1000)=0.05$\n\n<large>$0.70+0.25+0.05=1$</large>\n\n値とその確率を並べたものが、確率分布です。`),
  newSlide(11, String.raw`## ロボット工場の検品\n\n5台のロボットを検品。$X$ = 不良品の台数。\n\n<large>$X\in\{0,1,2,3,4,5\}$</large>\n\n「2台が不良」のように、**数えられる値**を取るので離散確率分布。\n\n<small>問い：5台のうち、2台が不良になる確率をどう数える？</small>`),
  newSlide(12, String.raw`## 台数か、動いた時間か\n\n**離散**：5台のうち壊れたロボットは何台？　$0,1,2,3,4,5$\n\n**連続**：1台のバッテリーは何時間動く？　$2.1,2.13,2.137,\ldots$\n\n<large>台数は数える。時間は測る。</large>\n\n<small>今日は「何回起きた？」という離散の問いに進みます。</small>`),
  newSlide(14, String.raw`## 同じロボットでも、問いが違う\n\n**ベルヌーイ**：この1台は動く？　成功か失敗か。\n\n**二項**：同じ条件で5台試すと、何台動く？\n\n**ポアソン**：修理センターに1時間で何件の依頼が来る？\n\n<small>どの分布を使うかは「何を数えるか」で決まります。</small>`),
  newSlide(15, String.raw`## 最初の成功まで待つと？\n\n**幾何**：動くロボットが初めて出るのは何台目？\n\n**負の二項**：3台の動くロボットがそろうまで、不良品は何台？\n\n<large>成功の数？　成功までの待ち？</large>\n\n<small>今日は問いの違いだけ。計算の中心は二項分布です。</small>`),
  newSlide(14, String.raw`## ロボットとヤギを5つ並べる\n\n1回ごとに、ロボット 🤖 かヤギ 🐐 が独立に出る。\n\n<large>🤖　🐐　🤖　🐐　🐐</large>\n\n$X$ = 5回中に出たロボットの数。これは二項分布？\n\n<small>5回と決まっている／結果は2種類／独立／毎回同じ確率なら、Yes。</small>\n\n2体のロボットは何通り？　講義ページの「やってみる」で探そう。`),
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
];

const output = `${preface}\n\n${slides.join('\n\n')}\n`;
writeFileSync(resolve(here, 'w2.md'), output);
process.stdout.write(`Created w2.md with ${slides.length} slides (${slides.filter(s => s.startsWith('<!-- Yoh')).length} adapted from Yoh).\n`);
