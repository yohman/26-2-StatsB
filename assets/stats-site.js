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

function viewerLink(file, title, week) {
  return `viewer.html?file=${encodeURIComponent(file)}&title=${encodeURIComponent(title)}&week=W${String(week).padStart(2, '0')}&return=${encodeURIComponent(`agenda.html#week-${String(week).padStart(2, '0')}`)}`;
}

function isLectureMaterial(item) {
  return ['primary', 'standard', 'yoh'].includes(item.type);
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
      return [{ label, preview:pdf?.href || '', downloads:[item, ...(pdf ? [pdf] : [])], type:item.type }];
    }
    used.add(item.href);
    return [{ label, preview:ext === 'PDF' ? item.href : '', downloads:[item], type:item.type }];
  });
}

function slideThumbnail(deck, week) {
  if (deck.type === 'primary') {
    const number = deck.preview.match(/\/26_(\d{2})_/)?.[1];
    if (number) return `assets/slide-previews/w${number}${number === '12' ? (deck.preview.includes('後半') ? '-b' : '-a') : ''}.png`;
  }
  if (week.week === 1 && deck.label === "Yoh's Week 1 lecture") return 'assets/slide-previews/yoh-w01.png';
  if (week.week === 13 && /final-exam review slides/i.test(deck.label)) return 'assets/slide-previews/yoh-w13.png';
  return '';
}

function fileButton(item, label = bilingual('Download material', '資料をダウンロード')) {
  return `<a class="file-button" href="${encodeHref(item.href)}" download>${label}<span aria-hidden="true">↓</span></a>`;
}

function timeAgenda(week) {
  const plan = weekFlow[week.week];
  if (!plan) return '';
  const times = week.week === 14 ? ['10:40–12:20'] : ['10:40–11:00', '11:00–11:30', '11:30–12:00', '12:00–12:20'];
  const labels = week.week === 14
    ? [['EXAM', '試験']]
    : [['LECTURE', '講義'], ['ACTIVITY 1', 'アクティビティ1'], ['ACTIVITY 2', 'アクティビティ2'], ['WRAP-UP', 'まとめ']];
  return `<ol class="class-agenda${week.week === 14 ? ' class-agenda--single' : ''}" aria-label="${escapeHtml(`Week ${week.week} class timing`)}">${plan.steps.map((step, index) => `<li><time>${times[index]}</time><strong>${bilingual(...labels[index])}</strong><span>${bilingual(escapeHtml(step[0]), escapeHtml(step[1]))}</span></li>`).join('')}</ol>`;
}

function slideCard(deck, week) {
  const image = slideThumbnail(deck, week);
  const preview = deck.preview ? `<a class="file-button slide-preview-button" href="${viewerLink(deck.preview, deck.label, week.week)}">${bilingual('Preview slides', 'スライドをプレビュー')}<span aria-hidden="true">→</span></a>` : '';
  const downloads = deck.downloads.map(item => fileButton(item, extension(item.href))).join('');
  return `<article class="slide-card${image ? '' : ' slide-card--no-cover'}">${image ? `<a class="slide-cover" href="${viewerLink(deck.preview, deck.label, week.week)}" aria-label="${escapeHtml(deck.label)}"><img src="${encodeHref(image)}" alt="" loading="lazy"></a>` : ''}<div class="slide-card-body"><h4>${escapeHtml(deck.label)}</h4><div class="slide-actions">${preview}<div class="slide-downloads">${downloads}</div></div></div></article>`;
}

function lectureSection(week) {
  const decks = lectureDecks(week.materials, week);
  const plan = weekFlow[week.week];
  const primary = decks.filter(deck => deck.type === 'primary');
  const other = decks.filter(deck => deck.type !== 'primary');
  const orientation = week.week === 1 ? primary.filter(deck => deck.preview.includes('26_00_')) : [];
  const visible = week.week === 1 ? [...primary.filter(deck => !orientation.includes(deck)), ...other] : !primary.length ? decks : primary;
  const more = week.week === 1 ? orientation : !primary.length ? [] : other;
  const slideList = visible.map(deck => slideCard(deck, week)).join('');
  const extra = more.length ? `<details class="more-slides"><summary>${bilingual(`Additional slides (${more.length})`, `補助スライド（${more.length}）`)}</summary><div class="more-slides-list">${more.map(deck => slideCard(deck, week)).join('')}</div></details>` : '';
  const description = plan ? bilingual(escapeHtml(plan.overview[0]), escapeHtml(plan.overview[1])) : bilingual(escapeHtml(week.title_en), escapeHtml(week.title_ja));
  const heading = week.week === 14 ? bilingual('Final examination', '期末試験') : bilingual('This week’s lecture', '今週の講義');
  return `<section class="week-zone lecture-zone" aria-labelledby="week-${week.week}-lecture">
    <header class="zone-heading"><p>${week.week === 14 ? bilingual('EXAM', '試験') : bilingual('LECTURE', '講義')}</p><h3 id="week-${week.week}-lecture">${heading}</h3></header>
    ${timeAgenda(week)}
    <div class="lecture-layout${decks.length ? '' : ' lecture-layout--no-slides'}"><p class="lecture-summary">${description}</p>${decks.length ? `<div class="lecture-slides">${slideList}${extra}</div>` : ''}</div>
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
