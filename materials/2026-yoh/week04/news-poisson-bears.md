---
marp: true
theme: default
size: 16:9
paginate: true
math: katex
footer: '統計学B · Week 4 · ポアソンのニュース演習'
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
section.news-opening{padding:42px 62px 65px} section.news-opening h2{font-size:42px;margin-bottom:25px}
.news-opening-layout{display:grid;grid-template-columns:510px 1fr;gap:32px;align-items:center}
.news-opening-layout img{max-width:510px;max-height:335px;object-fit:contain;border:1px solid #e1e5e5}
.news-credit{font-size:16px;color:#69777c} .news-outlet{font-size:20px;color:#176d82;font-weight:700}
.news-links a{font-size:21px;color:#176d82;margin-right:18px}
section.news-opening .note{font-size:18px;margin-top:18px}
section.news-given{padding:42px 62px 65px} section.news-given h2{font-size:40px}
section.news-given .katex-display{font-size:.94em;margin:24px 0}
.news-question{font-weight:700;font-size:29px;color:#176d82}
section.news-formula .katex-display{font-size:1.03em;margin:20px 0}
section.news-answer{background:#edf5ef;border-top:7px solid #388065;padding:35px 62px 65px}
section.news-answer h2{font-size:40px;margin-bottom:12px;color:#2b624b}
section.news-answer .katex-display{font-size:.96em;margin:14px 0}
section.news-answer .note{font-size:18px;margin-top:10px}
.table-explanation{font-size:21px} .table-explanation a{color:#176d82;text-decoration:underline}
section.news-answer table{font-size:23px;margin:8px 0} section.news-answer th,section.news-answer td{padding:6px 12px}
.news-result{font-size:25px;font-weight:700;color:#215d45;border-top:2px solid #b7d1c2;padding-top:12px;margin-top:12px}
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

## 100日間で、クマが現れる日は？

<div class="news-opening-layout"><div>

[![width:510px](images/poisson-bears.png)](https://apnews.com/article/japan-bear-attack-army-12a2a3233790deeefd9ec379d0121f33)

<div class="news-credit">記事画面：AP。被害件数：環境省。演習の日数・出現確率は授業用の仮定。</div>

</div><div>

<div class="news-outlet">Associated Press · 2025.11.06</div>

クマ被害への対応に、自衛隊も出動。

環境省の速報値では、2025年10月の秋田県は **31件／31日**。

<div class="news-links">

[記事を読む](https://apnews.com/article/japan-bear-attack-army-12a2a3233790deeefd9ec379d0121f33)　[元データ](https://www.env.go.jp/nature/choju/effort/effort12/r07injury-qe.pdf)

</div></div></div>

<div class="note">記事と公的集計は、クマ被害の現実を知る入口。次の100日・1日あたり2％は、記事の実測値ではない。</div>

<!-- Sources: https://apnews.com/article/japan-bear-attack-army-12a2a3233790deeefd9ec379d0121f33 | https://www.env.go.jp/nature/choju/effort/effort12/r07injury-qe.pdf -->

---

<!-- _class: news-given -->

## 100日間に、1日以上クマが現れる？

ある集落では、1日にクマが現れる確率を2％と仮定する。100日間観察する。

$X$＝100日間のうち、クマが現れた日数。ポアソン分布で近似する。

$$
n=100\ \text{日},\qquad\pi=2\%=0.02
$$

<div class="news-question">100日間に、少なくとも1日クマが現れる確率を求めよ。</div>

<div class="note">100日・2％は計算しやすい授業用の仮定。各日は独立・確率一定とする。同じ日に何頭いても1日と数え、クマの頭数は数えない。</div>

---

<!-- _class: book-reference news-formula -->

## チャレンジ①　公式に代入して、表へ

<div class="challenge-time">自分で解く　3〜5分 ／ 教科書 p.120</div>

$$
\Pr(X=x)=\frac{e^{-\lambda}\lambda^x}{x!},\qquad\lambda=n\pi
$$

$$
\Pr(X\ge1)=1-\Pr(X=0)
$$

まず、前のスライドの $n$ と $\pi$ から期待値を求めよう。

<div class="note">「1日以上」の反対は「0日」。まずλを求め、表の同じ列と0の行を探そう。　eの値は計算せず、配布のポアソン分布表を使う。</div>

---

<!-- _class: news-answer -->

## 分布表を読んで、答えを出す

$$
\lambda=n\pi=100\times0.02=2
$$

<div class="lookup-layout"><div><table class="poisson-lookup"><thead><tr><th>行 x ／ 列 μ</th><th class="lookup-column">2.0</th></tr></thead><tbody><tr><th class="lookup-row">0</th><td class="lookup-cell">0.135</td></tr></tbody></table></div><div class="table-explanation">

配布表の抜粋。表の $\mu$ は、公式の $\lambda$ と同じ「期待値」。

[ポアソン分布表を開く](https://yohman.github.io/26-2-StatsB/viewer.html?p=&file=other+material%2F2025+yoh%2F06_%5BAL%5D%E7%A2%BA%E7%8E%87%E5%88%86%E5%B8%83_1_%E9%9B%A2%E6%95%A3%E7%A2%BA%E7%8E%87%E5%88%86%E5%B8%83+%E3%83%9D%E3%82%A2%E3%82%BD%E3%83%B3%2F%E3%83%9D%E3%82%A2%E3%82%BD%E3%83%B3%E5%88%86%E5%B8%83%E8%A1%A8.pdf&title=%E3%83%9D%E3%82%A2%E3%82%BD%E3%83%B3%E5%88%86%E5%B8%83%E8%A1%A8&week=W04&return=agenda.html%3Fp%23week-04)

</div></div>

$$
\Pr(X\ge1)\approx1-0.135=\boxed{0.865=86.5\%}
$$

<div class="news-result">このモデルで、100日間に少なくとも1日クマが現れる確率は約86.5％。</div>

<div class="note">数えるのは出現した日数で、クマの頭数・襲われる確率ではない。季節や同じクマの再出現で、独立・確率一定の仮定は崩れうる。ポアソン近似と表の丸めを使う。</div>

<div class="note">表は小数第3位に丸められているため、答えは近似値。</div>

---

<!-- _class: answer-visual -->

## 図で確認　答えに含める棒

<div class="answer-visual-summary">求めた確率：約86.5％（配布表の値で計算）</div>

<div class="answer-visual-legend">青：求めた結果　灰：それ以外</div>

<svg class="answer-visual-chart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1120 325" role="img" aria-label="図で確認　答えに含める棒"><g font-family="Hiragino Sans,Noto Sans JP,sans-serif" fill="#40555f"><path d="M95 246H1080" stroke="#d9e1e3"/><text x="80" y="252" text-anchor="end" font-size="18">0%</text><path d="M95 198.5H1080" stroke="#d9e1e3"/><text x="80" y="204.5" text-anchor="end" font-size="18">7.5%</text><path d="M95 151H1080" stroke="#d9e1e3"/><text x="80" y="157" text-anchor="end" font-size="18">15%</text><path d="M95 103.5H1080" stroke="#d9e1e3"/><text x="80" y="109.5" text-anchor="end" font-size="18">22.5%</text><path d="M95 56H1080" stroke="#d9e1e3"/><text x="80" y="62" text-anchor="end" font-size="18">30%</text><rect data-count="0" data-probability="0.1353352832366127" x="109.32727272727273" y="160.28765395014528" width="60.8909090909091" height="85.71234604985472" fill="#bdcbd0"/><text x="139.77272727272728" y="275" text-anchor="middle" font-size="18">0</text><rect data-count="1" data-probability="0.2706705664732254" x="198.87272727272727" y="74.57530790029057" width="60.8909090909091" height="171.42469209970943" fill="#176d82"/><text x="229.3181818181818" y="64.57530790029057" text-anchor="middle" fill="#176d82" font-size="19">27.1%</text><text x="229.3181818181818" y="275" text-anchor="middle" font-size="18">1</text><rect data-count="2" data-probability="0.2706705664732254" x="288.41818181818184" y="74.57530790029057" width="60.8909090909091" height="171.42469209970943" fill="#176d82"/><text x="318.8636363636364" y="64.57530790029057" text-anchor="middle" fill="#176d82" font-size="19">27.1%</text><text x="318.8636363636364" y="275" text-anchor="middle" font-size="18">2</text><rect data-count="3" data-probability="0.18044704431548358" x="377.9636363636364" y="131.71687193352705" width="60.8909090909091" height="114.28312806647295" fill="#176d82"/><text x="408.40909090909093" y="121.71687193352705" text-anchor="middle" fill="#176d82" font-size="19">18.0%</text><text x="408.40909090909093" y="275" text-anchor="middle" font-size="18">3</text><rect data-count="4" data-probability="0.09022352215774179" x="467.5090909090909" y="188.85843596676352" width="60.8909090909091" height="57.14156403323648" fill="#176d82"/><text x="497.95454545454544" y="178.85843596676352" text-anchor="middle" fill="#176d82" font-size="19">9.0%</text><text x="497.95454545454544" y="275" text-anchor="middle" font-size="18">4</text><rect data-count="5" data-probability="0.036089408863096716" x="557.0545454545454" y="223.1433743867054" width="60.8909090909091" height="22.856625613294586" fill="#176d82"/><text x="587.5" y="213.1433743867054" text-anchor="middle" fill="#176d82" font-size="19">3.6%</text><text x="587.5" y="275" text-anchor="middle" font-size="18">5</text><rect data-count="6" data-probability="0.012029802954365572" x="646.5999999999999" y="238.38112479556847" width="60.8909090909091" height="7.6188752044315295" fill="#176d82"/><text x="677.0454545454545" y="228.38112479556847" text-anchor="middle" fill="#176d82" font-size="19">1.2%</text><text x="677.0454545454545" y="275" text-anchor="middle" font-size="18">6</text><rect data-count="7" data-probability="0.0034370865583901633" x="736.1454545454545" y="243.82317851301957" width="60.8909090909091" height="2.1768214869804368" fill="#176d82"/><text x="766.5909090909091" y="233.82317851301957" text-anchor="middle" fill="#176d82" font-size="19">0.3%</text><text x="766.5909090909091" y="275" text-anchor="middle" font-size="18">7</text><rect data-count="8" data-probability="0.0008592716395975408" x="825.690909090909" y="245.4557946282549" width="60.8909090909091" height="0.5442053717451092" fill="#176d82"/><text x="856.1363636363636" y="235.4557946282549" text-anchor="middle" fill="#176d82" font-size="19">0.09%</text><text x="856.1363636363636" y="275" text-anchor="middle" font-size="18">8</text><rect data-count="9" data-probability="0.00019094925324389796" x="915.2363636363636" y="245.87906547294554" width="60.8909090909091" height="0.12093452705446871" fill="#176d82"/><text x="945.6818181818182" y="235.87906547294554" text-anchor="middle" fill="#176d82" font-size="19">0.02%</text><text x="945.6818181818182" y="275" text-anchor="middle" font-size="18">9</text><rect data-count="10+" data-probability="0.000046498075017109564" x="1004.7818181818182" y="245.97055121915582" width="60.8909090909091" height="0.029448780844169395" fill="#176d82"/><text x="1035.2272727272727" y="235.97055121915582" text-anchor="middle" fill="#176d82" font-size="19">&lt;0.01%</text><text x="1035.2272727272727" y="275" text-anchor="middle" font-size="18">10+</text><path d="M95 246H1080" stroke="#71848e"/><text x="1080" y="314" text-anchor="end" font-size="20">X（日）　末尾はまとめた確率</text></g></svg>

<div class="note"> 棒はポアソンモデルの丸め前の確率。解答は配布表の小数第3位を使うため、丸めの差がある。</div>

---

<!-- _class: challenge -->

## チャレンジ②　期待値と分散を求めよう

<div class="challenge-time">自分で解く　3分 ／ 教科書 p.119–120</div>

$X$＝100日間のうちクマが現れた日数。$n=100$日、$\pi=0.02$。

独立・一定頻度のポアソンモデルを仮定する。

**(1)** 同じ条件の組・期間を繰り返すとき、$X$ の期待値と分散を求めよ。

**(2)** 期待値を「起こる確率」と言い換えてよいか？

**(3)** 現実では、独立・一定の頻度という仮定が崩れるのはどんな場合か？

<div class="note">期待値は個数の単位、分散はその単位の2乗。前の確率問題と同じXを使う。</div>

---

<!-- _class: challenge-check worked-answer -->

## 答え合わせ　期待値は、確率ではなく個数

<div class="worked-label">① 与えられた条件</div>
<div class="worked-given">

$X$＝100日間のうちクマが現れた日数。$n=100$日、$\pi=0.02$。

独立・一定頻度のポアソンモデルを仮定する。

</div>
<div class="worked-columns"><div>
<div class="worked-label">② 公式（文字のまま）</div>

$$
\begin{aligned}\lambda&=n\pi\\E(X)&=\lambda\\\operatorname{Var}(X)&=\lambda\end{aligned}
$$

</div><div>
<div class="worked-label">③ 数値を代入・計算</div>

$$
\begin{aligned}\lambda&=100\times0.02=2\\E(X)&=2\\\operatorname{Var}(X)&=2\end{aligned}
$$

</div></div>
<div class="worked-result">
<div class="worked-label">④ 答え・意味</div>

期待値 2日。分散 2日²。

同じ条件を繰り返した平均であり、毎回この個数になる保証ではない。

</div>
<div class="note">期待値を％にしても、事象の確率にはならない。仮定が崩れる例：数えるのは出現した日数で、クマの頭数・襲われる確率ではない。季節や同じクマの再出現で、独立・確率一定の仮定は崩れうる。ポアソン近似と表の丸めを使う。</div>

---

<!-- _class: answer-visual -->

## 図で確認　平均と、結果のばらつき

<div class="answer-visual-summary">期待値 2日。分散 2日²。</div>

<div class="answer-visual-legend">灰：各結果の確率　赤い破線：期待値</div>

<svg class="answer-visual-chart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1120 325" role="img" aria-label="図で確認　平均と、結果のばらつき"><g font-family="Hiragino Sans,Noto Sans JP,sans-serif" fill="#40555f"><path d="M95 246H1080" stroke="#d9e1e3"/><text x="80" y="252" text-anchor="end" font-size="18">0%</text><path d="M95 198.5H1080" stroke="#d9e1e3"/><text x="80" y="204.5" text-anchor="end" font-size="18">7.5%</text><path d="M95 151H1080" stroke="#d9e1e3"/><text x="80" y="157" text-anchor="end" font-size="18">15%</text><path d="M95 103.5H1080" stroke="#d9e1e3"/><text x="80" y="109.5" text-anchor="end" font-size="18">22.5%</text><path d="M95 56H1080" stroke="#d9e1e3"/><text x="80" y="62" text-anchor="end" font-size="18">30%</text><rect data-count="0" data-probability="0.1353352832366127" x="109.32727272727273" y="160.28765395014528" width="60.8909090909091" height="85.71234604985472" fill="#bdcbd0"/><text x="139.77272727272728" y="275" text-anchor="middle" font-size="18">0</text><rect data-count="1" data-probability="0.2706705664732254" x="198.87272727272727" y="74.57530790029057" width="60.8909090909091" height="171.42469209970943" fill="#bdcbd0"/><text x="229.3181818181818" y="275" text-anchor="middle" font-size="18">1</text><rect data-count="2" data-probability="0.2706705664732254" x="288.41818181818184" y="74.57530790029057" width="60.8909090909091" height="171.42469209970943" fill="#bdcbd0"/><text x="318.8636363636364" y="275" text-anchor="middle" font-size="18">2</text><rect data-count="3" data-probability="0.18044704431548358" x="377.9636363636364" y="131.71687193352705" width="60.8909090909091" height="114.28312806647295" fill="#bdcbd0"/><text x="408.40909090909093" y="275" text-anchor="middle" font-size="18">3</text><rect data-count="4" data-probability="0.09022352215774179" x="467.5090909090909" y="188.85843596676352" width="60.8909090909091" height="57.14156403323648" fill="#bdcbd0"/><text x="497.95454545454544" y="275" text-anchor="middle" font-size="18">4</text><rect data-count="5" data-probability="0.036089408863096716" x="557.0545454545454" y="223.1433743867054" width="60.8909090909091" height="22.856625613294586" fill="#bdcbd0"/><text x="587.5" y="275" text-anchor="middle" font-size="18">5</text><rect data-count="6" data-probability="0.012029802954365572" x="646.5999999999999" y="238.38112479556847" width="60.8909090909091" height="7.6188752044315295" fill="#bdcbd0"/><text x="677.0454545454545" y="275" text-anchor="middle" font-size="18">6</text><rect data-count="7" data-probability="0.0034370865583901633" x="736.1454545454545" y="243.82317851301957" width="60.8909090909091" height="2.1768214869804368" fill="#bdcbd0"/><text x="766.5909090909091" y="275" text-anchor="middle" font-size="18">7</text><rect data-count="8" data-probability="0.0008592716395975408" x="825.690909090909" y="245.4557946282549" width="60.8909090909091" height="0.5442053717451092" fill="#bdcbd0"/><text x="856.1363636363636" y="275" text-anchor="middle" font-size="18">8</text><rect data-count="9" data-probability="0.00019094925324389796" x="915.2363636363636" y="245.87906547294554" width="60.8909090909091" height="0.12093452705446871" fill="#bdcbd0"/><text x="945.6818181818182" y="275" text-anchor="middle" font-size="18">9</text><rect data-count="10+" data-probability="0.000046498075017109564" x="1004.7818181818182" y="245.97055121915582" width="60.8909090909091" height="0.029448780844169395" fill="#bdcbd0"/><text x="1035.2272727272727" y="275" text-anchor="middle" font-size="18">10+</text><path d="M318.8636363636364 42V250" stroke="#9b5146" stroke-width="3" stroke-dasharray="7 5"/><text x="318.8636363636364" y="26" text-anchor="middle" fill="#9b5146" font-size="21">平均 2日</text><path d="M95 246H1080" stroke="#71848e"/><text x="1080" y="314" text-anchor="end" font-size="20">X（日）　末尾はまとめた確率</text></g></svg>

<div class="note">平均は赤い破線。分散 2日² は、この平均からの距離の2乗を確率で重みづけした値。 一番高い棒と、期待値の位置は同じとは限らない。</div>
