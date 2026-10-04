(() => {
  const t = (en, ja) => document.documentElement.dataset.language === 'en' ? en : ja;
  const choose = (n, k) => {
    if (k < 0 || k > n) return 0;
    let value = 1;
    for (let i = 1; i <= k; i += 1) value = value * (n - i + 1) / i;
    return value;
  };
  const wait = ms => new Promise(resolve => window.setTimeout(resolve, ms));

  function setupDiscrete(root) {
    if (root.dataset.initialized) return;
    root.dataset.initialized = 'true';
    const kSlider = root.querySelector('[data-w2-discrete-k]');
    const discreteBars = root.querySelector('[data-w2-discrete-bars]');
    const discreteAnswer = root.querySelector('[data-w2-discrete-answer]');
    const discreteFormula = root.querySelector('[data-w2-discrete-formula]');
    const bandSlider = root.querySelector('[data-w2-continuous-band]');
    const densitySvg = root.querySelector('[data-w2-density]');
    const continuousAnswer = root.querySelector('[data-w2-continuous-answer]');
    const continuousCaption = root.querySelector('[data-w2-continuous-caption]');
    const formulaTimers = new WeakMap();

    // Render off-screen first, then swap in finished math. Slider updates never expose raw TeX.
    function renderFormula(element, source, fallback) {
      element.dataset.mathSource = source;
      if (!element.querySelector('mjx-container')) element.textContent = fallback;
      window.clearTimeout(formulaTimers.get(element));
      formulaTimers.set(element, window.setTimeout(async () => {
        const math = window.MathJax;
        if (!math?.tex2chtmlPromise) return;
        try {
          await math.startup.promise;
          if (element.dataset.mathSource !== source) return;
          const rendered = await math.tex2chtmlPromise(source, { display: true });
          if (element.dataset.mathSource !== source) return;
          element.replaceChildren(rendered);
          element.dataset.renderedSource = source;
          math.startup.document.reset();
          math.startup.document.updateDocument();
        } catch {
          if (element.dataset.mathSource === source) element.textContent = fallback;
        }
      }, 40));
    }

    function drawDiscrete() {
      const selected = Number(kSlider.value);
      root.querySelector('[data-w2-discrete-value]').textContent = String(selected);
      root.querySelector('[data-w2-discrete-key]').textContent = 'k = ' + selected;
      root.querySelector('[data-w2-discrete-caption]').textContent = t('CHANCE OF EXACTLY ' + selected + ' HEADS', 'ちょうど' + selected + '回が表になる確率');
      discreteBars.replaceChildren(...Array.from({ length: 6 }, (_, k) => {
        const probability = choose(5, k) / 32;
        const column = document.createElement('button');
        column.type = 'button';
        column.className = 'week2-discrete-column' + (k === selected ? ' is-selected' : '');
        column.setAttribute('aria-pressed', String(k === selected));
        column.setAttribute('aria-label', t(k + ' heads: ' + (probability * 100).toFixed(2) + '%', '表' + k + '回：' + (probability * 100).toFixed(2) + '％'));
        column.innerHTML = '<span class="week2-discrete-value">' + (probability * 100).toFixed(0) + '%</span><span class="week2-discrete-bar" style="--bar-height:' + probability / (10 / 32) * 100 + '%"></span><span class="week2-discrete-x">' + k + '</span>';
        column.addEventListener('click', () => { kSlider.value = String(k); drawDiscrete(); });
        return column;
      }));
      const combinations = choose(5, selected);
      const probability = combinations / 32;
      discreteAnswer.textContent = (probability * 100).toFixed(2) + '%';
      renderFormula(discreteFormula,
        String.raw`\begin{aligned}\Pr(X=${selected})&={}_5C_{${selected}}(0.5)^{${selected}}(0.5)^{${5-selected}}\\&=\frac{${combinations}}{32}=${probability.toFixed(4)}\end{aligned}`,
        'Pr(X = ' + selected + ') = C(5, ' + selected + ') × 0.5^' + selected + ' × 0.5^' + (5-selected) + ' = ' + probability.toFixed(4));
    }

    function erf(x) {
      const sign = x < 0 ? -1 : 1;
      x = Math.abs(x);
      const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
      const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
      const z = 1 / (1 + p * x);
      return sign * (1 - (((((a5*z+a4)*z)+a3)*z+a2)*z+a1)*z*Math.exp(-x*x));
    }

    function drawDensity() {
      const band = Number(bandSlider.value);
      const low = Number((170 - band * 6).toFixed(1));
      const high = Number((170 + band * 6).toFixed(1));
      const probability = band === 0 ? 0 : erf(band / Math.sqrt(2));
      root.querySelector('[data-w2-continuous-value]').textContent = '±' + band + 'σ';
      root.querySelector('[data-w2-continuous-key]').textContent = '170 ± ' + band + ' × 6 → ' + low + '〜' + high + ' cm';
      renderFormula(root.querySelector('[data-w2-continuous-formula]'),
        String.raw`\begin{aligned}\Pr(${low}\le X\le${high})&=\Pr(${band===0?0:-band}\le Z\le${band})\\&=${probability.toFixed(4)}\end{aligned}`,
        'Pr(' + low + ' ≤ X ≤ ' + high + ') = Pr(' + (band===0?0:-band) + ' ≤ Z ≤ ' + band + ') = ' + probability.toFixed(4));
      const x0 = 34, x1 = 406, baseline = 151, peak = 20;
      const xFor = z => x0 + (z + 3.5) / 7 * (x1 - x0);
      const yFor = z => baseline - Math.exp(-0.5 * z * z) * (baseline - peak);
      const curve = Array.from({ length: 141 }, (_, i) => {
        const z = -3.5 + 7 * i / 140;
        return (i ? 'L' : 'M') + xFor(z).toFixed(1) + ',' + yFor(z).toFixed(1);
      }).join(' ');
      const samples = Array.from({ length: 41 }, (_, i) => -band + 2 * band * i / 40);
      const area = 'M' + xFor(-band) + ',' + baseline + ' ' + samples.map(z => 'L' + xFor(z).toFixed(1) + ',' + yFor(z).toFixed(1)).join(' ') + ' L' + xFor(band) + ',' + baseline + ' Z';
      const ticks = [-3,-2,-1,0,1,2,3].map(z => '<line class="w2-density-tick" x1="' + xFor(z) + '" y1="' + baseline + '" x2="' + xFor(z) + '" y2="' + (baseline+5) + '"/><text class="w2-density-label" x="' + xFor(z) + '" y="' + (baseline+18) + '" text-anchor="middle">' + (z === 0 ? 'μ' : z + 'σ') + '</text>').join('');
      densitySvg.innerHTML = '<line class="w2-density-axis" x1="' + x0 + '" y1="' + baseline + '" x2="' + x1 + '" y2="' + baseline + '"/><path class="w2-density-area" d="' + area + '"/><path class="w2-density-curve" d="' + curve + '"/><line class="w2-density-mean" x1="' + xFor(0) + '" y1="' + yFor(0) + '" x2="' + xFor(0) + '" y2="' + baseline + '"/>' + ticks + '<text class="w2-density-range" x="' + xFor(0) + '" y="14" text-anchor="middle">' + (probability * 100).toFixed(2) + '%</text>';
      densitySvg.setAttribute('aria-label', t('Normal density: shaded range ' + low + ' to ' + high + ' cm, probability ' + (probability * 100).toFixed(2) + '%', '正規分布の密度：' + low + '〜' + high + 'cmの面積、確率' + (probability * 100).toFixed(2) + '％'));
      continuousAnswer.textContent = (probability * 100).toFixed(2) + '%';
      continuousCaption.textContent = t('CHANCE FROM ' + low + ' TO ' + high + ' CM', low + '〜' + high + 'cmの確率');
    }

    function drawRules() {
      renderFormula(root.querySelector('[data-w2-discrete-rule]'),
        String.raw`\Pr(X=k)={}_nC_k\,p^k(1-p)^{n-k}`,
        'Pr(X = k) = ₙCₖ · pᵏ · (1 − p)ⁿ⁻ᵏ');
      renderFormula(root.querySelector('[data-w2-continuous-rule]'),
        String.raw`\Pr(a\le X\le b)=\int_a^b f(x)\,dx`,
        'Pr(a ≤ X ≤ b) = ∫ₐᵇ f(x) dx');
    }
    kSlider.addEventListener('input', drawDiscrete);
    bandSlider.addEventListener('input', drawDensity);
    const drawAll = () => { drawRules(); drawDiscrete(); drawDensity(); };
    document.querySelector('script[src*="mathjax"]')?.addEventListener('load', drawAll, { once: true });
    new MutationObserver(() => { drawDiscrete(); drawDensity(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-language'] });
    drawAll();
  }

  function setupFamilies(root) {
    if (root.dataset.initialized) return;
    root.dataset.initialized = 'true';
    const controls = root.querySelector('[data-w2-family-controls]');
    const chart = root.querySelector('[data-w2-family-chart]');
    const status = root.querySelector('[data-w2-family-status]');
    const aha = root.querySelector('[data-w2-family-aha]');
    const panels = [...root.querySelectorAll('[data-w2-model]')];
    const tabs = [...root.querySelectorAll('.week2-model-tabs [role="tab"]')];
    let type = 'binomial', n = 10, p = 0.5, lambda = 2, counts = [], trials = 0, busy = false;

    function probabilities() {
      if (type === 'poisson') {
        let probability = Math.exp(-lambda);
        return Array.from({ length: Math.min(16, Math.max(7, Math.ceil(lambda + 4 * Math.sqrt(lambda) + 1))) }, (_, k) => {
          if (k > 0) probability *= lambda / k;
          return probability;
        });
      }
      const size = type === 'bernoulli' ? 1 : n;
      return Array.from({ length: size + 1 }, (_, k) => choose(size, k) * p ** k * (1-p) ** (size-k));
    }

    function draw() {
      const model = probabilities();
      const maxPercent = Math.max(...model.map(x => x * 100), ...counts.map(x => trials ? x / trials * 100 : 0), 1);
      chart.style.setProperty('--w2-count', model.length);
      chart.replaceChildren(...model.map((probability, k) => {
        const observed = trials ? counts[k] / trials * 100 : 0;
        const column = document.createElement('div');
        column.className = 'week2-family-bin';
        column.setAttribute('aria-label', t(`Outcome ${k}: observed ${observed.toFixed(1)}%, predicted ${(probability*100).toFixed(1)}%`, `結果${k}：実測${observed.toFixed(1)}％、理論値${(probability*100).toFixed(1)}％`));
        column.innerHTML = `<div class="week2-family-bars"><span class="week2-family-bar is-observed" style="height:${observed/maxPercent*100}%" title="${t('Observed','実測')} ${observed.toFixed(1)}%"></span><span class="week2-family-bar is-predicted" style="height:${probability*100/maxPercent*100}%" title="${t('Formula','公式')} ${(probability*100).toFixed(1)}%"></span></div><strong>${k}</strong><small>${type === 'bernoulli' ? t(k ? 'head':'tail',k ? '表':'裏') : type === 'poisson' ? t('events','回') : t('successes','回')}</small><em>${trials ? `${observed.toFixed(0)}%` : ''}</em></div>`;
        return column;
      }));
      status.textContent = trials
        ? t(`${trials.toLocaleString()} trials · compare observed bars with the model`, `${trials.toLocaleString()}回完了 · 実測と理論値を比較`)
        : t('Run trials to compare outcomes with the model.', 'シミュレーションを実行し、実測と理論値を比べよう。');
      const insights = {
        bernoulli: ['A single trial is Bernoulli: one success chance p, two possible outcomes. Binomial with n = 1 is the same model.', 'ベルヌーイ分布は1回の試行。成功確率pで結果は2種類。二項分布の n=1 と同じです。'],
        binomial: ['Fixed n + same p + independent trials → binomial. The batting activity is a binomial experiment; k is the number of hits.', '試行回数nが固定・毎回同じp・各回が独立なら二項分布。打率の活動では、kが安打数です。'],
        poisson: ['Poisson counts events in a fixed interval. λ is the average count; it is not the chance of one event.', 'ポアソン分布は一定区間の出来事の回数。λは平均回数で、1回起きる確率ではありません。']
      };
      aha.innerHTML = `<strong>💡 ${t('Aha','気づき')}</strong> ${t(...insights[type])}`;
    }

    function makeControl(label, attr, value, min, max, step, unit) {
      return `<label><span>${label}</span><input type="range" data-${attr} min="${min}" max="${max}" step="${step}" value="${value}"><output data-${attr}-value>${value}${unit}</output></label>`;
    }
    function updateControls() {
      controls.innerHTML = type === 'bernoulli'
        ? `${makeControl(t('Success chance','成功確率'),'w2-p',Math.round(p*100),10,90,5,'%')}`
        : type === 'binomial'
          ? `<label><span>${t('Number of trials n','試行回数 n')}</span><select data-w2-n><option>5</option><option selected>10</option><option>20</option></select></label>${makeControl(t('Success chance p','成功確率 p'),'w2-p',Math.round(p*100),10,90,5,'%')}`
          : makeControl(t('Average events λ','平均回数 λ'),'w2-lambda',lambda,.5,5,.5,'');
      const pInput = controls.querySelector('[data-w2-p]');
      const nInput = controls.querySelector('[data-w2-n]');
      const lambdaInput = controls.querySelector('[data-w2-lambda]');
      pInput?.addEventListener('input', () => {
        p = Number(pInput.value) / 100;
        controls.querySelector('[data-w2-p-value]').value = `${pInput.value}%`;
        controls.querySelector('[data-w2-p-value]').textContent = `${pInput.value}%`;
        clear();
      });
      nInput?.addEventListener('change', () => { n = Number(nInput.value); clear(); });
      lambdaInput?.addEventListener('input', () => {
        lambda = Number(lambdaInput.value);
        controls.querySelector('[data-w2-lambda-value]').value = String(lambda);
        controls.querySelector('[data-w2-lambda-value]').textContent = String(lambda);
        clear();
      });
    }
    function sample() {
      if (type === 'poisson') {
        const limit = Math.exp(-lambda);
        let product = 1, k = 0;
        do { k += 1; product *= Math.random(); } while (product > limit);
        return k - 1;
      }
      const size = type === 'bernoulli' ? 1 : n;
      let successes = 0;
      for (let i = 0; i < size; i += 1) if (Math.random() < p) successes += 1;
      return successes;
    }
    function clear() { counts = []; trials = 0; draw(); }
    async function run() {
      if (busy) return;
      busy = true;
      const button = root.querySelector('[data-w2-family-run]');
      button.disabled = true;
      controls.querySelectorAll('input, select').forEach(control => { control.disabled = true; });
      counts = Array(probabilities().length).fill(0); trials = 0;
      status.textContent = t('Collecting 1,000 outcomes…','1,000回の結果を集計中…');
      while (trials < 1000) {
        const end = Math.min(1000, trials + 50);
        while (trials < end) {
          const result = sample();
          if (result >= counts.length) counts.push(...Array(result - counts.length + 1).fill(0));
          counts[result] += 1;
          trials += 1;
        }
        draw();
        await wait(24);
      }
      button.disabled = false;
      controls.querySelectorAll('input, select').forEach(control => { control.disabled = false; });
      busy = false;
    }
    function selectModel(next) {
      if (busy) return;
      type = next;
      tabs.forEach(tab => {
        const selected = tab.id === `w2-${type}-tab`;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
      });
      panels.forEach(panel => { panel.hidden = panel.dataset.w2Model !== type; });
      updateControls();
      clear();
    }
    tabs.forEach(tab => tab.addEventListener('click', () => selectModel(tab.id.replace('w2-','').replace('-tab',''))));
    root.querySelector('[data-w2-family-run]').addEventListener('click', run);
    root.querySelector('[data-w2-family-reset]').addEventListener('click', () => { if (!busy) clear(); });
    updateControls();
    draw();
  }

  function setup() {
    document.querySelectorAll('[data-week2-discrete]').forEach(setupDiscrete);
    document.querySelectorAll('[data-week2-families]').forEach(setupFamilies);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup, { once: true });
  else setup();
  document.addEventListener('statsb:agenda-rendered', setup);
})();
