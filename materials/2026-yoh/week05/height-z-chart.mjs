// Two aligned linear scales: one original value corresponds to one z position.
export function heightZChart({mean,sd,observations=[],title='',schematic=false,distanceTo=null,unit='cm',quantity='身長',shadeFrom=null,areaLabel='',boundaryNote='',revealStage=null}){
  if(!Number.isFinite(mean)||!Number.isFinite(sd)||sd<=0)throw Error('Height chart requires a finite mean and positive SD');
  const showDistance=Number.isFinite(distanceTo);
  const W=1100,H=showDistance?630:580,L=90,R=38,T=85,base=345,zBase=425,pw=W-L-R;
  const X=z=>L+(z+3.5)/7*pw;
  const Y=z=>base-Math.exp(-z*z/2)*235;
  const fmt=n=>Number(n.toFixed(2)).toString().replace('-', '−');
  const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
  const ticks=Array.from({length:7},(_,i)=>i-3);
  const path=Array.from({length:501},(_,i)=>{const z=-3.5+7*i/500;return `${i?'L':'M'}${X(z).toFixed(2)},${Y(z).toFixed(2)}`;}).join(' ');
  const shadeZ=Number.isFinite(shadeFrom)?Math.max(-3.5,Math.min(3.5,(shadeFrom-mean)/sd)):null;
  const shade=shadeZ===null?'':`<path data-shade-from="${shadeFrom}" d="M${X(shadeZ)},${base} ${Array.from({length:201},(_,i)=>{const z=shadeZ+(3.5-shadeZ)*i/200;return `L${X(z)},${Y(z)}`;}).join(' ')} L${X(3.5)},${base}Z" fill="#d99361" fill-opacity=".45"/>`;
  const isMarked=z=>observations.some(o=>Math.abs((o.x-mean)/sd-z)<1e-8);
  const part=(minimum,markup)=>revealStage===null?markup:`<g data-build-min="${minimum}" visibility="${revealStage>=minimum?'visible':'hidden'}">${markup}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="title desc">
<title id="title">${esc(title)} · ${esc(quantity)}とzの対応</title>
<desc id="desc">${revealStage===null?`平均${fmt(mean)}${esc(unit)}、標準偏差${fmt(sd)}${esc(unit)}。${esc(quantity)}の目盛とzの目盛が上下に対応する。${observations.map(o=>`${esc(o.name)}はz=${fmt((o.x-mean)/sd)}`).join('。')}`:`${esc(quantity)}の図を順に読む。段階${revealStage}。平均${fmt(mean)}${esc(unit)}。`}</desc>
<g font-family="Arial,Hiragino Sans,sans-serif" fill="#425560" font-size="23">
<text x="${L}" y="30" font-weight="bold">${esc(title)}</text>
<text x="${X(0)}" y="65" text-anchor="middle" fill="#176d82">平均 μ = ${fmt(mean)}${esc(unit)}</text>
${part(3,shade)}${ticks.map(z=>`<g stroke="${z===0?'#176d82':'#d4dee2'}" stroke-width="${z===0?2:1}" stroke-dasharray="${z===0?'6 4':'3 5'}">${part(z===0?1:2,`<line x1="${X(z)}" x2="${X(z)}" y1="${z===0?T:T+20}" y2="${base}"/>`)}${part(4,`<line x1="${X(z)}" x2="${X(z)}" y1="410" y2="${zBase}"/>`)}</g>`).join('')}
<path d="${path}" fill="none" stroke="#176d82" stroke-width="5"/>
${part(2,`<path d="M${L},${base}H${W-R}" fill="none" stroke="#61737c" stroke-width="2"/><text x="17" y="377" font-size="21">${esc(unit)}</text>`)}${part(4,`<path d="M${L},${zBase}H${W-R}" fill="none" stroke="#61737c" stroke-width="2"/><text x="17" y="457" font-weight="bold">z</text>`)}
${ticks.map(z=>`<g fill="${isMarked(z)?'#ae653c':z===0?'#176d82':'#425560'}" font-weight="${isMarked(z)||z===0?'bold':'normal'}">${part(2,`<path d="M${X(z)},${base}v8" stroke="currentColor"/><text x="${X(z)}" y="377" text-anchor="middle">${fmt(mean+z*sd)}</text>`)}${part(4,`<path d="M${X(z)},${zBase}v8" stroke="currentColor"/><text x="${X(z)}" y="457" text-anchor="middle">${z>0?'+':''}${fmt(z)}</text>`)}</g>`).join('')}
${observations.map(o=>{
    const z=(o.x-mean)/sd,x=X(z),integer=Math.abs(z-Math.round(z))<1e-8;
    return part(3,`<g fill="#ae653c"><g stroke="#ae653c" stroke-width="2.5" stroke-dasharray="5 4"><line x1="${x}" x2="${x}" y1="${T+15}" y2="${base}"/>${part(4,`<line x1="${x}" x2="${x}" y1="410" y2="${zBase}"/>`)}</g><circle cx="${x}" cy="${Y(z)}" r="7"/><text x="${x}" y="${T+8}" text-anchor="middle" font-weight="bold">${esc(o.name)}</text>${integer?'':`<text x="${x}" y="403" text-anchor="middle" font-weight="bold">${fmt(o.x)}</text>${part(5,`<path d="M${x},${zBase}v20" stroke="#ae653c"/><text x="${x}" y="484" text-anchor="middle" font-weight="bold">${z>0?'+':''}${fmt(z)}</text>`)}`}</g>`);
  }).join('')}
${part(2,`<path d="M${X(0)},502v10H${X(1)}v-10" fill="none" stroke="#176d82" stroke-width="2.5"/><text x="${(X(0)+X(1))/2}" y="541" text-anchor="middle" fill="#176d82" font-weight="bold">1σ = ${fmt(sd)}${esc(unit)}</text>`)}
${part(3,showDistance?`<path data-distance-${unit==='cm'?'cm':'value'}="${fmt(distanceTo-mean)}" d="M${X(0)},552v10H${X((distanceTo-mean)/sd)}v-10" fill="none" stroke="#ae653c" stroke-width="2.5"/><text x="${(X(0)+X((distanceTo-mean)/sd))/2}" y="591" text-anchor="middle" fill="#ae653c" font-weight="bold">平均との差 = ${fmt(distanceTo-mean)}${esc(unit)}</text>`:'')}
${part(5,areaLabel?`<text x="${W-R}" y="165" text-anchor="end" font-size="23" font-weight="bold" fill="#ae653c" paint-order="stroke" stroke="#fbfaf6" stroke-width="7">${esc(areaLabel)}</text>\n`:'')}${part(5,boundaryNote?`<text x="${W-R}" y="202" text-anchor="end" font-size="20" paint-order="stroke" stroke="#fbfaf6" stroke-width="7">${esc(boundaryNote)}</text>\n`:'')}${part(4,`<text x="${L}" y="${H-6}" font-size="18">点線は平均から1標準偏差ごとの位置（z = −3, −2, −1, 0, +1, +2, +3）。</text>`)}
${schematic?`<text x="${W-R}" y="541" text-anchor="end" font-size="17">曲線は模式図・実測分布ではない</text>`:''}
</g></svg>`;
}
