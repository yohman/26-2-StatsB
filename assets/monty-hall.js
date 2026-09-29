(() => {
  const svgNS = 'http://www.w3.org/2000/svg';
  const robot = `<svg class="monty-character monty-robot" viewBox="0 0 150 150" role="img" aria-label="ロボット"><path d="M75 23V13" stroke="#244a5a" stroke-width="6" stroke-linecap="round"/><circle cx="75" cy="11" r="7" fill="#efb55b"/><path d="m30 38-12 15v32l12 12m90-59 12 15v32l-12 12" fill="#7ecbd0" stroke="#244a5a" stroke-width="5" stroke-linejoin="round"/><rect x="27" y="25" width="96" height="93" rx="28" fill="#76cbd1" stroke="#244a5a" stroke-width="5"/><path d="M38 45q3-9 14-9h46q11 0 14 9v38q-2 13-16 15H53Q39 96 38 83z" fill="#19394b"/><path d="M45 46q4-6 11-6h24" fill="none" stroke="#a9f4ee" stroke-width="4" stroke-linecap="round" opacity=".8"/><circle cx="56" cy="66" r="8" fill="#8ff2f0"/><circle cx="94" cy="66" r="8" fill="#8ff2f0"/><circle cx="56" cy="66" r="3" fill="#fff"/><circle cx="94" cy="66" r="3" fill="#fff"/><path d="M67 82q8 7 16 0" fill="none" stroke="#a9f4ee" stroke-width="4" stroke-linecap="round"/><circle cx="45" cy="86" r="5" fill="#f29a9b"/><circle cx="105" cy="86" r="5" fill="#f29a9b"/><path d="M57 119v11m36-11v11" stroke="#244a5a" stroke-width="10" stroke-linecap="round"/><rect x="42" y="125" width="30" height="9" rx="4" fill="#244a5a"/><rect x="78" y="125" width="30" height="9" rx="4" fill="#244a5a"/><path d="m119 17 3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#efb55b"/><path d="m17 102 2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#efb55b"/></svg>`;
  const goat = `<svg class="monty-character monty-goat" viewBox="0 0 120 120" role="img" aria-label="ヤギ"><path d="M34 35 23 13q18 2 24 22m39 0 11-22Q79 15 73 35" fill="#d9b78b" stroke="#806b61" stroke-width="3" stroke-linejoin="round"/><ellipse cx="25" cy="53" rx="13" ry="21" fill="#c5a889"/><ellipse cx="95" cy="53" rx="13" ry="21" fill="#c5a889"/><path d="M29 43q0-22 31-22t31 22v36q0 23-31 23T29 79z" fill="#fff9ed" stroke="#806b61" stroke-width="3"/><circle cx="45" cy="57" r="4" fill="#554c49"/><circle cx="75" cy="57" r="4" fill="#554c49"/><circle cx="36" cy="68" r="6" fill="#f5b4ad" opacity=".7"/><circle cx="84" cy="68" r="6" fill="#f5b4ad" opacity=".7"/><ellipse cx="60" cy="74" rx="13" ry="10" fill="#eed5be"/><path d="m55 71 5 4 5-4m-5 4v5m0 0-5 3m5-3 5 3" fill="none" stroke="#806b61" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  window.statsbMontyCharacters = { robot, goat };
  const closedDoor = '<span class="monty-door-symbol">?</span><span class="monty-door-handle"></span>';
  const t = (en, ja) => document.documentElement.dataset.language === 'en' ? en : ja;
  const makeSvg = (name, attributes = {}, value = '') => {
    const node = document.createElementNS(svgNS, name);
    Object.entries(attributes).forEach(([key, item]) => node.setAttribute(key, String(item)));
    if (value) node.textContent = value;
    return node;
  };

  function setupMontyHall() {
    const root = document.querySelector('[data-monty-game]');
    if (!root || root.dataset.montyInitialized) return;
    root.dataset.montyInitialized = 'true';

    const stage = root.querySelector('.monty-stage');
    const doors = [...root.querySelectorAll('[data-monty-door]')];
    const prompt = root.querySelector('[data-monty-prompt]');
    const decision = root.querySelector('[data-monty-decision]');
    const outcome = root.querySelector('[data-monty-outcome]');
    const resultTitle = root.querySelector('[data-monty-result-title]');
    const result = root.querySelector('[data-monty-result]');
    const mark = root.querySelector('[data-monty-mark]');
    const again = root.querySelector('[data-monty-again]');
    const strategyInput = root.querySelector('[data-monty-strategy]');
    const localizeControls = () => {
      root.querySelector('.monty-doors').setAttribute('aria-label', t('Three doors', '3つのドア'));
      strategyInput.querySelector('[value="stay"]').textContent = t('Stay', 'そのまま');
      strategyInput.querySelector('[value="switch"]').textContent = t('Switch', '変更する');
    };
    const countInput = root.querySelector('[data-monty-count]');
    const goButton = root.querySelector('[data-monty-go]');
    const resetButton = root.querySelector('[data-monty-reset]');
    const status = root.querySelector('[data-monty-status]');
    const lineChart = root.querySelector('[data-monty-line-chart]');
    const chartDescription = root.querySelector('[data-monty-chart-desc]');
    const score = {
      stay:{ plays:0, wins:0, history:[], outcomes:[] },
      switch:{ plays:0, wins:0, history:[], outcomes:[] }
    };
    let phase = 'pick';
    let round = null;
    let batchTimer = null;
    let batchProgress = null;
    let batchFrame = 0;
    let lastBatch = null;

    const randomDoor = () => Math.floor(Math.random() * 3);
    const goatDoors = (robotDoor, pickedDoor) => [0, 1, 2].filter(door => door !== robotDoor && door !== pickedDoor);
    const switchingDoor = (pickedDoor, openedDoor) => [0, 1, 2].find(door => door !== pickedDoor && door !== openedDoor);

    function newRound() {
      round = { robot:randomDoor(), picked:null, opened:null, final:null, strategy:null, won:null };
      phase = 'pick';
      batchProgress = null;
      stage.classList.remove('is-batch-flash');
      render();
    }

    function record(strategy, won) {
      const series = score[strategy];
      series.plays += 1;
      if (won) series.wins += 1;
      series.history.push(series.wins / series.plays);
      series.outcomes.push(won);
    }

    function drawChart() {
      const title = lineChart.querySelector('title');
      title.textContent = t('Cumulative win rate by strategy', '作戦ごとの累積勝率');
      const description = chartDescription;
      const maxTrials = Math.max(10, score.stay.plays, score.switch.plays);
      const width = Math.max(300, Math.round(lineChart.parentElement.getBoundingClientRect().width));
      lineChart.setAttribute('viewBox', `0 0 ${width} 225`);
      const left = 46, right = width - 18, top = 14, bottom = 180;
      const x = trial => left + (trial / maxTrials) * (right - left);
      const y = percent => bottom - percent * (bottom - top);
      lineChart.replaceChildren(title, description);

      [0, .33, .5, .67, 1].forEach(level => {
        lineChart.append(makeSvg('line', { x1:left, y1:y(level), x2:right, y2:y(level), class:level === .33 || level === .67 ? 'monty-chart-reference' : 'monty-chart-grid' }));
        if (level === 0 || level === .5 || level === 1) lineChart.append(makeSvg('text', { x:left - 8, y:y(level) + 4, 'text-anchor':'end', class:'monty-chart-axis-label' }, `${Math.round(level * 100)}%`));
      });
      lineChart.append(makeSvg('text', { x:right - 3, y:y(.67) - 5, 'text-anchor':'end', class:'monty-chart-reference-label' }, t('Switch 67%', '変更 67%')));
      lineChart.append(makeSvg('text', { x:right - 3, y:y(.33) - 5, 'text-anchor':'end', class:'monty-chart-reference-label' }, t('Stay 33%', 'そのまま 33%')));
      (width < 520 ? [0, .5, 1] : [0, .25, .5, .75, 1]).forEach(fraction => {
        const trial = Math.round(maxTrials * fraction);
        lineChart.append(makeSvg('text', { x:x(trial), y:bottom + 19, 'text-anchor':fraction === 0 ? 'start' : fraction === 1 ? 'end' : 'middle', class:'monty-chart-axis-label' }, String(trial)));
      });
      ['stay', 'switch'].forEach(strategy => {
        const history = score[strategy].history;
        if (!history.length) return;
        const lineStep = Math.max(1, Math.ceil(history.length / 300));
        const points = [];
        for (let index = 0; index < history.length; index += lineStep) points.push({ trial:index + 1, ratio:history[index] });
        if (points.at(-1).trial !== history.length) points.push({ trial:history.length, ratio:history.at(-1) });
        lineChart.append(makeSvg('polyline', { points:points.map(point => `${x(point.trial).toFixed(1)},${y(point.ratio).toFixed(1)}`).join(' '), class:`monty-chart-line monty-chart-line-${strategy}` }));
        const dotStep = Math.max(1, Math.ceil(history.length / 65));
        for (let index = 0; index < history.length; index += dotStep) lineChart.append(makeSvg('circle', { cx:x(index + 1), cy:y(history[index]), r:history.length > 100 ? 2.3 : 3, class:`monty-chart-dot monty-chart-dot-${score[strategy].outcomes[index] ? 'win' : 'loss'}` }));
        lineChart.append(makeSvg('circle', { cx:x(history.length), cy:y(history.at(-1)), r:5.5, class:`monty-chart-last monty-chart-dot-${score[strategy].outcomes.at(-1) ? 'win' : 'loss'}` }));
      });
      description.textContent = t(`Stay: ${score.stay.wins} wins in ${score.stay.plays} ${score.stay.plays === 1 ? 'game' : 'games'}. Switch: ${score.switch.wins} wins in ${score.switch.plays} ${score.switch.plays === 1 ? 'game' : 'games'}. X-axis: games per strategy; Y-axis: cumulative win rate. Green dots are wins and brown dots are losses.`, `そのまま${score.stay.plays}回中${score.stay.wins}勝、変更する${score.switch.plays}回中${score.switch.wins}勝。横軸は作戦ごとの試行回数、縦軸は累積勝率です。点の緑は勝ち、茶色は負けです。`);
    }

    function updateStats() {
      const wins = score.stay.wins + score.switch.wins;
      const total = score.stay.plays + score.switch.plays;
      const losses = total - wins;
      root.querySelector('[data-monty-total]').textContent = String(total);
      root.querySelector('[data-monty-overall]').textContent = total ? `${Math.round(100 * wins / total)}%` : '—';
      root.querySelector('[data-monty-wins]').textContent = String(wins);
      root.querySelector('[data-monty-losses]').textContent = String(losses);
      ['stay', 'switch'].forEach(strategy => {
        const series = score[strategy];
        root.querySelector(`[data-monty-${strategy}-summary]`).textContent = series.plays ? t(`${Math.round(100 * series.wins / series.plays)}% · ${series.wins}/${series.plays} wins`, `${Math.round(100 * series.wins / series.plays)}% · ${series.wins}/${series.plays}勝`) : '—';
      });
      root.querySelector('[data-monty-win-bar]').style.width = total ? `${100 * wins / total}%` : '0%';
      root.querySelector('[data-monty-loss-bar]').style.width = total ? `${100 * losses / total}%` : '0%';
      root.querySelector('[data-monty-win-count]').textContent = String(wins);
      root.querySelector('[data-monty-loss-count]').textContent = String(losses);
      root.querySelector('[data-monty-winloss]').setAttribute('aria-label', total ? t(`${wins} wins, ${losses} losses. Overall win rate: ${Math.round(100 * wins / total)}%.`, `${wins}勝、${losses}敗。全体の勝率は${Math.round(100 * wins / total)}%です。`) : t('No results yet', 'まだ結果がありません'));
      drawChart();
    }

    function setOutcome(title, detail, type) {
      outcome.classList.toggle('is-win', type === 'win');
      outcome.classList.toggle('is-loss', type === 'loss');
      outcome.classList.toggle('is-summary', type === 'summary');
      mark.textContent = type === 'win' ? '★' : type === 'loss' ? '×' : '↗';
      resultTitle.textContent = title;
      result.textContent = detail;
    }

    function render() {
      const running = phase === 'batch';
      const fullyRevealed = phase === 'reveal' || phase === 'batch-done' || (running && batchProgress.completed > 0);
      stage.classList.toggle('has-won', phase === 'reveal' && round.won === true);
      doors.forEach((door, index) => {
        const openedByHost = index === round.opened;
        const revealed = fullyRevealed || openedByHost;
        const chosen = index === round.picked;
        const final = index === round.final;
        const face = door.querySelector('.monty-door-face');
        const caption = door.querySelector('[data-monty-caption]');
        door.classList.toggle('is-open', revealed);
        door.classList.toggle('is-host', openedByHost);
        door.classList.toggle('is-picked', chosen && phase === 'choose');
        door.classList.toggle('is-final', final && fullyRevealed);
        door.classList.toggle('is-winner', final && round.won && fullyRevealed);
        face.innerHTML = revealed ? (index === round.robot ? robot : goat) : closedDoor;
        caption.textContent = fullyRevealed && final ? round.won ? t('Win! Robot', '当たり！ ロボット') : t('Goat · loss', 'はずれ・ヤギ')
          : phase === 'choose' && openedByHost ? t('Opened by host', '司会者が開けたドア')
          : phase === 'choose' && chosen ? t('Your first choice', '最初に選んだドア')
          : phase === 'choose' ? t('Available to switch', '変更できるドア') : t(`Door ${index + 1}`, `ドア ${index + 1}`);
        face.querySelector('svg')?.setAttribute('aria-label', index === round.robot ? t('Robot', 'ロボット') : t('Goat', 'ヤギ'));
        door.disabled = running || (phase === 'choose' && openedByHost);
        door.setAttribute('aria-label', fullyRevealed
          ? t(`Door ${index + 1}, ${index === round.robot ? 'robot' : 'goat'}. ${running ? 'Simulation running' : 'Press to play again'}.`, `ドア${index + 1}、${index === round.robot ? 'ロボット' : 'ヤギ'}。${running ? '実験中' : '押すと次のゲームへ'}`)
          : phase === 'choose' ? t(`Door ${index + 1}, ${openedByHost ? 'goat revealed by host' : chosen ? 'stay with this door' : 'switch to this door'}`, `ドア${index + 1}、${openedByHost ? '司会者が開けたヤギのドア' : chosen ? 'そのままにする' : 'このドアへ変更する'}`) : t(`Choose door ${index + 1}`, `ドア${index + 1}を選ぶ`));
      });
      decision.hidden = phase !== 'choose';
      outcome.hidden = phase !== 'reveal' && phase !== 'batch-done';
      goButton.disabled = running || phase === 'choose';
      countInput.disabled = running;
      strategyInput.disabled = running;
      again.disabled = running;
      prompt.textContent = running ? t(`Simulating: ${batchProgress.completed} / ${batchProgress.amount} games`, `実験中：${batchProgress.completed} / ${batchProgress.amount} 回`)
        : phase === 'pick' ? t('Choose one of the three doors.', '好きなドアを1つ選んでください。')
        : phase === 'choose' ? t('The host revealed a goat. Stay with your first door, or switch?', '司会者がヤギを見せました。最初のドアに残る？ もう一方へ変更する？')
        : phase === 'batch-done' ? t('Showing the final game. Press any door to play again.', '最後の1回を表示しています。ドアを押すと次のゲームへ。')
        : round.won ? t('You found the robot! You win.', 'ロボットをゲット！ あなたの勝ちです。') : t('A goat this time. You lose.', 'ヤギでした。今回は負けです。');
    }

    function chooseDoor(index) {
      if (phase === 'batch') return;
      if (phase === 'reveal' || phase === 'batch-done') { status.textContent = ''; newRound(); return; }
      if (phase === 'choose') { if (index !== round.opened) finish(index === round.picked ? 'stay' : 'switch'); return; }
      round.picked = index;
      const goats = goatDoors(round.robot, index);
      round.opened = goats[Math.floor(Math.random() * goats.length)];
      phase = 'choose';
      render();
    }

    function finish(strategy) {
      if (phase !== 'choose') return;
      round.strategy = strategy;
      round.final = strategy === 'stay' ? round.picked : switchingDoor(round.picked, round.opened);
      round.won = round.final === round.robot;
      record(strategy, round.won);
      phase = 'reveal';
      showRoundOutcome();
      render();
      updateStats();
    }

    function showRoundOutcome() {
      const strategy = round.strategy;
      setOutcome(round.won ? t('You win!', '大当たり！') : t('You lose!', 'ハズレ！'), round.won
        ? t(`You found the robot by choosing to ${strategy}.`, `ロボットをゲット！ ${strategy === 'stay' ? 'そのまま' : '変更する'}作戦で勝ち。`)
        : t(`The goat was behind your door. You chose to ${strategy}. The robot was behind door ${round.robot + 1}.`, `ヤギでした。${strategy === 'stay' ? 'そのまま' : '変更する'}作戦で負け。ロボットはドア${round.robot + 1}。`), round.won ? 'win' : 'loss');
    }

    function showBatchOutcome() {
      if (!lastBatch) return;
      const { amount, strategy, wins } = lastBatch;
      setOutcome(t(`${amount} games complete`, `${amount}回の実験が終了`), t(`${strategy === 'stay' ? 'Stay' : 'Switch'}: ${wins} wins, ${amount - wins} losses. The doors show the final game.`, `${strategy === 'stay' ? 'そのまま' : '変更する'}作戦：${wins}勝・${amount - wins}敗。上のドアは最後の1回です。`), 'summary');
    }

    function stopBatch() {
      if (batchTimer !== null) clearInterval(batchTimer);
      batchTimer = null;
      stage.classList.remove('is-batch-flash');
    }

    function simulate(strategy) {
      const robotDoor = randomDoor();
      const pickedDoor = randomDoor();
      const goats = goatDoors(robotDoor, pickedDoor);
      const openedDoor = goats[Math.floor(Math.random() * goats.length)];
      const finalDoor = strategy === 'stay' ? pickedDoor : switchingDoor(pickedDoor, openedDoor);
      const won = finalDoor === robotDoor;
      record(strategy, won);
      return { robot:robotDoor, picked:pickedDoor, opened:openedDoor, final:finalDoor, strategy, won };
    }

    function runBatch() {
      if (batchTimer !== null || phase === 'choose') return;
      const amount = Number(countInput.value);
      if (!Number.isInteger(amount) || amount < 1 || amount > 10000) {
        status.textContent = t('Enter a whole number from 1 to 10,000.', '回数は1〜10,000の整数で入力してください。');
        countInput.focus();
        return;
      }
      const strategy = strategyInput.value;
      const beforeWins = score[strategy].wins;
      const batchSize = Math.max(1, Math.ceil(amount / 100));
      batchProgress = { completed:0, amount };
      phase = 'batch';
      render();
      status.textContent = t('Simulating every game; only some are shown.', 'すべての回を集計中。表示は一部です。');
      batchTimer = setInterval(() => {
        for (let index = 0; index < batchSize && batchProgress.completed < amount; index += 1) {
          round = simulate(strategy);
          batchProgress.completed += 1;
        }
        batchFrame += 1;
        root.dataset.montyBatchFrame = String(batchFrame);
        render();
        stage.classList.remove('is-batch-flash');
        void stage.offsetWidth;
        stage.classList.add('is-batch-flash');
        updateStats();
        if (batchProgress.completed === amount) {
          const wins = score[strategy].wins - beforeWins;
          stopBatch();
          phase = 'batch-done';
          lastBatch = { amount, strategy, wins };
          showBatchOutcome();
          render();
          status.textContent = t(`${amount} games complete. Try the other strategy.`, `${amount}回終了。別の作戦も試そう。`);
        }
      }, 60);
    }

    doors.forEach((door, index) => door.addEventListener('click', () => chooseDoor(index)));
    root.querySelectorAll('[data-monty-choice]').forEach(button => button.addEventListener('click', () => finish(button.dataset.montyChoice)));
    again.addEventListener('click', () => { status.textContent = ''; newRound(); });
    goButton.addEventListener('click', runBatch);
    resetButton.addEventListener('click', () => {
      stopBatch();
      ['stay', 'switch'].forEach(strategy => { score[strategy] = { plays:0, wins:0, history:[], outcomes:[] }; });
      batchFrame = 0;
      root.dataset.montyBatchFrame = '0';
      status.textContent = t('Results reset.', '結果をリセットしました。');
      newRound();
      updateStats();
    });
    newRound();
    localizeControls();
    updateStats();
    new MutationObserver(() => {
      localizeControls();
      render();
      updateStats();
      if (phase === 'reveal') showRoundOutcome();
      if (phase === 'batch-done') showBatchOutcome();
      if (phase === 'batch') status.textContent = t('Simulating every game; only some are shown.', 'すべての回を集計中。表示は一部です。');
      if (phase === 'batch-done' && lastBatch) status.textContent = t(`${lastBatch.amount} games complete. Try the other strategy.`, `${lastBatch.amount}回終了。別の作戦も試そう。`);
    }).observe(document.documentElement, { attributes:true, attributeFilter:['data-language'] });
    new ResizeObserver(() => { if (!root.closest('[hidden]')) drawChart(); }).observe(lineChart.parentElement);
    document.getElementById('week-1-monty-tab')?.addEventListener('click', () => requestAnimationFrame(drawChart));
  }

  document.addEventListener('statsb:agenda-rendered', setupMontyHall);
  setupMontyHall();
})();
