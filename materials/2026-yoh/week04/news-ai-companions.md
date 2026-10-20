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
Reported p=0.72. Classroom model n=4, independent trials, constant p. -->

---

<!-- _class: news-given -->

## 4人のうち、ちょうど3人に利用経験？

<div class="news-kicker">GIVEN / 与えられた条件と問題</div>

$X$＝AIコンパニオンを使ったことがある人の数。

同じ割合の集団から4人を独立に選ぶと仮定する。利用経験のある確率を72％とする。

$$
n=4,\qquad\pi=0.72,\qquad x=3
$$

<div class="news-question">4人中ちょうど3人に利用経験がある確率を求めよ。</div>

<div class="note">72％は米国の調査結果。4人・独立・一定の確率は授業用の仮定。このクラスの利用率を表していない。</div>

---

<!-- _class: book-reference news-formula -->

## 公式に、ニュースの数値を代入

<div class="news-kicker">FORMULA / 文字の公式、そして代入</div>

$$
\Pr(X=x)={}_nC_x\pi^x(1-\pi)^{n-x}
$$

$$
\Pr(X=3)={}_4C_3(0.72)^3(0.28)^1
$$

**利用経験者3人の選び方 × 経験あり3人 × 経験なし1人**

<div class="note">教科書 p.119：4C3は、経験なしの1人を選ぶ4C1と同じ4通り。</div>

---

<!-- _class: news-answer -->

## 計算と、答えの意味

<div class="news-kicker">SOLUTION / 途中計算と答え</div>

$$
\begin{aligned}{}_4C_3&=4,\qquad (0.72)^3=0.373248\\\Pr(X=3)&=4\times0.373248\times0.28\\&=0.41803776\approx\boxed{41.80\%}\end{aligned}
$$

<div class="news-result">4人組を繰り返し作ると、ちょうど3人が利用経験者の組は約41.80％。</div>

72％は個人についての割合。「4人のうち3人」になる確率は約41.80％。

<div class="note">利用経験から、依存・孤独・恋愛関係の有無は判断できない。友人同士の利用行動が独立とは限らない。</div>
