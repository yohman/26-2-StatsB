(() => {
  const t = (en, ja) => document.documentElement.dataset.language === 'en' ? en : ja;
  const choose = (n, k) => {
    let value = 1;
    for (let i = 1; i <= k; i += 1) value = value * (n - i + 1) / i;
    return Math.round(value);
  };
  const allLineups = (n, k) => Array.from({ length: 2 ** n }, (_, mask) => mask.toString(2).padStart(n, '0'))
    .filter(lineup => [...lineup].filter(cell => cell === '1').length === k);

  function setup() {
    const root = document.querySelector('[data-combination-simulation]');
    if (!root || root.dataset.initialized) return;
    root.dataset.initialized = 'true';
    const nSelect = root.querySelector('[data-combination-n]');
    const kSelect = root.querySelector('[data-combination-k]');
    const guess = root.querySelector('[data-combination-guess]');
    const builder = root.querySelector('[data-combination-builder]');
    const hint = root.querySelector('[data-combination-hint]');
    const results = root.querySelector('[data-combination-results]');
    const save = root.querySelector('[data-combination-save]');
    let n = 5, k = 2, lineup = [1, 1, 0, 0, 0], revealed = false;
    let saved = new Set();

    function fillK() {
      kSelect.replaceChildren(...Array.from({ length: n + 1 }, (_, value) => {
        const option = document.createElement('option');
        option.value = String(value);
        option.textContent = String(value);
        return option;
      }));
      kSelect.value = String(k);
    }

    function reset() {
      lineup = Array.from({ length: n }, (_, index) => Number(index < k));
      saved = new Set();
      revealed = false;
      guess.value = '';
      render();
    }

    function row(bits, index, discovered) {
      const item = document.createElement('div');
      item.className = `combination-lineup${discovered ? ' is-found' : ''}`;
      item.style.setProperty('--lineup-order', index);
      item.setAttribute('aria-label', [...bits].map(value => value === '1' ? t('robot', 'ロボット') : t('goat', 'ヤギ')).join(', '));
      const number = document.createElement('span');
      number.className = 'combination-lineup-number';
      number.textContent = String(index + 1).padStart(2, '0');
      item.append(number);
      [...bits].forEach(value => {
        const cell = document.createElement('span');
        cell.className = `combination-character ${value === '1' ? 'is-robot' : 'is-goat'}`;
        cell.textContent = value === '1' ? '🤖' : '🐐';
        cell.setAttribute('aria-hidden', 'true');
        item.append(cell);
      });
      if (discovered && revealed) {
        const tick = document.createElement('span');
        tick.className = 'combination-found-mark';
        tick.textContent = '✓';
        tick.setAttribute('aria-label', t('You found this lineup', '見つけた並び'));
        item.append(tick);
      }
      return item;
    }

    function render() {
      const robotCount = lineup.reduce((total, value) => total + value, 0);
      builder.replaceChildren(...lineup.map((value, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `combination-slot ${value ? 'is-robot' : 'is-goat'}`;
        button.textContent = value ? '🤖' : '🐐';
        button.setAttribute('aria-label', t(`Position ${index + 1}: ${value ? 'robot' : 'goat'}. Click to change.`, `${index + 1}番目：${value ? 'ロボット' : 'ヤギ'}。押すと変更。`));
        button.addEventListener('click', () => {
          lineup[index] = 1 - lineup[index];
          render();
        });
        return button;
      }));
      save.disabled = robotCount !== k || saved.has(lineup.join(''));
      hint.textContent = robotCount !== k
        ? t(`Place exactly ${k} robots. You have ${robotCount}.`, `ロボットを${k}体にしてね。今は${robotCount}体。`)
        : saved.has(lineup.join(''))
          ? t('You already found this lineup. Move a robot to a new position.', 'この並びは見つけました。ロボットを別の位置へ。')
          : t(`${saved.size} unique lineups found. Tap goats and robots to swap them.`, `見つけた並びは${saved.size}通り。ヤギとロボットを押して入れ替えよう。`);

      const lineups = revealed ? allLineups(n, k) : [...saved];
      const grid = document.createElement('div');
      grid.className = 'combination-lineup-grid';
      grid.replaceChildren(...lineups.map((bits, index) => row(bits, index, saved.has(bits))));
      results.replaceChildren();
      if (revealed) {
        const total = choose(n, k);
        const answer = Number(guess.value);
        const heading = document.createElement('p');
        heading.className = 'combination-answer';
        heading.textContent = t(`${n} positions, ${k} robots: ${total} different lineups.`, `${n}か所にロボット${k}体：並びは${total}通り。`);
        const formula = document.createElement('p');
        formula.className = 'combination-formula';
        formula.textContent = `C(${n},${k}) = ${n}! / (${k}! × ${n - k}!) = ${total}　　Pr(X=${k}) = ${total} / 2^${n} = ${(100 * total / 2 ** n).toFixed(2).replace(/\.00$/, '')}%`;
        const note = document.createElement('p');
        note.className = 'combination-note';
        note.textContent = t(`Each exact lineup has chance 1/${2 ** n} when robot and goat are equally likely and independent.${guess.value ? ` Your guess was ${answer}${answer === total ? ' — exactly right!' : '.'}` : ''}`, `ロボットとヤギが同じ確率で独立なら、特定の並び1つは1/${2 ** n}。${guess.value ? `あなたの予想は${answer}通り${answer === total ? '。正解！' : '。'}` : ''}`);
        results.append(heading, formula, note);
      } else if (saved.size) {
        const count = document.createElement('p');
        count.className = 'combination-saved-count';
        count.textContent = t(`${saved.size} lineups found`, `${saved.size}通り発見`);
        results.append(count);
      }
      if (lineups.length) results.append(grid);
    }

    nSelect.addEventListener('change', () => {
      n = Number(nSelect.value);
      k = Math.min(k, n);
      fillK();
      reset();
    });
    kSelect.addEventListener('change', () => { k = Number(kSelect.value); reset(); });
    root.querySelector('[data-combination-save]').addEventListener('click', () => {
      if (lineup.reduce((total, value) => total + value, 0) !== k) return;
      saved.add(lineup.join(''));
      render();
    });
    root.querySelector('[data-combination-reveal]').addEventListener('click', () => { revealed = true; render(); });
    root.querySelector('[data-combination-reset]').addEventListener('click', reset);
    new MutationObserver(render).observe(document.documentElement, { attributes:true, attributeFilter:['data-language'] });
    fillK();
    render();
  }

  document.addEventListener('statsb:agenda-rendered', setup);
  setup();
})();
