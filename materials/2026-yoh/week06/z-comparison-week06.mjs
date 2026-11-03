import {writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

export function zDistanceComparison(here,stage){
 const X=x=>245+(x-25)/50*650;
 const bracket=(a,b,y,label,color)=>`<path d="M${X(a)} ${y-6}v12 M${X(a)} ${y}H${X(b)} M${X(b)} ${y-6}v12" stroke="${color}" stroke-width="3" fill="none"/><text x="${(X(a)+X(b))/2}" y="${y+25}" fill="${color}" font-size="21" text-anchor="middle">${label}</text>`;
 const panel=(base,sd,color,title,en)=>{
  const Y=x=>base-Math.exp(-.5*((x-50)/sd)**2)/(sd*Math.sqrt(2*Math.PI))/.085*130;
  const path=Array.from({length:301},(_,i)=>{const x=25+i/6;return `${i?'L':'M'}${X(x).toFixed(2)},${Y(x).toFixed(2)}`;}).join(' ');
  const bars=stage===1?bracket(50,60,base+48,'同じ10点','#555'):sd===10?bracket(50,60,base+48,'10点 ＝ 1標準偏差',color):bracket(50,55,base+48,'5点',color)+bracket(55,60,base+48,'5点',color);
  return `<g><text x="15" y="${base-108}" font-size="27" fill="${color}" font-weight="bold">${title}</text><text x="15" y="${base-78}" font-size="18" fill="${color}">${en}</text>${stage>=2?`<text x="15" y="${base-37}" font-size="23">標準偏差 ${sd}点</text>`:''}<path d="${path}" fill="none" stroke="${color}" stroke-width="4"/><path d="M${X(25)} ${base}H${X(75)}" stroke="#888"/><path d="M${X(50)} ${base-140}V${base} M${X(60)} ${base-140}V${base}" stroke="#999" stroke-dasharray="5 5"/>${[30,40,50,55,60,70].map(v=>`<text x="${X(v)}" y="${base+26}" text-anchor="middle" font-size="20" fill="${v===60?color:'#555'}">${v}</text>`).join('')}${bars}${stage===3?`<text x="970" y="${base-70}" fill="${color}" font-size="43" font-weight="bold">z = ${sd===10?1:2}</text><text x="970" y="${base-36}" fill="${color}" font-size="22">標準偏差${sd===10?'1':'2'}個分</text>`:''}</g>`;
 };
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1180 520" role="img" aria-label="同じ50点から60点の差10点。個人の標準偏差10点では1個分、4人の平均の標準偏差5点では2個分。"><g font-family="Arial,Hiragino Sans,sans-serif" fill="#222"><text x="${X(50)}" y="21" font-size="20" text-anchor="middle">母平均50</text><text x="${X(60)}" y="21" font-size="20" text-anchor="middle">同じ60</text>${panel(185,10,'#176d82','1人の得点','Individual score')}${panel(420,5,'#b96930','4人の平均','Mean of 4 independent scores')}${stage>=2?`<text x="970" y="498" font-size="19" fill="#b96930">5点 × 2 ＝ 10点</text>`:''}</g></svg>`;
 const name=`z-distance-${stage}.svg`;writeFileSync(resolve(here,`images/${name}`),svg);
 return `![width:1100px](images/${name})`;
}
