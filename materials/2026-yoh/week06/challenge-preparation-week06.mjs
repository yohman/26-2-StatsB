// Guided examples use different numbers from the following independent tasks.
function reveal(a,{id,title,given,key='',symbolic,sub,result,graphic,book,link='',notes}){
 const {add,small,math,F}=a;
 for(let stage=1;stage<=3;stage++){
  const hide=n=>stage<n?' stage-hidden':'';
  add(`${id}-${stage}`,title,`<div class="work-copy">\n\n${small('① 与えられた条件')}\n\n${given}\n\n<div class="reveal-step${hide(2)}">\n\n${small('② 公式・考え方（値を入れる前）')}\n\n${math(symbolic||F[key].tex)}\n\n</div><div class="reveal-step${hide(3)}">\n\n${small('③ 数値を代入・計算')}\n\n${math(sub)}\n\n</div></div><div class="work-chart${hide(3)}">\n\n${graphic}\n\n</div><p class="conclusion${hide(3)}">④ ${result}</p>${link}`,{layout:stage===3?'worked':'worked example-build',book,formula:stage>=2?key:'',ja:notes[stage-1][0],en:notes[stage-1][1]});
 }
}

export function normalLookupExample(a){
 const {add,small,math,fig,M,normalLink}=a;
 add('dice-z-table-example','例題の続き：Zから、右側の確率へ',`<div class="work-copy">\n\n${small('① 与えられた条件')}\n\n先ほどのサイコロの平均：z ≈ 2.17。<br>正規近似を使い、Zを2.17に丸める。\n\n${small('② 求めるもの')}\n\n${math(String.raw`\Pr(Z>z)`)}\n\n${small('③ 上側表：2.1の行 × 0.07の列')}\n\n| z | 0.06 | **0.07** | 0.08 |\n|---|---|---|---|\n| **2.1** | 0.01539 | **0.01500** | 0.01463 |\n\n</div><div class="work-chart">\n\n${fig('dice-z-upper-tail',{min:-3.5,max:3.5,pdf:x=>M.normal(x),lo:2.17,hi:3.5,labels:[{x:2.17,text:'z=2.17'}],title:'標準正規の右側：約1.50%',xlabel:'z'})}\n\n</div><p class="conclusion">④ Pr(Z > 2.17) ≈ 0.01500 ＝ 約1.50%。</p>${normalLink()}`,{layout:'worked',book:'123・202（標準化・上側表）',ja:'Zを計算しただけでは確率にはなりません。2.17を2.1の行と0.07の列に分け、標準正規の上側表で0.01500を読みます。これは約1.50パーセント。サイコロ二十五回の平均については正規近似で、Z自体も2.17へ丸めています。離散の正確な確率ではありません。この計算と表読みの両方を、次の得点の課題で使います。',en:'A calculated Z is not itself a probability. Split 2.17 into row 2.1 and column 0.07 of the upper-tail normal table. Read 0.01500, about 1.50 percent. For the twenty-five-roll mean this uses a normal approximation and rounds Z to 2.17; it is not an exact discrete probability. The following score challenge requires both standardisation and table reading.'});
}

export function tStatisticExample(a){
 reveal(a,{id:'t-guided-example',title:'例題：3試合の平均を、tにする',given:'授業用の3試合：10、14、18点。<br>n=3、平均14、標本不偏分散16。比較基準μₓ=10。',key:'t',sub:String.raw`t=\frac{14-10}{\sqrt{16/3}}\approx\frac{4}{2.309}\approx1.73`,result:'t ≈ 1.73、自由度3−1＝2。',graphic:a.tcurve('t-guided-example',2,{labels:[{x:Math.sqrt(3),text:'t≈1.73 ／ ν=2'}]}),book:'125–126（t・自由度）',notes:[
  ['前の例題の三試合をそのまま使います。平均十四、不偏分散十六、標本数三。今回は比較基準を十点と置きます。母分散は未知で、標本から推定した十六を使うのがZとの違いです。実際の試合記録ではなく授業用モデルとして計算します。','Reuse the previous fictional three-game example: sample mean fourteen, unbiased variance sixteen and sample size three. Set the comparison benchmark at ten points. Population variance is unknown, so use the estimated sixteen, unlike the known-variance Z example. This remains a teaching model rather than real NBA inference.'],
  ['まず文字のtの式を見ます。分子は平均十四と比較基準十との差です。分母は推定分散十六を標本数三で割ってから平方根。ここで一度止めて、学生に代入する場所を指してもらいましょう。','Read the symbolic t expression before substitution. The numerator compares the mean fourteen with the benchmark ten. The denominator is the square root of estimated variance sixteen divided by sample size three. Pause and ask students to identify the locations for each input.'],
  ['十六を三で割って平方根を取ると約2.309。差四を割ると約1.73です。自由度は三引く一で二。図の位置と自由度を確認します。検定の結論は出さず、次はCurryの五試合で同じ手順を自分で行ってもらいます。','The denominator is approximately 2.309 and the numerator is four, giving t approximately 1.73. Degrees of freedom are three minus one, or two. Check the coordinate on the plotted t distribution. Do not make a testing decision; students next apply the procedure to Curry’s five games.']
 ]});
}

export function tCentralExample(a){
 const table='| 自由度ν ＼ 上側α | 0.05 | **0.025** | 0.01 |\n|---|---|---|---|\n| **20** | 1.7247 | **2.0860** | 2.5280 |';
 reveal(a,{id:'t-central-example',title:'例題：中央95%を残す境界',given:'自由度20のt分布。<br>中央の面積を95%にしたい。',symbolic:String.raw`\text{中央以外の面積を、左右に半分ずつ}`,sub:String.raw`\alpha=\frac{1-0.95}{2}=0.025`,result:'20行 × 0.025列 → 2.0860。左右の境界は ±2.0860。',graphic:a.tcurve('t-central-example',20,{lo:-2.086,hi:2.086,labels:[{x:-2.086,text:'−2.0860'},{x:2.086,text:'+2.0860'}],title:'中央95% ／ 左右の裾は各2.5%'})+'\n\n'+table,book:'127・203（中央区間・t表の値を替えた例）',link:a.tLink(),notes:[
  ['今度は観測したtを計算する問題ではなく、面積に対応する境界を表から探します。自由度二十で中央九十五パーセント。この二つを整理し、中央九十五をそのままt表の上側の列で探さないようにしましょう。','This example finds table boundaries for a desired area rather than calculating an observed t. The inputs are twenty degrees of freedom and a central ninety-five percent. Establish the distinction before students search for a column in an upper-tail table.'],
  ['中央以外には五パーセントが残ります。tは左右対称なので、左と右に2.5パーセントずつ。表に入れる上側の確率は0.025です。まだ表の答えを出さず、なぜ二で割るのかを図の左右で確認します。','Five percent remains outside the central region. Symmetry splits it into two tails of 2.5 percent each. The required upper-tail input is therefore 0.025. Before revealing the table result, ask why the remaining area must be divided by two.'],
  ['上側0.025と自由度二十の交点は2.0860。これは確率でなく横軸の境界です。左右対称なので左はマイナス2.0860。中央は九十五パーセント、左右はそれぞれ2.5パーセントです。次の課題は自由度十で中央九十なので、同じ手順を別の数で使います。','Read 2.0860 at the intersection of df twenty and upper-tail 0.025. It is a coordinate, not a probability. Symmetry gives the negative left boundary. The central region is ninety-five percent and each tail is 2.5 percent. Students next repeat the method for df ten and central ninety percent.']
 ]});
}

export function chiSquareExample(a){
 reveal(a,{id:'chi-guided-example',title:'例題：2人の身長のずれを、ひとつに',given:'架空の身長：155、165cm。<br>母平均160cm（既知）。<br>母標準偏差5cm → 母分散25cm²。<br>n=2、独立な正規モデル。',key:'u',sub:String.raw`U_0=\frac{(155-160)^2+(165-160)^2}{25}=\frac{25+25}{25}=2`,result:'U₀=2、自由度2。母平均が既知なので、n−1にはしない。',graphic:a.fig('chi-guided-example',{min:0,max:12,pdf:x=>a.M.chiPdf(x,2),title:'自由度2のカイ二乗分布',xlabel:'U₀',labels:[{x:2,text:'U₀=2 ／ ν=2'}]}),book:'128（既知の母平均からの平方和）',notes:[
  ['別の架空の二人を使います。身長百五十五と百六十五、母平均百六十、母標準偏差五。母分散は二十五です。母平均はこの二人から推定したのでなく、モデルの既知の値として与えられています。まずここをtの例と区別しましょう。','Use two different fictional heights, 155 and 165, from an independent normal model with known mean 160 and SD five, hence variance twenty-five. The population mean is supplied, not estimated from these two observations. Establish this distinction from the previous t example.'],
  ['教科書の平方和の式を先に確認します。各身長から既知の母平均を引き、二乗して足してから、既知の母分散で割ります。標本平均を引く式と混ぜないよう、母平均の記号を指して確認します。','Read the textbook squared-sum formula first. Subtract the known population mean from each height, square and sum, then divide by known population variance. Point to the population-mean symbol to avoid substituting a sample mean.'],
  ['ずれはマイナス五と五。二乗は二十五と二十五で、合計五十。母分散二十五で割るとUは二です。独立な値は二個で、母平均を推定していないので自由度も二。次の課題は三人なので、人数と式の意味を確認して自分で計算します。','The deviations are minus five and five. Their squares total fifty; dividing by variance twenty-five gives U equal to two. There are two independent components and no estimated mean removes a degree of freedom, so df is two. The following challenge uses three people and different heights.']
 ]});
}
