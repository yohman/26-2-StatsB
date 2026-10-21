import {walkthrough} from '../week03/challenge-walkthrough.mjs';
import {newsMoments} from './news-moments.mjs';
const math=s=>`$$\n${s}\n$$`;
const question=(no,title,body)=>`<!-- _class: challenge -->\n\n## チャレンジ${no}　${title}\n\n<div class="challenge-time">自分で解く　3分 ／ 教科書 p.118–120</div>\n\n${body}`;
const tableFile='other material/2025 yoh/06_[AL]確率分布_1_離散確率分布 ポアソン/ポアソン分布表.pdf';
const tableLink=`https://yohman.github.io/26-2-StatsB/viewer.html?${new URLSearchParams({p:'',file:tableFile,title:'ポアソン分布表',week:'W04',return:'agenda.html?p#week-04'})}`;
export function addReviewExercises(slides){
 const after=(title,...newSlides)=>{const i=slides.findIndex(s=>s.includes(`## ${title}\n`));if(i<0)throw Error(`Missing anchor: ${title}`);slides.splice(i+1,0,...newSlides);};
 const modelIndex=slides.findIndex(s=>s.includes('## モデルを選ぶ、最短の質問\n'));
 slides[modelIndex]=`## モデルを選ぶ、最短の質問

| 質問 | 二項分布 | ポアソン近似 | 時間内のポアソン |
| --- | --- | --- | --- |
| 与えられたもの | $n$回・成功率$\\pi$ | 大きい$n$・小さい$\\pi$ | 頻度$r$・期間$t$ |
| 平均 | $n\\pi$ | $\\lambda=n\\pi$ | $\\lambda=rt$ |
| 分散 | $n\\pi(1-\\pi)$ | $\\lambda$ | $\\lambda$ |

<div class="note">独立性、確率・頻度の一定性を確認する。ポアソン近似は元の二項分布を置き換える。時間のモデルは、指定した期間内の発生数を数える。</div>`;
 after('答えは7.29％。何の確率？',...newsMoments({id:'ai-schoolwork',n:5,p:.1,variable:'$X$＝5人のうち、宿題の全部・大部分でAIの助けを借りる人の数。'}));
 after('「ちょうど」と「以上」は違う',
  question('④','5回のシュートで、2〜3回成功',String.raw`ロボットがシュートを5回打つ。毎回の成功率は40％、各回は独立。

$X$＝成功回数。**2回以上、3回以下** 成功する確率を求めよ。

まず、含まれる $x$ の値と、確率を足す式を書こう。`),
  walkthrough({title:'答え合わせ④　2回と3回の確率を足す',given:String.raw`$n=5,\ \pi=0.4$。$X=2$ または $X=3$。`,formula:String.raw`\begin{aligned}\Pr(X=x)&={}_nC_x\pi^x(1-\pi)^{n-x}\\\Pr(a\le X\le b)&=\sum_{x=a}^{b}\Pr(X=x)\end{aligned}`,substitution:String.raw`\begin{aligned}\Pr(X=2)&={}_5C_2(0.4)^2(0.6)^3\\&=0.3456\\\Pr(X=3)&={}_5C_3(0.4)^3(0.6)^2\\&=0.2304\\\Pr(2\le X\le3)&=0.3456+0.2304=0.576\end{aligned}`,result:'2〜3回成功する確率は57.6％。',note:'同じ5回で「ちょうど2回」と「ちょうど3回」は同時に起こらないので、確率を足せる。'}));
 after('ポアソン分布の公式',`<!-- _class: book-reference -->

## λは「数えたい期間の平均個数」

${math(String.raw`\boxed{\lambda=rt}`)}

$r$＝単位時間あたりの平均回数。$t$＝観測する時間。

${math(String.raw`2\ \text{件/時間}\times1.5\ \text{時間}=3\ \text{件}`)}

| 与えられたもの | 平均個数の求め方 |
| --- | --- |
| 試行回数と成功率 | $\\lambda=n\\pi$（二項分布の近似） |
| 単位時間あたりの頻度と期間 | $\\lambda=rt$（時間内の発生数のモデル） |

<div class="note">時間の単位をそろえる。90分は1.5時間。一定頻度・独立な発生を仮定する。教科書p.120のポアソン分布を時間の例へ応用。</div>`,
  question('⑤','90分間で、1件以上の注文',String.raw`ロボット配達所への注文は平均 **1時間に2件**。
独立に、一定の頻度で届くポアソンモデルを仮定する。

$X$＝90分間の注文件数。

**(1)** $\lambda$ は？　**(2)** 1件以上届く確率は？

**(3)** この90分間の期待値と分散は？

配布のポアソン分布表を使おう。`),
  walkthrough({title:'答え合わせ⑤　90分に合わせて平均を変える',given:String.raw`$r=2$件/時間、$t=90/60=1.5$時間。$X$は90分の件数。`,formula:String.raw`\begin{aligned}\lambda&=rt\\\Pr(X\ge1)&=1-\Pr(X=0)\\E(X)&=\operatorname{Var}(X)=\lambda\end{aligned}`,substitution:String.raw`\begin{aligned}\lambda&=2\times1.5=3\\\text{表の }\mu=3.0,\ x=0&:\quad\Pr(X=0)\approx0.050\\\Pr(X\ge1)&\approx1-0.050=0.950\\E(X)&=3,\quad\operatorname{Var}(X)=3\end{aligned}`,result:'1件以上：約95.0％。期待値3件、分散3件²。',note:`表のμと公式のλは同じ平均。丸めた表の値を使用。<a href="${tableLink}">ポアソン分布表を開く</a>`}));
 after('モデルを選ぶ、最短の質問',
  question('⑥','計算する前に、モデルを選ぶ',String.raw`各場面で使うモデルと、その理由を答えよ。**Cは、通常の二項分布をそのまま使えるか？**

| 場面 | 与えられた条件 |
| --- | --- |
| A ロボットのシュート | 独立な5回、毎回40％成功 |
| B 工場の不良品 | 独立な2,500個、不良率0.2％。ポアソンで近似せよ |
| C 天井つきガチャ | 外れるたび、次の当たり確率が上がる |
| D 配達所の注文 | 平均2件/時間、独立・一定頻度。90分間を数える |`),
  walkthrough({title:'答え合わせ⑥　何が固定されているか',given:'Aは独立・確率一定の5回。Bは多数の製品と小さい不良率。\n\nCは確率が変わる。Dは時間内の発生数。',formula:String.raw`\begin{aligned}\text{二項: }X&\sim\mathrm{Bin}(n,\pi)\\\text{ポアソン: }X&\sim\mathrm{Pois}(\lambda)\\\lambda&=n\pi\ \text{または}\ rt\end{aligned}`,substitution:String.raw`\begin{aligned}\mathrm{A}:\quad n&=5,\quad\pi=0.4\\\mathrm{B}:\quad\lambda&=2500\times0.002=5\\\mathrm{C}:\quad\pi&\text{ が一定でない}\\\mathrm{D}:\quad\lambda&=2\times1.5=3\end{aligned}`,result:'A：二項。B：指定されたポアソン近似。\n\nC：通常の二項をそのまま使えない。D：ポアソンモデル。',note:'「まれだから」だけで決めず、独立性・確率や頻度の一定性を確認する。Cは確率の変化を含む別のモデルが必要。'}));
 after('AL 01　6つの結果で、100％になる',
  question('⑦','1本が最多なのに、平均は1.6本？',String.raw`打率0.32、5打席の選手。前のスライドの確率表を使おう。

**(1)** 最も起こりやすい安打数は何本？

**(2)** 期待値は何本？　1試合でその本数を打てる？

**(3)** (1)と(2)が違っても、矛盾しない理由を説明しよう。`),
  walkthrough({title:'答え合わせ⑦　最頻値と、長い目で見た平均',given:String.raw`$n=5,\ \pi=0.32$。表で最も高い確率は $\Pr(X=1)\approx0.3421$。`,formula:String.raw`\begin{aligned}E(X)&=\sum_{x=0}^{n}x\Pr(X=x)\\&=n\pi\end{aligned}`,substitution:String.raw`\begin{aligned}E(X)&=0\Pr(X=0)+1\Pr(X=1)\\&\quad+\cdots+5\Pr(X=5)\\&=5\times0.32=1.6\end{aligned}`,result:'最頻値は1本。期待値は1.6本。\n\n1試合の本数は整数。1.6本は多くの試合を繰り返した平均。',note:'最頻値は「一番高い棒」。期待値は「全ての本数を、その確率で重みづけした平均」。'}));
}
