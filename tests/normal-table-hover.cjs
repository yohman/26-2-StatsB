const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const events={};
const rows=Array.from({length:32},(_,r)=>({cells:Array.from({length:11},(_,c)=>{
  const classes=new Set();
  return {tagName:r===0||c===0?'TH':'TD',cellIndex:c,
    classList:{add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x)}};
})}));
rows.forEach(row=>row.cells.forEach(cell=>cell.parentElement=row));
const table={rows,contains:cell=>rows.some(row=>row.cells.includes(cell)),addEventListener:(type,fn)=>events[type]=fn};
vm.runInNewContext(fs.readFileSync('materials/2026-yoh/week05/normal-table-hover.js','utf8'),{
  document:{querySelector:()=>table},
});
function hover(cell){events.pointerover({target:{closest:()=>cell}});}
const first=rows[20].cells[7];hover(first);
assert(first.classList.contains('lookup-current'));
assert(rows[0].cells[7].classList.contains('lookup-guide'));
assert(rows[20].cells[0].classList.contains('lookup-guide'));
assert(!rows[19].cells[6].classList.contains('lookup-guide'));
hover(rows[5].cells[2]);
assert(!first.classList.contains('lookup-current'));
assert(!rows[0].cells[7].classList.contains('lookup-guide'));
assert(rows[0].cells[2].classList.contains('lookup-guide'));
events.pointerleave();
for(const row of rows)for(const cell of row.cells){
  assert(!cell.classList.contains('lookup-guide'));
  assert(!cell.classList.contains('lookup-current'));
}
hover(rows[1].cells[1]);events.pointercancel();
assert(!rows[1].cells[1].classList.contains('lookup-current'));
const html=fs.readFileSync('materials/2026-yoh/week05/normal-upper-tail-table.html','utf8');
assert(html.includes('normal-table-hover.css'));
assert(html.includes('normal-table-hover.js'));
console.log('Normal-table hover: crosshair headers, cell changes, leave/cancel cleanup, and page assets verified.');
