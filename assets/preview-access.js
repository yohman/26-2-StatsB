// Public pages stay accessible. ?p enables the agenda's all-weeks preview.
// This is a publishing convenience, not authentication.
(() => {
  const url = new URL(location.href);
  if (!url.searchParams.has('p')) return;
  const courseRoot = new URL('../', document.currentScript.src);
  const withPreview = value => {
    const target = new URL(value, url);
    if (target.origin !== courseRoot.origin || !target.pathname.startsWith(courseRoot.pathname)) return null;
    if (!target.pathname.endsWith('.html') && !target.pathname.endsWith('/')) return null;
    if (target.pathname.endsWith('/unavailable.html')) return null;
    target.searchParams.set('p', '');
    if (url.searchParams.get('preview') === 'all') target.searchParams.set('preview', 'all');
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
