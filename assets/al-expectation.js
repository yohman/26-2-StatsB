(() => {
  const t = (en, ja) => document.documentElement.dataset.language === 'en' ? en : ja;
  // Source: the student Week 2 AL worksheet, B5:C10. Ticket weights are exact twelfths.
  const values = [-1, 0, 1, 2, 3, 4];
  const weights = [3, 1, 2, 1, 1, 4];
  const fractions = ['1/4', '1/12', '1/6', '1/12', '1/12', '1/3'];
  const fractionTex = ['\\frac14', '\\frac1{12}', '\\frac16', '\\frac1{12}', '\\frac1{12}', '\\frac13'];
  const mean = values.reduce((sum, x, i) => sum + x * weights[i] / 12, 0);
  const a = Math.sqrt(2);
  const exactContinuousMean = 2 * a / 3;
  const timers = new WeakMap();
  const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

  function math(element, source, fallback) {
    element.dataset.mathSource = source;
    if (!element.querySelector('mjx-container')) element.textContent = fallback;
    clearTimeout(timers.get(element));
    timers.set(element, setTimeout(async () => {
      const mj = window.MathJax;
      if (!mj?.tex2chtmlPromise) return;
      try {
        await mj.startup.promise;
        if (element.dataset.mathSource !== source) return;
        const node = await mj.tex2chtmlPromise(source, { display: true });
        if (element.dataset.mathSource !== source) return;
        element.replaceChildren(node);
        element.dataset.renderedSource = source;
        mj.startup.document.reset();
        mj.startup.document.updateDocument();
      } catch {
        if (element.dataset.mathSource === source) element.textContent = fallback;
      }
    }, 40));
  }

  function discrete(root) {
    let selected = 0, revealed = new Set([2]), totalShown = false;
    let draws = 0, sum = 0, last = null, generation = 0, busy = false;
    const rows = root.querySelector('[data-al-rows]');
    const tickets = root.querySelector('[data-al-tickets]');
    const chart = root.querySelector('[data-al-contributions]');
    const drawButton = root.querySelector('[data-al-sample]');

    function render() {
      rows.innerHTML = values.map((x, i) => `<tr class="${i === selected ? 'is-selected' : ''}"><th><button type="button" data-al-row="${i}" aria-pressed="${i === selected}" aria-label="${t('Select outcome ', '値を選ぶ：') + x}">${x}</button></th><td>${fractions[i]}</td><td class="al-product">${revealed.has(i) ? (x * weights[i] / 12).toFixed(4) : '?'}</td></tr>`).join('');
      root.querySelector('[data-al-sum]').textContent = totalShown ? mean.toFixed(4) : '?';
      tickets.innerHTML = values.flatMap((x, i) => Array.from({ length: weights[i] }, () => `<button type="button" class="al-ticket ${selected === i ? 'is-selected' : ''}" data-al-row="${i}" aria-label="${t('Select outcome ', '値を選ぶ：') + x}"><span aria-hidden="true">🤖</span><b>${x}</b></button>`)).join('');
      root.querySelector('[data-al-row-story]').textContent = t(
        `Value ${values[selected]} has ${weights[selected]} of 12 tickets: probability ${fractions[selected]}. The tickets represent the probabilities, not collected data.`,
        `値${values[selected]}のくじは12枚中${weights[selected]}枚。確率は${fractions[selected]}。これは確率を表す図で、実測データではありません。`);
      chart.innerHTML = values.map((x, i) => {
        const contribution = x * weights[i] / 12;
        return `<div class="al-contribution-row ${i === selected ? 'is-selected' : ''}"><span>x=${x}</span><div class="al-contribution-track"><i class="${contribution < 0 ? 'is-negative' : ''}" style="left:${contribution < 0 ? 20 - Math.abs(contribution) / (4 / 3) * 75 : 20}%;width:${Math.abs(contribution) / (4 / 3) * 75}%"></i></div><strong>${revealed.has(i) ? contribution.toFixed(4) : '?'}</strong></div>`;
      }).join('');
      math(root.querySelector('[data-al-rule]'), String.raw`E(X)=\sum_i x_i\Pr(X=x_i)`, 'E(X) = Σ xᵢ Pr(X=xᵢ)');
      const term = values[selected] * weights[selected] / 12;
      if (totalShown) {
        math(root.querySelector('[data-al-worked]'), String.raw`E(X)=-\frac14+0+\frac16+\frac16+\frac14+\frac43=\frac53\approx1.6667`, 'E(X) = −1/4 + 0 + 1/6 + 1/6 + 1/4 + 4/3 = 5/3 ≈ 1.6667');
      } else {
        math(root.querySelector('[data-al-worked]'), String.raw`${values[selected]}\times${fractionTex[selected]}=${revealed.has(selected) ? term.toFixed(4) : '?'}`, `${values[selected]} × ${fractions[selected]} = ${revealed.has(selected) ? term.toFixed(4) : '?'}`);
      }
      root.querySelector('[data-al-last]').textContent = last === null ? '🤖' : String(last);
      root.querySelector('[data-al-sample-status]').textContent = draws ? t(
        `${draws} draws · observed mean ${(sum / draws).toFixed(4)}${totalShown ? ' · expected mean 1.6667' : ''}`,
        `${draws}回 · 実測平均 ${(sum / draws).toFixed(4)}${totalShown ? ' · 期待値 1.6667' : ''}`)
        : t('One draw returns a whole-number outcome. Repeated draws let us compare their average with the expectation.', '1回の結果は整数。何度も引くと、その平均を期待値と比べられます。');
      root.querySelector('[data-al-aha]').textContent = t(
        'Expectation is a probability-weighted average, not the most likely outcome. It need not be a possible single result. More draws tend to improve agreement, but not on every step.',
        '期待値は「最も出やすい値」ではなく、確率で重みをつけた平均。1回の結果として出ない値でもOK。回数を増やすと平均は近づきやすくなりますが、毎回近づくとは限りません。');
    }
    root.addEventListener('click', event => {
      const row = event.target.closest('[data-al-row]');
      if (row) { selected = Number(row.dataset.alRow); totalShown = false; render(); }
    });
    root.querySelector('[data-al-reveal-row]').addEventListener('click', () => { revealed.add(selected); totalShown = false; render(); });
    root.querySelector('[data-al-add]').addEventListener('click', () => { revealed = new Set(values.map((_, i) => i)); totalShown = true; render(); });
    drawButton.addEventListener('click', async () => {
      if (busy) return;
      busy = true; drawButton.disabled = true;
      const run = generation;
      for (let i = 0; i < 120 && generation === run; i++) {
        const ticket = Math.floor(Math.random() * 12);
        let end = 0;
        last = values[weights.findIndex(weight => { end += weight; return ticket < end; })];
        draws++; sum += last;
        root.querySelector('[data-al-last]').textContent = String(last);
        root.querySelector('[data-al-sample-status]').textContent = t(`${draws} draws · observed mean ${(sum / draws).toFixed(4)}`, `${draws}回 · 実測平均 ${(sum / draws).toFixed(4)}`);
        await pause(18);
      }
      if (generation !== run) return;
      busy = false; drawButton.disabled = false; render();
    });
    root.querySelector('[data-al-reset]').addEventListener('click', () => {
      generation++; busy = false; drawButton.disabled = false;
      selected = 0; revealed = new Set([2]); totalShown = false; draws = 0; sum = 0; last = null; render();
    });
    render();
    return render;
  }

  function continuous(root) {
    const slider = root.querySelector('[data-al-slices]');
    let selected = 1, exactShown = true, step = 1;
    const goToStep = value => {
      step = value;
      root.querySelectorAll('[data-al-guide-panel]').forEach(panel => panel.hidden = Number(panel.dataset.alGuidePanel) !== step);
      root.querySelectorAll('[data-al-step]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.alStep) === step)));
      root.querySelector('[data-al-integrals]').textContent = step === 3 ? t('Back to the triangle','三角形に戻る') : t('Next step →','次のステップ →');
      root.querySelector('.al-continuous-controls').hidden = step === 3;
    };
    function graph(svg, n, weighted) {
      const left = 44, right = 426, bottom = 192, top = 25;
      const maxY = weighted ? 2.2 : 1.6;
      const X = x => left + x / a * (right - left);
      const Y = y => bottom - y / maxY * (bottom - top);
      const f = x => weighted ? x * x : x;
      const width = a / n;
      const rects = Array.from({ length: n }, (_, i) => {
        const mid = (i + 0.5) * width;
        return `<rect data-al-rectangle="${i}" role="button" tabindex="0" aria-pressed="${i === selected}" aria-label="${t('Select slice ', '区間を選ぶ：') + (i + 1)}" class="al-area-rectangle ${i === selected ? 'is-selected' : ''}" x="${X(i * width)}" y="${Y(f(mid))}" width="${(right-left)/n}" height="${bottom-Y(f(mid))}"/>`;
      }).join('');
      const path = Array.from({ length: 81 }, (_, i) => `${i ? 'L' : 'M'}${X(i / 80 * a)},${Y(f(i / 80 * a))}`).join(' ');
      const marker = `<text x="${left}" y="16">${weighted ? 'x f(x) = x²' : 'f(x) = x'}</text>`;
      svg.innerHTML = `<line class="al-area-axis" x1="${left}" y1="${bottom}" x2="${right+8}" y2="${bottom}"/><line class="al-area-axis" x1="${left}" y1="${bottom}" x2="${left}" y2="${top}"/>${rects}<path class="al-area-curve" d="${path}"/>${marker}<text x="${left}" y="214" text-anchor="middle">0</text><text x="${right}" y="214" text-anchor="middle">√2 ≈ 1.414</text><text x="236" y="235" text-anchor="middle">x</text><text x="${left-9}" y="${Y(weighted ? 2 : 1)}" text-anchor="end">${weighted ? '2' : '1'}</text>`;
    }
    function render() {
      const n = Number(slider.value), width = a / n;
      selected = Math.min(selected, n - 1);
      const mid = (selected + 0.5) * width;
      const prob = mid * width, contribution = mid * prob;
      const densitySum = Array.from({ length: n }, (_, i) => (i + 0.5) * width * width).reduce((s, v) => s + v, 0);
      const weightedSum = Array.from({ length: n }, (_, i) => ((i + 0.5) * width) ** 2 * width).reduce((s, v) => s + v, 0);
      root.querySelector('[data-al-slices-value]').textContent = String(n);
      graph(root.querySelector('[data-al-density]'), n, false);
      graph(root.querySelector('[data-al-weighted]'), n, true);
      math(root.querySelector('[data-al-density-rule]'), String.raw`\Pr(0\le X\le\sqrt2)=\int_0^{\sqrt2}f(x)\,dx`, 'Pr(0 ≤ X ≤ √2) = ∫ f(x) dx');
      math(root.querySelector('[data-al-weighted-rule]'), String.raw`E(X)=\int_0^{\sqrt2}x f(x)\,dx`, 'E(X) = ∫ x f(x) dx');
      root.querySelector('[data-al-density-sum]').textContent = t(`Rectangle sum: ${densitySum.toFixed(6)} = 100%`, `長方形の合計：${densitySum.toFixed(6)} = 100%`);
      root.querySelector('[data-al-weighted-sum]').textContent = t(`Add the contributions: ${weightedSum.toFixed(6)} → exact average 0.942809`, `平均への寄与を足す：${weightedSum.toFixed(6)} → 正確な平均 0.942809`);
      root.querySelector('[data-al-guide-x]').textContent = mid.toFixed(4);
      root.querySelector('[data-al-guide-prob]').textContent = `${(prob * 100).toFixed(2)}%`;
      root.querySelector('[data-al-guide-contribution]').textContent = contribution.toFixed(4);
      math(root.querySelector('[data-al-slice-math]'), String.raw`${mid.toFixed(4)}\times${prob.toFixed(4)}\approx${contribution.toFixed(4)}`, `${mid.toFixed(4)} × ${prob.toFixed(4)} ≈ ${contribution.toFixed(4)}`);
      root.querySelector('[data-al-slice-story]').textContent = t(`Highlighted piece ${selected+1}: multiply the value at its center by its approximate probability. Repeat for all ${n} pieces, then add.`, `色のついた区間${selected+1}：中央の値×その区間の確率（近似）。${n}個全部で同じことをして、最後に足します。`);
      root.querySelector('[data-al-exact]').hidden = !exactShown;
      if (exactShown) {
        math(root.querySelector('[data-al-density-exact]'), String.raw`\begin{aligned}\int_0^{\sqrt2}x\,dx&=\left[\frac{x^2}2\right]_0^{\sqrt2}\\&=\frac{(\sqrt2)^2}{2}-\frac{0^2}{2}\\&=\frac22-0=1\end{aligned}`, '∫ x dx = [x²/2]₀^√2 = (√2)²/2 − 0²/2 = 1');
        math(root.querySelector('[data-al-weighted-exact]'), String.raw`\begin{aligned}\int_0^{\sqrt2}x^2\,dx&=\left[\frac{x^3}3\right]_0^{\sqrt2}\\&=\frac{(\sqrt2)^3}{3}-\frac{0^3}{3}\\&=\frac{2\sqrt2}3\approx0.9428\end{aligned}`, '∫ x² dx = [x³/3]₀^√2 = (√2)³/3 − 0³/3 = 2√2/3 ≈ 0.9428');
      }
      root.querySelector('[data-al-aha]').textContent = t('Left: total probability = 1. Right: expectation, not a percentage. Larger x values get more probability, so the mean lies to the right of the interval midpoint. For this linear density, midpoint rectangles already give total probability 1.', '左は確率の合計＝1。右は期待値で、％ではありません。大きいxほど確率が多いので、平均は区間の真ん中より右にあります。この直線の密度では、中央の高さの長方形で確率の合計がちょうど1になります。');
      root.querySelector('[data-al-aha]').textContent = t('Aha: more probability lies near the larger values. That is why the average 0.9428 is above the interval midpoint 0.7071.','発見：大きい値のほうに確率が多い。だから平均0.9428は、範囲の真ん中0.7071より大きい。');
      goToStep(step);
    }
    slider.addEventListener('input', render);
    function select(event) {
      const rect = event.target.closest('[data-al-rectangle]');
      if (!rect) return;
      if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;
      if (event.type === 'keydown') event.preventDefault();
      selected = Number(rect.dataset.alRectangle); render();
    }
    root.addEventListener('click', select);
    root.addEventListener('keydown', select);
    root.querySelectorAll('[data-al-step]').forEach(button => button.addEventListener('click', () => goToStep(Number(button.dataset.alStep))));
    root.querySelector('[data-al-integrals]').addEventListener('click', () => goToStep(step === 3 ? 1 : step + 1));
    root.querySelector('[data-al-reset]').addEventListener('click', () => { slider.value = '4'; selected = 1; step = 1; render(); });
    render();
    return render;
  }

  function setup() {
    document.querySelectorAll('[data-al-expectation]').forEach(root => {
      if (root.dataset.initialized) return;
      root.dataset.initialized = 'true';
      const render = root.dataset.alExpectation === 'discrete' ? discrete(root) : continuous(root);
      document.querySelector('script[src*="mathjax"]')?.addEventListener('load', render, { once: true });
      new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['data-language'] });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup, { once: true });
  else setup();
  document.addEventListener('statsb:agenda-rendered', setup);
})();
