/* Week 3: the same probability model powers the formula, animation and chart. */
(() => {
  'use strict';
  function choose(n, x) {
    if (x < 0 || x > n) return 0;
    let value = 1;
    for (let i = 1; i <= Math.min(x, n - x); i++) value *= (n - i + 1) / i;
    return value;
  }
  function binomial(n, p, x) {
    if (x < 0 || x > n) return 0;
    return choose(n, x) * p ** x * (1 - p) ** (n - x);
  }
  function poisson(lambda, x) {
    if (x < 0 || !Number.isInteger(x)) return 0;
    let probability = Math.exp(-lambda);
    for (let i = 1; i <= x; i++) probability *= lambda / i;
    return probability;
  }
  function tail(pmf, x) {
    let sum = 0;
    for (let i = 0; i < x; i++) sum += pmf(i);
    return Math.max(0, Math.min(1, 1 - sum));
  }
  function arrivals(lambda, random = Math.random) {
    const times = [];
    if (lambda <= 0) return times;
    let time = 0;
    while ((time += -Math.log(1 - random()) / lambda) < 1) times.push(time);
    return times;
  }
  const math = {choose, binomial, poisson, tail, arrivals};
  if (typeof document === 'undefined') {module.exports = math; return;}

  const dual = (en, ja) => `<span class="lang-en">${en}</span><span class="lang-ja" lang="ja">${ja}</span>`;
  const t = (en, ja) => document.documentElement.dataset.language === 'en' ? en : ja;
  const pct = value => `${(100 * value).toFixed(2)}%`;
  const num = value => value.toLocaleString('en-US');
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  // Keep the previous rendered formula until its replacement is ready. Never flash raw TeX.
  function setMath(node, source, fallback) {
    if (node.dataset.displayMath === source) return;
    if (!node.childNodes.length) node.textContent = fallback;
    delete node.dataset.mathReady;
    node.dataset.displayMath = source;
  }

  function markup(kind) {
    const nba = kind === 'nba';
    return `<header class="story-heading"><div><p class="section-kicker">${dual('TEXTBOOK · pp.118–120','教科書 · p.118–120')}</p><h4>${nba ? dual('NBA: five shots, how many makes?','NBA：5本投げて、何本入る？') : dual('Costco: who arrives in ten minutes?','コストコ：10分で、何人来る？')}</h4></div><p>${nba ? dual('Count successes in a fixed number of independent attempts.','決まった回数の中で、成功した本数を数える。') : dual('Count new arrivals in a fixed time window—not people already waiting.','決まった時間に、新しく来た人数を数える。待っている人数ではありません。')}</p></header>
      <div class="story-formulas activity-formula-card"><div class="story-formula-heading">${dual('FORMULA · THE MODEL','公式 · モデル')}</div><div class="story-symbolic" data-story-symbolic></div><div class="story-substitution" data-story-substitution></div><p data-story-reading></p></div>
      <div class="story-columns"><article class="story-card story-play"><div class="story-card-heading"><h5>${dual('Choose → predict → try','設定 → 予想 → 試す')}</h5><span data-story-model></span></div>
      ${nba ? `<label>${dual('Attempts','投球回数')} <i>n</i><output data-story-n-output>5</output><input aria-label="${t('Attempts n','投球回数 n')}" data-story-n type="range" min="1" max="20" step="1" value="5"></label><label>${dual('Make probability per shot','1本の成功率')} <i>π</i><output data-story-p-output>93%</output><input aria-label="${t('Make probability','1本の成功率')}" data-story-p type="range" min="5" max="99" step="1" value="93"></label><div class="story-presets"><button type="button" data-story-preset="curry">${dual('Curry example · 93%','カリーの授業例 · 93％')}</button><button type="button" data-story-preset="compare">${dual('Try a 65% shooter','65％の選手で比較')}</button></div>` : `<label>${dual('Average arrivals per 10 min','10分あたりの平均到着人数')}<output data-story-rate-output>5</output><input aria-label="${t('Average arrivals per ten minutes','10分あたりの平均到着人数')}" data-story-rate type="range" min="0.5" max="15" step="0.5" value="5"></label><label>${dual('Window length (minutes)','観察時間（分）')}<output data-story-minutes-output>10</output><input aria-label="${t('Window length in minutes','観察時間（分）')}" data-story-minutes type="range" min="1" max="20" step="1" value="10"></label><div class="story-presets"><button type="button" data-story-preset="three">${dual('Exactly 3 arrivals','ちょうど3人')}</button><button type="button" data-story-preset="five">${dual('5 or more arrivals','5人以上')}</button></div>`}
      <div class="story-query"><label>${dual(nba ? 'Makes to highlight' : 'Arrivals to highlight',nba ? '注目する成功数' : '注目する人数')} <i>x</i><input type="number" data-story-x min="0" max="${nba ? 5 : 60}" value="${nba ? 4 : 3}" aria-label="${t('Highlighted count x','注目する数 x')}"></label><label>${dual('Question','求める確率')}<select data-story-mode aria-label="${t('Probability question','求める確率')}"><option value="exact">${t('Exactly x','ちょうど x')}</option><option value="tail" ${nba ? 'selected' : ''}>${t('x or more','x 以上')}</option></select></label></div>
      <div class="story-stage" data-story-stage>${nba ? `<svg viewBox="0 0 360 155" role="img" aria-label="${t('Robot shooting free throws','ロボットのフリースロー')}"><path d="M10 135H350" stroke="#bfccc9" stroke-width="2"/><path d="M310 12V130M279 16H331V45H279Z" fill="none" stroke="#899998" stroke-width="4"/><path d="M272 47H302M276 48L282 66H293L299 48" fill="none" stroke="#bf682d" stroke-width="3"/><g class="story-shooter"><rect x="36" y="67" width="43" height="39" rx="9" fill="#247d91"/><rect x="39" y="41" width="37" height="31" rx="9" fill="#c5e8ee" stroke="#247d91" stroke-width="3"/><circle cx="50" cy="53" r="3" fill="#173d4a"/><circle cx="65" cy="53" r="3" fill="#173d4a"/><path d="M51 62H64M49 109V132M68 109V132" stroke="#247d91" stroke-width="5"/><path class="story-arm" d="M77 81L94 66L96 47" stroke="#247d91" stroke-width="7" fill="none" stroke-linecap="round"/></g><g class="story-ball"><circle cx="97" cy="40" r="11" fill="#df8128" stroke="#824615" stroke-width="2"/><path d="M87 40H107M97 30V50" stroke="#824615" stroke-width="1.5"/></g><text x="166" y="128" data-story-stage-label font-size="17" fill="#48605e" text-anchor="middle"></text></svg><div class="story-shot-row" data-story-shots></div>` : `<div class="story-checkout"><span>🤖 🛒</span><strong>${dual('New arrivals','新しい到着')}</strong><b data-story-arrival-count>0</b></div><div class="story-clock"><span>0</span><span data-story-clock>${dual('Ready','準備OK')}</span><span data-story-end>10 min</span></div><div class="story-timeline" data-story-timeline></div>`}</div>
      <div class="story-actions"><button type="button" data-story-run="1">${nba ? dual('Shoot one set','1セット投げる') : dual('Watch one window','1回の時間を再生')}</button><button type="button" data-story-run="100">${dual('Try 100 sets','100回試す')}</button><button type="button" data-story-run="1000">${dual('Try 1,000 sets','1,000回試す')}</button><button type="button" class="story-reset" data-story-reset>${dual('Reset','リセット')}</button></div><p class="story-status" data-story-status role="status">${dual('Predict the highlighted probability before running.','試す前に、強調した結果の確率を予想しよう。')}</p></article>
      <article class="story-card story-results"><div class="story-card-heading"><h5>${dual('Theory vs observed results','理論と実測を比べる')}</h5><span>${dual('Tap a bar to choose x','棒を押して x を選ぶ')}</span></div><div class="story-chart" data-story-chart></div><div class="story-legend"><span class="story-theory">${dual('Theory (line)','理論（線）')}</span><span class="story-observed">${dual('Observed (bars)','実測（棒）')}</span><span class="story-selected">${dual('Highlighted result','注目する結果')}</span></div><div class="story-metrics"><div><span>${dual('Completed sets','完了したセット')}</span><strong data-story-total>0</strong></div><div><span>${dual('Theoretical probability','理論の確率')}</span><strong data-story-theory></strong></div><div><span>${dual('Observed proportion','実測の割合')}</span><strong data-story-observed>—</strong></div><div><span>${dual(nba ? 'Average makes per set' : 'Average arrivals per window',nba ? '1セットの平均成功数' : '1回の平均到着人数')}</span><strong data-story-average>—</strong></div></div><div class="story-model-moments" data-story-moments></div><p class="story-aha" data-story-aha></p></article></div>
      <p class="story-assumptions">${nba ? dual('Teaching setting from Yoh’s 2025 slides: π = 0.93, not a current NBA statistic. Attempts are independent with a constant make probability. Changing n or π clears the old sample.','Yohの2025年講義の設定 π = 0.93。現在のNBA成績ではありません。独立・成功率一定のモデルです。n・πを変えると実測を消去します。') : dual('Illustrative Costco story, not measured store data. Independent arrivals at a constant rate. Arrival count alone does not tell you queue length or when a shift ends. Changing rate or duration clears the sample.','コストコは仮想の授業例で、実測値ではありません。独立・一定の到着率を仮定。到着人数だけでは待ち人数や退勤時刻は分かりません。率・時間を変えると実測を消去します。')}</p>`;
  }

  function init(root) {
    if (root.dataset.storyReady) return;
    root.dataset.storyReady = 'true';
    const nba = root.dataset.week3Story === 'nba';
    root.innerHTML = markup(nba ? 'nba' : 'costco');
    const q = selector => root.querySelector(selector);
    let n = 5, p = 0.93, rate = 5, minutes = 10, x = nba ? 4 : 3, mode = nba ? 'tail' : 'exact';
    let counts = [], total = 0, sum = 0, token = 0, running = false, status = 'ready', progress = 0, goal = 0;
    const lambda = () => rate * minutes / 10;
    const pmf = value => nba ? binomial(n, p, value) : poisson(lambda(), value);
    const selected = value => mode === 'tail' ? value >= x : value === x;
    const observedCount = () => counts.reduce((value, count, index) => value + (selected(index) ? count : 0), 0);
    function updateStatus() {
      q('[data-story-status]').textContent = status === 'changed'
        ? t('Model changed. Previous samples cleared; predict again.','条件が変わったので実測を消去しました。もう一度予想しよう。')
        : status === 'reset' ? t('Results cleared. Theory stays visible.','実測を消去しました。理論の確率はそのまま表示。')
        : status === 'running' ? (goal > 1 ? t(`${num(progress)} / ${num(goal)} new sets complete. Reset stops the run.`, `今回の${num(goal)}回中、${num(progress)}回完了。リセットで中止。`) : t('Running… Reset stops the run.','実行中… リセットで中止できます。'))
        : status === 'completed' ? t(`${num(total)} sets recorded. Compare the highlighted theoretical and observed probabilities.`, `${num(total)}セットを記録。強調した結果の理論と実測の割合を比べよう。`)
        : t('Predict the highlighted probability before running.','試す前に、強調した結果の確率を予想しよう。');
    }

    function drawChart() {
      const max = nba ? n : Math.max(x, counts.length - 1, Math.ceil(lambda() + 4 * Math.sqrt(lambda()) + 1));
      const maxY = Math.min(1, Math.max(.2, ...Array.from({length: max + 1}, (_, i) => pmf(i)), ...counts.map(v => total ? v / total : 0)) * 1.15);
      const width = 600, left = 46, top = 24, bottom = 243, right = 585, step = (right - left) / (max + 1);
      const y = value => bottom - value / maxY * (bottom - top);
      let svg = `<svg viewBox="0 0 ${width} 280" role="img" aria-label="${t('Probability of each count, theory and observed','各人数・成功数の確率：理論と実測')}"><text x="${left}" y="15" fill="#66736f" font-size="12">${t('Probability (%)','確率（％）')}</text>`;
      for (let i = 0; i <= 4; i++) {
        const value = maxY * i / 4;
        svg += `<path d="M${left} ${y(value)}H${right}" stroke="#e0e8e3"/><text x="${left - 7}" y="${y(value) + 4}" text-anchor="end" fill="#66736f" font-size="12">${(value * 100).toFixed(0)}</text>`;
      }
      const path = [];
      for (let i = 0; i <= max; i++) {
        const cx = left + step * (i + .5), prob = pmf(i), obs = total ? (counts[i] || 0) / total : 0;
        path.push(`${cx},${y(prob)}`);
        svg += `<g data-story-bar="${i}" tabindex="0" role="button" aria-label="${t('Select count','数を選ぶ')} ${i}"><title>${i}: ${t('theory','理論')} ${pct(prob)}; ${t('observed','実測')} ${total ? pct(obs) : '—'}</title><rect x="${left + step * i}" y="${top}" width="${step}" height="${bottom - top}" fill="transparent"/><rect x="${cx - step * .30}" y="${y(obs)}" width="${step * .60}" height="${bottom - y(obs)}" rx="2" fill="${selected(i) ? '#31785b' : '#adc6b8'}"/>${max <= 25 || i % 5 === 0 || i === x ? `<text x="${cx}" y="263" text-anchor="middle" font-size="12" fill="#485951">${i}</text>` : ''}</g>`;
      }
      svg += `<polyline points="${path.join(' ')}" fill="none" stroke="#176d82" stroke-width="2.5" pointer-events="none"/>`;
      for (let i = 0; i <= max; i++) svg += `<circle cx="${left + step * (i + .5)}" cy="${y(pmf(i))}" r="${selected(i) ? 4 : 2.5}" fill="${selected(i) ? '#31785b' : '#176d82'}" pointer-events="none"/>`;
      svg += `<text x="${right}" y="278" text-anchor="end" fill="#66736f" font-size="12">${nba ? t('Makes in one set · x','1セットの成功数 · x') : t('New arrivals in one window · x','1回の到着人数 · x')}</text></svg>`;
      q('[data-story-chart]').innerHTML = svg;
    }

    function update() {
      const probability = mode === 'tail' ? tail(pmf, x) : pmf(x);
      const a = nba ? n*p : lambda(), pi = p.toFixed(2), lam = lambda().toFixed(2);
      const generic = nba ? String.raw`\Pr(X=x)={}_nC_x\pi^x(1-\pi)^{n-x}` : String.raw`\Pr(X=x)=\frac{\lambda^xe^{-\lambda}}{x!}`;
      setMath(q('[data-story-symbolic]'), generic, nba ? 'Pr(X = x) = nCx × πˣ × (1−π)ⁿ⁻ˣ' : 'Pr(X = x) = λˣ × exp(−λ) / x!');
      const substituted = mode === 'tail'
        ? nba ? String.raw`\Pr(X\ge${x})=\sum_{k=${x}}^{${n}}{}_{${n}}C_k(${pi})^k(1-${pi})^{${n}-k}` : x === 0 ? String.raw`\Pr(X\ge0)=1` : String.raw`\Pr(X\ge${x})=1-\sum_{k=0}^{${x-1}}\frac{${lam}^ke^{-${lam}}}{k!}`
        : nba ? String.raw`\Pr(X=${x})={}_{${n}}C_{${x}}(${pi})^{${x}}(1-${pi})^{${n-x}}` : String.raw`\Pr(X=${x})=\frac{${lam}^{${x}}e^{-${lam}}}{${x}!}`;
      setMath(q('[data-story-substitution]'), String.raw`${substituted}\approx ${(100 * probability).toFixed(2)}\%`, `Pr(X ${mode === 'tail' ? '≥' : '='} ${x}) ≈ ${pct(probability)}`);
      q('[data-story-reading]').textContent = nba
        ? t(`${n} shots, each with ${pct(p)} make probability → ${mode === 'tail' ? 'at least' : 'exactly'} ${x} makes: ${pct(probability)}.`, `${n}本、1本の成功率${pct(p)} → ${x}本${mode === 'tail' ? '以上' : 'ちょうど'}成功する確率：${pct(probability)}。`)
        : t(`${minutes} minutes → average λ = ${lam} arrivals → ${mode === 'tail' ? 'at least' : 'exactly'} ${x} arrivals: ${pct(probability)}.`, `${minutes}分間 → 平均 λ = ${lam}人 → ${x}人${mode === 'tail' ? '以上' : 'ちょうど'}来る確率：${pct(probability)}。`);
      q('[data-story-model]').textContent = nba ? `B(${n}, ${pi})` : `Poisson(${lam})`;
      q('[data-story-total]').textContent = num(total);
      q('[data-story-theory]').textContent = pct(probability);
      q('[data-story-observed]').textContent = total ? pct(observedCount() / total) : '—';
      q('[data-story-average]').textContent = total ? (sum / total).toFixed(2) : '—';
      setMath(q('[data-story-moments]'), nba ? String.raw`E(X)=${n}\times${pi}=${(n*p).toFixed(2)},\quad\operatorname{Var}(X)=${(n*p*(1-p)).toFixed(4)}` : String.raw`\lambda=${rate}\times\frac{${minutes}}{10}=${lam},\quad E(X)=\operatorname{Var}(X)=${lam}`, `E(X) = ${a.toFixed(2)}`);
      q('[data-story-aha]').textContent = nba
        ? t('Aha: one shot’s probability is not the probability of making four of five. More sets make the observed distribution tend toward the model—not a guarantee of exact agreement.', '発見：1本の成功率と「5本中4本成功」の確率は別もの。セットを増やすと実測が理論に近づく傾向がありますが、完全一致は保証されません。')
        : t('Aha: λ is an average, not a maximum. Even with λ = 5, six or more arrivals are possible. Double the time at the same rate, and λ doubles.', '発見：λは平均であって上限ではありません。平均5人でも、6人以上来ます。同じ到着率なら、時間が2倍でλも2倍。');
      if (nba) {
        q('[data-story-n-output]').textContent = n;
        q('[data-story-p-output]').textContent = pct(p);
        q('[data-story-x]').max = n;
      } else {
        q('[data-story-rate-output]').textContent = rate;
        q('[data-story-minutes-output]').textContent = minutes;
        q('[data-story-end]').textContent = t(`${minutes} min`, `${minutes}分`);
      }
      q('[data-story-x]').value = x;
      q('[data-story-mode]').options[0].textContent = t('Exactly x','ちょうど x');
      q('[data-story-mode]').options[1].textContent = t('x or more','x 以上');
      updateStatus();
      if (!nba && !running && !total) q('[data-story-clock]').textContent=t('Ready','準備OK');
      drawChart();
    }

    function clear(message = false) {
      token++; running = false; counts = []; total = sum = 0;status=message?'changed':'reset';
      root.querySelectorAll('[data-story-run]').forEach(b => b.disabled = false);
      if (nba) {
        q('[data-story-shots]').replaceChildren();
        q('[data-story-stage-label]').textContent = '';
        q('[data-story-stage]').classList.remove('is-shot','is-miss');
      } else {q('[data-story-timeline]').replaceChildren();q('[data-story-arrival-count]').textContent = '0';q('[data-story-clock]').textContent = t('Ready','準備OK');}
      q('[data-story-status]').textContent = message ? t('Model changed. Previous samples cleared; predict again.','条件が変わったので実測を消去しました。もう一度予想しよう。') : t('Results cleared. Theory stays visible.','実測を消去しました。理論の確率はそのまま表示。');
      update();
    }
    const record = value => {while(counts.length<=value) counts.push(0);counts[value]++;total++;sum += value;};
    function showShots(results) {
      q('[data-story-shots]').innerHTML = results.map(hit => `<span class="${hit ? 'is-make' : 'is-miss'}">${hit ? '●' : '×'}</span>`).join('');
      q('[data-story-stage-label]').textContent = t(`${results.filter(Boolean).length} / ${results.length} makes`, `${results.length}本中 ${results.filter(Boolean).length}本成功`);
    }
    function flash(hit) {
      const stage = q('[data-story-stage]');
      stage.classList.remove('is-shot','is-miss');
      void stage.offsetWidth;
      stage.classList.toggle('is-miss', !hit);stage.classList.add('is-shot');
    }
    function showArrivalTimes(times, visible = times.length) {
      q('[data-story-arrival-count]').textContent = visible;
      q('[data-story-timeline]').innerHTML = times.slice(0, visible).map(time => `<span style="left:${2 + time * 94}%" title="${(time * minutes).toFixed(2)} ${t('min','分')}">●</span>`).join('');
    }
    async function run(amount) {
      if (running) return;
      const own = ++token;running = true;status='running';progress=0;goal=amount;updateStatus();
      root.querySelectorAll('[data-story-run]').forEach(b => b.disabled = true);
      q('[data-story-status]').textContent = t('Running… Reset stops the run.','実行中… リセットで中止できます。');
      if (amount === 1) {
        if (nba) {
          const results = [];
          for (let shot = 0; shot < n; shot++) {
            const hit = Math.random() < p;flash(hit);
            await wait(matchMedia('(prefers-reduced-motion: reduce)').matches ? 40 : 330);
            if (own !== token) return;
            results.push(hit);showShots(results);
          }
          record(results.filter(Boolean).length);
        } else {
          const times = arrivals(lambda());
          let visible = 0;
          for (let frame = 0; frame <= 45; frame++) {
            if (own !== token) return;
            const elapsed = frame / 45;
            while (visible < times.length && times[visible] <= elapsed) visible++;
            showArrivalTimes(times, visible);
            q('[data-story-clock]').textContent = t(`${(elapsed * minutes).toFixed(1)} min`, `${(elapsed * minutes).toFixed(1)}分`);
            await wait(45);
          }
          record(times.length);
        }
        update();
      } else {
        const batch = Math.max(1, Math.ceil(amount / 80));
        for (let done = 0; done < amount;) {
          if (own !== token) return;
          for (let i = 0; i < batch && done < amount; i++, done++) {
            if (nba) {
              const results = Array.from({length:n}, () => Math.random() < p);
              record(results.filter(Boolean).length);
              if (i === 0) {showShots(results);flash(results.at(-1));}
            } else {
              const times = arrivals(lambda());record(times.length);
              if (i === 0) {showArrivalTimes(times);q('[data-story-clock]').textContent = t(`${minutes} min complete`,`${minutes}分完了`);}
            }
          }
          progress=done;update();
          q('[data-story-status]').textContent = t(`${num(done)} / ${num(amount)} new sets complete.`, `今回の${num(amount)}回中、${num(done)}回完了。`);
          await wait(65);
        }
      }
      if (own !== token) return;
      running = false;status='completed';root.querySelectorAll('[data-story-run]').forEach(b => b.disabled = false);
      q('[data-story-status]').textContent = t(`${num(total)} sets recorded. Compare the highlighted theoretical and observed probabilities.`, `${num(total)}セットを記録。強調した結果の理論と実測の割合を比べよう。`);
    }

    root.addEventListener('input', event => {
      const el = event.target;
      if (el.matches('[data-story-x]')) {if(el.value === '') return;x = Math.max(0, Math.min(nba ? n : 60, Math.round(Number(el.value))));update();return;}
      if (el.matches('[data-story-n]')) {n=Number(el.value);x=Math.min(x,n);clear(true);}
      if (el.matches('[data-story-p]')) {p=Number(el.value)/100;clear(true);}
      if (el.matches('[data-story-rate]')) {rate=Number(el.value);clear(true);}
      if (el.matches('[data-story-minutes]')) {minutes=Number(el.value);clear(true);}
    });
    root.addEventListener('change', event => {if(event.target.matches('[data-story-mode]')) {mode=event.target.value;update();}});
    root.addEventListener('click', event => {
      const el = event.target.closest('button,[data-story-bar]');if(!el) return;
      if (el.hasAttribute('data-story-run')) run(Number(el.dataset.storyRun));
      if (el.hasAttribute('data-story-reset')) clear();
      if (el.hasAttribute('data-story-bar')) {x=Number(el.dataset.storyBar);mode='exact';q('[data-story-mode]').value=mode;update();}
      if (el.hasAttribute('data-story-preset')) {
        if(nba) {p=el.dataset.storyPreset==='curry'?.93:.65;n=5;x=4;mode='tail';q('[data-story-p]').value=p*100;q('[data-story-n]').value=n;clear(true);}
        else {x=el.dataset.storyPreset==='three'?3:5;mode=x===3?'exact':'tail';update();}
        q('[data-story-mode]').value=mode;
      }
    });
    root.addEventListener('keydown', event => {if((event.key==='Enter'||event.key===' ')&&event.target.hasAttribute('data-story-bar')) {event.preventDefault();event.target.dispatchEvent(new MouseEvent('click',{bubbles:true}));}});
    new MutationObserver(update).observe(document.documentElement, {attributes:true,attributeFilter:['data-language']});
    update();
  }
  const initAll = () => document.querySelectorAll('[data-week3-story]').forEach(init);
  document.addEventListener('statsb:agenda-rendered',initAll);
  initAll();
})();
