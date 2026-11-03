(() => {
  'use strict';
  const M=window.StatsBWeek6,host=document.getElementById('lab');
  const mode=new URLSearchParams(location.search).get('mode')||'board';
  const typeset=()=>window.MathJax?.typesetPromise?.([host]).catch(()=>{});
  const board=()=>window.StatsBWeek6Board(host);
  const stories={...window.StatsBWeek6Stories,...window.StatsBWeek6Extras};
  if(mode==='board')board();else (stories[mode]||stories.sampling)(host);
  if(window.parent!==window)new ResizeObserver(()=>window.parent.postMessage({type:'statsb-week6-height',height:Math.ceil(host.scrollHeight+56)},location.origin)).observe(host);
  if(window.MathJax?.startup?.promise)window.MathJax.startup.promise.then(typeset);else window.addEventListener('load',typeset,{once:true});
})();
