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
    const xInput = root.querySelector('[data-batting-x]');
    const pInput = root.querySelector('[data-batting-p]');
    const pLabel = root.querySelector('[data-batting-p-label]');
    const atBats = root.querySelector('[data-batting-atbats]');
    const gameTotal = root.querySelector('[data-batting-game-total]');
    const singleStatus = root.querySelector('[data-batting-single-status]');
    const batchStatus = root.querySelector('[data-batting-batch-status]');
    const chart = root.querySelector('[data-batting-chart]');
    const modelNote = root.querySelector('[data-batting-model-note]');
    const equation = root.querySelector('[data-batting-equation]');
    const formulaResult = root.querySelector('[data-batting-formula-result]');
    const answerCaption = root.querySelector('[data-batting-answer-caption]');
    const patternsOutput = root.querySelector('[data-batting-patterns]');
    const singlePatternOutput = root.querySelector('[data-batting-single-pattern]');
    const patternExample = root.querySelector('[data-batting-pattern-example]');
    const totalOutput = root.querySelector('[data-batting-total]');
    const mascot = root.querySelector('[data-batting-mascot]');
    const buttons = [...root.querySelectorAll('[data-batting-one], [data-batting-many], [data-batting-reset]')];
    let n = Number(nInput.value);
    let p = Number(pInput.value);
    let x = 2;
    let counts = Array(n + 1).fill(0);
    let games = 0;
    let busy = false;
    let runToken = 0;

    // Preserve finished math while the shared renderer prepares its replacement.
    function inlineMath(target, source, fallback) {
      if (target.dataset.inlineMath === source) return;
      if (!target.hasChildNodes()) target.textContent = fallback;
      delete target.dataset.mathReady;
      target.dataset.inlineMath = source;
    }
    root.querySelectorAll('i').forEach(node => {
      const symbol = node.textContent.trim();
      if (['n','x','X','π'].includes(symbol)) inlineMath(node, symbol === 'π' ? String.raw`\pi` : symbol, symbol);
    });

    const wait = ms => new Promise(resolve => window.setTimeout(resolve, ms));
    const sampleGame = () => Array.from({ length: n }, () => Math.random() < p);
    const model = () => Array.from({ length: n + 1 }, (_, k) => choose(n, k) * p ** k * (1 - p) ** (n - k));

    function updateCalculation() {
      const probability = choose(n, x) * p ** x * (1 - p) ** (n - x);
      xInput.value = String(x);
      const remaining = n - x;
      const patterns = choose(n, x);
      const onePattern = p ** x * (1 - p) ** remaining;
      const percent = probability * 100;
      formulaResult.textContent = `${percent.toFixed(1)}%`;
      answerCaption.textContent = t(`exactly ${x} hit${x === 1 ? '' : 's'} in ${n} at-bats`, `${n}打席でちょうど${x}本の安打`);
      inlineMath(patternsOutput, String.raw`{}_{${n}}C_{${x}}=${patterns}\;\text{${t('orders','通り')}}`, `${n}C${x} = ${patterns}`);
      inlineMath(singlePatternOutput, String.raw`\begin{gathered}(${p.toFixed(2)})^{${x}}(${(1-p).toFixed(2)})^{${remaining}}\\\approx ${onePattern.toFixed(4)}\end{gathered}`, `${p.toFixed(2)}^${x} × ${(1-p).toFixed(2)}^${remaining} ≈ ${onePattern.toFixed(4)}`);
      inlineMath(totalOutput, String.raw`\begin{gathered}${patterns}\times(${p.toFixed(2)})^{${x}}(${(1-p).toFixed(2)})^{${remaining}}\\\approx ${probability.toFixed(4)}\approx ${percent.toFixed(2)}\%\end{gathered}`, `${patterns} × ${onePattern.toFixed(4)} ≈ ${percent.toFixed(2)}%`);
      patternExample.replaceChildren(...Array.from({ length:n }, (_, index) => {
        const token = document.createElement('span');
        const hit = index < x;
        token.className = `batting-pattern-token${hit ? ' is-hit' : ''}`;
        token.textContent = hit ? '⚾' : '×';
        token.setAttribute('aria-label', hit ? t('hit','安打') : t('out','アウト'));
        return token;
      }));
      chart.setAttribute('aria-label', t(`Observed and predicted share of games with exactly 0 to ${n} hits`, `安打0〜${n}本ごとの試合の割合：実測と予測`));
    }

    function typesetStaticFormula() {
      const revealFallback = () => {
        if (!equation.querySelector('mjx-container')) equation.textContent = 'Pr(X = x) = nCₓ × πˣ × (1 − π)ⁿ⁻ˣ';
        equation.classList.add('is-typeset');
      };
      const render = () => {
        const math = window.MathJax;
        if (!math?.typesetPromise) { revealFallback(); return; }
        Promise.resolve(math.startup?.promise).then(() => math.typesetPromise([equation]))
          .then(() => equation.classList.add('is-typeset'))
          .catch(revealFallback);
      };
      if (window.MathJax?.typesetPromise) render();
      else {
        const script = document.querySelector('script[src*="mathjax"]');
        if (!script) { revealFallback(); return; }
        script.addEventListener('load', render, { once:true });
        script.addEventListener('error', revealFallback, { once:true });
        window.setTimeout(() => { if (!equation.classList.contains('is-typeset')) revealFallback(); }, 5000);
      }
    }

    function fillHitChoices() {
      const previous = Math.min(x, n);
      x = previous;
      xInput.replaceChildren(...Array.from({ length: n + 1 }, (_, value) => {
        const option = document.createElement('option');
        option.value = String(value);
        option.textContent = `${value}`;
        option.selected = value === x;
        return option;
      }));
    }

    async function swing(outcome, rapid = false, own = runToken) {
      if (!mascot) return true;
      mascot.dataset.swing = 'windup';
      await wait(rapid ? 12 : 95);
      if (own !== runToken) return false;
      mascot.dataset.swing = 'swing';
      await wait(rapid ? 24 : 190);
      if (own !== runToken) return false;
      mascot.dataset.swing = outcome ? 'hit' : 'miss';
      await wait(rapid ? 12 : 100);
      return own === runToken;
    }

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
        observedLabel.textContent = games ? `${observed.toFixed(1)}%` : '—';
        observedLabel.title = t(`Simulated results: ${counts[hits]} of ${games} games`, `シミュレーション結果：${games}試合中${counts[hits]}試合`);
        const modelLabel = document.createElement('span');
        modelLabel.className = 'batting-bin-model';
        modelLabel.textContent = `${expectedPercent.toFixed(1)}%`;
        modelLabel.title = t('Formula prediction', '公式から計算した確率');
        const percentages = document.createElement('div');
        percentages.className = 'batting-bin-percentages';
        percentages.append(observedLabel, modelLabel);
        const label = document.createElement('strong');
        label.textContent = String(hits);
        const caption = document.createElement('small');
        caption.textContent = t('hits', '安打');
        bin.append(bars, percentages, label, caption);
        return bin;
      }));
      batchStatus.textContent = games
        ? t(`${games.toLocaleString()} games · compare actual vs predicted for ${x} hits`, `${games.toLocaleString()}試合完了 · ${x}本の実測と予測を比べる`)
        : t(`Run games to compare actual vs predicted for ${x} hits.`, `試合を実行して、安打${x}本の実測と予測を比べる。`);
      modelNote.textContent = games
        ? t(`${counts[x]} of ${games} games had exactly ${x} hits (${(counts[x] / games * 100).toFixed(1)}%). Formula prediction: ${(expected[x] * 100).toFixed(1)}%.`, `${games}試合中、ちょうど${x}本は${counts[x]}試合（${(counts[x] / games * 100).toFixed(1)}％）。公式の予測は${(expected[x] * 100).toFixed(1)}％。`)
        : t('Compare the actual share of games with the chance calculated by the formula.', '実際にその安打数になった試合の割合と、公式から計算した確率を比べます。');
      updateCalculation();
    }

    function updateRate() {
      p = Number(pInput.value);
      pLabel.value = `${Math.round(p * 100)}%`;
      pLabel.textContent = `${Math.round(p * 100)}%`;
    }

    function setBusy(value) {
      busy = value;
      buttons.forEach(button => { button.disabled = value && !button.hasAttribute('data-batting-reset'); });
      nInput.disabled = value;
      pInput.disabled = value;
    }

    function clear() {
      runToken++;
      setBusy(false);
      if (mascot) {mascot.dataset.swing = 'idle';delete mascot.dataset.rapid;}
      counts = Array(n + 1).fill(0);
      games = 0;
      atBats.replaceChildren();
      gameTotal.textContent = '';
      singleStatus.textContent = t('Ready when you are.', '準備ができたら始めよう。');
      drawChart();
    }

    async function playOne() {
      if (busy) return;
      const own = ++runToken;
      setBusy(true);
      const result = sampleGame();
      showAtBats(result, 0);
      gameTotal.textContent = '';
      singleStatus.textContent = t('The next pitch…', '次の投球…');
      for (let index = 0; index < result.length; index += 1) {
        if (!await swing(result[index], false, own)) return;
        await wait(120);
        if (own !== runToken) return;
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

    async function playBatch(amount) {
      if (busy) return;
      const own = ++runToken;
      setBusy(true);
      const target = games + amount;
      if (mascot) mascot.dataset.rapid = 'true';
      singleStatus.textContent = t('Rapid replay · last at-bat of each game', '高速再生 · 各試合の最後の打席');
      batchStatus.textContent = t(`Play ball! Simulating ${amount} games…`, `プレイボール！${amount}試合をシミュレーション中…`);
      while (games < target) {
        const result = sampleGame();
        showAtBats(result);
        if (!await swing(result[result.length-1], true, own)) return;
        const hits = result.filter(Boolean).length;
        counts[hits] += 1;
        games += 1;
        gameTotal.textContent = t(`Game ${games.toLocaleString()} · ${hits} hits in ${n} at-bats`, `${games.toLocaleString()}試合目 · ${n}打数 ${hits}安打`);
        drawChart();
      }
      if (mascot) delete mascot.dataset.rapid;
      singleStatus.textContent = t('Rapid replay complete', '高速再生が完了');
      batchStatus.textContent = t(`${games.toLocaleString()} games played · compare actual vs predicted for ${x} hits`, `${games.toLocaleString()}試合完了 · ${x}本の実測と予測を比べる`);
      setBusy(false);
    }

    nInput.addEventListener('change', () => {
      n = Number(nInput.value);
      fillHitChoices();
      clear();
      showAtBats([]);
    });
    xInput.addEventListener('change', () => { x = Number(xInput.value); drawChart(); });
    pInput.addEventListener('input', () => {
      updateRate();
      clear();
    });
    root.querySelector('[data-batting-one]').addEventListener('click', playOne);
    root.querySelectorAll('[data-batting-many]').forEach(button => button.addEventListener('click', () => playBatch(Number(button.dataset.battingMany) || 500)));
    root.querySelector('[data-batting-reset]').addEventListener('click', clear);
    new MutationObserver(() => {
      drawChart();
      singleStatus.textContent = games ? t('Game over', '試合終了') : t('Ready when you are.', '準備ができたら始めよう。');
    }).observe(document.documentElement, { attributes:true, attributeFilter:['data-language'] });
    updateRate();
    fillHitChoices();
    showAtBats([]);
    drawChart();
    typesetStaticFormula();
  }

  document.addEventListener('statsb:agenda-rendered', setup);
  setup();
})();
