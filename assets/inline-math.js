(() => {
  // Preserve readable fallback text until finished inline math can replace it.
  const cache = new Map();
  async function render() {
    const math = window.MathJax;
    if (!math?.tex2chtmlPromise) return;
    await math.startup.promise;
    const targets = [...document.querySelectorAll('[data-inline-math]:not([data-math-ready])')];
    await Promise.all(targets.map(async target => {
      target.dataset.mathReady = 'pending';
      const source = target.dataset.inlineMath;
      try {
        if (!cache.has(source)) cache.set(source, math.tex2chtmlPromise(source, {display:false}));
        const node = await cache.get(source);
        if (!target.isConnected) return;
        target.replaceChildren(node.cloneNode(true));
        target.dataset.mathReady = 'true';
      } catch {
        cache.delete(source);
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
    if (records.some(record => [...record.addedNodes].some(node => node.nodeType === 1 &&
      (node.matches('[data-inline-math]:not([data-math-ready])') || node.querySelector('[data-inline-math]:not([data-math-ready])'))))) schedule();
  }).observe(document.body,{childList:true,subtree:true});
  document.querySelector('script[src*="mathjax"]')?.addEventListener('load',schedule);
  document.addEventListener('statsb:agenda-rendered',schedule);
  schedule();
})();
