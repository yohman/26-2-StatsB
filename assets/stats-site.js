const weekFiles = [
  '00-orientation.md', '01-inference.md', '02-binomial.md', '03-poisson.md',
  '04-al-discrete.md', '05-normal.md', '06-t-chi.md', '07-al-continuous.md',
  '08-estimation.md', '09-confidence.md', '10-al-confidence.md', '11-hypothesis.md',
  '12-regression.md', '13-exam-prep.md', '14-final-exam.md'
];

const phaseForWeek = week => {
  if (week === 0) return ['START', 'はじめる'];
  if (week === 1) return ['INFER', '推測する'];
  if (week <= 4) return ['MODEL', 'モデル化する'];
  if (week <= 7) return ['DISTRIBUTE', '分布を読む'];
  if (week <= 10) return ['ESTIMATE', '推定する'];
  if (week === 11) return ['TEST', '検定する'];
  if (week === 12) return ['EXPLAIN', '説明する'];
  return ['ASSESS', '確かめる'];
};

const escapeHtml = value => String(value || '').replace(/[&<>"]/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[character]));
const extension = href => (href.split('?')[0].split('.').pop() || 'file').toUpperCase();
const encodeHref = href => encodeURI(href);

function parseWeek(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error('Missing front matter');
  const meta = {};
  match[1].split('\n').forEach(line => {
    const separator = line.indexOf(':');
    if (separator < 0) return;
    meta[line.slice(0, separator).trim()] = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '');
  });
  const sections = [...match[2].matchAll(/^##\s+(.+)\n([\s\S]*?)(?=^##\s+|$(?![\s\S]))/gm)]
    .map(([, title, body]) => ({ title:title.trim().toLowerCase(), body:body.trim() }));
  const section = name => sections.find(item => item.title === name.toLowerCase())?.body || '';
  return { ...meta, week:Number(meta.week), sections, prepare:section('Prepare'), inClass:section('In class'), materials:section('Materials') };
}

function parseFocus(body) {
  return body.split('\n').map(line => line.trim()).filter(line => line.startsWith('- ')).map(line => {
    const content = line.slice(2).trim();
    const bilingual = content.match(/^(.*?)\s+\(([^()]*)\)$/);
    return bilingual ? { ja:bilingual[1], en:bilingual[2] } : { ja:content, en:content };
  });
}

function parseMaterials(body) {
  return body.split('\n').map(line => line.trim()).filter(line => line.startsWith('- ')).flatMap(line => {
    const match = line.match(/^-\s*\[(.+?)\]\((.+)\)(?:\s*\{([^}]+)\})?$/);
    return match ? [{ label:match[1], href:match[2], type:(match[3] || 'support').toLowerCase() }] : [];
  });
}

function materialRole(item) {
  if (item.type === 'primary' || item.type === 'standard') return 'core';
  if (item.type === 'homework' || item.type === 'homework-answer') return 'homework';
  if (['worksheet', 'answer', 'data', 'notebook'].includes(item.type)) return 'practice';
  return 'more';
}

function materialName(item) {
  const labels = {
    primary:['PRIMARY DECK', '基本スライド'], standard:['STANDARD DECK', '標準スライド'],
    worksheet:['PRACTICE', '演習'], answer:['ANSWERS', '解答'], data:['DATA', 'データ'],
    notebook:['NOTEBOOK', 'ノートブック'], homework:['HOMEWORK', '課題'], 'homework-answer':['ANSWER KEY', '解答'],
    yoh:['YOH ARCHIVE', 'Yoh資料'], support:['REFERENCE', '参考資料']
  };
  return labels[item.type] || labels.support;
}

function formatDate(value, language) {
  const date = new Date(`${value}T12:00:00+09:00`);
  return new Intl.DateTimeFormat(language === 'ja' ? 'ja-JP' : 'en-US', {
    weekday:'short', year:'numeric', month:'short', day:'numeric', timeZone:'Asia/Tokyo'
  }).format(date);
}

function viewerLink(file, title, week) {
  const weekId = `week-${String(week).padStart(2, '0')}`;
  return `viewer.html?file=${encodeURIComponent(file)}&title=${encodeURIComponent(title)}&week=W${String(week).padStart(2, '0')}&return=${encodeURIComponent(`agenda.html#${weekId}`)}`;
}

function materialCard(item, allMaterials, week) {
  const ext = extension(item.href);
  const [roleEn, roleJa] = materialName(item);
  const pairedPdf = item.href.toLowerCase().endsWith('.pptx')
    ? allMaterials.find(candidate => candidate.href === item.href.replace(/\.pptx$/i, '.pdf'))?.href
    : '';
  const previewFile = pairedPdf || (ext === 'PDF' ? item.href : '');
  const previewLabel = pairedPdf ? ['PREVIEW PDF', 'PDFをプレビュー'] : ['PREVIEW', 'プレビュー'];
  return `<article class="material-card material-${escapeHtml(item.type)}" data-resource-role="${materialRole(item)}">
    <div class="material-card-head"><span class="file-kind">${ext}</span><span class="material-role"><span class="lang-en">${roleEn}</span><span class="lang-ja" lang="ja">${roleJa}</span></span></div>
    <h4>${escapeHtml(item.label)}</h4>
    <div class="material-actions">${previewFile ? `<a class="preview-link" href="${viewerLink(previewFile, item.label, week)}"><span class="lang-en">${previewLabel[0]}</span><span class="lang-ja" lang="ja">${previewLabel[1]}</span><i>↗</i></a>` : `<span class="preview-unavailable"><span class="lang-en">DOWNLOAD TO OPEN</span><span class="lang-ja" lang="ja">ダウンロードして開く</span></span>`}<a class="download-link" href="${encodeHref(item.href)}" download><span class="lang-en">DOWNLOAD</span><span class="lang-ja" lang="ja">ダウンロード</span><i>↓</i></a></div>
  </article>`;
}

function resourceGroup(titleEn, titleJa, items, allMaterials, week) {
  if (!items.length) return '';
  return `<section class="resource-group"><header><p class="lang-en">${titleEn}</p><p class="lang-ja" lang="ja">${titleJa}</p><span>${items.length}</span></header><div class="material-grid">${items.map(item => materialCard(item, allMaterials, week)).join('')}</div></section>`;
}

function weekCard(week) {
  const [phaseEn, phaseJa] = phaseForWeek(week.week);
  const focus = parseFocus(week.inClass);
  const materials = parseMaterials(week.materials);
  const core = materials.filter(item => materialRole(item) === 'core');
  const homework = materials.filter(item => materialRole(item) === 'homework');
  const practice = materials.filter(item => materialRole(item) === 'practice');
  const more = materials.filter(item => materialRole(item) === 'more');
  const id = `week-${String(week.week).padStart(2, '0')}`;
  const available = new Date() >= new Date(week.publish_at);
  const focusHtml = focus.length ? `<ul class="focus-list">${focus.map(item => `<li><span class="lang-en">${escapeHtml(item.en)}</span><span class="lang-ja" lang="ja">${escapeHtml(item.ja)}</span></li>`).join('')}</ul>` : '';
  const resources = available ? `${resourceGroup('START HERE', 'まずはここから', core, materials, week.week)}${resourceGroup('HOMEWORK', '課題', homework, materials, week.week)}${resourceGroup('PRACTISE & WORK WITH DATA', '演習・データ', practice, materials, week.week)}${resourceGroup('GO FURTHER', 'さらに学ぶ', more, materials, week.week)}` : `<p class="locked-copy"><span class="lang-en">This week’s resources will appear here when they are released.</span><span class="lang-ja" lang="ja">この週の資料は、公開後にここに表示されます。</span></p>`;
  return `<article class="week-card${available ? '' : ' is-locked'}" id="${id}">
    <div class="week-rail"><span>W${String(week.week).padStart(2, '0')}</span><b class="lang-en">${phaseEn}</b><b class="lang-ja" lang="ja">${phaseJa}</b></div>
    <div class="week-body"><header class="week-header"><div><p class="week-date"><span class="lang-en">${formatDate(week.date, 'en')}</span><span class="lang-ja" lang="ja">${formatDate(week.date, 'ja')}</span></p><h2><span class="lang-en">${escapeHtml(week.title_en)}</span><span class="lang-ja" lang="ja">${escapeHtml(week.title_ja)}</span></h2></div><button class="week-toggle" type="button" aria-controls="${id}-detail" aria-expanded="false"><span class="lang-en">OPEN WEEK</span><span class="lang-ja" lang="ja">週の内容を見る</span><i aria-hidden="true">+</i></button></header>
      <div class="week-detail" id="${id}-detail" hidden><div class="week-route"><section class="prepare-card"><p class="section-label"><span class="lang-en">BEFORE CLASS</span><span class="lang-ja" lang="ja">授業前の準備</span></p><p class="lang-en">${escapeHtml(week.prepare_en || 'Review this week’s core ideas before class.')}</p><p class="lang-ja" lang="ja">${escapeHtml(week.prepare)}</p></section><section class="focus-card"><p class="section-label"><span class="lang-en">IN CLASS</span><span class="lang-ja" lang="ja">授業で扱うこと</span></p><p class="formula">${escapeHtml(week.formula)}</p>${focusHtml}</section></div><div class="week-materials"><div class="materials-heading"><p class="section-label"><span class="lang-en">WEEKLY MATERIALS</span><span class="lang-ja" lang="ja">今週の資料</span></p><p class="lang-en">Preview PDFs in your browser. Download the source file when you need to work with it.</p><p class="lang-ja" lang="ja">PDFはブラウザでプレビューできます。作業用のファイルはダウンロードしてください。</p></div>${resources}</div></div>
    </div>
  </article>`;
}

function renderAgenda(weeks) {
  const root = document.querySelector('[data-agenda]');
  if (!root) return;
  const openStateKey = 'stats-b-open-weeks';
  const scrollStateKey = 'stats-b-agenda-scroll-y';
  const savedOpenWeeks = new Set(JSON.parse(sessionStorage.getItem(openStateKey) || '[]'));
  root.innerHTML = `<div class="agenda-controls"><p><span class="lang-en">${weeks.length} course meetings · Open the week you need.</span><span class="lang-ja" lang="ja">全${weeks.length}回 · 必要な週を開いてください。</span></p><button class="all-toggle" type="button" aria-expanded="false"><span class="lang-en">EXPAND ALL</span><span class="lang-ja" lang="ja">すべて開く</span><i>↓</i></button></div>${weeks.sort((a, b) => a.week - b.week).map(weekCard).join('')}`;
  const cards = [...root.querySelectorAll('.week-card')];
  const all = root.querySelector('.all-toggle');
  const saveOpenWeeks = () => sessionStorage.setItem(openStateKey, JSON.stringify(cards.filter(card => card.classList.contains('is-open')).map(card => card.id)));
  const syncAllToggle = () => {
    const open = cards.length > 0 && cards.every(card => card.classList.contains('is-open'));
    all.setAttribute('aria-expanded', String(open));
    all.querySelector('.lang-en').textContent = open ? 'COLLAPSE ALL' : 'EXPAND ALL';
    all.querySelector('.lang-ja').textContent = open ? 'すべて閉じる' : 'すべて開く';
    all.querySelector('i').textContent = open ? '↑' : '↓';
  };
  const setOpen = (card, open) => {
    const detail = card.querySelector('.week-detail');
    const button = card.querySelector('.week-toggle');
    card.classList.toggle('is-open', open);
    detail.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
    button.querySelector('i').textContent = open ? '−' : '+';
    button.querySelector('.lang-en').textContent = open ? 'CLOSE WEEK' : 'OPEN WEEK';
    button.querySelector('.lang-ja').textContent = open ? '週を閉じる' : '週の内容を見る';
  };
  cards.filter(card => savedOpenWeeks.has(card.id)).forEach(card => setOpen(card, true));
  syncAllToggle();
  cards.forEach(card => card.querySelector('.week-toggle').addEventListener('click', () => {
    setOpen(card, !card.classList.contains('is-open'));
    syncAllToggle();
    saveOpenWeeks();
  }));
  all.addEventListener('click', () => {
    const open = all.getAttribute('aria-expanded') !== 'true';
    cards.forEach(card => setOpen(card, open));
    syncAllToggle();
    saveOpenWeeks();
  });
  const saveScrollPosition = () => sessionStorage.setItem(scrollStateKey, String(window.scrollY));
  window.addEventListener('pagehide', saveScrollPosition, { once:true });
  const savedScrollPosition = Number(sessionStorage.getItem(scrollStateKey));
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (Number.isFinite(savedScrollPosition) && savedScrollPosition > 0) {
      window.scrollTo({ top:savedScrollPosition, behavior:'auto' });
      return;
    }
    const target = location.hash ? document.getElementById(location.hash.slice(1)) : null;
    target?.scrollIntoView({ block:'start' });
  }));
}

function setupLanguage() {
  const root = document.documentElement;
  const saved = localStorage.getItem('stats-b-language');
  const setLanguage = language => {
    root.dataset.language = language;
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
    const weeks = await Promise.all(weekFiles.map(file => fetch(`content/weeks/${file}`, { cache:'no-store' }).then(response => {
      if (!response.ok) throw new Error(file);
      return response.text();
    }).then(parseWeek)));
    renderAgenda(weeks);
  } catch (error) {
    root.innerHTML = '<p class="load-error">Unable to load the weekly agenda. Please refresh the page or check the course files.</p>';
  }
}

setupLanguage();
setupMenu();
loadAgenda();
