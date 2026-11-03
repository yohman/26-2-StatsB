(() => {
  'use strict';
  const M=window.StatsBWeek6,host=document.getElementById('lab');
  const mode=new URLSearchParams(location.search).get('mode')||'board';
  const typeset=()=>window.MathJax?.typesetPromise?.([host]).catch(()=>{});
  function board(){
    host.innerHTML=`<h1>ガルトンのボード<span class="en">Galton board · sums of left/right steps</span></h1><p>玉は釘ごとに左右へ。最後はどこに集まる？ まず予想してから落とそう。</p><label>釘の段数<select id="rows"><option>4</option><option selected>12</option><option>20</option></select></label><button id="one">1個落とす</button><button id="many">100個落とす</button><button class="secondary" id="reset">リセット</button><div class="board"><canvas width="840" height="410" aria-label="左右へ跳ねる玉と釘のアニメーション"></canvas></div><p class="legend"><span class="emp">■ 実際に落ちた玉の割合</span>　<span class="model">□ 理論の二項確率（固定）</span></p><div class="chart" id="hist"></div><output aria-live="polite"></output><p class="note">この理想モデルは左右1/2・独立。段数を固定した分布は離散の二項分布。段数が増えると正規近似がよくなる。玉の数を増やすと観測割合が理論に近づく。2つを混同しない。</p>`;
    let counts=[],n=12,total=0,busy=false;
    const canvas=host.querySelector('canvas'),ctx=canvas.getContext('2d');
    const at=(r,k)=>[420+(2*k-r)*Math.min(27,340/n),25+r*330/n];
    function paint(ball){ctx.clearRect(0,0,840,410);ctx.fillStyle='#2a6173';for(let r=0;r<n;r++)for(let k=0;k<=r;k++){const[x,y]=at(r,k);ctx.beginPath();ctx.arc(x,y,3,0,7);ctx.fill();}if(ball){ctx.fillStyle='#cb7943';ctx.beginPath();ctx.arc(ball[0],ball[1],8,0,7);ctx.fill();}ctx.fillStyle='#526f79';ctx.font='15px sans-serif';for(let k=0;k<=n;k++){const[x,y]=at(n,k);ctx.fillText(String(k),x-5,y+28);}}
    function draw(){const p=M.binomial(n),W=900,H=180,bw=800/(n+1);host.querySelector('#hist').innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="右へ進んだ回数の理論と観測割合">${p.map((v,k)=>`<rect x="${50+k*bw+3}" y="${145-v*130}" width="${bw/2-4}" height="${v*130}" fill="none" stroke="#176d82" stroke-width="2"/><rect x="${50+k*bw+bw/2}" y="${145-counts[k]/Math.max(total,1)*130}" width="${bw/2-4}" height="${counts[k]/Math.max(total,1)*130}" fill="#c97845"/><text x="${50+(k+.5)*bw}" y="170" text-anchor="middle" font-size="14">${k}</text>`).join('')}</svg>`;host.querySelector('output').textContent=`${n}段・${total}個 ／ 横軸は「右へ進んだ回数」。縦軸は割合、棒の高さ1は100%。`;}
    async function run(amount){if(busy)return;busy=true;host.querySelectorAll('button,select').forEach(e=>e.disabled=true);for(let i=0;i<amount;i++){let k=0;for(let r=0;r<n;r++){paint(at(r,k));k+=Math.random()<.5?1:0;if(amount===1)await new Promise(resolve=>setTimeout(resolve,70));}counts[k]++;total++;paint(at(n,k));draw();await new Promise(resolve=>setTimeout(resolve,amount===1?80:22));}host.querySelectorAll('button,select').forEach(e=>e.disabled=false);busy=false;}
    const reset=()=>{n=Number(host.querySelector('#rows').value);counts=Array(n+1).fill(0);total=0;paint();draw();};
    host.querySelector('#rows').onchange=reset;host.querySelector('#reset').onclick=reset;host.querySelector('#one').onclick=()=>run(1);host.querySelector('#many').onclick=()=>run(100);reset();
  }
  const stories={...window.StatsBWeek6Stories,...window.StatsBWeek6Extras};
  if(mode==='board')board();else (stories[mode]||stories.sampling)(host);
  if(window.parent!==window)new ResizeObserver(()=>window.parent.postMessage({type:'statsb-week6-height',height:Math.ceil(host.scrollHeight+56)},location.origin)).observe(host);
  if(window.MathJax?.startup?.promise)window.MathJax.startup.promise.then(typeset);else window.addEventListener('load',typeset,{once:true});
})();
