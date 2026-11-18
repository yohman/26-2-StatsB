(async () => {
  'use strict';

  const $ = selector => document.querySelector(selector);
  const params = new URLSearchParams(location.search);
  const week = Number(params.get('week'));
  const review = window.CourseLessons[week];
  const plan = window.fullLecturePlans[week];
  const reviewMode = params.get('view') === 'review';
  const lesson = review && !reviewMode ? window.completeLecture(week,review) : review;
  const stage = $('#stage');
  if (!lesson) {
    stage.textContent = '授業予定から週を選んでください。';
    $('#agenda').href = '../../../agenda.html';
    return;
  }

  const weekNumber = String(week).padStart(2, '0');
  const root = new URL('../../../', location.href);
  const agenda = new URL('agenda.html', root);
  if (params.has('p')) agenda.searchParams.set('p', '');
  agenda.hash = 'week-' + weekNumber;
  $('#agenda').href = agenda.href;
  $('#week-label').textContent = 'W' + weekNumber + ' · ' + lesson.title;

  const slides = [];
  const originalPages = new Map();
  let scenes = [];
  if (plan && !reviewMode) {
    try {
      const response = await fetch(`../week${weekNumber}/lecture-scenes.json?v=native-1`);
      if (!response.ok) throw new Error('Lecture content unavailable');
      const data = await response.json();
      if (data.pages.length !== plan.total) throw new Error('Unexpected lecture page count');
      scenes = data.pages;
      const styles = document.createElement('style');
      styles.textContent = data.css;
      document.querySelector('link[href^="course-slides.css"]').before(styles);
    } catch (error) {
      stage.textContent = '講義を読み込めませんでした。ページを再読み込みしてください。';
      console.error(error);
      return;
    }
  }
  const notesUrl = '../week' + weekNumber + '/w' + week + '.notes.json';
  const notes = (plan && week >= 5 && !reviewMode ? fetch(notesUrl) : Promise.resolve(null)).then(response => response?.ok ? response.json() : null)
    .then(data => new Map((data?.slides || []).map(note => [note.page, note])))
    .catch(() => new Map());
  for (const section of lesson.sections) {
    for (const entry of section.items) {
      if (!entry.pages) {
        slides.push({...entry, section: section.title});
        continue;
      }
      const original = entry.pages[0];
      entry.pages.forEach(page => originalPages.set(page, slides.length));
      slides.push({...entry, original, section:section.title, title:scenes[original - 1].title,
        challenge:lesson.challenges?.includes(original)});
    }
  }

  let index = 0;
  let step = 0;
  let stepCount = 0;
  let requestedSource = Number(params.get('source'));
  let revision = 0;
  let dispose = () => {};
  let activeScene;
  let disposeExercise = () => {};
  const figureDialog = $('#figure-dialog');
  const toc = $('#toc');
  const guard = $('#answer-check');
  const footer = $('#reveal');
  $('#total').textContent = slides.length;
  $('#page').max = slides.length;

  function updateReveal() {
    stage.querySelectorAll('[data-step]:not(.source-reveal)').forEach(element => {
      const shown = Number(element.dataset.step) <= step;
      element.classList.toggle('shown', shown);
      element.inert = !shown;
    });
    footer.hidden = step >= stepCount;
    $('#next').disabled = index === slides.length - 1 && step >= stepCount;
    $('#steps').textContent = stepCount ? step + ' / ' + stepCount : '';
    footer.textContent = activeScene?.slide.pages.length > 1 ? '次の段階 →' : '続きを表示 ＋';
  }

  function syncMath(element) {
    if (window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise([element]).catch(console.error);
      return;
    }
    const script = document.querySelector('script[src*="tex-chtml"]');
    script?.addEventListener('load', () => {
      if (element.isConnected) window.MathJax.startup.promise.then(() => syncMath(element));
    }, {once:true});
  }

  function courseLink(raw) {
    const url = new URL(raw, location.href);
    if (url.hostname === 'yohman.github.io' && url.pathname.startsWith('/26-2-StatsB/')) {
      const local = new URL(url.pathname.substring('/26-2-StatsB/'.length), root);
      local.search = url.search;
      local.hash = url.hash;
      return local;
    }
    return url;
  }

  function replaceBasketballFigure(scene) {
    // Use the six actual groups of the challenge, in its original A–F order.
    const worksheet = document.createElement('template');
    worksheet.innerHTML = scenes[22].html;
    const samples = Array.from(worksheet.content.querySelectorAll('.cx-score span'), el =>
      el.textContent.trim().split(/\s+/).map(Number));
    const figure = scene.querySelector('img[src*="basketball-true-season"]');
    const explanation = scene.querySelector('.small');
    if (!figure || !explanation || samples.length !== 6) return;
    const board = document.createElement('div');
    board.className = 'sample-comparison';
    const x = score => 80 + (score - 22) * 55;
    board.innerHTML = `<svg viewBox="0 0 830 270" role="img" aria-label="6標本の平均と母平均28点の比較">
        <path d="M${x(28)} 24V229" stroke="#b66330" stroke-width="2.5" stroke-dasharray="5 4"/>
        <text x="${x(28)}" y="16" text-anchor="middle" fill="#9a5228">母平均 28点</text>
        ${Array.from({length:7},(_,i)=>22+2*i).map(tick=>`<text x="${x(tick)}" y="258" text-anchor="middle">${tick}</text>`).join('')}
        ${samples.map((scores,i)=>{
          const mean = scores.reduce((sum,score)=>sum+score,0)/scores.length;
          const row = 48+i*33;
          const delta = mean - 28;
          return `<text x="35" y="${row+6}">${'ABCDEF'[i]}</text><path d="M80 ${row}H740" stroke="#d4ded8"/>
            <g class="sample-dot" data-sample="${i}" visibility="hidden">
              <path d="M${x(28)} ${row}H${x(mean)}" stroke="#599c91" stroke-width="3"/>
              <circle cx="${x(mean)}" cy="${row}" r="7" fill="#1a756a"/>
              <text x="${x(mean)+(delta>=0?12:-12)}" y="${row+6}" text-anchor="${delta>=0?'start':'end'}">${mean.toFixed(1)} (${delta>0?'+':''}${delta.toFixed(1)})</text>
            </g>`;
        }).join('')}
      </svg><div class="lesson-controls">
        ${samples.map((_,i)=>`<button type="button" data-toggle-sample="${i}" aria-label="標本 ${'ABCDEF'[i]}" aria-pressed="false">${'ABCDEF'[i]}</button>`).join('')}
        <button type="button" data-all-samples>すべて表示</button>
      </div>`;
    figure.replaceWith(board);
    explanation.hidden = true;
    const rows = Array.from(board.querySelectorAll('[data-sample]'));
    const buttons = Array.from(board.querySelectorAll('[data-toggle-sample]'));
    const toggle = (index, visible) => {
      rows[index].setAttribute('visibility',visible?'visible':'hidden');
      buttons[index].setAttribute('aria-pressed',String(visible));
      buttons[index].classList.toggle('selected',visible);
      explanation.hidden = !buttons.every(button=>button.classList.contains('selected'));
    };
    buttons.forEach((button,i)=>button.onclick=()=>toggle(i,button.getAttribute('aria-pressed')!=='true'));
    board.querySelector('[data-all-samples]').onclick = () => buttons.forEach((_,i)=>toggle(i,true));
  }

  function bindScene(s) {
    if (week === 8 && s.dataset.page === '24') replaceBasketballFigure(s);
    for (const anchor of s.querySelectorAll('a[href]')) {
      const raw = anchor.getAttribute('href');
      if (raw.startsWith('#')) continue;
      const url = courseLink(raw);
      if (url.href.startsWith(root.href) && params.has('p')) url.searchParams.set('p','');
      anchor.href = url.href;
    }

    // Table cells remain in place while the row and column are traced.
    for (const table of s.querySelectorAll('.lookup-table')) {
      table.classList.add('trace-table');
      const highlight = cell => {
        table.querySelectorAll('.trace').forEach(el => el.classList.remove('trace'));
        if (!cell) return;
        const row = cell.parentElement;
        Array.from(row.cells).forEach(el => el.classList.add('trace'));
        for (const other of table.rows) other.cells[cell.cellIndex]?.classList.add('trace');
      };
      for (const cell of table.querySelectorAll('td')) {
        cell.tabIndex = 0;
        cell.addEventListener('focus', () => highlight(cell));
        cell.addEventListener('pointerenter', () => highlight(cell));
      }
      table.addEventListener('pointerleave', () => highlight(table.querySelector('td:focus')));
      table.addEventListener('focusout', () => highlight(null));
    }
    for (const img of s.querySelectorAll('img:not(.scene-backdrop)')) {
      if (img.closest('a') || !/chart|graph|figure|distribution|lookup|diagram|グラフ|分布|chart|histogram/i.test(img.alt+' '+img.src)) continue;
      const button = document.createElement('button');
      button.className = 'inspect-figure';
      button.type = 'button';
      button.setAttribute('aria-label', '図を拡大' + (img.alt ? ' · ' + img.alt : ''));
      img.before(button);
      button.append(img);
      button.onclick = () => {
        $('#figure-image').src = img.currentSrc || img.src;
        $('#figure-image').alt = img.alt;
        figureDialog.showModal();
      };
    }
  }

  function prepareSteps(scene, forceAnswer) {
    const mark = (el, step) => {
      el.classList.add('source-reveal');
      el.dataset.step = step;
    };
    const deviations = scene.querySelector('.deviation-grid');
    if (deviations) {
      deviations.querySelectorAll('td:nth-child(2)').forEach(el=>mark(el,1));
      deviations.querySelectorAll('td:nth-child(3)').forEach(el=>mark(el,2));
      if (deviations.lastElementChild !== deviations.querySelector('table')) mark(deviations.lastElementChild,3);
      scene.querySelectorAll('.substitution,.symbolic,.meaning,.point-word').forEach(el=>mark(el,3));
      return 3;
    }
    if (scene.matches('.vstep-denominator')) {
      scene.querySelectorAll('.substitution').forEach(el=>mark(el,1));
      scene.querySelectorAll('.meaning,.chart').forEach(el=>mark(el,2));
      return 2;
    }

    const challenge = !forceAnswer && scene.matches('.challenge,.challenge-question');
    if (challenge) {
      const references = Array.from(scene.children).filter(el => el.matches('.reference,.hint,.formula-ref,.formula-reference'));
      for (const reference of references) {
        if (reference.textContent.trim().startsWith('教科書')) continue;
        const details = document.createElement('details');
        const summary = document.createElement('summary');
        summary.textContent = 'ヒント・公式';
        reference.before(details);
        details.append(summary,reference);
      }
      return 0;
    }
    const ineligible = 'h1,h2,h3,.en,.book,.source,.scene-backdrop,footer,.stat-terms,.badge,.given,.gives,.worksheet-context,aside';
    const copy = scene.querySelector('.work-copy,.worked-copy,.answer-main,.answer-content');
    const groups = Array.from(copy?.children || scene.children)
      .filter(el => !el.matches(ineligible) && (copy || forceAnswer || scene.matches('.worked,.worked-answer,.worksheet-answer')));
    if (groups.length < 2) return 0;
    const labels = '.step,.worked-label,.step-label';
    let number = 0;
    for (const [i, el] of groups.entries()) {
      // Keep the first condition on-screen. A step label and its equation appear together.
      if (i === 0) continue;
      if (!groups[i-1].matches(labels)) number++;
      if (number) mark(el,number);
    }
    return number;
  }

  function stateFor(slide, reveal) {
    return slide.progress[reveal];
  }

  function renderSource() {
    const {slide,scene,body} = activeScene;
    const state = stateFor(slide,step);
    const page = state.page;
    if (scene.dataset.page !== String(page)) {
      const source = scenes[page - 1];
      window.MathJax?.typesetClear?.([scene]);
      scene.className = 'source-scene ' + source.classes;
      scene.innerHTML = source.html;
      scene.dataset.page = page;
      bindScene(scene);
      if (slide.pages.length === 1 || scene.matches('.vstep')) prepareSteps(scene,slide.worked && !(week === 8 && page === 24));
      syncMath(scene);
      body.scrollTop = 0;
    }
    scene.querySelectorAll('.source-reveal').forEach(el => {
      const visible = Number(el.dataset.step) <= state.local;
      el.classList.toggle('shown',visible);
      el.inert = !visible;
    });
    const version = ++revision;
    notes.then(map => {
      if (version !== revision) return;
      const note = map.get(page);
      $('#notes').textContent = note?.en || note?.ja || scenes[page - 1].title || slide.section;
    });
  }

  function openSource(slide) {
    const body = document.createElement('div');
    body.className = 'slide-body source-host';
    body.tabIndex = 0;
    body.setAttribute('aria-label','スライド内容');
    const scene = document.createElement('section');
    scene.dataset.week = week;
    body.append(scene);
    stage.append(body);
    activeScene = {slide,scene,body};
    slide.progress = slide.pages.flatMap(page => {
      const draft = document.createElement('template');
      const source = scenes[page - 1];
      draft.innerHTML = '<section class="' + source.classes + '">' + source.html + '</section>';
      const element = draft.content.firstElementChild;
      // Sequential chart builds already isolate each addition. Preserve those
      // stages, and add column/formula reveals to the calculation frames.
      const staged = slide.pages.length > 1 && !element.matches('.vstep');
      const steps = staged ? 0 : prepareSteps(element,slide.worked && !(week === 8 && page === 24));
      return Array.from({length:steps + 1},(_,local)=>({page, local}));
    });
    stepCount = slide.progress.length - 1;
    if (requestedSource) {
      step = Math.max(0,slide.progress.findIndex(state=>state.page === requestedSource));
      requestedSource = 0;
    }
    renderSource();

    if (!slide.exercises.length) return;
    const switcher = document.createElement('div');
    switcher.className = 'scene-switcher';
    const exerciseBody = document.createElement('div');
    exerciseBody.className = 'slide-body scene-exercise';
    exerciseBody.hidden = true;
    exerciseBody.tabIndex = 0;
    stage.append(exerciseBody,switcher);

    let active = -1;
    const choices = ['スライド', ...slide.exercises.map(exercise => exercise.title)];
    const buttons = choices.map((label,i) => {
      const button = document.createElement('button');
      button.textContent = label;
      button.type = 'button';
      button.title = label;
      button.setAttribute('aria-pressed',String(i === 0));
      switcher.append(button);
      return button;
    });
    const select = number => {
      if (number === active) return;
      disposeExercise();
      disposeExercise = () => {};
      active = number;
      exerciseStep = 0;
      reveal.hidden = true;
      buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i === active+1)));
      body.hidden = number !== -1;
      exerciseBody.hidden = number === -1;
      stage.classList.toggle('showing-exercise',number !== -1);
      footer.hidden = active >= 0 || step >= stepCount;
      window.MathJax?.typesetClear?.([exerciseBody]);
      exerciseBody.replaceChildren();
      if (number < 0) {
        renderSource();
        return;
      }
      revision++;
      const exercise = slide.exercises[number];
      exerciseBody.classList.toggle('lab-body',Boolean(exercise.lab));
      exerciseBody.innerHTML = exercise.html;
      disposeExercise = exercise.mount?.(exerciseBody) || (()=>{});
      exerciseBody.scrollTop = 0;
      $('#notes').textContent = exercise.notes || '';
      syncMath(exerciseBody);
      updateExercise();
    };
    buttons.forEach((button,i)=>button.onclick = () => select(i-1));

    let exerciseStep = 0;
    const reveal = document.createElement('button');
    reveal.type = 'button';
    reveal.textContent = '続きを表示 ＋';
    reveal.hidden = true;
    switcher.append(reveal);
    const updateExercise = () => {
      const elements = Array.from(exerciseBody.querySelectorAll('[data-step]'));
      const maximum = Math.max(0,...elements.map(el=>Number(el.dataset.step)));
      for (const el of elements) {
        const shown = Number(el.dataset.step) <= exerciseStep;
        el.classList.toggle('shown',shown);
        el.inert = !shown;
      }
      reveal.hidden = active < 0 || exerciseStep >= maximum;
    };
    reveal.onclick = () => { exerciseStep++; updateExercise(); };
  }

  function render() {
    const slide = slides[index];
    revision++;
    activeScene = null;
    disposeExercise();
    disposeExercise = () => {};
    dispose();
    dispose = () => {};
    window.MathJax?.typesetClear?.([stage]);
    stage.replaceChildren();
    stage.className = slide.original ? 'native-slide source-slide' : 'native-slide ' + (slide.theme || 'light');
    step = 0;
    stepCount = 0;
    $('#notes').textContent = slide.notes || '';
    if (slide.original) {
      openSource(slide);
    } else {
      const body = document.createElement('div');
      body.className = 'slide-body' + (slide.lab ? ' lab-body' : '');
      body.innerHTML = slide.html;
      body.tabIndex = 0;
      body.setAttribute('aria-label','スライド内容');
      stage.append(body);
      if (slide.lab) stage.classList.add('lab-slide');
      if (slide.book) {
        const book = document.createElement('span');
        book.className = 'book';
        book.textContent = '教科書 p.' + slide.book;
        stage.append(book);
      }
      dispose = slide.mount?.(body) || (() => {});
      stepCount = Math.max(0,...Array.from(body.querySelectorAll('[data-step]'), el=>Number(el.dataset.step)));
      syncMath(body);
    }
    updateReveal();
    $('#page').value = index + 1;
    $('#first').disabled = $('#prev').disabled = index === 0;
    $('#last').disabled = index === slides.length - 1;
    $('#next').disabled = index === slides.length - 1 && !stepCount;
    $('#status').textContent = (index + 1) + ' / ' + slides.length + ' · ' + (slide.title || slide.section);
    document.title = 'Week ' + week + ' · ' + (slide.title || slide.section);
    toc.querySelectorAll('[data-page]').forEach(button => button.setAttribute('aria-current',String(+button.dataset.page===index)));
    const url = new URL(location.href);
    url.searchParams.set('page',index + 1);
    url.searchParams.delete('source');
    history.replaceState(null,'',url);
  }

  function go(to) {
    if (guard.open) return;
    const target = Math.min(slides.length - 1, Math.max(0, Math.trunc(to) || 0));
    if (slides[index].challenge && target > index) {
      guard.returnValue = 'stay';
      guard.addEventListener('close', () => {
        if (guard.returnValue === 'show') {
          index = target;
          render();
        } else $('#page').value = index + 1;
      },{once:true});
      guard.showModal();
      return;
    }
    index = target;
    render();
  }

  function next() {
    if (stage.classList.contains('showing-exercise')) {
      stage.querySelector('.scene-switcher button').click();
      return;
    }
    if (step < stepCount) {
      step++;
      if (activeScene) renderSource();
      updateReveal();
    } else if (index < slides.length - 1) go(index + 1);
  }
  function previous() {
    if (stage.classList.contains('showing-exercise')) {
      stage.querySelector('.scene-switcher button').click();
      return;
    }
    if (step > 0) {
      step--;
      if (activeScene) renderSource();
      updateReveal();
    }
    else if (index > 0) go(index - 1);
  }

  if (plan) {
    const switchView = document.createElement('a');
    const destination = new URL(location.href);
    destination.searchParams.delete('page');
    destination.hash = '';
    if (reviewMode) destination.searchParams.delete('view');
    else destination.searchParams.set('view','review');
    switchView.href = destination.href;
    switchView.className = 'lecture-view-link';
    switchView.textContent = reviewMode ? '本編を見る / Full lecture' : '操作・復習だけを見る / Interactive review';
    $('#toc-links').append(switchView);
  }

  let lastSection;
  slides.forEach((slide,i) => {
    if (slide.section === lastSection && !slide.challenge && !slide.exercises?.length && !slide.anchor) return;
    if (slide.section !== lastSection) {
      const heading = document.createElement('h3');
      heading.textContent = slide.section;
      $('#toc-links').append(heading);
      lastSection = slide.section;
    }
    const button = document.createElement('button');
    button.dataset.page = i;
    const num = document.createElement('span');
    num.textContent = i + 1;
    button.append(num, slide.title || (slide.challenge ? 'チャレンジ' : 'この項目へ'));
    button.onclick = () => { toc.close(); go(i); };
    $('#toc-links').append(button);
  });

  function toggleNotes() {
    const panel = $('#notes');
    panel.hidden = !panel.hidden;
    $('#notes-toggle').setAttribute('aria-expanded',String(!panel.hidden));
    document.body.classList.toggle('with-notes',!panel.hidden);
  }

  async function fullscreen() {
    if (document.body.classList.contains('presenting')) { document.body.classList.remove('presenting'); return; }
    if (document.fullscreenElement) { await document.exitFullscreen(); return; }
    try { await document.documentElement.requestFullscreen(); }
    catch { document.body.classList.add('presenting'); }
  }

  $('#first').onclick = () => go(0);
  $('#last').onclick = () => go(slides.length - 1);
  $('#next').onclick = footer.onclick = next;
  $('#prev').onclick = previous;
  $('#page').onchange = event => go(Number(event.target.value) - 1);
  $('#page').onkeydown = event => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const target = Number(event.target.value) - 1;
    // Move focus before navigating, so later arrow keys turn slides.
    $('#page').onchange = null;
    event.target.blur();
    $('#page').onchange = () => go(Number($('#page').value) - 1);
    go(target);
  };
  $('#contents').onclick = () => toc.showModal();
  $('#close-toc').onclick = () => toc.close();
  $('#close-figure').onclick = () => figureDialog.close();
  $('#notes-toggle').onclick = toggleNotes;
  $('#fullscreen').onclick = fullscreen;
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') document.body.classList.remove('presenting');
    if (toc.open || guard.open || figureDialog.open || event.target.closest('input,select,textarea') ||
       (event.key === ' ' && event.target.closest('button,a,summary'))) return;
    const slideBody = event.target.closest('.slide-body');
    if (slideBody && ['PageUp','PageDown','Home','End'].includes(event.key) &&
        slideBody.scrollHeight > slideBody.clientHeight) return;
    if (['ArrowRight',' ','PageDown'].includes(event.key)) { event.preventDefault(); next(); }
    if (['ArrowLeft','PageUp'].includes(event.key)) { event.preventDefault(); previous(); }
    if (event.key === 'Home') go(0);
    if (event.key === 'End') go(slides.length - 1);
    if (event.key.toLowerCase() === 'c') toc.showModal();
    if (event.key.toLowerCase() === 'n') toggleNotes();
    if (event.key.toLowerCase() === 'f') fullscreen();
  });

  index = Math.min(slides.length - 1, Math.max(0, parseInt(params.get('page'),10) - 1 || 0));
  const originalParam = Number(params.get('source'));
  if (originalPages.has(originalParam)) index = originalPages.get(originalParam);
  const requestedSlide = slides.findIndex(slide => slide.anchor && '#'+slide.anchor === location.hash);
  if (!params.has('page') && requestedSlide >= 0) index = requestedSlide;
  render();
})();
