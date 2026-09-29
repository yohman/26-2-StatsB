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
    const excludedDots = root.querySelector('[data-test-excluded-dots]');
    const count = new Intl.NumberFormat('ja-JP');
    const decimal = new Intl.NumberFormat('ja-JP', { maximumFractionDigits:6 });
    const percent = new Intl.NumberFormat('ja-JP', { maximumSignificantDigits:3 });
    const t = (english, japanese) => document.documentElement.dataset.language === 'en' ? english : japanese;

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
      const greenDots = Math.round(conditional * 2000);
      const trueText = decimal.format(truePositive);
      const falseText = decimal.format(falsePositive);
      const totalText = decimal.format(positiveTotal);
      const percentText = `${percent.format(conditional * 100)}%`;
      const unit = t(' people', '人');

      root.querySelector('[data-test-sensitivity]').textContent = `${decimal.format(100 - wrongPercent)}%`;
      root.querySelector('[data-test-false-rate]').textContent = `${decimal.format(wrongPercent)}%`;
      root.querySelector('[data-test-cohort-heading]').textContent = t(`If ${count.format(population)} people are tested`, `${count.format(population)}人を検査したら`);
      root.querySelector('[data-test-true]').textContent = `${trueText}${unit}`;
      root.querySelector('[data-test-false]').textContent = `${falseText}${unit}`;
      root.querySelector('[data-test-negative]').textContent = `${decimal.format(negativeTotal)}${unit}`;
      root.querySelector('[data-test-positive-total]').textContent = `${totalText}${unit}`;
      root.querySelector('[data-test-percent]').textContent = percentText;
      root.querySelector('[data-test-takeaway]').textContent =
        t(`Even with a positive test, the chance of actually having the disease is ${percentText}—about 1 in ${count.format(Math.round(1 / conditional))} positive results.`,
          `陽性でも、本当に病気である確率は${percentText}。陽性者およそ${count.format(Math.round(1 / conditional))}人に1人です。`);
      root.querySelector('[data-test-step-true]').textContent = `1 × ${decimal.format(1 - error)} = ${trueText}${unit}`;
      root.querySelector('[data-test-step-false]').textContent = `${count.format(population - 1)} × ${decimal.format(error)} = ${falseText}${unit}`;
      root.querySelector('[data-test-step-total]').textContent = `${trueText} + ${falseText} = ${totalText}${unit}`;
      root.querySelector('[data-test-step-answer]').textContent = `${trueText} ÷ ${totalText} × 100 = ${percentText}`;

      const fragment = document.createDocumentFragment();
      for (let index = 0; index < 2000; index += 1) {
        const dot = document.createElement('span');
        dot.className = index < greenDots ? `test-dot-sick${index === 0 ? ' test-dot-highlight' : ''}` : 'test-dot-well';
        fragment.append(dot);
      }
      dots.replaceChildren(fragment);
      root.querySelector('[data-test-green-count]').textContent = t(`≈ ${count.format(greenDots)} / 2,000`, `約${count.format(greenDots)} / 2,000`);
      root.querySelector('[data-test-brown-count]').textContent = t(`≈ ${count.format(2000 - greenDots)} / 2,000`, `約${count.format(2000 - greenDots)} / 2,000`);
      dots.setAttribute('aria-label', t(
        `Among 2,000 imagined positive results, approximately ${greenDots} ${greenDots === 1 ? 'dot represents' : 'dots represent'} someone actually ill; the rest represent false positives. Negative results are excluded from this zoom.`,
        `想像上の陽性者2,000人のうち、本当に病気の人を表す緑の点は約${greenDots}個、残りは誤って陽性になった人です。陰性者はこの拡大図に含めません。`
      ));
      const excludedFragment = document.createDocumentFragment();
      for (let index = 0; index < 100; index += 1) {
        const dot = document.createElement('span');
        dot.className = 'test-dot-negative';
        excludedFragment.append(dot);
      }
      excludedDots.replaceChildren(excludedFragment);
      root.querySelector('[data-test-excluded-scale]').textContent = t(
        `These 100 gray dots stand for ${decimal.format(negativeTotal)} negative results; they use a different scale.`,
        `灰色の100点は陰性${decimal.format(negativeTotal)}人を表します。陽性の点とは縮尺が異なります。`
      );

      const visualNote = conditional > 0 && greenDots === 0
        ? t('The green share is too small to appear in this 2,000-dot sketch.', 'この2,000点の縮図では小さすぎて緑の点が表示されません。')
        : t(`In this imagined group of 2,000 positive results, about ${greenDots} ${greenDots === 1 ? 'dot is' : 'dots are'} green.`, `想像上の陽性者2,000人では、緑が約${greenDots}人です。`);
      root.querySelector('.test-controls').setAttribute('aria-label', t('Test assumptions', '検査の条件'));
      root.querySelector('[data-test-explanation]').textContent =
        t(`${visualNote} Fractional counts are expected averages across groups of ${count.format(population)} people, not fractions of one person.`,
          `${visualNote} 小数の人数は${count.format(population)}人を検査したときの平均的な期待値で、1人を分割しているわけではありません。`);
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
    update();
  }

  document.addEventListener('statsb:agenda-rendered', setupDiseaseTest);
  setupDiseaseTest();
})();
