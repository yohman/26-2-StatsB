(function(){
  'use strict';
  const decks=new Map([
    ['materials/2026-yoh/week05/w5.pdf','materials/2026-yoh/week05/w5.notes.json']
  ]);
  const requests=new Map();
  function loadNotes(path){
    if(!requests.has(path)){
      requests.set(path,fetch(path,{cache:'no-cache'}).then(response=>{
        if(!response.ok)throw new Error('Slide notes unavailable');
        return response.json();
      }).then(data=>{
        if(!Array.isArray(data.slides)||!data.slides.every((note,i)=>note.page===i+1&&typeof note.ja==='string'&&typeof note.en==='string'))throw new Error('Invalid slide notes');
        return data;
      }));
    }
    return requests.get(path);
  }
  // Called after the PDF finishes painting, so notes never run ahead of the slide.
  window.bindSlideNotes=function({file,after}){
    const path=decks.get(file);
    if(!path)return {show(){},ready:Promise.resolve()};
    const caption=document.createElement('section');
    caption.className='slide-notes';
    caption.hidden=true;
    caption.setAttribute('aria-label','Teaching notes / 話すメモ');
    caption.setAttribute('aria-live','polite');
    const heading=document.createElement('h2');
    const labelJa=document.createElement('span');
    labelJa.className='lang-ja';labelJa.lang='ja';labelJa.textContent='話すメモ';
    const labelEn=document.createElement('span');
    labelEn.className='lang-en';labelEn.lang='en';labelEn.textContent='Teaching notes';
    const counter=document.createElement('span');
    counter.className='slide-notes-page';
    heading.append(labelJa,labelEn,counter);
    const ja=document.createElement('p');ja.className='lang-ja';ja.lang='ja';
    const en=document.createElement('p');en.className='lang-en';en.lang='en';
    caption.append(heading,ja,en);
    after.after(caption);
    let currentPage=0,data;
    function show(page){
      currentPage=page;
      const note=data?.slides[page-1];
      caption.hidden=!note;
      if(!note)return;
      counter.textContent=`${page} / ${data.slides.length}`;
      ja.textContent=note.ja;
      en.textContent=note.en;
      caption.dataset.slide=String(page);
    }
    const ready=loadNotes(path).then(value=>{data=value;show(currentPage);}).catch(error=>{
      // Notes are optional: an unavailable caption must never replace a usable PDF.
      caption.hidden=true;
      console.warn('Teaching notes could not load:',error);
    });
    return {show,ready};
  };
})();
