const weekFiles = [
  '00-orientation.md', '01-inference.md', '02-binomial.md', '03-poisson.md',
  '04-al-discrete.md', '05-normal.md', '06-t-chi.md', '07-al-continuous.md',
  '08-estimation.md', '09-confidence.md', '10-al-confidence.md', '11-hypothesis.md',
  '12-regression.md', '13-exam-prep.md', '14-final-exam.md'
];

const escapeHtml = value => String(value || '').replace(/[&<>"']/g, character => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
}[character]));
const encodeHref = href => encodeURI(href);
const inlineMathMarkup = (source, fallback = source) => `<span data-inline-math="${escapeHtml(source)}">${escapeHtml(fallback)}</span>`;
const extension = href => (href.split('?')[0].split('.').pop() || 'file').toUpperCase();
const bilingual = (english, japanese) => `<span class="lang-en">${english}</span><span class="lang-ja" lang="ja">${japanese}</span>`;

// Short student-facing descriptions distilled from teaching-agenda.md.
const weekFlow = {
  1: { overview:['How a sample supports an inference, then how events and probability describe uncertainty.','標本から推測する流れを学び、事象と確率で不確かさを考えます。'], steps:[['Course setup and the inference process','授業の準備と推測の流れ'],['Population, sample, and possible bias','母集団・標本・偏り'],['Events, probability, and coin-toss practice','事象・確率・コイン投げ'],['Compare results and ask questions','結果の比較と質問']] },
  2: { overview:['Turn random outcomes into distributions, expected values, and binomial probabilities.','確率変数から分布と期待値を考え、二項分布の確率を求めます。'], steps:[['Random variables and distributions','確率変数と分布'],['Build a probability table','確率表を作る'],['Expected value and binomial practice','期待値と二項分布の演習'],['Check the binomial conditions','二項分布の条件を確認']] },
  3: { overview:['Compare binomial and Poisson models and decide which fits a counting problem.','二項分布とポアソン分布を比べ、数を数える問題に合うモデルを選びます。'], steps:[['Binomial review and Poisson counts','二項分布の復習とポアソン分布'],['Choose a model for each situation','事例ごとにモデルを選ぶ'],['Calculate and interpret probabilities','確率の計算と解釈'],['Explain the choice of model','モデル選択の理由を確認']] },
  4: { overview:['Use binomial and Poisson distributions in applied worksheet problems.','ワークシートの事例で二項分布とポアソン分布を使います。'], steps:[['Choose a model and its parameters','モデルと母数を決める'],['Batting average and gacha cases','打率とガチャの事例'],['Defective items and Poisson counts','不良品とポアソン分布'],['Compare solutions and correct errors','解法を比べて修正']] },
  5: { overview:['Read areas under density curves and use the normal distribution and its table.','確率密度の面積を読み、正規分布と標準正規分布表を使います。'], steps:[['Density and cumulative probability','確率密度と累積確率'],['Sketch and shade probability areas','確率の範囲を図示'],['Standardize and use the normal table','標準化と正規分布表'],['Interpret the result in context','元の単位で結果を解釈']] },
  6: { overview:['Follow sample means into the central limit theorem, then work with t and chi-square distributions.','標本平均と中心極限定理を踏まえ、t分布とカイ二乗分布を学びます。'], steps:[['Samples and the central limit theorem','標本と中心極限定理'],['Compare sample means and variances','標本平均と分散を比較'],['t tables and chi-square examples','t分布表とカイ二乗分布'],['Explain degrees of freedom','自由度の意味を確認']] },
  7: { overview:['Practice unbiased variance and use standard-normal and t tables with confidence.','不偏分散を計算し、標準正規分布表とt分布表を使う練習をします。'], steps:[['Choose a table operation','分布表の使い方を選ぶ'],['Normal-table and variance practice','正規分布表と不偏分散'],['t-table lookup and mixed problems','t分布表と総合問題'],['Check and correct answers','答えを確認・修正']] },
  8: { overview:['Distinguish parameters, estimators, and estimates before making point estimates.','母数・推定量・推定値の違いを押さえ、点推定を行います。'], steps:[['Parameters and estimators','母数と推定量'],['Sort estimates and sampling ideas','推定値と標本の考え方を整理'],['Repeated samples and point estimates','反復標本と点推定'],['Check bias and variance choices','偏りと分散の選び方']] },
  9: { overview:['Build and interpret confidence intervals for a population mean and variance.','母平均と母分散の信頼区間を作り、その意味を説明します。'], steps:[['Confidence and interval capture','信頼水準と区間の考え方'],['Calculate a mean interval','母平均の区間を計算'],['Calculate a variance interval','母分散の区間を計算'],['Interpret intervals in context','区間の意味を説明']] },
  10:{ overview:['Choose the right interval method and explain results in real examples.','事例に合う区間推定の方法を選び、結果を説明します。'], steps:[['Choose Z, t, or chi-square','Z・t・カイ二乗を選ぶ'],['Scores and screw lengths','テスト得点とネジの長さ'],['Battery life and tomato weights','バッテリー寿命とトマト重量'],['Review another group’s interval','別の班の区間を確認']] },
  11:{ overview:['Turn claims into testable hypotheses, then read evidence and p values carefully.','主張を仮説に直し、検定結果とp値を慎重に読みます。'], steps:[['Null and alternative hypotheses','帰無仮説と対立仮説'],['Write hypotheses from claims','主張から仮説を作る'],['Test decisions and p values','検定の判断とp値'],['Write a cautious conclusion','結論を適切に書く']] },
  12:{ overview:['Fit a simple regression, then examine what its coefficients and results can actually tell us.','単回帰分析を行い、係数と結果から言えることを見極めます。'], steps:[['Correlation, causation, and variables','相関・因果・変数'],['Read scatterplots before fitting','散布図を先に読む'],['Run and interpret Excel regression','Excelで回帰分析と解釈'],['Check common interpretation errors','解釈の誤りを確認']] },
  13:{ overview:['Interpret regression results carefully, then review representative exam problems.','回帰分析の結果を正しく解釈し、代表問題で学期全体を復習します。'], steps:[['Interpret regression results','回帰分析の結果を解釈'],['Spot misleading interpretations','誤った解釈を見つける'],['Work representative problems','代表問題を解く'],['Final questions and preparation','最後の質問と準備']] },
  14:{ overview:['Final examination. Check the latest UNIPA notice for scope and permitted materials.','期末試験です。範囲と持ち込みについてはUNIPAの最新案内を確認してください。'], steps:[['Final examination','期末試験']] }
};

function parseWeek(source, file) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`${file}: missing front matter`);
  const meta = {};
  match[1].split('\n').forEach(line => {
    const separator = line.indexOf(':');
    if (separator < 0) return;
    meta[line.slice(0, separator).trim()] = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '');
  });
  const sections = [...match[2].matchAll(/^##\s+(.+)\n([\s\S]*?)(?=^##\s+|$(?![\s\S]))/gm)]
    .map(([, title, body]) => ({ title:title.trim().toLowerCase(), body:body.trim() }));
  const section = name => sections.find(item => item.title === name.toLowerCase())?.body || '';
  return {
    ...meta,
    file,
    week:Number(meta.week),
    prepare:section('Prepare'),
    inClass:section('In class'),
    textbook:parseAgenda(section('Textbook')),
    materials:parseMaterials(section('Materials'))
  };
}

function parseMaterials(body) {
  return body.split('\n').map(line => line.trim()).filter(line => line.startsWith('- ')).flatMap(line => {
    const match = line.match(/^-\s*\[(.+?)\]\((.+)\)(?:\s*\{([^}]+)\})?$/);
    if (!match) return [];
    const item = { label:match[1], href:match[2], type:(match[3] || 'support').toLowerCase() };
    return isStudentAnswer(item) ? [] : [item];
  });
}

function isStudentAnswer(item) {
  return ['answer', 'homework-answer'].includes(item.type) ||
    /解答|answer[ -]?key|_ans(?:wers?)?\b/i.test(`${item.label} ${item.href}`);
}

function parseAgenda(body) {
  return body.split('\n').map(line => line.trim()).filter(line => line.startsWith('- ')).map(line => {
    const content = line.slice(2).trim();
    const match = content.match(/^(.*?)\s+\(([^()]*)\)$/);
    return match ? { ja:match[1], en:match[2] } : { ja:content, en:content };
  });
}

function combineWeekOne(weeks) {
  const orientation = weeks.find(week => week.week === 0);
  const weekOne = weeks.find(week => week.week === 1);
  if (!orientation || !weekOne) return weeks.filter(week => week.week !== 0);
  return weeks.filter(week => week.week !== 0 && week.week !== 1).concat({
    ...weekOne,
    orientationTitleEn:orientation.title_en,
    orientationTitleJa:orientation.title_ja,
    agenda:[...parseAgenda(orientation.inClass), ...parseAgenda(weekOne.inClass)],
    textbook:[...orientation.textbook, ...weekOne.textbook],
    materials:[...orientation.materials, ...weekOne.materials],
    prepare_en:`${orientation.prepare_en} ${weekOne.prepare_en}`,
    prepare:`${orientation.prepare}\n\n${weekOne.prepare}`
  }).sort((first, second) => first.week - second.week);
}

function todayInTokyo() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone:'Asia/Tokyo', year:'numeric', month:'2-digit', day:'2-digit'
  }).formatToParts();
  const value = type => parts.find(part => part.type === type)?.value;
  return `${value('year')}-${value('month')}-${value('day')}`;
}

function compactDate(value, language) {
  const date = new Date(`${value}T12:00:00+09:00`);
  return new Intl.DateTimeFormat(language === 'ja' ? 'ja-JP' : 'en-US', {
    month:'short', day:'numeric', weekday:'short', timeZone:'Asia/Tokyo'
  }).format(date);
}

function dayBefore(value) {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

function fullDate(value, language) {
  const date = new Date(`${value}T12:00:00+09:00`);
  return new Intl.DateTimeFormat(language === 'ja' ? 'ja-JP' : 'en-US', {
    year:'numeric', month:language === 'ja' ? 'long' : 'short', day:'numeric', weekday:'short', timeZone:'Asia/Tokyo'
  }).format(date);
}

function viewerLink(file, title, week, source = '') {
  return `viewer.html?file=${encodeURIComponent(file)}&title=${encodeURIComponent(title)}&week=W${String(week).padStart(2, '0')}&return=${encodeURIComponent(`agenda.html#week-${String(week).padStart(2, '0')}`)}${source ? `&source=${encodeURIComponent(source)}` : ''}`;
}

function isLectureMaterial(item) {
  return ['primary', 'supplementary', 'standard', 'yoh'].includes(item.type);
}

function isActivityMaterial(item) {
  return ['worksheet', 'data', 'notebook'].includes(item.type) ||
    /AL用|ワークシート|practice|data|データ|script|統計表|分布表/i.test(item.label);
}

function lectureDecks(materials, week) {
  const lecture = materials.filter(isLectureMaterial);
  const used = new Set();
  return lecture.flatMap(item => {
    if (used.has(item.href)) return [];
    const ext = extension(item.href);
    const sourceLabel = item.label.replace(/\s*\((PowerPoint|PDF)\)$/i, '');
    const label = /^Tsumura 2026 lecture slides/i.test(sourceLabel)
      ? (week.week === 13 ? '回帰分析とその他の代表的な分析手法 / 回帰分析の結果の解釈（後半）' : week.title_ja)
      : sourceLabel;
    if (ext === 'PPTX') {
      const pdf = lecture.find(candidate => candidate.href === item.href.replace(/\.pptx$/i, '.pdf'));
      used.add(item.href);
      if (pdf) used.add(pdf.href);
      return [{ label, preview:pdf?.href || '', source:item.href, type:item.type }];
    }
    used.add(item.href);
    return [{ label, preview:ext === 'PDF' ? item.href : '', type:item.type }];
  });
}

function slideThumbnail(deck, week) {
  if (deck.preview?.includes('materials/2026-tsumura/')) {
    const number = deck.preview.match(/\/26_(\d{2})_/)?.[1];
    if (number) return `assets/slide-previews/w${number}${number === '12' ? (deck.preview.includes('後半') ? '-b' : '-a') : ''}.png`;
  }
  if (week.week === 1 && deck.label === "Yoh's Week 1 lecture") return 'assets/slide-previews/yoh-w01.png?v=20260930';
  if (week.week === 2 && deck.label === "Yoh's Week 2 lecture") return 'assets/slide-previews/yoh-w02.png?v=20261006-example-flow-1';
  if (week.week === 13 && /final-exam review slides/i.test(deck.label)) return 'assets/slide-previews/yoh-w13.png';
  return '';
}

function fileButton(item, label = bilingual('Download material', '資料をダウンロード')) {
  return `<a class="file-button" href="${encodeHref(item.href)}" download>${label}<span aria-hidden="true">↓</span></a>`;
}

function slideCard(deck, week) {
  const image = slideThumbnail(deck, week);
  const link = deck.preview ? viewerLink(deck.preview, deck.label, week.week, deck.source) : '';
  const preview = link ? `<a class="file-button slide-preview-button" href="${link}">${bilingual('Preview slides', 'スライドをプレビュー')}<span aria-hidden="true">→</span></a>` : '';
  const browsable = link && /\.pdf$/i.test(deck.preview);
  const cover = browsable ? `<div class="slide-browser"><a class="slide-cover" href="${link}" aria-label="${escapeHtml(deck.label)}">${image ? `<img src="${encodeHref(image)}" alt="" loading="lazy">` : `<span data-slide-placeholder>${bilingual('Slide preview','スライドプレビュー')}</span>`}<canvas data-slide-canvas hidden role="img"></canvas></a><div class="slide-browse-controls"><button type="button" data-slide-previous aria-label="${escapeHtml(deck.label)}: 前のスライド / Previous slide" disabled>←</button><span data-slide-status aria-live="polite">1</span><button type="button" data-slide-next aria-label="${escapeHtml(deck.label)}: 次のスライド / Next slide">→</button></div></div>` : '';
  return `<article class="slide-card${cover ? '' : ' slide-card--no-cover'}"${browsable ? ` data-slide-pdf="${escapeHtml(deck.preview)}" data-slide-title="${escapeHtml(deck.label)}"` : ''}>${cover}<div class="slide-card-body"><h4>${escapeHtml(deck.label)}</h4>${preview}</div></article>`;
}

function coinSimulationMarkup() {
  return `<div class="coin-simulation" data-coin-simulation>
    <div class="coin-simulation-intro"><h4>${bilingual('Coin tosses', 'コイン投げ')}</h4><p>${bilingual('Watch the running percentage of heads as each toss is added.', '投げるたびに、表が出た割合がどう変わるか見てみましょう。')}</p></div>
    <div class="coin-controls" aria-label="Coin toss controls">
      <button type="button" data-toss="1">${bilingual('Toss 1', '1回投げる')}</button>
      <button type="button" data-toss="10">${bilingual('Toss 10', '10回投げる')}</button>
      <button type="button" data-toss="100">${bilingual('Toss 100', '100回投げる')}</button>
      <button type="button" data-toss="1000">${bilingual('Toss 1,000', '1000回投げる')}</button>
      <button type="button" class="coin-reset" data-reset>${bilingual('Reset', 'リセット')}</button>
    </div>
    <div class="coin-demo-grid">
      <div class="coin-demo" data-coin-demo data-state="ready" role="group" aria-label="コインを投げてみよう">
        <div class="coin-stage" aria-hidden="true"><div class="coin-disc" data-coin-disc><div class="coin-face coin-face-heads" data-coin-head-face></div><div class="coin-face coin-face-tails" data-coin-tail-face></div></div></div>
        <strong data-coin-result>${bilingual('Ready to toss', '投げてみよう')}</strong><span class="coin-progress" data-coin-progress></span><span data-coin-side-key>${bilingual('Robot = heads · Goat = tails', 'ロボット＝表 · ヤギ＝裏')}</span>
        <div class="coin-recent"><span>${bilingual('Latest 10', '直近10回')}</span><div data-coin-recent aria-hidden="true"></div></div>
      </div>
      <div class="coin-chart-wrap"><svg class="coin-chart" data-coin-chart viewBox="0 0 760 390" role="img" aria-labelledby="coin-chart-title coin-chart-desc"><title id="coin-chart-title">表が出た割合の推移</title><desc id="coin-chart-desc" data-coin-chart-desc>まだ投げていません。基準線は50%です。</desc></svg></div>
    </div>
    <div class="coin-readout"><span data-toss-count>0回</span><strong data-heads-percent>—</strong><span data-heads-count>表: 0</span><span data-tails-count>裏: 0</span></div>
    <p class="sr-only" data-coin-announcement aria-live="polite"></p>
    <p class="coin-caption">${bilingual('The line tends to settle near 50% with many tosses, but it can move away from 50% along the way. Each toss is independent.', '回数が増えると50%付近に落ち着きやすくなりますが、途中で50%から離れることもあります。各回の結果は独立です。')}</p>
  </div>`;
}

function diseaseTestMarkup() {
  return `<div class="test-simulation" data-test-simulation>
    <div class="test-intro"><p class="monty-kicker">${bilingual('[AL] Conditional probability', '[AL] 条件付き確率')}</p><h4>${bilingual('Positive test. Actually ill?', '陽性なら、本当に病気？')}</h4><p>${bilingual('A positive result is not the same as having the disease. Change the numbers to see how the answer shifts.', '陽性という結果から、本当に病気である確率を考えます。数字を変えると答えも変わります。')}</p></div>
    <div class="test-controls" role="group" aria-label="Test assumptions">
      <label>${bilingual('Prevalence', '罹患率')} <span>${bilingual('1 in', '1人 /')} <input type="number" data-test-population min="2" max="100000000" step="1" value="100000" inputmode="numeric"> ${bilingual('people', '人')}</span></label>
      <label>${bilingual('Error rate', '判定を間違える確率')} <span><input type="number" data-test-error min="0" max="50" step="0.1" value="1" inputmode="decimal"> %</span></label>
      <button type="button" data-test-reset>${bilingual('Restore defaults', '元の条件に戻す')}</button>
    </div>
    <p class="test-input-message" data-test-message role="status"></p>
    <p class="test-assumption">${bilingual('Assume that', '病気の人は')} <strong data-test-sensitivity>99%</strong> ${bilingual('of people with the disease test positive, while', 'が陽性、病気でない人は')} <strong data-test-false-rate>1%</strong> ${bilingual('of people without it also test positive by mistake.', 'が誤って陽性になると仮定します。')}</p>
    <div class="test-overview">
      <div class="test-overview-head"><strong data-test-cohort-heading>10万人を検査したら</strong><span>${bilingual('Expected breakdown', '結果の内訳（期待値）')}</span></div>
      <div class="test-bar-figure">
        <div class="test-bar-labels"><div><i class="test-dot-sick" aria-hidden="true"></i><span>${bilingual('Actually ill · positive', '本当に病気・陽性')}<strong data-test-true>0.99人</strong></span></div><div><i class="test-dot-well" aria-hidden="true"></i><span>${bilingual('Not ill · false positive', '病気でない・偽陽性')}<strong data-test-false>999.99人</strong></span></div><div><i class="test-dot-negative" aria-hidden="true"></i><span>${bilingual('Negative result', '陰性')}<strong data-test-negative>98,999.02人</strong></span></div></div>
        <svg class="test-bar-leaders" data-test-leaders aria-hidden="true"></svg>
        <div class="test-overview-bar" data-test-overview-bar role="img" aria-label="Test results breakdown"><span class="test-bar-true" data-test-bar-true></span><span class="test-bar-false" data-test-bar-false></span><span class="test-bar-negative" data-test-bar-negative></span></div>
      </div>
      <p>${bilingual('Gaps separate the three outcomes. The green segment is widened slightly so it stays visible; the labels give the actual expected counts. Negative results include a few missed cases.', '3つの結果を隙間で分けています。緑の部分だけ見えるよう少し拡大しています。正確な期待人数は上の数値を見てください。陰性には少数の見逃しも含みます。')}</p>
    </div>
    <div class="test-positive">
      <div class="test-positive-head"><div><span class="test-path-label">${bilingual('Focus on positive results', '陽性の人だけを見る')}</span><p>${bilingual('Remove the negative results. Only green and brown remain. What share truly has the disease?', '陰性の人を除くと、緑と茶色だけが残ります。本当に病気なのは何％？')}</p></div><button type="button" data-test-reveal aria-expanded="false">${bilingual('Reveal answer →', '答えを見る →')}</button></div>
      <div data-test-answer hidden>
        <div class="test-event-definitions"><span><b>A</b> = ${bilingual('positive test result', '検査で陽性')}</span><span><b>B</b> = ${bilingual('actually has the disease', '本当に病気')}</span></div>
        <div class="test-answer-summary"><strong data-test-percent>—</strong><span>${bilingual('Chance of actually having the disease, given a positive test', '陽性だった人が、本当に病気である確率')}</span></div>
        <p class="test-takeaway" data-test-takeaway></p>
        <div class="test-dot-chart"><div class="test-dot-chart-head"><strong data-test-dots-heading></strong><span data-test-dots-scale></span></div><div class="test-dots" data-test-dots role="img" aria-label="Positive-result dot chart"></div><div class="test-dot-legend"><span><i class="test-dot-sick"></i> ${bilingual('Actually ill', '本当に病気')} <strong data-test-green-count></strong></span><span><i class="test-dot-well"></i> ${bilingual('False positive', '誤って陽性')} <strong data-test-brown-count></strong></span><span><i class="test-dot-negative"></i> ${bilingual('Negative results: not shown here', '陰性者：この図には含まない')}</span></div></div>
        <ol class="test-math"><li><span>${bilingual('Prevalence and complement', '罹患率と余事象')}</span><strong data-test-step-prevalence></strong><small data-test-step-complement></small></li><li><span>${bilingual('Test behavior', '検査の判定')}</span><strong data-test-step-accuracy></strong></li><li><span>${bilingual('Probability of a positive result', '陽性になる確率')}</span><strong data-test-step-positive></strong><small data-test-step-positive-values></small></li><li><span>${bilingual('Probability of disease given a positive result', '陽性だったとき、本当に病気である確率')}</span><strong data-test-step-answer></strong><small data-test-step-joint></small><small data-test-step-answer-values></small></li></ol>
        <p class="test-explanation" data-test-explanation></p>
      </div>
    </div>
    <p class="test-disclaimer">${bilingual('This is a hypothetical test for learning probability, not medical advice.', 'これは確率を学ぶための仮想の検査です。実際の診断には使えません。')}</p>
  </div>`;
}

function eventGridMarkup() {
  return `<div class="event-simulation" data-event-simulation>
    <div class="event-intro"><p class="monty-kicker">${bilingual('Figure 6 · nine equally likely outcomes', '図6・同じ確率の9つの結果')}</p><h4>${bilingual('Which squares count?', 'どのマスを数える？')}</h4></div>
    <div class="event-step-list" role="group" aria-label="Probability topics">
      <button type="button" data-event-step="0" aria-pressed="true">01 ${bilingual('Events', '事象')}</button>
      <button type="button" data-event-step="1" aria-pressed="false">02 ${bilingual('And / or', '積・和')}</button>
      <button type="button" data-event-step="2" aria-pressed="false">03 ${bilingual('Given that', '条件付き')}</button>
      <button type="button" data-event-step="3" aria-pressed="false">04 ${bilingual('Independent?', '独立？')}</button>
    </div>
    <p class="event-step-description" data-event-step-description></p>
    <div class="event-expression-list" data-event-expression-list role="group" aria-label="Choose a probability expression"></div>
    <div class="event-workspace"><div class="event-grid-card"><div class="event-grid-head"><strong>${bilingual('Nine possible outcomes', '9つの結果')}</strong><span data-event-grid-key></span></div><div class="event-grid" data-event-grid role="group" aria-label="Nine outcome grid"></div><p class="event-cell-note" data-event-cell-note aria-live="polite"></p></div>
    <div class="event-figure"><div class="event-grid-head"><strong>${bilingual('Figure 6 · intersections and unions', '図6・3人の積事象と和事象')}</strong><span>${bilingual('Each row shows which letters belong to that event', '各行の枠は、その事象に入る結果')}</span></div><div class="event-membership" data-event-membership aria-label="Figure 6 event diagram"></div></div>
    <div class="event-answer-card"><p class="monty-kicker" data-event-context></p><strong class="event-formula" data-event-formula aria-live="polite"></strong><p class="event-explanation" data-event-explanation></p></div></div>
  </div>`;
}

function montyHallMarkup() {
  return `<div class="monty-game" data-monty-game>
    <div class="monty-intro"><div><p class="monty-kicker">${bilingual('Three doors. One prize.', '3つのドア、1つの当たり')}</p><h4>${bilingual('Monty Hall', 'モンティ・ホール')}</h4></div><p>${bilingual('Find the robot. Pick a door; the host opens a different door hiding a goat. Then decide whether to stay or switch.', 'ロボットを探そう。1つ選ぶと、司会者がヤギのドアを開けます。最後に、そのままにするか変更するかを決めます。')}</p></div>
    <div class="monty-play-grid"><div class="monty-stage">
      <p class="monty-prompt" data-monty-prompt aria-live="polite">好きなドアを1つ選んでください。</p>
      <div class="monty-doors" role="group" aria-label="Three doors">${[1, 2, 3].map(number => `<button type="button" class="monty-door" data-monty-door="${number - 1}" aria-label="ドア${number}を選ぶ"><span class="monty-door-number">0${number}</span><span class="monty-door-face" aria-hidden="true"><span class="monty-door-symbol">?</span><span class="monty-door-handle"></span></span><span class="monty-door-caption" data-monty-caption>ドア ${number}</span></button>`).join('')}</div>
      <div class="monty-feedback-slot"><div class="monty-decision" data-monty-decision hidden><button type="button" data-monty-choice="stay">${bilingual('Stay with the first door', '最初のドアのまま')}</button><button type="button" data-monty-choice="switch">${bilingual('Switch to the other door', 'もう一方へ変更')}</button></div>
      <div class="monty-outcome" data-monty-outcome hidden><span class="monty-outcome-mark" data-monty-mark aria-hidden="true"></span><div><strong data-monty-result-title></strong><p data-monty-result></p></div><button type="button" data-monty-again>${bilingual('Next →', '次へ →')}</button></div></div>
      <div class="monty-batch"><label>${bilingual('Strategy', '作戦')} <select data-monty-strategy><option value="stay">そのまま</option><option value="switch">変更する</option></select></label><label>${bilingual('Number of games', '繰り返す回数')} <input type="number" data-monty-count min="1" max="10000" step="1" value="100" inputmode="numeric"></label><button type="button" data-monty-go>${bilingual('Run →', '実行する →')}</button><button type="button" class="monty-reset" data-monty-reset>${bilingual('Reset', 'リセット')}</button></div>
      <p class="monty-batch-status" data-monty-status aria-live="polite"></p>
    </div>
    <div class="monty-results"><div class="monty-results-head"><div><p class="monty-kicker">${bilingual('Results', '実験結果')}</p><h5>${bilingual('How does the win rate change?', '勝率はどう変わる？')}</h5></div><p><strong data-monty-total>0</strong> ${bilingual('games played', '回プレイ')}</p></div>
      <div class="monty-scoreline"><span>${bilingual('Overall win rate', '全体の勝率')} <strong data-monty-overall>—</strong></span><span><strong data-monty-wins>0</strong> ${bilingual('wins', '勝')}</span><span><strong data-monty-losses>0</strong> ${bilingual('losses', '敗')}</span></div>
      <div class="monty-chart-head"><strong>${bilingual('Cumulative win rate by strategy', '作戦ごとの累積勝率')}</strong><span>${bilingual('X: games played · Y: win rate', '横軸：試した回数　縦軸：当たった割合')}</span></div>
      <div class="monty-line-wrap"><svg class="monty-line-chart" data-monty-line-chart viewBox="0 0 760 225" role="img" aria-labelledby="monty-chart-title monty-chart-desc"><title id="monty-chart-title">作戦ごとの累積勝率</title><desc id="monty-chart-desc" data-monty-chart-desc>まだ結果がありません。</desc></svg></div>
      <div class="monty-chart-legend"><span class="monty-legend-stay">${bilingual('Line: stay', '線：そのまま')} <strong data-monty-stay-summary>—</strong></span><span class="monty-legend-switch">${bilingual('Line: switch', '線：変更する')} <strong data-monty-switch-summary>—</strong></span><span class="monty-legend-win">${bilingual('Dot: win', '点：勝ち')}</span><span class="monty-legend-loss">${bilingual('Dot: loss', '点：負け')}</span></div>
      <p class="monty-theory">${bilingual('Theoretical win rate: stay', '理論上の勝率：そのまま')} <strong>${bilingual('about 33%', '約33%')}</strong> ／ ${bilingual('switch', '変更する')} <strong>${bilingual('about 67%', '約67%')}</strong>${bilingual('. Results vary with only a few games.', '。少ない回数では結果がばらつきます。')}</p>
      <div class="monty-winloss"><div><strong>${bilingual('Wins and losses', '勝ちと負けの内訳')}</strong><span>${bilingual('All games so far', 'これまでの全ゲーム')}</span></div><div class="monty-winloss-track" role="img" aria-label="まだ結果がありません" data-monty-winloss><span class="monty-win-fill" data-monty-win-bar></span><span class="monty-loss-fill" data-monty-loss-bar></span></div><div class="monty-winloss-key"><span>● ${bilingual('Wins', '勝ち')} <strong data-monty-win-count>0</strong></span><span>● ${bilingual('Losses', '負け')} <strong data-monty-loss-count>0</strong></span></div></div>
    </div></div>
  </div>`;
}

function combinationMarkup() {
  return `<section class="combination-simulation" data-combination-simulation aria-label="Robot and goat combinations">
    <div class="combination-intro"><div><p class="section-kicker">${bilingual('COUNT THE LINEUPS', '並び方を数える')}</p><h4>${bilingual('Robots in the lineup', 'ロボットは何通り？')}</h4></div><p>${bilingual('Place the robots in different positions. How many unique lineups can you make?', 'ロボットを別の位置に置いてみよう。重複しない並びは何通り？')}</p></div>
    <div class="combination-equation-card">
      <div class="combination-equation-copy"><p class="section-kicker">${bilingual('THE COMBINATION RULE', '組合せの公式')}</p><div class="combination-equation" data-combination-equation aria-live="polite">\\[{}_{5}C_{2}=\\frac{5!}{2!(5-2)!}=10\\]</div><div class="combination-equation-detail" data-combination-equation-detail>\\[\\frac{5!}{2!(5-2)!}=\\frac{5\\times4\\times3\\times2\\times1}{(2\\times1)(3\\times2\\times1)}=10\\]</div><p class="combination-equation-note" data-combination-equation-note>${bilingual('Choose k positions from n. The order of the robots does not matter.', 'nか所からkか所を選ぶ。ロボットを置く順番は数えません。')}</p></div>
      <div class="combination-equation-controls">
        <label>${bilingual('Positions', '並ぶ位置数')} <span class="math-variable">n</span> <select data-combination-n aria-label="Number of positions"><option value="3">3</option><option value="4">4</option><option value="5" selected>5</option><option value="6">6</option></select></label>
        <label>${bilingual('Robots', 'ロボットの数')} <span class="math-variable">k</span> <select data-combination-k aria-label="Number of robots"></select></label>
      </div>
    </div>
    <div class="combination-controls">
      <label>${bilingual('Your guess', '予想')} <input data-combination-guess type="number" min="1" max="64" inputmode="numeric" placeholder="?" aria-label="Guess the number of lineups"></label>
    </div>
    <div class="combination-builder" data-combination-builder role="group" aria-label="Click positions to place robots"></div>
    <p class="combination-hint" data-combination-hint aria-live="polite"></p>
    <div class="combination-actions"><button type="button" data-combination-save>${bilingual('Add this lineup', 'この並びを追加')}</button><button type="button" data-combination-reveal>${bilingual('Show all lineups', '全部の並びを見る')}</button><button type="button" data-combination-reset>${bilingual('Start over', 'やり直す')}</button></div>
    <div class="combination-results" data-combination-results aria-live="polite"></div>
  </section>`;
}

function battingSimulationMarkup() {
  return `<section class="batting-simulation" data-batting-simulation aria-label="Batting average simulation">
    <div class="batting-intro"><div><p class="section-kicker">${bilingual('THE TEXTBOOK FORMULA, IN ACTION', '教科書の公式を体験')}</p><h4>${bilingual('What is the chance of exactly x hits?', 'ちょうどx本ヒットする確率は？')}</h4></div><p>${bilingual('Set the number of at-bats, the hit rate, and a hit count. The worked example shows exactly how the textbook formula gets its answer.', '打席数・打率・安打数を選ぶと、教科書の公式が答えを出す手順を順番に示します。')}</p></div>
    <div class="batting-formula-card">
      <div class="batting-formula-main"><span class="batting-formula-label">${bilingual('Textbook formula · probability of exactly x hits','教科書の公式 · ちょうどx本になる確率')}</span><div class="batting-equation" data-batting-equation>\\[\\Pr(X=x)={}_nC_x\\,\\pi^x(1-\\pi)^{n-x}\\]</div></div>
      <div class="batting-answer" aria-live="polite"><span>${bilingual('CHANCE OF THIS EXACT RESULT','この結果になる確率')}</span><strong data-batting-formula-result>—</strong><small data-batting-answer-caption></small></div>
      <div class="batting-term-key"><span><i>n</i> ${bilingual('= number of at-bats','= 打席数')}</span><span><i>x</i> ${bilingual('= hits we ask about','= 調べる安打数')}</span><span><i>π</i> ${bilingual('= hit chance each at-bat','= 1打席ごとの打率')}</span></div>
      <div class="batting-controls">
        <label><span>${bilingual('At-bats in a game','1試合の打席数')} <i>n</i></span> <select data-batting-n aria-label="At-bats per game"><option value="3">3</option><option value="5" selected>5</option><option value="9">9</option></select></label>
        <label><span>${bilingual('Hits to calculate','計算する安打数')} <i>x</i></span> <select data-batting-x aria-label="Number of hits"></select></label>
        <label class="batting-rate-control"><span>${bilingual('Hit chance per at-bat','1打席ごとの打率')} <i>π</i></span> <input id="batting-hit-rate" data-batting-p type="range" min="0.05" max="0.80" step="0.01" value="0.32"><output data-batting-p-label for="batting-hit-rate">32%</output></label>
        <button type="button" data-batting-one>${bilingual('Play one game', '1試合をプレイ')}</button>
        <button type="button" class="batting-run-button" data-batting-many>${bilingual('Run 500 games', '500試合を実行')}</button>
        <button type="button" class="batting-reset" data-batting-reset>${bilingual('Reset', 'リセット')}</button>
      </div>
      <div class="batting-calculation-steps"><div><b>1</b><span>${bilingual('How many orders give x hits?','x本の安打になる順番は何通り？')}</span><strong data-batting-patterns></strong></div><div><b>2</b><span>${bilingual('Chance of one order (same for each)','1通りの確率（順番が違っても同じ）')}</span><div data-batting-pattern-example class="batting-pattern-example"></div><strong data-batting-single-pattern></strong></div><div><b>3</b><span>${bilingual('Add all orders: chance of x hits','全ての順番を足す：x本の確率')}</span><strong data-batting-total></strong></div></div>
    </div>
    <div class="batting-conditions"><strong>${bilingual('Why is this binomial?','なぜ二項分布？')}</strong><span>${bilingual('A fixed number of at-bats · two outcomes (hit / out) · independent at-bats · the same hit chance π each time','打席数が決まっている · 結果は2種類（安打／アウト） · 各打席は独立 · 打率πは毎回同じ')}</span></div>
    <p class="batting-assumption">${bilingual('Each at-bat is independent and has the same chance π of a hit.', '各打席は独立で、ヒットの確率πは毎回同じです。')}</p>
    <div class="batting-play-area"><div class="batting-game-card"><div class="batting-result-head"><strong>${bilingual('One game', '1試合')}</strong><span data-batting-single-status aria-live="polite">${bilingual('Ready when you are.', '準備ができたら始めよう。')}</span></div>
      <div class="batting-mascot" data-batting-mascot aria-hidden="true"><svg viewBox="0 0 180 120" role="presentation"><ellipse cx="91" cy="108" rx="45" ry="7" fill="#d9d0c3"/><g class="batting-robot"><path d="M68 65h46l9 37H59z" fill="#4b7c84" stroke="#263d48" stroke-width="4"/><path d="M79 57l-16 22M108 58l21 13" fill="none" stroke="#263d48" stroke-width="7" stroke-linecap="round"/><rect x="58" y="18" width="65" height="45" rx="13" fill="#d8e4df" stroke="#263d48" stroke-width="4"/><path d="M76 12v-8m30 8v-8" stroke="#d29c38" stroke-width="4" stroke-linecap="round"/><circle cx="79" cy="39" r="5" fill="#263d48"/><circle cx="103" cy="39" r="5" fill="#263d48"/><path d="M82 51q9 8 18 0" fill="none" stroke="#d15c4d" stroke-width="3" stroke-linecap="round"/><path d="M60 25l61 0" stroke="#d29c38" stroke-width="7" stroke-linecap="round"/><path d="M61 26l-8 4" stroke="#d15c4d" stroke-width="5" stroke-linecap="round"/></g><g class="batting-bat"><path d="M132 72L161 31" stroke="#865b37" stroke-width="9" stroke-linecap="round"/><path d="M155 36l8-12" stroke="#d0a56f" stroke-width="14" stroke-linecap="round"/></g><circle class="batting-swing-ball" cx="150" cy="88" r="7" fill="#fff" stroke="#b45d48" stroke-width="3"/></svg><span>${bilingual('ROBO-BATTER', 'ロボ打者')}</span></div>
      <div class="batting-atbats" data-batting-atbats aria-label="At-bat results"></div><p class="batting-game-total" data-batting-game-total></p></div>
      <div class="batting-chart-card"><div class="batting-chart-heading"><strong>${bilingual('How often does each hit total happen?','安打数ごとの起こりやすさ')}</strong><span data-batting-batch-status aria-live="polite">${bilingual('Run games to build the chart.', '試合を実行するとグラフが表示されます。')}</span></div><p class="batting-chart-explainer">${bilingual('Each pair compares the games you played with the formula’s predicted chance for that exact hit total.','各安打数について、実際の試合結果と公式が予測する確率を比べます。')}</p><div class="batting-chart-legend"><span class="batting-legend-observed">${bilingual('Your games','実際の試合')}</span><span class="batting-legend-model">${bilingual('Formula prediction','公式の予測')}</span></div><div class="batting-chart" data-batting-chart role="group" aria-label="Observed and predicted frequency by number of hits"></div><p class="batting-model-note" data-batting-model-note></p></div>
    </div>
  </section>`;
}

function week2DiscreteMarkup() {
  return `<section class="week2-probability-lab" data-week2-discrete aria-label="Discrete and continuous probability">
    <header class="week2-lab-heading"><div><p class="section-kicker">${bilingual('TWO WAYS PROBABILITY WORKS','確率の2つの考え方')}</p><h4>${bilingual('Count it—or measure it?','数える？それとも測る？')}</h4></div><p>${bilingual('Move the sliders. Watch the selected values enter the formula, then see that probability in the chart.','スライダーを動かそう。選んだ値を公式に入れると、その確率がグラフに現れます。')}</p></header>
    <div class="week2-compare-grid">
      <article class="week2-compare-card week2-discrete-card">
        <div class="week2-card-top"><span class="week2-type-chip">${bilingual('DISCRETE · COUNT','離散 · 個数')}</span><span class="week2-card-icon" aria-hidden="true">🪙</span></div>
        <h5>${bilingual('Heads in 5 tosses','コイン5回の表')}</h5>
        <p>${bilingual('Fair coin · 5 independent tosses · each toss has a 50% chance of heads.','公平なコインを独立に5回投げます。1回ごとの表の確率は50％。')}</p>
        <div class="week2-slider-control">
          <label for="w2-heads-slider">${bilingual('Heads to calculate','計算する表の回数')} <i>k</i></label><output for="w2-heads-slider" data-w2-discrete-value>2</output>
          <input id="w2-heads-slider" type="range" min="0" max="5" step="1" value="2" data-w2-discrete-k>
          <div class="week2-slider-ticks" aria-hidden="true"><span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span></div>
        </div>
        <div class="week2-equation-card">
          <span class="week2-equation-label">${bilingual('REMEMBER THIS FORMULA','覚えておきたい公式')}</span>
          <div class="week2-memory-formula" data-w2-discrete-rule>Pr(X = k) = ₙCₖ · pᵏ · (1 − p)ⁿ⁻ᵏ</div>
          <p class="week2-formula-key">n = 5　p = 0.5　<span data-w2-discrete-key>k = 2</span></p>
          <div class="week2-worked-formula" data-w2-discrete-formula></div>
          <div class="week2-equation-result"><span data-w2-discrete-caption>${bilingual('CHANCE OF EXACTLY 2 HEADS','ちょうど2回が表になる確率')}</span><strong data-w2-discrete-answer>31.25%</strong></div>
        </div>
        <p class="week2-chart-link">↓ ${bilingual('The formula gives the highlighted bar.','公式の答えが、色のついた棒になります。')}</p>
        <div class="week2-discrete-bars" data-w2-discrete-bars role="group" aria-label="Probability for each number of heads"></div>
      </article>
      <article class="week2-compare-card week2-continuous-card">
        <div class="week2-card-top"><span class="week2-type-chip">${bilingual('CONTINUOUS · MEASURE','連続 · 測定')}</span><span class="week2-card-icon" aria-hidden="true">🤖</span></div>
        <h5>${bilingual('Robot height','ロボの身長')}</h5>
        <p>${bilingual('A normal model: mean μ = 170 cm, standard deviation σ = 6 cm.','正規分布の例：平均 μ = 170cm、標準偏差 σ = 6cm。')}</p>
        <div class="week2-slider-control">
          <label for="w2-height-slider">${bilingual('Range around the mean','平均からの範囲')}</label><output for="w2-height-slider" data-w2-continuous-value>±1σ</output>
          <input id="w2-height-slider" type="range" min="0" max="3" step="0.1" value="1" data-w2-continuous-band>
          <div class="week2-slider-ticks" aria-hidden="true"><span>0σ</span><span>1σ</span><span>2σ</span><span>3σ</span></div>
        </div>
        <div class="week2-equation-card">
          <span class="week2-equation-label">${bilingual('REMEMBER THIS FORMULA','覚えておきたい公式')}</span>
          <div class="week2-memory-formula" data-w2-continuous-rule>Pr(a ≤ X ≤ b) = ∫ₐᵇ f(x) dx</div>
          <p class="week2-formula-key" data-w2-continuous-key>170 ± 1 × 6 → 164〜176cm</p>
          <p class="week2-z-key">Z = (X − 170) / 6</p>
          <div class="week2-worked-formula" data-w2-continuous-formula></div>
          <div class="week2-equation-result"><span data-w2-continuous-caption>${bilingual('CHANCE FROM 164 TO 176 CM','164〜176cmの確率')}</span><strong data-w2-continuous-answer>68.27%</strong></div>
        </div>
        <p class="week2-chart-link">↓ ${bilingual('The formula gives the shaded area.','公式の答えが、色のついた面積になります。')}</p>
        <div class="week2-density-chart"><svg data-w2-density viewBox="0 0 440 185" role="img" aria-label="Normal density curve with highlighted interval"></svg></div>
        <p class="week2-point-note">${bilingual('One exact point: Pr(X = 170) = 0. A range has area—and probability.','1点だけなら Pr(X = 170) = 0。範囲に面積があり、その面積が確率です。')}</p>
      </article>
    </div>
    <p class="week2-aha"><strong>💡 ${bilingual('The key difference','ここがポイント')}</strong> ${bilingual('Discrete: a probability for each count. Continuous: add the density across a range to find its probability.','離散：個数ごとに確率がある。連続：範囲の中の密度を足し合わせた面積が確率になる。')}</p>
  </section>`;
}

function week2ProbabilityMarkup() {
  return `<section class="week2-probability-lab" data-week2-families aria-label="Bernoulli, binomial, and Poisson models">
    <header class="week2-lab-heading"><div><p class="section-kicker">${bilingual('PICK THE RIGHT MODEL','場面に合うモデルを選ぼう')}</p><h4>${bilingual('Three ways to count outcomes','結果を数える3つの分布')}</h4></div><p>${bilingual('Choose a story, change its parameters, then simulate 1,000 rounds. The bars show what the formula predicts—and what actually happened.','場面を選び、条件を変えて1,000回試そう。公式の予測と実際の結果を棒グラフで比べます。')}</p></header>
    <div class="week2-model-tabs" role="tablist" aria-label="Choose a probability model"><button type="button" role="tab" id="w2-binomial-tab" aria-controls="w2-binomial" aria-selected="true" tabindex="0">${bilingual('Binomial','二項分布')}</button><button type="button" role="tab" id="w2-bernoulli-tab" aria-controls="w2-bernoulli" aria-selected="false" tabindex="-1">${bilingual('Bernoulli','ベルヌーイ')}</button><button type="button" role="tab" id="w2-poisson-tab" aria-controls="w2-poisson" aria-selected="false" tabindex="-1">${bilingual('Poisson','ポアソン')}</button></div>
    <div class="week2-model-panel" data-w2-model="bernoulli" id="w2-bernoulli" role="tabpanel" aria-labelledby="w2-bernoulli-tab" hidden><div class="week2-model-story"><span aria-hidden="true">🤖</span><p><strong>${bilingual('One toss · success or not','コイン1回 · 表か裏')}</strong><br>${bilingual('One trial, two outcomes. This is the simplest probability model.','試行は1回、結果は2種類。いちばん基本の確率モデルです。')}</p></div><div class="week2-model-formula"><span>${bilingual('THE RULE','公式')}</span><div>P(X = 1) = p　·　P(X = 0) = 1 − p</div><small>${bilingual('Bernoulli is a Binomial model with n = 1.','ベルヌーイ分布は二項分布で n=1 とした場合です。')}</small></div></div>
    <div class="week2-model-panel" data-w2-model="binomial" id="w2-binomial" role="tabpanel" aria-labelledby="w2-binomial-tab"><div class="week2-model-story"><span aria-hidden="true">⚾</span><p><strong>${bilingual('Fixed number of at-bats · count the hits','打席数は固定 · ヒット数を数える')}</strong><br>${bilingual('Same hit chance each time; independent trials; count successes in n tries.','毎回の打率は同じ、各打席は独立。n回の試行で成功数を数えます。')}</p></div><div class="week2-model-formula"><span>${bilingual('THE RULE','公式')}</span><div>P(X = k) = C(n, k) · p<sup>k</sup> · (1 − p)<sup>n−k</sup></div><small>${bilingual('The batting simulator is this model: hits in a fixed number of at-bats.','打率シミュレーターもこの分布です。決めた打席数の中の安打数を扱います。')}</small></div></div>
    <div class="week2-model-panel" data-w2-model="poisson" id="w2-poisson" role="tabpanel" aria-labelledby="w2-poisson-tab" hidden><div class="week2-model-story"><span aria-hidden="true">🐐</span><p><strong>${bilingual('Events in a fixed time or space','決まった時間・場所で起きる回数')}</strong><br>${bilingual('Count events when they occur at an average rate λ.','平均発生率λの出来事が何回起きるかを数えます。')}</p></div><div class="week2-model-formula"><span>${bilingual('THE RULE','公式')}</span><div>P(X = k) = e<sup>−λ</sup> · λ<sup>k</sup> / k!</div><small>${bilingual('Example: goats passing a gate in one minute, on average λ = 2.','例：1分間にゲートを通るヤギの数（平均λ=2）。')}</small></div></div>
    <div class="week2-family-controls" data-w2-family-controls></div><div class="week2-family-actions"><button type="button" class="week2-run-button" data-w2-family-run>${bilingual('Run 1,000 trials','1,000回シミュレーション')}</button><button type="button" data-w2-family-reset>${bilingual('Reset','リセット')}</button><span data-w2-family-status aria-live="polite">${bilingual('Ready to explore.','準備ができました。')}</span></div>
    <div class="week2-family-chart-card"><div class="week2-family-chart-head"><strong>${bilingual('Predicted vs observed','理論値と実測値')}</strong><div><i class="week2-observed-key"></i>${bilingual('Observed','実測')} <i class="week2-predicted-key"></i>${bilingual('Formula','公式')}</div></div><div class="week2-family-chart" data-w2-family-chart role="img" aria-label="Observed and predicted probabilities"></div></div>
    <p class="week2-aha" data-w2-family-aha></p>
  </section>`;
}

function alExpectationMarkup(type) {
  const discrete = type === 'discrete';
  return `<section class="al-expectation-lab" data-al-expectation="${type}" aria-label="${discrete ? 'Discrete expected value' : 'Continuous expected value'}">
    <header class="week2-lab-heading"><div><p class="section-kicker">${bilingual('AL WORKSHEET · EXPECTED VALUE','ALワークシート · 期待値')}</p><h4>${discrete ? bilingual('What is a weighted average?','確率で重みをつけると？') : bilingual('Area is probability. Weighted area is expectation.','確率の面積と、期待値の面積')}</h4></div><p>${discrete ? bilingual('Use the worksheet’s six outcomes. Multiply each value by its probability, then add the contributions.','ワークシートの6つの値を使います。値×確率を1行ずつ計算し、最後に足し合わせよう。') : bilingual(`The worksheet gives ${inlineMathMarkup('f(x)=x')} on ${inlineMathMarkup(String.raw`0\le x\le\sqrt2`,'0 ≤ x ≤ √2')}. Compare ${inlineMathMarkup('f(x)')} with ${inlineMathMarkup('xf(x)')}: they answer different questions.`,`ワークシートの条件は ${inlineMathMarkup('f(x)=x')}、${inlineMathMarkup(String.raw`0\le x\le\sqrt2`,'0≤x≤√2')}。${inlineMathMarkup('f(x)')} と ${inlineMathMarkup('xf(x)')} は、何を計算している？`)}</p></header>
    <p class="al-source-note">${discrete ? bilingual('Worksheet: “離散変数の場合の期待値の計算” · B5:C10 → D5:D10 → total','対応：シート「離散変数の場合の期待値の計算」· B5:C10 → D5:D10 → 合計') : bilingual('Worksheet: “連続変数の場合の期待値の計算” · the two integrals','対応：シート「連続変数の場合の期待値の計算」· 2つの積分')}</p>
    ${discrete ? `<div class="al-discrete-layout"><div class="al-table-wrap"><table class="al-weight-table"><thead><tr><th>${inlineMathMarkup('x')}</th><th>${inlineMathMarkup(String.raw`\Pr(X=x)`,'Pr(X=x)')}</th><th>${inlineMathMarkup(String.raw`x\Pr(X=x)`,'x Pr(X=x)')}</th></tr></thead><tbody data-al-rows></tbody><tfoot><tr><th>${bilingual('Total','合計')}</th><td>1</td><td data-al-sum>?</td></tr></tfoot></table><p class="al-help">${bilingual('Select a row. Blue cells are the calculations you complete in Excel. Row D7 already contains an example.','行を選ぼう。水色はExcelで計算する欄。D7には計算例が入っています。')}</p></div><div class="al-visual-card"><h5>${bilingual('Imagine 12 equally likely tickets','同じ確率の12枚のくじで考える')}</h5><div class="al-ticket-grid" data-al-tickets></div><p data-al-row-story></p><div class="al-contribution-chart" data-al-contributions></div><p class="al-help">${bilingual('Bars show x × probability. A negative outcome makes a negative contribution.','棒は「値×確率」。負の値は、期待値を下げる方向に働きます。')}</p></div></div>
      <div class="al-formula-focus"><span class="section-kicker">${bilingual('MULTIPLY EACH ROW, THEN ADD','各行を掛けて、最後に足す')}</span><div data-al-rule></div><div class="al-worked-math" data-al-worked></div><p>${bilingual('In Excel: enter =B5*C5 in D5 and copy down. Add the six products with =SUM(D5:D10).','ExcelではD5に =B5*C5 を入力して下へコピー。6行の合計は =SUM(D5:D10)。')}</p></div>
      <div class="al-actions"><button type="button" data-al-reveal-row>${bilingual('Calculate this row','この行を計算')}</button><button type="button" data-al-add>${bilingual('Add the six contributions','6行の合計を確かめる')}</button><button type="button" data-al-sample>${bilingual('Draw 120 tickets','120回くじを引く')}</button><button type="button" data-al-reset>${bilingual('Reset','リセット')}</button></div>
      <div class="al-sample-strip" aria-live="polite"><span class="al-drawn-ticket" data-al-last>🤖</span><p data-al-sample-status></p></div>` : `<div class="al-continuous-controls"><label for="al-slices">${bilingual('Number of narrow rectangles','細い長方形の数')} <output data-al-slices-value>12</output><input id="al-slices" data-al-slices type="range" min="4" max="80" step="4" value="12"></label><p>${bilingual('Click a rectangle. Then increase the number of slices to see the sums approach the integrals.','長方形をクリック。分割数を増やすと、足し算が積分の値に近づきます。')}</p></div>
      <div class="al-area-grid"><article class="al-area-card"><p class="section-kicker">${bilingual('1 · TOTAL PROBABILITY','1 · 確率の合計')}</p><h5>${inlineMathMarkup('f(x)=x')}</h5><svg data-al-density viewBox="0 0 460 245" role="img" aria-label="Probability density and midpoint rectangles"></svg><div data-al-density-rule></div><p class="al-area-result" data-al-density-sum></p></article><article class="al-area-card is-weighted"><p class="section-kicker">${bilingual('2 · EXPECTED VALUE','2 · 期待値')}</p><h5>${inlineMathMarkup('xf(x)=x^2','x f(x) = x²')}</h5><svg data-al-weighted viewBox="0 0 460 245" role="img" aria-label="Value-weighted density and midpoint rectangles"></svg><div data-al-weighted-rule></div><p class="al-area-result" data-al-weighted-sum></p></article></div>
      <div class="al-formula-focus"><span class="section-kicker">${bilingual('ONE SLICE: WEIGHT ITS PROBABILITY BY ITS VALUE','1つの区間：確率に、その値を掛ける')}</span><div class="al-worked-math" data-al-slice-math></div><p data-al-slice-story></p></div>
      <div class="al-actions"><button type="button" data-al-integrals>${bilingual('Reveal the exact integrals','積分の計算を確かめる')}</button><button type="button" data-al-reset>${bilingual('Reset','リセット')}</button></div><div class="al-exact-grid" data-al-exact hidden><div data-al-density-exact></div><div data-al-weighted-exact></div></div>`}
    <p class="week2-aha" data-al-aha></p>
  </section>`;
}

function distributionSimulationMarkup(type) {
  const configs = {
    normal: {
      title:['Normal distribution: the bell curve','正規分布：ベル型の曲線'],
      description:['Generate values from a normal population. Change its center and spread, then see how often values land within one, two, or three standard deviations.','正規分布から値を生成し、中心と広がりを変えます。平均から標準偏差1・2・3個分の範囲に、どれくらい入るかを見てみましょう。'],
      formula:'\\[X\\sim N(\\mu,\\sigma^2),\\qquad Z=\\frac{X-\\mu}{\\sigma}\\]',
      sample:['observations','個のデータ']
    },
    t: {
      title:['t distribution: small samples, wider tails','t分布：小標本では裾が広い'],
      description:['Robo samples from a normal population and recalculates a t statistic each time. With few observations, the estimate of spread is uncertain—so extreme t values are less surprising.','ロボが正規母集団から標本を取り、毎回t値を計算します。標本が少ないとばらつきの推定が不安定になり、極端なt値も起こりやすくなります。'],
      formula:'\\[t=\\frac{\\bar X-\\mu}{s/\\sqrt n},\\qquad \\mathrm{df}=n-1\\]',
      sample:['t statistics','個のt値']
    },
    chi: {
      title:['Chi-square: how surprising is this spread?','カイ二乗分布：このばらつきはどれくらい？'],
      description:['Robo repeatedly takes samples from a normal population and measures their spread. The statistic is never negative and often has a long right tail.','ロボが正規母集団から標本を繰り返し取り、ばらつきを測ります。統計量は負にならず、右側に長い裾を持つことが多い分布です。'],
      formula:'\\[\\chi^2=\\frac{(n-1)s^2}{\\sigma^2}=\\sum_{i=1}^{n}\\frac{(X_i-\\bar X)^2}{\\sigma^2},\\qquad \\mathrm{df}=n-1\\]',
      sample:['chi-square values','個のカイ二乗値']
    }
  };
  const config = configs[type];
  const parameterControls = type === 'normal' ? `<label><span>${bilingual('Mean','平均')} <i>μ</i></span><input type="range" min="40" max="80" value="60" step="1" data-dist-mean><output data-dist-mean-value>60</output></label><label><span>${bilingual('Standard deviation','標準偏差')} <i>σ</i></span><input type="range" min="5" max="20" value="10" step="1" data-dist-sd><output data-dist-sd-value>10</output></label><label><span>${bilingual('Highlight','範囲を強調')}</span><select data-dist-band><option value="1">±1σ</option><option value="2" selected>±2σ</option><option value="3">±3σ</option></select></label>` : `<label><span>${bilingual('Sample size','標本サイズ')} <i>n</i></span><select data-dist-n><option value="3">3</option><option value="5" selected>5</option><option value="10">10</option><option value="30">30</option></select></label><span class="distribution-df" data-dist-df></span>`;
  const aha = type === 'normal'
    ? ['About 68%, 95%, and 99.7% fall within 1σ, 2σ, and 3σ. Try it: does your sample follow the rule?','約68％・95％・99.7％が平均±標準偏差1・2・3個分に入ります。標本でも確かめてみましょう。']
    : type === 't'
      ? ['Aha: lower df means heavier tails. Increase n and the t curve approaches the standard normal curve.','発見：自由度が小さいほど裾が厚くなります。nを増やすとt分布は標準正規分布に近づきます。']
      : ['Aha: chi-square records squared deviations. More degrees of freedom make the curve less lopsided.','発見：カイ二乗は偏差を二乗して足し合わせます。自由度が増えると、分布の左右の偏りは小さくなります。'];
  return `<section class="distribution-simulation" data-distribution-simulation data-distribution-type="${type}" aria-label="${config.title[0]}">
    <header class="distribution-heading"><div><p class="section-kicker">${bilingual('DISTRIBUTION LAB','分布ラボ')}</p><h4>${bilingual(...config.title)}</h4></div><p>${bilingual(...config.description)}</p></header>
    <div class="distribution-formula"><span>${bilingual('THE MODEL','モデル')}</span><div data-display-math="${escapeHtml(config.formula.slice(2, -2))}">${type === 'normal' ? 'X ∼ N(μ, σ²), Z = (X − μ) / σ' : type === 't' ? 't = (X̄ − μ) / (s / √n), df = n − 1' : 'χ² = (n − 1)s² / σ² = Σ (Xᵢ − X̄)² / σ², df = n − 1'}</div></div>
    <div class="distribution-controls">${parameterControls}<button type="button" class="distribution-run" data-dist-run>${bilingual('Run 1,000 trials','1,000回試す')}</button><button type="button" data-dist-clear>${bilingual('Clear','消去')}</button></div>
    <div class="distribution-chart-wrap"><svg data-dist-chart viewBox="0 0 760 330" role="img" aria-label="Simulated distribution chart"></svg><div class="distribution-legend"><span class="distribution-legend-sample">${bilingual('Simulated','シミュレーション')}</span><span class="distribution-legend-theory">${type === 't' ? bilingual('t model','t分布') : type === 'chi' ? bilingual('Chi-square model','カイ二乗分布') : bilingual('Normal model','正規分布')}</span>${type === 't' ? `<span class="distribution-legend-normal">${bilingual('Standard normal','標準正規')}</span>` : ''}</div></div>
    <div class="distribution-foot"><p data-dist-status aria-live="polite">${bilingual('Ready to sample.','試行できます。')}</p><p class="distribution-aha"><strong>💡 ${bilingual('Aha','気づき')}</strong> <span data-dist-aha>${bilingual(...aha)}</span></p></div>
    <div class="distribution-robot" data-dist-robot aria-hidden="true"><span>🤖</span><span>${bilingual('Robo is ready to collect data.','ロボ、データ収集中。')}</span></div>
  </section>`;
}

function lectureSection(week) {
  const decks = lectureDecks(week.materials, week);
  const plan = weekFlow[week.week];
  const primary = decks.filter(deck => deck.type === 'primary');
  const other = decks.filter(deck => deck.type !== 'primary');
  const orientation = week.week === 1 ? primary.filter(deck => deck.preview.includes('26_00_')) : [];
  const visible = week.week === 1 ? primary.filter(deck => !orientation.includes(deck)) : !primary.length ? decks : primary;
  const more = week.week === 1 ? [...other, ...orientation] : !primary.length ? [] : other;
  const slideList = visible.map(deck => slideCard(deck, week)).join('');
  const extra = more.length ? `<div class="more-slides"><p class="more-slides-heading">${bilingual('Supplementary slides', '補助スライド')}</p><div class="more-slides-list">${more.map(deck => slideCard(deck, week)).join('')}</div></div>` : '';
  const description = plan ? bilingual(escapeHtml(plan.overview[0]), escapeHtml(plan.overview[1])) : bilingual(escapeHtml(week.title_en), escapeHtml(week.title_ja));
  const textbook = week.textbook.length ? `<div class="lecture-textbook"><p class="lecture-textbook-label">${bilingual('TEXTBOOK', '教科書')}</p><ul>${week.textbook.map(item => `<li>${bilingual(escapeHtml(item.en), escapeHtml(item.ja))}</li>`).join('')}</ul></div>` : '';
  const heading = week.week === 14 ? bilingual('Final examination', '期末試験') : bilingual('This week’s lecture', '今週の講義');
  const content = `<div class="lecture-layout${decks.length ? '' : ' lecture-layout--no-slides'}"><div class="lecture-copy"><p class="lecture-summary">${description}</p>${textbook}</div>${decks.length ? `<div class="lecture-slides">${slideList}${extra}</div>` : ''}</div>`;
  const lectureBody = week.week === 5 ? `<div class="lecture-tablist" role="tablist" aria-label="Week 5 lecture">
      <button type="button" role="tab" id="week-5-lecture-slides-tab" aria-controls="week-5-lecture-slides" aria-selected="true" tabindex="0">${bilingual('Lecture','講義')}</button>
      <button type="button" role="tab" id="week-5-lecture-explore-tab" aria-controls="week-5-lecture-explore" aria-selected="false" tabindex="-1">${bilingual('Explore','やってみる')}</button>
    </div><div id="week-5-lecture-slides" role="tabpanel" aria-labelledby="week-5-lecture-slides-tab">${content}</div><div id="week-5-lecture-explore" role="tabpanel" aria-labelledby="week-5-lecture-explore-tab" hidden>${distributionSimulationMarkup('normal')}</div>`
    : week.week === 6 ? `<div class="lecture-tablist" role="tablist" aria-label="Week 6 lecture">
      <button type="button" role="tab" id="week-6-lecture-slides-tab" aria-controls="week-6-lecture-slides" aria-selected="true" tabindex="0">${bilingual('Lecture','講義')}</button>
      <button type="button" role="tab" id="week-6-lecture-explore-tab" aria-controls="week-6-lecture-explore" aria-selected="false" tabindex="-1">${bilingual('Explore','やってみる')}</button>
    </div><div id="week-6-lecture-slides" role="tabpanel" aria-labelledby="week-6-lecture-slides-tab">${content}</div><div id="week-6-lecture-explore" role="tabpanel" aria-labelledby="week-6-lecture-explore-tab" hidden>
      <div class="simulation-tablist" role="tablist" aria-label="Choose a distribution">
        <button type="button" role="tab" id="week-6-t-tab" aria-controls="week-6-t" aria-selected="true" tabindex="0">01 <span>${bilingual('t distribution','t分布')}</span></button>
        <button type="button" role="tab" id="week-6-chi-tab" aria-controls="week-6-chi" aria-selected="false" tabindex="-1">02 <span>${bilingual('Chi-square','カイ二乗分布')}</span></button>
      </div>
      <div id="week-6-t" role="tabpanel" aria-labelledby="week-6-t-tab">${distributionSimulationMarkup('t')}</div>
      <div id="week-6-chi" role="tabpanel" aria-labelledby="week-6-chi-tab" hidden>${distributionSimulationMarkup('chi')}</div>
    </div>` : week.week === 2 ? `<div class="lecture-tablist" role="tablist" aria-label="Week 2 lecture">
      <button type="button" role="tab" id="week-2-lecture-slides-tab" aria-controls="week-2-lecture-slides" aria-selected="true" tabindex="0">${bilingual('Lecture', '講義')}</button>
      <button type="button" role="tab" id="week-2-lecture-explore-tab" aria-controls="week-2-lecture-explore" aria-selected="false" tabindex="-1">${bilingual('Explore', 'やってみる')}</button>
      <button type="button" role="tab" id="week-2-lecture-al-tab" aria-controls="week-2-lecture-al" aria-selected="false" tabindex="-1">AL</button>
    </div>
    <div id="week-2-lecture-slides" role="tabpanel" aria-labelledby="week-2-lecture-slides-tab">${content}</div>
    <div id="week-2-lecture-explore" role="tabpanel" aria-labelledby="week-2-lecture-explore-tab" hidden>
      <div class="simulation-tablist" role="tablist" aria-label="Choose a Week 2 activity">
        <button type="button" role="tab" id="week-2-examples-tab" aria-controls="week-2-examples" aria-selected="true" tabindex="0">01 <span>${bilingual('Lottery & dice', 'くじ・サイコロ')}</span></button>
        <button type="button" role="tab" id="week-2-roulette-tab" aria-controls="week-2-roulette" aria-selected="false" tabindex="-1">02 <span>${bilingual('Roulette', 'ルーレット')}</span></button>
        <button type="button" role="tab" id="week-2-discrete-tab" aria-controls="week-2-discrete" aria-selected="false" tabindex="-1">03 <span>${bilingual('Discrete vs continuous', '離散と連続')}</span></button>
        <button type="button" role="tab" id="week-2-probability-tab" aria-controls="week-2-probability" aria-selected="false" tabindex="-1">04 <span>${bilingual('Probability models', '確率分布')}</span></button>
        <button type="button" role="tab" id="week-2-combinations-tab" aria-controls="week-2-combinations" aria-selected="false" tabindex="-1">05 <span>${bilingual('Lineup combinations', 'ロボットの並び')}</span></button>
        <button type="button" role="tab" id="week-2-batting-tab" aria-controls="week-2-batting" aria-selected="false" tabindex="-1">06 <span>${bilingual('Batting average', '打率')}</span></button>
        <button type="button" role="tab" id="week-2-curves-tab" aria-controls="week-2-curves" aria-selected="false" tabindex="-1">07 <span>${bilingual('Normal, t & chi-square','正規・t・カイ二乗')}</span></button>
      </div>
      <div id="week-2-examples" role="tabpanel" aria-labelledby="week-2-examples-tab"><section class="example-lab" data-example-lab></section></div>
      <div id="week-2-roulette" role="tabpanel" aria-labelledby="week-2-roulette-tab" hidden><div data-roulette></div></div>
      <div id="week-2-discrete" role="tabpanel" aria-labelledby="week-2-discrete-tab" hidden>${week2DiscreteMarkup()}</div>
      <div id="week-2-combinations" role="tabpanel" aria-labelledby="week-2-combinations-tab" hidden>${combinationMarkup()}</div>
      <div id="week-2-batting" role="tabpanel" aria-labelledby="week-2-batting-tab" hidden>${battingSimulationMarkup()}</div>
      <div id="week-2-probability" role="tabpanel" aria-labelledby="week-2-probability-tab" hidden>${week2ProbabilityMarkup()}</div>
      <div id="week-2-curves" role="tabpanel" aria-labelledby="week-2-curves-tab" hidden><div class="distribution-subnav"><span class="distribution-subnav-label">07 · ${bilingual('Choose a distribution','分布を選ぶ')}</span><div class="distribution-subtabs" role="tablist" aria-label="Section 07 distribution options"><button type="button" role="tab" id="week-2-normal-tab" aria-controls="week-2-normal" aria-selected="true" tabindex="0">${bilingual('Normal','正規')}</button><button type="button" role="tab" id="week-2-t-tab" aria-controls="week-2-t" aria-selected="false" tabindex="-1">t</button><button type="button" role="tab" id="week-2-chi-tab" aria-controls="week-2-chi" aria-selected="false" tabindex="-1">${bilingual('Chi-square','カイ二乗')}</button></div></div><div id="week-2-normal" role="tabpanel" aria-labelledby="week-2-normal-tab">${distributionSimulationMarkup('normal')}</div><div id="week-2-t" role="tabpanel" aria-labelledby="week-2-t-tab" hidden>${distributionSimulationMarkup('t')}</div><div id="week-2-chi" role="tabpanel" aria-labelledby="week-2-chi-tab" hidden>${distributionSimulationMarkup('chi')}</div></div>
    </div>
    <div id="week-2-lecture-al" role="tabpanel" aria-labelledby="week-2-lecture-al-tab" hidden>
      <div class="simulation-tablist" role="tablist" aria-label="Week 2 AL explorations">
        <button type="button" role="tab" id="week-2-al-discrete-tab" aria-controls="week-2-al-discrete" aria-selected="true" tabindex="0">01 <span>${bilingual('Weighted average','期待値')}</span></button>
        <button type="button" role="tab" id="week-2-al-continuous-tab" aria-controls="week-2-al-continuous" aria-selected="false" tabindex="-1">02 <span>${bilingual('Two integrals','2つの積分')}</span></button>
      </div>
      <div id="week-2-al-discrete" role="tabpanel" aria-labelledby="week-2-al-discrete-tab">${alExpectationMarkup('discrete')}</div>
      <div id="week-2-al-continuous" role="tabpanel" aria-labelledby="week-2-al-continuous-tab" hidden>${alExpectationMarkup('continuous')}</div>
    </div>` : week.week === 1 ? `<div class="lecture-tablist" role="tablist" aria-label="Week 1 lecture">
      <button type="button" role="tab" id="week-1-lecture-slides-tab" aria-controls="week-1-lecture-slides" aria-selected="true" tabindex="0">${bilingual('Lecture', '講義')}</button>
      <button type="button" role="tab" id="week-1-lecture-simulations-tab" aria-controls="week-1-lecture-simulations" aria-selected="false" tabindex="-1">${bilingual('Simulations', 'シミュレーション')}</button>
    </div>
    <div id="week-1-lecture-slides" role="tabpanel" aria-labelledby="week-1-lecture-slides-tab">${content}</div>
    <div id="week-1-lecture-simulations" role="tabpanel" aria-labelledby="week-1-lecture-simulations-tab" hidden>
      <div class="simulation-tablist" role="tablist" aria-label="Choose a simulation">
        <button type="button" role="tab" id="week-1-monty-tab" aria-controls="week-1-monty" aria-selected="true" tabindex="0">01 <span>${bilingual('Monty Hall', 'モンティ・ホール')}</span></button>
        <button type="button" role="tab" id="week-1-coin-tab" aria-controls="week-1-coin" aria-selected="false" tabindex="-1">02 <span>${bilingual('Coin toss', 'コイン投げ')}</span></button>
        <button type="button" role="tab" id="week-1-events-tab" aria-controls="week-1-events" aria-selected="false" tabindex="-1">03 <span>${bilingual('Event grid', '事象のマス目')}</span></button>
        <button type="button" role="tab" id="week-1-test-tab" aria-controls="week-1-test" aria-selected="false" tabindex="-1">04 <span>${bilingual('Disease test', '病気の検査')}</span></button>
      </div>
      <div id="week-1-monty" role="tabpanel" aria-labelledby="week-1-monty-tab">${montyHallMarkup()}</div>
      <div id="week-1-coin" role="tabpanel" aria-labelledby="week-1-coin-tab" hidden>${coinSimulationMarkup()}</div>
      <div id="week-1-events" role="tabpanel" aria-labelledby="week-1-events-tab" hidden>${eventGridMarkup()}</div>
      <div id="week-1-test" role="tabpanel" aria-labelledby="week-1-test-tab" hidden>${diseaseTestMarkup()}</div>
    </div>` : content;
  return `<section class="week-zone lecture-zone" aria-labelledby="week-${week.week}-lecture">
    <header class="zone-heading"><p>${week.week === 14 ? bilingual('EXAM', '試験') : bilingual('LECTURE', '講義')}</p><h3 id="week-${week.week}-lecture">${heading}</h3></header>
    ${lectureBody}
  </section>`;
}

function assignmentTabs(week) {
  const items = week.materials.filter(item => !isLectureMaterial(item) && isActivityMaterial(item));
  if (!items.length) return `<div class="activity-empty"><p>${week.week === 14 ? bilingual('Final examination', '期末試験') : bilingual('No separate activity file is listed for this week.', '今週は別の授業内課題ファイルはありません。')}</p></div>`;
  const tabs = items.map((item, index) => `<button type="button" role="tab" id="week-${week.week}-tab-${index}" aria-controls="week-${week.week}-panel-${index}" aria-selected="${index === 0}" tabindex="${index === 0 ? '0' : '-1'}">${bilingual(`Activity ${index + 1}`, `アクティビティ${index + 1}`)}</button>`).join('');
  const panels = items.map((item, index) => {
    const preview = extension(item.href) === 'PDF' ? `<a class="file-button" href="${viewerLink(item.href, item.label, week.week)}">${bilingual('Preview material', '資料をプレビュー')}<span aria-hidden="true">→</span></a>` : '';
    const focus = weekFlow[week.week]?.steps[Math.min(index + 1, 2)];
    return `<div class="activity-panel" role="tabpanel" id="week-${week.week}-panel-${index}" aria-labelledby="week-${week.week}-tab-${index}"${index === 0 ? '' : ' hidden'}><p class="activity-type">${bilingual('IN-CLASS ACTIVITY', '授業内課題')}</p><h4>${escapeHtml(item.label)}</h4>${focus ? `<p class="activity-description">${bilingual(escapeHtml(focus[0]), escapeHtml(focus[1]))}</p>` : ''}<div class="activity-actions">${preview}${fileButton(item)}</div></div>`;
  }).join('');
  return `<div class="activity-tabs"><div class="activity-tablist" role="tablist" aria-label="${escapeHtml(`Week ${week.week} in-class activities`)}">${tabs}</div>${panels}</div>`;
}

function inClassSection(week) {
  return `<section class="week-zone activity-zone" aria-labelledby="week-${week.week}-activity">
    <h3 id="week-${week.week}-activity" class="sr-only">${bilingual('In-class activity', '授業内課題')}</h3>
    ${assignmentTabs(week)}
  </section>`;
}

function homeworkSection(week, nextClassDate) {
  const title = week.week === 13
    ? bilingual('Prepare for the final exam', '期末試験に備える')
    : bilingual('Take the quiz in UNIPA', 'UNIPAで小テストに回答');
  const instruction = week.week === 13
    ? bilingual('Work through the practice problems and check the final-exam notice in UNIPA.', '演習問題に取り組み、期末試験の案内をUNIPAで確認してください。')
    : bilingual('Complete the AL worksheet, then enter the requested cell values in the UNIPA quiz.', 'AL用ワークシートに取り組み、指定されたセルの値をUNIPAの小テストに入力してください。');
  const dueDate = week.week <= 12 && nextClassDate ? dayBefore(nextClassDate) : '';
  const deadline = dueDate ? `<div class="homework-deadline"><span class="homework-deadline-label">${bilingual('DEADLINE', '提出期限')}</span><time datetime="${dueDate}T23:59:00+09:00">${bilingual(`${fullDate(dueDate, 'en')} · 11:59 PM JST`, `${fullDate(dueDate, 'ja')} 23:59`)}</time><span class="homework-deadline-note">${bilingual('No late submissions accepted.', '締切後の提出は受け付けません。')}</span></div>` : '';
  return `<section class="week-zone homework-zone" aria-labelledby="week-${week.week}-homework">
    <p class="section-kicker">${bilingual('HOMEWORK', '宿題')}</p><h3 id="week-${week.week}-homework">${title}</h3><p class="homework-note">${instruction}</p>${deadline}
  </section>`;
}

function weekSummary(week, locked) {
  const number = String(week.week).padStart(2, '0');
  const release = compactDate(week.date, 'ja');
  return `<div class="week-summary">
    <div class="week-index"><span class="week-number">${number}</span><span class="week-date">${bilingual(escapeHtml(compactDate(week.date, 'en')), escapeHtml(compactDate(week.date, 'ja')))}<span class="week-hours">10:40–12:20</span></span></div>
    <div class="week-summary-main">${week.week === 1 ? `<p class="week-kicker">${bilingual('START HERE', 'ここから始める')}</p>` : ''}<h2>${bilingual(escapeHtml(week.title_en), escapeHtml(week.title_ja))}</h2>${week.orientationTitleEn ? `<p class="combined-note">+ ${bilingual(escapeHtml(week.orientationTitleEn), escapeHtml(week.orientationTitleJa))}</p>` : ''}</div>
    <div class="week-action">${locked ? `<span>${bilingual(`OPENS ${escapeHtml(compactDate(week.date, 'en'))}`, `${escapeHtml(release)} 公開`)}</span>` : `<span class="open-label">${bilingual('OPEN WEEK', '週を開く')}</span><span class="close-label">${bilingual('CLOSE WEEK', '週を閉じる')}</span><b aria-hidden="true">↓</b>`}</div>
  </div>`;
}

function weekIsLocked(week, previewAll, today) {
  return week.week !== 1 && !previewAll && today < (week.release_date || week.date);
}

function weekShortcuts(weeks, previewAll, today) {
  return `<nav class="week-shortcuts" aria-label="各週へ移動 / Jump to a week">${weeks.map(week => {
    const number = String(week.week).padStart(2, '0');
    const locked = weekIsLocked(week, previewAll, today);
    const date = week.date.slice(5).replace('-', '/');
    return `<a href="#week-${number}" class="week-shortcut${locked ? ' is-scheduled' : ''}" aria-label="${escapeHtml(`Week ${week.week}: ${week.title_ja}, ${date}${locked ? ', scheduled' : ''}`)}" title="${escapeHtml(week.title_ja)}"><span>${number}</span><small>${date}</small></a>`;
  }).join('')}</nav>`;
}

function weekCard(week, nextClassDate, previewAll, today) {
  const locked = weekIsLocked(week, previewAll, today);
  const id = `week-${String(week.week).padStart(2, '0')}`;
  if (locked) return `<section class="week-card week-card--locked" id="${id}" aria-label="${escapeHtml(`Week ${week.week}, opens ${week.date}`)}">${weekSummary(week, true)}</section>`;
  const open = week.week === 1 || previewAll || !!week.release_date;
  const work = week.week === 14 ? '' : `<div class="work-row">${inClassSection(week)}${homeworkSection(week, nextClassDate)}</div>`;
  return `<details class="week-card" id="${id}"${open ? ' open' : ''}><summary>${weekSummary(week, false)}</summary><div class="week-content">${lectureSection(week)}${work}</div></details>`;
}

function setupActivityTabs(root) {
  root.querySelectorAll('[role="tablist"]').forEach(tablist => {
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    const activate = tab => {
      tabs.forEach(candidate => {
        const selected = candidate === tab;
        candidate.setAttribute('aria-selected', String(selected));
        candidate.tabIndex = selected ? 0 : -1;
        document.getElementById(candidate.getAttribute('aria-controls')).hidden = !selected;
      });
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(tab));
      tab.addEventListener('keydown', event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const target = event.key === 'Home' ? tabs[0] : event.key === 'End' ? tabs.at(-1) : tabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
        activate(target);
        target.focus();
      });
    });
  });
}

function setupWeekToggles(root) {
  root.querySelectorAll('details.week-card').forEach(card => {
    const sync = () => card.querySelector('.week-action b').textContent = card.open ? '↑' : '↓';
    card.addEventListener('toggle', sync);
    sync();
  });
}

function renderAgenda(weeks) {
  const root = document.querySelector('[data-agenda]');
  if (!root) return;
  const localBrowsing = location.protocol === 'file:' || ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  const previewAll = localBrowsing || new URLSearchParams(location.search).get('preview') === 'all';
  const today = todayInTokyo();
  root.innerHTML = `${weekShortcuts(weeks, previewAll, today)}${previewAll ? `<div class="preview-notice">${bilingual('INSTRUCTOR PREVIEW · ALL WEEKS OPEN', '教員プレビュー · 全週を表示')}</div>` : ''}<div class="week-stack">${weeks.map((week, index) => weekCard(week, weeks[index + 1]?.date, previewAll, today)).join('')}</div>`;
  const syncWeekShortcut = () => {
    const requested = location.hash ? document.getElementById(location.hash.slice(1)) : null;
    if (requested?.tagName === 'DETAILS') requested.open = true;
    root.querySelectorAll('.week-shortcut').forEach(link => {
      if (link.hash === location.hash) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  root.querySelectorAll('.week-shortcut').forEach(link => link.addEventListener('click', () => {
    const card = document.getElementById(link.hash.slice(1));
    if (card?.tagName === 'DETAILS') card.open = true;
  }));
  window.addEventListener('hashchange', syncWeekShortcut);
  syncWeekShortcut();
  setupActivityTabs(root);
  setupWeekToggles(root);
  // Deck links select a specific exercise without bypassing published release dates.
  const activity = new URLSearchParams(location.search).get('activity');
  const exerciseRoutes = {
    lottery: ['week-2-lecture-explore-tab','week-2-examples-tab'],
    dice: ['week-2-lecture-explore-tab','week-2-examples-tab'],
    delivery: ['week-2-lecture-explore-tab','week-2-examples-tab'],
    'class-pairs': ['week-2-lecture-explore-tab','week-2-examples-tab'],
    'normal-w2': ['week-2-lecture-explore-tab','week-2-curves-tab','week-2-normal-tab'],
    't-w2': ['week-2-lecture-explore-tab','week-2-curves-tab','week-2-t-tab'],
    'chi-w2': ['week-2-lecture-explore-tab','week-2-curves-tab','week-2-chi-tab'],
    roulette: ['week-2-lecture-explore-tab','week-2-roulette-tab'],
    combinations: ['week-2-lecture-explore-tab','week-2-combinations-tab'],
    batting: ['week-2-lecture-explore-tab','week-2-batting-tab'],
    discrete: ['week-2-lecture-explore-tab','week-2-discrete-tab'],
    probability: ['week-2-lecture-explore-tab','week-2-probability-tab'],
    'al-discrete': ['week-2-lecture-al-tab','week-2-al-discrete-tab'],
    'al-continuous': ['week-2-lecture-al-tab','week-2-al-continuous-tab'],
    coin: ['week-1-lecture-simulations-tab','week-1-coin-tab'],
    normal: ['week-5-lecture-explore-tab'],
    t: ['week-6-lecture-explore-tab','week-6-t-tab'],
    chi: ['week-6-lecture-explore-tab','week-6-chi-tab']
  };
  for (const id of exerciseRoutes[activity] || []) document.getElementById(id)?.click();
  document.dispatchEvent(new Event('statsb:agenda-rendered'));
  const requested = location.hash ? document.getElementById(location.hash.slice(1)) : null;
  if (requested?.tagName === 'DETAILS') requested.open = true;
  requestAnimationFrame(() => requestAnimationFrame(() => requested?.scrollIntoView({ block:'start' })));
}

function setupLanguage() {
  const root = document.documentElement;
  const saved = localStorage.getItem('stats-b-language');
  const setLanguage = language => {
    root.dataset.language = language;
    root.lang = language;
    document.querySelectorAll('[data-language-toggle]').forEach(button => {
      const japanese = language === 'ja';
      button.textContent = japanese ? 'EN' : '日本語';
      button.setAttribute('aria-label', japanese ? 'Switch to English' : '日本語に切り替える');
    });
  };
  setLanguage(saved === 'en' ? 'en' : 'ja');
  document.querySelectorAll('[data-language-toggle]').forEach(button => button.addEventListener('click', () => {
    const next = root.dataset.language === 'ja' ? 'en' : 'ja';
    localStorage.setItem('stats-b-language', next);
    setLanguage(next);
  }));
}

function setupMenu() {
  const button = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-site-nav]');
  if (!button || !nav) return;
  button.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    button.setAttribute('aria-expanded', String(open));
  });
}

async function loadAgenda() {
  const root = document.querySelector('[data-agenda]');
  if (!root) return;
  try {
    const rawWeeks = await Promise.all(weekFiles.map(file => fetch(`content/weeks/${file}`, { cache:'no-store' }).then(response => {
      if (!response.ok) throw new Error(file);
      return response.text();
    }).then(source => parseWeek(source, file))));
    renderAgenda(combineWeekOne(rawWeeks));
  } catch (error) {
    console.error(error);
    root.innerHTML = `<p class="load-error">${bilingual('Unable to load the weekly agenda.', '授業予定を読み込めませんでした。')}</p>`;
  }
}

setupLanguage();
setupMenu();
loadAgenda();
