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
  newSlide(6, String.raw`## 期待値は確率で重みづけした平均\n\n<large>$E(X)=\displaystyle\sum_x x\,Pr(X=x)$</large>\n\n公平なサイコロでは、どの目も $1/6$。\n\n$E(X)=1\times\frac16+2\times\frac16+\cdots+6\times\frac16=3.5$`),
  newSlide(10, String.raw`## 確率分布\n\n確率変数 $X$ が取りうる値と、それぞれの確率を並べたもの。\n\n<large>$x\quad\longmapsto\quad Pr(X=x)$</large>\n\nすべての値の確率を足すと **1** になります。`),
  newSlide(11, String.raw`## 離散確率分布\n\n$X$ が **0, 1, 2, \ldots** のように数えられる値を取る。\n\n例：10回投げたコインで表が出た回数。\n\n各値に確率 $Pr(X=x)$ を割り当てます。`),
  newSlide(12, String.raw`## 連続確率分布との違い\n\n離散：表の回数　$0,1,2,\ldots,10$\n\n連続：身長や時間のように、途中の値も取りうる。\n\n<small>今日は「数えられる回数」に注目します。</small>`),
  newSlide(14, String.raw`## 回数を数える分布\n\n**ベルヌーイ分布**：成功か失敗か、1回の試行。\n\n**二項分布**：同じ試行を $n$ 回行ったときの成功回数。\n\n**ポアソン分布**：一定の時間や範囲で起きる回数。`),
  newSlide(15, String.raw`## 「何回目で？」を考える分布\n\n**幾何分布**：初めて成功するまでの試行回数。\n\n**負の二項分布**：決めた回数の成功に達するまでの失敗回数。\n\n<small>この2つは今日は名前と問いの違いだけ確認します。</small>`),
  newSlide(14, String.raw`## 二項分布が使える条件\n\n1. 試行回数 $n$ が決まっている\n2. 各試行は成功か失敗のどちらか\n3. 試行どうしが独立\n4. 成功確率 $\pi$ が毎回同じ\n\n$X$ = $n$ 回の試行で成功した回数`),
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
