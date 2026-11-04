import {writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

export function tNormal95(here,M,stage){
 const X=x=>270+(x+4.5)/9*790;
 let mass=0;for(let i=0;i<20000;i++)mass+=M.tPdf(-1.96+(i+.5)*3.92/20000,4)*3.92/20000;
 function panel(base,pdf,q,color,title,english,description,area){
  const Y=x=>base-pdf(x)/.43*145;
  const path=Array.from({length:601},(_,i)=>{const x=-4.5+9*i/600;return `${i?'L':'M'}${X(x)},${Y(x)}`;}).join(' ');
  const fill=(a,b,c,opacity)=>`<path d="M${X(a)} ${base} ${Array.from({length:201},(_,i)=>{const x=a+(b-a)*i/200;return `L${X(x)} ${Y(x)}`;}).join(' ')} L${X(b)} ${base}Z" fill="${c}" opacity="${opacity}"/>`;
  const tail=((1-area)/2*100).toFixed(1);
  return `<g><text x="15" y="${base-105}" font-size="28" font-weight="bold" fill="${color}">${title}</text><text x="15" y="${base-76}" font-size="18" fill="${color}">${english}</text><text x="15" y="${base-40}" font-size="20">${description}</text>${fill(-q,q,color,.22)}${fill(-4.5,-q,'#d59454',.38)}${fill(q,4.5,'#d59454',.38)}<path d="${path}" fill="none" stroke="${color}" stroke-width="4"/><path d="M${X(-4.5)} ${base}H${X(4.5)}" stroke="#888"/><text x="${X(0)}" y="${base-160}" text-anchor="middle" font-size="28" fill="${color}">中央 ${(area*100).toFixed(1)}%</text>${[-q,q].map(v=>`<path d="M${X(v)} ${base-113}V${base}" stroke="${color}" stroke-dasharray="5 5"/><text x="${X(v)}" y="${base+29}" text-anchor="middle" font-size="25" fill="${color}">${v>0?'+':''}${v}</text>`).join('')}<text x="${X(-3.6)}" y="${base-35}" text-anchor="middle" font-size="20">${tail}%</text><text x="${X(3.6)}" y="${base-35}" text-anchor="middle" font-size="20">${tail}%</text>${[-4,0,4].map(v=>`<text x="${X(v)}" y="${base+29}" text-anchor="middle" font-size="20" fill="#777">${v}</text>`).join('')}</g>`;
 }
 const tq=stage===1?1.96:2.7764,ta=stage===1?mass:.95;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1120 520" role="img" aria-label="標準正規は中央95%が約プラスマイナス1.96。自由度4のtは同じ範囲で約${(mass*100).toFixed(1)}%。中央95%には約プラスマイナス2.7764が必要。"><g font-family="Arial,Hiragino Sans,sans-serif" fill="#263e49">${panel(215,x=>M.normal(x),1.96,'#176d82','標準正規 Z','Standard normal','母分散が既知',.95)}${panel(465,x=>M.tPdf(x,4),tq,'#b96930','t分布：自由度4','Student’s t · df = 4','5試合から分散を推定',ta)}<text x="1060" y="515" text-anchor="end" font-size="17" fill="#777">横軸・縦軸は共通 ／ 標準化した値</text></g></svg>`;
 const name=`t-normal-95-${stage}.svg`;writeFileSync(resolve(here,`images/${name}`),svg);return `![width:1120px](images/${name})`;
}

export function tTableHighlight(here,M){
 const left=225,top=100,h=64,widths=[175,210,210,210],xs=[left,left+175,left+385,left+595],rows=[4,10,20,60];
 const cells=(row,y,header=false)=>row.map((value,j)=>{const selected=!header&&value==='2.7764',column=j===2,rowSelected=!header&&row[0]==='4',bg=selected?'#176d82':rowSelected?'#e0eef2':column?'#f4e2b6':header?'#edf1f2':'white';return `<rect x="${xs[j]}" y="${y}" width="${widths[j]}" height="${h}" fill="${bg}" stroke="#b8c8cc"/><text x="${xs[j]+widths[j]/2}" y="${y+43}" text-anchor="middle" font-size="${selected?36:30}" font-weight="${selected||header?'bold':'normal'}" fill="${selected?'white':'#263e49'}">${value}</text>`;}).join('');
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1120 510" role="img" aria-label="t分布表。自由度4の行と上側確率0.025の列をたどり、交点の2.7764を読む。"><g font-family="Arial,Hiragino Sans,sans-serif">${cells(['ν ＼ α','0.05','0.025','0.01'],top,true)}${rows.map((df,i)=>cells([String(df),...M.table[df].slice(1,4).map(x=>x.toFixed(4))],top+(i+1)*h)).join('')}<text x="715" y="30" text-anchor="middle" font-size="28" fill="#986223">上側2.5% ＝ 0.025</text><path d="M715 45V87l-7-10m7 10 7-10" stroke="#b87532" stroke-width="3" fill="none"/><text x="15" y="193" font-size="27" fill="#176d82">自由度4</text><path d="M145 195H210l-9-7m9 7-9 7" stroke="#176d82" stroke-width="3" fill="none"/><text x="715" y="468" text-anchor="middle" font-size="28" fill="#176d82">交点の2.7764は、確率ではなく「境界」</text><text x="715" y="502" text-anchor="middle" font-size="22" fill="#555">中央95%の左端は−2.7764、右端は＋2.7764</text></g></svg>`;
 writeFileSync(resolve(here,'images/t-table-df4-highlight.svg'),svg);return '![width:1100px](images/t-table-df4-highlight.svg)';
}
