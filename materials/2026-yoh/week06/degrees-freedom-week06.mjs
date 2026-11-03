import {writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

function choices(here,stage){
 const values=stage===1?['?','?','?','?']:stage===2?['2','?','5','1']:['2','4','5','1'];
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 260" role="img" aria-label="四つの値の平均を3に固定。2、5、1を選ぶと残りは4に決まる。"><g font-family="Arial,Hiragino Sans,sans-serif" text-anchor="middle">${values.map((v,i)=>{const x=45+i*265,c=i===1?'#b96930':'#176d82';return `<rect x="${x}" y="20" width="215" height="155" rx="4" fill="${i===1?'#fff1e3':'#edf7fa'}" stroke="${c}" stroke-width="3"/><text x="${x+107.5}" y="126" font-size="83" fill="${c}">${v}</text><text x="${x+107.5}" y="218" font-size="23" fill="${c}">${i===1?(stage===3?'選べない → 4に決まる':'最後に決まる'):'自由に選ぶ'}</text><text x="${x+107.5}" y="247" font-size="17" fill="${c}">${i===1?'Forced by the total':'Free choice'}</text>`;}).join('')}</g></svg>`;
 const name=`df-choices-${stage}.svg`;writeFileSync(resolve(here,`images/${name}`),svg);return `![width:1100px](images/${name})`;
}

export function teachDegreesFreedom({add,big,small,math,here}){
 const titles=['4個の数の平均を、3にする','3個は、自分で選べる','残り1個は、もう自由に選べない'];
 const explanations=[math(String.raw`\text{合計は}\quad3\times4=12`),math(String.raw`2+5+1=8\qquad\text{残りは？}`),math(String.raw`x=12-(2+5+1)=4`)];
 const notes=[
  ['四つの数の平均を三にするという条件を一つ置きます。平均が三なら合計は十二。四つを全部好きな数にすると、この条件を満たせないことがあります。ここでの選ぶという言い方は制約を理解するためで、実際の測定値を都合よく選ぶという意味ではありません。','Fix one condition: four values must have mean three, so their sum must be twelve. Choosing all four arbitrarily may violate that condition. Choosing values is a teaching device for understanding a constraint, not permission to select measured data to obtain a desired result.'],
  ['まず三つを二、五、一にしてみます。この三つは自分で選びました。合計は八です。平均を三、合計を十二に保つという条件は変えません。残りの一つには何を入れられるか、学生に聞いてください。','Choose three values: two, five and one. Their sum is eight. Keep the required mean at three and total at twelve. Ask what can go in the remaining box. These are the textbook numbers, with the unknown retained in its original second position.'],
  ['残りは十二引く八で四しか入りません。最後に入れる場所が二番目でも同じです。四つの数に合計という独立な条件が一つあるので、自由に選べたのは三つ。これがこの例の自由度三です。数が四つあることと自由に決められる数が四つあることは違います。','The remaining value must be twelve minus eight, or four. Its position in the row is irrelevant. Four values with one independent sum constraint leave three freely chosen values: three degrees of freedom. The number of entries and the number of independent choices are different.']
 ];
 for(let stage=1;stage<=3;stage++)add(stage===3?'df-example':`df-choice-step-${stage}`,titles[stage-1],choices(here,stage)+explanations[stage-1]+(stage===3?big('4個の値 − 条件1つ ＝ 自由度3'):small('条件：平均3、つまり合計12。')),{layout:'df-choice',book:'125–126（2、x、5、1の例）',official:'10',ja:notes[stage-1][0],en:notes[stage-1][1]});
 add('df-curry','3試合のずれは、自由度2',small('授業用の得点：10、14、18。標本平均は14点。')+big('平均との差を、3個つくる。')+math(String.raw`\underbrace{-4+0}_{\text{2個のずれの合計 }-4}+\underbrace{4}_{\text{最後はこれに決まる}}=0`)+big('3個のずれ − 条件1つ ＝ 自由度2')+small('標本平均を使うと、平均との差の合計は必ず0。<br>3個のずれは、全部が独立に動けるわけではない。'),{layout:'df-curry',book:'125–126（自由度・標本不偏分散）',official:'10–11',ja:'架空の三試合を使います。十、十四、十八の標本平均は十四。ずれはマイナス四、ゼロ、四で、合計は必ずゼロです。最初の二つのずれが決まれば、最後は四に決まります。三つのずれに条件一つで自由度二。この三試合を後の不偏分散の例題でも使います。',en:'Use three fictional scores, ten, fourteen and eighteen, with sample mean fourteen. Deviations are minus four, zero and four, and necessarily sum to zero. Once two residuals are specified, the last is forced. Three residuals and one constraint give two degrees of freedom. Reuse these scores in the guided variance example.'});
}
