---
marp: true
theme: default
size: 16:9
paginate: true
math: katex
footer: '統計学B · Week 3 · 追加練習'
---

<style>

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
section.normal-table .katex-display {margin:10px 0;}
section.normal-table th, section.normal-table td {padding:8px 13px;}
section.normal-table .note {font-size:16px; margin-top:10px;}
section.normal-table a[href*="viewer.html?"] {display:inline-block; background:#176d82; color:white; padding:9px 20px; border-radius:8px; font-size:22px; font-weight:700; text-decoration:none;}
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


section.worked-answer {font-size:25px; padding:32px 60px 70px;}
section.worked-answer h2 {font-size:38px; margin-bottom:10px;}
.worked-label {font-size:20px; font-weight:800; color:#2b624b; margin:4px 0;}
.worked-given {font-size:23px; margin:0 0 8px;}
.worked-columns {display:grid; grid-template-columns:1fr 1.15fr; gap:26px; align-items:start;}
.worked-columns > div + div {border-left:2px solid #b7d1c2; padding-left:26px;}
section.worked-answer .katex-display {font-size:.83em; margin:8px 0; text-align:left;}
.worked-result {border-top:2px solid #b7d1c2; margin-top:9px; padding-top:6px;}
.worked-result p {font-size:26px; color:#215d45; font-weight:700; margin:4px 0;}
section.worked-answer .note {font-size:17px; margin-top:6px;}
section.worked-answer .note a {font-size:17px; padding:0; background:none; color:#176d82; text-decoration:underline;}

</style>

## 余った時間で、もう一歩！

<div class="chapter">Week 3 · 追加練習クイズ</div>

**組合せ → 二項分布 → ポアソン分布**

3問・各5分が目安。教科書・電卓・配布ポアソン分布表を使ってよい。

**何を数える？　どのモデル？　どの値を入れる？**

<div class="note">答えは次のスライド。進む前に確認画面が出ます。途中式と、答えの意味を自分の言葉で書こう。</div>

---

<!-- _class: challenge -->

## チャレンジ①　ロボット展示の代表を選ぶ

<div class="challenge-time">自分で解く　5分　／　教科書 p.119</div>

展示候補の **8体** から **3体** を選ぶ。並べる順番は区別しない。
このうち、人気ロボットは **AとBの2体** である。

**(1)** 制限なく選ぶと、何通りあるか。

**(2)** AとBの **少なくとも一方** を含めると、何通りか。

**(3)** AとBの **両方** を含めると、何通りか。

<div class="note">「少なくとも一方」は、両方を選ぶ場合も含む。数え落としや重複を避ける方法を考えよう。</div>

---

<!-- _class: challenge-check worked-answer -->

## 答え合わせ①　選ばない場合を引く

<div class="worked-label">① 与えられた条件</div>
<div class="worked-given">

候補は $n=8$ 体、選ぶ数は $x=3$ 体。人気ロボットはA・Bの2体。<br>順番は区別しない。AもBも選ばない場合、候補は6体。

</div>
<div class="worked-columns"><div>
<div class="worked-label">② 公式（文字のまま）</div>

$$
\begin{aligned}{}_nC_x&=\frac{n!}{x!(n-x)!}\\\text{少なくとも一方}&:\ {}_nC_x-{}_{n-2}C_x\\\text{両方}&:\ {}_{n-2}C_{x-2}\end{aligned}
$$

</div><div>
<div class="worked-label">③ 数値を代入・計算</div>

$$
\begin{aligned}{}_8C_3&=\frac{8\times7\times6}{3\times2\times1}=56\\{}_8C_3-{}_6C_3&=56-20=36\\{}_6C_1&=6\end{aligned}
$$

</div></div>
<div class="worked-result">
<div class="worked-label">④ 答え・意味</div>

制限なし：56通り。少なくとも一方：36通り。両方：6通り。

</div>
<div class="note">少なくとも一方は、全てから「どちらも選ばない」を引く。両方を固定すると、あと1体を残り6体から選ぶ。</div>

---

<!-- _class: challenge -->

## チャレンジ②　配達ロボットは8回中何回成功？

<div class="challenge-time">自分で解く　5分　／　教科書 p.118–120</div>

1回の配達に成功する確率は **75％**。成功率は毎回同じで、各配達は独立とする。
**8回** の配達のうち、成功する回数を $X$ とする。

**(1)** ちょうど6回成功する確率を、式に値を代入して求めよ。

**(2)** 7回以上成功する確率を求めよ。

**(3)** 成功回数の期待値と分散を求めよ。

<div class="note">「7回以上」は、どの成功回数を足せばよい？　小数第4位程度まで計算し、％でも答えよう。</div>

---

<!-- _class: challenge-check worked-answer -->

## 答え合わせ②　「以上」は複数の結果を足す

<div class="worked-label">① 与えられた条件</div>
<div class="worked-given">

$X$ は成功回数。$n=8,\ \pi=0.75,\ 1-\pi=0.25$。<br>ちょうど6回：$X=6$。7回以上：$X=7$ または $8$。各配達は独立。

</div>
<div class="worked-columns"><div>
<div class="worked-label">② 公式（文字のまま）</div>

$$
\begin{aligned}\Pr(X=x)&={}_nC_x\pi^x(1-\pi)^{n-x}\\\Pr(X\ge k)&=\sum_{x=k}^{n}\Pr(X=x)\\E(X)&=n\pi\\\operatorname{Var}(X)&=n\pi(1-\pi)\end{aligned}
$$

</div><div>
<div class="worked-label">③ 数値を代入・計算</div>

$$
\begin{aligned}\Pr(X=6)&={}_8C_6(0.75)^6(0.25)^2\\\Pr(X\ge7)&={}_8C_7(0.75)^7(0.25)\\&\quad+{}_8C_8(0.75)^8\\&\approx0.2670+0.1001=0.3671\\E(X)&=8\times0.75=6\\\operatorname{Var}(X)&=8\times0.75\times0.25=1.5\end{aligned}
$$

</div></div>
<div class="worked-result">
<div class="worked-label">④ 答え・意味</div>

6回成功：約31.15％。7回以上成功：約36.71％。

</div>
<div class="note">期待値6回、分散1.5回²。平均6回とは、毎回必ず6回成功するという意味ではない。</div>

---

<!-- _class: challenge -->

## チャレンジ③　図書館の返却ボックス

<div class="challenge-time">自分で解く　5分　／　教科書 p.120</div>

返却ボックスに、平均 **10分あたり2冊** の本が返される。
返却は一定の率で独立に起こるポアソン過程とする。
次の **15分間** に返される冊数を $X$ とする。

**(1)** $\lambda$ を求め、表で読む列を示せ。

**(2)** ちょうど2冊返される確率と、3冊以上返される確率を求めよ。

**(3)** 期待値と分散を求めよ。

<div class="note">配布ポアソン分布表を使用。3冊以上の反対は？　表の各マスは「ちょうど」の確率。</div>

---

<!-- _class: challenge-check worked-answer -->

## 答え合わせ③　時間をそろえて、表を読む

<div class="worked-label">① 与えられた条件</div>
<div class="worked-given">

平均10分あたり2冊。観察時間 $t=15$ 分。$X$ は返却冊数。<br>求める確率：$X=2$ と $X\ge3$。一定の率で独立に返却される。

</div>
<div class="worked-columns"><div>
<div class="worked-label">② 公式（文字のまま）</div>

$$
\begin{aligned}\lambda&=\text{1分あたりの平均冊数}\times t\\\Pr(X=x)&=\frac{\lambda^xe^{-\lambda}}{x!}\\\Pr(X\ge k)&=1-\sum_{x=0}^{k-1}\Pr(X=x)\\E(X)&=\operatorname{Var}(X)=\lambda\end{aligned}
$$

</div><div>
<div class="worked-label">③ 数値を代入・計算</div>

$$
\begin{aligned}\lambda&=\frac{2}{10}\times15=3\\\text{表の }\mu=3.0&:\ P_0=0.050,\ P_1=0.149\\&\phantom{:}\ P_2=0.224\\\Pr(X\ge3)&\approx1-(0.050+0.149+0.224)\\&=0.577\\E(X)&=\operatorname{Var}(X)=3\end{aligned}
$$

</div></div>
<div class="worked-result">
<div class="worked-label">④ 答え・意味</div>

ちょうど2冊：約22.4％。3冊以上：約57.7％。

</div>
<div class="note">P₀・P₁・P₂は、表のx=0・1・2行の「ちょうど」の確率。期待値3冊、分散3冊²。表の丸め値を使用。</div>
