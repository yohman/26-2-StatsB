// Lecture pacing is intentional: one reveal per slide; do not collapse these beats.
export function createWeek5Story({fig,normal,tryIt,tableLink}){
  const slides=[],mapping=[];
  let sources={yoh75:'2–12',yoh109:'2–13'};
  function add(title,body='',cls='beat',notes=''){
    slides.push(`<!-- _class: ${cls} -->\n\n## ${title}\n\n${body}\n\n<!-- ${notes}\nTeaching source: ${JSON.stringify(sources)} -->`);
    mapping.push({slide:slides.length,title,layout:cls,...sources});
  }
  const text=(line,notes='')=>add(line,'','statement',notes);
  const equation=(title,tex,{long=false,notes='',answer=false}={})=>{
    if(tex.includes('\\\\')||/\\begin\{(aligned|gathered)/.test(tex))throw Error(`Use a single-line formula: ${title}`);
    add(title,`$$\n${tex}\n$$`,`hero-math${long?' long':''}${answer?' answer':''}`,notes);
  };
  const visual=(title,graphic,notes='',caption='')=>add(title,`${graphic}${caption?`\n\n<div class="caption">${caption}</div>`:''}`,'single-visual',notes);
  const ref=(title,page)=>add('教科書 · 第2章 第2節',`<div class="chapter">${title}</div><div class="pages">${page}</div>`,'book-divider');
  const explore=(id,title,instruction)=>add(title,`${instruction}\n\n${tryIt(id)}`,'try');
  const challenge=(no,title,given,question,minutes=5)=>add(`チャレンジ${no}　${title}`,`<div class="pause">自分で解く　${minutes}分</div>\n\n${given}\n\n**${question}**`,'challenge');

  text('いつになったら、キスできる？');
  for(const [i,name] of ['kiss-start','kiss-half','kiss-quarter','kiss-close'].entries())
    add(`キスの距離 ${i+1}`,`![width:1120px](images/${name}.png)`,'kiss-frame',`残りの距離を半分ずつ縮める。ここでは図だけを見せ、次のクリックで距離を縮める。元のスライド${i+3}の1枚をそのまま1枚として使う。`);
  text('まだ、届かない？');
  equation('最初の半分',String.raw`\frac12`);
  equation('次の半分を足す',String.raw`\frac12+\frac14`);
  equation('さらに足す',String.raw`\frac12+\frac14+\frac18`);
  equation('無限に足す',String.raw`\frac12+\frac14+\frac18+\cdots=1`);
  text('無限に分けても、合計は有限になる。','ゼノンの二分法を、細かい区間を足す直感への導入にする。確率0の点を通常の足し算で合計する、という意味にはしない。');
  visual('身長、何cm？','![height:280px](images/robot.svg)');
  equation('160cm',String.raw`160`);
  equation('小数第1位まで？',String.raw`160.0`);
  equation('どこまで正確に？',String.raw`160.000\ldots`);
  equation('1点の確率',String.raw`\Pr(X=160)=0`);
  text('え？　160cmの人は、いないの？');
  text('連続モデルでは、1点の「幅」が0。','実現値が存在しないという意味ではない。幅0の領域の確率が0になる。');
  equation('丸めて160cm',String.raw`\Pr(159.5\le X<160.5)>0`,{notes:'この身長域に密度がある連続モデルを考える。四捨五入で160cmと記録される区間。'});
  text('「160cmと記録された」は、区間の話。');
  add('連続確率分布','Week 5','title');

  sources={official:'4–10',textbook:'121–122',yoh75:'13–30',yoh109:'9–30'};
  ref('5　連続確率分布','p.121–122');
  visual('確率密度 $f(x)$',normal('story-density',1,1), 'まず山の形だけを見せる。まだCDFや積分の計算を同時に説明しない。');
  visual('この付近への、集まりやすさ',normal('story-density-height',1,1,{point:{x:0,y:1/Math.sqrt(2*Math.PI)}}));
  visual('区間に入る確率は、この面積',normal('story-density-area',-1,1));
  equation('区間の確率',String.raw`\Pr(a\le X\le b)=\int_a^b f(x)\,dx`,{long:true});
  text('積分（せきぶん）＝ 面積を足し合わせる。');
  equation('積分の範囲',String.raw`\underbrace{\int_a^b}_{a\text{ から }b\text{ まで}}f(x)\,dx`);
  visual('大きな長方形で近似する',fig('story-slices-4',{max:20,pdf:x=>2*x/400,lo:0,hi:0,rectangles:4,title:'4個の長方形',xlabel:'x'}),'新しい数値問題ではない。幅を細かくして面積に近づける様子だけを見せる。');
  visual('もう少し、細かく',fig('story-slices-16',{max:20,pdf:x=>2*x/400,lo:0,hi:0,rectangles:16,title:'16個の長方形',xlabel:'x'}));
  visual('さらに、細かく',fig('story-slices-64',{max:20,pdf:x=>2*x/400,lo:0,hi:0,rectangles:64,title:'64個の長方形',xlabel:'x'}));
  equation('小さな面積',String.raw`\text{高さ}\times\text{幅}=f(x_i)\Delta x`);
  equation('面積を合計する',String.raw`\sum_i f(x_i)\Delta x\ \longrightarrow\ \int_a^b f(x)\,dx`,{long:true});
  equation('全部の確率',String.raw`\int_{-\infty}^{\infty}f(x)\,dx=1`);
  visual('全体の面積は、100％',normal('story-total-area',-4,4),'正規分布の尾は図の外にも続く。全体の積分は厳密に1。');

  text('ラーメン、あと何分？');
  text('待ち時間は、0〜20分で一様としよう。','実際の店の調査結果ではなく、授業用の一様分布モデル。');
  equation('一様分布の密度',String.raw`f(x)=\frac1{20}\qquad(0\le x\le20)`);
  visual('どの区間も、同じ高さ',fig('story-ramen-density',{max:20,pdf:()=>1/20,lo:0,hi:0,title:'一様分布の密度 f(x)',xlabel:'待ち時間（分）'}));
  challenge('①','ラーメンの待ち時間','待ち時間 $X$ は、0〜20分の一様分布。','5分以上10分以下、待つ確率は？');
  equation('答え合わせ① · 公式',String.raw`\Pr(a\le X\le b)=\int_a^b f(x)\,dx`,{long:true});
  equation('答え合わせ① · 数値を入れる',String.raw`\Pr(5\le X\le10)=\int_5^{10}\frac1{20}\,dx`,{long:true});
  equation('答え合わせ① · 横幅と高さ',String.raw`(10-5)\times\frac1{20}=0.25=25\%`,{answer:true});
  visual('答え合わせ① · この面積が25％',fig('story-ramen-answer',{max:20,pdf:()=>1/20,lo:5,hi:10,title:'5分から10分まで',xlabel:'待ち時間（分）',labels:[{x:5,text:'5分'},{x:10,text:'10分'}]}),'密度0.05だけを5％と読まない。5分の横幅を掛ける。');
  explore('area','区間を動かしてみよう','10分を15分に変えたら、面積はどうなる？');

  sources={official:'6–10',textbook:'121–122',yoh75:'14–17,25–30',yoh109:'14–17,25–30'};
  text('「ここまで」の確率を知りたい。');
  equation('累積分布関数',String.raw`F(c)=\Pr(X\le c)=\int_{-\infty}^{c}f(x)\,dx`,{long:true});
  visual('$f(x)$：cまでの面積',fig('story-cdf-density',{max:20,pdf:x=>2*x/400,lo:0,hi:10,title:'PDF · f(x)',xlabel:'分',labels:[{x:10,text:'c=10'}]}),'これ以降の右上がりの密度は別の店のモデル f(x)=2x/20²。先ほどの一様分布と混同しない。');
  visual('$F(c)$：その面積を、高さにする',fig('story-cdf-function',{max:20,pdf:x=>(x/20)**2,lo:10,hi:10,cdf:true,point:{x:10,y:.25},title:'CDF · F(x)',xlabel:'分',labels:[{x:10,text:'c=10'}]}));
  text('$F$ は、減らない。');
  equation('累積の始まりと終わり',String.raw`F(-\infty)=0,\qquad F(+\infty)=1`,{long:true});
  text('別のラーメン店では？','以降のF(20)=0.10とF(60)=0.90は、読み方のための別の仮定。前の三角形モデルの数値を引き継いでいない。');
  equation('20分までの累積確率',String.raw`F(20)=0.10`);
  text('20分以内に呼ばれる確率は、10％。');
  equation('60分までの累積確率',String.raw`F(60)=0.90`);
  text('60分以内に呼ばれる確率は、90％。');
  text('では、20分より長く60分以内なら？');
  equation('累積確率の引き算',String.raw`\Pr(a<X\le b)=F(b)-F(a)`,{long:true});
  equation('数値を入れる',String.raw`\Pr(20<X\le60)=0.90-0.10=80\%`,{long:true,answer:true});
  visual('この区間が、80％',fig('story-cdf-interval',{max:80,pdf:x=>x<20?.005:x<=60?.02:.005,lo:20,hi:60,title:'F(20)=0.10、F(60)=0.90 の密度の一例',xlabel:'待ち時間（分）',ticks:[0,20,40,60,80],labels:[{x:20,text:'20分'},{x:60,text:'60分'}]}));
  explore('cdf','$f$ と $F$ を切り替えてみよう','同じ数値が「面積」と「高さ」に現れる場所を探そう。');

  sources={official:'11–13',textbook:'129'};
  ref('6　確率分布の平均値と分散','p.129');
  equation('離散変数の期待値',String.raw`E(X)=\sum_x x\Pr(X=x)`);
  text('「値 × 確率」を、全部足す。');
  equation('連続変数の期待値',String.raw`E(X)=\int_{-\infty}^{\infty}xf(x)\,dx`);
  text('小さな区間では、確率は $f(x)dx$。');
  equation('値で重みを付ける',String.raw`x\times f(x)\,dx`);
  text('配達ロボットは、0〜12分で到着する。','授業用の一様分布モデルを仮定する。');
  equation('配達時間の密度',String.raw`f(x)=\frac1{12}\qquad(0\le x\le12)`);
  equation('期待値に、数値を入れる',String.raw`E(X)=\int_0^{12}x\frac1{12}\,dx`);
  equation('期待値を計算する',String.raw`E(X)=\left[\frac{x^2}{24}\right]_0^{12}=\frac{144}{24}`);
  equation('期待時間',String.raw`E(X)=6\text{ 分}`,{answer:true});
  visual('バランスの中心は、6分',fig('story-mean',{max:12,pdf:()=>1/12,lo:0,hi:0,mean:6,title:'一様分布の期待値 μ=6',xlabel:'配達時間（分）'}),'毎回6分で到着するという意味ではない。');
  text('では、どのくらい、ばらつく？');
  equation('分散',String.raw`\operatorname{Var}(X)=\int_{-\infty}^{\infty}(x-\mu)^2f(x)\,dx`,{long:true});
  text('中心からのずれを、二乗して足す。');
  equation('分散に、数値を入れる',String.raw`\operatorname{Var}(X)=\int_0^{12}(x-6)^2\frac1{12}\,dx`,{long:true});
  equation('分散を計算する',String.raw`\operatorname{Var}(X)=\left[\frac{(x-6)^3}{36}\right]_0^{12}`,{long:true});
  equation('上端から下端を引く',String.raw`\frac{216-(-216)}{36}=12`);
  equation('分散の単位',String.raw`\operatorname{Var}(X)=12\text{ 分}^2`,{answer:true});
  equation('標準偏差',String.raw`\sigma=\sqrt{\operatorname{Var}(X)}`);
  equation('元の単位に戻す',String.raw`\sigma=\sqrt{12}\approx3.46\text{ 分}`,{answer:true});
  visual('中心から、標準偏差1個分',fig('story-variance',{max:12,pdf:()=>1/12,lo:6-Math.sqrt(12),hi:6+Math.sqrt(12),mean:6,title:'μ=6分、σ≈3.46分',xlabel:'配達時間（分）',labels:[{x:6-Math.sqrt(12),text:'μ−σ'},{x:6+Math.sqrt(12),text:'μ＋σ'}]}),'塗った面積が分散12を表すわけではない。色はμ±σの範囲。');
  explore('moments','配達時間の幅を変えてみよう','0〜12分が、0〜20分になったら？');

  sources={official:'14–18',textbook:'122–123',yoh75:'34–43',yoh109:'34–44'};
  ref('5　① 正規分布','p.122–123');
  visual('正規分布',fig('story-normal',{min:10,max:90,pdf:x=>mathPdf(x,50,10),lo:0,hi:0,mean:50,title:'平均を中心に左右対称',xlabel:'点数'}));
  equation('正規分布の書き方',String.raw`X\sim N(\mu,\sigma^2)`);
  equation('中心',String.raw`E(X)=\mu`);
  equation('ばらつき',String.raw`\operatorname{Var}(X)=\sigma^2`);
  visual('標準偏差が小さいと、狭い山',fig('story-normal-narrow',{min:10,max:90,pdf:x=>mathPdf(x,50,5),lo:0,hi:0,mean:50,yMax:.11,title:'μ=50、σ=5',xlabel:'点数'}));
  visual('標準偏差が大きいと、広い山',fig('story-normal-wide',{min:10,max:90,pdf:x=>mathPdf(x,50,15),lo:0,hi:0,mean:50,yMax:.11,title:'μ=50、σ=15',xlabel:'点数'}),'直前の図と横軸・縦軸をそろえて比較する。どちらも図の外まで含む全体の面積は1。');
  equation('正規分布の密度',String.raw`f(x)=\frac1{\sigma\sqrt{2\pi}}\exp\!\left[-\frac{(x-\mu)^2}{2\sigma^2}\right]`,{long:true,notes:'このπは円周率。二項分布で成功率に使ったπとは異なる。'});
  text('この積分を、毎回手で計算する？');
  text('平均と標準偏差をそろえれば、1つの表が使える。');
  equation('標準化の公式',String.raw`Z=\frac{X-E(X)}{\sqrt{\operatorname{Var}(X)}}=\frac{X-\mu}{\sigma}`,{long:true});
  text('平均との差を、標準偏差で割る。');
  equation('標準化した正規分布',String.raw`Z\sim N(0,1)`);
  text('期末試験を、想像しよう。','以後の点数は正規分布モデルを仮定する。実際の試験成績の調査結果ではない。');
  equation('クラスの母平均',String.raw`\mu=50\text{ 点}`);
  equation('母標準偏差',String.raw`\sigma=10\text{ 点}`);
  equation('あなたの点数',String.raw`x=60\text{ 点}`);
  text('平均から、標準偏差何個分、上？');
  equation('まず、公式',String.raw`z=\frac{x-\mu}{\sigma}`);
  equation('数値を入れる',String.raw`z=\frac{60-50}{10}`);
  equation('計算する',String.raw`z=\frac{10}{10}=1`);
  visual('平均より、標準偏差1個分、上',fig('story-score-z1',{min:10,max:90,pdf:x=>mathPdf(x,50,10),lo:50,hi:60,mean:50,title:'平均50点、標準偏差10点',xlabel:'点数',labels:[{x:60,text:'60点：z=1'}]}));
  text('$z=1$ は、100％という意味ではない。');
  explore('normal','点数を変えてみよう','同じ60点でも、平均や標準偏差が違ったら？');

  sources={official:'19–26',textbook:'124–125',yoh75:'51–61',yoh109:'52–62'};
  ref('5　② 標準正規分布表の読み方','p.124–125');
  equation('表が示す確率',String.raw`Q(z)=\Pr(Z>z)`);
  visual('この表は、右側の面積',normal('story-table-tail',1.96,4,{labels:[{x:1.96,text:'z=1.96'}]}));
  add('標準正規分布表','右側の面積を示す表を使う。\n\n'+tableLink,'try');
  equation('1.96の場所を探す',String.raw`z=1.96`);
  function table(stage,title){
    const values=[['1.8','0.03288','0.03216','0.03144'],['1.9','0.02619','0.02559','0.02500'],['2.0','0.02068','0.02018','0.01970']];
    const html=`<table class="lookup-table"><thead><tr><th>z</th><th>0.04</th><th>0.05</th><th class="${stage>=2?'focus-col':''}">0.06</th></tr></thead><tbody>${values.map((row,i)=>`<tr class="${i===1?'focus-row':''}">${row.map((v,j)=>`<${j?'td':'th'} class="${stage===3&&i===1&&j===3?'focus-cell':stage>=2&&j===3?'focus-col':''}">${v}</${j?'td':'th'}>`).join('')}</tr>`).join('')}</tbody></table>`;
    add(title,html,`lookup stage-${stage}`);
  }
  table(1,'まず、1.9の行');
  table(2,'次に、0.06の列');
  table(3,'交点は、0.02500');
  equation('読み取った確率',String.raw`\Pr(Z>1.96)=0.02500=2.5\%`,{long:true,answer:true});
  visual('右の尾が、2.5％',normal('story-table-025',1.96,4,{labels:[{x:1.96,text:'1.96'}]}),'小数第5位の上側確率表を使用。','右側の面積：2.5％');
  text('−1.96より左なら？');
  visual('左右対称だから、同じ面積',normal('story-table-negative',-4,-1.96,{labels:[{x:-1.96,text:'−1.96'}]}));
  equation('左の尾',String.raw`\Pr(Z<-1.96)=\Pr(Z>1.96)=2.5\%`,{long:true,answer:true});
  text('＋1.96より左の、全部なら？');
  visual('引くのは、右の尾',normal('story-table-lower-question',-4,1.96,{labels:[{x:1.96,text:'1.96'}]}));
  equation('左側確率の公式',String.raw`\Pr(Z<z)=1-Q(z)`);
  equation('右の尾を引く',String.raw`\Pr(Z<1.96)=1-0.02500=97.5\%`,{long:true,answer:true});
  visual('左側の面積は、97.5％',normal('story-table-lower-answer',-4,1.96,{labels:[{x:1.96,text:'1.96'}]}));
  text('−1から＋1の、真ん中なら？');
  equation('両方の尾を引く',String.raw`\Pr(-1<Z<1)=1-Q(1)-Q(1)`,{long:true});
  equation('表の数値を入れる',String.raw`1-2\times0.15866=0.68268\approx68.27\%`,{long:true,answer:true});
  visual('真ん中の面積は、約68.27％',normal('story-table-central',-1,1,{labels:[{x:-1,text:'−1'},{x:1,text:'1'}]}),'表は小数第5位。教科書の0.1586を使うと68.28％。丸め方による差。','教科書の丸め値では68.28％');
  explore('table','表と面積を、確かめよう','右側・左側・真ん中を切り替えてみる。');

  challenge('②','70点以上は、何％？',String.raw`得点 $X\sim N(50,100)$。`,'70点以上の確率を、上側確率の表で求めよう。');
  equation('答え合わせ② · 公式',String.raw`z=\frac{x-\mu}{\sigma}`);
  equation('答え合わせ② · 標準化',String.raw`z=\frac{70-50}{\sqrt{100}}=\frac{20}{10}=2`);
  add('答え合わせ② · 2.0の行、0.00の列','<table class="lookup-table"><tr><th>z</th><th>0.00</th></tr><tr><th>2.0</th><td class="focus-cell">0.02275</td></tr></table>','lookup small-lookup');
  equation('答え合わせ② · 確率',String.raw`\Pr(X\ge70)=\Pr(Z\ge2)=0.02275=2.275\%`,{long:true,answer:true});
  visual('答え合わせ② · 70点以上',normal('story-challenge-tail',2,4,{labels:[{x:2,text:'70点：z=2'}]}),'連続変数なので≧と＞の差で確率は変わらない。','右側の面積：2.275％');
  challenge('③','30点から70点なら？',String.raw`同じく、得点 $X\sim N(50,100)$。`,'30点以上70点以下の確率を求めよう。');
  equation('答え合わせ③ · 範囲を標準化',String.raw`30\le X\le70\quad\Longleftrightarrow\quad-2\le Z\le2`,{long:true});
  equation('答え合わせ③ · 公式',String.raw`\Pr(-z<Z<z)=1-2Q(z)`);
  equation('答え合わせ③ · 数値を入れる',String.raw`\Pr(-2\le Z\le2)=1-2(0.02275)=95.45\%`,{long:true,answer:true});
  visual('答え合わせ③ · 30〜70点',normal('story-challenge-central',-2,2,{labels:[{x:-2,text:'30点'},{x:2,text:'70点'}]}),'平均50点から±20点＝±2σの範囲。','真ん中の面積：95.45％');
  text('確率は、面積。');
  add('ALワークシート','ここからは、自分で取り組もう。','statement','各セルの答えは示さない。提出方法と締切は授業予定ページ・UNIPAを確認する。');

  sources={textbook:'123',yoh75:'44–50',yoh109:'46–51'};
  add('補足：1人の点数と、標本平均','教科書 p.123','book-divider');
  equation('1人の点数',String.raw`Z=\frac{X-\mu}{\sigma}`);
  equation('n人の標本平均',String.raw`Z=\frac{\bar X-\mu}{\sigma/\sqrt n}`);
  text('平均を使うと、分母が変わる。');
  equation('標本平均の標準偏差',String.raw`\sigma_{\bar X}=\frac{\sigma}{\sqrt n}`);
  text('標準化すれば、何でも正規分布になる？');
  text('正規分布になるかは、元の分布や条件による。','独立な正規母集団の標本平均なら正確に正規分布。一般の母集団の標本平均への正規近似は、有限分散などの条件と十分大きい標本数を必要とする。');
  return {slides,mapping};
}
function mathPdf(x,mu,sd){return Math.exp(-.5*((x-mu)/sd)**2)/(sd*Math.sqrt(2*Math.PI));}

export const storyStyle=`<style>
section{background:#fbfaf6;color:#252b30;font-family:'Noto Sans JP','Hiragino Sans',sans-serif;font-size:38px;padding:54px 70px;justify-content:center;text-align:center;line-height:1.55}
section h2{font-size:48px;line-height:1.35;margin:0 0 30px;color:#203b49;font-weight:700}section p{margin:16px 0}section strong{color:#176d82}section footer,section::after{font-size:15px;color:#859095}section.statement h2{font-size:58px;line-height:1.55;margin:0}section.statement p{font-size:34px;margin-top:28px}
section.title{background:#173c50;color:white}section.title h2{font-size:78px;color:white}section.title p{font-size:36px;color:#c3dfec}section.title footer,section.title::after{color:#b7cdd8}
section.kiss-frame{padding:0;background:white}section.kiss-frame h2{display:none}section.kiss-frame img{width:1120px;height:auto;max-width:none}section.kiss-frame p{margin:0}
section.hero-math h2{display:none}section.hero-math .katex-display{font-size:76px;margin:0;white-space:nowrap}section.hero-math.long .katex-display{font-size:59px}section.hero-math.answer{background:#edf5ef}section.hero-math.answer .katex-display{color:#226b58}
section.single-visual{padding:40px 60px 58px}section.single-visual h2{font-size:44px;margin-bottom:12px}section.single-visual img{width:1030px;height:470px;object-fit:contain}section.single-visual img[src*="robot.svg"]{height:280px;width:auto}section.single-visual .caption{font-size:22px;color:#53676e;margin-top:0}
section.book-divider{background:#e7f3fa;border-top:10px solid #399ac8;text-align:left}section.book-divider h2{font-size:24px;color:#237da7;margin-bottom:35px}.chapter{font-size:62px;color:#184762;font-weight:800}.pages{font-size:32px;color:#237da7;margin-top:25px}
section.try{background:#edf5ef;border-top:7px solid #388065}section.try h2{color:#2b624b}section.try p{font-size:32px}section.try a{display:inline-block;background:#176d82;color:white;text-decoration:none;border-radius:8px;padding:15px 30px;font-size:32px;font-weight:700;margin-top:22px}
section.challenge{background:#fff8e8;border-top:9px solid #be8530}section.challenge h2{font-size:43px;color:#825519}.pause{font-size:24px;color:#825519;margin-bottom:28px}section.challenge p{font-size:34px;margin:22px 0}section.challenge strong{color:#825519}
section.lookup h2{font-size:47px}.lookup-table{display:table!important;width:100%;max-width:1000px;border-collapse:collapse;table-layout:fixed;margin:35px auto;font-family:Georgia,serif;font-size:36px}section.small-lookup .lookup-table{max-width:600px}.lookup-table th,.lookup-table td{padding:24px 12px;border:1px solid #c5d6df}.lookup-table th{background:#edf3f6;font-weight:700}.focus-row th,.focus-row td{background:#d9eaf2}section.stage-2 .focus-col,section.stage-3 .focus-col{background:#b8d9e9!important}.lookup-table .focus-cell{background:#176d82!important;color:white;font-weight:800;outline:3px solid #176d82}
</style>`;
