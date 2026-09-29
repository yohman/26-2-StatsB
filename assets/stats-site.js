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
    const label = item.type === 'primary' && /^Tsumura 2026 lecture slides/i.test(sourceLabel)
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
  return `<article class="slide-card${image ? '' : ' slide-card--no-cover'}">${image && link ? `<a class="slide-cover" href="${link}" aria-label="${escapeHtml(deck.label)}"><img src="${encodeHref(image)}" alt="" loading="lazy"></a>` : ''}<div class="slide-card-body"><h4>${escapeHtml(deck.label)}</h4>${preview}</div></article>`;
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
  const lectureBody = week.week === 1 ? `<div class="lecture-tablist" role="tablist" aria-label="Week 1 lecture">
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

function weekCard(week, nextClassDate, previewAll, today) {
  const locked = week.week !== 1 && !previewAll && today < week.date;
  const id = `week-${String(week.week).padStart(2, '0')}`;
  if (locked) return `<section class="week-card week-card--locked" id="${id}" aria-label="${escapeHtml(`Week ${week.week}, opens ${week.date}`)}">${weekSummary(week, true)}</section>`;
  const open = week.week === 1 || previewAll;
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
  const previewAll = new URLSearchParams(location.search).get('preview') === 'all';
  const today = todayInTokyo();
  root.innerHTML = `${previewAll ? `<div class="preview-notice">${bilingual('INSTRUCTOR PREVIEW · ALL WEEKS OPEN', '教員プレビュー · 全週を表示')}</div>` : ''}<div class="week-stack">${weeks.map((week, index) => weekCard(week, weeks[index + 1]?.date, previewAll, today)).join('')}</div>`;
  setupActivityTabs(root);
  setupWeekToggles(root);
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
