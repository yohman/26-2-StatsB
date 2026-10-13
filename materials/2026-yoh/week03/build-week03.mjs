import {writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

// Narrative teaching source. The generated w3.md is also editable Marp Markdown.
const here = dirname(fileURLToPath(import.meta.url));
// A data chart of N(160, 5²), with one SD and the requested upper-tail area.
const heightChart = {mean:160, sd:5, threshold:169.8, min:140, max:180};
function normalHeightChart() {
  const {mean,sd,threshold,min,max} = heightChart;
  const px = x => 52+(x-min)/(max-min)*580;
  const py = x => 238-165*Math.exp(-.5*((x-mean)/sd)**2);
  const points = (a,b,n=240) => Array.from({length:n+1},(_,i)=>{const x=a+(b-a)*i/n;return `${px(x).toFixed(2)},${py(x).toFixed(2)}`;}).join(' L');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 350" role="img" aria-labelledby="title desc">
  <title id="title">平均160cm、標準偏差5cmの正規分布</title>
  <desc id="desc">平均160cmを中心としたベル曲線。160〜165cmが標準偏差1個分の5cm。169.8cm以上の右側の面積をオレンジで強調。右の裾は図の外にも続く。</desc>
  <g font-family="Hiragino Sans, Noto Sans JP, sans-serif" fill="#344d57">
  <text x="52" y="30" font-size="18">確率密度</text>
  <path d="M${px(threshold)},238 L${points(threshold,max)} L${px(max)},238 Z" fill="#e5aa36" fill-opacity=".8"/>
  <path d="M${points(min,max)}" fill="none" stroke="#176d82" stroke-width="4"/>
  <path d="M52 238 H645" fill="none" stroke="#71848e" stroke-width="2"/>
  <path d="M${px(mean)} 67 V238" stroke="#176d82" stroke-width="2" stroke-dasharray="5 5"/>
  <path d="M${px(threshold)} 190 V238" stroke="#b57413" stroke-width="2.5" stroke-dasharray="5 4"/>
  <text x="${px(mean)}" y="43" text-anchor="middle" font-size="22" font-weight="700" fill="#176d82">平均 μ = 160cm</text>
  ${[145,150,155,160,165,175,180].map(x=>`<path d="M${px(x)} 238 V245" stroke="#71848e"/><text x="${px(x)}" y="266" text-anchor="middle" font-size="18">${x}</text>`).join('')}
  <path d="M${px(mean)} 290 V299 H${px(mean+sd)} V290" fill="none" stroke="#176d82" stroke-width="2"/>
  <text x="${px(mean+sd/2)}" y="329" text-anchor="middle" font-size="20" font-weight="700" fill="#176d82">σ = 5cm</text>
  <text x="510" y="119" font-size="21" font-weight="700" fill="#9b6010">169.8cm以上</text>
  <text x="510" y="148" font-size="17" fill="#9b6010">求める確率はこの面積</text>
  <path d="M522 160 V194 L${px(171)},228" fill="none" stroke="#b57413" stroke-width="2"/>
  <text x="${px(threshold)}" y="287" text-anchor="middle" font-size="19" font-weight="700" fill="#9b6010">169.8</text>
  <text x="650" y="266" font-size="16">cm</text>
  </g></svg>`;
}
writeFileSync(resolve(here,'images','normal-height-tail.svg'),normalHeightChart());
const slides = [];
const add = (title, content, style = '') => {
  slides.push(`${style ? `<!-- _class: ${style} -->\n\n` : ''}## ${title}\n\n${content}`);
  if(title === '「ちょうど4本」と「4本以上」は違う') slides.push(`## 成功数の「地図」が、二項分布\n\n![width:830px](images/nba-distribution.svg)\n\n${math(String.raw`\Pr(X\ge4)=\Pr(X=4)+\Pr(X=5)\approx95.75\%`)}\n\n${note('横軸：5本のうち成功した本数。縦軸：その成功数になる確率。緑の2本を足す。')}`);
  if(title === '式の中身を、人数で確かめる') slides.push(`## 5人以上は、右側の棒を全部足す\n\n![width:830px](images/costco-distribution.svg)\n\n${math(String.raw`\Pr(X\ge5)\approx55.95\%`)}\n\n${note('横軸：10分の到着人数。縦軸：その人数になる確率。図は14人まで。15人以上もあり、式では全て含める。')}`);
};
const math = value => `$$\n${value}\n$$`;
const go = (id, label = 'やってみよう！') => `[${label}](https://yohman.github.io/26-2-StatsB/agenda.html?activity=${id}#week-03)`;
const note = value => `<div class="note">${value}</div>`;
const importantBadge = '<div class="important-badge">最重要 / VERY IMPORTANT</div>';
const poissonTableFile = 'other material/2025 yoh/06_[AL]確率分布_1_離散確率分布 ポアソン/ポアソン分布表.pdf';
const poissonViewerUrl = `https://yohman.github.io/26-2-StatsB/viewer.html?${new URLSearchParams({file:poissonTableFile,title:'ポアソン分布表 / Poisson table',week:'W03',return:'agenda.html#week-03'})}`;
const poissonViewerLink = `[ポアソン分布表をビューアーで開く ↗](${poissonViewerUrl})`;
const poissonTableLink = '[ポアソン分布表を開く](https://yohman.github.io/26-2-StatsB/other%20material/2025%20yoh/06_%5BAL%5D%E7%A2%BA%E7%8E%87%E5%88%86%E5%B8%83_1_%E9%9B%A2%E6%95%A3%E7%A2%BA%E7%8E%87%E5%88%86%E5%B8%83%20%E3%83%9D%E3%82%A2%E3%82%BD%E3%83%B3/%E3%83%9D%E3%82%A2%E3%82%BD%E3%83%B3%E5%88%86%E5%B8%83%E8%A1%A8.pdf)';
// Exact-probability entries transcribed from the student handout (three decimals).
const poissonRows = [['0','0.011','0.007','0.004'],['1','0.050','0.034','0.022'],['2','0.112','0.084','0.062'],['3','0.169','0.140','0.113'],['4','0.190','0.175','0.156']];
const tableExcerpt = (selectedRows, mean = '5.0') => `<table class="poisson-lookup"><thead><tr><th><i>x</i> ＼ <i>μ</i></th>${['4.5','5.0','5.5'].map(v=>`<th class="${v===mean?'lookup-column':''}">${v}</th>`).join('')}</tr></thead><tbody>${poissonRows.map(([x,...values])=>`<tr><th class="${selectedRows.includes(x)?'lookup-row':''}">${x}</th>${values.map((v,i)=>`<td class="${['4.5','5.0','5.5'][i]===mean?(selectedRows.includes(x)?'lookup-cell':'lookup-column'):''}">${v}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const ref = (num, title, pages, content) => add(`教科書 · 第2章 第2節`, `<div class="chapter">${num}　${title}</div><div class="pages">${pages}</div>\n\n${content}`, 'book-divider');
const panels = items => `<div class="panels">${items.map(([label,value,sub]) => `<div class="panel"><div class="label">${label}</div><div class="value">${value}</div><div class="detail">${sub}</div></div>`).join('')}</div>`;
function barChart(filename, values, selected, label) {
  const max = Math.max(...values)*1.15, left=60, bottom=275, step=640/values.length;
  let svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 335"><rect width="760" height="335" fill="#fbfaf6"/><text x="60" y="25" font-family="sans-serif" font-size="17" fill="#66777c">Probability (%)</text>`;
  for(let j=0;j<=4;j++){const v=max*j/4,y=bottom-v/max*220;svg+=`<path d="M60 ${y}H710" stroke="#dce5e5"/><text x="49" y="${y+5}" text-anchor="end" font-family="sans-serif" font-size="16" fill="#66777c">${(v*100).toFixed(0)}</text>`;}
  values.forEach((v,x)=>{const height=v/max*220,cx=left+(x+.5)*step;svg+=`<rect x="${cx-step*.31}" y="${bottom-height}" width="${step*.62}" height="${height}" fill="${selected(x)?'#277753':'#9bbdc9'}" rx="4"/><text x="${cx}" y="300" text-anchor="middle" font-family="Georgia" font-size="19" fill="#344d57">${x}</text>`;if(selected(x))svg+=`<text x="${cx}" y="${bottom-height-8}" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#277753">${(v*100).toFixed(1)}%</text>`;});
  svg+=`<text x="710" y="329" text-anchor="end" font-family="sans-serif" font-size="16" fill="#66777c">${label}</text></svg>`;
  writeFileSync(resolve(here,'images',filename),svg);
}
barChart('nba-distribution.svg',Array.from({length:6},(_,x)=>[1,5,10,10,5,1][x]*.93**x*.07**(5-x)),x=>x>=4,'Makes in five shots · x');
let poissonProbability=Math.exp(-5);
barChart('costco-distribution.svg',Array.from({length:15},(_,x)=>x?(poissonProbability*=5/x):poissonProbability),x=>x>=5,'Arrivals in ten minutes · x');

add('5本連続。本当に？', `<!-- _footer: '' -->\n<!-- _paginate: false -->\n\n![bg cover](images/curry-full-court-still.jpg)\n\n<a class="full-video" href="https://www.youtube.com/watch?v=xt5vzE0QCvk" aria-label="Curryの動画を見る"><span>▶ 動画を見る / Watch video</span></a>\n\n<div class="video-disclosure">映像：Ari Fararooy</div>\n\n<!-- Screenshot from the supplied video, captured in-browser. Source: https://www.youtube.com/watch?v=xt5vzE0QCvk . Edited-video context: https://www.scrippsnews.com/sports/steph-curry-on-fake-viral-video-of-full-court-shots . Full-court footage is separate from the hypothetical free-throw model. -->`, 'video-opening');
add('最後のフリースロー、誰に任せる？', `<div class="players"><div><a href="https://www.youtube.com/watch?v=hUOfC2ilXak"><img src="images/curry.png" alt="Stephen Curry：動画を見る"></a><a class="player-stats" href="https://www.nba.com/stats/player/201939?SeasonType=Regular+Season">Curry · NBA公式成績 / Official stats ↗</a></div><div><a href="https://www.youtube.com/watch?v=H0lvVOFt7-A&t=187s"><img src="images/giannis.png" alt="Giannis Antetokounmpo：動画を見る"></a><a class="player-stats" href="https://www.nba.com/stats/player/203507?SeasonType=Regular+Season">Giannis · NBA公式成績 / Official stats ↗</a></div></div>\n\nカリー？　ヤニス？　「上手そう」から、数字で考えてみる。\n\n${note('画像をクリックすると動画へ。公式成績では、シーズンとFT％（フリースロー成功率）を確認しよう。')}`, 'opening');
add('93％なら、5本全部入る？', `1本の成功率を **93％** として、5本のフリースローを考える。\n\n${panels([['チャンス','5本','何回投げるか'],['1本の成功率','93％','入る／外れる'],['知りたいこと','何本？','5本中の成功数']])}\n\nまず予想：全部成功する確率も93％？\n\n${note('π = 0.93 は授業用の設定。各投球は独立で、成功率は一定と仮定。')}`);
add('5本全部成功する確率は…', `${math(String.raw`\Pr(X=5)=(0.93)^5\approx0.6957`)}\n\n<div class="answer">約69.57％</div>\n\n1本ごとの93％と、5本全部の確率は違う。\n\n${note('成功・成功・成功・成功・成功 → 独立な5回の確率を掛ける。')}`);
add('Week 3 · 成功の回数、到着の人数', `NBAからコストコへ。\n\n**回数を固定する** → 二項分布\n\n**時間を固定する** → ポアソン分布\n\n<div class="route">4 離散確率分布　→　5 連続確率分布　→　6 平均値と分散</div>\n\n${note('教科書 第2章 第2節「確率分布」p.118–129 ／ Week 2の続き')}`, 'title');
ref('4','離散確率分布','p.118–120','成功した回数を数える。\n\nまずは **二項分布**：決まった回数の中で、何回成功するか。');
add('1本ならベルヌーイ、5本なら二項', `${panels([['1本の結果','0 または 1','外れる = 0 ／ 入る = 1'],['5本の成功数','0〜5','X = 5本のうち入った本数']])}\n\n${math(String.raw`Y\sim\mathrm{Bernoulli}(\pi),\qquad X\sim B(n,\pi)`)}\n\n${note('大文字 X は成功数を表す確率変数。実際に3本入ったら、実現値 x = 3。')}`, 'book-reference');
add('4本成功にも、5通りある', `<div class="sequences">● ● ● ● ×<br>● ● ● × ●<br>● ● × ● ●<br>● × ● ● ●<br>× ● ● ● ●</div>\n\n${math(String.raw`\Pr(X=4)=\underbrace{5}_{\text{並び方}}\times\underbrace{(0.93)^4(0.07)}_{\text{1通りの確率}}\approx26.18\%`)}\n\n${note('● = 成功 ／ × = 失敗。成功数は同じでも、失敗する位置が違う。')}`);
add('並び方を数える記号：C', `${math(String.raw`{}_nC_x=\frac{n!}{x!(n-x)!},\qquad {}_5C_4=5`)}\n\n${panels([['n','全部で何回？','5本投げる'],['x','成功は何回？','4本成功'],['C','何通り？','失敗する位置が5通り']])}\n\n${note('階乗 n! は n × (n−1) × … × 1。0! = 1。教科書 p.119。')}`, 'book-reference');
add('ロボットとヤギで、並び方を見よう', `🤖 🤖 🐐 🐐 🐐　　🤖 🐐 🤖 🐐 🐐\n\n5か所にロボット2体を置く。順番は何通り？\n\n${math(String.raw`{}_5C_2=\frac{5!}{2!3!}=10`)}\n\n${go('combinations')}\n\n${note('n と x のスライダーを動かす → 式の数字と、全ての並び方が変わる。')}`, 'try');
add('二項分布の公式', `<!-- _footer: '' -->\n\n${math(String.raw`\Pr(X=x)={}_nC_x\,\pi^x(1-\pi)^{n-x}`)}`, 'book-reference formula-only');
add('二項分布：式を3つに分ける', `${importantBadge}\n\n${math(String.raw`\Pr(X=x)={}_nC_x\,\pi^x(1-\pi)^{n-x}`)}\n\n${panels([['並び方','ₙCₓ','成功の位置を選ぶ'],['成功','πˣ','x 回成功する'],['失敗','(1−π)ⁿ⁻ˣ','残り n−x 回は失敗']])}\n\n${note('n 回・独立・成功率 π が一定。この条件がそろったときに使う。教科書 p.119。')}`, 'book-reference');
add('「ちょうど4本」と「4本以上」は違う', `${math(String.raw`\begin{aligned}\Pr(X=4)&={}_5C_4(0.93)^4(0.07)^1\\&=5\times(0.93)^4\times0.07\approx0.2618\\[10pt]\Pr(X=5)&={}_5C_5(0.93)^5(0.07)^0\\&=1\times(0.93)^5\times1\approx0.6957\end{aligned}`)}\n\n${math(String.raw`\Pr(X\ge4)=\Pr(X=4)+\Pr(X=5)\approx0.9575=95.75\%`)}\n\n${note('n = 5、π = 0.93。「4本以上」は4本と5本の両方を含む。確率は丸める前の値で足す。')}`, 'binomial-worked');
add('NBAラボ：予想して、投げて、比べる', `${math(String.raw`X\sim B(5,0.93),\qquad\Pr(X\ge4)\approx95.75\%`)}\n\n**①** 1セット5本。何本入った？\n\n**②** 100セット繰り返す。成功数の分布は？\n\n**③** 成功率を65％に変える。どの棒が変わる？\n\n${go('nba')}\n\n${note('線は理論の確率、棒は実測の割合。試行を増やしても毎回一致するわけではない。')}`, 'try');
add('二項分布の期待値と分散', `${importantBadge}\n\n<div class="moment-block"><h3>期待値 E(X)：成功数の平均</h3>\n\n${math(String.raw`E(X)=n\pi=5\times0.93=4.65`)}\n\n</div><div class="moment-block variance-block"><h3>分散 Var(X)：成功数のばらつき</h3>\n\n${math(String.raw`\operatorname{Var}(X)=n\pi(1-\pi)=5\times0.93\times0.07=0.3255`)}\n\n</div>\n\n${note('期待値4.65本は、5本のセットを何度も繰り返した平均。1セットで4.65本入るという意味ではない。分散の単位は本²。教科書 p.120。')}`, 'book-reference moments-important');
add('NBAの話が、教科書の野球につながる', `打率32％の選手が5打席で **ちょうど3安打**。\n\n${math(String.raw`\Pr(X=3)={}_5C_3(0.32)^3(0.68)^2\approx0.151519`)}\n\n<div class="answer">約15.15％</div>\n\n${note('フリースローの成功 → ヒットに置き換えただけ。教科書 p.118–120の例。')}`, 'book-reference');
add('野球ラボ：1打席と1試合を分ける', `${math(String.raw`\underbrace{\pi=0.32}_{\text{1打席のヒット率}}\quad\ne\quad\underbrace{\Pr(X=3)\approx0.1515}_{\text{5打席で3安打の確率}}`)}\n\n1試合を5打席として、100試合を繰り返そう。\n\n**3安打の棒**と15.15％を比較する。\n\n${go('batting')}`, 'try');
add('今度は、回数が決まっていない', `<div class="wide-photo"><img src="images/costco.jpg" alt="Costco"></div>\n\nあなたはコストコでレジ担当。退勤まで、あと10分。\n\nその10分間に、**新しく何人来る？**\n\n${note('一定時間に新しく到着する人数を考えよう。')}`);
add('平均5人。でも、今日は3人？8人？', `<div class="photo-side"><img src="images/checkout.jpg" alt="Costco checkout"><div><div class="answer">10分で平均5人</div><p>0人、1人、2人、…<br>上限は決まっていない。</p><p>知りたいこと：<br><strong>ちょうど3人？　5人以上？</strong></p></div></div>\n\n${note('仮想の授業モデルです。実際のコストコの測定値ではありません。')}`);
ref('4','ポアソン分布','p.120','固定した時間・範囲の中に、何件起こるか。\n\n平均の発生数 **λ（ラムダ）** が、分布を決める。');
add('ポアソン分布の公式', `<!-- _footer: '' -->\n\n${math(String.raw`\Pr(X=x)=\frac{\lambda^x e^{-\lambda}}{x!}`)}`, 'book-reference formula-only');
add('ポアソンの式と、表のつながり', `${math(String.raw`X\sim\mathrm{Poisson}(\lambda),\qquad \Pr(X=x)=\frac{\lambda^xe^{-\lambda}}{x!}`)}\n\n**この式で計算した確率が、表の中に並んでいる。**\n\n${panels([['平均人数','λ = 5','表では μ = 5.0 の列'],['求めたい人数','x = 3','表では x = 3 の行'],['交点を読む','Pr(X = 3)','「ちょうど3人」の確率']])}\n\n${note('配布表の μ と、スライドの λ は同じ平均発生数。授業では e を計算せず、表から確率を読む。教科書 p.120。')}`, 'book-reference');
add('ちょうど3人：列と行の交点を読む', `<div class="lookup-layout"><div><div class="lookup-caption">配布ポアソン分布表の抜粋</div>${tableExcerpt(['3'])}</div><div><p><strong>① 平均5人</strong>：μ = 5.0 の列</p><p><strong>② ちょうど3人</strong>：x = 3 の行</p><p><strong>③ 交点の 0.140 を読む</strong></p>\n\n${math(String.raw`\Pr(X=3)\approx0.140`)}\n\n<div class="lookup-answer">約14.0％</div></div></div>\n\n${poissonViewerLink}\n\n${note('0.140 は「3人以下」ではなく「ちょうど3人」。表の値は小数第3位に丸めてある。')}`, 'table-reading');
add('5人以上：0〜4人を足して、1から引く', `${math(String.raw`\Pr(X\ge5)=1-\{\Pr(X=0)+\cdots+\Pr(X=4)\}`)}\n\n<div class="lookup-layout"><div><div class="lookup-caption">μ = 5.0 の列、x = 0〜4 の5マス</div>${tableExcerpt(['0','1','2','3','4'])}</div><div><p>表の確率を<strong>小数のまま</strong>足す。</p>\n\n${math(String.raw`\begin{aligned}\Pr(X\le4)&\approx0.007+0.034+0.084\\&\quad+0.140+0.175=0.440\\\Pr(X\ge5)&\approx1-0.440=0.560\end{aligned}`)}\n\n<div class="lookup-answer">約56.0％</div></div></div>\n\n${note('「5人以上」なので、引くのは4人まで。x = 5 のマスは引かない。')}`, 'table-reading');
add('式の中身を、人数で確かめる', `| 求めたいこと | 表で読む場所 | 答えの出し方 |\n| --- | --- | --- |\n| ちょうど3人 | μ = 5.0、x = 3 | 0.140 ≈ 14.0％ |\n| 4人以下 | μ = 5.0、x = 0〜4 | 5マスを足す ≈ 0.440 |\n| 5人以上 | 4人以下の反対 | 1 − 0.440 ≈ 56.0％ |\n\n${poissonTableLink}\n\n${note('表の各マスは「ちょうど x 人」の確率。表の丸めにより、計算機の値（約14.04％・55.95％）とは少し違う。表を使う問題では表の精度で答える。')}`);
add('コストコラボ：10分間を何度も繰り返す', `${math(String.raw`\lambda=5,\qquad E(X)=\operatorname{Var}(X)=5`)}\n\n**①** 1回の10分間を再生。いつ、何人来た？\n\n**②** 100回繰り返して、人数の棒グラフを作る。\n\n**③** 時間を20分に。平均人数はどう変わる？\n\n${go('costco')}\n\n${note('到着時刻はランダム。平均到着率が一定なら、時間を2倍にするとλも2倍。')}`, 'try');
add('同じ「5」でも、二項とは違う', `${panels([['NBA','5本投げる','n = 5 ／ 成功数は0〜5'],['コストコ','平均5人来る','λ = 5 ／ 人数は0,1,2,…']])}\n\n${math(String.raw`\text{二項}:\ E(X)=n\pi\qquad\text{ポアソン}:\ E(X)=\lambda`)}\n\n**試行回数**と**平均発生数**を取り違えない。`);
add('ポアソンを使う前に、条件を確認', `**独立**：1人の到着が、次の到着を決めない。\n\n**一定の率**：時間帯の途中で混雑度が急変しない。\n\n**小さな時間では、複数の到着はまれ**。\n\n${note('団体客、セール開始、混雑による相互作用があるなら、このモデルが合わない可能性。到着人数だけでは退勤時刻は決まりません。')}`);
add('二項からポアソンへの橋', `${math(String.raw`n\ \text{が大きく},\quad\pi\ \text{が小さく},\quad n\pi=\lambda`)}\n\nたくさんの小さなチャンスから、まれに発生する。\n\n${math(String.raw`B(n,\pi)\approx\mathrm{Poisson}(n\pi)`)}\n\n${go('probability')}\n\n${note('ベルヌーイ・二項・ポアソンの棒を比較。教科書 p.120の近似の考え方。')}`, 'book-reference');
ref('5','連続確率分布','p.121–128','ロボットは **何体？** から、身長は **何cm？** へ。\n\n測定値には小数もある。**ある範囲に入る確率**を、面積で求める。\n\nこの後の例：高さ制限に通れる？　工場の平均は正しい？　品質は安定している？');
add('連続の確率：身長がある範囲に入る割合', `身長を $X$ とする。**160.000…cmぴったり**より、**155〜165cm**を考える。\n\n${math(String.raw`\Pr(155<X\le165)=\int_{155}^{165}f(x)\,dx=F(165)-F(155)`)}\n\n**f(x)**：その付近への集まりやすさ。高さそのものは確率ではない。\n\n**F(165) − F(155)**：165cm以下から155cm以下を除き、間の面積を残す。\n\n${note('連続モデルでは一点の確率は0、全範囲の面積は1。丸めた「160.0cm」という測定値は小さな区間を表す。Week 2 AL2の面積と同じ考え方。教科書 p.121。')}`, 'book-reference explained');
add('正規分布：このロボット、ゲートを通れる？', `**問題**　身長は正規分布、平均160cm・標準偏差5cm。169.8cm以上になる確率は？\n\n<div class="normal-visual-layout"><div><img src="images/normal-height-tail.svg" alt="平均160cm、標準偏差5cmの正規分布。169.8cm以上の右側の面積を強調。"></div><div>\n\n${math(String.raw`X\sim N(160,5^2)`)}\n\n${math(String.raw`Z=\frac{X-\mu}{\sigma}`)}\n\n${math(String.raw`z=\frac{169.8-160}{5}=1.96`)}\n\n**9.8cmの差は、標準偏差1.96個分。**\n\n${go('normal-w2')}\n\n</div></div>\n\n${note('色の面積が169.8cm以上になる確率。次のスライドで表から読む。右の裾は図の外にも続く。仮想の身長モデル。教科書 p.122–124。')}`, 'book-reference explained normal-visual');
add('正規分布表：行1.9、列0.06を読む', `**求めるもの：高さ制限169.8cmを超える割合。標準化すると z = 1.96。**\n\n| zの行 ＼ 小数第2位の列 | 0.05 | **0.06** | 0.07 |\n| --- | --- | --- | --- |\n| **1.9** | 0.02559 | **0.02500** | 0.02442 |\n\n${math(String.raw`\Pr(X>169.8)=\Pr(Z>1.96)=0.025=2.5\%`)}\n\n**このモデルでは約1,000体中25体が高さ制限を超える。**\n\n${math(String.raw`\Pr(X\le169.8)=0.975,\quad\Pr(150.2<X<169.8)=1-2(0.025)=0.95`)}\n\n${note('教科書の表は右側の面積。通れる割合は97.5％。中央95％は左右の2.5％ずつを除く。予測割合であり、必ず25体になるわけではない。教科書 p.124–125。')}`, 'book-reference explained');
add('なぜt分布？　工場の平均を標本で調べる', `**問題**　工場は「平均60cm」と説明。でも全ロボットの身長や母標準偏差は分からない。\n\n無作為に **9体** 測ると、平均 **64cm**、標本標準偏差 **6cm**。\n\n${math(String.raw`T=\frac{\bar X-\mu_0}{s/\sqrt n},\qquad\nu=n-1`)}\n\n**σが未知なので s で推定する。** 広がりも推定する不確かさを、t分布で考慮する。\n\n${note('個体の身長でなく「標本平均のずれ」を評価する。小標本だから自動的にt、ではない。独立な正規母集団の標本を仮定。教科書 p.125–127。')}`, 'book-reference explained');
add('tの計算：平均のずれは、どのくらい大きい？', `${math(String.raw`\mathrm{SE}=\frac{s}{\sqrt n}=\frac6{\sqrt9}=2\ \mathrm{cm},\qquad t=\frac{64-60}{2}=2,\quad\nu=8`)}\n\n**標準誤差SE**：標本平均の揺れの大きさを推定したもの。4cmの差はSEの2個分。\n\n両側5％の目安：t表の **自由度8、上側確率0.025** から **2.306**。\n\n${math(String.raw`|t|=2<2.306`)}\n\n**この標本だけでは、5％水準で「平均60cmと違う」とまでは言えない。**\n\n${go('t-w2')}\n\n${note('t = 2 は確率2％ではない。「違いが示せない」は「平均60cmだと証明した」でもない。ここは後の仮説検定への導入。') }\n\n<!-- Critical value checked against NIST Student t table: df=8, cumulative 0.975 (upper tail 0.025), 2.306. https://www.itl.nist.gov/div898/handbook/eda/section3/eda3672.htm -->`, 'book-reference explained t-worked');
add('なぜカイ二乗？　平均が合っても品質は違う', `**問題**　工場の標準偏差は **10cm** という。9体を測ると標本標準偏差は **15cm**。\n\n平均身長が同じでも、大きすぎる・小さすぎるロボットが多ければ、部品が合わない。\n\n${math(String.raw`\chi^2=\frac{(n-1)s^2}{\sigma_0^2},\qquad\nu=n-1`)}\n\n**標本のばらつきを、工場が主張するばらつきと比べる。**\n\n${note('ここでは分散を調べるカイ二乗分布を使う。s²は不偏分散。平均との差を二乗するためχ²は負にならない。独立な正規母集団の標本を仮定。教科書 p.127–128。')}`, 'book-reference explained');
add('カイ二乗の計算：ばらつきすぎていない？', `${math(String.raw`\chi^2=\frac{(9-1)\times15^2}{10^2}=\frac{8\times225}{100}=18,\qquad\nu=8`)}\n\n「ばらつきが大きすぎる？」なので **右側** を見る。\n\nχ²表の **自由度8、上側確率0.05** の境界は **15.507**。\n\n${math(String.raw`18>15.507`)}\n\n**工場の標準偏差が10cmなら珍しい大きさ。上側5％の基準を超えた。**\n\n${go('chi-w2')}\n\n${note('18は18％ではない。片側5％の検定の導入で、母標準偏差が10cmを超える証拠と考える。小さすぎる分散や両側の問いでは別の境界を使う。') }\n\n<!-- Critical value checked against NIST Chi-square table: df=8, cumulative 0.95 (upper tail 0.05), 15.507. https://www.itl.nist.gov/div898/handbook/eda/section3/eda3674.htm -->`, 'book-reference explained chi-worked');
ref('6','確率分布の平均値と分散','p.129','**なぜ重要？　「平均30分」だけでは、間に合うか分からない。**\n\n配達ロボットAはいつも30分。Bは10分か50分、半々。平均は同じ。\n\n**期待値で通常の水準を、分散で安定性を比べる。**');
add('期待値：確率を使って、長期の平均を計算', `${math(String.raw`E(X)=\sum_x x\Pr(X=x)\quad\text{または}\quad E(X)=\int_{-\infty}^{\infty}xf(x)\,dx`)}\n\n離散は足し算、連続は積分。どちらも **値を起こりやすさで重みづけ** する。\n\n${math(String.raw`E(B)=10\times0.5+50\times0.5=30\ \text{分}`)}\n\n**Bを何度も使うと平均30分。でも1回の配達は10分か50分。**\n\n${note('期待値は予算・人員・平均待ち時間の計画に使える。1回の結果や締切内の到着を保証しない。くじの75円、二項のnπ、ポアソンのλも同じ考え方。教科書 p.129。')}`, 'book-reference explained');
add('分散：平均からの距離を二乗して平均', `${math(String.raw`\operatorname{Var}(X)=\sum_x(x-\mu_X)^2\Pr(X=x)\quad\text{または}\quad\int_{-\infty}^{\infty}(x-\mu_X)^2f(x)\,dx`)}\n\nBの配達は平均30分から **−20分か＋20分**。そのまま足すと0になってしまう。\n\n${math(String.raw`\operatorname{Var}(B)=(-20)^2(0.5)+(20)^2(0.5)=400\ \text{分}^2`)}\n\n${math(String.raw`\mathrm{SD}(B)=\sqrt{400}=20\ \text{分},\qquad\operatorname{Var}(A)=0`)}\n\n${note('二乗すると早い・遅いが打ち消されない。分散は分²、標準偏差は分。標準偏差20分は、常に±20分に収まるという意味ではない。教科書 p.129。')}`, 'book-reference explained variance-worked');
add('同じ平均30分。40分後の授業に間に合う？', `| 配達ロボット | 配達時間 | 期待値 | 分散 | 40分以内に到着 |\n| --- | --- | --- | --- | --- |\n| A | いつも30分 | 30分 | 0分² | **100％** |\n| B | 10分か50分、半々 | 30分 | 400分² | **50％** |\n\n**時間厳守ならA。平均だけで選ぶと、この差を見落とす。**\n\n${go('delivery')}\n\n${note('このスライドは仮想の30分モデル。ラボの初期値はA=10分、B=2分/18分で同じ構造。平均と分散だけでは一般に締切内の確率は決まらない。ここでは全ての結果と確率が分かっている。')}`, 'try explained');
add('どの分布？　何を知りたいかで選ぶ', `| 質問 | 使うモデル・道具 | 理由 |\n| --- | --- | --- |\n| 1回の成功？ n回中の成功数？ | ベルヌーイ・二項 | 独立・成功率一定 |\n| 一定時間に何件来る？ | ポアソン | 一定の発生率で数える |\n| 1体の身長が制限を超える？ | 正規モデルで標準化 | 個体の値の範囲を面積にする |\n| 工場の平均は目標と違う？ | t：標本平均の統計量 | 母標準偏差が未知 |\n| 工場のばらつきが大きすぎる？ | χ²：標本分散の統計量 | 主張する母分散と比べる |\n\n${note('正規・t・χ²は「好きな曲線を選ぶ」のではない。何を標準化した統計量かが違う。t・χ²の例は独立な正規母集団の標本を仮定。')}`, 'explained selection-guide');
add('AL：式に入れる前に、4つ書く', `${panels([['何を数える？','X','成功数／発生数'],['条件は？','n, π ／ λ','試行回数と率／平均人数'],['どの結果？','x ／ 以上','ちょうど？　範囲？']])}\n\n**④** 選んだ式に代入 → 答えを確率・人数の言葉で説明する。\n\n授業内のALワークシートに取り組み、指定セルの値を **UNIPA** で回答。\n\n${note('締切：次回授業前日の火曜日 23:59。遅れての提出は受け付けません。')}`);

const css = `
section { background:#fbfaf6; color:#252b30; font-family:'Noto Sans JP','Hiragino Sans',sans-serif; font-size:27px; padding:52px 70px; justify-content:center; text-align:left; line-height:1.55; }
section h2 {font-size:43px; line-height:1.3; margin:0 0 24px; letter-spacing:-.02em; color:#202f38;}
section p {margin:12px 0;} section strong {color:#176d82;} section::after {font-size:17px; color:#727c80;}
section .katex-display {font-size:1.10em; margin:23px 0; text-align:center;}
.note {font-size:18px; color:#69777c; line-height:1.55; margin-top:22px;}
.answer {font-size:64px; font-weight:800; color:#176d82; margin:18px 0; text-align:center;}
.panels {display:flex; gap:20px; margin:24px 0;} .panel {flex:1; background:#edf2f3; padding:22px; border-radius:12px;}
.label {font-size:20px; color:#69777c;} .value {font-family:Georgia,serif; font-size:39px; color:#176d82; margin:8px 0; font-weight:700;}
.detail {font-size:20px; color:#48585e;} .players {display:flex; gap:20px;} .players > div {flex:1; min-width:0;} .players img {width:100%; height:230px; object-fit:cover; border-radius:12px;}
.player-stats {display:block; font-size:20px; color:#176d82; margin:10px 0 6px; text-decoration:underline;}
section.video-opening {padding:0; color:#fff; background:#000;}
section.video-opening h2 {position:absolute; top:50px; left:60px; color:white; font-size:60px; text-shadow:0 2px 14px #000; z-index:3; pointer-events:none;}
section.video-opening .full-video {position:absolute; inset:0; display:block; z-index:2; color:white; background:linear-gradient(180deg,rgba(0,0,0,.35),transparent 35%,transparent 60%,rgba(0,0,0,.7));}
.full-video span {position:absolute; bottom:85px; left:60px; font-size:27px; font-weight:700; background:#176d82; border-radius:8px; padding:13px 25px;}
.video-disclosure {position:absolute; bottom:25px; left:60px; right:40px; font-size:17px; color:white; z-index:3; pointer-events:none;}
section.opening h2 {font-size:48px;} section.title {background:#173c50; color:#fff;} section.title h2,section.title strong {color:#fff;}
section.title .note {color:#b6d3df;} .route {font-size:23px; color:#c0e7f4; margin-top:30px;}
section.book-divider {background:#e7f3fa; border-top:12px solid #399ac8;} section.book-divider h2 {font-size:23px; color:#237da7; margin-bottom:40px;}
.chapter {font-size:56px; color:#184762; font-weight:800;} .pages {font-size:28px; color:#237da7; margin:15px 0 34px;}
section.book-reference {background:#f0f7fb; border-top:7px solid #399ac8;} section.book-reference h2 {color:#216a91;}
.important-badge {position:absolute; top:24px; right:60px; padding:8px 18px; background:#ffe3a3; border:2px solid #b97912; color:#704508; border-radius:7px; font-size:18px; font-weight:800; letter-spacing:.04em;}
section.formula-only h2 {display:none;}
section.formula-only .katex-display {font-size:1.9em; margin:0;}
section.binomial-worked .katex-display {font-size:.98em; margin:15px 0;}
section.moments-important h2 {margin-bottom:22px;}
.moment-block {border-left:5px solid #176d82; padding-left:23px; margin:12px 0;}
.moment-block h3 {font-size:25px; color:#176d82; margin:0;}
.variance-block {border-color:#886524;}
.variance-block h3 {color:#886524;}
section.moments-important .katex-display {font-size:1.03em; margin:10px 0;}
section.moments-important .note {margin-top:12px;}
section.explained {font-size:25px;}
section.explained h2 {font-size:40px; margin-bottom:20px;}
section.explained .katex-display {font-size:1em; margin:16px 0;}
section.explained .note {font-size:17px; margin-top:14px;}
section.explained a[href*="agenda.html?activity="] {font-size:23px; padding:9px 22px;}
section.explained table {font-size:22px; margin:15px 0;}
section.explained th, section.explained td {padding:11px 13px;}
section.variance-worked .katex-display:first-of-type {font-size:.88em;}
section.selection-guide table {font-size:21px;}
.normal-visual-layout {display:grid; grid-template-columns:1.55fr 1fr; gap:24px; align-items:center; margin:16px 0 6px;}
.normal-visual-layout img {display:block; width:100%; height:auto;}
section.normal-visual .normal-visual-layout .katex-display {font-size:.9em; margin:12px 0;}
section.normal-visual .normal-visual-layout p {font-size:23px;}
section.try {background:#edf5ef; border-top:7px solid #388065;} section.try h2 {color:#2b624b;}
section.challenge {background:#fff8e8; border-top:9px solid #be8530;}
section.challenge h2 {color:#825519; margin-bottom:22px;}
section.challenge strong {color:#825519;}
.challenge-time {font-size:22px; color:#825519; font-weight:700; margin-bottom:15px;}
section.challenge .note {color:#796647; font-size:19px;}
section.challenge-check {background:#edf5ef; border-top:7px solid #388065;}
section.challenge-check h2 {color:#2b624b;}
section.challenge-check .katex-display {font-size:1em; margin:19px 0;}
section a[href*="agenda.html?activity="] {display:inline-block; background:#176d82; color:white; font-weight:700; text-decoration:none; padding:13px 28px; border-radius:8px; font-size:27px;}
.lookup-layout {display:grid; grid-template-columns: .9fr 1.1fr; gap:36px; align-items:center;}
.lookup-caption {font-size:19px; color:#536973; margin-bottom:8px;}
section table.poisson-lookup {font-size:23px; margin:8px 0; text-align:center;}
section .poisson-lookup th, section .poisson-lookup td {padding:8px 12px; border:1px solid #d5e1e5; background:#fff;}
section .poisson-lookup .lookup-column {background:#e0eff7; color:#216a91;}
section .poisson-lookup .lookup-row {background:#fff0cf; color:#805215;}
section .poisson-lookup .lookup-cell {background:#176d82; color:#fff; font-weight:800; outline:3px solid #e6ad3a; outline-offset:-3px;}
.lookup-answer {font-size:48px; font-weight:800; text-align:center; color:#176d82;}
section.table-reading .katex-display {font-size:.95em; margin:14px 0;}
section.table-reading .note {margin-top:14px;}
section.poisson-check {padding-top:35px; padding-bottom:42px;}
section.poisson-check h2 {margin-bottom:10px;}
section.poisson-check .katex-display {font-size:.88em; margin:10px 0;}
section.poisson-check .poisson-lookup th, section.poisson-check .poisson-lookup td {padding:6px 12px;}
section.poisson-check a[href*="agenda.html?activity="] {font-size:22px; padding:8px 22px;}
section.poisson-check .note {font-size:17px; margin-top:8px;}
.sequences {display:inline-block; font-size:29px; letter-spacing:14px; line-height:1.45; color:#176d82; margin:0 0 6px 310px;}
.wide-photo img {width:100%; height:265px; object-fit:cover; border-radius:12px;} .photo-side {display:flex; align-items:center; gap:35px;}
.photo-side img {width:48%; height:320px; object-fit:cover; border-radius:12px;} .photo-side .answer {font-size:40px; text-align:left;}
section table {width:100%; margin:20px 0; border-collapse:collapse; font-size:23px;} section th {background:#dcecf3; padding:15px; border:0;}
section td {padding:15px; border:0;} section tr:nth-child(even) {background:#eef3f5;}
`;
// Keep independent work after the completed discrete-model explanations, before
// the story moves on. Only the following slide contains the numerical answers.
const challengePairs = [
  {
    after:'並び方を数える記号：C',
    problem:`<!-- _class: challenge -->

## チャレンジ①　学園祭の受付チーム

<div class="challenge-time">自分で解く　10分　／　教科書 p.119</div>

**6人** の学生から、受付を担当する **3人** を選ぶ。
役職はなく、選ぶ順番も区別しない。

**(1)** チームは何通り作れるか。使う $C$ と途中式を書け。

**(2)** Aさんが必ず入る場合、チームは何通りになるか。

**(3)** (1)で $6\\times5\\times4$ と計算するだけではいけない理由は？

${note('教科書・電卓可。同じ3人を違う順番で選んだら、別のチームになるか考えよう。')}

<!--
進行：個人で10分。n=6、x=3を自分で特定し、階乗を約分する。
(1) C(6,3)=6!/(3!3!)=(6×5×4)/(3×2×1)=20通り。
(2) Aさんを先に固定し、残り5人から2人を選ぶ。C(5,2)=10通り。
(3) 6×5×4=120は同じ3人の選ぶ順番を3!=6回ずつ数えるため、6で割る。
確認ポイント：役職を割り当てないので順列ではない。Aさんを固定したら、選ぶ人数も候補者数も1減る。
-->`,
    check:`<!-- _class: challenge-check -->

## 答え合わせ①　同じ3人なら、同じチーム

${math(String.raw`\begin{aligned}
{}_6C_3&=\frac{6!}{3!3!}=\frac{6\times5\times4}{3\times2\times1}=20\\
{}_5C_2&=\frac{5!}{2!3!}=10
\end{aligned}`)}

**自由に選ぶ：20通り　／　Aさんを含む：10通り**

同じ3人を並べる順番は $3!=6$ 通り。その重複を割って除く。

${go('combinations')}

${note('並びのラボで n=6、ロボット3体に設定。ロボットの位置を「選ばれた学生」と読み替えると20通り。')}`
  },
  {
    after:'野球ラボ：1打席と1試合を分ける',
    problem:`<!-- _class: challenge -->

## チャレンジ②　6個のセンサーを検品

<div class="challenge-time">自分で解く　10分　／　教科書 p.118–120</div>

ロボット工場で、センサーを **6個** 検査する。1個の合格率は **85％**。
各検査は独立で、合格率は一定とする。合格個数を $X$ とする。

**(1)** ちょうど5個が合格する確率を求めよ。

**(2)** 1個以上が不合格になる確率を求めよ。

**(3)** 合格個数の期待値と分散を求めよ。

${note('授業用の仮想設定。教科書・電卓可。Xは「合格個数」。(2)をXの範囲に直してから、式を書こう。')}

<!--
進行：個人で10分。n=6、π=0.85。不合格の確率は0.15。
(1) P(X=5)=C(6,5)×0.85^5×0.15=0.39933478125、約39.93％。
(2) 1個以上不合格はX≤5。P(X≤5)=1-P(X=6)=1-0.85^6=0.622850484375、約62.29％。
(3) E(X)=6×0.85=5.1個、Var(X)=6×0.85×0.15=0.765個²。
確認ポイント：(2)をP(X≥1)としてはいけない。Xは合格個数なので、全て合格の反対を考える。
-->`,
    check:`<!-- _class: challenge-check -->

## 答え合わせ②　不合格は、全て合格の反対

${math(String.raw`\begin{aligned}
\Pr(X=5)&={}_6C_5(0.85)^5(0.15)\approx0.3993\\
\Pr(X\le5)&=1-\Pr(X=6)=1-(0.85)^6\approx0.6229\\
E(X)&=6\times0.85=5.1\\
\operatorname{Var}(X)&=6\times0.85\times0.15=0.765
\end{aligned}`)}

**5個合格：約39.93％　／　1個以上不合格：約62.29％**

${go('nba')}

${note('同じ二項モデルで確認：NBAラボの成功を合格と読み替え、n=6、成功率85％、x=5に設定。(2)はx=6の確率を1から引く。')}`
  },
  {
    after:'二項からポアソンへの橋',
    problem:`<!-- _class: challenge -->

## チャレンジ③　サポート窓口への問い合わせ

<div class="challenge-time">自分で解く　10分　／　教科書 p.120</div>

学内のサポート窓口に、平均 **10分あたり3件** の問い合わせが届く。
到着は一定の率で独立に起こるポアソン過程とする。
次の **15分間** に届く件数を $X$ とする。

**(1)** この15分間の平均件数 $\\lambda$ を求めよ。

**(2)** ちょうど4件届く確率と、2件以上届く確率を求めよ。

**(3)** 期待値と分散を求めよ。平均件数が小数でもよい理由は？

${note('教科書・電卓・配布ポアソン分布表を使用可。時間の単位をそろえ、表で読む列と行、途中計算を書く。')}

<!--
進行：個人で10分。λの時間単位と、2件以上の補集合を確認する。
λ=3×15/10=4.5。配布表のμ=4.5列、x=4行からP(X=4)≈0.190、約19.0％。
同じ列のx=0行は0.011、x=1行は0.050。P(X≥2)≈1-(0.011+0.050)=0.939、約93.9％。
E(X)=Var(X)=λ=4.5。期待値は4.5件、分散は4.5件²。
実現値は整数だが、多数の15分間の平均は小数でもよい。平均4.5件は、1回に4.5件届くという意味ではない。
確認ポイント：2件以上では0件と1件の両方を除く。15分を試行回数n=15と誤解しない。
-->`,
    check:`<!-- _class: challenge-check poisson-check -->

## 答え合わせ③　15分間の平均は4.5件

${math(String.raw`\lambda=3\times\frac{15}{10}=4.5\quad\Rightarrow\quad\text{表の }\mu=4.5\text{ の列}`)}

<div class="lookup-layout"><div><div class="lookup-caption">μ = 4.5 の列を読む</div>${tableExcerpt(['0','1','4'],'4.5')}</div><div>

${math(String.raw`\begin{aligned}
\Pr(X=4)&\approx0.190=19.0\%\\
\Pr(X\ge2)&=1-\{\Pr(X=0)+\Pr(X=1)\}\\
&\approx1-(0.011+0.050)\\
&=0.939=93.9\%\\
E(X)&=\operatorname{Var}(X)=4.5
\end{aligned}`)}

</div></div>

${go('costco')}

${note('表の丸め値で計算。件数は整数でも、繰り返した平均は小数でよい。ラボは10分あたり3、観察15分。')}`
  }
];
for (const pair of challengePairs) {
  const index=slides.findIndex(slide=>slide.includes(`## ${pair.after}\n`));
  if(index<0)throw new Error(`Missing challenge anchor: ${pair.after}`);
  slides.splice(index+1,0,pair.problem,pair.check);
}
writeFileSync(resolve(here, 'w3.md'), `---\nmarp: true\ntheme: default\nsize: 16:9\npaginate: true\nmath: katex\nfooter: '統計学B · Week 3'\n---\n\n<style>\n${css}\n</style>\n\n${slides.join('\n\n---\n\n')}\n`);
console.log(`Week 3: ${slides.length} slides. NBA → binomial → Costco → Poisson → continuous → mean & variance.`);
