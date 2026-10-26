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

export const slideTermKeys=[
  [],[],[],[],
  ['measurement'],
  ['randomVariable','pointProbability'],
  ['interval','rounding'],
  ['continuous'],
  ['density'],
  ['intervalProbability'],
  ['intervalProbability','integral'],
  ['approximation'],
  ['approximation'],
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
    return `<span class="stat-term"><span class="stat-term-ja" lang="ja">${ja}</span><span class="stat-term-en" lang="en">${en}</span></span>`;
  }).join('')}</aside>`;
}

export const terminologyStyle=`
section.has-stat-terms{padding-bottom:112px}
section .stat-terms{position:absolute;left:70px;right:70px;bottom:48px;display:flex;align-items:flex-start;justify-content:center;gap:45px;line-height:1.3;text-align:center}
section .stat-term{display:flex;flex-direction:column;gap:5px;max-width:380px}
section .stat-term-ja{font-size:22px;font-weight:600;color:#334d59}
section .stat-term-en{font-size:18px;font-weight:400;color:#687b84;letter-spacing:.015em}
section.single-visual.has-stat-terms img{height:410px}
section.visual-link.has-stat-terms img{height:390px}
section.model-visual.has-stat-terms img{height:315px}
section.worked.has-stat-terms{padding-bottom:125px}
section.book-divider .stat-terms{justify-content:flex-start;text-align:left}
`;
