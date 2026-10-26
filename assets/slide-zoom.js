(() => {
  const clamp = value => Math.max(1, Math.min(3, value));
  const wheelScale = (scale, delta, mode = 0, pinch = false) => {
    const pixels = delta * (mode === 1 ? 16 : mode === 2 ? 400 : 1);
    return clamp(scale * Math.exp(-Math.max(-40, Math.min(40, pixels)) * (pinch ? 0.004 : 0.0017)));
  };
  const bindSlideZoom = ({viewport, surface, toolbar, before, onSettled = () => {}}) => {
    const stage = document.createElement('div');
    stage.className = 'pdf-zoom-stage';
    viewport.insertBefore(stage, surface);
    stage.append(surface);
    const reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'pdf-zoom-reset';
    reset.title = 'Pinch or scroll to zoom. Click to fit. / ピンチ・2本指スクロールで拡大。クリックで元の大きさへ';
    toolbar.insertBefore(reset, before);
    let scale = 1, width = 0, height = 0, timer, pinch, drag, safariGesture, suppressClickUntil = 0;
    const draw = () => {
      stage.style.width = `${width * scale}px`;
      stage.style.height = `${height * scale}px`;
      surface.style.transform = `scale(${scale})`;
      viewport.dataset.slideZoomed = String(scale > 1.001);
      reset.textContent = `${Math.round(scale * 100)}%`;
      reset.setAttribute('aria-label', `Zoom ${Math.round(scale * 100)}%. Reset to fit / 拡大率${Math.round(scale * 100)}%。元の大きさに戻す`);
    };
    const settled = () => {
      clearTimeout(timer);
      timer = setTimeout(onSettled, 240);
    };
    const zoomAt = (value, clientX, clientY) => {
      const next = clamp(value);
      if (!width || Math.abs(next - scale) < 0.0001) return;
      const old = stage.getBoundingClientRect();
      const x = (clientX - old.left) / scale, y = (clientY - old.top) / scale;
      scale = next;
      draw();
      const current = stage.getBoundingClientRect();
      viewport.scrollLeft += current.left + x * scale - clientX;
      viewport.scrollTop += current.top + y * scale - clientY;
      settled();
    };
    const fit = (notify = true) => {
      clearTimeout(timer);
      scale = 1;
      pinch = drag = safariGesture = null;
      draw();
      viewport.scrollLeft = viewport.scrollTop = 0;
      if (notify) settled();
    };
    reset.addEventListener('click', () => fit());
    viewport.addEventListener('wheel', event => {
      // Leave sideways trackpad movements available for panning a magnified slide.
      if (event.shiftKey || (!event.ctrlKey && Math.abs(event.deltaX) > Math.abs(event.deltaY) * 1.25)) return;
      event.preventDefault();
      if (safariGesture) return;
      zoomAt(wheelScale(scale, event.deltaY, event.deltaMode, event.ctrlKey), event.clientX, event.clientY);
    }, {passive:false});
    const centre = touches => ({x:(touches[0].clientX + touches[1].clientX)/2, y:(touches[0].clientY + touches[1].clientY)/2});
    const distance = touches => Math.hypot(touches[0].clientX-touches[1].clientX, touches[0].clientY-touches[1].clientY);
    viewport.addEventListener('touchstart', event => {
      if (event.touches.length === 2) {
        event.preventDefault();
        pinch = {distance:Math.max(1,distance(event.touches)), scale, centre:centre(event.touches)};
        drag = null;
        suppressClickUntil = Date.now() + 600;
      } else if (event.touches.length === 1) {
        drag = {x:event.touches[0].clientX, y:event.touches[0].clientY};
      }
    }, {passive:false});
    viewport.addEventListener('touchmove', event => {
      if (event.touches.length === 2 && pinch) {
        event.preventDefault();
        const point = centre(event.touches);
        zoomAt(pinch.scale * Math.pow(distance(event.touches)/pinch.distance, 0.7), pinch.centre.x, pinch.centre.y);
        viewport.scrollLeft += pinch.centre.x - point.x;
        viewport.scrollTop += pinch.centre.y - point.y;
        pinch.centre = point;
        suppressClickUntil = Date.now() + 600;
      } else if (event.touches.length === 1 && drag) {
        const point = event.touches[0], dx = drag.x-point.clientX, dy = drag.y-point.clientY;
        if (scale > 1.001) {
          event.preventDefault();
          viewport.scrollLeft += dx;
          viewport.scrollTop += dy;
          suppressClickUntil = Date.now() + 600;
        } else if (Math.abs(dy) > Math.abs(dx)*1.2) {
          event.preventDefault();
          window.scrollBy(0,dy);
        }
        drag = {x:point.clientX,y:point.clientY};
      }
    }, {passive:false});
    const end = event => {
      if (pinch) suppressClickUntil = Date.now() + 600;
      pinch = drag = null;
      if (event.touches.length === 1 && scale > 1.001) drag = {x:event.touches[0].clientX,y:event.touches[0].clientY};
    };
    viewport.addEventListener('touchend', end, {passive:true});
    viewport.addEventListener('touchcancel', () => {pinch=drag=null;}, {passive:true});
    // Safari exposes trackpad pinches through gesture events on some versions.
    viewport.addEventListener('gesturestart', event => {event.preventDefault();if(!pinch)safariGesture={scale};}, {passive:false});
    viewport.addEventListener('gesturechange', event => {
      event.preventDefault();
      if (!safariGesture || pinch) return;
      const rect=viewport.getBoundingClientRect();
      zoomAt(safariGesture.scale*Math.pow(event.scale,0.7),event.clientX ?? rect.left+rect.width/2,event.clientY ?? rect.top+rect.height/2);
    }, {passive:false});
    viewport.addEventListener('gestureend', event => {event.preventDefault();safariGesture=null;}, {passive:false});
    viewport.addEventListener('click', event => {
      if (Date.now() < suppressClickUntil) {event.preventDefault();event.stopImmediatePropagation();}
    }, true);
    draw();
    return {
      get scale(){return scale;},
      fit,
      setPageSize(w,h,fullscreen=false){
        width=w;height=h;
        viewport.style.height=fullscreen?'':`${Math.max(300,h+32)}px`;
        draw();
      }
    };
  };
  if(typeof module==='object'&&module.exports)module.exports={clamp,wheelScale,bindSlideZoom};
  if(typeof window!=='undefined')window.bindSlideZoom=bindSlideZoom;
})();
