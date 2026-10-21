---
marp: true
theme: default
size: 16:9
paginate: true
math: katex
footer: '統計学B · Week 4 · ニュース例題'
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
<style>
section.news-opening{padding:44px 64px 65px}
section.news-opening h2{font-size:43px;margin-bottom:28px}
.news-opening-layout{display:grid;grid-template-columns:510px 1fr;gap:34px;align-items:center}
.news-opening-layout img{max-width:510px;max-height:350px;object-fit:contain;border:1px solid #e1e5e5}
.news-opening-layout p{margin:12px 0}
.news-credit{font-size:16px;color:#69777c;margin-top:12px}
.news-outlet{font-size:20px;color:#176d82;font-weight:700;letter-spacing:.04em}
section.news-opening .note{font-size:18px;margin-top:18px}
.news-links a{display:inline-block;font-size:21px;margin:5px 15px 0 0;color:#176d82;text-decoration:underline}
.news-kicker{font-size:19px;color:#176d82;font-weight:700;letter-spacing:.08em;margin-bottom:14px}
section.news-given{padding:42px 64px 70px}
section.news-given h2{font-size:40px;margin-bottom:18px}
section.news-given .katex-display{margin:18px 0;font-size:1.16em}
.news-question{font-weight:700;color:#176d82;font-size:29px;margin-top:16px}
section.news-formula .katex-display{font-size:1.25em;margin:20px 0}
section.news-formula h2{margin-bottom:20px}
section.news-answer{background:#edf5ef;border-top:7px solid #388065;padding:38px 64px 65px}
section.news-answer h2{font-size:40px;color:#2b624b;margin-bottom:14px}
section.news-answer .katex-display{font-size:1.1em;margin:14px 0}
.news-result{font-size:29px;font-weight:700;color:#215d45;border-top:2px solid #b7d1c2;padding-top:12px;margin-top:14px}
section.news-answer .note{font-size:18px;margin-top:12px}
</style>

<style>
section.companion-given{font-size:25px} section.companion-given .news-question{font-size:27px;line-height:1.5}
section.companion-given .katex-display{font-size:1.02em;margin:17px 0}
section.companion-formula .katex-display{font-size:1.06em;margin:16px 0}
section.companion-chart{padding:35px 62px 60px;background:#fbfaf6}
section.companion-chart h2{font-size:40px;margin-bottom:14px}
section.companion-chart .katex-display{font-size:1.04em;margin:10px 0}
.companion-chart-legend{font-size:21px;margin:4px 0 8px}
.companion-chart-legend strong{color:#176d82} .companion-chart-legend em{color:#92641c;font-style:normal;font-weight:700}
.companion-distribution{width:100%;height:315px;display:block}
section.companion-chart .note{font-size:17px;margin-top:5px}
</style>
<style>
section.answer-visual{padding:36px 62px 66px;background:#fbfaf6}
section.answer-visual h2{font-size:37px;margin-bottom:12px}
.answer-visual-summary{font-size:25px;font-weight:700;color:#215d45;margin:10px 0}
.answer-visual-legend{font-size:20px;margin:8px 0;color:#40555f}
.answer-visual-legend b{color:#176d82}.answer-visual-legend strong{color:#a57020}
.answer-visual-chart{display:block;width:100%;height:325px}
section.answer-visual .note{font-size:18px;margin-top:10px}
.answer-models{font-size:24px;width:100%;margin-top:30px}
.answer-models th,.answer-models td{padding:18px 22px;border-bottom:2px solid #d9e1e3}
.answer-models td:last-child{color:#176d82;font-weight:700}
</style>

<!-- _class: news-opening -->

## AIの友だち、もう普通？

<div class="news-opening-layout"><div>

[![width:510px](images/ai-companions.png)](https://www.commonsensemedia.org/press-releases/nearly-3-in-4-teens-have-used-ai-companions-new-national-survey-finds)

<div class="news-credit">元調査の発表画面：Common Sense Media（2025.07.16）</div>

</div><div>

<div class="news-outlet">Associated Press　2025.07.23</div>

相談相手は、人間？ それともチャットボット？

米国13〜17歳の **72％** が、AIコンパニオンを使った経験あり。

<div class="news-links">

[記事を読む](https://apnews.com/article/9ce59a2b250f3bd0187a717ffa2ad21f)　[元データ](https://www.commonsensemedia.org/press-releases/nearly-3-in-4-teens-have-used-ai-companions-new-national-survey-finds)

</div></div></div>

<div class="note">「少なくとも1回使った経験」を数えた調査。毎日使う割合や、恋愛関係にある割合ではない。</div>

<!-- Sources: https://apnews.com/article/9ce59a2b250f3bd0187a717ffa2ad21f
Data and thumbnail: https://www.commonsensemedia.org/press-releases/nearly-3-in-4-teens-have-used-ai-companions-new-national-survey-finds
Reported p=0.72. Classroom model n=6, p=0.75, independent trials, constant p. -->

---

<!-- _class: news-given companion-given -->

## 6人の選択授業、AIの友だちを使った人は？

米国の高校の少人数の選択授業。6人の生徒に、AIコンパニオンの利用経験を匿名で尋ねる。計算練習では、利用経験率を75％と仮定する。

$X$＝6人のクラスのうち、AIコンパニオンの利用経験がある人数。

$$
n=6,\qquad\pi=\frac34,\qquad1-\pi=\frac14
$$

<div class="news-question">

(1) ちょうど5人：$\Pr(X=5)$ は？

(2) 5人以上：$\Pr(X\ge5)$ は？

</div>

<div class="note">記事の実測値は72％。75％は手計算のための授業用の仮定で、調査結果ではない。各人は独立・確率一定とする。</div>

---

<!-- _class: book-reference companion-formula -->

## チャレンジ①　「5人」と「5人以上」

<div class="challenge-time">自分で解く　5分 ／ 教科書 p.118–119</div>

$$
\Pr(X=x)={}_nC_x\pi^x(1-\pi)^{n-x}
$$

$$
\Pr(X=5)={}_6C_5\left(\frac34\right)^5\left(\frac14\right)
$$

$$
\Pr(X\ge5)=\Pr(X=5)+\Pr(X=6)
$$

**5人以上は、5人と6人の2通り。**

<div class="note">教科書 p.119：6C5＝6C1＝6。3⁵＝243、3⁶＝729、4⁶＝4096。答えは分数のままでよい。</div>

---

<!-- _class: challenge-check worked-answer -->

## 答え合わせ　同じ分母で、2つの確率を足す

<div class="worked-label">① 与えられた条件</div>
<div class="worked-given">

$n=6,\ \pi=\frac34$。独立・確率一定の授業モデル。$3^5=243,\ 3^6=729,\ 4^6=4096$。

</div>
<div class="worked-columns"><div>
<div class="worked-label">② 公式（文字のまま）</div>

$$
\begin{aligned}\Pr(X=x)&={}_nC_x\pi^x(1-\pi)^{n-x}\\\Pr(X\ge k)&=\sum_{x=k}^{n}\Pr(X=x)\end{aligned}
$$

</div><div>
<div class="worked-label">③ 数値を代入・計算</div>

$$
\begin{aligned}{}_6C_5&=6\\\Pr(X=5)&=\frac{6\times3^5}{4^6}=\frac{1458}{4096}\\\Pr(X=6)&=\left(\frac34\right)^6=\frac{729}{4096}\\\Pr(X\ge5)&=\frac{1458+729}{4096}=\frac{2187}{4096}\end{aligned}
$$

</div></div>
<div class="worked-result">
<div class="worked-label">④ 答え・意味</div>

ちょうど5人：1458/4096 ≈ 35.60％。5人以上：2187/4096 ≈ 53.39％。

</div>
<div class="note">分数のままで正解。％表示は参考。記事の72％と、授業モデルの75％を区別する。</div>

---

<!-- _class: companion-chart -->

## 「5人以上」は、この2本の棒を足す

$$
\Pr(X=5)\approx35.60\%,\qquad\Pr(X\ge5)\approx53.39\%
$$

<div class="companion-chart-legend"><strong>青：ちょうど5人</strong>　＋　<em>黄：6人全員</em>　＝　5人以上</div>

<svg class="companion-distribution" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1120 315" role="img" aria-label="6人のクラスの二項分布。ちょうど5人は35.60％。5人と6人の合計は53.39％。"><g font-family="Hiragino Sans,Noto Sans JP,sans-serif" font-size="20" fill="#40555f"><path d="M90 240H1070" stroke="#d9e1e3"/><text x="76" y="247" text-anchor="end">0%</text><path d="M90 192.5H1070" stroke="#d9e1e3"/><text x="76" y="199.5" text-anchor="end">10%</text><path d="M90 145H1070" stroke="#d9e1e3"/><text x="76" y="152" text-anchor="end">20%</text><path d="M90 97.5H1070" stroke="#d9e1e3"/><text x="76" y="104.5" text-anchor="end">30%</text><path d="M90 50H1070" stroke="#d9e1e3"/><text x="76" y="57" text-anchor="end">40%</text><rect data-count="0" data-probability="0.000244140625" x="115" y="239.884033203125" width="80" height="0.115966796875" fill="#bdcbd0"/><text x="155" y="225.884033203125" text-anchor="middle" font-weight="700" fill="#40555f">0.02%</text><text x="155" y="268" text-anchor="middle">0</text><rect data-count="1" data-probability="0.00439453125" x="255" y="237.91259765625" width="80" height="2.08740234375" fill="#bdcbd0"/><text x="295" y="223.91259765625" text-anchor="middle" font-weight="700" fill="#40555f">0.44%</text><text x="295" y="268" text-anchor="middle">1</text><rect data-count="2" data-probability="0.032958984375" x="395" y="224.344482421875" width="80" height="15.655517578125" fill="#bdcbd0"/><text x="435" y="210.344482421875" text-anchor="middle" font-weight="700" fill="#40555f">3.30%</text><text x="435" y="268" text-anchor="middle">2</text><rect data-count="3" data-probability="0.1318359375" x="535" y="177.3779296875" width="80" height="62.6220703125" fill="#bdcbd0"/><text x="575" y="163.3779296875" text-anchor="middle" font-weight="700" fill="#40555f">13.18%</text><text x="575" y="268" text-anchor="middle">3</text><rect data-count="4" data-probability="0.296630859375" x="675" y="99.100341796875" width="80" height="140.899658203125" fill="#bdcbd0"/><text x="715" y="85.100341796875" text-anchor="middle" font-weight="700" fill="#40555f">29.66%</text><text x="715" y="268" text-anchor="middle">4</text><rect data-count="5" data-probability="0.35595703125" x="815" y="70.92041015625" width="80" height="169.07958984375" fill="#176d82"/><text x="855" y="56.92041015625" text-anchor="middle" font-weight="700" fill="#176d82">35.60%</text><text x="855" y="268" text-anchor="middle">5</text><rect data-count="6" data-probability="0.177978515625" x="955" y="155.460205078125" width="80" height="84.539794921875" fill="#be8530"/><text x="995" y="141.460205078125" text-anchor="middle" font-weight="700" fill="#be8530">17.80%</text><text x="995" y="268" text-anchor="middle">6</text><path d="M90 240H1070" stroke="#71848e"/><text x="1068" y="305" text-anchor="end">利用経験者数 X（人）</text></g></svg>

<div class="note">6人の選択授業。利用経験率75％は手計算用の仮定。記事の実測値は72％。0〜6人の全ての確率を足すと100％。</div>

---

<!-- _class: challenge -->

## チャレンジ②　平均個数と、ばらつきは？

<div class="challenge-time">自分で解く　3分 ／ 教科書 p.119–120</div>

$X$＝6人のクラスのうち、AIコンパニオンの利用経験がある人数。

$n=6,\quad\pi=0.75$。独立・一定の確率を仮定する。

**(1)** 同じ条件の組・期間を繰り返すとき、$X$ の期待値と分散を求めよ。

**(2)** 期待値を「起こる確率」と言い換えてよいか？

**(3)** 現実では、独立・一定の確率という仮定が崩れるのはどんな場合か？

<div class="note">期待値は個数の単位、分散はその単位の2乗。前の確率問題と同じXを使う。</div>

---

<!-- _class: challenge-check worked-answer -->

## 答え合わせ　期待値は、確率ではなく個数

<div class="worked-label">① 与えられた条件</div>
<div class="worked-given">

$X$＝6人のクラスのうち、AIコンパニオンの利用経験がある人数。

$n=6,\quad\pi=0.75$。独立・一定の確率を仮定する。

</div>
<div class="worked-columns"><div>
<div class="worked-label">② 公式（文字のまま）</div>

$$
\begin{aligned}E(X)&=n\pi\\\operatorname{Var}(X)&=n\pi(1-\pi)\end{aligned}
$$

</div><div>
<div class="worked-label">③ 数値を代入・計算</div>

$$
\begin{aligned}E(X)&=6\times\frac34=\frac92=4.5\\\operatorname{Var}(X)&=6\times\frac34\times\frac14\\&=\frac98=1.125\end{aligned}
$$

</div></div>
<div class="worked-result">
<div class="worked-label">④ 答え・意味</div>

期待値 4.5人。分散 1.125人²。

同じ条件を繰り返した平均であり、毎回この個数になる保証ではない。

</div>
<div class="note">期待値を％にしても、事象の確率にはならない。仮定が崩れる例：友人同士で利用行動が似る。集団によって利用率も違う。</div>

---

<!-- _class: answer-visual -->

## 図で確認　平均と、結果のばらつき

<div class="answer-visual-summary">期待値 4.5人。分散 1.125人²。</div>

<div class="answer-visual-legend">灰：各結果の確率　赤い破線：期待値</div>

<svg class="answer-visual-chart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1120 325" role="img" aria-label="図で確認　平均と、結果のばらつき"><g font-family="Hiragino Sans,Noto Sans JP,sans-serif" fill="#40555f"><path d="M95 246H1080" stroke="#d9e1e3"/><text x="80" y="252" text-anchor="end" font-size="18">0%</text><path d="M95 198.5H1080" stroke="#d9e1e3"/><text x="80" y="204.5" text-anchor="end" font-size="18">10%</text><path d="M95 151H1080" stroke="#d9e1e3"/><text x="80" y="157" text-anchor="end" font-size="18">20%</text><path d="M95 103.5H1080" stroke="#d9e1e3"/><text x="80" y="109.5" text-anchor="end" font-size="18">30%</text><path d="M95 56H1080" stroke="#d9e1e3"/><text x="80" y="62" text-anchor="end" font-size="18">40%</text><rect data-count="0" data-probability="0.000244140625" x="117.5142857142857" y="245.884033203125" width="95.6857142857143" height="0.115966796875" fill="#bdcbd0"/><text x="165.35714285714286" y="235.884033203125" text-anchor="middle" fill="#40555f" font-size="19">0.02%</text><text x="165.35714285714286" y="275" text-anchor="middle" font-size="18">0</text><rect data-count="1" data-probability="0.00439453125" x="258.2285714285714" y="243.91259765625" width="95.6857142857143" height="2.08740234375" fill="#bdcbd0"/><text x="306.07142857142856" y="233.91259765625" text-anchor="middle" fill="#40555f" font-size="19">0.4%</text><text x="306.07142857142856" y="275" text-anchor="middle" font-size="18">1</text><rect data-count="2" data-probability="0.032958984375" x="398.9428571428572" y="230.344482421875" width="95.6857142857143" height="15.655517578125" fill="#bdcbd0"/><text x="446.78571428571433" y="220.344482421875" text-anchor="middle" fill="#40555f" font-size="19">3.3%</text><text x="446.78571428571433" y="275" text-anchor="middle" font-size="18">2</text><rect data-count="3" data-probability="0.1318359375" x="539.6571428571428" y="183.3779296875" width="95.6857142857143" height="62.6220703125" fill="#bdcbd0"/><text x="587.5" y="173.3779296875" text-anchor="middle" fill="#40555f" font-size="19">13.2%</text><text x="587.5" y="275" text-anchor="middle" font-size="18">3</text><rect data-count="4" data-probability="0.296630859375" x="680.3714285714286" y="105.100341796875" width="95.6857142857143" height="140.899658203125" fill="#bdcbd0"/><text x="728.2142857142858" y="95.100341796875" text-anchor="middle" fill="#40555f" font-size="19">29.7%</text><text x="728.2142857142858" y="275" text-anchor="middle" font-size="18">4</text><rect data-count="5" data-probability="0.35595703125" x="821.0857142857143" y="76.92041015625" width="95.6857142857143" height="169.07958984375" fill="#bdcbd0"/><text x="868.9285714285714" y="66.92041015625" text-anchor="middle" fill="#40555f" font-size="19">35.6%</text><text x="868.9285714285714" y="275" text-anchor="middle" font-size="18">5</text><rect data-count="6" data-probability="0.177978515625" x="961.8000000000001" y="161.460205078125" width="95.6857142857143" height="84.539794921875" fill="#bdcbd0"/><text x="1009.6428571428572" y="151.460205078125" text-anchor="middle" fill="#40555f" font-size="19">17.8%</text><text x="1009.6428571428572" y="275" text-anchor="middle" font-size="18">6</text><path d="M798.5714285714287 42V250" stroke="#9b5146" stroke-width="3" stroke-dasharray="7 5"/><text x="798.5714285714287" y="26" text-anchor="middle" fill="#9b5146" font-size="21">平均 4.5人</text><path d="M95 246H1080" stroke="#71848e"/><text x="1080" y="314" text-anchor="end" font-size="20">X（人）</text></g></svg>

<div class="note">平均は赤い破線。分散 1.125人² は、この平均からの距離の2乗を確率で重みづけした値。 一番高い棒と、期待値の位置は同じとは限らない。</div>
