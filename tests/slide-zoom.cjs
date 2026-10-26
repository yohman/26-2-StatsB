const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {wheelScale,clamp}=require('../assets/slide-zoom.js');
assert.equal(clamp(.1),1);assert.equal(clamp(99),3);
assert(wheelScale(1,-20)>1&&wheelScale(1,-20)<1.04,'A normal scroll gives a gentle change');
assert(wheelScale(1,-100000)<1.08,'Single large wheel events are capped');
assert(wheelScale(1,-2,0,true)<1.01,'Small trackpad pinch deltas stay controlled');
assert(Math.abs(wheelScale(wheelScale(1.5,-20),20)-1.5)<1e-9);
class Element{
  constructor(){this.children=[];this.style={};this.dataset={};this.events={};this.attributes={};this.scrollLeft=0;this.scrollTop=0;}
  append(node){if(node.parent)node.parent.children=node.parent.children.filter(child=>child!==node);this.children.push(node);node.parent=this;}
  insertBefore(node,before){if(node.parent)node.parent.children=node.parent.children.filter(child=>child!==node);const i=this.children.indexOf(before);this.children.splice(i<0?this.children.length:i,0,node);node.parent=this;}
  addEventListener(type,callback){(this.events[type]??=[]).push(callback);}
  setAttribute(key,value){this.attributes[key]=value;}
  getBoundingClientRect(){return this.className==='pdf-zoom-stage'?{left:16+Math.max(0,(968-parseFloat(this.style.width||0))/2)-this.parent.scrollLeft,top:16-this.parent.scrollTop,width:parseFloat(this.style.width||0),height:parseFloat(this.style.height||0)}:{left:0,top:0,width:1000,height:600};}
  emit(type,values={}){const e={touches:[],changedTouches:[],preventDefault(){this.prevented=true;},stopImmediatePropagation(){this.stopped=true;},...values};for(const callback of this.events[type]||[])callback(e);return e;}
}
const viewport=new Element(),surface=new Element(),toolbar=new Element(),fullscreen=new Element();
viewport.append(surface);toolbar.append(fullscreen);
let timers=new Map(),serial=0,sharpRenders=0,pageScroll=0;
const context={module:{exports:{}},document:{createElement:()=>new Element(),querySelectorAll:()=>[],addEventListener(){}},window:{scrollBy:(_x,y)=>pageScroll+=y},Math,Date,setTimeout:fn=>{timers.set(++serial,fn);return serial;},clearTimeout:id=>timers.delete(id)};
vm.runInNewContext(fs.readFileSync('assets/slide-zoom.js','utf8'),context);
const zoom=context.window.bindSlideZoom({viewport,surface,toolbar,before:fullscreen,onSettled:()=>sharpRenders++});
zoom.setPageSize(800,450);
assert.equal(viewport.style.height,'482px');
assert.equal(toolbar.children[0].textContent,'100%');
const stage=viewport.children[0];
let prevented=viewport.emit('wheel',{deltaX:0,deltaY:-20,deltaMode:0,clientX:500,clientY:250});
assert(prevented.prevented);assert(zoom.scale>1&&zoom.scale<1.04);
assert.equal(surface.parent,stage,'Canvas and clickable link layer zoom together');
for(let i=0;i<30;i++)viewport.emit('wheel',{deltaX:0,deltaY:-20,deltaMode:0,clientX:500,clientY:250});
assert.equal(timers.size,1,'Sharp PDF re-render waits for the gesture to settle');
[...timers.values()][0]();assert.equal(sharpRenders,1);
assert.equal(viewport.dataset.slideZoomed,'true');
toolbar.children[0].emit('click');assert.equal(zoom.scale,1);assert.equal(viewport.scrollLeft,0);assert.equal(viewport.scrollTop,0);
const touch=(x,y)=>({clientX:x,clientY:y});
viewport.emit('touchstart',{touches:[touch(300,200),touch(400,200)]});
viewport.emit('touchmove',{touches:[touch(250,200),touch(450,200)]});
assert(Math.abs(zoom.scale-Math.pow(2,.7))<1e-9,'Touch pinch has deliberate damping');
const beforePan=viewport.scrollLeft;
viewport.emit('touchend',{touches:[touch(450,200)]});
viewport.emit('touchmove',{touches:[touch(430,180)]});
assert.equal(viewport.scrollLeft,beforePan+20,'One finger pans when magnified');
assert(viewport.emit('click').prevented,'A pinch cannot accidentally follow a slide link');
vm.runInNewContext(fs.readFileSync('assets/slide-browsing.js','utf8'),context);
let next=0,previous=0;context.window.bindSlideSwipe(viewport,()=>previous++,()=>next++);
viewport.emit('touchstart',{touches:[touch(400,200)]});
viewport.emit('touchend',{changedTouches:[touch(200,200)]});
assert.equal(next,0,'Panning a magnified slide does not advance');
zoom.fit(false);
viewport.emit('touchstart',{touches:[touch(400,200)]});
viewport.emit('touchend',{changedTouches:[touch(200,200)]});assert.equal(next,1,'Single-finger slide swipes still work at fit');
viewport.emit('touchstart',{touches:[touch(400,200)]});
viewport.emit('touchmove',{touches:[touch(400,170)]});assert.equal(pageScroll,30,'Vertical page movement remains available at fit');
const viewer=fs.readFileSync('viewer.html','utf8');
assert(viewer.includes('assets/slide-zoom.js'));
assert(viewer.includes('slideZoom.fit(false)'));
assert(viewer.includes('(slideZoom?.scale || 1), 4'));
console.log('Slide zoom: gentle wheel and pinch, bounded scale, reset, pan, swipe isolation, link protection and debounced sharp re-render verified.');
