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
    const drawButtons = [...root.querySelectorAll('[data-al-sample]')];
    let counts = values.map(() => 0), history = [], lastTicket = null;
    function renderSample() {
      root.querySelector('[data-al-last]').textContent = last === null ? '?' : String(last);
      root.querySelector('[data-al-draws]').textContent = draws.toLocaleString();
      root.querySelector('[data-al-total]').textContent = sum.toLocaleString();
      root.querySelector('[data-al-average]').textContent = draws ? (sum / draws).toFixed(4) : '—';
      root.querySelector('[data-al-sample-equation]').textContent = draws ? t(`Observed average = ${sum} ÷ ${draws} = ${(sum / draws).toFixed(4)}`, `実測平均 = 出目の合計 ${sum} ÷ ${draws}回 = ${(sum / draws).toFixed(4)}`) : t('Observed average = sum of outcomes ÷ number of draws', '実測平均 = 出目の合計 ÷ 引いた回数');
      root.querySelector('[data-al-sample-status]').textContent = draws ? t(`Difference from expectation: ${Math.abs(sum / draws - mean).toFixed(4)}. A finite sample need not equal 1.6667.`, `期待値との差：${Math.abs(sum / draws - mean).toFixed(4)}。有限回の実測平均は、1.6667とぴったり一致するとは限りません。`) : t('First calculate the worksheet. Drawing tickets is an optional check, not how to obtain the exact answer.', 'まずワークシートの計算をしよう。くじは計算結果を確かめるための体験で、正確な答えを求める方法ではありません。');
      root.querySelector('[data-al-frequencies]').innerHTML = values.map((x,i) => `<tr><th>${x}</th><td>${counts[i]}</td><td>${draws ? (counts[i] / draws * 100).toFixed(1) + '%' : '—'}</td><td>${(weights[i] / 12 * 100).toFixed(1)}%</td></tr>`).join('');
      tickets.querySelectorAll('.al-ticket').forEach((ticket,i) => ticket.classList.toggle('is-drawn', i === lastTicket));
      const X = n => 42 + n / Math.max(1,draws) * 440, Y = v => 155 - (v + 1) / 5 * 135;
      const stride = Math.max(1,Math.ceil(history.length / 400));
      const points = history.filter((_,i) => i % stride === 0 || i === history.length - 1).map(p => `${X(p.n)},${Y(p.average)}`).join(' ');
      root.querySelector('[data-al-average-chart]').innerHTML = `<path d="M42 20V155H482" stroke="#b4bdbf" fill="none"/>${[-1,0,2,4].map(v => `<text x="32" y="${Y(v)+4}" text-anchor="end">${v}</text>`).join('')}<path d="M42 ${Y(mean)}H482" stroke="#a77636" stroke-dasharray="5 4"/><text x="48" y="${Y(mean)-7}" fill="#8d662b">${t('Expectation','期待値')} 1.6667</text><polyline points="${points}" stroke="#2876a0" stroke-width="2.5" fill="none"/>${draws ? `<circle cx="${X(draws)}" cy="${Y(sum / draws)}" r="4" fill="#2876a0"/>` : ''}<text x="42" y="179">0</text><text x="482" y="179" text-anchor="end">${draws} ${t('draws','回')}</text>`;
    }

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
      renderSample();
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
    drawButtons.forEach(drawButton => drawButton.addEventListener('click', async () => {
      if (busy) return;
      busy = true; drawButtons.forEach(button => button.disabled = true);
      const run = generation;
      const batch = Number(drawButton.dataset.alSample);
      for (let i = 0; i < batch && generation === run; i++) {
        const ticket = Math.floor(Math.random() * 12);
        let end = 0;
        const outcome = weights.findIndex(weight => { end += weight; return ticket < end; });
        last = values[outcome]; lastTicket = ticket; counts[outcome]++;
        draws++; sum += last;
        history.push({n:draws,average:sum / draws});
        if (history.length > 4000) history = history.filter((_,index) => index % 2 === 0 || index === history.length - 1);
        renderSample();
        await pause(batch === 1 ? 250 : batch === 100 ? 25 : 8);
      }
      if (generation !== run) return;
      busy = false; drawButtons.forEach(button => button.disabled = false); render();
    }));
    root.querySelector('[data-al-reset]').addEventListener('click', () => {
      generation++; busy = false; drawButtons.forEach(button => button.disabled = false);
      counts = values.map(() => 0); history = []; lastTicket = null;
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
      // One coordinate unit has the same length on both axes.
      svg.setAttribute('viewBox', '0 0 380 330');
      const scale = weighted ? 110 : 165;
      const left = weighted ? 95 : 65, bottom = 275, top = 28;
      const right = left + a * scale;
      const X = x => left + x * scale;
      const Y = y => bottom - y * scale;
      const f = x => weighted ? x * x : x;
      const width = a / n;
      const rects = Array.from({ length: n }, (_, i) => {
        const mid = (i + 0.5) * width;
        return `<rect data-al-rectangle="${i}" role="button" tabindex="0" aria-pressed="${i === selected}" aria-label="${t('Select slice ', '区間を選ぶ：') + (i + 1)}" class="al-area-rectangle ${i === selected ? 'is-selected' : ''}" x="${X(i * width)}" y="${Y(f(mid))}" width="${(right-left)/n}" height="${bottom-Y(f(mid))}"/>`;
      }).join('');
      const path = Array.from({ length: 81 }, (_, i) => `${i ? 'L' : 'M'}${X(i / 80 * a)},${Y(f(i / 80 * a))}`).join(' ');
      const marker = `<text x="${left}" y="16">${weighted ? 'x f(x) = x²' : 'f(x) = x'}</text>`;
      const triangle = weighted ? '' : `<path d="M${X(0)},${Y(0)}L${X(a)},${Y(0)}L${X(a)},${Y(a)}Z" fill="#63a8c0" fill-opacity=".25" pointer-events="none"/><path d="M${left},${Y(a)}H${right}V${bottom}" fill="none" stroke="#488a91" stroke-dasharray="4 4" pointer-events="none"/><text x="${left-9}" y="${Y(a)+4}" text-anchor="end">√2</text>`;
      svg.innerHTML = `${triangle}<line class="al-area-axis" x1="${left}" y1="${bottom}" x2="${right+18}" y2="${bottom}"/><line class="al-area-axis" x1="${left}" y1="${bottom}" x2="${left}" y2="${top}"/>${rects}<path class="al-area-curve" d="${path}"/>${marker}<text x="${left}" y="297" text-anchor="middle">0</text><text x="${right}" y="297" text-anchor="middle">√2 ≈ 1.414</text><text x="${right+24}" y="${bottom+4}">x</text><text x="${(left+right)/2}" y="320" text-anchor="middle">${t('Equal scale on both axes','縦・横は同じ縮尺')}</text><text x="${left-9}" y="${Y(weighted ? 2 : 1)+4}" text-anchor="end">${weighted ? '2' : '1'}</text>`;
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
