(() => {
  const language = () => document.documentElement.dataset.language || 'ja';
  const t = (en, ja) => language() === 'en' ? en : ja;
  const wait = ms => new Promise(resolve => window.setTimeout(resolve, ms));
  const normalPdf = (x, mean = 0, sd = 1) => Math.exp(-0.5 * ((x - mean) / sd) ** 2) / (sd * Math.sqrt(2 * Math.PI));
  const logGamma = z => {
    const coefficients = [676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];
    if (z < 0.5) return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - logGamma(1 - z);
    const value = z - 1;
    let x = 0.99999999999980993;
    coefficients.forEach((coefficient, index) => { x += coefficient / (value + index + 1); });
    const base = value + coefficients.length - 0.5;
    return 0.5 * Math.log(2 * Math.PI) + (value + 0.5) * Math.log(base) - base + Math.log(x);
  };
  const tPdf = (x, df) => Math.exp(logGamma((df + 1) / 2) - logGamma(df / 2) - 0.5 * Math.log(df * Math.PI) - ((df + 1) / 2) * Math.log1p(x * x / df));
  const chiPdf = (x, df) => x <= 0 ? (df === 2 ? 0.5 : 0) : Math.exp((df / 2 - 1) * Math.log(x) - x / 2 - (df / 2) * Math.log(2) - logGamma(df / 2));
  const randomNormal = () => {
    const u = Math.max(Number.EPSILON, Math.random());
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * Math.random());
  };

  function setup(root) {
    if (root.dataset.initialized) return;
    root.dataset.initialized = 'true';
    const kind = root.dataset.distributionType;
    const chart = root.querySelector('[data-dist-chart]');
    const status = root.querySelector('[data-dist-status]');
    const robot = root.querySelector('[data-dist-robot]');
    const values = [];
    const meanInput = root.querySelector('[data-dist-mean]');
    const sdInput = root.querySelector('[data-dist-sd]');
    const bandInput = root.querySelector('[data-dist-band]');
    const nInput = root.querySelector('[data-dist-n]');
    let mean = Number(meanInput?.value || 0);
    let sd = Number(sdInput?.value || 1);
    let band = Number(bandInput?.value || 2);
    let n = Number(nInput?.value || 5);
    let busy = false;

    function modelAndRange() {
      if (kind === 'normal') return { min:mean - 4 * sd, max:mean + 4 * sd, pdf:x => normalPdf(x, mean, sd), label:t('Normal density','正規分布の密度') };
      const df = n - 1;
      if (kind === 't') return { min:-5, max:5, df, pdf:x => tPdf(x, df), secondary:x => normalPdf(x), label:t('t density','t分布の密度') };
      return { min:0, max:Math.max(10, df + 4 * Math.sqrt(2 * df)), df, pdf:x => chiPdf(x, df), label:t('Chi-square density','カイ二乗分布の密度') };
    }

    function chartMarkup() {
      const width = 760, height = 330, left = 54, right = 20, top = 20, bottom = 42;
      const plotWidth = width - left - right, plotHeight = height - top - bottom, baseY = top + plotHeight;
      const model = modelAndRange();
      const xPos = x => left + (x - model.min) / (model.max - model.min) * plotWidth;
      const xAt = fraction => model.min + fraction * (model.max - model.min);
      const binCount = 36;
      const binWidth = (model.max - model.min) / binCount;
      const bins = Array(binCount).fill(0);
      values.forEach(value => { if (value >= model.min && value <= model.max) bins[Math.min(binCount - 1, Math.floor((value - model.min) / binWidth))] += 1; });
      const hist = bins.map(value => value / Math.max(values.length, 1) / binWidth);
      const curvePoints = Array.from({ length:301 }, (_, i) => {
        const x = xAt(i / 300);
        return { x, y:model.pdf(x), z:model.secondary ? model.secondary(x) : 0 };
      });
      const maxY = Math.max(0.001, ...hist, ...curvePoints.map(point => point.y), ...curvePoints.map(point => point.z)) * 1.12;
      const yPos = y => baseY - y / maxY * plotHeight;
      const curvePath = key => curvePoints.map((point, index) => `${index ? 'L' : 'M'}${xPos(point.x).toFixed(1)},${yPos(point[key]).toFixed(1)}`).join(' ');
      const modelArea = kind === 'normal' ? (() => {
        const lo = mean - band * sd, hi = mean + band * sd;
        const points = curvePoints.filter(point => point.x >= lo && point.x <= hi);
        if (!points.length) return '';
        return `<path class="distribution-area" d="M${xPos(points[0].x).toFixed(1)},${baseY} ${points.map(point => `L${xPos(point.x).toFixed(1)},${yPos(point.y).toFixed(1)}`).join(' ')} L${xPos(points.at(-1).x).toFixed(1)},${baseY} Z"/>`;
      })() : '';
      const grid = Array.from({ length:5 }, (_, i) => {
        const value = maxY * i / 4;
        const y = yPos(value);
        return `<line class="distribution-grid" x1="${left}" x2="${width-right}" y1="${y}" y2="${y}"/><text class="distribution-axis" x="${left-9}" y="${y+4}" text-anchor="end">${value.toFixed(2)}</text>`;
      }).join('');
      const xTicks = Array.from({ length:5 }, (_, i) => {
        const x = xAt(i / 4), px = xPos(x);
        return `<line class="distribution-tick" x1="${px}" x2="${px}" y1="${baseY}" y2="${baseY+5}"/><text class="distribution-axis" x="${px}" y="${baseY+20}" text-anchor="middle">${x.toFixed(kind === 'normal' ? 0 : 1)}</text>`;
      }).join('');
      const bars = hist.map((value, index) => {
        const barWidth = plotWidth / binCount;
        const x = left + index * barWidth + 1;
        const y = yPos(value);
        return `<rect class="distribution-hist-bar" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${Math.max(1, barWidth-2).toFixed(1)}" height="${Math.max(0, baseY-y).toFixed(1)}"/>`;
      }).join('');
      const bounds = kind === 'normal' ? [-band, band].map(multiplier => {
        const px = xPos(mean + multiplier * sd);
        return `<line class="distribution-bound" x1="${px}" x2="${px}" y1="${top}" y2="${baseY}"/>`;
      }).join('') : '';
      const labelX = kind === 'normal' ? t('Observed value','観測値') : kind === 't' ? 't' : 'χ²';
      return `<title>${model.label}</title><desc>${t('Simulated histogram and theoretical probability density.','シミュレーションのヒストグラムと理論確率密度。')}</desc>${grid}${modelArea}${bars}${bounds}<path class="distribution-curve" d="${curvePath('y')}"/><path class="distribution-normal-curve" d="${model.secondary ? curvePath('z') : ''}"/><line class="distribution-axis-line" x1="${left}" x2="${width-right}" y1="${baseY}" y2="${baseY}"/>${xTicks}<text class="distribution-axis-label" x="${width-right}" y="${height-5}" text-anchor="end">${labelX}</text>`;
    }

    function insightText() {
      if (kind === 'normal') {
        const lower = mean - band * sd, upper = mean + band * sd;
        const inside = values.filter(value => value >= lower && value <= upper).length;
        const expected = [68.27,95.45,99.73][band - 1];
        return values.length ? t(`${inside} of ${values.length} (${(inside / values.length * 100).toFixed(1)}%) landed between ${lower.toFixed(0)} and ${upper.toFixed(0)}. The normal model predicts about ${expected}%.`, `${values.length}個中${inside}個（${(inside / values.length * 100).toFixed(1)}％）が${lower.toFixed(0)}〜${upper.toFixed(0)}に入りました。正規分布の目安は約${expected}％です。`) : t('Run a sample to check the 68–95–99.7 rule.','標本を生成して68–95–99.7の法則を確かめましょう。');
      }
      const df = n - 1;
      return kind === 't'
        ? t(`Each trial builds t from a fresh sample of n = ${n}; df = ${df}. The orange curve is t, the teal curve is standard normal.`, `毎回n=${n}の新しい標本からt値を計算します（自由度${df}）。橙色がt分布、青緑色が標準正規分布です。`)
        : t(`Each trial sums squared deviations for n = ${n}; df = ${df}. Values cannot be negative, so the curve is right-skewed.`, `毎回n=${n}個の偏差平方和を計算します（自由度${df}）。値は負にならないため、右に裾を引く形になります。`);
    }

    function draw() {
      chart.innerHTML = chartMarkup();
      root.querySelector('[data-dist-aha]').textContent = insightText();
    }

    function syncParameters() {
      if (kind === 'normal') {
        mean = Number(meanInput.value);
        sd = Number(sdInput.value);
        band = Number(bandInput.value);
        root.querySelector('[data-dist-mean-value]').value = String(mean);
        root.querySelector('[data-dist-mean-value]').textContent = String(mean);
        root.querySelector('[data-dist-sd-value]').value = String(sd);
        root.querySelector('[data-dist-sd-value]').textContent = String(sd);
      } else {
        n = Number(nInput.value);
        root.querySelector('[data-dist-df]').textContent = `df = ${n - 1}`;
      }
      values.length = 0;
      status.textContent = t('Parameters changed. Ready for a fresh run.','設定を変更しました。新しく試せます。');
      draw();
    }

    async function run() {
      if (busy) return;
      busy = true;
      root.querySelectorAll('button, input, select').forEach(control => { control.disabled = true; });
      robot.dataset.running = 'true';
      const trials = 1000;
      const chunks = 10;
      for (let chunk = 0; chunk < chunks; chunk += 1) {
        for (let trial = 0; trial < trials / chunks; trial += 1) {
          if (kind === 'normal') values.push(mean + sd * randomNormal());
          else {
            const sample = Array.from({ length:n }, randomNormal);
            const average = sample.reduce((sum, value) => sum + value, 0) / n;
            if (kind === 't') {
              const variance = sample.reduce((sum, value) => sum + (value - average) ** 2, 0) / (n - 1);
              values.push(average / Math.sqrt(variance / n));
            } else {
              values.push(sample.reduce((sum, value) => sum + (value - average) ** 2, 0));
            }
          }
        }
        status.textContent = t(`Robo has run ${values.length.toLocaleString()} ${kind === 'normal' ? 'observations' : kind === 't' ? 't statistics' : 'chi-square trials'}…`, `ロボが${values.length.toLocaleString()}回の${kind === 'normal' ? '観測値' : kind === 't' ? 't値' : 'カイ二乗値'}を計算中…`);
        draw();
        await wait(35);
      }
      status.textContent = t(`${values.length.toLocaleString()} ${kind === 'normal' ? 'observations' : kind === 't' ? 't statistics' : 'chi-square trials'} generated.`, `${values.length.toLocaleString()}回の${kind === 'normal' ? '観測値' : kind === 't' ? 't値' : 'カイ二乗値'}を生成しました。`);
      robot.dataset.running = 'false';
      root.querySelectorAll('button, input, select').forEach(control => { control.disabled = false; });
      busy = false;
    }

    root.querySelectorAll('[data-dist-mean], [data-dist-sd], [data-dist-band], [data-dist-n]').forEach(control => control.addEventListener('input', syncParameters));
    root.querySelector('[data-dist-run]').addEventListener('click', run);
    root.querySelector('[data-dist-clear]').addEventListener('click', () => { values.length = 0; status.textContent = t('Ready to sample.','試行できます。'); draw(); });
    new MutationObserver(() => {
      draw();
      status.textContent = values.length
        ? t(`${values.length.toLocaleString()} trials ${busy ? 'generated so far…' : 'generated.'}`, `${values.length.toLocaleString()}回の結果${busy ? 'を生成中…' : 'を生成しました。'}`)
        : t('Ready to sample.','試行できます。');
    }).observe(document.documentElement,{attributes:true,attributeFilter:['data-language']});
    draw();
  }

  function setupAll() { document.querySelectorAll('[data-distribution-simulation]').forEach(setup); }
  document.addEventListener('statsb:agenda-rendered', setupAll);
  setupAll();
})();
