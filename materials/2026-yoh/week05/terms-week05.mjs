// One shared vocabulary and visual treatment across explanations, formulas and answers.
export const glossary={
  measurement:['測定精度','Measurement precision'],
  randomVariable:['確率変数','Random variable'],
  pointProbability:['1点の確率','Point probability'],
  interval:['区間','Interval'],
  rounding:['丸め','Rounding'],
  continuous:['連続確率分布','Continuous probability distribution'],
  density:['確率密度関数','Probability density function (PDF)'],
  probability:['確率','Probability'],
  intervalProbability:['区間の確率','Interval probability'],
  approximation:['近似','Approximation'],
  integral:['定積分','Definite integral'],
  uniform:['一様分布','Uniform distribution'],
  cdf:['累積分布関数','Cumulative distribution function (CDF)'],
  cumulative:['累積確率','Cumulative probability'],
  expectation:['期待値','Expected value'],
  variance:['分散','Variance'],
  sd:['標準偏差','Standard deviation'],
  normal:['正規分布','Normal distribution'],
  mean:['平均','Mean'],
  standardization:['標準化','Standardization'],
  standardNormal:['標準正規分布','Standard normal distribution'],
  zScore:['標準得点','Z-score'],
  normalTable:['標準正規分布表','Standard normal table'],
  upperTail:['上側確率','Upper-tail probability'],
  lowerTail:['下側確率','Lower-tail probability'],
  central:['中央の区間確率','Central interval probability'],
  sampleMean:['標本平均','Sample mean'],
  standardError:['標準誤差','Standard error']
};

// Pronunciations are validated as whole terms, then anchored to individual kanji.
export const readings={
  measurement:'そくていせいど',randomVariable:'かくりつへんすう',
  pointProbability:[['1点','いってん'],'の',['確率','かくりつ']],
  interval:'くかん',rounding:[['丸','まる'],'め'],continuous:'れんぞくかくりつぶんぷ',
  density:'かくりつみつどかんすう',probability:'かくりつ',
  intervalProbability:[['区間','くかん'],'の',['確率','かくりつ']],
  approximation:'きんじ',integral:'ていせきぶん',uniform:'いちようぶんぷ',
  cdf:'るいせきぶんぷかんすう',cumulative:'るいせきかくりつ',expectation:'きたいち',
  variance:'ぶんさん',sd:'ひょうじゅんへんさ',normal:'せいきぶんぷ',mean:'へいきん',
  standardization:'ひょうじゅんか',standardNormal:'ひょうじゅんせいきぶんぷ',
  zScore:'ひょうじゅんとくてん',normalTable:'ひょうじゅんせいきぶんぷひょう',
  upperTail:'うわがわかくりつ',lowerTail:'したがわかくりつ',
  central:[['中央','ちゅうおう'],'の',['区間','くかん'],['確率','かくりつ']],
  sampleMean:'ひょうほんへいきん',standardError:'ひょうじゅんごさ'
};
const characterReadings={
  '測':'そく','定':'てい','精':'せい','度':'ど','確':'かく','率':'りつ',
  '変':'へん','数':'すう','1':'いっ','点':'てん','区':'く','間':'かん','丸':'まる',
  '連':'れん','続':'ぞく','分':'ぶん','布':'ぷ','密':'みつ','関':'かん',
  '近':'きん','似':'じ','積':'せき','一':'いち','様':'よう','累':'るい',
  '期':'き','待':'たい','値':'ち','散':'さん','標':'ひょう','準':'じゅん',
  '偏':'へん','差':'さ','正':'せい','規':'き','平':'へい','均':'きん',
  '化':'か','得':'とく','表':'ひょう','上':'うわ','側':'がわ','下':'した',
  '中':'ちゅう','央':'おう','本':'ほん','誤':'ご','母':'ぼ','集':'しゅう','団':'だん',
  '四':'し','捨':'しゃ','五':'ご','入':'にゅう'
};
const ruby=(kanji,kana)=>{
  const characters=[...kanji];
  const readings=characters.map(character=>characterReadings[character]);
  if(readings.some(reading=>!reading)||readings.join('')!==kana)throw Error(`Check character-level furigana: ${kanji} / ${kana}`);
  return characters.map((character,i)=>`<ruby>${character}<rt>${readings[i]}</rt></ruby>`).join('');
};
export function rubyTerm(key){
  const reading=readings[key];
  if(!reading)throw Error(`Missing furigana for statistical term: ${key}`);
  return typeof reading==='string'?ruby(glossary[key][0],reading):reading.map(part=>typeof part==='string'?part:ruby(...part)).join('');
}
export function annotateJapaneseTerms(markdown){
  const terms=new Map(Object.keys(glossary).map(key=>[glossary[key][0],rubyTerm(key)]));
  for(const [ja,kana] of [['平均値','へいきんち'],['確率密度','かくりつみつど'],['連続変数','れんぞくへんすう'],['母集団','ぼしゅうだん'],['母標準偏差','ぼひょうじゅんへんさ'],['四捨五入','ししゃごにゅう']])terms.set(ja,ruby(ja,kana));
  const pattern=new RegExp([...terms.keys()].sort((a,b)=>b.length-a.length).join('|'),'g');
  // Preserve formulas, images, links, comments and attributes exactly as authored.
  const protectedParts=/(\$\$[\s\S]*?\$\$|\$[^$\n]*\$|<!--[\s\S]*?-->|<[^>]*>|!?\[[^\]]*\]\([^)]*\)|https?:\/\/[^\s<]+)/g;
  return markdown.split(protectedParts).map((part,i)=>i%2?part:part.replace(pattern,term=>terms.get(term))).join('');
}

export const slideTermKeys=[
  [],[],[],[],
  ['measurement'],
  ['randomVariable','pointProbability'],
  ['interval','rounding'],
  ['continuous'],
  ['density'],
  ['intervalProbability'],
  ['intervalProbability','integral'],
  [],
  ['approximation','density'],
  ['approximation'],
  ['approximation'],
  ['approximation'],
  ['approximation'],
  ['integral'],
  ['intervalProbability','integral'],
  ['integral'],
  ['uniform','density'],
  ['uniform','intervalProbability'],
  ['intervalProbability','integral'],
  ['intervalProbability'],
  ['cdf'],
  ['density','cumulative'],
  ['cdf','cumulative'],
  ['cumulative'],
  ['cdf','intervalProbability'],
  ['expectation','variance'],
  ['expectation'],
  ['expectation','uniform'],
  ['variance'],
  ['variance','sd'],
  ['expectation','sd'],
  ['normal'],
  ['normal','mean','variance'],
  ['sd'],
  ['sd'],
  ['normal','density'],
  ['standardization','standardNormal'],
  ['mean','sd','zScore'],
  ['normalTable'],
  ['upperTail'],
  ['normalTable'],
  ['normalTable'],
  ['normalTable'],
  ['upperTail'],
  ['lowerTail'],
  ['cumulative'],
  ['central'],
  ['standardization','sd'],
  ['standardization','upperTail'],
  ['standardization','central'],
  ['standardization','central'],
  ['probability','density'],
  ['sampleMean','standardError'],
  ['standardization','normal']
];

export function terminology(keys){
  if(!keys.length)return '';
  return `<aside class="stat-terms" aria-label="統計用語 / Statistical terms">${keys.map(key=>{
    if(!glossary[key])throw Error(`Missing English statistical term: ${key}`);
    const [ja,en]=glossary[key];
    return `<span class="stat-term"><span class="stat-term-ja" lang="ja">${rubyTerm(key)}</span><span class="stat-term-en" lang="en">${en}</span></span>`;
  }).join('')}</aside>`;
}

export const terminologyStyle=`
section.has-stat-terms{padding-bottom:112px}
section .stat-terms{position:absolute;left:70px;right:70px;bottom:48px;display:flex;align-items:flex-start;justify-content:center;gap:45px;line-height:1.3;text-align:center}
section .stat-term{display:flex;flex-direction:column;gap:5px;max-width:380px}
section .stat-term-ja{font-size:22px;font-weight:600;color:#334d59}
section .stat-term-en{font-size:18px;font-weight:400;color:#687b84;letter-spacing:.015em}
section ruby{ruby-position:over;ruby-align:center}
section rt{font-size:.38em;font-weight:400;letter-spacing:0;text-align:center;color:inherit;line-height:1.2}
section h1 rt,section h2 rt,section h3 rt,section.book-divider .chapter rt,section.queue-story .queue-question rt{font-size:.28em}
section .stat-term-ja{padding-top:12px}
section .stat-term-ja rt{font-size:11px;color:#536b77}
section.single-visual.has-stat-terms img{height:410px}
section.visual-link.has-stat-terms img{height:390px}
section.model-visual.has-stat-terms img{height:315px}
section.worked.has-stat-terms{padding-bottom:125px}
section.book-divider .stat-terms{justify-content:flex-start;text-align:left}
`;
