const assert=require('node:assert/strict'),fs=require('node:fs'),M=require('../assets/week6-math.js');
const read=p=>fs.readFileSync(p,'utf8'),base='materials/2026-yoh/week06/';
const deck=read(base+'w6.md'),plain=deck.replace(/<rt>.*?<\/rt>/g,'').replace(/<[^>]*>/g,'');
const slides=deck.split(/\n---\n/).filter(s=>/^## /m.test(s));
assert.equal(slides.length,63);
assert(slides[0].includes('_class: galton-video'));
assert(slides[0].includes('![bg cover](images/galton-opening.jpg)'));
assert(slides[0].includes('https://www.youtube.com/watch?v=UCmPmkHqHXk'));
assert(fs.existsSync(base+'images/galton-opening.jpg'));
const notes=JSON.parse(read(base+'w6.notes.json')).slides;
assert.equal(notes.length,slides.length);
for(const [i,note] of notes.entries()){assert.equal(note.page,i+1);assert(note.ja.length>30&&note.en.length>50);assert(!/津村|Tsumura|Yoh.?2025/.test(note.ja+note.en));}
const guards=require('../assets/slide-challenge-guard.js');
let count=0;
for(const [i,slide] of slides.entries()){
 const text=slide.replace(/<rt>.*?<\/rt>/g,'').replace(/<[^>]*>/g,'');
 if(/_class: challenge -->/.test(slide)){count++;assert(text.includes(`チャレンジ${count}`));assert(guards.isChallengeText(text.slice(text.indexOf('チャレンジ'))));assert(/_class: worked -->/.test(slides[i+1]));}
 if(/_class: worked -->/.test(slide)){for(const step of ['①','②','③','④'])assert(slide.includes(step));assert(slide.includes('images/'));}
}
assert.equal(count,6);
for(const s of ['中心極限定理','自由度','標本不偏分散','母集団','カイ二乗分布','Student','1733','2.0860','1.8125'])assert(plain.includes(s),s);
assert(plain.includes('厳密に正規分布'));assert(plain.includes('平方根s自体は一般に不偏ではない'));
assert(Math.abs(M.summary([8,10,12]).s2-4)<1e-12);
assert.equal(M.summary([8,10,12]).ss,8);assert.equal(M.summary([8,10,12]).df,2);
assert.equal(M.chiStatistic([-1,0,2]),5);
assert(Math.abs(M.tStatistic([.8,.9,1,1.1,1.2],1))<1e-12);
assert(Number.isNaN(M.tStatistic([1,1,1],1)));
assert.equal(M.table[20][2],2.086);assert.equal(M.table[10][1],1.8125);
assert(Math.abs((1.08-1)/(.2/Math.sqrt(25))-2)<1e-12);
for(const n of [4,12,20])assert(Math.abs(M.binomial(n).reduce((a,b)=>a+b,0)-1)<1e-12);
function integrate(f,a,b){const n=20000,h=(b-a)/n;let s=0;for(let i=0;i<n;i++)s+=f(a+(i+.5)*h)*h;return s;}
assert(Math.abs(integrate(x=>M.tPdf(x,20),2.086,40)-.025)<2e-5);
assert(Math.abs(integrate(x=>M.tPdf(x,10),-1.8125,1.8125)-.9)<2e-5);
assert(Math.abs(integrate(x=>M.chiPdf(x,3),0,80)-1)<1e-4);
const map=JSON.parse(read(base+'source-map.json'));assert.equal(map.slides.length,slides.length);
const topics=map.slides.filter(s=>s.layout==='topic');
assert.equal(topics.length,7);
for(const topic of topics){
 const slide=slides[topic.page-1],body=slide.slice(slide.indexOf('\n## '));
 assert(!body.includes('$$'),'Topic introductions contain no formula');
 assert(!body.includes('<aside'),'Topic introductions contain no reference clutter');
 assert(body.includes('class="en"'),'Topic titles have secondary English');
 assert(!body.includes('<p'),'Topic introductions contain only the title');
}
for(const term of ['t分布','標本不偏分散','中心極限定理','自由度','カイ二乗分布'])assert(topics.some(t=>t.title.includes(term)),term);
for(const entry of map.slides.filter(s=>s.layout==='hero-math')){
 const slide=slides[entry.page-1];
 assert.equal((slide.match(/\$\$/g)||[]).length,2,'Each formula slide has one display block');
 assert(!slide.includes('<p'),'Formula slides keep explanations on subsequent slides');
}
for(const page of [17,18].map(p=>map.slides.find(s=>s.title.startsWith(p===17?'チャレンジ2':'答え合わせ2'))?.page))assert(slides[page-1].includes('standard-normal-table.pdf'));
for(const s of map.slides)if(/\$/.test(slides[s.page-1]))assert(s.textbook,`Formula page ${s.page} has a textbook reference`);
for(const mode of ['board','sampling','t','chi'])assert(deck.includes(`activity=w6-${mode}`));
const lab=read('assets/week6-lab.js');
assert(!/localStorage|sessionStorage|fetch\(|XMLHttpRequest/.test(lab),'Student inputs remain local and unpersisted');
assert(lab.includes('s=0なのでtを計算できません'));
assert(fs.existsSync(base+'standard-normal-table.pdf'));
console.log('Week 6: 63 slides, seven uncluttered topic introductions, isolated formulas, six guarded challenges and aligned bilingual notes verified.');
