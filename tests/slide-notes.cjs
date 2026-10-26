const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
class Element{
  constructor(){this.children=[];this.dataset={};this.attributes={};this.hidden=false;}
  append(...children){this.children.push(...children);}
  after(element){this.caption=element;}
  setAttribute(name,value){this.attributes[name]=value;}
}
const deck='materials/2026-yoh/week05/w5.pdf';
const data=JSON.parse(fs.readFileSync('materials/2026-yoh/week05/w5.notes.json','utf8'));
const mapping=JSON.parse(fs.readFileSync('materials/2026-yoh/week05/source-map.json','utf8')).slides;
assert.equal(data.deck,deck);
assert.equal(data.slides.length,mapping.length);
assert.equal(data.slides.length,60);
const uniqueJa=new Set(),uniqueEn=new Set();
for(const [i,note] of data.slides.entries()){
  assert.equal(note.page,i+1);
  assert.equal(note.title,mapping[i].title);
  assert(note.ja.length>=30&&note.en.length>=50,`Substantive bilingual note on page ${i+1}`);
  assert(!/Yoh.?2025|元のスライド|Teaching source/.test(note.ja+note.en));
  uniqueJa.add(note.ja);uniqueEn.add(note.en);
}
assert.equal(uniqueJa.size,data.slides.length);assert.equal(uniqueEn.size,data.slides.length);
for(const page of mapping.filter(s=>s.layout==='challenge').map(s=>s.slide)){
  const note=data.slides[page-1];
  assert(!/25％|25 percent|2\.275|95\.45|z\s*=\s*2/.test(note.ja+note.en),`No solution in challenge ${page}`);
}
const code=fs.readFileSync('assets/slide-notes.js','utf8');
function setup(fetch){
  const context={window:{},document:{createElement:()=>new Element()},fetch,console:{warn(){}}};
  vm.runInNewContext(code,context);
  return context.window.bindSlideNotes;
}
(async()=>{
  let resolveRequest,calls=0;
  const bind=setup(()=>{calls++;return new Promise(resolve=>{resolveRequest=resolve;});});
  const surface=new Element();
  const notes=bind({file:deck,after:surface});
  notes.show(1);notes.show(26);
  assert(surface.caption.hidden,'No stale placeholder while loading');
  resolveRequest({ok:true,json:async()=>data});
  await notes.ready;
  assert.equal(surface.caption.dataset.slide,'26','A late response uses the current displayed page');
  assert.equal(surface.caption.children[1].textContent,data.slides[25].ja);
  assert.equal(surface.caption.children[2].textContent,data.slides[25].en);
  assert.equal(surface.caption.children[1].lang,'ja');
  assert.equal(surface.caption.children[2].lang,'en');
  notes.show(40);assert.equal(surface.caption.dataset.slide,'40');
  notes.show(1);assert.equal(surface.caption.children[1].textContent,data.slides[0].ja);
  notes.show(60);assert.equal(surface.caption.dataset.slide,'60');
  const other=new Element();bind({file:deck,after:other});assert.equal(calls,1,'Cache shared notes requests');
  const unsupported=new Element();await bind({file:'other.pdf',after:unsupported}).ready;
  assert.equal(unsupported.caption,undefined);assert.equal(calls,1,'No missing notes requests for other decks');
  const failed=new Element();
  const unavailable=setup(async()=>({ok:false}));
  const fallback=unavailable({file:deck,after:failed});fallback.show(1);await fallback.ready;
  assert(failed.caption.hidden,'Notes failure is isolated from PDF preview');
  const viewer=fs.readFileSync('viewer.html','utf8');
  assert(viewer.indexOf('narration?.show(requestedPage)')>viewer.indexOf('await page.render'));
  console.log('Slide captions: 60 bilingual notes, exact page alignment, challenge safety, navigation, late loading, caching and failure isolation verified.');
})().catch(error=>{console.error(error);process.exitCode=1;});
