(() => {
  const t = (en, ja) => document.documentElement.dataset.language === 'en' ? en : ja;
  const choose = (n, k) => {
    let value = 1;
    for (let i = 1; i <= k; i += 1) value = value * (n - i + 1) / i;
    return value;
  };

  function setup() {
    const root = document.querySelector('[data-batting-simulation]');
    if (!root || root.dataset.initialized) return;
    root.dataset.initialized = 'true';

    const nInput = root.querySelector('[data-batting-n]');
    const pInput = root.querySelector('[data-batting-p]');
    const pLabel = root.querySelector('[data-batting-p-label]');
    const atBats = root.querySelector('[data-batting-atbats]');
    const gameTotal = root.querySelector('[data-batting-game-total]');
    const singleStatus = root.querySelector('[data-batting-single-status]');
    const batchStatus = root.querySelector('[data-batting-batch-status]');
    const chart = root.querySelector('[data-batting-chart]');
    const modelNote = root.querySelector('[data-batting-model-note]');
    const buttons = [...root.querySelectorAll('[data-batting-one], [data-batting-many], [data-batting-reset]')];
    let n = Number(nInput.value);
    let p = Number(pInput.value);
    let counts = Array(n + 1).fill(0);
    let games = 0;
    let busy = false;

    const wait = ms => new Promise(resolve => window.setTimeout(resolve, ms));
    const sampleGame = () => Array.from({ length: n }, () => Math.random() < p);
    const model = () => Array.from({ length: n + 1 }, (_, k) => choose(n, k) * p ** k * (1 - p) ** (n - k));

    function showAtBats(results, revealed = results.length) {
      atBats.replaceChildren(...Array.from({ length: n }, (_, index) => {
        const hit = results[index];
        const cell = document.createElement('div');
        cell.className = `batting-atbat${index < revealed ? hit ? ' is-hit' : ' is-out' : ''}`;
        cell.setAttribute('aria-label', t(`At-bat ${index + 1}${index < revealed ? hit ? ': hit' : ': out' : ': not played yet'}`, `第${index + 1}打席${index < revealed ? hit ? '：ヒット' : '：アウト' : '：これから'}`));
        cell.innerHTML = `<span class="batting-atbat-number">${String(index + 1).padStart(2, '0')}</span><strong>${index < revealed ? hit ? t('HIT', '安打') : t('OUT', '凡退') : '·'}</strong><span class="batting-ball" aria-hidden="true">${index < revealed ? hit ? '⚾' : '×' : '—'}</span>`;
        return cell;
      }));
    }

    function drawChart() {
      const expected = model();
      const maxValue = Math.max(1, ...counts, ...expected.map(probability => probability * Math.max(games, 1)));
      chart.style.setProperty('--bin-count', n + 1);
      chart.replaceChildren(...Array.from({ length: n + 1 }, (_, hits) => {
        const observed = games ? counts[hits] / games * 100 : 0;
        const expectedPercent = expected[hits] * 100;
        const bin = document.createElement('div');
        bin.className = 'batting-bin';
        bin.setAttribute('aria-label', t(`${hits} hits: observed ${observed.toFixed(1)}%; expected ${expectedPercent.toFixed(1)}%`, `安打${hits}本：実測 ${observed.toFixed(1)}%、理論値 ${expectedPercent.toFixed(1)}%`));
        const bars = document.createElement('div');
        bars.className = 'batting-bars';
        for (const [kind, value] of [['observed', counts[hits]], ['model', expected[hits] * Math.max(games, 1)]]) {
          const bar = document.createElement('span');
          bar.className = `batting-bar batting-bar-${kind}`;
          bar.style.height = `${Math.max(value ? 3 : 0, value / maxValue * 100)}%`;
          bar.title = kind === 'observed'
            ? t(`Observed: ${observed.toFixed(1)}%`, `実測：${observed.toFixed(1)}%`)
            : t(`Binomial model: ${expectedPercent.toFixed(1)}%`, `二項分布の理論値：${expectedPercent.toFixed(1)}%`);
          bars.append(bar);
        }
        const observedLabel = document.createElement('span');
        observedLabel.className = 'batting-bin-observed';
        observedLabel.textContent = `${observed.toFixed(0)}%`;
        const modelLabel = document.createElement('span');
        modelLabel.className = 'batting-bin-model';
        modelLabel.textContent = `${expectedPercent.toFixed(0)}%`;
        const label = document.createElement('strong');
        label.textContent = String(hits);
        const caption = document.createElement('small');
        caption.textContent = t('hits', '安打');
        bin.append(observedLabel, bars, label, caption, modelLabel);
        return bin;
      }));
      batchStatus.textContent = games
        ? t(`${games.toLocaleString()} games · observed bars update as results accumulate`, `${games.toLocaleString()}試合 · 実測値は試行とともに更新`)
        : t('Run games to compare observed and expected results.', '試合を実行して、実測と理論値を比べよう。');
      const mean = n * p;
      modelNote.textContent = t(
        `Model: X ~ Binomial(n = ${n}, p = ${p.toFixed(2)}). Expected hits per game: E[X] = np = ${mean.toFixed(2)}.`,
        `モデル：X ~ Binomial(n = ${n}, p = ${p.toFixed(2)})。1試合あたりの期待安打数：E[X] = np = ${mean.toFixed(2)}本。`
      );
    }

    function updateRate() {
      p = Number(pInput.value);
      pLabel.value = `${Math.round(p * 100)}%`;
      pLabel.textContent = `${Math.round(p * 100)}%`;
    }

    function setBusy(value) {
      busy = value;
      buttons.forEach(button => { button.disabled = value; });
      nInput.disabled = value;
      pInput.disabled = value;
    }

    function clear() {
      if (busy) return;
      counts = Array(n + 1).fill(0);
      games = 0;
      atBats.replaceChildren();
      gameTotal.textContent = '';
      singleStatus.textContent = t('Ready when you are.', '準備ができたら始めよう。');
      drawChart();
    }

    async function playOne() {
      if (busy) return;
      setBusy(true);
      const result = sampleGame();
      showAtBats(result, 0);
      gameTotal.textContent = '';
      singleStatus.textContent = t('The next pitch…', '次の投球…');
      for (let index = 0; index < result.length; index += 1) {
        await wait(360);
        showAtBats(result, index + 1);
        singleStatus.textContent = t(`At-bat ${index + 1} of ${n}`, `${index + 1} / ${n} 打席目`);
      }
      const hits = result.filter(Boolean).length;
      counts[hits] += 1;
      games += 1;
      gameTotal.textContent = t(`${hits} hit${hits === 1 ? '' : 's'} in ${n} at-bats`, `${n}打数 ${hits}安打`);
      singleStatus.textContent = t('Game over', '試合終了');
      drawChart();
      setBusy(false);
    }

    async function playBatch() {
      if (busy) return;
      setBusy(true);
      const target = games + 500;
      batchStatus.textContent = t('Play ball! Simulating 500 games…', 'プレイボール！500試合をシミュレーション中…');
      while (games < target) {
        const chunkEnd = Math.min(target, games + 25);
        while (games < chunkEnd) {
          const hits = sampleGame().filter(Boolean).length;
          counts[hits] += 1;
          games += 1;
        }
        drawChart();
        await wait(45);
      }
      batchStatus.textContent = t(`${games.toLocaleString()} games played · compare the bars`, `${games.toLocaleString()}試合完了 · 2つの棒を比べよう`);
      setBusy(false);
    }

    nInput.addEventListener('change', () => {
      n = Number(nInput.value);
      clear();
      showAtBats([]);
    });
    pInput.addEventListener('input', () => {
      updateRate();
      clear();
    });
    root.querySelector('[data-batting-one]').addEventListener('click', playOne);
    root.querySelector('[data-batting-many]').addEventListener('click', playBatch);
    root.querySelector('[data-batting-reset]').addEventListener('click', clear);
    new MutationObserver(() => {
      drawChart();
      singleStatus.textContent = games ? t('Game over', '試合終了') : t('Ready when you are.', '準備ができたら始めよう。');
    }).observe(document.documentElement, { attributes:true, attributeFilter:['data-language'] });
    updateRate();
    showAtBats([]);
    drawChart();
  }

  document.addEventListener('statsb:agenda-rendered', setup);
  setup();
})();
