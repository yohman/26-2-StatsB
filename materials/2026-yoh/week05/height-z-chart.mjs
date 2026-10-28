// Two aligned linear scales: one physical height corresponds to one z position.
export function heightZChart({mean,sd,observations=[],title='',schematic=false}){
  if(!Number.isFinite(mean)||!Number.isFinite(sd)||sd<=0)throw Error('Height chart requires a finite mean and positive SD');
  const W=1100,H=580,L=90,R=38,T=85,base=345,zBase=425,pw=W-L-R;
  const X=z=>L+(z+3.5)/7*pw;
  const Y=z=>base-Math.exp(-z*z/2)*235;
  const fmt=n=>Number(n.toFixed(2)).toString().replace('-', '−');
  const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
  const ticks=Array.from({length:7},(_,i)=>i-3);
  const path=Array.from({length:501},(_,i)=>{const z=-3.5+7*i/500;return `${i?'L':'M'}${X(z).toFixed(2)},${Y(z).toFixed(2)}`;}).join(' ');
  const isMarked=z=>observations.some(o=>Math.abs((o.x-mean)/sd-z)<1e-8);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="title desc">
<title id="title">${esc(title)} · 身長とzの対応</title>
<desc id="desc">平均${fmt(mean)}cm、標準偏差${fmt(sd)}cm。身長の目盛とzの目盛が上下に対応する。${observations.map(o=>`${esc(o.name)}はz=${fmt((o.x-mean)/sd)}`).join('。')}</desc>
<g font-family="Arial,Hiragino Sans,sans-serif" fill="#425560" font-size="23">
<text x="${L}" y="30" font-weight="bold">${esc(title)}</text>
<text x="${X(0)}" y="65" text-anchor="middle" fill="#176d82">平均 μ = ${fmt(mean)}cm</text>
${ticks.map(z=>`<line x1="${X(z)}" x2="${X(z)}" y1="${z===0?T:T+20}" y2="${zBase}" stroke="${z===0?'#176d82':'#d4dee2'}" stroke-width="${z===0?2:1}" stroke-dasharray="${z===0?'6 4':'3 5'}"/>`).join('')}
<path d="${path}" fill="none" stroke="#176d82" stroke-width="5"/>
<path d="M${L},${base}H${W-R}M${L},${zBase}H${W-R}" fill="none" stroke="#61737c" stroke-width="2"/>
<text x="17" y="377" font-size="21">cm</text><text x="17" y="457" font-weight="bold">z</text>
${ticks.map(z=>`<g fill="${isMarked(z)?'#ae653c':z===0?'#176d82':'#425560'}" font-weight="${isMarked(z)||z===0?'bold':'normal'}"><path d="M${X(z)},${base}v8M${X(z)},${zBase}v8" stroke="currentColor"/><text x="${X(z)}" y="377" text-anchor="middle">${fmt(mean+z*sd)}</text><text x="${X(z)}" y="457" text-anchor="middle">${z>0?'+':''}${fmt(z)}</text></g>`).join('')}
${observations.map(o=>{
    const z=(o.x-mean)/sd,x=X(z),integer=Math.abs(z-Math.round(z))<1e-8;
    return `<g fill="#ae653c"><line x1="${x}" x2="${x}" y1="${T+15}" y2="${zBase}" stroke="#ae653c" stroke-width="2.5" stroke-dasharray="5 4"/><circle cx="${x}" cy="${Y(z)}" r="7"/><text x="${x}" y="${T+8}" text-anchor="middle" font-weight="bold">${esc(o.name)}</text>${integer?'':`<text x="${x}" y="403" text-anchor="middle" font-weight="bold">${fmt(o.x)}</text><path d="M${x},${zBase}v20" stroke="#ae653c"/><text x="${x}" y="484" text-anchor="middle" font-weight="bold">${z>0?'+':''}${fmt(z)}</text>`}</g>`;
  }).join('')}
<path d="M${X(0)},502v10H${X(1)}v-10" fill="none" stroke="#176d82" stroke-width="2.5"/>
<text x="${(X(0)+X(1))/2}" y="541" text-anchor="middle" fill="#176d82" font-weight="bold">1σ = ${fmt(sd)}cm</text>
<text x="${L}" y="574" font-size="18">点線は平均から1標準偏差ごとの位置（z = −3, −2, −1, 0, +1, +2, +3）。</text>
${schematic?`<text x="${W-R}" y="541" text-anchor="end" font-size="17">曲線は模式図・実測分布ではない</text>`:''}
</g></svg>`;
}
