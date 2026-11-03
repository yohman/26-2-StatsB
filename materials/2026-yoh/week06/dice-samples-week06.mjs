import {writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

// Six illustrative samples, not a fitted distribution or observed class data.
const short=[[1,2,2,3],[1,3,3,4],[1,2,5,6],[3,4,4,6],[4,5,5,6],[2,3,4,5]];
let seed=6025;
const roll=()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return 1+Math.floor(seed/4294967296*6);};
const long=short.map(a=>[...a,...Array.from({length:21},roll)]);
const colors=['#b75c29','#1b7588','#84549b','#436e37','#b34465','#5a61a5'];
const pips={1:[[1,1]],2:[[0,0],[2,2]],3:[[0,0],[1,1],[2,2]],4:[[0,0],[2,0],[0,2],[2,2]],5:[[0,0],[2,0],[1,1],[0,2],[2,2]],6:[[0,0],[2,0],[0,1],[2,1],[0,2],[2,2]]};
const avg=a=>a.reduce((s,x)=>s+x,0)/a.length;
const bin=x=>Math.min(25,Math.floor((x-1)/.2+1e-9));
function die(value,x,y){return `<g data-die="${value}" transform="translate(${x},${y})"><rect width="25" height="25" rx="4" fill="#fff" stroke="#666" stroke-width="1.1"/>${pips[value].map(([a,b])=>`<circle cx="${5.5+7*a}" cy="${5.5+7*b}" r="2.1" fill="#222"/>`).join('')}</g>`;}

export function diceZSetup(here){
 const sample=long[2],sum=sample.reduce((s,x)=>s+x,0),mean=avg(sample);
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 420" role="img" aria-label="前に使った25回の標本C。合計106、平均4.24。公平なサイコロの母平均3.5、母分散約2.9167。"><g font-family="Arial,Hiragino Sans,sans-serif" fill="#222"><rect x="25" y="10" width="330" height="390" rx="5" fill="#fafafa" stroke="#84549b" stroke-width="3"/><text x="45" y="50" fill="#84549b" font-size="29" font-weight="bold">C</text><text x="332" y="50" text-anchor="end" fill="#84549b" font-size="29" font-weight="bold">平均 ${mean.toFixed(2)}</text><g transform="translate(55,85) scale(1.5)">${sample.map((v,i)=>die(v,(i%5)*37,Math.floor(i/5)*37)).join('')}</g><text x="430" y="65" font-size="24" fill="#84549b">先ほどの25回の出目 / Sample C</text><text x="430" y="130" font-size="38">合計 ${sum} ÷ 25回 ＝ ${mean.toFixed(2)}</text><text x="430" y="205" font-size="25">公平なサイコロの既知の値</text><text x="430" y="245" font-size="29">母平均 μₓ ＝ 3.5</text><text x="430" y="290" font-size="29">母分散 σₓ² ≈ 2.9167</text><text x="430" y="350" font-size="21" fill="#555">この母平均・母分散は、出目1〜6のモデルの値。</text><text x="430" y="382" font-size="21" fill="#555">今回の25個から推定した値ではない。</text></g></svg>`;
 writeFileSync(resolve(here,'images/dice-z-sample-c.svg'),svg);
 return '![width:1060px](images/dice-z-sample-c.svg)';
}

export function diceSamples(here,n,stage){
 const samples=n===4?short:long,means=samples.map(avg);
 const cards=samples.map((sample,k)=>{
  const x=15+(k%3)*210,y=35+Math.floor(k/3)*225,c=colors[k];
  const positions=sample.map((v,i)=>n===4?[x+64+(i%2)*30,y+88+Math.floor(i/2)*30]:[x+25+(i%5)*30,y+58+Math.floor(i/5)*30]);
  return `<g data-sample="${String.fromCharCode(65+k)}" data-size="${n}" data-mean="${means[k]}"><rect x="${x}" y="${y}" width="195" height="210" rx="5" fill="#fafafa" stroke="${c}" stroke-width="2"/><text x="${x+13}" y="${y+30}" fill="${c}" font-size="23" font-weight="bold">${String.fromCharCode(65+k)}</text><text x="${x+185}" y="${y+30}" text-anchor="end" fill="${c}" font-size="24" font-weight="bold">平均 ${means[k].toFixed(2)}</text>${sample.map((v,i)=>die(v,...positions[i])).join('')}</g>`;
 }).join('');
 const left=735,base=408,plotW=445,bw=plotW/26,Y=v=>base-v*43;
 const count=stage===0?0:stage===1?1:6,stacks=Array(26).fill(0);
 const blocks=means.slice(0,count).map((v,k)=>{const i=bin(v),h=++stacks[i];return `<rect data-plotted-sample="${String.fromCharCode(65+k)}" x="${left+i*bw+1}" y="${Y(h)}" width="${bw-2}" height="42" fill="${colors[k]}" stroke="white"/><text x="${left+(i+.5)*bw}" y="${Y(h)+28}" fill="white" font-size="14" text-anchor="middle">${String.fromCharCode(65+k)}</text>`;}).join('');
 const action=stage===0?'6組から、6個の平均を作った':stage===1?`Aの平均 ${means[0].toFixed(2)} を、1票入れる`:'A〜Fの平均を、それぞれ1票ずつ';
 const subtitle=stage===0?'まだ、グラフには入れない':stage===1?`出目${n}個 → 平均1個 → 棒の高さ＋1`:'出目の数ではなく、平均の数を数える';
 const pointer=stage===1?`<path d="M${left+(bin(means[0])+.5)*bw} 312V${Y(1)-8}" stroke="${colors[0]}" stroke-width="2"/><path d="M${left+(bin(means[0])+.5)*bw-5} ${Y(1)-14}l5 6 5-6" fill="none" stroke="${colors[0]}" stroke-width="2"/>`:'';
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1220 520" role="img" aria-label="1組${n}回の出目を6組。各箱の平均を表示。${count}個の平均をヒストグラムに追加。"><g font-family="Arial,Hiragino Sans,sans-serif" fill="#222"><text x="15" y="21" font-size="19">1箱＝1標本 / One box = one sample</text>${cards}<text x="690" y="63" font-size="23" font-weight="bold">${action}</text><text x="690" y="95" font-size="20" fill="#555">${subtitle}</text><text x="690" y="143" font-size="18">組の数 / Number of samples</text>${[0,1,2,3,4,5,6].map(v=>`<path d="M${left} ${Y(v)}H${left+plotW}" stroke="#ddd"/><text x="${left-12}" y="${Y(v)+6}" font-size="18" text-anchor="end">${v}</text>`).join('')}${blocks}${pointer}${[1,2,3,4,5,6].map(v=>`<text x="${left+(v-1)/.2*bw}" y="439" text-anchor="middle" font-size="20">${v}</text>`).join('')}<text x="${left+plotW}" y="474" text-anchor="end" font-size="20">標本平均 / Sample mean</text><text x="${left+plotW}" y="504" text-anchor="end" font-size="17" fill="#555">区間の幅0.2・この6枚は同じ目盛</text></g></svg>`;
 const name=`dice-samples-${n}-${stage}`;writeFileSync(resolve(here,`images/${name}.svg`),svg);
 return `![width:1160px](images/${name}.svg)`;
}

export function addDiceSequence({add,dice,small,here,cltOld}){
 const theory=n=>add(`dice-${n}`,`1標本が${n}回なら`,dice(`dice-mean-${n}`,n)+small('説明用の6組ではなく、全ての出方から求めた理論値。棒は幅0.2の区間の確率。'),{layout:'visual',book:'122',official:'6',source:cltOld,ja:`ここは六組の例を超えて、全ての出方から求めた理論の分布です。一組${n}回から平均を一つ作ります。先ほどは組の数、こちらは区間の確率です。四回と二十五回の理論図どうしは横軸も縦軸も共通です。`,en:`This is the exact theoretical distribution over all possible samples of ${n} rolls, not the six illustrative groups. Each group contributes one mean. The examples counted groups; these bars show bin probabilities. The two theoretical charts share axes.`});
 theory(1);
 for(let stage=0;stage<3;stage++)for(const n of [4,25]){
  const title=stage===0?`1組${n}回から、平均を1つ`:stage===1?`平均を1つ、グラフに入れる（${n}回）`:`6組の平均を、グラフに入れる（${n}回）`;
  add(`dice-samples-${n}-${stage}`,title,diceSamples(here,n,stage),{layout:'dice-samples',book:'122（標本平均の例）',official:'5–6',ja:`これは説明用に用意した六組の出目です。箱の位置と大きさ、サイコロ一個の大きさは四回でも二十五回でも同じ。上のラベルはその箱の出目の合計を${n}で割った平均です。${stage===0?'四個と二十五個を見比べ、どちらも一箱から一つの平均になることを確認します。':stage===1?'Aの箱を指して、出目をばらばらに数えるのではなく、平均を一票だけ入れます。棒の中のAが、その箱の平均です。':'六箱から六票です。同じ幅の区間に入った平均は積み上がります。少数の例なので、きれいなベル形になるとは限りません。'}`,en:`Six illustrative samples, not measured class data. Box positions, dimensions and individual die size remain identical for four and twenty-five rolls. Each label is that box’s sum divided by ${n}. ${stage===0?'Compare the number of observations per box. Either box produces just one mean.':stage===1?'Point to box A. Its mean contributes one count, not one count per die. The A inside the bar identifies the source sample.':'Six boxes contribute six counts. Means in the same width-0.2 bin stack. Six illustrative samples need not produce a smooth bell shape.'}`});
 }
 theory(4);theory(25);
}
