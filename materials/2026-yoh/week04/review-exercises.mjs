import {walkthrough} from '../week03/challenge-walkthrough.mjs';
import {newsMoments} from './news-moments.mjs';
const math=s=>`$$\n${s}\n$$`;
const question=(no,title,body)=>`<!-- _class: challenge -->\n\n## チャレンジ${no}　${title}\n\n<div class="challenge-time">自分で解く　3分 ／ 教科書 p.118–120</div>\n\n${body}`;
export function addReviewExercises(slides){
 const after=(title,...newSlides)=>{const i=slides.findIndex(s=>s.includes(`## ${title}\n`));if(i<0)throw Error(`Missing anchor: ${title}`);slides.splice(i+1,0,...newSlides);};
 const modelIndex=slides.findIndex(s=>s.includes('## モデルを選ぶ、最短の質問\n'));
 slides[modelIndex]=`## モデルを選ぶ、最短の質問

| 質問 | 二項分布 | ポアソン近似 |
| --- | --- | --- |
| 与えられたもの | $n$回・成功率$\\pi$ | 大きい$n$・小さい$\\pi$ |
| 期待値 $E(X)$ | $n\\pi$ | $\\lambda=n\\pi$ |
| 分散 | $n\\pi(1-\\pi)$ | $\\lambda=n\\pi$ |

<div class="note">独立・確率一定を確認する。教科書p.120のポアソン近似では、nが大きくπが小さいとき、平均・分散にnπを使う。</div>`;
 after('答えは7.29％。何の確率？',...newsMoments({id:'ai-schoolwork',n:5,p:.1,variable:'$X$＝5人のうち、宿題の全部・大部分でAIの助けを借りる人の数。'}));
 after('「ちょうど」と「以上」は違う',
  question('④','5回のシュートで、2〜3回成功',String.raw`ロボットがシュートを5回打つ。毎回の成功率は40％、各回は独立。

$X$＝成功回数。**2回以上、3回以下** 成功する確率を求めよ。

まず、含まれる $x$ の値と、確率を足す式を書こう。`),
  walkthrough({title:'答え合わせ④　2回と3回の確率を足す',given:String.raw`$n=5,\ \pi=0.4$。$X=2$ または $X=3$。`,formula:String.raw`\begin{aligned}\Pr(X=x)&={}_nC_x\pi^x(1-\pi)^{n-x}\\\Pr(a\le X\le b)&=\sum_{x=a}^{b}\Pr(X=x)\end{aligned}`,substitution:String.raw`\begin{aligned}\Pr(X=2)&={}_5C_2(0.4)^2(0.6)^3\\&=10\times0.16\times0.216=34.56\%\\\Pr(X=3)&={}_5C_3(0.4)^3(0.6)^2\\&=10\times0.064\times0.36=23.04\%\\\Pr(2\le X\le3)&=0.3456+0.2304=57.6\%\end{aligned}`,result:'2〜3回成功する確率は57.6％。',note:'同じ5回で「ちょうど2回」と「ちょうど3回」は同時に起こらないので、確率を足せる。'}));
 after('ポアソン分布の公式',`<!-- _class: book-reference -->

## λは「n回で起こる個数の平均」

${math(String.raw`\boxed{\lambda=n\pi}`)}

$n$＝試行回数。$\\pi$＝1回あたりの発生確率。

${math(String.raw`n=2500,\quad\pi=0.002\quad\Longrightarrow\quad\lambda=2500\times0.002=5`)}

**2,500個のうち、平均5個の不良品。**

${math(String.raw`E(X)=n\pi=5,\qquad\operatorname{Var}(X)\approx n\pi=5`)}

<div class="note">教科書p.120は、ポアソン分布の平均と分散をnπで示す。分布表の平均λ（表ではμ）にも、同じnπを入れる。独立・不良率一定を仮定する。</div>`);
 after('AL 01　6つの結果で、100％になる',
  question('⑦','1本が最多なのに、平均は1.6本？',String.raw`打率0.32、5打席の選手。前のスライドの確率表を使おう。

**(1)** 最も起こりやすい安打数は何本？

**(2)** 期待値は何本？　1試合でその本数を打てる？

**(3)** (1)と(2)が違っても、矛盾しない理由を説明しよう。`),
  walkthrough({title:'答え合わせ⑦　最頻値と、長い目で見た平均',given:String.raw`$n=5,\ \pi=0.32$。表で最も高い確率は $\Pr(X=1)\approx0.3421$。`,formula:String.raw`\begin{aligned}E(X)&=\sum_{x=0}^{n}x\Pr(X=x)\\&=n\pi\end{aligned}`,substitution:String.raw`\begin{aligned}E(X)&=0\Pr(X=0)+1\Pr(X=1)\\&\quad+\cdots+5\Pr(X=5)\\&=5\times0.32=1.6\end{aligned}`,result:'最頻値は1本。期待値は1.6本。\n\n1試合の本数は整数。1.6本は多くの試合を繰り返した平均。',note:'最頻値は「一番高い棒」。期待値は「全ての本数を、その確率で重みづけした平均」。'}));
}
