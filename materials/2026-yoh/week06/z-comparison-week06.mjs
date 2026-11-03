import {writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

export function zPurposeGraphic(here){
 const X=x=>100+(x-20)/60*900,base=205;
 const curve=Array.from({length:301},(_,i)=>{const x=20+i/5,y=base-140*Math.exp(-.5*((x-50)/10)**2);return `${i?'L':'M'}${X(x).toFixed(2)},${y.toFixed(2)}`;}).join(' ');
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 420" role="img" aria-label="平均50点、標準偏差10点。60点は平均より標準偏差1個分上なのでZはプラス1。平均のZは0。"><g font-family="Arial,Hiragino Sans,sans-serif" fill="#294c5c"><text x="${X(50)}" y="26" text-anchor="middle" font-size="24">母平均50点</text><path d="${curve}" stroke="#176d82" stroke-width="4" fill="none"/><path d="M100 ${base}H1000" stroke="#8b9b9f"/><path d="M${X(50)} 42V${base} M${X(60)} 70V${base}" stroke="#a0a8aa" stroke-dasharray="5 5"/>${[30,40,50,60,70].map(v=>`<text x="${X(v)}" y="239" text-anchor="middle" font-size="24" fill="${v===60?'#b96930':'#294c5c'}">${v}点</text>`).join('')}<circle cx="${X(60)}" cy="${base}" r="7" fill="#b96930"/><path d="M${X(50)} 264v14 M${X(50)} 271H${X(60)} M${X(60)} 264v14" fill="none" stroke="#b96930" stroke-width="3"/><text x="${(X(50)+X(60))/2}" y="307" text-anchor="middle" font-size="24" fill="#b96930">10点 ＝ 標準偏差1個分</text><path d="M100 350H1000" stroke="#176d82" stroke-width="2"/>${[-2,-1,0,1,2].map(z=>`<path d="M${X(50+10*z)} 344v12" stroke="#176d82"/><text x="${X(50+10*z)}" y="389" text-anchor="middle" font-size="${z===1?32:25}" fill="${z===1?'#b96930':'#176d82'}">${z>0?'+':''}${z}</text>`).join('')}<text x="45" y="389" font-size="25">Z</text><text x="${X(50)}" y="417" font-size="18" text-anchor="middle">平均なら0</text><text x="${X(60)}" y="417" font-size="18" text-anchor="middle" fill="#b96930">平均より1個分、上</text></g></svg>`;
 writeFileSync(resolve(here,'images/z-purpose.svg'),svg);
 return '![width:1080px](images/z-purpose.svg)';
}

export function zDistanceComparison(here,stage){
 const X=x=>245+(x-25)/50*650;
 const bracket=(a,b,y,label,color)=>`<path d="M${X(a)} ${y-5}v10 M${X(a)} ${y}H${X(b)} M${X(b)} ${y-5}v10" stroke="${color}" stroke-width="2.5" fill="none"/><text x="${(X(a)+X(b))/2}" y="${y+22}" fill="${color}" font-size="18" text-anchor="middle">${label}</text>`;
 const panels=[{base:145,n:1,sd:10,z:1,color:'#176d82',title:'1人の得点',en:'Individual score'},{base:315,n:4,sd:5,z:2,color:'#b96930',title:'4人の平均',en:'Mean of 4 independent scores'},{base:485,n:25,sd:2,z:5,color:'#36774d',title:'25人の平均',en:'Mean of 25 independent scores'}];
 const panel=({base,n,sd,z,color,title,en})=>{
  // All panels use the same score axis and probability-density scale.
  const Y=x=>base-Math.exp(-.5*((x-50)/sd)**2)/(sd*Math.sqrt(2*Math.PI))/.21*115;
  const path=Array.from({length:301},(_,i)=>{const x=25+i/6;return `${i?'L':'M'}${X(x).toFixed(2)},${Y(x).toFixed(2)}`;}).join(' ');
  const bars=stage===1?bracket(50,60,base+34,'同じ10点','#555'):Array.from({length:z},(_,i)=>bracket(50+i*sd,50+(i+1)*sd,base+34,z===5?(i===2?'2点ずつ':''):`${sd}点`,color)).join('');
  return `<g><text x="15" y="${base-78}" font-size="27" fill="${color}" font-weight="bold">${title}</text><text x="15" y="${base-50}" font-size="18" fill="${color}">${en}</text>${stage>=2?`<text x="15" y="${base-18}" font-size="23">標準偏差 ${sd}点</text>`:''}<path d="${path}" fill="none" stroke="${color}" stroke-width="4"/><path d="M${X(25)} ${base}H${X(75)}" stroke="#888"/><path d="M${X(50)} ${base-116}V${base} M${X(60)} ${base-116}V${base}" stroke="#999" stroke-dasharray="5 5"/>${[30,40,50,60,70].map(v=>`<text x="${X(v)}" y="${base+23}" text-anchor="middle" font-size="20" fill="${v===60?color:'#555'}">${v}</text>`).join('')}${bars}${stage===3?`<text x="970" y="${base-55}" fill="${color}" font-size="43" font-weight="bold">z = ${z}</text><text x="970" y="${base-23}" fill="${color}" font-size="22">標準偏差${z}個分</text>`:stage===2?`<text x="970" y="${base-23}" fill="${color}" font-size="22">${sd}点 × ${z} ＝ 10点</text>`:''}</g>`;
 };
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1180 550" role="img" aria-label="同じ50点から60点の差10点。1人の標準偏差10点では1個分、4人の平均の標準偏差5点では2個分、25人の平均の標準偏差2点では5個分。"><g font-family="Arial,Hiragino Sans,sans-serif" fill="#222"><text x="${X(50)}" y="19" font-size="20" text-anchor="middle">母平均50</text><text x="${X(60)}" y="19" font-size="20" text-anchor="middle">同じ60</text>${panels.map(panel).join('')}</g></svg>`;
 const name=`z-distance-${stage}.svg`;writeFileSync(resolve(here,`images/${name}`),svg);
 return `![width:1100px](images/${name})`;
}
