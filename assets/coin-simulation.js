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
    if (!root || root.dataset.coinInitialized) return;
    root.dataset.coinInitialized = 'true';

    const chart = root.querySelector('[data-coin-chart]');
    const description = root.querySelector('[data-coin-chart-desc]');
    const tossButtons = [...root.querySelectorAll('[data-toss]')];
    const resetButton = root.querySelector('[data-reset]');
    const tossCount = root.querySelector('[data-toss-count]');
    const percent = root.querySelector('[data-heads-percent]');
    const headsCount = root.querySelector('[data-heads-count]');
    const tailsCount = root.querySelector('[data-tails-count]');
    const announcement = root.querySelector('[data-coin-announcement]');
    const demo = root.querySelector('[data-coin-demo]');
    const disc = root.querySelector('[data-coin-disc]');
    const headFace = root.querySelector('[data-coin-head-face]');
    const resultLabel = root.querySelector('[data-coin-result]');
    const progress = root.querySelector('[data-coin-progress]');
    const recent = root.querySelector('[data-coin-recent]');
    const sideKey = root.querySelector('[data-coin-side-key]');
    headFace.innerHTML = window.statsbMontyCharacters.robot;
    root.querySelector('[data-coin-tail-face]').innerHTML = window.statsbMontyCharacters.goat;
    let results = [];
    let heads = 0;
    let timer = null;
    let animation = null;
    let busy = false;
    let batchAmount = 0;
    let batchCompleted = 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function setFace(result) {
      headFace.innerHTML = result ? window.statsbMontyCharacters.robot : window.statsbMontyCharacters.goat;
      disc.style.transform = 'rotateY(0deg)';
      demo.dataset.state = result ? 'heads' : 'tails';
      const japanese = document.documentElement.dataset.language === 'ja';
      resultLabel.textContent = result ? (japanese ? '表！ ロボット' : 'Heads! Robot') : (japanese ? '裏！ ヤギ' : 'Tails! Goat');
      demo.setAttribute('aria-label', resultLabel.textContent);
    }

    function spinTo(result, duration, done) {
      headFace.innerHTML = window.statsbMontyCharacters.robot;
      demo.dataset.state = 'flipping';
      resultLabel.textContent = document.documentElement.dataset.language === 'ja' ? '回転中…' : 'Spinning…';
      demo.setAttribute('aria-label', resultLabel.textContent);
      if (reducedMotion) {
        setFace(result);
        done();
        return;
      }
      animation = disc.animate([
        { transform:'rotateY(0deg)' },
        { transform:'rotateY(1440deg)' }
      ], { duration, easing:'cubic-bezier(.18,.72,.24,1)', fill:'forwards' });
      animation.onfinish = () => {
        setFace(result);
        animation.cancel();
        animation = null;
        done();
      };
    }

    function addResult(result) {
      results.push(result);
      heads += result;
      draw();
      drawRecent();
    }

    function drawRecent() {
      const japanese = document.documentElement.dataset.language === 'ja';
      recent.replaceChildren(...results.slice(-10).map(result => {
        const item = document.createElement('span');
        item.className = result ? 'coin-recent-heads' : 'coin-recent-tails';
        item.textContent = result ? (japanese ? '表' : 'H') : (japanese ? '裏' : 'T');
        return item;
      }));
    }

    function drawProgress() {
      const japanese = document.documentElement.dataset.language === 'ja';
      progress.textContent = batchAmount ? (japanese ? `${batchCompleted} / ${batchAmount}回` : `${batchCompleted} / ${batchAmount} tosses`) : '';
    }

    function updateReadout() {
      const japanese = document.documentElement.dataset.language === 'ja';
      const tails = results.length - heads;
      tossCount.textContent = japanese ? `${results.length}回` : `${results.length} toss${results.length === 1 ? '' : 'es'}`;
      percent.textContent = results.length ? `${((heads / results.length) * 100).toFixed(1)}%` : '—';
      headsCount.textContent = japanese ? `表: ${heads}` : `Heads: ${heads}`;
      tailsCount.textContent = japanese ? `裏: ${tails}` : `Tails: ${tails}`;
      description.textContent = results.length
        ? (japanese ? `${results.length}回中、表${heads}回。表の割合は${percent.textContent}です。` : `${heads} heads in ${results.length} tosses. The running percentage is ${percent.textContent}.`)
        : (japanese ? 'まだ投げていません。基準線は50%です。' : 'No tosses yet. The reference line is 50 percent.');
    }

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

      updateReadout();
    }

    function stop() {
      if (timer !== null) clearInterval(timer);
      timer = null;
      if (animation) animation.cancel();
      animation = null;
      busy = false;
      tossButtons.forEach(button => { button.disabled = false; });
    }

    function toss(amount) {
      if (busy) return;
      busy = true;
      tossButtons.forEach(button => { button.disabled = true; });
      if (amount === 1) {
        batchAmount = 0;
        batchCompleted = 0;
        drawProgress();
        const result = Math.random() < 0.5 ? 1 : 0;
        spinTo(result, 1050, () => {
          addResult(result);
          stop();
          announcement.textContent = description.textContent;
        });
        return;
      }
      batchAmount = amount;
      batchCompleted = 0;
      drawProgress();
      let remaining = amount;
      const delay = amount === 10 ? 220 : amount === 100 ? 60 : 16;
      const addBatch = () => {
        const result = Math.random() < 0.5 ? 1 : 0;
        results.push(result);
        heads += result;
        remaining -= 1;
        batchCompleted += 1;
        setFace(result);
        drawProgress();
        drawRecent();
        if (animation) animation.cancel();
        if (!reducedMotion) {
          animation = disc.animate([
            { transform:'rotateY(-85deg) scale(.9)' },
            { transform:'rotateY(0deg) scale(1)' }
          ], { duration:Math.min(delay, 180), easing:'ease-out' });
        }
        if (amount === 1000 && remaining % 5 !== 0 && remaining !== 0) updateReadout();
        else draw();
        if (!remaining) {
          stop();
          announcement.textContent = description.textContent;
        }
      };
      timer = setInterval(addBatch, delay);
    }

    tossButtons.forEach(button => button.addEventListener('click', () => toss(Number(button.dataset.toss))));
    resetButton.addEventListener('click', () => {
      stop();
      results = [];
      heads = 0;
      batchAmount = 0;
      batchCompleted = 0;
      drawProgress();
      drawRecent();
      headFace.innerHTML = window.statsbMontyCharacters.robot;
      disc.style.transform = 'rotateY(0deg)';
      demo.dataset.state = 'ready';
      resultLabel.textContent = document.documentElement.dataset.language === 'ja' ? '投げてみよう' : 'Ready to toss';
      demo.setAttribute('aria-label', resultLabel.textContent);
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
        drawRecent();
        drawProgress();
        const japanese = document.documentElement.dataset.language === 'ja';
        root.querySelector('.coin-controls').setAttribute('aria-label', japanese ? 'コイン投げの操作' : 'Coin toss controls');
        sideKey.textContent = japanese ? 'ロボット＝表 · ヤギ＝裏' : 'Robot = heads · Goat = tails';
        if (demo.dataset.state === 'ready') resultLabel.textContent = japanese ? '投げてみよう' : 'Ready to toss';
        else if (demo.dataset.state === 'flipping') resultLabel.textContent = japanese ? '回転中…' : 'Spinning…';
        else resultLabel.textContent = demo.dataset.state === 'heads' ? (japanese ? '表！ ロボット' : 'Heads! Robot') : (japanese ? '裏！ ヤギ' : 'Tails! Goat');
        demo.setAttribute('aria-label', resultLabel.textContent);
        if (announcement.textContent) announcement.textContent = description.textContent;
      }
    }).observe(document.documentElement, { attributes:true, attributeFilter:['data-language'] });
    document.getElementById('week-1-coin-tab')?.addEventListener('click', () => requestAnimationFrame(() => {
      draw();
      demo.setAttribute('aria-label', demo.dataset.state === 'ready' ? (document.documentElement.dataset.language === 'ja' ? '投げてみよう' : 'Ready to toss') : resultLabel.textContent);
    }));
    draw();
    root.querySelector('.coin-controls').setAttribute('aria-label', document.documentElement.dataset.language === 'ja' ? 'コイン投げの操作' : 'Coin toss controls');
    demo.setAttribute('aria-label', document.documentElement.dataset.language === 'ja' ? '投げてみよう' : 'Ready to toss');
  }

  document.addEventListener('statsb:agenda-rendered', setupCoinSimulation);
  setupCoinSimulation();
})();
