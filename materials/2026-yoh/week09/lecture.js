/* Published Week 9 lecture: slide content and classroom interactions. */
(() => {
'use strict';
const M=window.FutureStats, slides=[];
const math=s=>`<div class="math">\\[${s}\\]</div>`;
const im=s=>`\\(${s}\\)`;
const small=s=>`<p class="secondary">${s}</p>`;
const link=(url,text)=>`<a href="${url}" target="_blank" rel="noopener">${text} ↗</a>`;
const table=type=>link(type==='t'?'../week06/t-table.html?p':'../shared/chi-table.html?p',type==='t'?'t分布表':'χ²分布表');
const rev=(s,n=1)=>`<div class="reveal" data-step="${n}">${s}</div>`;
const over=String.raw`\bar x`,hat=String.raw`\widehat{\sigma_x^2}`,known=String.raw`\sigma_x^2`,ssRule=String.raw`\sum(x_i-\bar x)^2`;
const radical=(a,b)=>String.raw`\sqrt{\frac{${a}}{${b}}}`;
const bracket=(a,b)=>String.raw`\left[${a},\;${b}\right]`;
const meanRule=(x,q,s,n,numeric=false)=>bracket(x+'-'+q+(numeric?String.raw`\times`:'')+radical(s,n),x+'+'+q+(numeric?String.raw`\times`:'')+radical(s,n));
const chiRule=(s,a,b)=>bracket(String.raw`\frac{${s}}{${a}}`,String.raw`\frac{${s}}{${b}}`);
const tCrit='t_{\\alpha}(n-1)',zCrit='z_{\\alpha}',chiUpper='\\chi^2_{0.025}(n-1)',chiLower='\\chi^2_{0.975}(n-1)';
const formula=meanRule(over,tCrit,hat,'n');
const zformula=meanRule(over,zCrit,known,'n');
const vformula=chiRule(ssRule,chiUpper,chiLower);
const varianceFormula=String.raw`${hat}=\frac{1}{n-1}\sum_{i=1}^{n}(x_i-\bar x)^2`;
const averageFormula=String.raw`\bar x=\frac{1}{n}\sum_{i=1}^{n}x_i`;
const labUrl=mode=>'curry-explore.html?p&mode='+mode+'&v=interval-fit';
function add(section,title,html,notes,opts={}){slides.push({section,title,html,notes,...opts});}
function term(ja,en){return `<h1>${ja}</h1><p class="english">${en}</p>`;}
const article='https://gvwire.com/2026/06/07/a-job-market-leaving-young-graduates-behind-could-scar-them-for-years/';
const fed='https://www.richmondfed.org/research/national_economy/macro_minute/2026/cap_gown_waiting_around_recent_college_grads_job-hunting_longer';
const japan='https://www.mext.go.jp/b_menu/toukei/chousa01/naitei/kekka/k_detail/1422624_00027.htm';
add('世界から日本へ','卒業したら、仕事はある？',`<a class="photo-link" href="${article}" target="_blank" rel="noopener"><img class="full-photo" src="images/nyt-graduate-jobs.jpg" alt="卒業生が迷路の中で仕事を探すイラスト"><div class="photo-caption"><h1>卒業したら、<br>仕事はある？</h1><p>The New York Times · 2026.6.7 ↗</p></div><span class="photo-credit">Shonagh Rae / The New York Times · GV Wire掲載</span></a>`, 'Start with the illustration. Ask: “When you graduate, what number would help you judge the job market?” Open the NYT story syndicated by GV Wire. It reports a difficult U.S. market; it does not establish that AI caused the problem.');
add('世界から日本へ','アメリカでは、長い就職活動',`<div class="chart-story"><img src="images/us-graduate-duration.jpg" alt="米国の失業期間の平均の推移。若い大卒者はオレンジ、全体は紫。"><div><p>失業中の若い大卒者</p><div class="hero orange">22.7<span>週間</span></div><p>平均失業期間</p>${small('22〜27歳・学士以上<br>2026年9月／12か月移動平均')}${link(fed,'Richmond Fed · 2026.11.10')}</div></div>`, 'The orange line is unemployed bachelor’s-degree holders aged 22–27. Their average ongoing unemployment duration is 22.7 weeks, using a 12-month moving average. This is not a prediction that every graduate will take 22.7 weeks to find work. Let students trace the orange line.',{source:'Federal Reserve Bank of Richmond · CPS / IPUMS'});
add('世界から日本へ','では、日本は？',`<div class="chart-story"><img src="images/japan-jobs-chart.png" alt="文部科学省：大学の就職内定率・就職率の推移、2026年4月98.0%"><div><div class="hero teal">98.0<span>%</span></div><p>大学の就職率</p>${rev(small('分母は<strong>就職希望者</strong>。<br>卒業生全員ではない。'))}${small('2026年3月卒／4月1日時点')}${link(japan,'文部科学省・厚生労働省')}</div></div>`, 'Bring the story home. Japan’s figure is 98.0% of university graduates who wanted employment, not 98.0% of all graduates. The university sample is 4,770 students at 62 universities; 6,250 is the broader tertiary sample. Reveal the denominator before making any comparison.',{source:'2026年5月22日公表 · 大学62校・4,770人の抽出調査'});
add('世界から日本へ','1つの数字。その先は？',`<div class="two-numbers"><div><b class="orange">22.7<small>週間</small></b><p>米国：平均失業期間</p></div><div><b class="teal">98.0<small>%</small></b><p>日本：就職希望者の就職率</p></div></div>${small('対象者も、測っているものも違う。直接の優劣比較はできない。')}${rev('<h2>推定した数字は、<br>どれくらい不確か？</h2>')}`, 'These are different measures and different reference populations. We cannot subtract them or rank the countries from these two numbers. Neither chart supplies the confidence interval we will calculate today. The bridge is the question: a survey gives a number, but how precise is an estimate?',{theme:'dark'});
add('点から区間へ','点から、幅へ',`<div class="point-to-range"><div><p>先週：点推定<br><span class="english">Point estimation</span></p><div class="range-label"><svg role="img" aria-label="点推定：オレンジの点ひとつ" viewBox="0 0 96 36" width="5em" height="2.6em" style="display:block;margin-inline:auto"><circle cx="48" cy="18" r="5" fill="#d47b39"/></svg></div></div><b aria-hidden="true">→</b><div><p>今週：区間推定<br><span class="english">Interval estimation</span></p><div class="range-label" style="display:flex;align-items:center;justify-content:center;gap:.3em">下限 <svg role="img" aria-label="点推定と上下の限界を示す区間" viewBox="0 0 96 36" width="5em" height="2.6em"><path d="M4 18H92 M4 12V24 M92 12V24" fill="none" stroke="#d47b39" stroke-width="2" stroke-linecap="round"/><circle cx="48" cy="18" r="5" fill="#d47b39"/></svg> 上限</div></div></div>`, 'Last week we used a sample to estimate an unknown population mean with one number: the orange dot. This week we keep the dot and add two endpoints. The orange ticks mark the lower and upper bounds; the interval communicates sampling uncertainty.',{book:'133'});
add('点から区間へ','両側に、境界がある',`<div class="tie-scene"><img src="images/tie.png" alt="左右に翼のあるTIEファイター"><div class="tie-label left reveal" data-step="1">下限<span>Lower bound</span></div><div class="tie-label right reveal" data-step="1">上限<span>Upper bound</span></div><p class="reveal" data-step="2">真ん中の推定値に、左右の幅をつける。</p></div>`, 'Use the two wings as a visual memory aid for two bounds. This is a mnemonic, not a graph or an equation. Point at the left and right wings, reveal their labels, then connect that picture to a number line.',{theme:'space'});
add('点から区間へ','信頼区間',term('信頼区間','Confidence interval'), 'Today’s target is a range for a population parameter. Keep the words large, then move to one small sample so every symbol has a concrete meaning.',{theme:'dark',book:'133'});
add('母平均：t','Curryの5試合',`<h2>Curryの5試合</h2><div class="scores">${[23,29,31,32,35].map(x=>`<div><span>🏀</span><b>${x}</b></div>`).join('')}</div>${small('授業用の架空の得点。独立な正規母集団からの標本と仮定。')}${rev(math(String.raw`n=5,\qquad \bar X=\frac{23+29+31+32+35}{5}=30`))}`, 'These are simulated scores, not actual game data. We assume independent observations from a normal population so the small-sample t interval is valid. Ask students for the mean first. Reveal 30. The target is the underlying mean score in this classroom model.',{theme:'cream',book:'122・133'});
add('母平均：t','まず、不偏分散',`<h2>5試合のばらつき</h2><p class="english">Unbiased sample variance</p><div class="split"><table><thead><tr><th>得点 ${im('X_i')}</th><th>偏差 ${im('X_i-30')}</th><th>偏差二乗</th></tr></thead><tbody>${[23,29,31,32,35].map(x=>`<tr><td>${x}</td><td class="reveal" data-step="1">${x-30}</td><td class="reveal" data-step="2">${(x-30)**2}</td></tr>`).join('')}</tbody><tfoot><tr><td>合計</td><td>0</td><td class="reveal" data-step="2">80</td></tr></tfoot></table><div>${rev(math(String.raw`\widehat{\sigma_x^2}=\frac{80}{5-1}=20`),3)}${rev(small('母分散は未知。<br>標本から20点²と推定。'),3)}</div></div>`, 'Reveal the deviations, then squared deviations and their sum, then divide by n−1. We use the unbiased variance because we are estimating population variance. If the exercise instead gives S² with divisor n, convert it before using the t interval.',{book:'126・132・134 脚注2'});
add('母平均：t','母分散が未知 → t',`<h1>母分散が未知<br><span class="orange">→ t分布</span></h1><p class="english">Unknown population variance → Student’s t</p>${rev('<p>標本から推定したばらつきを使う。<br>その追加の不確かさも、区間に反映する。</p>')}${small('n = 5 → 自由度 ν = n − 1 = 4')}`, 'We do not know population variance, so the denominator contains an estimate. The t distribution accounts for that uncertainty. With five independent normal observations the degrees of freedom are four. This is the rule to use here; no long degrees-of-freedom derivation is needed.',{theme:'dark',book:'125・133'});
add('母平均：t','中央95%、両端2.5%',`<h2>中央95%を、残す。</h2><div id="t-tail-chart" class="chart"></div><div class="tail-labels"><span>棄却域 2.5%</span><b>95%</b><span>棄却域 2.5%</span></div>${rev(math(String.raw`t_{0.025}(4)=2.7764`))}${table('t')}`, 'Show the central area first. Five percent remains outside, divided equally into two tails. The two outside regions are the rejection regions shown in the textbook. Here they identify the bounds for constructing the interval. Our table is an upper-tail table: use 0.025, not 0.05, for a two-sided 95% interval. At df 4 this gives 2.7764.',{book:'133・203',init:'tails'});
add('母平均：t','表で探す場所',`<h2>自由度4 × 右側0.025</h2><table class="lookup"><thead><tr><th>ν</th><th>0.05</th><th class="active">0.025</th><th>0.01</th></tr></thead><tbody>${[3,4,5].map(df=>`<tr><th class="${df===4?'active':''}">${df}</th>${[.05,.025,.01].map(a=>`<td class="${df===4&&a===.025?'target':''}">${M.tq(a,df).toFixed(4)}</td>`).join('')}</tr>`).join('')}</tbody></table>${table('t')}${small('右側確率を表す添字。95%そのものの列を探すのではない。')}`, 'Trace the row and column physically with the cursor. Their intersection is 2.7764. The linked full table has sticky headers and hover highlighting. Use it exactly as students will in the quiz.',{book:'203'});
add('母平均：t','母平均の95%信頼区間',math(formula), 'Let the entire formula occupy the slide. This is the textbook’s interval-estimation formula specialized to 95%, with 0.025 in each tail. Students should first recognize the minus and plus endpoints.',{theme:'dark',book:'133',className:'formula-slide'});
add('母平均：t','公式の3つの部品',`<h2>中心 ± 幅</h2><p class="english">Estimate ± margin of error</p><div class="parts"><button data-part="0">${im(String.raw`\bar X`)}</button><span>±</span><button data-part="1">${im(String.raw`t_{0.025}(n-1)`)}</button><span>×</span><button data-part="2">${im(String.raw`\sqrt{\widehat{\sigma_x^2}/n}`)}</button></div><p id="part-description">式の部品をクリック。</p><div class="point-line">中心 <span>← 幅 →</span></div>`, 'Click one component at a time. The sample mean locates the center; the t critical value chooses a confidence level; the standard error reflects variability and sample size. Multiplying the last two gives the margin on each side.',{book:'133',init:'parts'});
add('母平均：t','30 ± いくつ？',`<h2>5試合の数値を代入</h2>${math(String.raw`30\ \pm\ 2.7764\sqrt{\frac{20}{5}}`)}${rev(math(String.raw`\sqrt{20/5}=2`))}${rev(math(String.raw`2.7764\times2=5.5528`),2)}`, 'Keep all the earlier numbers visible: sample mean 30, variance estimate 20, n 5. First reveal standard error 2. Then reveal the margin 5.5528. Do not call 2 the sample standard deviation; it is the standard error of the sample mean.',{book:'133'});
add('母平均：t','下限、そして上限',`<div class="bounds"><div><p>下限</p>${math('30-5.5528')}<b class="reveal" data-step="1">24.45</b></div><div><p>上限</p>${math('30+5.5528')}<b class="reveal" data-step="2">35.55</b></div></div><div id="curry-interval" class="chart reveal" data-step="2"></div>`, 'Calculate the lower bound first and the upper bound second. The graphic anchors both endpoints to the same center, 30. These bounds estimate the population mean under our model, not a range containing 95% of individual game scores.',{book:'133',init:'curryInterval'});
add('95%の意味','95%とは、何の95%？',`<h1>同じ手順で、<br>何度も区間を作ったら。</h1>${rev('<p class="large">その約95%が、真の母平均を含む。</p>')}${rev(small('「得点の95%がこの間」ではない。<br>今回の固定された区間に母平均が入る／入らないは、すでに決まっている。'),2)}`, 'The procedure has 95% long-run coverage under the assumptions. It does not promise exactly 95 hits in every set of 100, and it does not describe the distribution of individual scores. We keep the true mean fixed and let the samples and intervals change.',{theme:'teal',book:'133'});
add('95%の意味','100本の区間を作る',`<h2>真の母平均は固定。区間が動く。</h2><div id="coverage-chart" class="chart coverage"></div><div class="compact-controls"><button id="coverage-run">100回 ▶</button><button id="coverage-reset">↺</button><output id="coverage-count">0 / 0</output></div>${small('正規母集団 μ = 30、σ² = 20。毎回5個を独立に抽出。<br>青緑：30を含む ／ オレンジ：含まない。')}`, 'Ask for a prediction before running. Each horizontal line is a new 95% t interval from five observations. Watch some miss the fixed mean. Reset and rerun if time permits; the observed proportion changes because 100 repetitions is finite.',{book:'133',init:'coverage'});
add('95%の意味','確実さを上げると、幅は？',`<h2>同じ標本。変えるのは、信頼係数。</h2><p class="english">Confidence level</p><div id="confidence-chart" class="chart"></div><div class="compact-controls"><label>信頼係数 <input id="confidence" type="range" min="0" max="2" step="1" value="1"></label><output id="confidence-result"></output></div>${small('5試合：平均30点、不偏分散20点²。90%・95%・99%を比較。')}`, 'Move the confidence slider from 90% to 99%. More coverage requires a wider interval when the sample is unchanged. This is not improved precision. Let students predict direction before moving the slider.',{book:'133',init:'confidence'});
add('チャレンジ1','ロボットの平均身長',`<p class="challenge-time">5分 · 自分で解く</p><h2>この工場のロボットは、平均何cm？</h2><div class="givens"><div><small>標本数</small><b>9体</b></div><div><small>標本平均</small><b>160cm</b></div><div><small>不偏分散</small><b>36cm²</b></div></div><ol><li>自由度と、表で使うt値を求める。</li><li>母平均の95%信頼区間を求める。</li></ol>${small('独立な正規標本。母分散は未知。') }<details><summary>参考公式</summary>${math(formula)}</details>${table('t')}`, 'Give students five minutes, individually. They have the unbiased variance already, so no raw-data table is required. They must choose df 8, right-tail 0.025, then calculate both endpoints. Leave the reference formula collapsed unless needed.',{book:'133・203',challenge:true});
add('チャレンジ1','答え：155.39〜164.61cm',`<h2>母平均の95%信頼区間</h2>${math(String.raw`160\pm2.3060\sqrt{36/9}`)}${rev(math(String.raw`160\pm4.612`))}${rev('<div class="result">155.39〜164.61 cm</div>',2)}<div id="robot-answer" class="chart reveal" data-step="2"></div>`, 'Show the symbolic reference on the question if requested. Here substitute n9, mean160, variance36, df8. Reveal standard error2 and margin4.612, then the result. The chart is a range for the population mean height, not all robot heights.',{book:'133',init:'robotAnswer'});
add('母平均：Z','母分散が既知なら、Z',`<div class="z-section-lead"><h1><span>母分散が既知なら</span><strong>Z</strong></h1><p>標準正規分布 <span class="english">Standard normal distribution</span></p><small>標本不偏分散が与えられていても、母分散が未知なら <em>t</em>。</small></div>`, 'We are still estimating a population mean. With unknown population variance, the earlier interval used t and an estimated variance. Knowing the sample SD is not the same as knowing the population SD. If the population variance is known (equivalently, the population SD is known), use Z.',{theme:'dark',className:'z-section-hero',book:'124〜125・133',key:'known-variance-z'});
add('母平均：Z','ロボット電池の持続時間：問題',`<h2>ロボットの電池は平均何分もつ？</h2><p class="battery-prompt">同じ工場で作ったロボットを無作為に選び、満充電から電池切れまでの時間を同じ条件で測った。</p>
  <div class="givens battery-givens"><div><small>標本数 ${im('n')}</small><b>25<small>台</small></b></div><div><small>標本平均 ${im('\\bar x')}</small><b>120<small>分</small></b></div><div><small>既知の母標準偏差 ${im('\\sigma_x')}</small><b>10<small>分</small></b></div></div>
  <p class="battery-question">電池の持続時間の母平均の<strong>95%信頼区間</strong>を求めよ。</p><span class="english">95% confidence interval for the population mean</span>${small('独立な正規標本と仮定する。')}`,
  'Read the problem before showing the formula. 120 minutes is the mean of the 25 sampled robots, not the population mean. The population standard deviation of 10 minutes is given, and the problem asks for a 95% interval.',{theme:'cream',className:'battery-problem',book:'124〜125・133',key:'battery-problem'});
add('母平均：Z','Zの区間推定の公式','', 'Show the symbolic interval before revealing the three leaders. The standard error uses the known population variance, with no hat on sigma squared. The critical value is from the standard normal distribution.',{theme:'cream',className:'formula-preview',book:'124〜125・133',key:'z-interval-formula'});
add('母平均：Z','ロボットの電池：計算と答え','', 'Insert the observed mean, then the known variance and sample size. Locate the right-tail probability 0.02500 in the Z table. The row and column give 1.96, so the margin is 3.92 minutes.',{book:'124〜125・133',key:'battery-solution'});
add('母平均：Z','標本数で、幅を動かす',`<h2>同じ平均、同じ母標準偏差。</h2><div id="size-chart" class="chart"></div><div class="compact-controls"><label>n <input id="size" type="range" min="5" max="100" value="25" step="1"></label><output id="size-result"></output></div>${math(String.raw`120\pm1.96\frac{10}{\sqrt n}`)}`, 'Use the sample-size slider with population standard deviation10 fixed. Explain the square-root relationship with one concrete comparison: quadrupling n halves the margin. Holding sample mean120 fixed isolates the effect of sample size.',{book:'134 脚注1',init:'size'});
add('母分散：χ²','母分散の区間推定',term('母分散の区間推定','Confidence interval for population variance'), 'Now change the target: not the mean score, but the underlying variance of scores. A point estimate of20 does not mean we know the population variance exactly.',{theme:'gold',book:'135〜136'});
add('母分散：χ²','20点²も、推定値。',`<div class="scores mini">${[23,29,31,32,35].map(x=>`<b>${x}</b>`).join('')}</div><div class="hero">20<span>点²</span></div><p>不偏分散による、母分散の点推定。</p>${rev('<h2>散らばりに、下限と上限を。</h2>')}`, 'Return to exactly the same five simulated Curry scores. The mean was30 and the sum of squared deviations80. Dividing80 by4 estimated variance as20. Now construct a confidence interval for that population variance.',{theme:'cream',book:'135〜136'});
add('母分散：χ²','カイ二乗は、左右非対称',`<h2>同じ中央95%。左右の境界は違う。</h2><p class="english">Chi-square distribution · ν = 4</p><div id="chi-tail-chart" class="chart"></div><div class="tail-labels"><span>2.5%</span><b>95%</b><span>2.5%</span></div>${rev('<p>右側0.975 → <b>0.4844</b> ／ 右側0.025 → <b>11.1433</b></p>')}${table('chi')}`, 'For a normal population, the sum of squared deviations divided by the population variance follows chi-square with df4. We use two different positive critical values. The table is upper-tail: the smaller boundary leaves97.5% to its right, and the larger leaves2.5%. Do not use a symmetric plus/minus formula.',{book:'135〜136',init:'chiTails'});
add('母分散：χ²','母分散の95%信頼区間',math(vformula), 'This is the textbook variance-interval formula on page136. Keep the sum of squared deviations in both numerators. The larger denominator belongs to the lower endpoint. Normality is required for this chi-square interval.',{theme:'dark',book:'136',className:'formula-slide'});
add('母分散：χ²','大きい数で割ると、小さくなる',`<h2>偏差二乗和は、どちらも80。</h2><div class="bounds"><div><p>下限</p><button class="denominator" data-denom="large">${math(String.raw`\frac{80}{11.1433}`)}</button><b id="variance-low" hidden>7.18 点²</b></div><div><p>上限</p><button class="denominator" data-denom="small">${math(String.raw`\frac{80}{0.4844}`)}</button><b id="variance-high" hidden>165.15 点²</b></div></div>${small('式をクリックして、計算結果を確認。')}<div id="variance-interval" class="chart concealed"></div>`, 'Ask students which denominator gives the smaller result. Click each expression to reveal its endpoint. The interval is very wide and asymmetric because this is a tiny sample. Units are points squared. The dot20 is the unbiased point estimate, not the midpoint of this interval.',{book:'136',init:'varianceAnswer'});
add('母分散：χ²','S²が与えられたら？',`<h2>「nで割った分散」と、混同しない。</h2>${math(String.raw`S^2=\frac{1}{n}\sum(X_i-\bar X)^2`)}${rev(math(String.raw`\sum(X_i-\bar X)^2=nS^2=5\times16=80`))}${rev(math(String.raw`\widehat{\sigma_x^2}=\frac{nS^2}{n-1}=\frac{80}{4}=20`),2)}`, 'This is the conversion students need when a question or worksheet gives sample variance with divisor n. Rebuild the sum of squares first. For mean t intervals use the unbiased variance20; for variance intervals use the sum of squares80. These are our practice numbers, not homework cell answers.',{book:'134 脚注2・136'});
add('チャレンジ2','配送時間のばらつき',`<p class="challenge-time">5分 · 自分で解く</p><h2>配送時間は、どれくらい散らばる？</h2><div class="givens"><div><small>標本数</small><b>6回</b></div><div><small>偏差二乗和</small><b>30分²</b></div></div><ol><li>自由度と、2つのχ²値を求める。</li><li>母分散の95%信頼区間を求める。単位も書く。</li></ol>${small('独立な正規標本と仮定。') }<details><summary>参考公式</summary>${math(vformula)}</details>${table('chi')}`, 'Give five minutes. The sum of squared deviations is supplied to isolate the two-table-bound calculation. Students must use df5 and upper-tail0.025 and0.975. Check that they report variance units, minutes squared.',{book:'136',challenge:true});
add('チャレンジ2','答え：2.34〜36.09分²',`${math(String.raw`\left[\frac{30}{12.8325},\ \frac{30}{0.8312}\right]`)}${rev('<div class="result">2.34〜36.09 分²</div>')}<div id="delivery-answer" class="chart reveal" data-step="1"></div>${small('自由度5。不偏分散の点推定は30 ÷ 5 = 6分²。')}`, 'Trace the two critical values in the linked table. Divide the same numerator30 by the larger and smaller values. Mark the variance estimate6 on the asymmetric interval. With rounded table values the upper endpoint rounds to36.09.',{book:'136',init:'deliveryAnswer'});
add('まとめ・クイズ・AL','何を、区間で推定する？',`<h2>求めるもの → 条件 → 分布</h2><table class="choice"><thead><tr><th>求めるもの</th><th>条件</th><th>分布</th><th>単位の例</th></tr></thead><tbody><tr><td>母平均</td><td>母分散が未知</td><td>t</td><td>点・分・cm</td></tr><tr><td>母平均</td><td>母分散が既知</td><td>Z</td><td>点・分・cm</td></tr><tr><td>母分散</td><td>正規母集団</td><td>χ²</td><td>点²・分²・cm²</td></tr></tbody></table>`, 'Use this as the last decision check before the quiz. Ask what the target parameter is before asking which table. All sample examples assume independent observations, and exact small-sample t and chi-square intervals assume normal populations.',{book:'133〜136'});
add('まとめ・クイズ・AL','20分、試験と同じように。',`<h1>期末試験形式<br>3問 · 20分</h1><div class="quiz-links">${link('quiz.html?p','問題を開く')}${link('quiz-answers.html?p','答え合わせ')}</div>${small('計算過程を示す。上下限と単位を、忘れずに。')}`, 'Open the HTML quiz in a new tab and give20 minutes. It combines prior work on unbiased variance, standardization and normal-table lookup with all three interval methods: t, Z and chi-square. References are collapsed by default. Unlock the worked answers after the quiz.',{theme:'dark'});
add('まとめ・クイズ・AL','AL：ここからは、自分で。',`<h1>母平均の<br>信頼区間を作る。</h1><div class="al-steps"><span>① 条件を読む</span><span>② 分散の定義を確認</span><span>③ 表を選ぶ</span><span>④ 下限・上限と単位</span></div>${link('../../../assets/worksheet-previews/w09/index.html?p','ワークシートを見る')}`, 'Students now apply the workflow independently to the assigned AL worksheet. Do not reveal or populate homework answers. Remind them to check whether the given sample variance uses n or n−1, show their working and write both bounds with units.',{book:'133〜136'});
add('まとめ・クイズ・AL','点だけでなく、幅を見る。',`<div class="tie-scene"><img src="images/tie.png" alt="左右の境界を思い出すTIEファイター"><h1>推定値に、幅を。</h1><p>下限 ── 点推定 ── 上限</p></div>`, 'Return to the image. The memory students should leave with: identify the target, choose the appropriate distribution, and report an interval rather than treating a sample estimate as exact.',{theme:'space'});

// Keep preview links to the original lecture valid as new practice slides are inserted.
const legacyLecture = slides.slice();
const foodTruckWaits=[14,11,18,15,12,14];
const insertAfter=(title,build)=>{
  const at=slides.findIndex(s=>s.title===title);
  const start=slides.length;
  build();
  const extra=slides.splice(start);
  slides.splice(at+1,0,...extra);
};
insertAfter('下限、そして上限',()=>{
  add('母平均：t','Curryの5試合を引き直す',`<h2>次の5試合でも<br>同じ区間になる？</h2><p class="english">Repeated t intervals</p>
    ${link(labUrl('curry'),'Curryの5試合をシミュレーション')}`, 'Open the lab at its starting example. The chart, textbook formula and substitution are already visible. Draw five new scores and trace how the average, estimated variance and endpoints change together. A single game produces a dot, but cannot provide a t interval.',{book:'133',key:'curry-lab'});
});
insertAfter('100本の区間を作る',()=>{
  add('チャレンジ2','学園祭のキッチンカー：平均待ち時間',`<p class="challenge-time">6分 · 自分で解く</p><h2>学園祭のキッチンカー：平均待ち時間</h2>
    <p class="practice-prompt">昼の営業中、無作為に選んだ6件について、注文から受け取りまでの時間を記録した。</p>
    <div class="practice-values" aria-label="6件の待ち時間、単位は分">${foodTruckWaits.map(wait=>`<b>${wait}</b>`).join('')}<small>分</small></div>
    <ol class="practice-parts"><li>標本平均と標本不偏分散を求めよ。</li><li>自由度と上側確率を求め、t分布表から境界値を読め。</li><li>昼の待ち時間の母平均の<strong>90%信頼区間</strong>を求めよ。両端は小数第3位まで。</li></ol>
    ${small('独立な正規標本と仮定する。母分散は未知。')}<div class="practice-formula"><div class="practice-reference"><span>参考公式 / Confidence interval for the population mean</span>${table('t')}</div>${math(formula)}</div>`,
    'Give students six minutes. This is a mock exam problem, with six raw observations and 90% rather than 95%. They need to compute the sample mean and unbiased variance, then locate the t critical value and both endpoints.',{challenge:true,theme:'cream',className:'practice-question',book:'132〜134・203',key:'food-truck-practice'});
  add('チャレンジ2','答え：キッチンカーの90%信頼区間','',
    'The deviations from 14 are 0, −3, 4, 1, −2 and 0. Their squares sum to 30. The unbiased sample variance is 6, the standard error is 1, and the 90% critical value with five degrees of freedom is 2.0150. The interval 11.985 to 16.015 minutes estimates the population mean, not the wait for an individual order.',{book:'132〜134・203',key:'food-truck-answer'});
});
insertAfter('標本数で、幅を動かす',()=>{
  add('チャレンジ3','通学時間の母平均',`<p class="challenge-time">4分 · 自分で解く</p><h2>通学時間の母平均は、何分くらい？</h2>
    <div class="givens"><div><small>標本数 / n</small><b>36人</b></div><div><small>標本平均 / Sample mean</small><b>42分</b></div><div><small>母標準偏差 / Population SD</small><b>12分</b></div></div>
    <ol><li>Zとtのどちらを使うか。理由も書く。</li><li>母平均の95%信頼区間を求める。</li></ol>${small('授業用のモデル。独立な正規標本、母標準偏差は既知。')}<details><summary>参考公式 / Formula</summary>${math(zformula)}</details>`,
    'Use after the sample-size slider. Let students decide whether 12 is a population standard deviation or a sample statistic. The numbers are for a classroom model, not measured commute times.',{challenge:true,book:'134 脚注1'});
  add('チャレンジ3','答え：38.08〜45.92分',`<h2>母標準偏差が既知 → Z</h2>${math(String.raw`42\pm1.96\frac{12}{\sqrt{36}}=42\pm3.92`)}
    ${rev('<b class="result">38.08〜45.92分</b><div id="commute-answer" class="chart"></div>')}`,
    'The standard error is 12 divided by 6, which is 2 minutes. Multiply by 1.96 and add/subtract 3.92 from 42. These bounds estimate the population mean, not a range for one student’s commute.',{book:'134 脚注1',mount(root){
      root.querySelector('#commute-answer').innerHTML=intervalGraphic(38.08,45.92,42,'分',35,49);
    }});
});
for(const s of slides) {
  if(s.section==='チャレンジ1') s.section='チャレンジ2';
  else if(s.section==='チャレンジ2') s.section=legacyLecture.includes(s)?'チャレンジ4':'チャレンジ1';
}

// Keep the textbook layout through the example. Highlight a part, find its value,
// then replace that term in the same two-ended expression.
const wSlot=(label,value,cls='')=>`<span class="work-slot ${cls}"><small>${label}</small><i aria-hidden="true">↓</i><span>${value}</span></span>`;
const wEq=(...items)=>`<div class="work-equation">${items.map(i=>i.startsWith('<')?i:`<span>${i}</span>`).join('')}</div>`;
const wNote=text=>`<p class="work-note">${text}</p>`;
const intervalConclusion=(level,target,lo,hi,unit)=>`<p class="work-conclusion">信頼水準${level}%で、${target}は<strong>${lo}〜${hi}${unit}</strong>と推定される。</p>`;
function worked(title,beats,{legend=false}={}){
  const s=slides.find(s=>s.title===title);
  if(!s) throw new Error('Missing worked slide: '+title);
  s.theme='cream';s.className='worked-slide'+(legend?' formula-follow':'');s.init=undefined;s.mount=undefined;
  s.html=beats.map(([header,content,formulaLegend],i)=>`<section class="work-beat${i?' reveal':''}" data-work="${i}"${i?` data-step="${i}"`:''}>${formulaLegend||''}<div class="work-details"><h2>${header}</h2>${content}</div></section>`).join('');
}
const wChart=(lo,hi,center,unit,min,max,matchBounds=false,digits=2)=>`<div class="work-chart${matchBounds?' endpoint-chart':''}">${intervalGraphic(lo,hi,center,unit,min,max,matchBounds,digits)}</div>`;
// Formula terms occupy fixed grid tracks. The same tracks are reused in both
// rows, and neither the current content nor its font weight can move them.
const mi=s=>`<mi>${s}</mi>`,mn=s=>`<mn>${s}</mn>`,mo=s=>`<mo>${s}</mo>`;
const mover=(a,b)=>`<mover accent="true">${a}${mo(b)}</mover>`;
const msub=(a,b)=>`<msub>${a}${b}</msub>`,msup=(a,b)=>`<msup>${a}${b}</msup>`;
const mrow=s=>`<mrow>${s}</mrow>`,mfrac=(a,b)=>`<mfrac>${a}${b}</mfrac>`;
const mroot=a=>`<msqrt>${a}</msqrt>`;
const mbar=mover(mi('x'),'¯'),msigma=msup(msub(mi('σ'),mi('x')),mn(2)),mhat=mover(msigma,'^');
const mdof=mo('(')+mi('n')+mo('−')+mn(1)+mo(')');
const mathToken=v=>`<math>${mrow(v)}</math>`;
const focusTerm=(v,role,focus,side)=>`<span class="legend-term legend-${role}${focus.has(role)||focus.has(side)?' is-focus':''}" data-role="${role}"${side?` data-side="${side}"`:''}>${mathToken(v)}</span>`;
const bracketMark=side=>`<span class="legend-bracket ${side}" aria-hidden="true"></span>`;
const sign=(s,active=false,side)=>`<span class="legend-sign${active?' is-focus':''}"${side?` data-side="${side}"`:''}>${s}</span>`;
function formulaLegend(kind,rule,work,bounds){
  const answer=(side,label,value,unit)=>`<div data-side="${side}"><span class="endpoint-arrow" aria-hidden="true">↓</span><span class="endpoint-value"><small>${label}</small> ${value}<small>${unit}</small></span></div>`;
  const results=bounds?`<div class="legend-row endpoint-answers"><span class="legend-label">結果</span><div class="endpoint-map">${answer('lower','下限',bounds.lo,bounds.unit)}${answer('upper','上限',bounds.hi,bounds.unit)}</div></div>`:'';
  return `<div class="formula-legend legend-${kind}${bounds?' shows-endpoints':''}"><div class="legend-row" data-row="symbolic"><span class="legend-label">公式</span><div class="legend-expression">${rule}</div></div><div class="legend-row" data-row="working"><span class="legend-label">代入</span><div class="legend-expression">${work}</div></div>${results}</div>`;
}
function meanExpression(isT,{center,q,variance,n,se,alpha,df}={},active=[]){
  const focus=new Set(active);
  const avg=center==null?mbar:mn(center);
  const boundary=q==null?msub(mi(isT?'t':'z'),alpha==null?mi('α'):mn(alpha))+(isT?(df==null?mdof:mo('(')+mn(df)+mo(')')):''):mn(q);
  const numerator=variance==null?(isT?mhat:msigma):mn(variance);
  const markedNumerator=`<mrow class="legend-spread${focus.has('variance')?' is-focus':''}" data-role="variance">${numerator}</mrow>`;
  const error=se==null?mroot(mfrac(markedNumerator,n==null?mi('n'):mn(n))):mn(se);
  const half=(s,side)=>focusTerm(avg,'mean',focus,side)+sign(s,focus.has(side),side)+focusTerm(boundary,'critical',focus,side)+
    sign(q==null?'&nbsp;':'×',focus.has(side)||focus.has('critical')&&focus.has('spread'),side)+focusTerm(error,'spread',focus,side);
  return bracketMark('left')+half('−','lower')+sign(',')+half('+','upper')+bracketMark('right');
}
function meanLegend(isT,values={},active=[],bounds){
  return formulaLegend('mean-pair',meanExpression(isT,{},active),meanExpression(isT,values,active),bounds);
}
function intervalPreview({annotate=false,isT=true,startBare=false}={}){
  const callout=(role,ja,en,step)=>`<div class="formula-callout legend-${role}${step?' reveal':' shown'}"${step?` data-step="${step}"`:''}><span class="formula-leader" aria-hidden="true"></span><span>${ja}<small>${en}</small></span></div>`;
  const offset=startBare?1:0,cutoff=isT?'t':'Z';
  const callouts=annotate?
    callout('mean','① 標本平均','Sample mean',offset)+
    callout('spread','② <ruby>標<rt>ひょう</rt></ruby><ruby>準<rt>じゅん</rt></ruby><ruby>誤<rt>ご</rt></ruby><ruby>差<rt>さ</rt></ruby>','Standard error',1+offset)+
    callout('critical',`③ ${cutoff}の境界値`,`${cutoff} critical value`,2+offset):'';
  return `<div class="legend-expression interval-diagram${isT?'':' z-interval-diagram'}">${meanExpression(isT)}${callouts}</div>`;
}
function chiLegend(values={},active=[]){
  const focus=new Set(active);
  const summed=mo('∑')+msup(mrow(mo('(')+msub(mi('x'),mi('i'))+mo('−')+mbar+mo(')')),mn(2));
  const cutoff=tail=>msub(msup(mi('χ'),mn(2)),mn(tail))+mdof;
  const part=(v,role,side)=>`<mrow class="legend-${role}${focus.has(role)||focus.has(side)?' is-focus':''}">${v}</mrow>`;
  const render=({ss,a,b})=>{
    const half=(value,tail,side)=>mathToken(mfrac(part(ss==null?summed:mn(ss),'spread',side),part(value==null?cutoff(tail):mn(value),'critical',side)));
    return bracketMark('left')+half(a,'0.025','lower')+sign(',')+half(b,'0.975','upper')+bracketMark('right');
  };
  return formulaLegend('chi-pair',render({}),render(values));
}
const usingLegend={legend:true};
function meanBeats({center,variance,n,critical,se,margin,lo,hi,unit,domain,target,t=false,mapEndpoints=false}){
  const varianceName=t?'不偏分散':'母分散（既知）';
  const q=critical,filled={center,q,variance,n},computed={...filled,se};
  return [
    ['母平均の信頼区間',wNote(t?'母分散が未知のため、t分布を使う。':'母分散が既知のため、標準正規分布を使う。'),meanLegend(t,{},['mean','spread','critical'])],
    ['① 中心：標本平均',wNote('両方の x̄ に '+center+' '+unit+' が入る。'),meanLegend(t,{center},['mean'])],
    ['② 標準誤差：分散と標本数',math(radical(variance,n)+'='+se)+
      wNote(varianceName+'を標本数で割り、平方根を取る。'),meanLegend(t,{center,variance,n},['spread'])],
    ['③ 境界：分布表の値',
      wNote(t?`上側確率 0.025、自由度 ${n} − 1 = ${n-1}。表の t 値は ${q}。`:`上側確率 0.025。表の Z の値は ${q}。`),meanLegend(t,filled,['critical'])],
    ['片側の幅',math(q+'\\times'+se+'='+margin)+wNote('境界値 × 標準誤差'),meanLegend(t,computed,['critical','spread'])],
    ['下限と上限',wEq(wSlot('下限',center+' − '+margin+' ≈ '+lo,'mean'),wSlot('上限',center+' ＋ '+margin+' ≈ '+hi,'mean')),meanLegend(t,computed,['lower','upper'])],
    ['母平均の95%信頼区間',(mapEndpoints?'':`<div class="work-value">${lo} ～ ${hi} ${unit}</div>`)+
      wChart(+lo,+hi,center,unit,...domain,mapEndpoints)+intervalConclusion(95,target,lo,hi,unit),meanLegend(t,computed,[],mapEndpoints?{lo,hi,unit}:undefined)]
  ];
}
function varianceBeats({ss,n,a,b,lo,hi,center,unit,max,target}){
  const df=n-1,filled={ss,a,b};
  return [
    ['母分散の区間','',chiLegend({},['spread','critical'])],
    ['① 分子：偏差二乗和',wNote('両方の分子に '+ss+' '+unit+' が入る。'),chiLegend({ss},['spread'])],
    ['② 分母：2つのχ²値',wNote(`自由度 ${df}。上側確率 0.025 なら ${a}、0.975 なら ${b}。`)+table('chi'),chiLegend(filled,['critical'])],
    ['下限と上限',math(chiRule(ss,a,b)+'\\approx'+bracket(lo,hi))+wNote('大きい値で割ると下限、小さい値で割ると上限。'),chiLegend(filled,['lower','upper'])],
    ['下限と上限',`<div class="work-value">${lo} ～ ${hi} ${unit}</div>`+wChart(+lo,+hi,center,unit,0,max)+
      intervalConclusion(95,target,lo,hi,unit),chiLegend(filled)]
  ];
}
const curry={center:30,variance:20,n:5,critical:'2.7764',se:'2',margin:'5.5528',lo:'24.45',hi:'35.55',unit:'点',domain:[20,40],target:'Curryの1試合あたりの平均得点',t:true,mapEndpoints:true};
worked('30 ± いくつ？',meanBeats(curry).slice(4,5),usingLegend);
worked('下限、そして上限',meanBeats(curry).slice(5),usingLegend);
worked('答え：155.39〜164.61cm',meanBeats({center:160,variance:36,n:9,critical:'2.3060',se:'2',margin:'4.612',lo:'155.39',hi:'164.61',unit:'cm',domain:[152,168],target:'この工場で作るロボットの平均身長',t:true}),usingLegend);
{
  const battery={center:120,variance:100,n:25,critical:'1.96',se:'2',margin:'3.92',lo:'116.08',hi:'123.92',unit:'分',domain:[113,127],target:'ロボットの電池の平均持続時間',mapEndpoints:true};
  const {center,variance,n,critical:q}=battery,filled={center,variance,n};
  const zExcerpt=selected=>`<table class="lookup battery-z-table" aria-label="標準正規分布表の抜粋：上側確率"><thead><tr><th scope="col">z</th>${[.05,.06,.07].map(d=>`<th scope="col" class="${selected&&d===.06?'active':''}">${d.toFixed(2)}</th>`).join('')}</tr></thead><tbody>${[1.8,1.9,2.0].map(r=>`<tr><th scope="row" class="${selected&&r===1.9?'active':''}">${r.toFixed(1)}</th>${[.05,.06,.07].map(d=>`<td class="${selected&&r===1.9&&d===.06?'target':''}">${(1-M.normalCdf(r+d)).toFixed(5)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const lookupNote=wNote(`標準正規分布表（上側確率）で ${im('(1-0.95)/2=0.02500')} を探す。`);
  const zTable=link('../week05/normal-upper-tail-table.html?p','標準正規分布表（上側確率）');
  const steps=meanBeats(battery);
  worked('ロボットの電池：計算と答え',[
    steps[1],
    ['② 既知の母分散を使う',math(String.raw`\sigma_x^2=10^2=100\qquad \sqrt{\frac{100}{25}}=2`)+wNote('母標準偏差10分を二乗して、母分散100分²を得る。'),meanLegend(false,filled,['spread'])],
    ['③ Z表で上側確率0.02500を探す',lookupNote+zExcerpt(false)+zTable,meanLegend(false,{...filled,alpha:'0.025'},['critical'])],
    ['③ Zの境界値は1.96',wNote(`確率0.02500のセルは、行 ${im('1.9')} と列 ${im('0.06')}。したがって ${im('z=1.9+0.06=1.96')}。`)+zExcerpt(true)+zTable,meanLegend(false,{...filled,q},['critical'])],
    ...steps.slice(4)
  ],usingLegend);
}
worked('答え：38.08〜45.92分',meanBeats({center:42,variance:144,n:36,critical:'1.96',se:'2',margin:'3.92',lo:'38.08',hi:'45.92',unit:'分',domain:[35,49],target:'学生全体の平均通学時間'}),usingLegend);
worked('大きい数で割ると、小さくなる',varianceBeats({ss:80,n:5,a:'11.1433',b:'0.4844',lo:'7.18',hi:'165.15',center:20,unit:'点²',max:180,target:'Curryの1試合あたりの得点の母分散'}).slice(2),usingLegend);
worked('答え：2.34〜36.09分²',varianceBeats({ss:30,n:6,a:'12.8325',b:'0.8312',lo:'2.34',hi:'36.09',center:6,unit:'分²',max:40,target:'配送時間の母分散'}),usingLegend);
{
  const n=foodTruckWaits.length,total=foodTruckWaits.reduce((a,x)=>a+x,0),center=total/n,df=n-1;
  const rows=foodTruckWaits.map(x=>({x,d:x-center,sq:(x-center)**2}));
  const squaredSum=rows.reduce((a,{sq})=>a+sq,0),variance=squaredSum/df,se=Math.sqrt(variance/n);
  const alpha=.05,q=M.tq(alpha,df).toFixed(4),unit='分',margin=Number(q)*se;
  const lo=(center-margin).toFixed(3),hi=(center+margin).toFixed(3);
  const done={center,variance,n,se,q};
  const calcTable=showDeviation=>`<table class="deviation-table" data-stat="${showDeviation?'variance':'mean'}" aria-label="待ち時間の計算表"><thead><tr><th scope="col">注文</th><th scope="col">待ち時間 ${im('x_i')}</th><th scope="col">偏差 ${im('x_i-\\bar x')}</th><th scope="col">偏差の二乗</th></tr></thead><tbody>${rows.map(({x,d,sq},k)=>`<tr><th scope="row">${k+1}</th><td>${x}</td><td>${showDeviation?`${x} − ${center} = ${String(d).replace('-','−')}`:''}</td><td>${showDeviation?sq:''}</td></tr>`).join('')}</tbody><tfoot><tr><th scope="row">合計</th><td>${total}</td><td>${showDeviation?0:''}</td><td>${showDeviation?squaredSum:''}</td></tr></tfoot></table>`;
  const withCalcTable=(showDeviation,body)=>`<div class="var-work food-truck-calculation">${calcTable(showDeviation)}<div>${body}</div></div>`;
  const tailColumns=[.10,alpha,.025];
  const lookup=`<table class="lookup food-truck-lookup" aria-label="t分布表の抜粋：上側確率"><thead><tr><th scope="col">ν ＼ α</th>${tailColumns.map(a=>`<th scope="col" class="${a===alpha?'active':''}">${a===.10?'0.10':a}</th>`).join('')}</tr></thead><tbody>${[df-1,df,df+1].map(d=>`<tr><th scope="row" class="${d===df?'active':''}">${d}</th>${tailColumns.map(a=>`<td class="${d===df&&a===alpha?'target':''}">${M.tq(a,d).toFixed(4)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  worked('答え：キッチンカーの90%信頼区間',[
    ['① 標本平均は14分',withCalcTable(false,wNote('「待ち時間」列の合計を件数で割る。')+math(String.raw`\bar x=\frac{${total}}{${n}}=${center}`)),meanLegend(true,{center},['mean'])],
    ['① 標本不偏分散は6分²',withCalcTable(true,wNote('「偏差の二乗」列の合計を、件数 − 1 で割る。')+math(String.raw`${hat}=\frac{${squaredSum}}{${n}-1}=\frac{${squaredSum}}{${df}}=${variance}`)),meanLegend(true,{center,variance},['variance'])],
    ['標準誤差は1分',math(String.raw`\sqrt{\frac{6}{6}}=1`),meanLegend(true,{center,variance,n},['spread'])],
    ['② 90%信頼区間の t の境界値',wNote(`上側確率 ${im('(1-0.90)/2=0.05')}、自由度 ${im('6-1=5')}。`)+lookup+table('t'),meanLegend(true,done,['critical'])],
    ['③ 母平均の90%信頼区間',wChart(+lo,+hi,center,unit,10,18,true,3)+intervalConclusion(90,'キッチンカーの昼の平均待ち時間',lo,hi,unit),meanLegend(true,done,[],{lo,hi,unit})]
  ],usingLegend);
}

// Keep the same two rows from the map of the formula through the finished interval.
const byTitle=title=>slides.find(s=>s.title===title);
const scores=[23,29,31,32,35];
const averageNumeric=String.raw`\bar x=\frac{23+29+31+32+35}{5}=\frac{150}{5}=30`;
const varianceTable=`<table class="deviation-table" aria-label="得点と偏差二乗"><thead><tr><th scope="col">得点</th><th scope="col">偏差（得点 − 30）</th><th scope="col">偏差の二乗</th></tr></thead><tbody>${scores.map(x=>{
  const d=x-curry.center;
  return `<tr><td>${x}</td><td>${x} − ${curry.center} = ${String(d).replace('-','−')}</td><td>${d**2}</td></tr>`;
}).join('')}</tbody><tfoot><tr><th scope="row" colspan="2">偏差二乗和</th><td>80</td></tr></tfoot></table>`;
const squareTotal=()=>`<div class="var-work curry-deviations">${varianceTable}<div><div class="square-sum-label">偏差二乗和<span>Sum of squared deviations</span></div>${math('49+1+1+4+25=80')}</div></div>`;
{
  const sample=byTitle('Curryの5試合'),whole=byTitle('母平均の95%信頼区間'),map=byTitle('公式の3つの部品');
  const variance=byTitle('まず、不偏分散'),tHero=byTitle('母分散が未知 → t');
  const tails=byTitle('中央95%、両端2.5%'),tLookup=byTitle('表で探す場所');
  const lookupBody=tLookup.html.replace(/^<h2>.*?<\/h2>/,'');
  const centered={center:30},spreadDone={...centered,variance:20,n:5};
  const tailReady={...spreadDone,se:curry.se,alpha:'0.025',df:4};
  sample.html=`<h2>Curryの1試合あたりの得点</h2><div class="scores">${scores.map(x=>`<div><span>🏀</span><b>${x}</b></div>`).join('')}</div><div class="curry-question"><p>この5試合を標本として、1試合あたりの得点の母平均の<strong>95%信頼区間</strong>を求めなさい。</p><span class="english">95% confidence interval for the population mean</span></div>${small('得点は架空。独立な正規標本と仮定し、母分散は未知とする。')}`;
  sample.notes='Read the entire problem: use the five simulated scores to find a 95% confidence interval for Curry’s population mean points per game. The problem specifies 95%. We assume an independent normal sample and unknown population variance.';
  for(const s of [whole,map,tHero])slides.splice(slides.indexOf(s),1);
  const preview={section:map.section,title:'母平均の95%信頼区間の公式',key:'t-ci-formula',theme:'cream',className:'formula-preview',book:'133',html:intervalPreview(),
    notes:'Show the complete interval without annotations. The left expression is the lower limit, and the right expression is the upper limit. Advance to see how the three shared pieces fit into both ends.'};
  slides.splice(slides.indexOf(sample)+1,0,preview,map,whole);
  // Legacy page links to the old t hero now land on the t calculation.
  legacyLecture[legacyLecture.indexOf(tHero)]=tails;
  Object.assign(map,{theme:'cream',className:'formula-preview',init:undefined,key:'t-ci-parts',html:intervalPreview({annotate:true})});
  map.notes='Point to the sample mean as the center. Reveal the standard error next and the t critical value last. The same three pieces appear in both endpoints. No values have been substituted yet.';
  worked(whole.title,[
    ['① 標本平均',math(averageFormula),meanLegend(true,{},['mean'])],
    ['① 5試合の得点を代入',math(averageNumeric)+wNote('次は、各試合の得点とこの30点との差を求める。'),meanLegend(true,centered,['mean'])]
  ],usingLegend);
  whole.title='① 標本平均：Curryの5試合';
  whole.notes='Point to x-bar in both formulas. On reveal, substitute the five scores in the mean calculation, then trace 30 to the two orange slots. The remaining terms are dim but stay in place.';
  worked(variance.title,[
    ['② 標本不偏分散',`<span class="english">Unbiased sample variance</span>${math(varianceFormula)}${wNote('各得点から標本平均30点を引き、その差を二乗する。')}`,meanLegend(true,centered,['variance'])],
    ['5試合の偏差二乗を足す',squareTotal(),meanLegend(true,centered,['variance'])],
    ['標本不偏分散は20点²',math(String.raw`${hat}=\frac{80}{5-1}=20`)+wNote('分子の80点²は、5試合の偏差二乗の合計。'),meanLegend(true,{...centered,variance:20},['variance'])],
    ['標準誤差は2点',`<span class="english">Standard error</span>${math(String.raw`\sqrt{\frac{20}{5}}=2`)}${wNote('標本不偏分散20点²を試合数5で割り、平方根をとる。')}`,meanLegend(true,spreadDone,['spread'])]
  ],usingLegend);
  variance.title='② 標準誤差：Curryの5試合';
  variance.key='curry-variance';
  variance.book='132〜134';
  variance.notes='Start with only the variance numerator in teal. The table shows each score minus 30 and its square. Their sum is 80 points squared. Divide by four to get 20 points squared and fill only the numerator. Then focus the entire radical: divide by five and take the square root to get two points.';
  worked(tails.title,[[
    '③ 指定された95%と t分布',
    `<p class="work-note">問題の指定は95%。片側に残る確率は ${im('(1-0.95)/2=0.025')}。</p><div class="work-chart t-lookup-density">${density('t',4,{annotateTails:true})}</div>${wNote(`母分散が未知なので t分布。自由度は ${im('5-1=4')}。`)}`,
    meanLegend(true,tailReady,['critical'])
  ]],usingLegend);
  tails.title='③ t分布：上側確率と自由度';
  tails.notes='Return to the 95% the question asked for. Five percent is outside the central area, so each tail has 2.5%. The standard error is already two points. Unknown population variance leads to t with four degrees of freedom. Use the 0.025 column next.';
  worked(tLookup.title,[
    ['③ 自由度4、上側確率0.025',lookupBody,meanLegend(true,tailReady,['critical'])],
    ['③ tの境界値は2.7764',wNote('自由度4の行と、上側確率0.025の列が交わるセルの値。'),meanLegend(true,{...spreadDone,se:curry.se,q:curry.critical},['critical'])]
  ],usingLegend);
  tLookup.title='③ tの境界値：表で探す';
  tLookup.notes='Trace the row and column in the upper-tail table. Reveal 2.7764 in the two purple slots. The center and standard-error values stay where they were.';
}
{
  const whole=byTitle('母分散の95%信頼区間'),intro=byTitle('母分散の区間推定');
  slides.splice(slides.indexOf(whole),1);slides.splice(slides.indexOf(intro)+1,0,whole);
  worked(whole.title,[['母分散の95%信頼区間','',chiLegend({},['spread','critical'])]],usingLegend);
  worked('20点²も、推定値。',[
    ['① 分子：同じ偏差二乗和',math(ssRule),chiLegend({},['spread'])],
    ['① 5試合から求めた偏差二乗和',squareTotal(),chiLegend({ss:80},['spread'])],
    ['点推定は標本不偏分散',math(String.raw`${hat}=\frac{80}{5-1}=20`)+wNote('区間の分子は80点²。点推定は20点²。'),chiLegend({ss:80},['spread'])]
  ],usingLegend);
  const chiTails=byTitle('カイ二乗は、左右非対称');
  worked(chiTails.title,[['② χ²分布：2つの境界値',`<div class="work-chart">${density('chi')}</div>${table('chi')}${wNote('自由度4。上側確率0.025と0.975の境界値を読む。')}`,chiLegend({ss:80},['critical'])]],usingLegend);
  Object.assign(byTitle('20点²も、推定値。'),{book:'132・136',notes:'Focus the two identical numerators. Insert the five scores and mean 30. Reuse the sum of 80. The dot is 20, not the midpoint of this asymmetric interval.'});
  byTitle('Zの区間推定の公式').html=intervalPreview({annotate:true,isT:false,startBare:true});
  for(const name of ['標本数で、幅を動かす','通学時間の母平均','答え：38.08〜45.92分'])byTitle(name).book='124〜125・133';
  const conv=byTitle('S²が与えられたら？');
  conv.html=`<h2>標本分散と標本不偏分散</h2>${math(String.raw`S_x^2=\frac{1}{n}\sum (x_i-\bar x)^2\qquad ${hat}=\frac{n}{n-1}S_x^2`)}${rev(math(String.raw`\sum(x_i-\bar x)^2=nS_x^2=5\times16=80`))}${rev(math(String.raw`${hat}=\frac{n}{n-1}S_x^2=\frac{5}{5-1}\times16=20`),2)}`;
  conv.book='134 脚注1';conv.notes='Show both definitions before inserting numbers. With n=5 and divisor-n variance 16, the sum of squared deviations is 5×16 = 80 for chi-square; the unbiased variance for the t interval is 5/(5−1)×16 = 20.';
}
// Use the same live controls and formula layout in the deck and in Explore.
for(const [title,mode,notes] of [
  ['100本の区間を作る','coverage','Start with the visible chart and its first interval. Ask whether exactly 95 out of 100 must cross the fixed line. Draw 100 and compare the observed count with 95%. The true mean is used only to check coverage.'],
  ['確実さを上げると、幅は？','mean-ci','Keep the scores fixed. Ask which interval is widest. Select 90%, 95%, then 99%, and trace what changes: the upper-tail cutoff, the t value, and the wings. The dot stays put.'],
  ['標本数で、幅を動かす','size','Predict before touching the slider. Compare n=25 and n=100. With the center and variance held fixed, quadrupling n halves the margin. Point to the one changing slot.']
]){
  const s=byTitle(title);s.className='lab-slide';s.init=undefined;s.notes=notes;s.book=undefined;
  s.html=`<iframe class="lecture-lab" title="${title}" src="${labUrl(mode)}&embed=1"></iframe>`;
}
byTitle('大きい数で割ると、小さくなる').html+=`<div class="lab-jump">${link(labUrl('variance-ci'),'別の5試合で、母分散の区間を試す')}</div>`;

const story = window.Week9Story || [];
const archivedOpeners = [...story, ...(window.Week9Openers || [])];
const candidates = window.Week9Candidates || [];
const originalOpeningCount = 4;
const params = new URL(location.href).searchParams;
const archiveMode = params.get('openers') === 'archive' || params.has('slide') ||
  params.get('story') === 'jobs' || archivedOpeners.some(s => s.key && s.key === params.get('story')) ||
  !candidates.length;
const openers = archiveMode ? archivedOpeners : candidates;
if (!archiveMode) slides.splice(0,originalOpeningCount);
const openingCount = openers.length;
slides.unshift(...openers);
const destinations = new Map(slides.flatMap((slide, i) => slide.key ? [[slide.key,i]] : []));
if (archiveMode) destinations.set('jobs',openingCount);
const lectureStart = openingCount + (archiveMode ? originalOpeningCount : 0);
destinations.set('lecture',lectureStart);

function locationIndex() {
  const params = new URL(location.href).searchParams;
  if (destinations.has(params.get('story'))) return destinations.get(params.get('story'));
  if (params.has('scene')) return (+params.get('scene') || 1) - 1;
  // Preserve the URLs generated by the previous news-picker version.
  if (params.has('slide')) return story.length + (+params.get('slide') || 1) - 1;
  // Existing exploration links use the original lecture numbering.
  if (params.has('page')) {
    const baseIndex = (+params.get('page') || 1) - 1;
    const target=slides.indexOf(legacyLecture[baseIndex]);
    return target<0 ? lectureStart : target;
  }
  return 0;
}

// Ruby is attached to individual kanji, leaving okurigana untouched.
const readings={'棄却域':[['棄','き'],['却','きゃく'],['域','いき']],'信頼区間':[['信','しん'],['頼','らい'],['区','く'],['間','かん']],'区間推定':[['区','く'],['間','かん'],['推','すい'],['定','てい']],'点推定':[['点','てん'],['推','すい'],['定','てい']],'母分散':[['母','ぼ'],['分','ぶん'],['散','さん']],'母平均':[['母','ぼ'],['平','へい'],['均','きん']],'不偏分散':[['不','ふ'],['偏','へん'],['分','ぶん'],['散','さん']],'標本平均':[['標','ひょう'],['本','ほん'],['平','へい'],['均','きん']],'標準偏差':[['標','ひょう'],['準','じゅん'],['偏','へん'],['差','さ']],'自由度':[['自','じ'],['由','ゆう'],['度','ど']],'下限':[['下','か'],['限','げん']],'上限':[['上','じょう'],['限','げん']],'既知':[['既','き'],['知','ち']],'未知':[['未','み'],['知','ち']]};
function annotate(el){const walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let node;const list=[];while(node=walk.nextNode())if(!node.parentElement.closest('.math,mjx-container,script,style,ruby,svg,button'))list.push(node);const re=new RegExp(Object.keys(readings).sort((a,b)=>b.length-a.length).join('|'),'g');for(const n of list){if(!re.test(n.textContent)){re.lastIndex=0;continue;}re.lastIndex=0;const f=document.createElement('span');f.innerHTML=n.textContent.replace(re,w=>readings[w].map(([k,r])=>`<ruby>${k}<rt>${r}</rt></ruby>`).join(''));n.replaceWith(...f.childNodes);}}
const stage=document.querySelector('#stage');let index=0,step=0,cleanup=()=>{},pendingGuard=false;
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function svg(content){return `<svg viewBox="0 0 1000 300" role="img">${content}</svg>`;}
function intervalGraphic(lo,hi,m,unit,min,max,matchBounds=false,digits=2){
  const x=v=>90+(v-min)/(max-min)*820;
  const endpoints=[lo,hi].map((v,i)=>`<g${matchBounds?` data-side="${i?'upper':'lower'}"`:''}><line x1="${x(v)}" x2="${x(v)}" y1="90" y2="145" stroke="#de7e36" stroke-width="${matchBounds?6:3}"/><text x="${x(v)}" y="215" text-anchor="middle">${v.toFixed(digits)}</text></g>`).join('');
  return svg(`<title>${lo.toFixed(digits)}から${hi.toFixed(digits)}${unit}の区間。点推定${m}。</title><line x1="60" x2="940" y1="175" y2="175" stroke="#8c9da0"/><line x1="${x(lo)}" x2="${x(hi)}" y1="115" y2="115" stroke="#de7e36" stroke-width="12" stroke-linecap="round"/>${endpoints}<circle cx="${x(m)}" cy="115" r="10" fill="#d0642d"/><text x="${x(m)}" y="67" text-anchor="middle" fill="#16786f">点推定 ${m}</text><text x="920" y="265" text-anchor="end">${unit}</text>`);
}
function density(kind,df=4,{annotateTails=false}={}){
  const chi=kind==='chi',a=chi?0:-6,b=chi?18:6,base=245;
  const pdf=chi?x=>M.chiPdf(x,df):x=>M.tPdf(x,df);
  const lo=chi?M.chiq(.975,df):-M.tq(.025,df),hi=chi?M.chiq(.025,df):M.tq(.025,df);
  const x=v=>55+(v-a)/(b-a)*890,y=v=>base-pdf(v)/(chi?.21:.4)*200;
  const trace=(start,end,n)=>Array.from({length:n+1},(_,j)=>{
    const v=start+(end-start)*j/n;
    return `${x(v)},${y(v)}`;
  }).join(' ');
  const area=(start,end,fill,opacity,attrs='')=>`<polygon ${attrs} points="${x(start)},${base} ${trace(start,end,100)} ${x(end)},${base}" fill="${fill}" opacity="${opacity}"/>`;
  const tailColor='#994321';
  const tail=(side,cut)=>{
    // Put the tip in the shaded area, beyond the cutoff and below the curve.
    const direction=side==='left'?-1:1,target=cut+direction*.3;
    const tipX=x(target),tipY=(base+y(target))/2,labelX=tipX+direction*65;
    const shading=side==='left'?area(a,cut,'#d5845e','.78','data-tail-area="left"'):area(cut,b,'#d5845e','.78','data-tail-area="right"');
    return {shading,callout:`<g data-tail-label="${side}" fill="${tailColor}"><path d="M ${labelX} 175 L ${tipX} ${tipY}" fill="none" stroke="${tailColor}" stroke-width="2.8" marker-end="url(#curry-tail-arrow)"/><text x="${labelX}" y="165" text-anchor="middle" font-size="32" font-weight="700">2.5%</text></g>`};
  };
  const tails=annotateTails?[tail('left',lo),tail('right',hi)]:[];
  const markers=annotateTails?`<defs><marker id="curry-tail-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M 0 0 L 10 5 L 0 10 Z" fill="${tailColor}"/></marker></defs>`:'';
  const thresholds=[lo,hi].map(v=>`<line x1="${x(v)}" x2="${x(v)}" y1="${y(v)}" y2="248" stroke="#bd542e" stroke-dasharray="5 5"/>${annotateTails?'':`<text x="${x(v)}" y="285" text-anchor="middle">${v.toFixed(4)}</text>`}`).join('');
  return svg(`<title>${chi?'カイ二乗':'t'}分布、自由度${df}、中央95%${annotateTails?'、左右の裾は各2.5%':''}</title>${markers}${area(lo,hi,'#70b8ad','.65')}${tails.map(t=>t.shading).join('')}<polyline points="${trace(a,b,400)}" fill="none" stroke="#214b56" stroke-width="4"/><line x1="55" x2="945" y1="${base}" y2="${base}" stroke="#70878a"/>${thresholds}${tails.map(t=>t.callout).join('')}${annotateTails?`<text x="500" y="170" text-anchor="middle" fill="#234653" font-size="33" font-weight="700">中央95%</text>`:''}`);
}
const inits={tails:()=>{document.querySelector('#t-tail-chart').innerHTML=density('t');},chiTails:()=>{document.querySelector('#chi-tail-chart').innerHTML=density('chi');},parts:()=>{const desc=['中心：標本平均。今回の5試合では30点。','t値：信頼係数と自由度で決まる。95%・自由度4 → 2.7764。','標準誤差：平均の推定のばらつき。√(20/5) = 2点。'];stage.querySelectorAll('[data-part]').forEach(b=>b.onclick=()=>{stage.querySelectorAll('[data-part]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');document.querySelector('#part-description').textContent=desc[+b.dataset.part];});},curryInterval:()=>{document.querySelector('#curry-interval').innerHTML=intervalGraphic(24.4472,35.5528,30,'点',20,40);},robotAnswer:()=>{document.querySelector('#robot-answer').innerHTML=intervalGraphic(155.388,164.612,160,'cm',152,168);},knownAnswer:()=>{document.querySelector('#known-answer').innerHTML=intervalGraphic(116.08,123.92,120,'分',113,127);},varianceAnswer:()=>{document.querySelector('#variance-interval').innerHTML=intervalGraphic(80/11.1433,80/.4844,20,'点²',0,180);stage.querySelectorAll('[data-denom]').forEach(b=>b.onclick=()=>{document.querySelector(b.dataset.denom==='large'?'#variance-low':'#variance-high').hidden=false;if(!document.querySelector('#variance-low').hidden&&!document.querySelector('#variance-high').hidden)document.querySelector('#variance-interval').classList.remove('concealed');});},deliveryAnswer:()=>{document.querySelector('#delivery-answer').innerHTML=intervalGraphic(30/12.8325,30/.8312,6,'分²',0,40);},confidence:()=>{const range=document.querySelector('#confidence'),draw=()=>{const c=[.9,.95,.99][+range.value],q=M.tq((1-c)/2,4),w=q*2;document.querySelector('#confidence-result').textContent=`${Math.round(c*100)}%：${(30-w).toFixed(2)}〜${(30+w).toFixed(2)}点`;document.querySelector('#confidence-chart').innerHTML=intervalGraphic(30-w,30+w,30,'点',18,42);};range.oninput=draw;draw();},size:()=>{const range=document.querySelector('#size'),draw=()=>{const n=+range.value,w=1.96*10/Math.sqrt(n);document.querySelector('#size-result').textContent=`n = ${n} · 幅 ${(2*w).toFixed(2)}分`;document.querySelector('#size-chart').innerHTML=intervalGraphic(120-w,120+w,120,'分',110,130);};range.oninput=draw;draw();},coverage:()=>{let rows=[],timer=null;const run=document.querySelector('#coverage-run'),reset=document.querySelector('#coverage-reset');const draw=()=>{const min=Math.min(18,...rows.map(r=>r.lower)),max=Math.max(42,...rows.map(r=>r.upper)),x=v=>55+(v-min)/(max-min)*890;document.querySelector('#coverage-chart').innerHTML=`<svg viewBox="0 0 1000 360" role="img" aria-label="繰り返し抽出した100本の信頼区間"><line x1="${x(30)}" x2="${x(30)}" y1="20" y2="335" stroke="#687f84" stroke-dasharray="5 4"/><text x="${x(30)+8}" y="18">μ = 30</text>${rows.map((r,i)=>`<line x1="${x(r.lower)}" x2="${x(r.upper)}" y1="${28+i*3}" y2="${28+i*3}" stroke="${r.lower<=30&&r.upper>=30?'#16786f':'#d67435'}" stroke-width="2"/>`).join('')}<text x="55" y="357">${min.toFixed(1)}</text><text x="945" y="357" text-anchor="end">${max.toFixed(1)} 点</text></svg>`;const hits=rows.filter(r=>r.lower<=30&&r.upper>=30).length;document.querySelector('#coverage-count').textContent=`30を含む ${hits} / ${rows.length}`;};run.onclick=()=>{if(timer)return;rows=[];run.disabled=true;timer=setInterval(()=>{rows.push(M.ci(Array.from({length:5},()=>30+Math.sqrt(20)*M.normal())));draw();if(rows.length===100){clearInterval(timer);timer=null;run.disabled=false;}},38);};reset.onclick=()=>{clearInterval(timer);timer=null;rows=[];run.disabled=false;draw();};draw();return()=>clearInterval(timer);}};
function maxStep(){return Math.max(0,...[...stage.querySelectorAll('[data-step]')].map(x=>+x.dataset.step));}
function updateStep(){stage.querySelectorAll('[data-work]').forEach(e=>e.classList.toggle('work-active',+e.dataset.work===step));stage.querySelectorAll('[data-step]').forEach(e=>e.classList.toggle('shown',+e.dataset.step<=step));document.querySelector('#reveal').hidden=step>=maxStep();document.querySelector('#steps').textContent=maxStep()?`${step} / ${maxStep()}`:'';document.querySelector('#reveal').textContent='表示 ＋';pendingGuard=false;}
function render(){cleanup();cleanup=()=>{};if(window.MathJax?.typesetClear)window.MathJax.typesetClear([stage]);const s=slides[index];stage.className=`${s.theme||'light'} ${s.className||''}`;stage.innerHTML=`<div class="slide-body" tabindex="0" aria-label="スライド内容">${s.html}</div>${s.book?`<span class="book">教科書 p.${s.book}</span>`:''}${s.source?`<span class="source">${s.source}</span>`:''}`;annotate(stage);step=0;updateStep();document.querySelector('#page').value=index+1;document.querySelector('#total').textContent=slides.length;document.querySelector('#first').disabled=document.querySelector('#prev').disabled=index===0;document.querySelector('#last').disabled=index===slides.length-1;document.querySelector('#next').disabled=index===slides.length-1;document.querySelector('#notes').textContent=s.notes;document.querySelector('#status').textContent=`${index+1} / ${slides.length} ${s.title}`;const url=new URL(location.href);if(archiveMode)url.searchParams.set('openers','archive');url.searchParams.delete('page');url.searchParams.delete('story');url.searchParams.delete('slide');url.searchParams.set('scene',index+1);history.replaceState(null,'',url);document.title=`${index+1} · ${s.title} · Week 9`;cleanup=(s.mount ? s.mount(stage) : inits[s.init]?.())||(()=>{});if(window.MathJax?.typesetPromise)window.MathJax.typesetPromise([stage]).catch(()=>{});}
function go(n){index=Math.max(0,Math.min(slides.length-1,n));render();}
function next(){if(step<maxStep()){step++;updateStep();return;}if(slides[index].challenge&&!pendingGuard){pendingGuard=true;const b=document.querySelector('#reveal');b.hidden=false;b.textContent='答えへ進む →';return;}go(archiveMode && ((story.length && index===story.length-1) || (openingCount && index===openingCount-1)) ? destinations.get('lecture') : index+1);}

// A swipe follows the same reveal and challenge rules as the navigation buttons.
function canSwipe(target) {
  if (toc.open || !(target instanceof Element) ||
      target.closest('a,button,input,select,textarea,summary,video,audio,iframe,[contenteditable],[role="slider"]')) return false;
  for (let el=target; el && el!==stage; el=el.parentElement) {
    if (el.scrollWidth>el.clientWidth+2 && /auto|scroll/.test(getComputedStyle(el).overflowX)) return false;
  }
  return true;
}
function swipe(direction) {
  const button=document.querySelector(direction>0 ? '#next' : '#prev');
  if (!button.disabled) button.click();
}
let finger=null;
stage.addEventListener('touchstart',e=>{
  finger=null;
  if (e.touches.length!==1 || !canSwipe(e.target)) return;
  const t=e.touches[0];
  finger={id:t.identifier,x:t.clientX,y:t.clientY,at:e.timeStamp,index,step};
},{passive:true});
stage.addEventListener('touchcancel',()=>{finger=null;},{passive:true});
stage.addEventListener('touchend',e=>{
  const start=finger;finger=null;
  if (!start || e.touches.length || start.index!==index || start.step!==step || e.timeStamp-start.at>850 || toc.open) return;
  const t=Array.from(e.changedTouches).find(t=>t.identifier===start.id);
  if (!t) return;
  const dx=t.clientX-start.x,dy=t.clientY-start.y;
  if (Math.abs(dx)>=48 && Math.abs(dx)>1.55*Math.abs(dy)) swipe(-Math.sign(dx));
},{passive:true});

// Count one horizontal trackpad burst as one step, including its momentum tail.
let wheelAt=-Infinity,wheelTravel=0,wheelDone=false;
stage.addEventListener('wheel',e=>{
  if (e.ctrlKey || e.metaKey || e.shiftKey || !canSwipe(e.target) ||
      Math.abs(e.deltaX)<=1.5*Math.abs(e.deltaY)) return;
  if (e.timeStamp-wheelAt>240) {wheelTravel=0;wheelDone=false;}
  wheelAt=e.timeStamp;
  if (e.cancelable) e.preventDefault();
  if (wheelDone) return;
  const dx=e.deltaX*(e.deltaMode===1 ? 16 : e.deltaMode===2 ? stage.clientWidth : 1);
  wheelTravel=Math.sign(dx)===Math.sign(wheelTravel) ? wheelTravel+dx : dx;
  if (Math.abs(wheelTravel)>=64) {wheelDone=true;swipe(Math.sign(wheelTravel));}
},{passive:false});

stage.addEventListener('click', e => {
  const anchor = e.target.closest('[data-opening-jump]');
  if (!anchor || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const target = destinations.get(anchor.dataset.openingJump);
  if (target === undefined) return;
  e.preventDefault();
  go(target);
});
document.querySelector('#next').onclick=next;document.querySelector('#reveal').onclick=()=>{if(pendingGuard)go(index+1);else{step++;updateStep();}};document.querySelector('#prev').onclick=()=>{if(step){step--;updateStep();}else go(index-1);};document.querySelector('#first').onclick=()=>go(0);document.querySelector('#last').onclick=()=>go(slides.length-1);document.querySelector('#page').onchange=e=>go((+e.target.value||1)-1);document.querySelector('#page').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();go((+e.target.value||1)-1);e.target.blur();}};
const toc=document.querySelector('#toc');const sections=[...new Set(slides.map(s=>s.section))];document.querySelector('#toc-links').innerHTML=sections.map(sec=>`<h3>${esc(sec)}</h3>${slides.map((s,i)=>s.section===sec?`<button data-page="${i}"><span>${i+1}</span>${esc(s.title)}</button>`:'').join('')}`).join('');toc.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>{toc.close();go(+b.dataset.page);});document.querySelector('#contents').onclick=()=>toc.showModal();document.querySelector('#close-toc').onclick=()=>toc.close();toc.onclick=e=>{if(e.target===toc)toc.close();};
function toggleNotes(){const n=document.querySelector('#notes');n.hidden=!n.hidden;document.body.classList.toggle('with-notes',!n.hidden);}document.querySelector('#notes-toggle').onclick=toggleNotes;
async function fullscreen(){if(document.body.classList.contains('presenting')){document.body.classList.remove('presenting');return;}try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{document.body.classList.add('presenting');document.querySelector('#status').textContent='プレゼンテーション表示。Escで戻る。';}}document.querySelector('#fullscreen').onclick=fullscreen;
document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.body.classList.remove('presenting');return;}if(toc.open||e.target.closest('input,select,textarea')||(e.target.closest('button,a,summary')&&[' ','Enter'].includes(e.key)))return;const body=e.target.closest('.slide-body');if(body&&['PageDown','PageUp','Home','End'].includes(e.key)&&body.scrollHeight>body.clientHeight)return;if(['ArrowRight',' ','PageDown'].includes(e.key)){e.preventDefault();next();}else if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();document.querySelector('#prev').click();}else if(e.key==='Home')go(0);else if(e.key==='End')go(slides.length-1);else if(e.key.toLowerCase()==='c')toc.showModal();else if(e.key.toLowerCase()==='n')toggleNotes();else if(e.key.toLowerCase()==='f')fullscreen();});
window.addEventListener('popstate',()=>go(locationIndex()));
go(locationIndex());
if(!window.MathJax?.typesetPromise){const check=setInterval(()=>{if(window.MathJax?.typesetPromise){clearInterval(check);window.MathJax.typesetPromise([stage]).catch(()=>{});}},150);setTimeout(()=>clearInterval(check),20000);}
})();
