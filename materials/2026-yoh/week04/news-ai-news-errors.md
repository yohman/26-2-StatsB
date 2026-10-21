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

## AIニュース、3つ読んだら？

<div class="news-opening-layout"><div>

[![width:510px](images/ai-news-errors.png)](https://www.ebu.ch/news/2025/10/ai-s-systemic-distortion-of-news-is-consistent-across-languages-and-territories-international-study-by-public-service-broadcaste)

<div class="news-credit">元調査の発表画面：EBU / BBC（2025.10.22）</div>

</div><div>

<div class="news-outlet">Reuters　2025.10.22</div>

AIの答えを、そのままレポートに使って大丈夫？

ニュースについてのAI回答の **20％** に、重大な正確性の問題。

<div class="news-links">

[記事を読む](https://www.investing.com/news/stock-market-news/ai-assistants-make-widespread-errors-about-the-news-new-research-shows-4300409)　[元データ](https://www.ebu.ch/news/2025/10/ai-s-systemic-distortion-of-news-is-consistent-across-languages-and-territories-international-study-by-public-service-broadcaste)

</div></div></div>

<div class="note">45％は「何らかの重大な問題」。今回は、その内訳の「重大な正確性の問題20％」を使う。</div>

<!-- Sources: https://www.investing.com/news/stock-market-news/ai-assistants-make-widespread-errors-about-the-news-new-research-shows-4300409
Data and thumbnail: https://www.ebu.ch/news/2025/10/ai-s-systemic-distortion-of-news-is-consistent-across-languages-and-territories-international-study-by-public-service-broadcaste
Reported p=0.2. Classroom model n=3, p=0.2, independent trials, constant p. -->

---

<!-- _class: news-given -->

## AI回答3件のうち、ちょうど1件に問題？

<div class="news-kicker">GIVEN / 与えられた条件と問題</div>

$X$＝重大な正確性の問題を含む回答の件数。

同じ条件で作られたAI回答を3件読む。各回答の問題発生率を20％とし、独立と仮定する。

$$
n=3,\qquad\pi=0.20,\qquad x=1
$$

<div class="news-question">重大な正確性の問題を含む回答が、ちょうど1件ある確率を求めよ。</div>

<div class="note">20％は調査の報告値。3件・独立・一定の確率は授業用の仮定。「その問題なし」は完全に正しいという意味ではない。</div>

---

<!-- _class: book-reference news-formula -->

## 公式に、ニュースの数値を代入

<div class="news-kicker">FORMULA / 文字の公式、そして代入</div>

$$
\Pr(X=x)={}_nC_x\pi^x(1-\pi)^{n-x}
$$

$$
\Pr(X=1)={}_3C_1(0.20)^1(0.80)^2
$$

**問題のある1件の位置 × 問題あり1件 × その問題なし2件**

<div class="note">教科書 p.118–119：二項分布は、同じ確率の独立な試行で、該当する件数を数える。</div>

---

<!-- _class: news-answer -->

## 計算と、答えの意味

<div class="news-kicker">SOLUTION / 途中計算と答え</div>

$$
\begin{aligned}{}_3C_1&=3\\\Pr(X=1)&=3\times0.20\times0.64\\&=0.384=\boxed{38.4\%}\end{aligned}
$$

<div class="news-result">3件の回答を1組とすると、ちょうど1件にこの問題がある組は38.4％。</div>

20％は1件についての割合。38.4％は「3件中ちょうど1件」の確率。

<div class="note">2025年の調査条件を使う練習用モデル。現在の全AIや全質問の誤答率ではない。同じ話題の回答は独立とは限らない。</div>

---

<!-- _class: answer-visual -->

## 図で確認　答えに含める棒

<div class="answer-visual-summary">求めた確率：約38.40％</div>

<div class="answer-visual-legend">青：求めた結果　灰：それ以外</div>

<svg class="answer-visual-chart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1120 325" role="img" aria-label="図で確認　答えに含める棒"><g font-family="Hiragino Sans,Noto Sans JP,sans-serif" fill="#40555f"><path d="M95 246H1080" stroke="#d9e1e3"/><text x="80" y="252" text-anchor="end" font-size="18">0%</text><path d="M95 198.5H1080" stroke="#d9e1e3"/><text x="80" y="204.5" text-anchor="end" font-size="18">15%</text><path d="M95 151H1080" stroke="#d9e1e3"/><text x="80" y="157" text-anchor="end" font-size="18">30%</text><path d="M95 103.5H1080" stroke="#d9e1e3"/><text x="80" y="109.5" text-anchor="end" font-size="18">45%</text><path d="M95 56H1080" stroke="#d9e1e3"/><text x="80" y="62" text-anchor="end" font-size="18">60%</text><rect data-count="0" data-probability="0.5120000000000001" x="134.39999999999998" y="83.86666666666662" width="167.45000000000002" height="162.13333333333338" fill="#bdcbd0"/><text x="218.125" y="73.86666666666662" text-anchor="middle" fill="#40555f" font-size="19">51.2%</text><text x="218.125" y="275" text-anchor="middle" font-size="18">0</text><rect data-count="1" data-probability="0.3840000000000001" x="380.65" y="124.39999999999995" width="167.45000000000002" height="121.60000000000005" fill="#176d82"/><text x="464.375" y="114.39999999999995" text-anchor="middle" fill="#176d82" font-size="19">38.4%</text><text x="464.375" y="275" text-anchor="middle" font-size="18">1</text><rect data-count="2" data-probability="0.09600000000000003" x="626.9" y="215.6" width="167.45000000000002" height="30.400000000000013" fill="#bdcbd0"/><text x="710.625" y="205.6" text-anchor="middle" fill="#40555f" font-size="19">9.6%</text><text x="710.625" y="275" text-anchor="middle" font-size="18">2</text><rect data-count="3" data-probability="0.008000000000000002" x="873.15" y="243.46666666666667" width="167.45000000000002" height="2.533333333333334" fill="#bdcbd0"/><text x="956.875" y="233.46666666666667" text-anchor="middle" fill="#40555f" font-size="19">0.8%</text><text x="956.875" y="275" text-anchor="middle" font-size="18">3</text><path d="M95 246H1080" stroke="#71848e"/><text x="1080" y="314" text-anchor="end" font-size="20">X（件）</text></g></svg>

<div class="note"> 20％は調査の報告値。3件・独立・一定の確率は授業用の仮定。「その問題なし」は完全に正しいという意味ではない。</div>

---

<!-- _class: challenge -->

## チャレンジ①　平均個数と、ばらつきは？

<div class="challenge-time">自分で解く　3分 ／ 教科書 p.119–120</div>

$X$＝重大な正確性の問題を含む回答の件数。

$n=3,\quad\pi=0.2$。独立・一定の確率を仮定する。

**(1)** 同じ条件の組・期間を繰り返すとき、$X$ の期待値と分散を求めよ。

**(2)** 期待値を「起こる確率」と言い換えてよいか？

**(3)** 現実では、独立・一定の確率という仮定が崩れるのはどんな場合か？

<div class="note">期待値は個数の単位、分散はその単位の2乗。前の確率問題と同じXを使う。</div>

---

<!-- _class: challenge-check worked-answer -->

## 答え合わせ　期待値は、確率ではなく個数

<div class="worked-label">① 与えられた条件</div>
<div class="worked-given">

$X$＝重大な正確性の問題を含む回答の件数。

$n=3,\quad\pi=0.2$。独立・一定の確率を仮定する。

</div>
<div class="worked-columns"><div>
<div class="worked-label">② 公式（文字のまま）</div>

$$
\begin{aligned}E(X)&=n\pi\\\operatorname{Var}(X)&=n\pi(1-\pi)\end{aligned}
$$

</div><div>
<div class="worked-label">③ 数値を代入・計算</div>

$$
\begin{aligned}E(X)&=3\times0.2=0.6\\\operatorname{Var}(X)&=3\times0.2\times0.8\\&=0.48\end{aligned}
$$

</div></div>
<div class="worked-result">
<div class="worked-label">④ 答え・意味</div>

期待値 0.6件。分散 0.48件²。

同じ条件を繰り返した平均であり、毎回この個数になる保証ではない。

</div>
<div class="note">期待値を％にしても、事象の確率にはならない。仮定が崩れる例：同じニュースの回答は、共通の情報源によって誤りが重なる。</div>

---

<!-- _class: answer-visual -->

## 図で確認　平均と、結果のばらつき

<div class="answer-visual-summary">期待値 0.6件。分散 0.48件²。</div>

<div class="answer-visual-legend">灰：各結果の確率　赤い破線：期待値</div>

<svg class="answer-visual-chart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1120 325" role="img" aria-label="図で確認　平均と、結果のばらつき"><g font-family="Hiragino Sans,Noto Sans JP,sans-serif" fill="#40555f"><path d="M95 246H1080" stroke="#d9e1e3"/><text x="80" y="252" text-anchor="end" font-size="18">0%</text><path d="M95 198.5H1080" stroke="#d9e1e3"/><text x="80" y="204.5" text-anchor="end" font-size="18">15%</text><path d="M95 151H1080" stroke="#d9e1e3"/><text x="80" y="157" text-anchor="end" font-size="18">30%</text><path d="M95 103.5H1080" stroke="#d9e1e3"/><text x="80" y="109.5" text-anchor="end" font-size="18">45%</text><path d="M95 56H1080" stroke="#d9e1e3"/><text x="80" y="62" text-anchor="end" font-size="18">60%</text><rect data-count="0" data-probability="0.5120000000000001" x="134.39999999999998" y="83.86666666666662" width="167.45000000000002" height="162.13333333333338" fill="#bdcbd0"/><text x="218.125" y="73.86666666666662" text-anchor="middle" fill="#40555f" font-size="19">51.2%</text><text x="218.125" y="275" text-anchor="middle" font-size="18">0</text><rect data-count="1" data-probability="0.3840000000000001" x="380.65" y="124.39999999999995" width="167.45000000000002" height="121.60000000000005" fill="#bdcbd0"/><text x="464.375" y="114.39999999999995" text-anchor="middle" fill="#40555f" font-size="19">38.4%</text><text x="464.375" y="275" text-anchor="middle" font-size="18">1</text><rect data-count="2" data-probability="0.09600000000000003" x="626.9" y="215.6" width="167.45000000000002" height="30.400000000000013" fill="#bdcbd0"/><text x="710.625" y="205.6" text-anchor="middle" fill="#40555f" font-size="19">9.6%</text><text x="710.625" y="275" text-anchor="middle" font-size="18">2</text><rect data-count="3" data-probability="0.008000000000000002" x="873.15" y="243.46666666666667" width="167.45000000000002" height="2.533333333333334" fill="#bdcbd0"/><text x="956.875" y="233.46666666666667" text-anchor="middle" fill="#40555f" font-size="19">0.8%</text><text x="956.875" y="275" text-anchor="middle" font-size="18">3</text><path d="M365.875 42V250" stroke="#9b5146" stroke-width="3" stroke-dasharray="7 5"/><text x="365.875" y="26" text-anchor="middle" fill="#9b5146" font-size="21">平均 0.6件</text><path d="M95 246H1080" stroke="#71848e"/><text x="1080" y="314" text-anchor="end" font-size="20">X（件）</text></g></svg>

<div class="note">平均は赤い破線。分散 0.48件² は、この平均からの距離の2乗を確率で重みづけした値。 一番高い棒と、期待値の位置は同じとは限らない。</div>
