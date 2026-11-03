import {heightPair} from './lecture-visuals-week06.mjs';
// Data stay visible while the symbolic and numerical steps build cumulatively.
function reveal(a,{id,title,given,key='',symbolic,sub,result,graphic,dataGraphic,book,link='',notes}){
 const {add,small,math,F}=a;
 for(let stage=1;stage<=3;stage++){
  const hide=n=>stage<n?' stage-hidden':'';
  add(`${id}-${stage}`,title,`<div class="work-copy">\n\n${small('① 与えられた条件')}\n\n${given}\n\n<div class="reveal-step${hide(2)}">\n\n${small('② 公式・考え方（値を入れる前）')}\n\n${math(symbolic||F[key].tex)}\n\n</div><div class="reveal-step${hide(3)}">\n\n${small('③ 数値を代入・計算')}\n\n${math(sub)}\n\n</div></div><div class="work-chart"><div class="example-visual"><div class="example-data${stage===3?' stage-hidden':''}">\n\n${dataGraphic}\n\n</div><div class="example-result${hide(3)}">\n\n${graphic}\n\n</div></div></div><p class="conclusion${hide(3)}">④ ${result}</p>${link}`,{layout:stage===3?'worked':'worked example-build',book,formula:stage>=2?key:'',ja:notes[stage-1][0],en:notes[stage-1][1]});
 }
}

export function normalLookupExample(a){
 const {add,small,math,fig,M,normalLink}=a;
 add('dice-z-table-example','例題の続き：Zから、右側の確率へ',`<div class="work-copy">\n\n${small('① 与えられた条件')}\n\n先ほどのサイコロの平均：z ≈ 2.17。<br>正規近似を使い、Zを2.17に丸める。\n\n${small('② 求めるもの')}\n\n${math(String.raw`\Pr(Z>z)`)}\n\n${small('③ 上側表：2.1の行 × 0.07の列')}\n\n| z | 0.06 | **0.07** | 0.08 |\n|---|---|---|---|\n| **2.1** | 0.01539 | **0.01500** | 0.01463 |\n\n</div><div class="work-chart">\n\n${fig('dice-z-upper-tail',{min:-3.5,max:3.5,ticks:[-3,-2,-1,0,1,2,3],pdf:x=>M.normal(x),lo:2.17,hi:3.5,labels:[{x:2.17,text:'z=2.17'}],title:'標準正規の右側：約1.50%',xlabel:'z'})}\n\n</div><p class="conclusion">④ Pr(Z > 2.17) ≈ 0.01500 ＝ 約1.50%。</p>${normalLink()}`,{layout:'worked',book:'123・202（標準化・上側表）',ja:'Zを計算しただけでは確率にはなりません。2.17を2.1の行と0.07の列に分け、標準正規の上側表で0.01500を読みます。これは約1.50パーセント。サイコロ二十五回の平均については正規近似で、Z自体も2.17へ丸めています。離散の正確な確率ではありません。この計算と表読みの両方を、次の得点の課題で使います。',en:'A calculated Z is not itself a probability. Split 2.17 into row 2.1 and column 0.07 of the upper-tail normal table. Read 0.01500, about 1.50 percent. For the twenty-five-roll mean this uses a normal approximation and rounds Z to 2.17; it is not an exact discrete probability. The following score challenge requires both standardisation and table reading.'});
}

export function tStatisticExample(a){
 reveal(a,{id:'t-guided-example',title:'同じCurryの5試合を、tにする',dataGraphic:a.curryChart,given:'9、49、46、11、28点。<br>n=5、平均28.6、標本不偏分散353.3。<br>比較基準μₓ=27.4。',key:'t',sub:String.raw`t=\frac{28.6-27.4}{\sqrt{353.3/5}}=\frac{1.2}{8.406}\approx0.143`,result:'t ≈ 0.143、自由度5−1＝4。',graphic:a.tcurve('t-guided-example',4,{labels:[{x:.143,text:'Curry：t≈0.143 ／ ν=4'}]}),book:'125–126（t・自由度）',notes:[
  ['ここまで計算したCurryの五試合をそのまま使います。平均28.6、不偏分散353.3、標本数五。比較基準は最初に置いた27.4です。ここで別の三試合には切り替えません。母分散が未知なので、同じ五試合から推定した分散を使います。','Carry forward the same Curry sample: five games, mean 28.6 and unbiased variance 353.3. Use the original benchmark 27.4. No new dataset is introduced. Population variance is unknown, so the denominator uses the estimate from these same observations.'],
  ['文字のtの式を先に読みます。分子は平均28.6と基準27.4との差。分母は推定分散353.3を標本数五で割ってから平方根です。分散を自由度四で求めた作業と、ここで標本数五で割る作業は別です。','Read the symbolic t formula. The numerator compares mean 28.6 with benchmark 27.4. Divide estimated variance 353.3 by sample size five and then take the square root. Distinguish this denominator step from dividing the squared-deviation sum by four to estimate variance.'],
  ['分母は約8.406点、差は1.2点なので、tは約0.143。自由度は五引く一で四です。次の問題も五試合と分散は同じままで、比較基準だけ30点へ変えます。どの値が変わり、どの値が変わらないかを考えてもらいましょう。','The denominator is approximately 8.406 points and the difference is 1.2 points, giving t approximately 0.143 with four degrees of freedom. The next challenge keeps the same observations and variance and changes only the benchmark to thirty. Ask students to identify what changes and what stays fixed.']
 ]});
}
export function tCentralExample(a){
 const table='| ν ＼ α | 0.05 | **0.025** | 0.01 |\n|---|---|---|---|\n| **4** | 2.1318 | **2.7764** | 3.7469 |';
 reveal(a,{id:'t-central-example',title:'Curryの自由度4で、中央95%を読む',dataGraphic:a.tcurve('t-central-given',4,{lo:-2.7764,hi:2.7764,title:'同じ5試合 → 自由度4。中央95%の境界は？'}),given:'同じCurryの5試合 → 自由度4。<br>このt分布の中央に95%を残したい。',symbolic:String.raw`\text{中央以外の面積を、左右に半分ずつ}`,sub:String.raw`\alpha=\frac{1-0.95}{2}=0.025`,result:'4行 × 0.025列 → 2.7764。左右の境界は ±2.7764。',graphic:a.tcurve('t-central-example',4,{lo:-2.7764,hi:2.7764,labels:[{x:-2.7764,text:'−2.7764'},{x:2.7764,text:'+2.7764'}],title:'Curryのν=4 ／ 中央95% ／ 左右は各2.5%'})+'\n\n'+table,book:'127・203（中央区間を自由度4に適用）',link:a.tLink(),notes:[
  ['Curryの五試合なので自由度四のままです。今度は観測したtを計算するのではなく、この同じ分布の中央九十五パーセントを囲む境界を探します。データを取り替えたり、人数を二十一人に増やしたわけではありません。','Keep four degrees of freedom from Curry’s five games. The task now changes from calculating the observed t to finding boundaries containing the central ninety-five percent of the same distribution. Neither the observations nor the sample size have changed.'],
  ['中央以外には五パーセントが残ります。左右対称なので片側は2.5パーセント、表の列は0.025です。自由度は四。表に入れる二つの条件だけ確認してから交点を読みます。','Five percent lies outside the central region. Symmetry gives 2.5 percent in each tail, so use column 0.025 and row four. Identify both table inputs before reading their intersection.'],
  ['自由度四の行と0.025の列で2.7764です。これは横軸の境界なので、左はマイナス2.7764。次の問題でも自由度四を保ち、中央の面積だけ九十パーセントに変えます。','Read 2.7764 at row four and column 0.025. This is a horizontal-axis boundary, so the left boundary is minus 2.7764. The following challenge keeps four degrees of freedom and changes only the central area to ninety percent.']
 ]});
}

export function chiSquareExample(a){
 reveal(a,{id:'chi-guided-example',title:'例題：2人の身長のずれを、ひとつに',dataGraphic:heightPair(a.here),given:'架空の身長：155、165cm。<br>母平均160cm（既知）。<br>母標準偏差5cm → 母分散25cm²。<br>n=2、独立な正規モデル。',key:'u',sub:String.raw`U_0=\frac{(155-160)^2+(165-160)^2}{25}=\frac{25+25}{25}=2`,result:'U₀=2、自由度2。母平均が既知なので、n−1にはしない。',graphic:a.fig('chi-guided-example',{min:0,max:12,pdf:x=>a.M.chiPdf(x,2),title:'自由度2のカイ二乗分布',xlabel:'U₀',labels:[{x:2,text:'U₀=2 ／ ν=2'}]}),book:'128（既知の母平均からの平方和）',notes:[
  ['別の架空の二人を使います。身長百五十五と百六十五、母平均百六十、母標準偏差五。母分散は二十五です。母平均はこの二人から推定したのでなく、モデルの既知の値として与えられています。まずここをtの例と区別しましょう。','Use two different fictional heights, 155 and 165, from an independent normal model with known mean 160 and SD five, hence variance twenty-five. The population mean is supplied, not estimated from these two observations. Establish this distinction from the previous t example.'],
  ['教科書の平方和の式を先に確認します。各身長から既知の母平均を引き、二乗して足してから、既知の母分散で割ります。標本平均を引く式と混ぜないよう、母平均の記号を指して確認します。','Read the textbook squared-sum formula first. Subtract the known population mean from each height, square and sum, then divide by known population variance. Point to the population-mean symbol to avoid substituting a sample mean.'],
  ['ずれはマイナス五と五。二乗は二十五と二十五で、合計五十。母分散二十五で割るとUは二です。独立な値は二個で、母平均を推定していないので自由度も二。次の課題は三人なので、人数と式の意味を確認して自分で計算します。','The deviations are minus five and five. Their squares total fifty; dividing by variance twenty-five gives U equal to two. There are two independent components and no estimated mean removes a degree of freedom, so df is two. The following challenge uses three people and different heights.']
 ]});
}
