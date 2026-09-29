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

    function update() {
      const population = Number(populationInput.value);
      const wrongPercent = Number(errorInput.value);
      if (!Number.isInteger(population) || population < 2 || population > 100000000 ||
          !Number.isFinite(wrongPercent) || wrongPercent < 0 || wrongPercent > 50 ||
          populationInput.value === '' || errorInput.value === '') {
        message.textContent = '罹患率の分母は2〜1億の整数、誤判定率は0〜50%で入力してください。';
        answer.hidden = true;
        revealButton.setAttribute('aria-expanded', 'false');
        revealButton.textContent = '答えを見る →';
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

      root.querySelector('[data-test-sensitivity]').textContent = `${decimal.format(100 - wrongPercent)}%`;
      root.querySelector('[data-test-false-rate]').textContent = `${decimal.format(wrongPercent)}%`;
      root.querySelector('[data-test-cohort-heading]').textContent = `${count.format(population)}人を検査したら`;
      root.querySelector('[data-test-true]').textContent = `${trueText}人`;
      root.querySelector('[data-test-false]').textContent = `${falseText}人`;
      root.querySelector('[data-test-negative]').textContent = `${decimal.format(negativeTotal)}人`;
      root.querySelector('[data-test-percent]').textContent = percentText;
      root.querySelector('[data-test-bar-true]').style.width = `${100 * truePositive / population}%`;
      root.querySelector('[data-test-bar-false]').style.width = `${100 * falsePositive / population}%`;
      root.querySelector('[data-test-bar-negative]').style.width = `${100 * negativeTotal / population}%`;
      root.querySelector('[data-test-overview-bar]').setAttribute('aria-label', `本当に病気で陽性${trueText}人、病気でないのに陽性${falseText}人、陰性${decimal.format(negativeTotal)}人。緑の線は見やすく拡大しています。`);
      root.querySelector('[data-test-takeaway]').textContent =
        `陽性でも、本当に病気である確率は${percentText}。陽性者およそ${count.format(Math.round(1 / conditional))}人に1人です。`;
      root.querySelector('[data-test-step-true]').textContent = `1 × ${decimal.format(1 - error)} = ${trueText}人`;
      root.querySelector('[data-test-step-false]').textContent = `${count.format(population - 1)} × ${decimal.format(error)} = ${falseText}人`;
      root.querySelector('[data-test-step-total]').textContent = `${trueText} + ${falseText} = ${totalText}人`;
      root.querySelector('[data-test-step-answer]').textContent = `${trueText} ÷ ${totalText} × 100 = ${percentText}`;

      const fragment = document.createDocumentFragment();
      for (let index = 0; index < 1000; index += 1) {
        const dot = document.createElement('span');
        dot.className = index < greenDots ? 'test-dot-sick' : 'test-dot-well';
        fragment.append(dot);
      }
      dots.replaceChildren(fragment);

      const visualNote = conditional > 0 && greenDots === 0
        ? 'この縮図では小さすぎて緑の点が表示されません。'
        : `陽性者1000人の縮図では、緑が約${greenDots}人です。`;
      root.querySelector('[data-test-explanation]').textContent =
        `${visualNote} 小数の人数は${count.format(population)}人を検査したときの平均的な期待値で、1人を分割しているわけではありません。`;
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
      revealButton.textContent = opening ? '答えを隠す ↑' : '答えを見る →';
    });
    update();
  }

  document.addEventListener('statsb:agenda-rendered', setupDiseaseTest);
  setupDiseaseTest();
})();
