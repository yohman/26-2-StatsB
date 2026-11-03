import {writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
function choices(here,stage){
 const values=stage===1?['?','?','?','?','?']:stage===2?['9','49','46','11','?']:['9','49','46','11','28'];
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 260" role="img" aria-label="Curryの5試合。平均28.6点、合計143点に固定すると、9、49、46、11の次は28に決まる。"><g font-family="Arial,Hiragino Sans,sans-serif" text-anchor="middle">${values.map((v,i)=>{const x=15+i*220,c=i===4?'#b96930':'#176d82';return `<rect x="${x}" y="20" width="190" height="155" rx="4" fill="${i===4?'#fff1e3':'#edf7fa'}" stroke="${c}" stroke-width="3"/><text x="${x+95}" y="126" font-size="73" fill="${c}">${v}</text><text x="${x+95}" y="212" font-size="22" fill="${c}">${i===4?(stage===3?'28に決まる':'最後に決まる'):'自由に選べる'}</text><text x="${x+95}" y="244" font-size="16" fill="${c}">${i===4?'Fixed by the total':'One free value'}</text>`;}).join('')}</g></svg>`;
 const name=`df-choices-${stage}.svg`;writeFileSync(resolve(here,`images/${name}`),svg);return `![width:1100px](images/${name})`;
}
export function teachDegreesFreedom({add,big,small,math,here}){
 const titles=['Curryの5試合：平均28.6点に固定すると？','最初の4試合が決まると、残りは？','5試合でも、自由度は4'];
 const explanations=[math(String.raw`\text{合計は}\quad28.6\times5=143`),math(String.raw`9+49+46+11=115\qquad\text{残りは？}`),math(String.raw`143-115=28`)];
 const notes=[
  ['同じCurryの五試合を使います。標本平均は28.6点なので、合計は143点です。この平均を固定したまま値を動かすと考えます。これは自由度を理解する思考実験であり、実際の得点記録を書き換えるという意味ではありません。','Keep Curry’s five saved games. Their mean is 28.6 and total 143. Imagine varying the entries while holding that sample mean fixed. This conditional thought experiment explains degrees of freedom; it does not suggest changing observed game records.'],
  ['最初の四つは九、四十九、四十六、十一で合計115。合計143という条件を保つなら最後は何点でしょう。観測値が五個あっても、合計を一つ固定すると、五個すべてを独立に変えることはできません。','The first four scores, nine, forty-nine, forty-six and eleven, total 115. Ask what the final score must be if the total remains 143. Five observed entries are not five independent choices once their total is fixed.'],
  ['最後は143引く115で28点です。平均を一つ推定して固定したので、自由に動けるのは五引く一で四。次は同じことを平均との差で見ます。この自由度四を、不偏分散の分母とt分布表でも使い続けます。','The final score is forced to be 143 minus 115, or twenty-eight. Estimating and fixing one mean leaves five minus one, or four, independent residual components. Carry these four degrees of freedom into unbiased variance and the t table.']
 ];
 for(let stage=1;stage<=3;stage++)add(stage===3?'df-example':`df-choice-step-${stage}`,titles[stage-1],choices(here,stage)+explanations[stage-1]+(stage===3?big('5個の値 − 条件1つ ＝ 自由度4'):small('同じ5試合。条件：平均28.6点、合計143点。')),{layout:'df-choice',book:'125–126（自由度の考え方を5試合に適用）',official:'10',ja:notes[stage-1][0],en:notes[stage-1][1]});
 add('df-curry','Curryの5個のずれは、自由度4',small('得点9、49、46、11、28。標本平均は28.6点。')+big('平均との差の合計は、必ず0。')+math(String.raw`\underbrace{-19.6+20.4+17.4-17.6}_{\text{最初の4個の合計 }0.6}+\underbrace{(-0.6)}_{\text{最後は固定}}=0`)+big('5個のずれ − 条件1つ ＝ 自由度4'),{layout:'df-curry',book:'125–126（自由度・標本不偏分散）',official:'10–11',ja:'五試合から28.6を引くと、ずれはマイナス19.6、20.4、17.4、マイナス17.6、マイナス0.6です。最初の四つが0.6なら、最後はマイナス0.6に決まります。標本平均からのずれは合計ゼロという条件が一つあるので、五個のうち独立なのは四個です。',en:'Subtract 28.6 from the five saved scores. The residuals are minus 19.6, 20.4, 17.4, minus 17.6 and minus 0.6. The first four sum to 0.6, forcing the last to minus 0.6. Their zero-sum constraint leaves four independent residual components.'});
}
