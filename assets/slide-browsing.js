(() => {
  // Deliberate horizontal swipes only: leave taps, scrolling and pinch zoom alone.
  window.bindSlideSwipe = (surface, previous, next) => {
    let start = null, ignoreClickUntil = 0;
    surface.addEventListener('touchstart', event => {
      start = event.touches.length === 1 ? {
        x: event.touches[0].clientX, y: event.touches[0].clientY, time: Date.now()
      } : null;
    }, { passive: true });
    surface.addEventListener('touchmove', event => {
      if (event.touches.length !== 1) start = null;
    }, { passive: true });
    surface.addEventListener('touchcancel', () => { start = null; }, { passive: true });
    surface.addEventListener('touchend', event => {
      const origin = start;
      start = null;
      if (!origin || event.touches.length || event.changedTouches.length !== 1) return;
      const dx = event.changedTouches[0].clientX - origin.x;
      const dy = event.changedTouches[0].clientY - origin.y;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5 || Date.now() - origin.time > 1000) return;
      ignoreClickUntil = Date.now() + 400;
      (dx < 0 ? next : previous)();
    }, { passive: true });
    surface.addEventListener('click', event => {
      if (Date.now() < ignoreClickUntil) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
  };

  const documents = new Map();
  function loadPdf(path) {
    if (!documents.has(path)) {
      documents.set(path, (async () => {
        if (!window.pdfjsLib) throw new Error('PDF renderer unavailable');
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/vendor/pdfjs/pdf.worker.min.js?v=3.11.174';
        const response = await fetch(new URL(encodeURI(path), location.href), { cache: 'no-cache' });
        if (!response.ok) throw new Error('PDF unavailable');
        return pdfjsLib.getDocument({ data: await response.arrayBuffer() }).promise;
      })().catch(error => { documents.delete(path); throw error; }));
    }
    return documents.get(path);
  }

  function init(card) {
    if (card.dataset.browsingReady) return;
    card.dataset.browsingReady = 'true';
    const cover = card.querySelector('.slide-cover');
    const canvas = card.querySelector('[data-slide-canvas]');
    const image = cover.querySelector('img');
    const previous = card.querySelector('[data-slide-previous]');
    const next = card.querySelector('[data-slide-next]');
    const status = card.querySelector('[data-slide-status]');
    const links = [cover, card.querySelector('.slide-preview-button')].filter(Boolean);
    let pageNumber = 1, total = 0, busy = false;
    const sync = () => {
      previous.disabled = busy || pageNumber === 1;
      next.disabled = busy || (total > 0 && pageNumber === total);
      status.textContent = total ? `${pageNumber} / ${total}` : String(pageNumber);
      cover.setAttribute('aria-busy', String(busy));
      links.forEach(link => {
        const url = new URL(link.href, location.href);
        url.searchParams.set('page', String(pageNumber));
        link.href = url.href;
      });
    };
    async function showPage(delta) {
      if (busy || (delta < 0 && pageNumber === 1) || (delta > 0 && total && pageNumber === total)) return;
      busy = true;
      sync();
      try {
        const pdf = await loadPdf(card.dataset.slidePdf);
        total = pdf.numPages;
        const target = Math.max(1, Math.min(total, pageNumber + delta));
        const page = await pdf.getPage(target);
        const base = page.getViewport({ scale: 1 });
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        const viewport = page.getViewport({ scale: Math.min(2, Math.max(300, cover.clientWidth) * pixelRatio / base.width) });
        // Render offscreen so a slow render never exposes a partially drawn slide.
        const buffer = document.createElement('canvas');
        buffer.width = Math.ceil(viewport.width);
        buffer.height = Math.ceil(viewport.height);
        await page.render({ canvasContext: buffer.getContext('2d'), viewport }).promise;
        canvas.width = buffer.width;
        canvas.height = buffer.height;
        canvas.getContext('2d').drawImage(buffer, 0, 0);
        canvas.hidden = false;
        if (image) image.hidden = true;
        cover.querySelector('[data-slide-placeholder]')?.remove();
        canvas.setAttribute('aria-label', `${card.dataset.slideTitle} · ${target} / ${total}`);
        pageNumber = target;
      } catch (error) {
        console.error('Slide thumbnail preview failed:', error);
        status.textContent = document.documentElement.dataset.language === 'en' ? 'Open preview' : 'プレビューを開く';
      } finally {
        busy = false;
        const failed = status.textContent === 'Open preview' || status.textContent === 'プレビューを開く';
        sync();
        if (failed) status.textContent = document.documentElement.dataset.language === 'en' ? 'Open preview' : 'プレビューを開く';
      }
    }
    previous.addEventListener('click', () => showPage(-1));
    next.addEventListener('click', () => showPage(1));
    window.bindSlideSwipe(cover, () => showPage(-1), () => showPage(1));
    card.addEventListener('keydown', event => {
      if (event.altKey || event.ctrlKey || event.metaKey || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      showPage(event.key === 'ArrowLeft' ? -1 : 1);
    });
    sync();
    // Preserve the fast static cover; only fetch a full deck when someone browses it.
    if (!image) {
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          observer.disconnect();
          showPage(0);
        }
      });
      observer.observe(cover);
    }
  }
  const scan = () => document.querySelectorAll('[data-slide-pdf]').forEach(init);
  document.addEventListener('statsb:agenda-rendered', scan);
  scan();
})();
