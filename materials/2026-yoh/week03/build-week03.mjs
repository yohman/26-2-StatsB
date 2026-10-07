import {writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

// Narrative teaching source. The generated w3.md is also editable Marp Markdown.
const here = dirname(fileURLToPath(import.meta.url));
const slides = [];
const add = (title, content, style = '') => {
  slides.push(`${style ? `<!-- _class: ${style} -->\n\n` : ''}## ${title}\n\n${content}`);
  if(title === '「ちょうど4本」と「4本以上」は違う') slides.push(`## 成功数の「地図」が、二項分布\n\n![width:830px](images/nba-distribution.svg)\n\n${math(String.raw`\Pr(X\ge4)=\Pr(X=4)+\Pr(X=5)\approx95.75\%`)}\n\n${note('横軸：5本のうち成功した本数。縦軸：その成功数になる確率。緑の2本を足す。')}`);
  if(title === '式の中身を、人数で確かめる') slides.push(`## 5人以上は、右側の棒を全部足す\n\n![width:830px](images/costco-distribution.svg)\n\n${math(String.raw`\Pr(X\ge5)\approx55.95\%`)}\n\n${note('横軸：10分の到着人数。縦軸：その人数になる確率。図は14人まで。15人以上もあり、式では全て含める。')}`);
};
const math = value => `$$\n${value}\n$$`;
const go = (id, label = 'やってみよう！') => `[${label}](https://yohman.github.io/26-2-StatsB/agenda.html?activity=${id}#week-03)`;
const note = value => `<div class="note">${value}</div>`;
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

add('最後のフリースロー、誰に任せる？', `<div class="players"><img src="images/curry.png" alt="Stephen Curry"><img src="images/giannis.png" alt="Giannis Antetokounmpo"></div>\n\nカリー？　ヤニス？　「上手そう」から、数字で考えてみる。\n\n${note('写真・ストーリー：Yohの2025年講義。現在の選手成績を比較するスライドではありません。')}`, 'opening');
add('93％なら、5本全部入る？', `1本の成功率を **93％** として、5本のフリースローを考える。\n\n${panels([['チャンス','5本','何回投げるか'],['1本の成功率','93％','入る／外れる'],['知りたいこと','何本？','5本中の成功数']])}\n\nまず予想：全部成功する確率も93％？\n\n${note('π = 0.93 は2025年スライドから引き継ぐ授業用の設定。各投球は独立で、成功率は一定と仮定。')}`);
add('5本全部成功する確率は…', `${math(String.raw`\Pr(X=5)=(0.93)^5\approx0.6957`)}\n\n<div class="answer">約69.57％</div>\n\n1本ごとの93％と、5本全部の確率は違う。\n\n${note('成功・成功・成功・成功・成功 → 独立な5回の確率を掛ける。')}`);
add('Week 3 · 成功の回数、到着の人数', `NBAからコストコへ。\n\n**回数を固定する** → 二項分布\n\n**時間を固定する** → ポアソン分布\n\n<div class="route">4 離散確率分布　→　5 連続確率分布　→　6 平均値と分散</div>\n\n${note('教科書 第2章 第2節「確率分布」p.118–129 ／ Week 2の続き')}`, 'title');
ref('4','離散確率分布','p.118–120','成功した回数を数える。\n\nまずは **二項分布**：決まった回数の中で、何回成功するか。');
add('1本ならベルヌーイ、5本なら二項', `${panels([['1本の結果','0 または 1','外れる = 0 ／ 入る = 1'],['5本の成功数','0〜5','X = 5本のうち入った本数']])}\n\n${math(String.raw`Y\sim\mathrm{Bernoulli}(\pi),\qquad X\sim B(n,\pi)`)}\n\n${note('大文字 X は成功数を表す確率変数。実際に3本入ったら、実現値 x = 3。')}`, 'book-reference');
add('4本成功にも、5通りある', `<div class="sequences">● ● ● ● ×<br>● ● ● × ●<br>● ● × ● ●<br>● × ● ● ●<br>× ● ● ● ●</div>\n\n${math(String.raw`\Pr(X=4)=\underbrace{5}_{\text{並び方}}\times\underbrace{(0.93)^4(0.07)}_{\text{1通りの確率}}\approx26.18\%`)}\n\n${note('● = 成功 ／ × = 失敗。成功数は同じでも、失敗する位置が違う。')}`);
add('並び方を数える記号：C', `${math(String.raw`{}_nC_x=\frac{n!}{x!(n-x)!},\qquad {}_5C_4=5`)}\n\n${panels([['n','全部で何回？','5本投げる'],['x','成功は何回？','4本成功'],['C','何通り？','失敗する位置が5通り']])}\n\n${note('階乗 n! は n × (n−1) × … × 1。0! = 1。教科書 p.119。')}`, 'book-reference');
add('ロボットとヤギで、並び方を見よう', `🤖 🤖 🐐 🐐 🐐　　🤖 🐐 🤖 🐐 🐐\n\n5か所にロボット2体を置く。順番は何通り？\n\n${math(String.raw`{}_5C_2=\frac{5!}{2!3!}=10`)}\n\n${go('combinations')}\n\n${note('n と x のスライダーを動かす → 式の数字と、全ての並び方が変わる。')}`, 'try');
add('二項分布：式を3つに分ける', `${math(String.raw`\Pr(X=x)={}_nC_x\,\pi^x(1-\pi)^{n-x}`)}\n\n${panels([['並び方','ₙCₓ','成功の位置を選ぶ'],['成功','πˣ','x 回成功する'],['失敗','(1−π)ⁿ⁻ˣ','残り n−x 回は失敗']])}\n\n${note('n 回・独立・成功率 π が一定。この条件がそろったときに使う。教科書 p.119。')}`, 'book-reference');
add('「ちょうど4本」と「4本以上」は違う', `${math(String.raw`\begin{aligned}\Pr(X=4)&\approx26.18\%\\\Pr(X\ge4)&=\Pr(X=4)+\Pr(X=5)\approx95.75\%\end{aligned}`)}\n\n4本以上なら、**4本と5本の両方**を足す。\n\n${note('「以上」は、その値を含む。まず、どの結果を足すかを決めよう。')}`);
add('NBAラボ：予想して、投げて、比べる', `${math(String.raw`X\sim B(5,0.93),\qquad\Pr(X\ge4)\approx95.75\%`)}\n\n**①** 1セット5本。何本入った？\n\n**②** 100セット繰り返す。成功数の分布は？\n\n**③** 成功率を65％に変える。どの棒が変わる？\n\n${go('nba')}\n\n${note('線は理論の確率、棒は実測の割合。試行を増やしても毎回一致するわけではない。')}`, 'try');
add('平均4.65本。でも4.65本は入らない', `${math(String.raw`\begin{aligned}E(X)&=n\pi=5\times0.93=4.65\\\operatorname{Var}(X)&=n\pi(1-\pi)=5\times0.93\times0.07=0.3255\end{aligned}`)}\n\n**期待値**：5本のセットを何度も繰り返した平均。\n\n**分散**：セットごとの成功数のばらつき。\n\n${note('平均は小数でもよい。実際の成功数は0〜5の整数。教科書 p.120。')}`, 'book-reference');
add('NBAの話が、教科書の野球につながる', `打率32％の選手が5打席で **ちょうど3安打**。\n\n${math(String.raw`\Pr(X=3)={}_5C_3(0.32)^3(0.68)^2\approx0.151519`)}\n\n<div class="answer">約15.15％</div>\n\n${note('フリースローの成功 → ヒットに置き換えただけ。教科書 p.118–120の例。')}`, 'book-reference');
add('野球ラボ：1打席と1試合を分ける', `${math(String.raw`\underbrace{\pi=0.32}_{\text{1打席のヒット率}}\quad\ne\quad\underbrace{\Pr(X=3)\approx0.1515}_{\text{5打席で3安打の確率}}`)}\n\n1試合を5打席として、100試合を繰り返そう。\n\n**3安打の棒**と15.15％を比較する。\n\n${go('batting')}`, 'try');
add('今度は、回数が決まっていない', `<div class="wide-photo"><img src="images/costco.jpg" alt="Costco"></div>\n\nあなたはコストコでレジ担当。退勤まで、あと10分。\n\nその10分間に、**新しく何人来る？**\n\n${note('Yohの2025年講義のストーリーを、一定時間の到着人数として整理。')}`);
add('平均5人。でも、今日は3人？8人？', `<div class="photo-side"><img src="images/checkout.jpg" alt="Costco checkout"><div><div class="answer">10分で平均5人</div><p>0人、1人、2人、…<br>上限は決まっていない。</p><p>知りたいこと：<br><strong>ちょうど3人？　5人以上？</strong></p></div></div>\n\n${note('仮想の授業モデルです。実際のコストコの測定値ではありません。')}`);
ref('4','ポアソン分布','p.120','固定した時間・範囲の中に、何件起こるか。\n\n平均の発生数 **λ（ラムダ）** が、分布を決める。');
add('ポアソン：10分の平均をλにする', `${math(String.raw`X\sim\mathrm{Poisson}(\lambda),\qquad \Pr(X=x)=\frac{\lambda^xe^{-\lambda}}{x!}`)}\n\n${panels([['X','到着人数','10分間に新しく来た人'],['λ','5','その10分間の平均人数'],['x','3','求めたい人数']])}\n\n${note('λ = 平均人数。e ≈ 2.71828 は定数。確率式はYohの2025年講義を継承。')}`, 'book-reference');
add('ちょうど3人、来る確率は？', `${math(String.raw`\Pr(X=3)=\frac{5^3e^{-5}}{3!}=\frac{125\times0.0067379}{6}\approx0.14037`)}\n\n<div class="answer">約14.04％</div>\n\n平均5人だからといって、毎回5人ではない。\n\n${note('3! = 3 × 2 × 1 = 6。λ と x を入れて計算する。')}`);
add('5人以上？「4人以下」を引けばよい', `${math(String.raw`\begin{aligned}\Pr(X\ge5)&=1-\Pr(X\le4)\\&=1-\sum_{x=0}^{4}\frac{5^xe^{-5}}{x!}\\&\approx1-0.440493=0.559507\end{aligned}`)}\n\n<div class="answer">約55.95％</div>\n\n${note('5人以上は無限に続く。反対側の0〜4人を足して、1から引く。')}`);
add('式の中身を、人数で確かめる', `| 到着人数 x | 0 | 1 | 2 | 3 | 4 |\n| --- | --- | --- | --- | --- | --- |\n| 確率 | 0.67％ | 3.37％ | 8.42％ | 14.04％ | 17.55％ |\n\n${math(String.raw`\Pr(X\le4)\approx44.05\%,\qquad \Pr(X\ge5)\approx55.95\%`)}\n\n**0〜4人の棒を足す** → 残りが5人以上。\n\n${note('小数のまま足し、最後に丸める。丸めた表の合計にはわずかな誤差がある。')}`);
add('コストコラボ：10分間を何度も繰り返す', `${math(String.raw`\lambda=5,\qquad E(X)=\operatorname{Var}(X)=5`)}\n\n**①** 1回の10分間を再生。いつ、何人来た？\n\n**②** 100回繰り返して、人数の棒グラフを作る。\n\n**③** 時間を20分に。平均人数はどう変わる？\n\n${go('costco')}\n\n${note('到着時刻はランダム。平均到着率が一定なら、時間を2倍にするとλも2倍。')}`, 'try');
add('同じ「5」でも、二項とは違う', `${panels([['NBA','5本投げる','n = 5 ／ 成功数は0〜5'],['コストコ','平均5人来る','λ = 5 ／ 人数は0,1,2,…']])}\n\n${math(String.raw`\text{二項}:\ E(X)=n\pi\qquad\text{ポアソン}:\ E(X)=\lambda`)}\n\n**試行回数**と**平均発生数**を取り違えない。`);
add('ポアソンを使う前に、条件を確認', `**独立**：1人の到着が、次の到着を決めない。\n\n**一定の率**：時間帯の途中で混雑度が急変しない。\n\n**小さな時間では、複数の到着はまれ**。\n\n${note('団体客、セール開始、混雑による相互作用があるなら、このモデルが合わない可能性。到着人数だけでは退勤時刻は決まりません。')}`);
add('二項からポアソンへの橋', `${math(String.raw`n\ \text{が大きく},\quad\pi\ \text{が小さく},\quad n\pi=\lambda`)}\n\nたくさんの小さなチャンスから、まれに発生する。\n\n${math(String.raw`B(n,\pi)\approx\mathrm{Poisson}(n\pi)`)}\n\n${go('probability')}\n\n${note('ベルヌーイ・二項・ポアソンの棒を比較。教科書 p.120の近似の考え方。')}`, 'book-reference');
ref('5','連続確率分布','p.121–128','人数ではなく、長さ・時間・測定値を扱う。\n\n棒の高さではなく、**範囲の面積**が確率。');
add('ロボットの身長は、小数まで測れる', `🤖　🤖　🤖　　160.2 cm？　160.23 cm？\n\n${math(String.raw`\Pr(a<X\le b)=\int_a^b f(x)\,dx=F(b)-F(a)`)}\n\n**密度 f(x)**：どの付近に値が集まるか。\n\n**累積分布 F(b)**：b 以下になる確率。\n\n${note('一点の確率は0。全範囲の面積は1。Week 2のAL2と同じ「面積」の考え方。教科書 p.121。')}`, 'book-reference');
add('正規分布：平均を中心に、左右対称', `${math(String.raw`X\sim N(\mu,\sigma^2),\qquad Z=\frac{X-\mu}{\sigma}`)}\n\n中心は **μ**。広がりは **σ**。\n\nロボットの身長モデルで、平均と標準偏差を動かす。\n\n${go('normal-w2')}\n\n${note('μ±σ に約68％、μ±2σ に約95％。正規モデルでの割合。教科書 p.122–124。')}`, 'book-reference');
add('標準正規分布表は「面積」の表', `${math(String.raw`\Pr(Z>1.96)=0.025,\qquad\Pr(Z\le1.96)=1-0.025=0.975`)}\n\n教科書の表：**右側の裾の面積**を読む。\n\n左右対称だから、左の裾も同じ面積。\n\n${math(String.raw`\Pr(-1.96<Z<1.96)=1-2(0.025)=0.95`)}\n\n${note('同じz値でも、「右側」「左側」「中央」のどれを求めるかで答えが変わる。教科書 p.124–125。')}`, 'book-reference');
add('t分布：標本から平均を考えるとき', `${math(String.raw`T=\frac{\bar X-\mu}{s/\sqrt n},\qquad\nu=n-1`)}\n\n母集団の標準偏差が未知 → 標本の **s** を使う。\n\n標本が小さいほど、正規分布より裾が厚い。\n\n${go('t-w2')}\n\n${note('正規母集団からの独立標本を想定。nを増やして裾を比較しよう。教科書 p.125–127。後の推定で再登場。')}`, 'book-reference');
add('カイ二乗分布：ばらつきを調べるとき', `${math(String.raw`\chi^2=\frac{(n-1)s^2}{\sigma^2},\qquad\nu=n-1`)}\n\n平均との差を **二乗** して足す → 負にはならない。\n\n自由度が小さいと、右の裾が長い。\n\n${go('chi-w2')}\n\n${note('正規母集団からの独立標本を想定。平均ではなく分散を調べる道具。教科書 p.127–128。')}`, 'book-reference');
ref('6','確率分布の平均値と分散','p.129','分布が変わっても、聞きたいことは同じ。\n\n**どこが中心？　どれくらい散らばる？**');
add('期待値：値 × 起こりやすさ', `${math(String.raw`\mu_X=E(X)=\sum_x x\Pr(X=x)`)}\n\n離散：各値の「値 × 確率」を全部足す。\n\n${math(String.raw`\mu_X=E(X)=\int_{-\infty}^{\infty}x f(x)\,dx`)}\n\n連続：小さな区間ごとの寄与を、積分で足す。\n\n${note('Week 2のくじとAL2でやった計算が、教科書 p.129の一般式につながる。')}`, 'book-reference');
add('分散：平均との差を二乗して平均する', `${math(String.raw`\sigma_X^2=\operatorname{Var}(X)=\sum_x(x-\mu_X)^2\Pr(X=x)`)}\n\n${math(String.raw`\sigma_X^2=\int_{-\infty}^{\infty}(x-\mu_X)^2f(x)\,dx`)}\n\n差を二乗するので、プラスとマイナスが打ち消されない。\n\n${note('分散の単位は元の単位の二乗。標準偏差は √Var(X) で、元の単位に戻る。教科書 p.129。')}`, 'book-reference');
add('平均が同じでも、安心感は違う', `配達ロボットA：いつも30分。\n\n配達ロボットB：10分か50分、半々。\n\n${math(String.raw`E(A)=E(B)=30,\qquad\operatorname{Var}(A)=0,\quad\operatorname{Var}(B)=400`)}\n\n${go('delivery')}\n\n${note('平均だけでなく、ばらつきも見る。「30分で届く」の意味が変わる。')}`, 'try');
add('どの分布？　まず質問を言葉にする', `| 問いたいこと | モデル | 中心・ばらつき |\n| --- | --- | --- |\n| 1回の成功／失敗 | ベルヌーイ | π ／ π(1−π) |\n| n回中、何回成功？ | 二項 | nπ ／ nπ(1−π) |\n| 一定時間に、何件発生？ | ポアソン | λ ／ λ |\n| 測定値・平均・分散 | 連続分布 | 値の範囲と面積を見る |\n\n${note('表の「中心・ばらつき」は期待値／分散。式を選ぶ前に、X・条件・求める範囲を決める。')}`);
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
.detail {font-size:20px; color:#48585e;} .players {display:flex; gap:20px;} .players img {width:calc(50% - 10px); height:230px; object-fit:cover; border-radius:12px;}
section.opening h2 {font-size:48px;} section.title {background:#173c50; color:#fff;} section.title h2,section.title strong {color:#fff;}
section.title .note {color:#b6d3df;} .route {font-size:23px; color:#c0e7f4; margin-top:30px;}
section.book-divider {background:#e7f3fa; border-top:12px solid #399ac8;} section.book-divider h2 {font-size:23px; color:#237da7; margin-bottom:40px;}
.chapter {font-size:56px; color:#184762; font-weight:800;} .pages {font-size:28px; color:#237da7; margin:15px 0 34px;}
section.book-reference {background:#f0f7fb; border-top:7px solid #399ac8;} section.book-reference h2 {color:#216a91;}
section.try {background:#edf5ef; border-top:7px solid #388065;} section.try h2 {color:#2b624b;}
section a[href*="agenda.html?activity="] {display:inline-block; background:#176d82; color:white; font-weight:700; text-decoration:none; padding:13px 28px; border-radius:8px; font-size:27px;}
.sequences {display:inline-block; font-size:29px; letter-spacing:14px; line-height:1.45; color:#176d82; margin:0 0 6px 310px;}
.wide-photo img {width:100%; height:265px; object-fit:cover; border-radius:12px;} .photo-side {display:flex; align-items:center; gap:35px;}
.photo-side img {width:48%; height:320px; object-fit:cover; border-radius:12px;} .photo-side .answer {font-size:40px; text-align:left;}
section table {width:100%; margin:20px 0; border-collapse:collapse; font-size:23px;} section th {background:#dcecf3; padding:15px; border:0;}
section td {padding:15px; border:0;} section tr:nth-child(even) {background:#eef3f5;}
`;
writeFileSync(resolve(here, 'w3.md'), `---\nmarp: true\ntheme: default\nsize: 16:9\npaginate: true\nmath: katex\nfooter: '統計学B · Week 3'\n---\n\n<style>\n${css}\n</style>\n\n${slides.join('\n\n---\n\n')}\n`);
console.log(`Week 3: ${slides.length} slides. NBA → binomial → Costco → Poisson → continuous → mean & variance.`);
