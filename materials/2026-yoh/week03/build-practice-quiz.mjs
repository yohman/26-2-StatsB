import {readFileSync,writeFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {walkthrough} from './challenge-walkthrough.mjs';
const here=dirname(fileURLToPath(import.meta.url));
const lecture=readFileSync(resolve(here,'w3.md'),'utf8');
const style=lecture.match(/<style>[\s\S]*?<\/style>/)[0];
const math=value=>`$$\n${value}\n$$`;
const note=value=>`<div class="note">${value}</div>`;
const slides=[
`## 余った時間で、もう一歩！

<div class="chapter">Week 3 · 追加練習クイズ</div>

**組合せ → 二項分布 → ポアソン分布**

3問・各5分が目安。教科書・電卓・配布ポアソン分布表を使ってよい。

**何を数える？　どのモデル？　どの値を入れる？**

${note('答えは次のスライド。進む前に確認画面が出ます。途中式と、答えの意味を自分の言葉で書こう。')}`,
`<!-- _class: challenge -->

## チャレンジ①　ロボット展示の代表を選ぶ

<div class="challenge-time">自分で解く　5分　／　教科書 p.119</div>

展示候補の **8体** から **3体** を選ぶ。並べる順番は区別しない。
このうち、人気ロボットは **AとBの2体** である。

**(1)** 制限なく選ぶと、何通りあるか。

**(2)** AとBの **少なくとも一方** を含めると、何通りか。

**(3)** AとBの **両方** を含めると、何通りか。

${note('「少なくとも一方」は、両方を選ぶ場合も含む。数え落としや重複を避ける方法を考えよう。')}`,
`<!-- _class: challenge-check -->

## 答え合わせ①　選ばない場合を引く

${math(String.raw`\begin{aligned}
\text{(1) 全て}&:\quad {}_8C_3=\frac{8\times7\times6}{3\times2\times1}=56\\
\text{(2) 少なくとも一方}&:\quad {}_8C_3-{}_6C_3=56-20=36\\
\text{(3) 両方}&:\quad {}_6C_1=6
\end{aligned}`)}

**(2)** 全56通りから、AもBも選ばない20通りを引く。

**(3)** AとBを先に選ぶ。残り6体から、あと1体だけ選ぶ。

${note('Aを含む場合とBを含む場合を単純に足すと、両方を含む6通りを二重に数えてしまう。')}`,
`<!-- _class: challenge -->

## チャレンジ②　配達ロボットは8回中何回成功？

<div class="challenge-time">自分で解く　5分　／　教科書 p.118–120</div>

1回の配達に成功する確率は **75％**。成功率は毎回同じで、各配達は独立とする。
**8回** の配達のうち、成功する回数を $X$ とする。

**(1)** ちょうど6回成功する確率を、式に値を代入して求めよ。

**(2)** 7回以上成功する確率を求めよ。

**(3)** 成功回数の期待値と分散を求めよ。

${note('「7回以上」は、どの成功回数を足せばよい？　小数第4位程度まで計算し、％でも答えよう。')}`,
`<!-- _class: challenge-check -->

## 答え合わせ②　「以上」は複数の結果を足す

${math(String.raw`\begin{aligned}
X&\sim\operatorname{Bin}(8,0.75)\\
\Pr(X=6)&={}_8C_6(0.75)^6(0.25)^2\approx0.3115=31.15\%\\
\Pr(X\ge7)&={}_8C_7(0.75)^7(0.25)+{}_8C_8(0.75)^8\\
&\approx0.2670+0.1001=0.3671=36.71\%\\
E(X)&=8\times0.75=6\\
\operatorname{Var}(X)&=8\times0.75\times0.25=1.5
\end{aligned}`)}

${note('8回の配達を何度も繰り返したとき、平均成功回数は6回。毎回必ず6回成功するという意味ではない。')}`,
`<!-- _class: challenge -->

## チャレンジ③　図書館の返却ボックス

<div class="challenge-time">自分で解く　5分　／　教科書 p.120</div>

返却ボックスに、平均 **10分あたり2冊** の本が返される。
返却は一定の率で独立に起こるポアソン過程とする。
次の **15分間** に返される冊数を $X$ とする。

**(1)** $\\lambda$ を求め、表で読む列を示せ。

**(2)** ちょうど2冊返される確率と、3冊以上返される確率を求めよ。

**(3)** 期待値と分散を求めよ。

${note('配布ポアソン分布表を使用。3冊以上の反対は？　表の各マスは「ちょうど」の確率。')}`,
`<!-- _class: challenge-check poisson-check -->

## 答え合わせ③　時間をそろえて、表を読む

${math(String.raw`\lambda=2\times\frac{15}{10}=3\quad\Rightarrow\quad\text{表の }\mu=3.0\text{ の列}`)}

| 表の行 $x$ | 0冊 | 1冊 | 2冊 |
| --- | --- | --- | --- |
| $\\Pr(X=x)$ | 0.050 | 0.149 | 0.224 |

${math(String.raw`\begin{aligned}
\Pr(X=2)&\approx0.224=22.4\%\\
\Pr(X\ge3)&=1-\{\Pr(X=0)+\Pr(X=1)+\Pr(X=2)\}\\
&\approx1-(0.050+0.149+0.224)=0.577=57.7\%\\
E(X)&=\operatorname{Var}(X)=3
\end{aligned}`)}

${note('表の丸め値を使用。期待値は3冊、分散は3冊²。15分だからλ=15、ではない。')}`
];
const quizWalkthroughs=[
  {
    title:'答え合わせ①　選ばない場合を引く',
    given:String.raw`候補は $n=8$ 体、選ぶ数は $x=3$ 体。人気ロボットはA・Bの2体。<br>順番は区別しない。AもBも選ばない場合、候補は6体。`,
    formula:String.raw`\begin{aligned}{}_nC_x&=\frac{n!}{x!(n-x)!}\\\text{少なくとも一方}&:\ {}_nC_x-{}_{n-2}C_x\\\text{両方}&:\ {}_{n-2}C_{x-2}\end{aligned}`,
    substitution:String.raw`\begin{aligned}{}_8C_3&=\frac{8\times7\times6}{3\times2\times1}=56\\{}_8C_3-{}_6C_3&=56-20=36\\{}_6C_1&=6\end{aligned}`,
    result:'制限なし：56通り。少なくとも一方：36通り。両方：6通り。',
    note:'少なくとも一方は、全てから「どちらも選ばない」を引く。両方を固定すると、あと1体を残り6体から選ぶ。'
  },
  {
    title:'答え合わせ②　「以上」は複数の結果を足す',
    given:String.raw`$X$ は成功回数。$n=8,\ \pi=0.75,\ 1-\pi=0.25$。<br>ちょうど6回：$X=6$。7回以上：$X=7$ または $8$。各配達は独立。`,
    formula:String.raw`\begin{aligned}\Pr(X=x)&={}_nC_x\pi^x(1-\pi)^{n-x}\\\Pr(X\ge k)&=\sum_{x=k}^{n}\Pr(X=x)\\E(X)&=n\pi\\\operatorname{Var}(X)&=n\pi(1-\pi)\end{aligned}`,
    substitution:String.raw`\begin{aligned}\Pr(X=6)&={}_8C_6(0.75)^6(0.25)^2\\\Pr(X\ge7)&={}_8C_7(0.75)^7(0.25)\\&\quad+{}_8C_8(0.75)^8\\&\approx0.2670+0.1001=0.3671\\E(X)&=8\times0.75=6\\\operatorname{Var}(X)&=8\times0.75\times0.25=1.5\end{aligned}`,
    result:'6回成功：約31.15％。7回以上成功：約36.71％。',
    note:'期待値6回、分散1.5回²。平均6回とは、毎回必ず6回成功するという意味ではない。'
  },
  {
    title:'答え合わせ③　時間をそろえて、表を読む',
    given:String.raw`平均10分あたり2冊。観察時間 $t=15$ 分。$X$ は返却冊数。<br>求める確率：$X=2$ と $X\ge3$。一定の率で独立に返却される。`,
    formula:String.raw`\begin{aligned}\lambda&=\text{1分あたりの平均冊数}\times t\\\Pr(X=x)&=\frac{\lambda^xe^{-\lambda}}{x!}\\\Pr(X\ge k)&=1-\sum_{x=0}^{k-1}\Pr(X=x)\\E(X)&=\operatorname{Var}(X)=\lambda\end{aligned}`,
    substitution:String.raw`\begin{aligned}\lambda&=\frac{2}{10}\times15=3\\\text{表の }\mu=3.0&:\ P_0=0.050,\ P_1=0.149\\&\phantom{:}\ P_2=0.224\\\Pr(X\ge3)&\approx1-(0.050+0.149+0.224)\\&=0.577\\E(X)&=\operatorname{Var}(X)=3\end{aligned}`,
    result:'ちょうど2冊：約22.4％。3冊以上：約57.7％。',
    note:'P₀・P₁・P₂は、表のx=0・1・2行の「ちょうど」の確率。期待値3冊、分散3冊²。表の丸め値を使用。'
  }
];
quizWalkthroughs.forEach((answer,i)=>{slides[2+i*2]=walkthrough(answer);});
writeFileSync(resolve(here,'practice-quiz.md'),`---\nmarp: true\ntheme: default\nsize: 16:9\npaginate: true\nmath: katex\nfooter: '統計学B · Week 3 · 追加練習'\n---\n\n${style}\n\n${slides.join('\n\n---\n\n')}\n`);
console.log(`Practice quiz: ${slides.length} slides, three guarded problem/solution pairs.`);
