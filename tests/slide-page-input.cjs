const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
class Element {
 constructor(){this.listeners={};this.attributes={};}
 setAttribute(name,value){this.attributes[name]=value;}
 replaceChildren(...children){this.children=children;}
 addEventListener(name,handler){this.listeners[name]=handler;}
 select(){}
}
const context={window:{},document:{createElement:()=>new Element(),addEventListener(){},querySelectorAll:()=>[]}};
vm.runInNewContext(fs.readFileSync('assets/slide-browsing.js','utf8'),context);
(async()=>{
 const status=new Element(),state={page:1,total:50,busy:false},jumps=[];
 let allow=true;
 const sync=context.window.bindSlidePageInput(status,()=>state,async target=>{jumps.push(target);if(allow)state.page=target;});
 const [input,count]=status.children;
 assert.equal(input.value,'1');assert.equal(count.textContent,' / 50');
 input.value='24';await input.listeners.change();assert.equal(state.page,24);
 input.value='999';await input.listeners.change();assert.equal(state.page,50);
 input.value='0';await input.listeners.change();assert.equal(state.page,1);
 for(const value of ['abc','3.5','-2','']){input.value=value;await input.listeners.change();assert.equal(state.page,1);assert.equal(input.value,'1');}
 allow=false;input.value='4';await input.listeners.change();assert.equal(input.value,'1','Cancelled answer confirmation restores current page');
 input.value='42';input.listeners.keydown({key:'Escape',preventDefault(){},stopPropagation(){}});assert.equal(input.value,'1');
 state.busy=true;sync();assert.equal(input.disabled,true);
 state.busy=false;state.total=0;sync();assert.equal(count.textContent,' / …');
 assert(jumps.includes(24));
 for(const file of ['viewer.html','assets/slide-browsing.js'])assert(fs.readFileSync(file,'utf8').includes('bindSlidePageInput'));
 console.log('Manual slide entry: jumps, bounds, invalid input, cancellation and busy state verified.');
})().catch(error=>{console.error(error);process.exitCode=1;});
