(() => {
  const outcomes = ['o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w'];
  const events = {
    A: new Set(['o', 'p', 'r', 's']),
    B: new Set(['o', 'r', 'u']),
    C: new Set(['t', 'w']),
    D: new Set(['o', 'p', 'q', 'r', 's', 't'])
  };
  const steps = [
    { description: ['Start with a single event: count its white squares out of all nine outcomes.', 'まず1つの事象。該当するマスを9つの結果から数えます。'], expressions: ['A', 'B', 'C'] },
    { description: ['Intersection means both; union means either or both. Watch the highlighted squares change.', '積事象は「両方」、和事象は「少なくとも一方」。色の変わるマスを比べましょう。'], expressions: ['A∩B', 'A∩C', 'B∩C', 'A∪B', 'A∪C', 'B∪C'] },
    { description: ['The condition narrows the sample space. Reverse the condition and the denominator changes.', '条件として分かった事象だけに標本空間を絞ります。条件を逆にすると分母も変わります。'], expressions: ['B|A', 'A|B'] },
    { description: ['Does knowing B change the chance of D? Compare conditional and ordinary probabilities.', 'Bが起きたと知ると、Dの確率は変わる？ 条件付き確率と普通の確率を比べます。'], expressions: ['D', 'D|B', 'B', 'B|D'] }
  ];

  const t = (en, ja) => document.documentElement.dataset.language === 'en' ? en : ja;
  const fraction = (top, bottom) => {
    if (!top) return '0';
    let a = top, b = bottom;
    while (b) [a, b] = [b, a % b];
    return b === 1 || bottom / a === 1 ? String(top / a) : `${top / a}/${bottom / a}`;
  };
  const notation = expression => `P(${expression})`;

  function solve(expression) {
    const conditional = expression.includes('|');
    const intersection = expression.includes('∩');
    const union = expression.includes('∪');
    const [left, right] = expression.split(conditional ? '|' : intersection ? '∩' : union ? '∪' : ' ');
    const base = conditional ? events[right] : new Set(outcomes);
    const matches = new Set(outcomes.filter(cell => conditional || intersection
      ? events[left].has(cell) && (!right || events[right].has(cell))
      : union ? events[left].has(cell) || events[right].has(cell)
      : events[left].has(cell)));
    const numerator = matches.size;
    const denominator = base.size;
    const ratio = fraction(numerator, denominator);
    const formula = conditional
      ? `${notation(expression)} = |${left}∩${right}| / |${right}| = ${numerator}/${denominator}${ratio !== `${numerator}/${denominator}` ? ` = ${ratio}` : ''}`
      : `${notation(expression)} = ${numerator}/9${ratio !== `${numerator}/9` ? ` = ${ratio}` : ''}`;
    return { left, right, base, matches, numerator, denominator, ratio, formula, conditional };
  }

  function setup() {
    const root = document.querySelector('[data-event-simulation]');
    if (!root || root.dataset.eventInitialized) return;
    root.dataset.eventInitialized = 'true';
    const grid = root.querySelector('[data-event-grid]');
    const expressionList = root.querySelector('[data-event-expression-list]');
    const description = root.querySelector('[data-event-step-description]');
    const context = root.querySelector('[data-event-context]');
    const formula = root.querySelector('[data-event-formula]');
    const explanation = root.querySelector('[data-event-explanation]');
    const membership = root.querySelector('[data-event-membership]');
    const note = root.querySelector('[data-event-cell-note]');
    let step = 0;
    let expression = 'A';
    let inspected = null;

    function render() {
      const answer = solve(expression);
      root.querySelectorAll('[data-event-step]').forEach(button => {
        button.setAttribute('aria-pressed', String(Number(button.dataset.eventStep) === step));
      });
      description.textContent = t(...steps[step].description);
      expressionList.replaceChildren(...steps[step].expressions.map(item => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = notation(item);
        button.setAttribute('aria-pressed', String(item === expression));
        button.addEventListener('click', () => { expression = item; inspected = null; render(); });
        return button;
      }));
      grid.replaceChildren(...outcomes.map((cell, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `event-cell ${answer.matches.has(cell) ? 'is-match' : answer.conditional && answer.base.has(cell) ? 'is-base' : 'is-outside'}${inspected === cell ? ' is-inspected' : ''}`;
        button.textContent = cell;
        button.style.setProperty('--cell-order', index);
        button.setAttribute('aria-label', t(`Outcome ${cell}`, `結果 ${cell}`));
        button.setAttribute('aria-pressed', String(inspected === cell));
        button.addEventListener('click', () => { inspected = cell; render(); });
        return button;
      }));
      grid.setAttribute('aria-label', t(`Nine outcomes for ${notation(expression)}. ${answer.numerator} of ${answer.denominator} possible outcomes count.`, `9つの結果。${notation(expression)}では${answer.denominator}個の候補のうち${answer.numerator}個が該当します。`));
      root.querySelector('[data-event-grid-key]').textContent = answer.conditional
        ? t('Blue: given event · coral: also matches', '青：条件の事象・赤：さらに該当')
        : t('Coral: outcomes that count', '赤：該当する結果');
      context.textContent = answer.conditional
        ? t(`Given ${answer.right}: the sample space now has ${answer.denominator} outcomes`, `${answer.right}が起きた条件：標本空間は${answer.denominator}つ`)
        : t('All nine outcomes form the sample space', '9つすべてが標本空間');
      formula.textContent = answer.formula;
      const selected = outcomes.filter(cell => answer.matches.has(cell));
      explanation.textContent = answer.conditional
        ? t(`${answer.right} contains ${answer.denominator} outcomes. Of those, ${answer.numerator} also belong to ${answer.left}: ${selected.join(', ') || 'none'}.`, `${answer.right}に入る${answer.denominator}つのうち、${answer.left}にも入るのは${answer.numerator}つ：${selected.join('・') || 'なし'}。`)
        : t(`Count ${answer.numerator} of the nine squares: ${selected.join(', ') || 'none'}.`, `9つのうち${answer.numerator}マス：${selected.join('・') || 'なし'}。`);
      if (step === 3 && expression === 'D|B') explanation.textContent += t(' Since P(D) = 6/9 = 2/3 too, B and D are independent.', ' P(D) = 6/9 = 2/3 と同じなので、BとDは独立です。');
      if (step === 3 && expression === 'B|D') explanation.textContent += t(' Since P(B) = 3/9 = 1/3 too, the same independence appears in reverse.', ' P(B) = 3/9 = 1/3 と同じ。逆向きにも独立が確かめられます。');
      membership.replaceChildren(...['A', 'B', 'C', 'A∩B', 'A∩C', 'B∩C', 'A∪B', 'A∪C', 'B∪C', 'D'].map(name => {
        const row = document.createElement('div');
        row.className = `event-set-row${name === expression || name === answer.left || name === answer.right ? ' is-relevant' : ''}`;
        const label = document.createElement('strong');
        label.textContent = name;
        const values = document.createElement('span');
        const cells = events[name] || solve(name).matches;
        values.textContent = cells.size ? `{${[...cells].join(', ')}}` : '∅';
        row.append(label, values);
        return row;
      }));
      if (inspected) {
        const names = Object.keys(events).filter(name => events[name].has(inspected));
        note.textContent = t(`Square ${inspected} belongs to ${names.join(', ') || 'none of A–D'}. ${answer.matches.has(inspected) ? 'It counts in this probability!' : answer.base.has(inspected) ? 'It is possible, but does not count.' : 'It is outside the given sample space.'}`, `マス${inspected}は${names.join('・') || 'A〜Dのどれにも入らない'}に含まれます。${answer.matches.has(inspected) ? 'この確率で数えます！' : answer.base.has(inspected) ? '候補ですが、該当しません。' : '条件付きの標本空間の外です。'}`);
      } else note.textContent = t('Tap a square to check whether it counts.', 'マスを押して、この確率で数えるか確かめよう。');
    }

    root.querySelectorAll('[data-event-step]').forEach(button => button.addEventListener('click', () => {
      step = Number(button.dataset.eventStep);
      expression = steps[step].expressions[0];
      inspected = null;
      render();
    }));
    new MutationObserver(render).observe(document.documentElement, { attributes:true, attributeFilter:['data-language'] });
    render();
  }

  document.addEventListener('statsb:agenda-rendered', setup);
  setup();
})();
