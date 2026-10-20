// Public course UI requires ?p. This is a visibility gate, not authentication.
// PDFs, source files and other static assets remain publicly addressable.
(() => {
  const url = new URL(location.href);
  const local = url.protocol === 'file:' || ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (!local && !url.searchParams.has('p')) {
    document.documentElement.style.visibility = 'hidden';
    location.replace(new URL('../unavailable.html', document.currentScript.src).href);
    return;
  }
  if (!url.searchParams.has('p')) return;
  const courseRoot = new URL('../', document.currentScript.src);
  const withPreview = value => {
    const target = new URL(value, url);
    if (target.origin !== courseRoot.origin || !target.pathname.startsWith(courseRoot.pathname)) return null;
    if (!target.pathname.endsWith('.html') && !target.pathname.endsWith('/')) return null;
    if (target.pathname.endsWith('/unavailable.html')) return null;
    target.searchParams.set('p', '');
    // Back buttons in the viewer also retain preview mode.
    if (target.searchParams.has('return')) {
      const back = withPreview(target.searchParams.get('return'));
      if (back) target.searchParams.set('return', back);
    }
    return target.href;
  };
  const updateLinks = root => {
    const links = [...(root.matches?.('a[href]') ? [root] : []), ...root.querySelectorAll('a[href]')];
    for (const link of links) {
      const raw = link.getAttribute('href');
      if (!raw || raw.startsWith('#') || link.hasAttribute('download')) continue;
      const next = withPreview(raw);
      if (next && next !== link.href) link.setAttribute('href', next);
    }
  };
  document.addEventListener('DOMContentLoaded', () => {
    updateLinks(document);
    new MutationObserver(records => {
      for (const record of records) {
        if (record.type === 'attributes') updateLinks(record.target);
        else for (const node of record.addedNodes) if (node.nodeType === 1) updateLinks(node);
      }
    }).observe(document.body, {childList: true, subtree: true, attributes: true, attributeFilter: ['href']});
  });
})();
