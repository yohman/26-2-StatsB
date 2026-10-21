import {walkthrough} from '../week03/challenge-walkthrough.mjs';
const number=n=>Number(n.toFixed(8)).toString();
// Separate the moments exercise from the original probability calculation.
export function newsMoments(e,poisson=false){
 const mean=poisson?e.lambda:e.n*e.p, variance=poisson?e.lambda:mean*(1-e.p);
 const given=poisson?`${e.momentsGiven}\n\n独立・一定頻度のポアソンモデルを仮定する。`:`${e.variable}\n\n$n=${e.n},\\quad\\pi=${number(e.p)}$。独立・一定の確率を仮定する。`;
 const question=`<!-- _class: challenge -->

## チャレンジ${poisson?'②':'①'}　${['ai-companions','poisson-bears'].includes(e.id)?'期待値と分散を求めよう':'平均個数と、ばらつきは？'}

<div class="challenge-time">自分で解く　3分 ／ 教科書 p.119–120</div>

${given}

**(1)** 同じ条件の組・期間を繰り返すとき、$X$ の期待値と分散を求めよ。

**(2)** 期待値を「起こる確率」と言い換えてよいか？

**(3)** 現実では、独立・一定の${poisson?'頻度':'確率'}という仮定が崩れるのはどんな場合か？

<div class="note">期待値は個数の単位、分散はその単位の2乗。前の確率問題と同じXを使う。</div>`;
 const formula=poisson?String.raw`\begin{aligned}\lambda&=${e.n?String.raw`n\pi`:'rt'}\\E(X)&=\lambda\\\operatorname{Var}(X)&=\lambda\end{aligned}`:String.raw`\begin{aligned}E(X)&=n\pi\\\operatorname{Var}(X)&=n\pi(1-\pi)\end{aligned}`;
 const substitution=poisson?String.raw`\begin{aligned}\lambda&=${number(e.n??e.rate)}\times${number(e.p??e.time)}=${number(e.lambda)}\\E(X)&=${number(e.lambda)}\\\operatorname{Var}(X)&=${number(e.lambda)}\end{aligned}`:e.id==='ai-companions'?String.raw`\begin{aligned}E(X)&=6\times\frac34=\frac92=4.5\\\operatorname{Var}(X)&=6\times\frac34\times\frac14\\&=\frac98=1.125\end{aligned}`:String.raw`\begin{aligned}E(X)&=${e.n}\times${number(e.p)}=${number(mean)}\\\operatorname{Var}(X)&=${e.n}\times${number(e.p)}\times${number(1-e.p)}\\&=${number(variance)}\end{aligned}`;
 const unit=e.id==='ai-news-errors'?'件':poisson?(e.id==='poisson-bears'?'日':'個'):'人';
 const answer=walkthrough({title:'答え合わせ　期待値は、確率ではなく個数',given,formula,substitution,result:`期待値 ${number(mean)}${unit}。分散 ${number(variance)}${unit}²。\n\n同じ条件を繰り返した平均であり、毎回この個数になる保証ではない。`,note:`期待値を％にしても、事象の確率にはならない。仮定が崩れる例：${poisson?e.caution:e.id==='ai-news-errors'?'同じニュースの回答は、共通の情報源によって誤りが重なる。':e.id==='ai-companions'?'友人同士で利用行動が似る。集団によって利用率も違う。':e.id==='ai-schoolwork'?'友人同士でAIの使い方が似る。学校や課題によって割合が変わる。':'友人同士の意見が似る。年齢層や時期で割合が変わる。'}`});
 return [question,answer];
}
