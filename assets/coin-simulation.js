(() => {
  const svgNS = 'http://www.w3.org/2000/svg';

  function element(name, attributes = {}, value = '') {
    const node = document.createElementNS(svgNS, name);
    Object.entries(attributes).forEach(([key, attributeValue]) => node.setAttribute(key, String(attributeValue)));
    if (value) node.textContent = value;
    return node;
  }

  function setupCoinSimulation() {
    const root = document.querySelector('[data-coin-simulation]');
    if (!root) return;

    const chart = root.querySelector('[data-coin-chart]');
    const description = root.querySelector('[data-coin-chart-desc]');
    const tossButtons = [...root.querySelectorAll('[data-toss]')];
    const resetButton = root.querySelector('[data-reset]');
    const tossCount = root.querySelector('[data-toss-count]');
    const percent = root.querySelector('[data-heads-percent]');
    const headsCount = root.querySelector('[data-heads-count]');
    const tailsCount = root.querySelector('[data-tails-count]');
    const announcement = root.querySelector('[data-coin-announcement]');
    let results = [];
    let heads = 0;
    let timer = null;

    function draw() {
      const japanese = document.documentElement.dataset.language === 'ja';
      const width = Math.max(300, Math.round(chart.parentElement.getBoundingClientRect().width));
      const height = width < 520 ? 300 : 370;
      const left = 54;
      const right = width - 22;
      const top = 20;
      const bottom = height - 48;
      const plotWidth = right - left;
      const plotHeight = bottom - top;
      const maxToss = Math.max(10, results.length);
      const x = index => left + (index / maxToss) * plotWidth;
      const y = ratio => bottom - ratio * plotHeight;
      const title = chart.querySelector('title');
      title.textContent = japanese ? '表が出た割合の推移' : 'Running percentage of heads';
      chart.setAttribute('viewBox', `0 0 ${width} ${height}`);
      chart.setAttribute('height', String(height));
      chart.replaceChildren(title, description);

      [0, 0.5, 1].forEach(level => {
        chart.append(element('line', { x1:left, y1:y(level), x2:right, y2:y(level), class:level === 0.5 ? 'coin-reference' : 'coin-grid' }));
        chart.append(element('text', { x:left - 10, y:y(level) + 4, 'text-anchor':'end', class:'coin-axis-label' }, `${Math.round(level * 100)}%`));
      });
      chart.append(element('line', { x1:left, y1:top, x2:left, y2:bottom, class:'coin-axis' }));
      chart.append(element('line', { x1:left, y1:bottom, x2:right, y2:bottom, class:'coin-axis' }));

      const tickCount = width < 520 ? 2 : 4;
      for (let tick = 0; tick <= tickCount; tick += 1) {
        const value = Math.round((maxToss * tick) / tickCount);
        if (tick && value === Math.round((maxToss * (tick - 1)) / tickCount)) continue;
        chart.append(element('text', { x:x(value), y:bottom + 20, 'text-anchor':tick === 0 ? 'start' : tick === tickCount ? 'end' : 'middle', class:'coin-axis-label' }, String(value)));
      }
      chart.append(element('text', { x:(left + right) / 2, y:height - 8, 'text-anchor':'middle', class:'coin-axis-title' }, japanese ? '投げた回数' : 'Toss number'));
      chart.append(element('text', { x:right, y:y(0.5) - 8, 'text-anchor':'end', class:'coin-reference-label' }, '50%'));

      if (results.length) {
        let runningHeads = 0;
        const points = results.map((result, index) => {
          runningHeads += result;
          return { x:x(index + 1), y:y(runningHeads / (index + 1)), result };
        });
        chart.append(element('polyline', { points:points.map(point => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(' '), class:'coin-series' }));
        const interval = Math.max(1, Math.ceil(points.length / 80));
        points.forEach((point, index) => {
          if (index % interval && index !== points.length - 1) return;
          chart.append(element('circle', { cx:point.x, cy:point.y, r:points.length > 150 ? 2.5 : 3.5, class:point.result ? 'coin-heads-point' : 'coin-tails-point' }));
        });
      }

      const tails = results.length - heads;
      tossCount.textContent = japanese ? `${results.length}回` : `${results.length} toss${results.length === 1 ? '' : 'es'}`;
      percent.textContent = results.length ? `${((heads / results.length) * 100).toFixed(1)}%` : '—';
      headsCount.textContent = japanese ? `表: ${heads}` : `Heads: ${heads}`;
      tailsCount.textContent = japanese ? `裏: ${tails}` : `Tails: ${tails}`;
      description.textContent = results.length
        ? (japanese ? `${results.length}回中、表${heads}回。表の割合は${percent.textContent}です。` : `${heads} heads in ${results.length} tosses. The running percentage is ${percent.textContent}.`)
        : (japanese ? 'まだ投げていません。基準線は50%です。' : 'No tosses yet. The reference line is 50 percent.');
    }

    function stop() {
      if (timer !== null) clearInterval(timer);
      timer = null;
      tossButtons.forEach(button => { button.disabled = false; });
    }

    function toss(amount) {
      if (timer !== null) return;
      tossButtons.forEach(button => { button.disabled = true; });
      let remaining = amount;
      const addBatch = () => {
        const batchSize = Math.min(remaining, amount === 1000 ? 10 : 1);
        for (let index = 0; index < batchSize; index += 1) {
          const result = Math.random() < 0.5 ? 1 : 0;
          results.push(result);
          heads += result;
          remaining -= 1;
        }
        draw();
        if (!remaining) {
          stop();
          announcement.textContent = description.textContent;
        }
      };
      addBatch();
      if (remaining) timer = setInterval(addBatch, 36);
    }

    tossButtons.forEach(button => button.addEventListener('click', () => toss(Number(button.dataset.toss))));
    resetButton.addEventListener('click', () => {
      stop();
      results = [];
      heads = 0;
      draw();
      announcement.textContent = description.textContent;
    });
    const resizeObserver = new ResizeObserver(() => {
      if (!root.closest('[hidden]')) draw();
    });
    resizeObserver.observe(chart.parentElement);
    new MutationObserver(() => {
      if (!root.closest('[hidden]')) {
        draw();
        if (announcement.textContent) announcement.textContent = description.textContent;
      }
    }).observe(document.documentElement, { attributes:true, attributeFilter:['data-language'] });
    root.closest('[role="tabpanel"]').parentElement.querySelector('[aria-controls="week-1-lecture-simulations"]').addEventListener('click', () => requestAnimationFrame(draw));
    draw();
  }

  document.addEventListener('statsb:agenda-rendered', setupCoinSimulation);
})();
