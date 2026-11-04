(() => {
  window.bindSlideAnnotations = ({surface, viewport, toolbar, file}) => {
    const layer=document.createElement('canvas');
    layer.className='slide-ink';layer.setAttribute('aria-label','Slide drawing area / 書き込み領域');
    surface.append(layer);
    const controls=document.createElement('div');controls.className='slide-ink-tools';
    controls.setAttribute('role','group');controls.setAttribute('aria-label','Slide annotations / スライド書き込み');
    const button=(label,action)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',action);controls.append(b);return b;};
    let mode='view',page=1,active=null,pointer=null,ready=false;
    const key=`statsb-slide-ink:${file}`;
    let pages={};try{pages=JSON.parse(localStorage.getItem(key)||'{}')||{};}catch{}
    const save=()=>{try{localStorage.setItem(key,JSON.stringify(pages));}catch{status.textContent='このタブ内のみ保存 / Saved in this tab only';}};
    const setMode=value=>{finish();mode=value;viewport.dataset.slideDrawing=String(value!=='view');layer.style.pointerEvents=value==='view'?'none':'auto';layer.style.cursor=value==='erase'?'cell':'crosshair';pen.setAttribute('aria-pressed',String(value==='pen'));eraser.setAttribute('aria-pressed',String(value==='erase'));status.textContent=value==='view'?'閲覧 / View':value==='erase'?'消しゴム / Eraser':'ペン / Pen';};
    const pen=button('ペン / Pen',()=>setMode(mode==='pen'?'view':'pen'));
    pen.setAttribute('aria-pressed','false');
    const colorLabel=document.createElement('label');colorLabel.textContent='色 / Color ';
    const color=document.createElement('input');color.type='color';color.value='#e04b35';color.setAttribute('aria-label','Pen color / ペンの色');colorLabel.append(color);controls.append(colorLabel);
    const widthLabel=document.createElement('label');widthLabel.textContent='太さ / Width ';
    const width=document.createElement('select');width.setAttribute('aria-label','Pen width / ペンの太さ');
    [2,3,5,8].forEach(v=>{const o=new Option(String(v),String(v));o.selected=v===3;width.append(o);});widthLabel.append(width);controls.append(widthLabel);
    const eraser=button('消しゴム / Eraser',()=>setMode(mode==='erase'?'view':'erase'));eraser.setAttribute('aria-pressed','false');
    const undo=button('戻す / Undo',()=>{finish();(pages[page]||[]).pop();save();redraw();});
    const clear=button('このページを消す / Clear page',()=>{finish();if((pages[page]||[]).length&&confirm('このスライドの書き込みを消しますか？ / Clear annotations on this slide?')){delete pages[page];save();redraw();}});
    const status=document.createElement('span');status.className='slide-ink-status';status.textContent='閲覧 / View';controls.append(status);
    toolbar.after(controls);
    const redraw=()=>{
      if(!ready)return;
      const w=surface.clientWidth,h=surface.clientHeight,dpr=Math.min(devicePixelRatio||1,3);
      layer.width=Math.round(w*dpr);layer.height=Math.round(h*dpr);
      const ctx=layer.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.lineCap=ctx.lineJoin='round';
      for(const s of pages[page]||[]){ctx.globalCompositeOperation=s.erase?'destination-out':'source-over';ctx.strokeStyle=ctx.fillStyle=s.color;ctx.lineWidth=s.width*w/1000;ctx.beginPath();s.points.forEach(([x,y],i)=>i?ctx.lineTo(x*w,y*h):ctx.moveTo(x*w,y*h));if(s.points.length===1){const [x,y]=s.points[0];ctx.arc(x*w,y*h,ctx.lineWidth/2,0,2*Math.PI);ctx.fill();}else ctx.stroke();}
      undo.disabled=clear.disabled=!(pages[page]||[]).length;
    };
    const point=e=>{const r=layer.getBoundingClientRect();return [Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))];};
    function finish(){if(!active)return;active=null;pointer=null;save();}
    layer.addEventListener('pointerdown',e=>{if(mode==='view'||!ready||!e.isPrimary||e.button!==0)return;e.preventDefault();e.stopPropagation();pointer=e.pointerId;layer.setPointerCapture(pointer);active={color:color.value,width:mode==='erase'?24:Number(width.value),erase:mode==='erase',points:[point(e)]};(pages[page]||= []).push(active);redraw();});
    layer.addEventListener('pointermove',e=>{if(!active||e.pointerId!==pointer)return;e.preventDefault();for(const p of e.getCoalescedEvents?.()||[e])active.points.push(point(p));redraw();});
    for(const type of ['pointerup','pointercancel','lostpointercapture'])layer.addEventListener(type,finish);
    layer.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mode!=='view'){setMode('view');e.preventDefault();}});
    new ResizeObserver(redraw).observe(surface);
    return {show(n){finish();page=n;ready=true;redraw();},loading(){finish();ready=false;layer.style.visibility='hidden';},rendered(n){layer.style.visibility='';this.show(n);}};
  };
})();
