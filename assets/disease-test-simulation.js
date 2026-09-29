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
      const greenDots = Math.round(conditional * 1000);
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
      root.querySelector('[data-test-percent]').textContent = percentText;
      root.querySelector('[data-test-bar-true]').style.width = `${100 * truePositive / population}%`;
      root.querySelector('[data-test-bar-false]').style.width = `${100 * falsePositive / population}%`;
      root.querySelector('[data-test-bar-negative]').style.width = `${100 * negativeTotal / population}%`;
      root.querySelector('[data-test-overview-bar]').setAttribute('aria-label', t(
        `${trueText} truly ill and positive; ${falseText} false positives; ${decimal.format(negativeTotal)} negative results. The green sliver is enlarged for visibility.`,
        `本当に病気で陽性${trueText}人、病気でないのに陽性${falseText}人、陰性${decimal.format(negativeTotal)}人。緑の線は見やすく拡大しています。`
      ));
      root.querySelector('[data-test-takeaway]').textContent =
        t(`Even with a positive test, the chance of actually having the disease is ${percentText}—about 1 in ${count.format(Math.round(1 / conditional))} positive results.`,
          `陽性でも、本当に病気である確率は${percentText}。陽性者およそ${count.format(Math.round(1 / conditional))}人に1人です。`);
      root.querySelector('[data-test-step-true]').textContent = `1 × ${decimal.format(1 - error)} = ${trueText}${unit}`;
      root.querySelector('[data-test-step-false]').textContent = `${count.format(population - 1)} × ${decimal.format(error)} = ${falseText}${unit}`;
      root.querySelector('[data-test-step-total]').textContent = `${trueText} + ${falseText} = ${totalText}${unit}`;
      root.querySelector('[data-test-step-answer]').textContent = `${trueText} ÷ ${totalText} × 100 = ${percentText}`;

      const fragment = document.createDocumentFragment();
      for (let index = 0; index < 1000; index += 1) {
        const dot = document.createElement('span');
        dot.className = index < greenDots ? 'test-dot-sick' : 'test-dot-well';
        fragment.append(dot);
      }
      dots.replaceChildren(fragment);

      const visualNote = conditional > 0 && greenDots === 0
        ? t('The green share is too small to appear in this 1,000-dot sketch.', 'この縮図では小さすぎて緑の点が表示されません。')
        : t(`In this sketch of 1,000 positive results, about ${greenDots} ${greenDots === 1 ? 'dot is' : 'dots are'} green.`, `陽性者1000人の縮図では、緑が約${greenDots}人です。`);
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
