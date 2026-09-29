(() => {
  function setupDiseaseTest() {
    const root = document.querySelector('[data-test-simulation]');
    if (!root || root.dataset.testInitialized) return;
    root.dataset.testInitialized = 'true';

    const populationInput = root.querySelector('[data-test-population]');
    const errorInput = root.querySelector('[data-test-error]');
    const message = root.querySelector('[data-test-message]');
    const revealButton = root.querySelector('[data-test-reveal]');
    const answer = root.querySelector('[data-test-answer]');
    const dots = root.querySelector('[data-test-dots]');
    const bar = root.querySelector('[data-test-overview-bar]');
    const leaders = root.querySelector('[data-test-leaders]');
    const count = new Intl.NumberFormat('ja-JP');
    const decimal = new Intl.NumberFormat('ja-JP', { maximumFractionDigits:6 });
    const percent = new Intl.NumberFormat('ja-JP', { maximumSignificantDigits:3 });
    const probability = new Intl.NumberFormat('en-US', { maximumFractionDigits:12 });
    const t = (english, japanese) => document.documentElement.dataset.language === 'en' ? english : japanese;
    let barValues = null;

    function drawBar() {
      if (!barValues || !bar.clientWidth) return;
      const { truePositive, falsePositive, negativeTotal, population } = barValues;
      const width = bar.clientWidth;
      const usable = width - 12;
      const first = Math.max(4, usable * truePositive / population);
      const second = Math.max(4, usable * falsePositive / population);
      const third = Math.max(4, usable - first - second);
      const widths = [first, second, third];
      ['true', 'false', 'negative'].forEach((name, index) => {
        root.querySelector(`[data-test-bar-${name}]`).style.width = `${widths[index]}px`;
      });
      const targets = [first / 2, first + 6 + second / 2, first + second + 12 + third / 2];
      const colors = ['#278678', '#996847', '#a9a6a1'];
      const barLeft = bar.getBoundingClientRect().left;
      const labels = [...root.querySelectorAll('.test-bar-labels > div')];
      leaders.setAttribute('viewBox', `0 0 ${width} 34`);
      leaders.replaceChildren(...labels.map((label, index) => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const source = label.getBoundingClientRect().left + label.clientWidth / 2 - barLeft;
        line.setAttribute('d', `M ${source} 1 L ${source} 10 L ${targets[index]} 33`);
        line.setAttribute('stroke', colors[index]);
        line.setAttribute('fill', 'none');
        line.setAttribute('stroke-width', '1.5');
        return line;
      }));
    }

    function update() {
      const population = Number(populationInput.value);
      const wrongPercent = Number(errorInput.value);
      if (!Number.isInteger(population) || population < 2 || population > 100000000 ||
          !Number.isFinite(wrongPercent) || wrongPercent < 0 || wrongPercent > 50 ||
          populationInput.value === '' || errorInput.value === '') {
        message.textContent = t('Enter a whole-number population from 2 to 100 million and an error rate from 0% to 50%.', '罹患率の分母は2〜1億の整数、誤判定率は0〜50%で入力してください。');
        answer.hidden = true;
        revealButton.setAttribute('aria-expanded', 'false');
        revealButton.textContent = t('Reveal answer →', '答えを見る →');
        return;
      }
      message.textContent = '';
      const error = wrongPercent / 100;
      const truePositive = 1 - error;
      const falsePositive = (population - 1) * error;
      const positiveTotal = truePositive + falsePositive;
      const negativeTotal = population - positiveTotal;
      const conditional = positiveTotal ? truePositive / positiveTotal : 0;
      const actualDots = positiveTotal >= 20 && positiveTotal <= 1500;
      const dotCount = actualDots ? Math.round(positiveTotal) : 1000;
      const greenDots = Math.round(conditional * dotCount);
      const trueText = decimal.format(truePositive);
      const falseText = decimal.format(falsePositive);
      const totalText = decimal.format(positiveTotal);
      const percentText = `${percent.format(conditional * 100)}%`;
      const unit = t(' people', '人');
      const prevalence = 1 / population;
      const positiveProbability = positiveTotal / population;
      const jointProbability = truePositive / population;

      root.querySelector('[data-test-sensitivity]').textContent = `${decimal.format(100 - wrongPercent)}%`;
      root.querySelector('[data-test-false-rate]').textContent = `${decimal.format(wrongPercent)}%`;
      root.querySelector('[data-test-cohort-heading]').textContent = t(`If ${count.format(population)} people are tested`, `${count.format(population)}人を検査したら`);
      root.querySelector('[data-test-true]').textContent = `${trueText}${unit}`;
      root.querySelector('[data-test-false]').textContent = `${falseText}${unit}`;
      root.querySelector('[data-test-negative]').textContent = `${decimal.format(negativeTotal)}${unit}`;
      root.querySelector('[data-test-percent]').textContent = percentText;
      barValues = { truePositive, falsePositive, negativeTotal, population };
      drawBar();
      bar.setAttribute('aria-label', t(`${trueText} truly ill and positive, ${falseText} false positives, ${decimal.format(negativeTotal)} negative results. The narrow green part is enlarged for visibility.`, `本当に病気で陽性${trueText}人、偽陽性${falseText}人、陰性${decimal.format(negativeTotal)}人。緑の部分は見えるように拡大しています。`));
      root.querySelector('[data-test-takeaway]').textContent =
        t(`Even after a positive result, Pr(B|A) is ${percentText}. In this group, ${trueText} of ${totalText} expected positive results come from people who actually have the disease.`,
          `陽性だったときの Pr(B|A) は${percentText}。この集団では陽性の期待人数${totalText}人のうち、本当に病気なのは${trueText}人です。`);
      root.querySelector('[data-test-step-prevalence]').textContent = `Pr(B) = 1/${count.format(population)} = ${probability.format(prevalence)}`;
      root.querySelector('[data-test-step-complement]').textContent = `Pr(Bᶜ) = 1 − Pr(B) = ${probability.format(1 - prevalence)}`;
      root.querySelector('[data-test-step-accuracy]').textContent = `Pr(A|B) = ${probability.format(1 - error)} · Pr(A|Bᶜ) = ${probability.format(error)}`;
      root.querySelector('[data-test-step-positive]').textContent = 'Pr(A) = Pr(A|B)Pr(B) + Pr(A|Bᶜ)Pr(Bᶜ)';
      root.querySelector('[data-test-step-positive-values]').textContent = `= ${probability.format(1 - error)} × ${probability.format(prevalence)} + ${probability.format(error)} × ${probability.format(1 - prevalence)} = ${probability.format(positiveProbability)}`;
      root.querySelector('[data-test-step-answer]').textContent = 'Pr(B|A) = Pr(A∩B) / Pr(A)';
      root.querySelector('[data-test-step-joint]').textContent = `Pr(A∩B) = Pr(A|B)Pr(B) = ${probability.format(jointProbability)}`;
      root.querySelector('[data-test-step-answer-values]').textContent = `= ${probability.format(jointProbability)} / ${probability.format(positiveProbability)} = ${probability.format(conditional)} = ${percentText}`;

      root.querySelector('[data-test-dots-heading]').textContent = actualDots
        ? t(`About ${count.format(dotCount)} positive results in this group`, `この集団の陽性者は約${count.format(dotCount)}人`)
        : t('A 1,000-dot model of the positive results', '陽性者の割合を示す1,000点のモデル');
      root.querySelector('[data-test-dots-scale]').textContent = actualDots
        ? t('One dot ≈ one positive result; expected counts are rounded.', '点1つ ≈ 陽性者1人。期待人数を四捨五入。')
        : t('This is a proportional model, not the literal number of people.', '割合の模式図であり、実際の人数とは異なります。');

      const fragment = document.createDocumentFragment();
      for (let index = 0; index < dotCount; index += 1) {
        const dot = document.createElement('span');
        dot.className = index < greenDots ? `test-dot-sick${index === 0 ? ' test-dot-highlight' : ''}` : 'test-dot-well';
        fragment.append(dot);
      }
      dots.replaceChildren(fragment);
      root.querySelector('[data-test-green-count]').textContent = t(`≈ ${count.format(greenDots)} dot${greenDots === 1 ? '' : 's'}`, `約${count.format(greenDots)}点`);
      root.querySelector('[data-test-brown-count]').textContent = t(`≈ ${count.format(dotCount - greenDots)} dots`, `約${count.format(dotCount - greenDots)}点`);
      dots.setAttribute('aria-label', t(
        `${dotCount} dots for positive results: approximately ${greenDots} green for actual disease, ${dotCount - greenDots} brown for false positives. Negative results are excluded. ${actualDots ? 'About one dot per expected positive result.' : 'This is a proportional model.'}`,
        `陽性者を表す${dotCount}点：本当に病気の緑が約${greenDots}点、偽陽性の茶色が約${dotCount - greenDots}点。陰性者は含みません。${actualDots ? '点1つは期待人数の約1人に対応します。' : 'これは割合を示す模式図です。'}`
      ));
      const visualNote = conditional > 0 && greenDots === 0
        ? t('The true-positive share is too small to make one green dot at this scale.', 'この縮尺では、本当に病気の割合が小さすぎて緑の点を1つ描けません。')
        : t(`${greenDots} of ${dotCount} dots are green.`, `${dotCount}点のうち緑は${greenDots}点です。`);
      root.querySelector('.test-controls').setAttribute('aria-label', t('Test assumptions', '検査の条件'));
      root.querySelector('[data-test-explanation]').textContent =
        t(`${visualNote} The exact answer comes from the formula above; fractional counts are expected averages, not fractions of a person.`,
          `${visualNote} 正確な答えは上の式で計算します。小数の人数は期待値で、1人を分割しているわけではありません。`);
      revealButton.textContent = answer.hidden ? t('Reveal answer →', '答えを見る →') : t('Hide answer ↑', '答えを隠す ↑');
    }

    [populationInput, errorInput].forEach(input => input.addEventListener('input', update));
    root.querySelector('[data-test-reset]').addEventListener('click', () => {
      populationInput.value = '100000';
      errorInput.value = '1';
      update();
    });
    revealButton.addEventListener('click', () => {
      const opening = answer.hidden;
      answer.hidden = !opening;
      revealButton.setAttribute('aria-expanded', String(opening));
      revealButton.textContent = opening ? t('Hide answer ↑', '答えを隠す ↑') : t('Reveal answer →', '答えを見る →');
    });
    new MutationObserver(update).observe(document.documentElement, { attributes:true, attributeFilter:['data-language'] });
    new ResizeObserver(drawBar).observe(bar);
    document.getElementById('week-1-test-tab')?.addEventListener('click', () => requestAnimationFrame(drawBar));
    update();
  }

  document.addEventListener('statsb:agenda-rendered', setupDiseaseTest);
  setupDiseaseTest();
})();
