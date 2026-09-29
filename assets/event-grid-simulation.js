(() => {
  const outcomes = ['o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w'];
  const events = {
    A: new Set(['o', 'p', 'r', 's']),
    B: new Set(['o', 'r', 'u']),
    C: new Set(['t', 'w']),
    D: new Set(['o', 'p', 'q', 'r', 's', 't'])
  };
  const steps = [
    { description: ['Pick an event. Count the red squares.', '事象を選んで、赤いマスを数えよう。'], expressions: ['A', 'B', 'C'] },
    { description: ['∩ means both. ∪ means either.', '∩ は「両方」、∪ は「どちらか」。'], expressions: ['A∩B', 'A∩C', 'B∩C', 'A∪B', 'A∪C', 'B∪C'] },
    { description: ['The blue squares are the new “whole.”', '青いマスだけが新しい「全体」。'], expressions: ['B|A', 'A|B'] },
    { description: ['Does the answer change when we know B?', 'Bを知ると、答えは変わる？'], expressions: ['D', 'D|B', 'B', 'B|D'] }
  ];

  const t = (en, ja) => document.documentElement.dataset.language === 'en' ? en : ja;
  const fraction = (top, bottom) => {
    if (!top) return '0';
    let a = top, b = bottom;
    while (b) [a, b] = [b, a % b];
    return b === 1 || bottom / a === 1 ? String(top / a) : `${top / a}/${bottom / a}`;
  };
  const notation = expression => `Pr(${expression})`;

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
      explanation.textContent = t(`Red: ${selected.join(', ') || 'none'} · ${answer.numerator} of ${answer.denominator}`, `赤：${selected.join('・') || 'なし'} · ${answer.denominator}マス中${answer.numerator}マス`);
      if (step === 3 && expression === 'D|B') explanation.textContent += t(' · Same as Pr(D): independent!', ' · Pr(D) と同じ → 独立！');
      if (step === 3 && expression === 'B|D') explanation.textContent += t(' · Same as Pr(B): independent!', ' · Pr(B) と同じ → 独立！');
      membership.replaceChildren(...['A', 'B', 'C', 'D'].map(name => {
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
        note.textContent = t(`${inspected} ∈ ${names.join(', ') || 'none'} · ${answer.matches.has(inspected) ? 'Counts!' : answer.base.has(inspected) ? 'Not counted' : 'Outside the condition'}`, `${inspected} ∈ ${names.join('・') || 'なし'} · ${answer.matches.has(inspected) ? '数える！' : answer.base.has(inspected) ? '数えない' : '条件の外'}`);
      } else note.textContent = t('Tap a square to explore.', 'マスを押してみよう。');
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
