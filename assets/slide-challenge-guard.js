// Confirm deliberate forward navigation from a classroom challenge.
(() => {
  const isChallengeText = text => {
    // PDF text can use compatibility radicals (⾃ rather than 自) and circled digits.
    const compact=text.normalize('NFKC').replace(/\s/g,'');
    return /^チャレンジ[0-9]/.test(compact)&&compact.includes('自分で解く');
  };
  if(typeof document==='undefined'){module.exports={isChallengeText};return;}
  const pages=new WeakMap();
  let asking=false;
  async function isChallenge(pdf,pageNumber) {
    if(!pages.has(pdf))pages.set(pdf,new Map());
    const cache=pages.get(pdf);
    if(!cache.has(pageNumber))cache.set(pageNumber,(async()=>{
      try {
        const page=await pdf.getPage(pageNumber),content=await page.getTextContent();
        return isChallengeText(content.items.map(item=>item.str||'').join(''));
      } catch(error) {
        // If the check fails, ask rather than silently reveal a possible answer.
        console.warn('Slide challenge check unavailable:',error);
        return true;
      }
    })());
    return cache.get(pageNumber);
  }
  window.confirmSlideAdvance=async(pdf,from,to,host=document.body)=>{
    if(asking)return false;
    if(to<=from)return true;
    if(!await isChallenge(pdf,from))return true;
    if(asking)return false;
    asking=true;
    const en=document.documentElement.dataset.language==='en';
    const dialog=document.createElement('dialog');
    dialog.className='slide-answer-confirm';
    dialog.setAttribute('aria-labelledby','slide-answer-title');
    dialog.setAttribute('aria-describedby','slide-answer-description');
    dialog.innerHTML=`<h2 id="slide-answer-title">${en?'Ready to reveal the answer?':'答えを表示しますか？'}</h2><p id="slide-answer-description">${en?'The next slide shows the worked answer to this challenge. Stay on the problem if you need more time to solve it.':'次のスライドは、このチャレンジの答え合わせです。まだ考える時間が必要なら、問題に戻ってください。'}</p><div><button type="button" data-stay autofocus>${en?'Return to problem':'問題に戻る'}</button><button type="button" data-reveal>${en?'Show answer':'答えを見る'}</button></div>`;
    host.append(dialog);
    const previousFocus=document.activeElement;
    return new Promise(resolve=>{
      dialog.addEventListener('close',()=>{
        const approved=dialog.returnValue==='reveal';
        dialog.remove();asking=false;
        if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});
        resolve(approved);
      },{once:true});
      dialog.querySelector('[data-stay]').addEventListener('click',()=>dialog.close('stay'));
      dialog.querySelector('[data-reveal]').addEventListener('click',()=>dialog.close('reveal'));
      dialog.showModal();
      dialog.querySelector('[data-stay]').focus();
    });
  };
})();
