(() => {
  // Preserve readable fallback text until finished inline math can replace it.
  const cache = new Map();
  async function render() {
    const math = window.MathJax;
    if (!math?.tex2chtmlPromise) return;
    await math.startup.promise;
    const targets = [...document.querySelectorAll('[data-inline-math]:not([data-math-ready]), [data-display-math]:not([data-math-ready])')];
    await Promise.all(targets.map(async target => {
      target.dataset.mathReady = 'pending';
      const source = target.dataset.inlineMath ?? target.dataset.displayMath;
      const display = target.hasAttribute('data-display-math');
      const key = `${display}:${source}`;
      try {
        if (!cache.has(key)) cache.set(key, math.tex2chtmlPromise(source, {display}));
        const node = await cache.get(key);
        if (!target.isConnected || (target.dataset.inlineMath ?? target.dataset.displayMath) !== source) return;
        target.replaceChildren(node.cloneNode(true));
        target.dataset.mathReady = 'true';
      } catch {
        cache.delete(key);
        delete target.dataset.mathReady;
      }
    }));
    if (targets.length) {math.startup.document.reset();math.startup.document.updateDocument();}
  }
  let queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {queued = false;render();});
  }
  new MutationObserver(records => {
    const selector = '[data-inline-math]:not([data-math-ready]), [data-display-math]:not([data-math-ready])';
    if (records.some(record => record.type === 'attributes' || [...record.addedNodes].some(node => node.nodeType === 1 &&
      (node.matches(selector) || node.querySelector(selector))))) schedule();
  }).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['data-inline-math','data-display-math']});
  document.querySelector('script[src*="mathjax"]')?.addEventListener('load',schedule);
  document.addEventListener('statsb:agenda-rendered',schedule);
  schedule();
})();
