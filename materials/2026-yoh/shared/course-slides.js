(() => {
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
  const notesUrl = '../week' + weekNumber + '/w' + week + '.notes.json';
  const notes = (plan && week >= 5 && !reviewMode ? fetch(notesUrl) : Promise.resolve(null)).then(response => response?.ok ? response.json() : null)
    .then(data => new Map((data?.slides || []).map(note => [note.page, note])))
    .catch(() => new Map());
  let pdf;
  function getPdf() {
    if (!pdf) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('assets/vendor/pdfjs/pdf.worker.min.js', root).href;
      pdf = pdfjsLib.getDocument(new URL('../week' + weekNumber + '/w' + week + '.pdf', location.href).href).promise;
    }
    return pdf;
  }

  for (const section of lesson.sections) {
    for (const entry of section.items) {
      if (typeof entry !== 'string') {
        if (entry.sourcePage) originalPages.set(entry.sourcePage,slides.length);
        slides.push({...entry, section: section.title});
        continue;
      }
      if (entry.includes('>')) {
        const sequence = entry.split('>').map(Number);
        sequence.forEach(page => originalPages.set(page,slides.length));
        slides.push({original:sequence[0], sequence, section:section.title,
          challenge: lesson.challenges?.includes(sequence[0])});
        continue;
      }
      const [first, last = first] = entry.split('-').map(Number);
      for (let page = first; page <= last; page++) {
        originalPages.set(page, slides.length);
        slides.push({original: page, section: section.title, challenge: lesson.challenges?.includes(page)});
      }
    }
  }

  let index = 0;
  let step = 0;
  let stepCount = 0;
  let revision = 0;
  let dispose = () => {};
  let renderTask;
  const toc = $('#toc');
  const guard = $('#answer-check');
  const footer = $('#reveal');
  $('#total').textContent = slides.length;
  $('#page').max = slides.length;

  function updateReveal() {
    stage.querySelectorAll('[data-step]').forEach(element => {
      const shown = Number(element.dataset.step) <= step;
      element.classList.toggle('shown', shown);
      element.inert = !shown;
    });
    footer.hidden = step >= stepCount;
    $('#next').disabled = index === slides.length - 1 && step >= stepCount;
    $('#steps').textContent = stepCount ? step + ' / ' + stepCount : '';
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

  async function artwork(slide, version) {
    try {
      const doc = await getPdf();
      const page = await doc.getPage(slide.original);
      if (version !== revision) return;
      const view = page.getViewport({scale: 1});
      const figure = document.createElement('figure');
      const canvas = document.createElement('canvas');
      const stageWidth = stage.clientWidth;
      const stageHeight = stage.clientHeight;
      const scale = Math.min(stageWidth / view.width, stageHeight / view.height);
      figure.style.width = view.width * scale + 'px';
      figure.style.aspectRatio = view.width + ' / ' + view.height;
      figure.append(canvas);
      stage.querySelector('.artwork').replaceChildren(figure);
      const viewport = page.getViewport({scale: Math.max(1, scale * Math.min(devicePixelRatio,2))});
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      canvas.setAttribute('role','img');
      canvas.setAttribute('aria-label', slide.section + ' · ' + slide.original);
      notes.then(map => {
        if (map.get(slide.original)?.title) canvas.setAttribute('aria-label',map.get(slide.original).title);
      });
      renderTask = page.render({canvasContext:canvas.getContext('2d'), viewport});
      await renderTask.promise;
      if (version !== revision) return;
      const annotations = await page.getAnnotations();
      for (const annotation of annotations) {
        if (annotation.subtype !== 'Link' || !annotation.rect) continue;
        const [x1, y1, x2, y2] = view.convertToViewportRectangle(annotation.rect);
        const a = document.createElement('a');
        Object.assign(a.style, {
          left: Math.min(x1,x2) / view.width * 100 + '%',
          top: Math.min(y1,y2) / view.height * 100 + '%',
          width: Math.abs(x2-x1) / view.width * 100 + '%',
          height: Math.abs(y2-y1) / view.height * 100 + '%'
        });
        if (annotation.url) {
          const url = courseLink(annotation.url);
          if (!['http:','https:','mailto:'].includes(url.protocol)) continue;
          a.href = url.href;
          a.target = '_blank';
          a.rel = 'noopener';
          a.title = url.hostname + url.pathname;
          a.setAttribute('aria-label','リンクを開く · ' + url.hostname);
        } else if (annotation.dest) {
          a.href = '#';
          a.setAttribute('aria-label','関連スライドへ');
          a.onclick = async event => {
            event.preventDefault();
            const dest = typeof annotation.dest === 'string' ? await doc.getDestination(annotation.dest) : annotation.dest;
            if (!dest?.length) return;
            const pageIndex = Number.isInteger(dest[0]) ? dest[0] : await doc.getPageIndex(dest[0]);
            if (originalPages.has(pageIndex + 1)) go(originalPages.get(pageIndex + 1));
          };
        } else continue;
        figure.append(a);
      }
    } catch (error) {
      if (error.name === 'RenderingCancelledException' || version !== revision) return;
      const fallback = document.createElement('a');
      fallback.href = '../week' + weekNumber + '/w' + week + '.pdf#page=' + slide.original;
      fallback.textContent = 'スライドのPDFを開く ↗';
      stage.querySelector('.artwork').replaceChildren(fallback);
    }
  }

  function renderArtwork(slide) {
    const version = ++revision;
    renderTask?.cancel();
    renderTask = null;
    const original = slide.sequence?.[step] || slide.original;
    artwork({...slide, original},version);
    notes.then(map => {
      if (version !== revision) return;
      const note = map.get(original);
      $('#notes').textContent = note?.en || note?.ja || slide.section;
      if (note?.title) stage.querySelector('canvas')?.setAttribute('aria-label',note.title);
    });
  }

  function render() {
    const slide = slides[index];
    revision++;
    renderTask?.cancel();
    renderTask = null;
    dispose();
    dispose = () => {};
    window.MathJax?.typesetClear?.([stage]);
    stage.replaceChildren();
    stage.className = slide.original ? 'art-slide' : 'native-slide ' + (slide.theme || 'light');
    step = 0;
    stepCount = 0;
    $('#notes').textContent = slide.notes || '';
    if (slide.original) {
      const frame = document.createElement('div');
      frame.className = 'artwork';
      stage.append(frame);
      stepCount = (slide.sequence?.length || 1) - 1;
      renderArtwork(slide);
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
    if (step < stepCount) {
      step++;
      if (slides[index].sequence) renderArtwork(slides[index]);
      updateReveal();
    } else if (index < slides.length - 1) go(index + 1);
  }
  function previous() {
    if (step > 0) {
      step--;
      if (slides[index].sequence) renderArtwork(slides[index]);
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
    if (slide.section === lastSection && !slide.title && !slide.challenge) return;
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
  $('#notes-toggle').onclick = toggleNotes;
  $('#fullscreen').onclick = fullscreen;
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') document.body.classList.remove('presenting');
    if (toc.open || guard.open || event.target.closest('input,select,textarea') ||
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

  new ResizeObserver(() => {
    const figure = stage.querySelector('.artwork figure');
    if (!figure) return;
    const [width,height] = figure.style.aspectRatio.split('/').map(Number);
    figure.style.width = Math.min(stage.clientWidth,stage.clientHeight * width / height) + 'px';
  }).observe(stage);
  index = Math.min(slides.length - 1, Math.max(0, parseInt(params.get('page'),10) - 1 || 0));
  const requestedSlide = slides.findIndex(slide => slide.anchor && '#'+slide.anchor === location.hash);
  if (!params.has('page') && requestedSlide >= 0) index = requestedSlide;
  render();
})();
