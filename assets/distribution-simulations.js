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
    let latestSample = [];
    let examMean = 64, examSd = kind === 't' ? 8 : 12;
    const math = (tex, fallback) => `<div data-display-math="${tex.replaceAll('&','&amp;').replaceAll('"','&quot;')}">${fallback}</div>`;
    const fmt = value => Number(value.toFixed(3)).toString();

    function examAnswer() {
      return kind === 'normal' ? band : kind === 't' ? (examMean-60)/(examSd/Math.sqrt(n)) : (n-1)*examSd**2/100;
    }

    function examMarkup() {
      const df = n-1, answer = examAnswer();
      let question, given, substitution, result, meaning;
      if (kind === 'normal') {
        const lo = mean-band*sd, hi = mean+band*sd;
        const probability = [68.27,95.45,99.73][band-1];
        question = t(`Robot heights are normal. What percentage are between ${lo} and ${hi} cm?`, `ロボットの身長は正規分布に従います。${lo}〜${hi}cmのロボットは何％？`);
        given = math(String.raw`\mu=${mean},\quad\sigma=${sd},\quad ${lo}\le X\le ${hi}`, `μ = ${mean} cm, σ = ${sd} cm; ${lo} ≤ X ≤ ${hi}`);
        substitution = math(String.raw`Z_{\rm lower}=\frac{${lo}-${mean}}{${sd}}=-${band},\qquad Z_{\rm upper}=\frac{${hi}-${mean}}{${sd}}=${band}`, `Z lower = (${lo} − ${mean}) / ${sd} = −${band}; Z upper = (${hi} − ${mean}) / ${sd} = ${band}`);
        result = math(String.raw`\Pr(${lo}\le X\le ${hi})=\Pr(-${band}\le Z\le ${band})\approx ${probability}\%`, `Pr(${lo} ≤ X ≤ ${hi}) ≈ ${probability}%`);
        meaning = t(`Standardizing turns centimetres into standard-deviation units. Read the area between −${band} and ${band} from a standard normal table. The shaded area is the answer—not the curve’s height.`, `標準化するとcmが「標準偏差何個分」に変わります。標準正規分布表で−${band}〜${band}の面積を読みます。答えは色のついた面積で、曲線の高さではありません。`);
      } else if (kind === 't') {
        question = t(`The target mean robot height is 60 cm. For ${n} randomly sampled robots, the mean is ${fmt(examMean)} cm and sample SD is ${fmt(examSd)} cm. Calculate t and its degrees of freedom.`, `ロボットの目標平均身長は60cm。無作為に選んだ${n}体の平均は${fmt(examMean)}cm、標本標準偏差は${fmt(examSd)}cm。t値と自由度を求めよう。`);
        given = math(String.raw`\mu_0=60,\quad\bar X=${fmt(examMean)},\quad s=${fmt(examSd)},\quad n=${n}`, `μ₀ = 60, X̄ = ${fmt(examMean)}, s = ${fmt(examSd)}, n = ${n}`);
        substitution = math(String.raw`\mathrm{SE}=\frac{s}{\sqrt n}=\frac{${fmt(examSd)}}{\sqrt{${n}}}\approx ${fmt(examSd/Math.sqrt(n))}`, `SE = ${fmt(examSd)} / √${n} ≈ ${fmt(examSd/Math.sqrt(n))} cm`);
        result = math(String.raw`t=\frac{\bar X-\mu_0}{s/\sqrt n}=\frac{${fmt(examMean)}-60}{${fmt(examSd)}/\sqrt{${n}}}\approx ${fmt(answer)},\quad\mathrm{df}=${n}-1=${df}`, `t = (${fmt(examMean)} − 60) / (${fmt(examSd)} / √${n}) ≈ ${fmt(answer)}, df = ${df}`);
        meaning = t(`The batch mean is ${fmt(Math.abs(answer))} estimated standard errors ${answer < 0 ? 'below' : 'above'} the target. We estimate spread using s because the population SD is unknown to the inspector. This t value is NOT a probability; deciding significance requires a t table and a chosen significance level.`, `組の平均は目標から標準誤差${fmt(Math.abs(answer))}個分${answer < 0 ? '下' : '上'}にあります。検査員には母標準偏差が不明なのでsで推定します。t値は確率ではありません。有意かどうかの判断にはt分布表と有意水準が必要です。`);
      } else {
        question = t(`A factory claims population SD σ = 10 cm. A random sample of ${n} robots has sample SD s = ${fmt(examSd)} cm. Calculate χ² and its degrees of freedom.`, `工場は母標準偏差σ＝10cmとしています。無作為に選んだ${n}体の標本標準偏差s＝${fmt(examSd)}cm。χ²値と自由度を求めよう。`);
        given = math(String.raw`\sigma=10,\quad\sigma^2=100,\quad s=${fmt(examSd)},\quad n=${n}`, `σ = 10, σ² = 100, s = ${fmt(examSd)}, n = ${n}`);
        substitution = math(String.raw`s^2=${fmt(examSd)}^2=${fmt(examSd**2)},\qquad (n-1)s^2=${df}\times ${fmt(examSd**2)}=${fmt(df*examSd**2)}`, `s² = ${fmt(examSd**2)}; (n−1)s² = ${df} × ${fmt(examSd**2)} = ${fmt(df*examSd**2)}`);
        result = math(String.raw`\chi^2=\frac{(n-1)s^2}{\sigma^2}=\frac{${df}\times ${fmt(examSd**2)}}{100}=${fmt(answer)},\quad\mathrm{df}=${df}`, `χ² = ${df} × ${fmt(examSd**2)} / 100 = ${fmt(answer)}, df = ${df}`);
        meaning = t(`Square the SD to get variance, multiply by n−1, then divide by the claimed population variance. Larger χ² means greater sample spread. It is NOT a probability. The sample mean does not enter this formula; changing it alone leaves χ² unchanged.`, `標準偏差を二乗して分散にし、n−1を掛け、想定した母分散で割ります。χ²が大きいほど標本のばらつきが大きい。これは確率ではありません。標本平均は式に入らないので、平均だけを変えてもχ²は変わりません。`);
      }
      const heights = latestSample.map(z => kind === 'normal' ? z : 60+10*z);
      const robots = heights.length ? heights.slice(0,8).map(h=>`<span><i style="font-size:${Math.max(12,h/60*32)}px">🤖</i><small>${h.toFixed(1)} cm</small></span>`).join('') : Array.from({length:kind==='normal'?1:Math.min(n,8)},()=>'<span>🤖</span>').join('');
      const note = kind === 'normal' ? t('Each measurement adds one height. Compare the observed share inside the shaded interval with the calculated probability.', '1回の測定で身長を1つ追加。色の範囲に入った実測の割合を、計算した確率と比べよう。') : t('Teaching model: independent robot heights from a normal population. One batch adds one statistic. The 1,000-batch comparison uses a stable factory (true μ = 60, σ = 10), while the question above stays fixed. Use “Measure a batch → solve” to set a new question from real simulated measurements. Displayed values are rounded.', '授業用モデル：身長は正規母集団から独立に抽出。1組から統計量を1つ追加します。1,000組の比較は安定した工場（真のμ＝60、σ＝10）から抽出し、上の問題は固定します。「1組を測る → 解く」で測定値を新しい問題にできます。表示値は丸めています。');
      return `<strong>${t('EXAM PRACTICE · Robot quality inspector','試験の練習 · ロボット品質検査員')}</strong><p>${question}</p><div class="distribution-exam-robots">${robots}</div><div class="distribution-exam-steps"><article><b>① ${t('Given','与えられた値')}</b>${given}</article><article><b>② ${t('Substitute','値を代入')}</b>${substitution}</article><article class="distribution-exam-answer"><b>③ ${t('Answer','答え')}</b>${result}</article></div><p>${meaning}</p><small>${note}</small>`;
    }


    function modelAndRange() {
      if (kind === 'normal') return { min:mean - 4 * sd, max:mean + 4 * sd, pdf:x => normalPdf(x, mean, sd), label:t('Normal density','正規分布の密度') };
      const df = n - 1;
      if (kind === 't') { const limit = Math.max(5, Math.abs(examAnswer())*1.2); return { min:-limit, max:limit, df, pdf:x => tPdf(x, df), secondary:x => normalPdf(x), label:t('t density','t分布の密度') }; }
      return { min:0, max:Math.max(10, df + 4 * Math.sqrt(2 * df), examAnswer()*1.2), df, pdf:x => chiPdf(x, df), label:t('Chi-square density','カイ二乗分布の密度') };
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
      // Keep the density axis tied to the model, never to random sample spikes.
      const maxY = Math.max(0.001, ...curvePoints.map(point => point.y), ...curvePoints.map(point => point.z)) * 1.5;
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
        const y = yPos(Math.min(value, maxY));
        const overflow = value > maxY;
        return `<rect class="distribution-hist-bar" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${Math.max(1, barWidth-2).toFixed(1)}" height="${Math.max(0, baseY-y).toFixed(1)}"><title>${value.toFixed(3)}${overflow ? t(' · above the fixed scale', ' · 固定目盛りの上限を超えています') : ''}</title></rect>${overflow ? `<text class="distribution-axis" x="${(x+barWidth/2).toFixed(1)}" y="${top+12}" text-anchor="middle">↑</text>` : ''}`;
      }).join('');
      const bounds = kind === 'normal' ? [-band, band].map(multiplier => {
        const px = xPos(mean + multiplier * sd);
        return `<line class="distribution-bound" x1="${px}" x2="${px}" y1="${top}" y2="${baseY}"/>`;
      }).join('') : '';
      const markerX = xPos(examAnswer());
      const marker = kind === 'normal' ? '' : `<line x1="${markerX}" x2="${markerX}" y1="${top}" y2="${baseY}" stroke="#a15e40" stroke-width="3" stroke-dasharray="5 4"/><text x="${markerX}" y="${top+14}" text-anchor="middle" fill="#a15e40">${t('Answer','答え')}: ${fmt(examAnswer())}</text>`;
      const labelX = kind === 'normal' ? t('Height (cm)','身長（cm）') : kind === 't' ? 't' : 'χ²';
      return `<title>${model.label}</title><desc>${t('Simulated histogram and theoretical probability density.','シミュレーションのヒストグラムと理論確率密度。')}</desc>${grid}${modelArea}${bars}${bounds}<path class="distribution-curve" d="${curvePath('y')}"/><path class="distribution-normal-curve" d="${model.secondary ? curvePath('z') : ''}"/>${marker}<line class="distribution-axis-line" x1="${left}" x2="${width-right}" y1="${baseY}" y2="${baseY}"/>${xTicks}<text class="distribution-axis-label" x="${width-right}" y="${height-5}" text-anchor="end">${labelX}</text>`;
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
      root.querySelector('[data-dist-scenario]').innerHTML = examMarkup();
      root.querySelector('[data-dist-aha]').textContent = insightText();
      if (kind !== 'normal') {
        root.querySelector('[data-dist-df]').textContent = `df = ${n-1}`;
        for (const [key, value] of [['mean',examMean],['sd',examSd]]) {
          const input = root.querySelector(`[data-dist-exam-${key}]`);
          if (!input) continue;
          input.min = Math.min(Number(input.min), value);
          input.max = Math.max(Number(input.max), value);
          input.value = value;
          root.querySelector(`[data-dist-exam-${key}-value]`).textContent = fmt(value);
        }
      }
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
      latestSample = [];
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
          if (kind === 'normal') { latestSample = [mean + sd * randomNormal()]; values.push(latestSample[0]); }
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
    root.querySelectorAll('[data-dist-exam-mean], [data-dist-exam-sd]').forEach(control => control.addEventListener('input', () => {
      examMean = Number(root.querySelector('[data-dist-exam-mean]')?.value || examMean);
      examSd = Number(root.querySelector('[data-dist-exam-sd]').value);
      latestSample = []; // Manually supplied exam values, not a measured batch.
      draw();
    }));
    root.querySelector('[data-dist-once]').addEventListener('click', () => {
      if (busy) return;
      if (kind === 'normal') {
        latestSample = [mean+sd*randomNormal()]; values.push(latestSample[0]);
      } else {
        latestSample = Array.from({length:n}, randomNormal);
        const avg = latestSample.reduce((a,b)=>a+b,0)/n;
        const variance = latestSample.reduce((sum,z)=>sum+(z-avg)**2,0)/(n-1);
        examMean = 60+10*avg;
        examSd = 10*Math.sqrt(variance);
        values.push(kind === 't' ? avg/Math.sqrt(variance/n) : (n-1)*variance);
      }
      status.textContent = t('New measurements → substitute into the formula above.', '新しい測定値 → 上の公式に代入しました。');
      draw();
    });
    root.querySelector('[data-dist-run]').addEventListener('click', run);
    root.querySelector('[data-dist-clear]').addEventListener('click', () => { values.length = 0; latestSample = []; status.textContent = t('Ready to sample.','試行できます。'); draw(); });
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
