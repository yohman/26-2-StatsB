/* Week 9 opening stories. Data and credits stay with their teaching scenes. */
(() => {
  'use strict';

  const sources = {
    ai: 'https://reutersinstitute.politics.ox.ac.uk/generative-ai-and-news-report-2026-standalone-tools-information-infrastructure',
    aiChart: 'https://datawrapper.dwcdn.net/s4USG/1/',
    aiSearch: 'https://datawrapper.dwcdn.net/wdMyS/1/',
    cop: 'https://apnews.com/article/ae4c6b1fc5d6b6679947e01c9ff8f607',
    globalHeat: 'https://climate.copernicus.eu/surface-air-temperature-october-2026',
    japanHeat: 'https://ds.data.jma.go.jp/gmd/cpd/longfcst/monthly/202610/202610m.html',
    carbon: 'https://doi.org/10.5194/essd-2026-895',
    huang: 'https://www.nytimes.com/2026/11/23/world/jensen-huang-return-nvidia-ukraine.html',
    huangAP: 'https://apnews.com/article/39d4b34ffaa867b4e669893b5fd5028f',
    nvidia: 'https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-Financial-Results-for-Third-Quarter-Fiscal-2027/default.aspx',
    kioxia: 'https://www.japantimes.co.jp/business/2026/11/01/companies/kioxia-chip-prices-stall/',
    kioxiaResults: 'https://finance-frontend-pc-dist.west.edge.storage-yahoo.jp/disclosure/20261030/20261030561541.pdf',
    usMap: 'https://www.nytimes.com/interactive/2026/11/03/us/elections/results-senate.html',
    usMapReview: 'https://www.fastcompany.com/91635531/this-map-shows-just-how-big-democrats-won-the-midterms',
    usHouse: 'https://apnews.com/article/721096a4d9ba2cd68683692361798cdb',
    jpHouse: 'https://www.nippon.com/en/japan-data/h02703/a-landslide-for-takaichi%E2%80%99s-ldp-house-of-representatives-election-results.html'
  };

  const stories = [
    { id: 'ai', label: '生成AIは、どこまで広がった？', section: 'ニュース① 生成AIの日米比較', alt: 'スマートフォンとノートパソコンに表示されたChatGPT', article: sources.ai, outlet: 'Reuters Institute',
      credit: 'Jernej Furman', photo: 'https://commons.wikimedia.org/wiki/File:Smartphone_with_ChatGPT_app_and_laptop_(52917381683).jpg', license: 'https://creativecommons.org/licenses/by/2.0/', licenseLabel: 'CC BY 2.0・トリミング' },
    { id: 'climate', label: '世界で最も暑い10月。日本は？', section: 'ニュース② 世界と日本の気温', alt: 'アポロ17号から撮影した地球', article: sources.cop, outlet: 'AP · COP31',
      credit: 'NASA / Apollo 17', photo: 'https://commons.wikimedia.org/wiki/File:The_Blue_Marble.jpg' },
    { id: 'nvidia', label: 'AIブームで、どの半導体も伸びる？', section: 'ニュース③ NVIDIAとキオクシア', alt: 'CES 2025で基調講演をするジェンスン・フアン', article: sources.huang, outlet: 'The New York Times',
      credit: 'Pronoia / CES 2025', photo: 'https://commons.wikimedia.org/wiki/File:Jensen_Huang_-_Nvidia_Keynote_-_CES_2025_Las_Vegas_(1).jpg', license: 'https://creativecommons.org/publicdomain/zero/1.0/', licenseLabel: 'CC0' },
    { id: 'election', label: '日米の選挙、「圧勝」をどう測る？', section: 'ニュース④ 日米の選挙', alt: '夜明けの米国連邦議会議事堂', article: sources.usMap, outlet: 'The New York Times · 選挙地図',
      credit: 'Architect of the Capitol', photo: 'https://commons.wikimedia.org/wiki/File:Capitol_West_Front_at_Dawn_(8498066918).jpg' }
  ];

  const slides = [];
  const external = (url, text) => `<a href="${url}" target="_blank" rel="noopener">${text} ↗</a>`;
  const links = (...items) => `<div class="news-links">${items.join('')}</div>`;
  const reveal = (html, step = 1) => `<div class="reveal news-reveal" data-step="${step}">${html}</div>`;
  const jump = (target, label) => `<a class="news-jump" href="?p&amp;story=${target}" data-opening-jump="${target}">${label}</a>`;
  const caption = html => `<p class="news-caption">${html}</p>`;
  const tabs = labels => `<div class="news-controls" role="group" aria-label="グラフの表示">${labels.map((label, i) =>
    `<button type="button" data-news-choice="${i}" aria-pressed="${i === 0}">${label}</button>`).join('')}</div>`;

  function add(section, title, html, notes, options = {}) {
    slides.push({ section, title, html, notes, theme: 'light', className: 'news-slide', ...options });
  }

  function cover(story, notes, alternate = '') {
    const credit = external(story.photo, story.credit) +
      (story.license ? ' · ' + external(story.license, story.licenseLabel) : '');
    add(story.section, story.label, `<img class="news-photo news-photo-${story.id}" src="images/news-${story.id}.jpg" alt="${story.alt}">
      <div class="news-cover-copy"><h1>${story.label}</h1>${links(external(story.article, story.outlet), alternate)}</div>
      <div class="news-credit">${credit}</div>`, notes,
      { key: story.id, theme: 'space', className: 'news-slide news-cover' });
  }

  function choices(root, draw) {
    const buttons = [...root.querySelectorAll('[data-news-choice]')];
    const select = (i) => {
      buttons.forEach((button, j) => button.setAttribute('aria-pressed', String(i === j)));
      draw(i);
    };
    buttons.forEach((button, i) => { button.onclick = () => select(i); });
    select(0);
  }

  function bars(rows, max, unit, marker) {
    return `<div class="news-bars">${rows.map(({ label, value, display, color, detail }) =>
      `<div class="news-bar-row"><div class="news-bar-label"><span>${label}</span><b>${display ?? value}${unit}</b></div>
        <div class="news-track" aria-hidden="true"><div class="news-bar ${color || ''}" style="width:${100 * value / max}%"></div>
        ${marker ? `<span class="news-marker" style="left:${100 * marker / max}%"></span>` : ''}</div>
        ${detail ? caption(detail) : ''}</div>`).join('')}</div>`;
  }

  function range({ low, high, center, min, max, lowText, highText, centerText, reference }) {
    const position = value => 100 * (value - min) / (max - min);
    return `<div class="news-range"><div class="news-range-line" aria-hidden="true">
      <span class="news-range-band" style="left:${position(low)}%;width:${position(high) - position(low)}%"></span>
      ${reference === undefined ? '' : `<span class="news-zero" style="left:${position(reference)}%"></span>`}
      <span class="news-range-dot" style="left:${position(center)}%"></span>
      </div><div class="news-range-values"><span>${lowText}</span><strong>${centerText}</strong><span>${highText}</span></div></div>`;
  }

  add('ニュースを選ぶ', 'ニュースを選ぶ', `<h1>今日のニュース</h1>
    <div class="news-picker">${stories.map(story =>
      `<a href="?p&amp;story=${story.id}" data-opening-jump="${story.id}">
        <img src="images/news-${story.id}.jpg" alt=""><span>${story.label}</span></a>`).join('')}</div>
    <div class="news-picker-links">${jump('ai', '4つを順番に見る')}${jump('jobs', '卒業後の就職')}${jump('lecture', '授業へ')}</div>`,
    'Pick one story for a five-minute opening or use the Next button to run the four in order. After any story, return to this menu or start the lesson. The original graduate-jobs opening is available here too.',
    { key: 'menu', theme: 'space', className: 'news-slide news-menu' });

  cover(stories[0], 'Ask for a show of hands before the chart: who deliberately used generative AI in the last seven days? Then have students predict whether weekly use grew faster in the U.S. or Japan.');
  add(stories[0].section, '使う人が多いのは？ 増えたのは？', `<h2>使う人が多いのは？<br>増えたのは？</h2>
    ${reveal(`${tabs(['2026年の利用率', '前年からの伸び', '3年間の推移'])}<div class="news-figure" data-news-draw aria-live="polite"></div>
      ${caption('過去7日間に生成AIを使ったと回答した割合')}${links(external(sources.aiChart, 'Reuters Institute・図2'))}`)}`,
    'Reveal the 2026 levels after both predictions. Then switch to year-on-year change. U.S. levels: 31%, 36%, 49%. Japan: 11%, 26%, 46%. These are self-reports from the Reuters Institute / YouGov survey.',
    { mount(root) {
      const figure = root.querySelector('[data-news-draw]');
      choices(root, i => {
        if (i === 2) {
          figure.innerHTML = `<table class="news-trend"><thead><tr><th scope="col">国</th>${[2024, 2025, 2026].map(y => `<th scope="col">${y}</th>`).join('')}</tr></thead>
            <tbody><tr><th scope="row">米国</th><td>31%</td><td>36%</td><td>49%</td></tr><tr><th scope="row">日本</th><td>11%</td><td>26%</td><td>46%</td></tr></tbody></table>`;
          return;
        }
        figure.innerHTML = bars([{ label: '米国', value: i ? 13 : 49 }, { label: '日本', value: i ? 20 : 46, color: 'warm' }],
          i ? 25 : 100, i ? 'pt' : '%');
      });
    } });
  add(stories[0].section, '検索結果のAI要約も「利用」？', `<h2>検索結果のAI要約も「利用」？</h2>
    ${reveal(`<div class="news-big">57<small>%</small></div>
      ${caption('検索でAIの回答や要約などを見た、または使ったと回答 · 9か国')}
      ${links(external(sources.aiSearch, 'Reuters Institute・図5'))}`)}
    ${reveal(caption('質問の聞き方が変わると、何を測るかも変わる。'), 2)}`,
    'Give the room time to disagree. The 57% figure is exposure or engagement with AI features via search across nine countries. The previous slide was deliberate use of dedicated systems by country. Ask how a repeat survey might vary.');

  cover(stories[1], 'Set up the COP31 news as context. Ask students to predict where Japan ranked for October heat before showing the records.');
  add(stories[1].section, '同じ10月、世界と日本の記録', `<h2>日本の10月は、過去何位？</h2>
    ${reveal(`${tabs(['過去の順位', '平年との差'])}<div class="news-figure" data-news-draw aria-live="polite"></div>
      ${links(external(sources.globalHeat, '世界の気温グラフ'), external(sources.japanHeat, '気象庁・日本の気温グラフ'))}`)}
    ${reveal(caption('日本は1898年以降で2位。国内15地点の観測から集計。'), 2)}`,
    'Switch from the ranks to temperature anomalies. Each number compares October 2026 with its own region’s baseline. The world figure uses the Copernicus 1991–2020 baseline. Japan ranked second after 2024. Open the linked time series if there is time.',
    { mount(root) {
      const figure = root.querySelector('[data-news-draw]');
      choices(root, i => {
        figure.innerHTML = i ?
          bars([{ label: '世界', value: .90, display: '+0.90' }, { label: '日本', value: 1.51, display: '+1.51', color: 'warm' }], 2, '℃') +
            caption('2026年10月の平均気温と、各地域の基準値との差') :
          `<div class="news-ranks"><div><p>世界</p><b>1<small>位</small></b></div><div><p>日本</p><b>2<small>位</small></b></div></div>
            ${caption('2026年10月の平均気温を、それぞれの過去の10月と比較')}`;
      });
    } });
  add(stories[1].section, '世界の化石燃料由来CO₂は減った？', `<h2>この数字で、どんな見出しを書く？</h2>
    <div class="news-big">−0.4<small>%</small></div>${caption('世界の化石燃料由来CO₂排出量 · 2026年の前年比予測')}
    ${reveal(range({ low: -1.5, high: .6, center: -.4, min: -1.7, max: .8, lowText: '−1.5%', highText: '+0.6%', centerText: '推計 −0.4%', reference: 0 }) +
      caption('縦線は変化なし（0%）。公表された不確かさの範囲は、増加側にも及ぶ。') + links(external(sources.carbon, 'Global Carbon Budget 2026')))}`,
    'Ask for a headline while only the projection is visible. Reveal the reported uncertainty range and ask what changes. This is a projected year-on-year change in fossil CO₂ emissions, separate from the temperature comparison. The published uncertainty is not the classroom 95% t interval.');

  cover(stories[2], 'The headline links to the Times on Jensen Huang’s return. The photograph is from CES 2025. The teaching question is how the same AI boom can affect different kinds of chips and suppliers.',
    external(sources.huangAP, 'AP'));
  add(stories[2].section, 'AI向けのチップとメモリー', `<h2>AIブームで、どの半導体も伸びる？</h2>
    ${reveal(`<div class="news-figure">${bars([{ label: 'NVIDIA　前年同期', value: 57.0, display: '57.0' },
      { label: 'NVIDIA　2026年10月までの四半期', value: 115.8, color: 'warm' }], 130, '十億ドル')}</div>
      ${links(external(sources.nvidia, 'NVIDIA決算・11月17日'))}`)}
    ${reveal(`<p class="news-contrast">日本・キオクシア <strong>+0.8%</strong></p>
      ${caption('次の四半期の売上予想を直前の四半期と比較。フラッシュメモリーの価格上昇は鈍化する見通し。')}
      ${links(external(sources.kioxia, 'The Japan Times・11月1日'), external(sources.kioxiaResults, 'キオクシア決算'))}`, 2)}`,
    'Reveal NVIDIA’s year-on-year numbers first, then the Kioxia forecast. Have students identify the two comparison periods before drawing a conclusion: one is a reported year-on-year result and the other is next-quarter guidance versus the preceding quarter. Kioxia still expected strong data-center demand.');
  add(stories[2].section, '会社の売上予想「±3%」', `<h2>「±3%」で、いくらからいくら？</h2>
    <div class="news-big">130<small>十億ドル</small> ±3%</div>
    ${reveal(range({ low: 126.1, high: 133.9, center: 130, min: 125, max: 135, lowText: '126.1', highText: '133.9', centerText: '130.0' }) +
      caption('次の四半期の売上予想・単位は十億ドル') + links(external(sources.nvidia, '決算資料の見通し')))}
    ${reveal(caption('会社が示した予想の幅。信頼係数の記載はない。'), 2)}`,
    'Have students do the 3% arithmetic first. Reveal the bounds, then ask what would be needed to interpret this as a confidence interval. NVIDIA’s release gives guidance with no stated confidence level.');

  cover(stories[3], 'Open the Times map and let students work out what the arrows represent. Use the linked map walkthrough when the Times graphic is unavailable.',
    external(sources.usMapReview, '地図の解説'));
  add(stories[3].section, '選挙の地図は、何を比べている？', `<h2>地図の矢印は、何が動いた印？</h2>
    ${links(external(sources.usMap, 'NYTの選挙地図'), external(sources.usMapReview, '地図のスクリーンショットと解説'))}
    ${reveal(`<div class="news-emphasis">得票差の変化</div>${caption('NYTの地図では、2024年大統領選と2026年上院選の両党の得票差を郡ごとに比べる。')}`)}
    ${reveal(caption('議席を数えると、どんな結果になる？'), 2)}`,
    'Ask what the color, direction, and size of an arrow encode. Then switch to the House seat comparison. The linked NYT graphic is for the Senate, and the next slide compares the two lower chambers.');
  add(stories[3].section, '日米の下院・衆議院の議席', `<h2>258議席と316議席。<br>議席全体に占める割合は？</h2>
    ${reveal(`${tabs(['議席数', '全議席に占める割合'])}<div class="news-figure" data-news-draw aria-live="polite"></div>
      ${caption('米国は11月22日時点のAP集計。日本は2月8日衆院選。縦線は全議席の半数。')}
      ${links(external(sources.usHouse, 'AP・米国下院'), external(sources.jpHouse, 'Nippon.com・日本衆院'))}`)}
    ${reveal(caption('議席割合を読めても、全国の得票割合を知るには別のデータが必要。'), 2)}`,
    'Switch from counts to shares using different denominators, 435 and 465. AP reported at least 258 seats at the time of its story. Explain why seats and vote share can differ under different election systems.',
    { mount(root) {
      const figure = root.querySelector('[data-news-draw]');
      const seats = [{ label: '米国下院・民主党', value: 258, total: 435, minimum: true },
        { label: '日本衆院・自民党', value: 316, total: 465, color: 'warm' }];
      choices(root, mode => {
        figure.innerHTML = bars(seats.map(row => {
          const percent = row.value / row.total * 100;
          const lower = row.minimum ? '≥ ' : '';
          return { ...row, value: percent, display: lower + (mode ? percent.toFixed(1) + '%' : row.value + ' / ' + row.total) };
        }), 100, '', 50);
      });
    } });

  const ends = [3, 6, 9, 12];
  ends.forEach(i => {
    slides[i].html += `<div class="news-story-exit">${jump('menu', 'ニュースを選ぶ')}${jump('lecture', '授業へ')}</div>`;
  });
  window.Week9Openers = slides;

  // The class makes one decision, sees what the headlines measure, then revisits it.
  const japanJobs = 'https://www.mext.go.jp/b_menu/toukei/chousa01/naitei/kekka/k_detail/1422624_00027.htm';
  const usJobs = 'https://www.richmondfed.org/research/national_economy/macro_minute/2026/cap_gown_waiting_around_recent_college_grads_job-hunting_longer';
  const jobsNews = 'https://gvwire.com/2026/06/07/a-job-market-leaving-young-graduates-behind-could-scar-them-for-years/';
  let firstChoice = '';
  const accept = '今の内定を受ける';
  const wait = '第一志望の結果を待つ';
  const section = '今夜までに、返事を';
  const beat = (title, style, html, notes, extras = {}) =>
    ({section, title, html, notes, theme:'light', className:'job-story '+style, ...extras});

  function bindChoice(root, prefix, update) {
    const output = root.querySelector('[data-job-choice-output]');
    const buttons = Array.from(root.querySelectorAll('[data-job-vote]'));
    buttons.forEach(button => {
      button.onclick = () => {
        const label = button.textContent;
        buttons.forEach(item => item.setAttribute('aria-pressed',String(item === button)));
        output.textContent = prefix + label;
        update?.(label);
      };
    });
  }

  window.Week9Story = [
    beat('内定メール。返事は今夜まで。','offer-photo',
      `<img class="job-art" src="images/nyt-graduate-jobs.jpg" alt="就職先を探して迷路を進む卒業生">
       <div class="offer-title"><p>卒業まで、あと少し。</p><h1>内定メール。<br>返事は、今夜まで。</h1></div>
       <div class="job-photo-credit">${external(jobsNews,'Shonagh Rae / The New York Times · GV Wire掲載')}</div>`,
      'Fictional setup. Let the image sit. Say: you have a real offer, but you are still waiting on the job you wanted. The deadline is tonight. Advance before showing any statistics.',
      {key:'decision',theme:'space'}),

    beat('返事をする？ 待つ？','offer-inbox',
      `<div class="offer-mail"><p>受信トレイ <span>17:42</span></p><h2>採用内定のご連絡</h2><p>本日23:59までにご回答ください。</p></div>
       <p class="job-line">第一志望の結果は、まだ来ていない。</p>
       <div class="job-votes"><button type="button" data-job-vote aria-pressed="false">${accept}</button>
       <button type="button" data-job-vote aria-pressed="false">${wait}</button></div>
       <p class="job-vote-output" data-job-choice-output aria-live="polite"></p>
       <p data-job-consequence hidden></p><small class="job-fiction">架空の場面</small>`,
      'Ask for a show of hands for each choice. Record one class choice on screen and ask one student why. If a student suggests asking for an extension, acknowledge it and assume the employer says no for this scenario. Keep the offer, the deadline, and the preferred job fictional.',
      {mount(root){
        bindChoice(root,'最初の選択：',label => {
          firstChoice = label;
          const consequence = root.querySelector('[data-job-consequence]');
          consequence.hidden = false;
          consequence.textContent = label === accept ?
            'もし明日、第一志望から連絡が来たら？' :
            '今夜の内定を見送ったら、次の内定はいつ来る？';
        });
      }}),

    beat('米国の若い大卒者、失業は何週間？','offer-us',
      `<h2>米国の若い大卒者。<br>失業期間はどう変わった？</h2>
       <div class="job-us-layout"><figure class="job-us-chart"><img src="images/us-graduate-duration.jpg" alt="米国の平均失業期間の推移。オレンジは22〜27歳の大卒者等、紫は全体。">
         <figcaption>オレンジ：22〜27歳の大卒者等 ／ 紫：全体</figcaption></figure>
       <div class="job-us-notes">${reveal(`<div class="job-us-comparison">
         <div><small>1994〜2018年の平均</small><b>15.1</b></div>
         <div><small>2026年9月時点</small><b>22.7</b><span>週間</span></div></div>
         <p>若い大卒者の失業期間は約7.6週長くなった。直近値は12か月移動平均。</p>`)}
       ${reveal(`<p><strong>でも、同じ時点の全体は24.8週間。</strong><br>若い大卒者は全体より短い。過去の若い大卒者と比べると長い。</p>`,2)}
       ${reveal(`<p class="job-line">調査時点で、まだ失業中の人に「これまで何週間？」と聞いた。</p>
         <p>では、日本でも同じ期間を測っている？</p>
         ${external(usJobs,'Richmond Fed・図2')}`,3)}</div></div>`,
      'Start with the orange line. Ask students what changed compared with the earlier period, then reveal 15.1 and 22.7. Point to the purple line and ask whether recent grads were waiting longer than the national average at the same time. Reveal 24.8. Both readings are true because the comparison group changes. Finally ask who was surveyed. The CPS records elapsed duration for people still unemployed at the interview, not the eventual length of a completed spell, and it does not predict a particular offer. Ask what the analogous Japanese statistic would need to measure.'),

    beat('日本では、仕事が決まるまで何週間？','offer-japan',
      `<h2>日本でも、<br>待つ時間は分かる？</h2>
       ${reveal(`<p class="job-side">日本の大学卒業者の就職率</p><div class="job-98">98.0<span>%</span></div>
         <p>この数字の分母は？</p>`)}
       ${reveal(`<div class="job-fraction"><span>就職した人</span><strong>就職を希望した人</strong></div>
         <p>2026年4月1日時点。この調査結果は、就職までの週数を示していない。</p>
         ${external(japanJobs,'文部科学省・厚生労働省')}`,2)}
       ${reveal('<p class="job-line">今夜の返事までに知りたいこと。<br>次の内定までの時間と、自分が待てる時間。</p>',3)}`,
      'Ask the room to name the measure they would need in Japan. Reveal 98% as a plausible headline they might find. Have someone read out the numerator, the denominator, and the date. Write two questions on the board: how long might the search take, and how long can this student keep looking after graduation? The headlines cannot answer the first for this student. The next slide calculates the second using the information the student actually has.'),

    beat('就活を続けるなら、何か月待てる？','offer-budget',
      `<h2>卒業後、収入なしで<br>何か月待てる？</h2><div class="job-ledger"><span>手元にあるお金<small>（架空の例）</small></span><strong>18万円</strong></div>
       <div class="job-ledger"><label for="job-spend">1か月の生活費</label><output id="job-monthly">6万円</output></div>
       <input id="job-spend" type="range" min="4" max="9" value="6" step="1">
       <div class="job-runway" aria-hidden="true"><span data-job-runway></span></div>
       <p class="job-budget-result" data-job-budget aria-live="polite"></p>
       <div class="job-votes"><button type="button" data-job-vote aria-pressed="false">${accept}</button>
       <button type="button" data-job-vote aria-pressed="false">${wait}</button></div>
       <p class="job-vote-output" data-job-choice-output aria-live="polite"></p>
       ${reveal('<p class="job-line">では、同じ状況の卒業生に、就職までの期間を聞けたら？</p>')}`,
      'Apply the second question from the last slide. If the student keeps looking after graduation with no income, savings and monthly expenses give a personal deadline. Move the slider and revisit the choice. Ask what information would help estimate the first question. Use the final reveal to pose a small survey of local peers in the same situation. The budget is fictional and gives a constraint, not a forecast.',
      {mount(root){
        const input = root.querySelector('#job-spend');
        const update = () => {
          const cost = Number(input.value);
          const months = 18 / cost;
          root.querySelector('#job-monthly').textContent = cost + '万円';
          root.querySelector('[data-job-runway]').style.width = (months / 5 * 100) + '%';
          root.querySelector('[data-job-budget]').textContent = '待てるのは約 ' + Number(months.toFixed(1)) + ' か月';
        };
        input.oninput = update;
        update();
        if (firstChoice) root.querySelector('[data-job-choice-output]').textContent = '最初の選択：' + firstChoice;
        bindChoice(root,'もう一度選ぶ：');
      }}),

    beat('その「3か月」は、どれくらい確か？','offer-ending',
      `<p>同じような状況の卒業生5人に、就職までの期間を聞いた。</p><h2>平均 <strong>3</strong> か月。</h2>
       ${reveal(`<div class="job-samples"><div><span>A</span><b>2　3　3　3　4</b></div>
         <div><span>B</span><b>1　2　3　4　5</b></div></div><p class="job-example">説明用の架空のデータ（か月）。どちらも平均は3。</p>
         <p class="job-line">どちらの平均のほうが、精度が高そう？</p>`)}
       ${reveal('<p class="job-line">この5人から推定する母平均に、どれくらいの幅をつける？</p>',2)}`,
      'Both fictional samples have five observations, mean 3 months, and different spread. Ask the room which gives a more precise estimate under the same sampling assumptions. Ask what the width would tell us about the population mean. The interval answers the mean question, so it still leaves the student’s personal deadline open. Advance straight into the existing point-to-interval slide.',
      {theme:'dark'})
  ];

  // The front of the deck is a sequential review reel. Each candidate has a stable link.
  const refs = {
    baseball:'https://www.mlb.com/news/j-t-realmuto-initiates-first-game-ending-abs-challenge-in-postseason-history',
    replay:'https://www.mlb.com/gameday/phillies-vs-braves/2026/09/30/849841',
    baseballAP:'https://apnews.com/article/e016f3fcca021d7f8b09258f54fcb253',
    savant:'https://baseballsavant.mlb.com/changelog/2026-10-08-abs-leaderboard-update-frv',
    sleep:'https://www.pokemonsleep.net/suimin-grandprix/',
    pisa:'https://www.oecd.org/en/publications/pisa-2025-results-volume-i_73451bc5-en/full-report/student-performance-in-pisa-2025_23e075c2.html',
    japan:'https://www.oecd.org/en/publications/pisa-2025-results-volume-i-country-notes_2d4ff9ea-en/japan_cf203dac-en.html',
    pisaArt:'https://www.oecd.org/adobe/dynamicmedia/deliver/dm-aid--04632851-d4ce-4e02-a514-691802dcb47f/image7.png?preferwebp=true&quality=80',
    music:'https://newsroom-deezer.com/2026/11/ai-music-labeling-deezer-ipsos-survey/',
    musicNews:'https://ra.co/news/86410',
    bubble:'https://dailyhive.com/portland/nba-bubble-arena',
    nba:'https://itemresponsewarehouse.org/vignettes/home_advantage.html',
    anime:'https://www.japantimes.co.jp/culture/2026/10/09/entertainment-news/anime-survey-watching/',
    nrg:'https://view.ceros.com/nrgmr/crunchyroll-global-state-of-anime',
    war:'https://www.prio.org/news/3691',
    lancet:'https://pubmed.ncbi.nlm.nih.gov/41722607/'
  };
  const candidates = [];
  const scene = (section, title, html, notes, opts = {}) =>
    candidates.push({section,title,html,notes,theme:'light',className:'candidate-scene',...opts});
  const photo = (image, alt, title, credit, href) =>
    `<img class="candidate-photo" src="${image}" alt="${alt}">
      <div class="candidate-photo-copy"><h1>${title}</h1>${external(href,credit)}</div>`;
  const coverOptions = key => ({key,theme:'space',className:'candidate-scene candidate-cover'});
  const desc = html => `<p class="candidate-caption">${html}</p>`;
  const number = (value, label, cls = '') => `<div class="candidate-number ${cls}"><b>${value}</b><span>${label}</span></div>`;
  const duo = (...items) => `<div class="candidate-duo">${items.join('')}</div>`;
  const credit = (...items) => `<div class="candidate-credit">${items.join('')}</div>`;

  {
    const s = '① MLB｜最後の一球';
    scene(s,'最後の一球',photo('https://img.mlbstatic.com/mlb-images/image/upload/t_2x1/t_w1536/mlb/vaih50ydsx7pajiun1uj.jpg',
      'フィリーズ対ブレーブスのポストシーズン試合','最後の一球','MLB公式・記事と映像',refs.baseball),
      `Start with the replay. Pause after the umpire calls ball, before the automated review. Philadelphia leads by one in the tenth; Atlanta has two on and two out. Ask ball or strike, then play the result. It was the first game-ending postseason ABS challenge. MLB: ${refs.baseball}. Video also in Gameday: ${refs.replay}.`,coverOptions('baseball'));
    scene(s,'54%の分母',`<h2>判定が覆った割合</h2>${number('54%','2026年 MLBレギュラーシーズン')}
      <p>審判の判定は、半分以上が間違い？</p>
      ${reveal(`<h3>54%は、<em>チャレンジされた判定</em>のうち。</h3>${credit(external(refs.baseballAP,'AP・シーズン集計'))}`)}`,
      `Let the 54% hang. Ask students to name its denominator before revealing it. The league figure describes challenges made, not all umpire calls. Source: ${refs.baseballAP}.`);
    scene(s,'選んでから、測っている',`<h2>同じ捕手。分母を変えると？</h2>
      ${bars([{label:'実際にチャレンジした判定のうち、覆した割合',value:81},{label:'覆せた判定のうち、実際にチャレンジした割合',value:27,color:'warm'}],100,'%')}
      ${reveal(`<p>選んだ判定の結果から、全判定の正確さは分からない。</p>${desc('J.T. Realmuto・2026年レギュラーシーズン')}`)}
      ${credit(external(refs.savant,'MLB Statcast'))}`,
      `Point to each denominator as you read it. The 27% is a challenge rate among overturn opportunities, not an umpire error rate. The Week 9 bridge: first define the population or a precise interval can describe the wrong set. Source: ${refs.savant}.`);
  }
  {
    const s = '② Pokémon Sleep｜千葉の睡眠';
    scene(s,'千葉の睡眠は全国何位？',`<h2>千葉の睡眠は、全国何位？</h2>
      <img class="candidate-map" src="https://www.pokemonsleep.net/suimin-grandprix/assets/img/img_map-dist.webp" alt="ポケモンスリープによる47都道府県の総合睡眠スコアの地図">
      ${credit(external(refs.sleep,'Pokémon Sleep・全国睡眠県グランプリ 2026'))}`,
      `Let students find Chiba on the official map and guess a rank before advancing. The colors reflect a composite score from the project, not average hours. Source and map: ${refs.sleep}.`,{key:'sleep',theme:'teal',className:'candidate-scene candidate-map-scene'});
    scene(s,'千葉43位。何を競った？',`<h2>千葉43位。何を競った？</h2>
      ${duo(number('1位','宮崎'),number('43位','千葉','warm-ink'))}
      ${reveal(`<h3>睡眠時間だけの順位ではない。</h3>${desc('睡眠時間・規則正しさ・寝つき・睡眠効率・休養感を合成')}`)}`,
      `Chiba is 43rd and Miyazaki first on the composite score. Reveal the five components only after someone says hours slept. Miyazaki is fourth on sleep duration alone. These are rankings within the Pokémon Sleep study. Source: ${refs.sleep}.`);
    scene(s,'4万人でも、誰のデータ？',`<h2>この数字は、誰の睡眠？</h2>
      ${number('42,970','アプリ計測＋Web回答（重み付け集計後）')}
      ${reveal(`<h3>麗澤の学生全員の平均睡眠時間を<br>知りたいなら、誰に聞く？</h3>${credit(external(refs.sleep,'調査方法'))}`)}`,
      `Ask whether recruiting more app users would by itself solve selection bias. Tie back to the fish example, then ask who must have a chance of being selected to estimate mean sleep hours for all Reitaku students. No population interval was published for this classroom question. Source: ${refs.sleep}.`);
  }
  {
    const s = '③ PISA｜順位に幅はある？';
    scene(s,'日本の557点は何位？',`<h2>この4つを、点数順に並べると？</h2>
      <div class="candidate-scores"><div>日本<b>557</b></div><div>シンガポール<b>563</b></div><div>チャイニーズ・タイペイ<b>551</b></div><div>中国・4地域<b>560</b></div></div>
      ${desc('PISA 2025・コンピュータを使った問題解決の平均点推定値')}
      ${credit(external(refs.pisa,'OECD・表 I.2.4'))}`,
      `Give the room a few seconds to order these four selected education systems, not the whole world. The China comparison is Beijing, Shanghai, Jiangsu and Zhejiang only. Then ask if the point-estimate ordering is the same as a clear difference between populations. Source: ${refs.pisa}.`,{key:'pisa',theme:'cream'});
    scene(s,'点数順と、差が言えること',`<h2>日本の557点。<br>他の3つと差があると言える？</h2>
      ${duo(number('6,554','日本で受検した生徒（183校）'),number('約95万人','この標本が代表する生徒','warm-ink'))}
      ${reveal(`<h3>OECDの比較では、日本と他の3つの間に<br>統計的に明確な差は確認できなかった。</h3>`)}
      ${credit(external(refs.japan,'日本の標本'),external(refs.pisa,'OECDの比較結果'))}`,
      `Explain that the tested students are a sample, and the reported means use survey weights. Japan’s sample represents about 951,200 students; that is not the number tested or all Japanese 15-year-olds. Use the OECD’s formal pairwise comparisons in Table I.2.4, not a rule about visually overlapping confidence intervals. Sources: ${refs.japan} and ${refs.pisa}.`);
    scene(s,'平均点の横にある線',`<h2>点と、その両側の線</h2>
      <a class="candidate-source-figure" href="${refs.pisaArt}" target="_blank" rel="noopener" aria-label="OECDの図3を拡大">
        <img src="${refs.pisaArt}" alt="OECD図3の右下：デジタル環境での問題解決の平均点と95%信頼区間"></a>
      ${reveal(desc('点は平均点の推定値。横線は95%信頼区間（confidence interval）。'))}
      ${credit(external(refs.japan,'OECD・図3'))}`,
      `Show the computational problem-solving panel cropped from OECD Figure 3. Click for the full original figure. The bars convey uncertainty around the estimated means, not the spread of individual scores. PISA uses complex survey methods; our t calculation is a simpler classroom example. Source: ${refs.japan}.`,{className:'candidate-scene candidate-figure-scene'});
  }
  {
    const s = '④ 音楽｜プレイリストの中身';
    scene(s,'プレイリストにAIの曲はある？',photo('https://newsroom-deezer.com/wp-content/uploads/2026/11/new-20241206-Deezer-ImageBank-FINAL-DEE00581-4.jpg',
      'Deezerが2026年AI音楽調査の発表に使った写真','このプレイリストに、<br>AIが作った曲はある？','Deezer / Ipsos・2026年11月',refs.music),
      `Ask the room how they would know whether a fully AI-generated song had landed in a playlist. Do not claim that the image shows a particular playlist or that we tested anyone in the room. News coverage: ${refs.musicNews}. Photo/source: ${refs.music}.`,coverOptions('music'));
    scene(s,'74%は「入っていないと思う」',`<h2>プレイリストにAI曲は？</h2>
      ${number('74%','「完全AI生成の曲は入っていないと思う」')}
      ${desc('Ipsosの8か国調査（日本を含む）。音楽配信サービス利用者の回答。')}
      ${reveal('<h3>では、プレイリストの中身を確かめたら？</h3>')}
      ${credit(external(refs.music,'Deezer / Ipsos・調査方法'))}`,
      `Pause at what respondents believe. The 74% comes from streaming users in the wider Ipsos survey, not the new-subscriber records on the next slide. Fully generated does not mean merely AI-assisted. Source: ${refs.music}.`);
    scene(s,'57%。でも、同じ人たち？',`<h2>数字より先に、対象を見る</h2>
      ${duo(number('74%','配信利用者へのアンケート'),number('約57%','Deezer新規加入者の記録','warm-ink'))}
      ${desc('57%は、10月に他サービスから移ってきた加入者5万3千人超のうち、完全AI生成曲が1曲以上あった割合。')}
      ${reveal('<h3>「思っていたこと」と「実際」の差を測るなら、同じ人を調べる。</h3>')}
      ${credit(external(refs.music,'元データの説明'),external(refs.musicNews,'Resident Advisor'))}`,
      `Ask whether subtracting the percentages measures how many people were mistaken. No: different people and different measures. A matched design would ask each person and then audit that same person’s playlist. A confidence interval cannot make two different samples into a matched comparison. Source: ${refs.music}.`);
  }
  {
    const s = '⑤ NBA｜観客がいないホーム';
    scene(s,'観客がいないホーム',photo('https://images-dh-production-baselayer.dailyhive.com/uploads/2020/07/EdeUMgsX0AAeYXg-e1595439142670.jpg?format=auto',
      '2020年NBAバブルの会場','観客がいなくても、<br>ホームは有利？','2020年のバブル会場・NBA / Daily Hive',refs.bubble),
      `Start with the NBA bubble arena, not the numbers. Teams lived and played at a common site. Ask what home advantage could mean with no crowd and no ordinary away travel. Image: ${refs.bubble}. Analysis: ${refs.nba}.`,coverOptions('nba'));
    scene(s,'172試合と1,080試合',`<h2>「ホーム」が違う、2つのシーズン</h2>
      ${duo(number('172試合','バブル：観客なし・移動なし'),number('1,080試合','翌季：観客はほぼ不在・移動あり','warm-ink'))}
      ${reveal('<h3>通常時に比べ、ホームの有利さはどれくらい減った？</h3>')}
      ${credit(external(refs.nba,'IRW・表4'))}`,
      `The source compares a common-site bubble with the following mostly low-attendance season. Neither setting randomly assigns crowds or travel; the figures count games in the analyst’s two contrasts, not teams. Ask students to predict which estimate will be more precise. Source: ${refs.nba}.`,{theme:'cream'});
    scene(s,'差が大きく見える。でも幅は？',`<h2>通常時からの変化</h2>
      <svg class="candidate-interval" viewBox="0 0 760 182" role="img" aria-labelledby="nba-grid-title">
        <title id="nba-grid-title">NBAホーム優位性の変化。バブルでは推定値マイナス0.30、近似区間マイナス0.61から0.01。翌季はマイナス0.17、近似区間マイナス0.31からマイナス0.03。</title>
        <path d="M192 143H708 M630 18V149" class="candidate-axis"/>
        <text x="16" y="53">バブル</text><text x="16" y="107">翌季</text>
        <g class="reveal" data-step="1"><path d="M237 45H637 M237 38V52 M637 38V52 M430 100H611 M430 93V107 M611 93V107" class="candidate-whisker"/></g>
        <circle cx="437" cy="45" r="8"/><circle cx="520" cy="100" r="8"/>
        <text x="244" y="168" text-anchor="middle">−0.6</text><text x="437" y="168" text-anchor="middle">−0.3</text><text x="630" y="168" text-anchor="middle">0</text>
      </svg>
      ${reveal(desc('点：モデルの推定値。横線：標準誤差から求めた近似95%信頼区間。'),1)}
      ${reveal('<h3>バブルの区間は、ゼロ（変化なし）も含む。</h3>',2)}
      ${credit(external(refs.nba,'IRW・表4（モデル尺度）'))}`,
      `Show the dots first. Reveal the wings using estimate ± 1.96 × reported SE, rounded. They are normal approximations from Table 4, in the paper's model units, not percentages or points scored. The bubble interval barely includes zero. Do not infer a difference between the two contrasts from these bars; the source does not find one. Source: ${refs.nba}.`);
  }
  {
    const s = '⑥ アニメ｜16億人の定義';
    scene(s,'アニメに関心を持つ人、世界で何人？',photo('https://www.japantimes.co.jp/japantimes/uploads/images/2026/10/09/567665.jpg?v=3.1',
      '上海の鬼滅の刃プレミアに並ぶ映画ポスター','アニメに関心を持つ人、<br>世界で何人？','The Japan Times・写真と記事',refs.anime),
      `Start with the Shanghai premiere image and ask who would count as an anime audience member. The photo illustrates worldwide interest; China is excluded from the projection on the next slide. Photo/source: ${refs.anime}.`,coverOptions('anime'));
    scene(s,'16億人は何を数えた？',`<h2>16億人は、どんな人？</h2>
      ${number('約16億人','Crunchyrollの推定')}
      <p>毎週観る？　観たことがある？　関心がある？</p>
      ${reveal(`<h3>何らかの関心がある人。<br>日本と中国は推定の対象外。</h3>${credit(external(refs.anime,'The Japan Times'))}`)}`,
      `Let someone choose a definition before showing it. This is Crunchyroll’s estimate of some interest outside Japan and China, not viewers, subscribers, or a count of people. The estimate is reported by The Japan Times. Source: ${refs.anime}.`,{theme:'dark'});
    scene(s,'アニメファンに聞く？ 全員に聞く？',`<h2>「何を観る？」と<br>「観る人は何割？」</h2>
      ${tabs(['何を観る？','観る人は何割？'])}
      <p class="candidate-answer" data-candidate-anime aria-live="polite"></p>
      ${credit(external(refs.nrg,'NRG / Crunchyroll・調査と定義'))}`,
      `Switch questions and ask the room to name a respondent group that can answer each. Anime-viewer samples are useful for tastes within the audience. To measure reach use a broader population and a defined viewing rule. The linked NRG report is an illustration of respondent definitions, not the source of the 1.6 billion projection. Source: ${refs.nrg}.`,
      {mount(root){ choices(root, i => {
        root.querySelector('[data-candidate-anime]').textContent = i ? '観ない人も含めて調べる。' : '観ている人に聞く。';
      }); }});
  }
  {
    const s = '⑦ ガザ｜記録と推定';
    scene(s,'記録に載らなかった人を、どう数える？',
      `<h1>記録に載らなかった人を、<br>どう数える？</h1>${desc('ガザ地区・2023年10月7日〜2025年1月5日')}${credit(external(refs.war,'PRIO・研究報告'))}`,
      `Treat this as a short documentary opener. No guessing game and no graphic images. Ask how researchers can estimate a population total when recording systems have been disrupted. Use only the specified period and violent deaths for the comparison. Source: ${refs.war}.`,{key:'gaza',theme:'space'});
    scene(s,'記録では49,090人',`<h2>保健省が記録した暴力による死亡者</h2>
      ${number('49,090人','ガザ地区・同じ調査対象期間')}
      ${reveal('<h3>研究者は別に、約2,000世帯を調査した。</h3>')}
      ${credit(external(refs.lancet,'The Lancet Global Health・調査設計'))}`,
      `The administrative figure is a reported count for the time period. The population survey is a different way of gathering evidence: households report deaths among their members, and researchers weight and extrapolate. Do not present the household reports as a perfectly complete tally. Source: ${refs.lancet}.`);
    scene(s,'推定75,200人。その幅は？',`<h2>記録された人数と、調査からの推定</h2>
      <svg class="candidate-interval" viewBox="0 0 760 184" role="img" aria-labelledby="gaza-grid-title">
        <title id="gaza-grid-title">記録49,090人。推定75,200人、95%信頼区間63,600人から86,800人。</title>
        <path d="M231 139H708" class="candidate-axis"/>
        <text x="12" y="50">行政の記録</text><text x="12" y="106">世帯調査による推定</text>
        <g class="reveal" data-step="1"><path d="M456 98H677 M456 92V104 M677 92V104" class="candidate-whisker"/>
        <text x="456" y="130" text-anchor="middle">63,600</text><text x="677" y="130" text-anchor="middle">86,800</text></g>
        <circle cx="317" cy="45" r="8"/><text x="336" y="50">49,090</text>
        <circle cx="567" cy="98" r="8"/><text x="567" y="77" text-anchor="middle">75,200</text>
        <text x="231" y="167" text-anchor="middle">4万人</text><text x="708" y="167" text-anchor="middle">9万人</text>
      </svg>
      ${reveal(desc('横線：世帯調査による推定の95%信頼区間（confidence interval）。'))}
      ${credit(external(refs.lancet,'推定値と信頼区間'))}`,
      `Reveal the 95% interval after showing both points. It is about uncertainty in a survey-based estimate of the total, not about the uncertainty of the recorded count or every possible source of error. The study uses a survey method different from our textbook interval for a mean. Source: ${refs.lancet}.`,{theme:'cream'});
  }
  window.Week9Candidates = candidates;
})();
