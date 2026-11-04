const assert=require('node:assert/strict'),fs=require('node:fs'),M=require('../assets/week6-math.js');
const read=p=>fs.readFileSync(p,'utf8'),base='materials/2026-yoh/week06/';
const deck=read(base+'w6.md'),plain=deck.replace(/<rt>.*?<\/rt>/g,'').replace(/<[^>]*>/g,'');
const slides=deck.split(/\n---\n/).filter(s=>/^## /m.test(s));
const map=JSON.parse(read(base+'source-map.json')),notes=JSON.parse(read(base+'w6.notes.json')).slides,audit=JSON.parse(read(base+'audit.json'));
assert.equal(slides.length,88);assert.equal(map.slides.length,slides.length);assert.equal(notes.length,slides.length);
assert.deepEqual([...new Set(map.slides.filter(s=>['clt','t','chi'].includes(s.part)).map(s=>s.part))],['clt','t','chi']);
const byId=id=>{const s=map.slides.find(s=>s.id===id);assert(s,id);return slides[s.page-1];};
for(const id of ['clt-title','t-title','chi-title','uv-title','t-table-title']){
 const s=byId(id);assert(s.includes('_class: topic'));assert(s.includes('class="en"'));assert(!s.includes('$$'));assert(!s.includes('class="big"'));
}
for(const id of ['gosset','curry-photo','pearson']){const s=byId(id);assert(s.includes('_class: photo-story'));assert(s.includes('class="photo-image"'));assert(s.includes('class="photo-caption"'));}
assert(byId('video').includes('https://www.youtube.com/watch?v=zeJD6dqJ5lo'));
assert(!/Moivre|1733|1秒|ロボット|Gamma/.test(plain));
for(const s of ['Curry','Karl Pearson','60:40','15人と5人','1413.20','353.3','27.4','2.7764','2.1318'])assert(plain.includes(s),s);
assert(byId('curry-mean-answer').includes(String.raw`\frac{143}{5}=28.6`));
for(const [key,entry] of Object.entries(map.formulaRegistry)){
 assert(entry.page);assert(entry.tex);assert(map.slides.some(s=>s.formula===key),key);
}
for(const s of map.slides){
 const slide=slides[s.page-1];
 if(s.formula){const entry=map.formulaRegistry[s.formula];assert(entry);assert(slide.includes(entry.tex)||(entry.highlightTex&&slide.includes(entry.highlightTex))||s.id==='one-sample');assert(s.textbook);}
 if(s.layout.startsWith('hero-math')){assert.equal((slide.match(/\$\$/g)||[]).length,2);assert(s.textbook);}
 if(s.layout==='worked'){for(const step of ['①','②','③','④'])assert(slide.includes(step));assert(slide.includes('images/'));}
}
assert(byId('t-formula').includes(String.raw`\widehat{\sigma_x^2}`));
assert(!byId('t-formula').includes(String.raw`s/\sqrt`));
assert(byId('uv-formula').includes(String.raw`\frac{1}{n-1}\sum(X_i-\bar X)^2`));
assert(byId('chi-decomposition').includes(String.raw`n(\bar X-\mu_x)^2`));
for(const id of ['clt-challenge','clt-answer']){assert(byId(id).includes('standard-normal-table.pdf'));assert(byId(id).includes('target="_blank"'));}
for(const id of ['table-comparison','t-central-example-3','table-challenge','table-answer']){assert(byId(id).includes('t-table.pdf'));assert(byId(id).includes('target="_blank"'));}
const guards=require('../assets/slide-challenge-guard.js');let count=0;
for(const [i,s] of map.slides.entries()){
 assert.equal(s.page,i+1);assert.equal(notes[i].page,i+1);assert(notes[i].ja.length>30&&notes[i].en.length>50,s.id);assert(!/津村|Tsumura|Yoh.?2025/.test(notes[i].ja+notes[i].en));
 if(s.layout==='challenge'){count++;const text=slides[i].replace(/<rt>.*?<\/rt>/g,'').replace(/<[^>]*>/g,'');assert(text.includes(`チャレンジ${count}`));assert(guards.isChallengeText(text.slice(text.indexOf('チャレンジ'))));assert.equal(map.slides[i+1].layout,'worked');}
}
assert.equal(count,5);assert.equal(audit.sections.length,3);
for(const c of audit.coverage)for(const id of c.ids)byId(id);
assert(audit.coverage.some(c=>c.official==='20–21'));assert(audit.coverage.some(c=>c.official==='23'));
for(const mode of ['sampling','board','z','variance','t','table','chi'])assert(deck.includes(`activity=w6-${mode}`));
assert(byId('al').includes('各セルの解答は示しません'));
const curry=M.summary([9,49,46,11,28]);assert.equal(curry.mean,28.6);assert(Math.abs(curry.ss-1413.2)<1e-9);assert(Math.abs(curry.s2-353.3)<1e-9);assert(Math.abs(M.tStatistic([9,49,46,11,28],27.4)-.142756)<1e-5);
const heights=[160,165,170],mu=M.mean(heights);assert.equal(mu,165);assert.equal(heights.reduce((s,x)=>s+(x-160)**2,0)/25,5);assert.equal(heights.reduce((s,x)=>s+(x-mu)**2,0)/25,2);assert.equal(3*(mu-160)**2/25,3);
assert.equal(M.table[20][2],2.086);assert.equal(M.table[10][1],1.8125);
function integral(fn,a,b){const n=20000,h=(b-a)/n;let s=0;for(let i=0;i<n;i++)s+=fn(a+(i+.5)*h)*h;return s;}
assert(Math.abs(integral(x=>M.tPdf(x,20),2.086,40)-.025)<2e-5);assert(Math.abs(integral(x=>M.tPdf(x,10),-1.8125,1.8125)-.9)<2e-5);
const lab=read('assets/week6-story-lab.js')+read('assets/week6-lecture-lab.js');assert(!/localStorage|sessionStorage|fetch\(|XMLHttpRequest/.test(lab));assert(lab.includes('9, 49, 46, 11, 28'));assert(lab.includes('160, 165, 170'));assert(lab.includes('推定分散が0なのでtを計算できません'));assert(lab.includes('draw20'));assert(lab.includes('交点は確率ではなく'));
assert(fs.existsSync(base+'t-table.pdf'));assert(fs.existsSync(base+'standard-normal-table.pdf'));
console.log('Week6 rebuilt: 88 slides, three ordered chapters, textbook formula registry, restored original stories, five guarded challenges, visual answers and aligned explorations.');

const tSlides=map.slides.filter(s=>s.part==='t').map(s=>slides[s.page-1]).join('\n').replace(/<rt>.*?<\/rt>/g,'').replace(/<[^>]*>/g,'');
assert(!/8人の身長|ラーメン|電池|10、14、18|自由度20のt|自由度10のt/.test(tSlides));
for(const text of ['9、49、46、11、28','28.6','1413.20','353.3','2.7764','2.1318'])assert(tSlides.includes(text));
assert(byId('t-guided-example-3').includes('0.143'));
assert(byId('t-answer').includes('1.3'));
assert.equal(M.table[4][2],2.7764);assert.equal(M.table[4][1],2.1318);
assert(Math.abs(M.tStatistic([9,49,46,11,28],30)+.1665486893)<1e-8);

for(const id of ['df-title','df-choice-step-1','df-choice-step-2','df-curry'])assert(!map.slides.some(s=>s.id===id));
assert(byId('df-example').includes('5-1=4'));

for(const id of ['clt-challenge','variance-challenge','t-challenge','table-challenge','chi-challenge']){
 const slide=byId(id);assert(slide.includes('challenge-formulas'));assert(slide.includes('Formula reference'));
 const reference=slide.slice(slide.indexOf('<div class="challenge-formulas">'));
 assert(!/353\.3|28\.6|65|165|170|0\.90|2\.1318/.test(reference),id);
}

const practice=M.summary([24,28,30,32,36]);
assert.equal(practice.mean,30);assert.equal(practice.ss,80);assert.equal(practice.s2,20);assert.equal(practice.se,2);
assert(Math.abs(M.tStatistic([24,28,30,32,36],27.4)-1.3)<1e-12);
const fullT=map.slides.find(s=>s.id==='t-guided-example-3');
assert.equal(fullT.page,map.slides.find(s=>s.id==='curry-variance-answer').page+1);
assert.equal(map.slides.find(s=>s.id==='t-challenge').page,fullT.page+1);

assert(integral(x=>M.tPdf(x,4),-1.96,1.96)<.89);
assert(Math.abs(integral(x=>M.tPdf(x,4),-2.7764,2.7764)-.95)<1e-5);
assert(M.table[4][2]>M.table[20][2]&&M.table[20][2]>1.96);
assert(byId('t-normal-95-boundaries').includes('1.96'));
