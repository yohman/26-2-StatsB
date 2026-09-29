(() => {
  const robot = `<svg class="monty-character monty-robot" viewBox="0 0 120 120" role="img" aria-label="ロボット"><path d="M60 16V9" stroke="#6a516e" stroke-width="5" stroke-linecap="round"/><circle cx="60" cy="8" r="5" fill="#f2b458"/><rect x="25" y="24" width="70" height="66" rx="22" fill="#a8d9db" stroke="#526f77" stroke-width="4"/><rect x="34" y="36" width="52" height="36" rx="12" fill="#faf7ef"/><circle cx="47" cy="52" r="5" fill="#3e525b"/><circle cx="73" cy="52" r="5" fill="#3e525b"/><path d="M54 62q6 6 12 0" fill="none" stroke="#3e525b" stroke-width="3" stroke-linecap="round"/><circle cx="38" cy="63" r="5" fill="#f5adb1" opacity=".85"/><circle cx="82" cy="63" r="5" fill="#f5adb1" opacity=".85"/><path d="M25 57H16m79 0h9M40 90v14m40-14v14" stroke="#526f77" stroke-width="7" stroke-linecap="round"/><path d="m95 20 2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#f2b458"/></svg>`;
  const goat = `<svg class="monty-character monty-goat" viewBox="0 0 120 120" role="img" aria-label="ヤギ"><path d="M34 35 23 13q18 2 24 22m39 0 11-22Q79 15 73 35" fill="#d9b78b" stroke="#806b61" stroke-width="3" stroke-linejoin="round"/><ellipse cx="25" cy="53" rx="13" ry="21" fill="#c5a889"/><ellipse cx="95" cy="53" rx="13" ry="21" fill="#c5a889"/><path d="M29 43q0-22 31-22t31 22v36q0 23-31 23T29 79z" fill="#fff9ed" stroke="#806b61" stroke-width="3"/><circle cx="45" cy="57" r="4" fill="#554c49"/><circle cx="75" cy="57" r="4" fill="#554c49"/><circle cx="36" cy="68" r="6" fill="#f5b4ad" opacity=".7"/><circle cx="84" cy="68" r="6" fill="#f5b4ad" opacity=".7"/><ellipse cx="60" cy="74" rx="13" ry="10" fill="#eed5be"/><path d="m55 71 5 4 5-4m-5 4v5m0 0-5 3m5-3 5 3" fill="none" stroke="#806b61" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  function setupMontyHall() {
    const root = document.querySelector('[data-monty-game]');
    if (!root || root.dataset.montyInitialized) return;
    root.dataset.montyInitialized = 'true';

    const doors = [...root.querySelectorAll('[data-monty-door]')];
    const prompt = root.querySelector('[data-monty-prompt]');
    const decision = root.querySelector('[data-monty-decision]');
    const outcome = root.querySelector('[data-monty-outcome]');
    const result = root.querySelector('[data-monty-result]');
    const again = root.querySelector('[data-monty-again]');
    const strategyInput = root.querySelector('[data-monty-strategy]');
    const countInput = root.querySelector('[data-monty-count]');
    const goButton = root.querySelector('[data-monty-go]');
    const resetButton = root.querySelector('[data-monty-reset]');
    const status = root.querySelector('[data-monty-status]');
    const chart = root.querySelector('[data-monty-chart]');
    const stats = { stay:{ plays:0, wins:0 }, switch:{ plays:0, wins:0 } };
    let phase = 'pick';
    let round = null;
    let batchTimer = null;

    function newRound() {
      round = { robot:Math.floor(Math.random() * 3), picked:null, opened:null, final:null, strategy:null };
      phase = 'pick';
      render();
    }

    function updateStats() {
      const total = stats.stay.plays + stats.switch.plays;
      root.querySelector('[data-monty-total]').textContent = String(total);
      ['stay', 'switch'].forEach(strategy => {
        const { plays, wins } = stats[strategy];
        const percent = plays ? Math.round((wins / plays) * 100) : 0;
        root.querySelector(`[data-monty-${strategy}-count]`).textContent = `${wins} / ${plays} 回当たり`;
        root.querySelector(`[data-monty-${strategy}-percent]`).textContent = plays ? `${percent}%` : '—';
        root.querySelector(`[data-monty-${strategy}-bar]`).style.width = `${percent}%`;
      });
      chart.setAttribute('aria-label', total
        ? `そのままは${stats.stay.plays}回中${stats.stay.wins}回当たり、変更するは${stats.switch.plays}回中${stats.switch.wins}回当たり。`
        : 'まだ結果がありません');
    }

    function render() {
      const busy = batchTimer !== null;
      doors.forEach((door, index) => {
        const openedByHost = index === round.opened;
        const revealed = phase === 'reveal' || openedByHost;
        const chosen = index === round.picked;
        const final = index === round.final;
        const face = door.querySelector('.monty-door-face');
        const caption = door.querySelector('[data-monty-caption]');
        door.classList.toggle('is-open', revealed);
        door.classList.toggle('is-host', openedByHost);
        door.classList.toggle('is-picked', chosen && phase === 'choose');
        door.classList.toggle('is-final', final);
        door.classList.toggle('is-winner', final && index === round.robot);
        face.innerHTML = revealed ? (index === round.robot ? robot : goat) : '<span class="monty-door-symbol">?</span><span class="monty-door-handle"></span>';
        caption.textContent = openedByHost && phase === 'choose' ? '司会者が開けたドア'
          : final ? 'あなたが選んだドア'
          : chosen && phase === 'choose' ? '最初に選んだドア'
          : phase === 'choose' ? '変更できるドア' : `ドア ${index + 1}`;
        door.disabled = busy || phase === 'reveal' || openedByHost;
        door.setAttribute('aria-label', revealed
          ? `ドア${index + 1}、${index === round.robot ? 'ロボット' : 'ヤギ'}${openedByHost ? '、司会者が開けたドア' : ''}`
          : phase === 'choose' ? `ドア${index + 1}、${chosen ? 'そのままにする' : 'このドアへ変更する'}` : `ドア${index + 1}を選ぶ`);
      });
      decision.hidden = phase !== 'choose';
      outcome.hidden = phase !== 'reveal';
      goButton.disabled = busy || phase === 'choose';
      countInput.disabled = busy;
      strategyInput.disabled = busy;
      again.disabled = busy;
      prompt.textContent = busy ? '実験中です。結果が増える様子を見てください。'
        : phase === 'pick' ? '好きなドアを1つ選んでください。'
        : phase === 'choose' ? '司会者がヤギを見せました。最初のドアに残る？ もう一方へ変更する？'
        : 'ロボットはどのドアにいたでしょう？';
    }

    function chooseDoor(index) {
      if (batchTimer !== null) return;
      if (phase === 'choose') {
        if (index === round.opened) return;
        finish(index === round.picked ? 'stay' : 'switch');
        return;
      }
      if (phase !== 'pick') return;
      round.picked = index;
      const goats = [0, 1, 2].filter(door => door !== index && door !== round.robot);
      round.opened = goats[Math.floor(Math.random() * goats.length)];
      phase = 'choose';
      render();
    }

    function finish(strategy) {
      if (phase !== 'choose' || batchTimer !== null) return;
      round.strategy = strategy;
      round.final = strategy === 'stay' ? round.picked : [0, 1, 2].find(door => door !== round.picked && door !== round.opened);
      const won = round.final === round.robot;
      stats[strategy].plays += 1;
      if (won) stats[strategy].wins += 1;
      phase = 'reveal';
      result.textContent = won
        ? `当たり！ ドア${round.final + 1}にロボットがいました。${strategy === 'stay' ? 'そのまま' : '変更する'}作戦で成功です。`
        : `残念、ドア${round.final + 1}にはヤギ。ロボットはドア${round.robot + 1}でした。`;
      render();
      updateStats();
    }

    function stopBatch() {
      if (batchTimer !== null) clearInterval(batchTimer);
      batchTimer = null;
      render();
    }

    function runBatch() {
      if (batchTimer !== null || phase === 'choose') return;
      const amount = Number(countInput.value);
      if (!Number.isInteger(amount) || amount < 1 || amount > 10000) {
        status.textContent = '回数は1〜10,000の整数で入力してください。';
        countInput.focus();
        return;
      }
      const strategy = strategyInput.value;
      const beforeWins = stats[strategy].wins;
      let completed = 0;
      const batchSize = Math.max(1, Math.ceil(amount / 80));
      batchTimer = setInterval(() => {
        for (let index = 0; index < batchSize && completed < amount; index += 1) {
          const prize = Math.floor(Math.random() * 3);
          const picked = Math.floor(Math.random() * 3);
          const won = strategy === 'stay' ? picked === prize : picked !== prize;
          stats[strategy].plays += 1;
          if (won) stats[strategy].wins += 1;
          completed += 1;
        }
        updateStats();
        status.textContent = `${strategy === 'stay' ? 'そのまま' : '変更する'}作戦：${completed} / ${amount} 回実験中…`;
        if (completed === amount) {
          stopBatch();
          status.textContent = `${amount}回の実験が終了。この実験では${stats[strategy].wins - beforeWins}回当たりました。`;
        }
      }, 32);
      render();
      status.textContent = '実験を始めます…';
    }

    doors.forEach((door, index) => door.addEventListener('click', () => chooseDoor(index)));
    root.querySelectorAll('[data-monty-choice]').forEach(button => button.addEventListener('click', () => finish(button.dataset.montyChoice)));
    again.addEventListener('click', () => { status.textContent = ''; newRound(); });
    goButton.addEventListener('click', runBatch);
    resetButton.addEventListener('click', () => {
      stopBatch();
      stats.stay = { plays:0, wins:0 };
      stats.switch = { plays:0, wins:0 };
      status.textContent = '結果をリセットしました。';
      newRound();
      updateStats();
    });
    newRound();
    updateStats();
  }

  document.addEventListener('statsb:agenda-rendered', setupMontyHall);
  setupMontyHall();
})();
