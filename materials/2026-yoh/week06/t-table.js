(() => {
 'use strict';
 const data=window.StatsBTTable,table=document.querySelector('#critical-table'),df=document.querySelector('#df'),alpha=document.querySelector('#alpha'),scroll=document.querySelector('.table-scroll');
 const label=key=>key==='inf'?'∞':key,percent=v=>Number((v*100).toFixed(3)).toString();
 df.innerHTML=data.rows.map(row=>`<option value="${row.df}">${label(row.df)}${row.df==='inf'?'（標準正規）':''}</option>`).join('');
 alpha.innerHTML=data.alpha.map(a=>`<option value="${a}">${a}</option>`).join('');
 table.innerHTML=`<caption>上側確率αに対応する正のt境界（小数第4位）</caption><thead><tr><th scope="col">ν ＼ α<small>自由度 / 上側</small></th>${data.alpha.map((a,i)=>`<th scope="col" data-column="${i}">${a}<small>両側2α＝${Number((2*a).toFixed(4))}</small></th>`).join('')}</tr></thead><tbody>${data.rows.map((row,r)=>`<tr${[5,10,15,20,25,30].includes(+row.df)?' class="group-end"':''}><th scope="row">${label(row.df)}</th>${row.values.map((v,c)=>`<td tabindex="-1" role="button" data-row="${r}" data-col="${c}" aria-label="自由度${label(row.df)}、上側${data.alpha[c]}、境界${v.toFixed(4)}">${v.toFixed(4)}</td>`).join('')}</tr>`).join('')}</tbody>`;
 const cells=[...table.querySelectorAll('td')],params=new URLSearchParams(location.search);
 let pinned={r:Math.max(0,data.rows.findIndex(row=>row.df===(params.get('df')||'4'))),c:data.alpha.indexOf(Number(params.get('alpha')||.025))};if(pinned.c<0)pinned.c=4;
 let active=null,guides=[];
 const cellAt=(r,c)=>table.querySelector(`[data-row="${r}"][data-col="${c}"]`);
 function show(cell){if(!cell||cell===active)return;guides.forEach(e=>e.classList.remove('guide'));active?.classList.remove('current');active=cell;const r=+cell.dataset.row,c=+cell.dataset.col,row=data.rows[r],a=data.alpha[c],value=row.values[c];
  guides=[...cell.parentElement.children,...table.querySelectorAll(`tr > :nth-child(${c+2})`)];guides.forEach(e=>e.classList.add('guide'));cell.classList.add('current');
  document.querySelector('#row-value').textContent=label(row.df);document.querySelector('#alpha-value').textContent=String(a);document.querySelector('#critical-value').textContent=value.toFixed(4);
  document.querySelector('#meaning').textContent=`右側${percent(a)}%の境界は ＋${value.toFixed(4)}。中央${percent(1-2*a)}%の範囲は −${value.toFixed(4)} 〜 ＋${value.toFixed(4)}。`;
 }
 function pin(r,c,jump=false,updateUrl=true){pinned={r,c};cells.forEach(e=>{e.tabIndex=-1;e.setAttribute('aria-pressed','false');});const cell=cellAt(r,c);cell.tabIndex=0;cell.setAttribute('aria-pressed','true');df.value=data.rows[r].df;alpha.value=data.alpha[c];show(cell);
  document.querySelector('#pinned').textContent=`固定した選択：自由度${label(data.rows[r].df)} × 上側${data.alpha[c]} → ${data.rows[r].values[c].toFixed(4)}。`;
  if(updateUrl){const url=new URL(location.href);url.searchParams.set('df',data.rows[r].df);url.searchParams.set('alpha',data.alpha[c]);history.replaceState(null,'',url);}
  if(jump){cell.scrollIntoView({block:'center',inline:'center',behavior:'auto'});cell.focus({preventScroll:true});}
 }
 const useControls=jump=>pin(data.rows.findIndex(row=>row.df===df.value),data.alpha.indexOf(+alpha.value),jump);
 df.onchange=()=>useControls(true);alpha.onchange=()=>useControls(true);document.querySelector('#jump').onclick=()=>useControls(true);
 document.querySelector('#ninety-five').onclick=()=>pin(data.rows.findIndex(row=>row.df==='4'),4,true);
 document.querySelector('#ninety').onclick=()=>pin(data.rows.findIndex(row=>row.df==='4'),3,true);
 table.onpointermove=e=>show(e.target.closest('td'));table.onpointerleave=()=>show(cellAt(pinned.r,pinned.c));table.onfocusin=e=>show(e.target.closest('td'));
 table.onclick=e=>{const cell=e.target.closest('td');if(cell)pin(+cell.dataset.row,+cell.dataset.col);};
 table.onkeydown=e=>{const cell=e.target.closest('td');if(!cell)return;let r=+cell.dataset.row,c=+cell.dataset.col;if(e.key==='Enter'||e.key===' '){e.preventDefault();pin(r,c);return;}const moves={ArrowUp:[-1,0],ArrowDown:[1,0],ArrowLeft:[0,-1],ArrowRight:[0,1]};if(!moves[e.key])return;e.preventDefault();r=Math.max(0,Math.min(data.rows.length-1,r+moves[e.key][0]));c=Math.max(0,Math.min(data.alpha.length-1,c+moves[e.key][1]));const next=cellAt(r,c);next.focus({preventScroll:true});next.scrollIntoView({block:'nearest',inline:'nearest'});show(next);};
 scroll.onfocusout=e=>{if(!scroll.contains(e.relatedTarget))show(cellAt(pinned.r,pinned.c));};pin(pinned.r,pinned.c,false,false);
})();
