(() => {
  const formulaSelectors = '.example-formula-card, .example-pairs .example-formula, .roulette-formula, .combination-equation-copy, .batting-formula-main, .week2-equation-card, .week2-model-formula, .distribution-formula, .al-formula-focus, .al-area-card [data-al-density-rule], .al-area-card [data-al-weighted-rule], .al-exact-grid > div, .event-answer-card, .test-math';
  function arrange() {
    document.querySelectorAll('[data-example-lab]').forEach(root => {
      if (!root.querySelector('.example-details') || root.dataset.cardLayout) return;
      root.dataset.cardLayout = 'true';
      const formula = document.createElement('section');
      formula.className = 'example-formula-card';
      formula.append(root.querySelector('[data-example-formula]'), root.querySelector('[data-example-variance]'));
      root.querySelector('.example-layout').before(formula);
      root.querySelector('.example-layout > div:first-child').classList.add('activity-control-card');
    });
    document.querySelectorAll('[data-al-expectation="discrete"]').forEach(root => {
      if (root.dataset.cardLayout) return;
      root.dataset.cardLayout = 'true';
      const formula = root.querySelector('.al-formula-focus');
      root.querySelector('.al-discrete-layout').before(formula);
      root.querySelector('.al-table-wrap').append(root.querySelector('.al-actions'), root.querySelector('.al-sample-strip'));
    });
    document.querySelectorAll(formulaSelectors).forEach(card => {
      card.classList.add('activity-formula-card');
      if (card.querySelector(':scope > .activity-formula-label')) return;
      const label = document.createElement('span');
      label.className = 'activity-formula-label';
      label.innerHTML = '<span class="lang-en">FORMULA</span><span class="lang-ja" lang="ja">公式</span>';
      card.prepend(label);
    });
  }
  let queued = false;
  function schedule() { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; arrange(); }); }
  document.addEventListener('statsb:agenda-rendered', schedule);
  new MutationObserver(schedule).observe(document.querySelector('[data-agenda]'), {childList:true,subtree:true});
  schedule();
})();
