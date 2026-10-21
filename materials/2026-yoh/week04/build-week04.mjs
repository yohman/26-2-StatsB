import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {walkthrough} from '../week03/challenge-walkthrough.mjs';
import {addReviewExercises} from './review-exercises.mjs';
import {attachLectureVisuals,answerVisualStyle} from './result-charts.mjs';
const here=dirname(fileURLToPath(import.meta.url));
mkdirSync(resolve(here,'images'),{recursive:true});
const root=resolve(here,'../../..');
const style=readFileSync(resolve(here,'../week03/w3.md'),'utf8').match(/<style>[\s\S]*?<\/style>/)[0];
// Reuse the course's existing robot and goat artwork unchanged.
const icons=readFileSync(resolve(root,'assets/monty-hall.js'),'utf8');
for(const name of ['robot','goat'])writeFileSync(resolve(here,'images',name+'.svg'),icons.match(new RegExp('const '+name+' = `([^`]+)`;'))[1].replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" '));
const M=s=>`$$\n${s}\n$$`;
const I=s=>`$${s}$`;
const N=s=>`<div class="note">${s}</div>`;
const link=id=>`[やってみよう！](https://yohman.github.io/26-2-StatsB/agenda.html?p&activity=al4-${id}#week-04)`;
const tableFile='other material/2025 yoh/06_[AL]確率分布_1_離散確率分布 ポアソン/ポアソン分布表.pdf';
const tableLink=`[ポアソン分布表を開く](https://yohman.github.io/26-2-StatsB/viewer.html?${new URLSearchParams({p:'',file:tableFile,title:'ポアソン分布表',week:'W04',return:'agenda.html?p#week-04'})})`;
const slides=[];
const add=(title,body,cls='')=>slides.push(`${cls?`<!-- _class: ${cls} -->\n\n`:''}## ${title}\n\n${body}`);
const ref=(title,page,body)=>add('教科書 · 第2章 第2節',`<div class="chapter">${title}</div><div class="pages">${page}</div>\n\n${body}`,'book-divider');
const important='<div class="important-badge">最重要 / VERY IMPORTANT</div>';
add('100回引いたら、当たる？',`<div class="w4-slide-characters"><img src="images/robot.svg" alt="レアロボット"><span>100回</span><img src="images/goat.svg" alt="通常のヤギ"></div>\n\nレア率 **0.05％**。100回なら、もう当たりそう？\n\n今日は「当たりそう」を、**公式で説明できる** ようにする。`);
add('今日の流れ',`**復習**　何を数える？　どの公式？\n\n**チャレンジ3問**　自分で式を組み立てる。各10分。\n\n**AL 01・02・03**　打率、ガチャ、不良品。ワークシートに接続。\n\n${N('3つのALは、同じ公式を別の場面で使う練習です。')}`);
ref('4　離散確率分布の復習','p.118–120','**回数が決まるなら二項分布。まれな発生数ならポアソン近似。**\n\n式の前に、何を数える $X$ なのか決めよう。');
add('Xは何を数える？',`| 場面 | 確率変数 $X$ | 取りうる値 |\n| --- | --- | --- |\n| 5打席 | 安打の本数 | 0, 1, 2, 3, 4, 5 |\n| 100回のガチャ | レアの個数 | 0, 1, …, 100 |\n| 3,500個を検品 | 不良品の個数 | 0, 1, …, 3500 |\n\n**0個も、立派な結果。**\n\n${N('Xは「当たる確率」ではなく、数える個数。実際に観測した値を小文字xと書く。')}`);
add('二項分布の公式',`${important}\n\n${M(String.raw`\Pr(X=x)={}_nC_x\pi^x(1-\pi)^{n-x}`)}\n\n${N('独立な試行をn回。毎回の成功確率πは同じ。成功回数Xを数える。教科書 p.118–119。')}`,'book-reference');
add('式は「並び方 × 1通りの確率」',`${M(String.raw`\underbrace{{}_nC_x}_{\text{並び方}}\ \underbrace{\pi^x}_{\text{成功 }x\text{ 回}}\ \underbrace{(1-\pi)^{n-x}}_{\text{失敗 }n-x\text{ 回}}`)}\n\nロボット3体・ヤギ2体の **1つの並び** の確率は、${String.raw`$\pi^3(1-\pi)^2$`}。\n\nその並び方は ${I('{}_5C_3=10')} 通り。10通りの確率を足す。\n\n${N('成功・失敗の順番が違っても、成功回数が同じなら同じXに数える。')}`);
add('Cは「順番を区別しない選び方」',`${M(String.raw`{}_nC_x=\frac{n!}{x!(n-x)!}`)}\n\n${M(String.raw`{}_7C_2=\frac{7\times6}{2\times1}=21`)}\n\n7つの位置から、ロボットが入る2か所を選ぶ。\n\n${N('0!=1。端の結果も扱えるので、nC0=nCn=1になる。教科書 p.119。')}`,'book-reference');
add('「ちょうど」と「以上」は違う',`${M(String.raw`\Pr(X=1)\neq\Pr(X\ge1)`)}\n\n**ちょうど1個**：1個だけ。2個は含まない。\n\n**1個以上**：1個、2個、3個、…全部。\n\n${M(String.raw`\Pr(X\ge1)=1-\Pr(X=0)`)}\n\n${N('少なくとも1個の反対は、1個もない。ガチャで使う一番大切な読み替え。')}`);
add('期待値と分散は「個数」の性質',`${important}\n\n${M(String.raw`E(X)=n\pi,\qquad\operatorname{Var}(X)=n\pi(1-\pi)`)}\n\n**期待値**：同じセットを繰り返したときの平均個数。\n\n**分散**：セットごとの個数のばらつき。単位は個²。\n\n${N('期待値0.05個は、当たる確率5％という意味ではない。教科書 p.119–120。')}`,'book-reference');
ref('ポアソン近似','p.120',String.raw`試行回数 $n$ が大きく、成功確率 $\pi$ が小さいとき。

$\lambda=n\pi$ を使い、まれな発生数を近似する。`);
add('ポアソン分布の公式',`${M(String.raw`\Pr(X=x)=\frac{\lambda^xe^{-\lambda}}{x!},\qquad E(X)=\operatorname{Var}(X)=\lambda`)}\n\n**確率は配布表で読む。** $e$ の数値を計算する必要はない。\n\n${tableLink}\n\n${N('ポアソンモデルの式は等式。二項分布をポアソンで置き換えるときは近似。教科書 p.120。')}`,'book-reference');
add('モデルを選ぶ、最短の質問',`| 質問 | 二項分布 | ポアソン近似 |\n| --- | --- | --- |\n| 何が与えられた？ | $n$ 回・成功率 $\\pi$ | 大きい $n$・小さい $\\pi$ |\n| 数えるもの | $n$ 回中の成功数 | まれな発生数 |\n| 平均 | $n\\pi$ | $\\lambda=n\\pi$ |\n| 分散 | $n\\pi(1-\\pi)$ | $\\lambda$ |\n\n${N('5打席32％は二項。3,500個中、不良率0.2％は今回の課題ではポアソン近似。')}`);
const challenge=(no,title,body,page)=>add(`チャレンジ${no}　${title}`,`<div class="challenge-time">自分で解く　10分　／　教科書 ${page}</div>\n\n${body}\n\n${N('教科書・電卓可。公式を文字で書き、数値を代入し、答えの意味まで説明しよう。')}`,'challenge');
challenge('①','7台の配送ロボット',String.raw`各ロボットが時間内に到着する確率は **80％**。7台は独立に配達する。

**(1)** ちょうど5台が間に合う確率は？

**(2)** 1台以上が遅れる確率は？

**(3)** 間に合う台数の期待値と分散は？`,'p.118–120');
slides.push(walkthrough({title:'答え合わせ①　遅れるのは、全台成功の反対',given:String.raw`$X$ は時間内に到着した台数。$n=7,\ \pi=0.8$。`,formula:String.raw`\begin{aligned}\Pr(X=x)&={}_nC_x\pi^x(1-\pi)^{n-x}\\\Pr(X<n)&=1-\Pr(X=n)\\E(X)&=n\pi\\\operatorname{Var}(X)&=n\pi(1-\pi)\end{aligned}`,substitution:String.raw`\begin{aligned}\Pr(X=5)&={}_7C_5(0.8)^5(0.2)^2\\&=0.2752512\approx27.53\%\\\Pr(X=7)&={}_7C_7(0.8)^7(0.2)^0\\&=1\times0.2097152\times1\approx20.97\%\\\Pr(X\le6)&=1-\Pr(X=7)\\&=1-0.2097152\approx79.03\%\\E(X)&=7\times0.8=5.6\\\operatorname{Var}(X)&=7\times0.8\times0.2=1.12\end{aligned}`,result:'ちょうど5台：約27.53％。1台以上遅れる：約79.03％。',note:'全7台が間に合う確率は約20.97％。その反対が「1台以上遅れる」。期待値5.6台、分散1.12台²。'}));
challenge('②','80回のカプセル抽選',String.raw`1回の当たり確率は **1％**。80回、独立に抽選する。確率は変わらない。

**(1)** 1回以上当たる確率は？

**(2)** 当たり個数の期待値と分散は？

**(3)** 「80回×1％＝80％だから、当たる確率80％」は正しい？`,'p.119–120');
slides.push(walkthrough({title:'答え合わせ②　期待個数と当選確率を分ける',given:String.raw`$X$ は当たり個数。$n=80,\ \pi=0.01$。`,formula:String.raw`\begin{aligned}\Pr(X=x)&={}_nC_x\pi^x(1-\pi)^{n-x}\\\Pr(X\ge1)&=1-\Pr(X=0)\\E(X)&=n\pi\\\operatorname{Var}(X)&=n\pi(1-\pi)\end{aligned}`,substitution:String.raw`\begin{aligned}\Pr(X=0)&={}_{80}C_0(0.01)^0(0.99)^{80}\\&=1\times1\times(0.99)^{80}\approx44.75\%\\\Pr(X\ge1)&=1-\Pr(X=0)\\&=1-(0.99)^{80}\approx55.25\%\\E(X)&=80\times0.01=0.8\\\operatorname{Var}(X)&=80\times0.01\times0.99=0.792\end{aligned}`,result:'1回以上当たる：約55.25％。期待値0.8個、分散0.792個²。',note:'X＝0は「80回すべて外れ」。X＝80は「80回すべて当たり」で、別の出来事。nπは平均個数であり、当選確率ではない。'}));
challenge('③','2,500個のセンサーを出荷',String.raw`不良率は **1,000個あたり2個**。2,500個を出荷する。
不良品数 $X$ はポアソン分布で近似できるとする。

**(1)** $\lambda$ と、期待値・分散は？

**(2)** 不良品が1個以下である確率を、配布表で求めよ。

**(3)** 1個以下の反対は、何個以上？`,'p.120');
slides.push(walkthrough({title:'答え合わせ③　1個以下は、0個と1個',given:String.raw`$n=2500,\ \pi=2/1000=0.002$。ポアソン近似を使う。`,formula:String.raw`\begin{aligned}\lambda&=n\pi\\E(X)&=\operatorname{Var}(X)=\lambda\\\Pr(X\le1)&=\Pr(X=0)+\Pr(X=1)\end{aligned}`,substitution:String.raw`\begin{aligned}\lambda&=2500\times0.002=5\\E(X)&\approx5,\quad\operatorname{Var}(X)\approx5\\\text{表の }\mu=5.0:\quad\Pr(X=0)&\approx0.007=0.7\%\\\Pr(X=1)&\approx0.034=3.4\%\\\Pr(X\le1)&\approx0.007+0.034=4.1\%\end{aligned}`,result:'不良品1個以下：約4.1％。その反対は2個以上。',note:'期待値5個、近似分散5個²。表の丸め値を使用。不良品は独立・不良率一定と仮定。'}));
ref('AL　3つのシートを解く','p.118–120','**01 打率**　全ての結果を並べる。\n\n**02 ガチャ**　余事象で、1個以上を求める。\n\n**03 不良品**　ポアソン近似で、平均と分散を読む。');
add('AL 01　5打席で、何本打つ？',`<div class="w4-slide-characters"><img src="images/robot.svg" alt="打者ロボット"><span>⚾ × 5</span></div>\n\n$X$＝安打数。$n=5$、$\\pi=0.32$、$1-\\pi=0.68$。\n\n**0本から5本まで、全部の確率を計算する。**\n\n${N('シート「打率の事例_応用」。D6に0.32、D7に5。F7:F12はx=0〜5。')}`);
add('AL 01　ワークシートの4列は、式の4部分',`${M(String.raw`\underbrace{{}_nC_x}_{H\text{列}}\ \underbrace{\pi^x}_{I\text{列}}\ \underbrace{(1-\pi)^{n-x}}_{J\text{列}}=\underbrace{\Pr(X=x)}_{G\text{列}}`)}\n\n| 列 | 入れるもの | x=3 の場合 |\n| --- | --- | --- |\n| H | 組合せ | $\\,{}_5C_3=10$ |\n| I | 成功の確率 | $0.32^3=0.032768$ |\n| J | 失敗の確率 | $0.68^2=0.4624$ |\n| G | H × I × J | $0.151519232$ |\n\n${N('Excelなら、H10=COMBIN($D$7,F10)、I10=$D$6^F10、J10=(1-$D$6)^($D$7-F10)、G10=H10*I10*J10。')}`,'explained');
const choose=(n,k)=>{let c=1;for(let i=1;i<=k;i++)c=c*(n-i+1)/i;return c;};
add('AL 01　6つの結果で、100％になる',`| $x$ | $\\,{}_5C_x$ | $0.32^x$ | $0.68^{5-x}$ | $\\Pr(X=x)$ |\n| --- | --- | --- | --- | --- |\n${Array.from({length:6},(_,x)=>`| ${x} | ${choose(5,x)} | ${(0.32**x).toFixed(6)} | ${(0.68**(5-x)).toFixed(6)} | ${(100*choose(5,x)*.32**x*.68**(5-x)).toFixed(2)}％ |`).join('\n')}\n\n${M(String.raw`\sum_{x=0}^{5}\Pr(X=x)=1`)}\n\n${N('最も起こりやすいのは1本。期待値は5×0.32=1.6本。最頻値と平均は同じとは限らない。途中計算では丸めず、最後に表示を丸める。')}`,'explained');
add('AL 01　1試合と、100試合を比べる',`1試合では、何本打つかは分からない。\n\n**100試合** の実測を、公式の確率分布と比べよう。\n\n棒を選ぶ代わりに、$x$ のスライダーで **1つの式** を確かめる。\n\n${link('hits')}\n\n${N('理論の緑の枠は固定。実測のオレンジだけが変わる。100試合は、5打席の試合を100回繰り返すこと。')}`,'try');
add('AL 02　0.05％を、式に入る数にする',`<div class="w4-slide-characters"><img src="images/robot.svg" alt="レアロボット"><img src="images/goat.svg" alt="通常のヤギ"></div>\n\n${M(String.raw`0.05\%=\frac{0.05}{100}=0.0005`)}\n\n**レアはロボット。通常はヤギ。** $X$ はレアの個数。\n\n${N('シート「ガチャの事例」。D6=0.0005、D7=100。0.05をそのまま入れると5％になり、100倍違う。独立・排出率一定・天井なし。')}`);
slides.push(walkthrough({title:'AL 02　1個以上は、0個の反対',given:String.raw`$n=100,\ \pi=0.0005,\ 1-\pi=0.9995$。求めるのは $X\ge1$。`,formula:String.raw`\begin{aligned}\Pr(X=0)&={}_nC_0\pi^0(1-\pi)^n\\\Pr(X\ge1)&=1-\Pr(X=0)\\&=1-(1-\pi)^n\end{aligned}`,substitution:String.raw`\begin{aligned}\Pr(X=0)&=1\times1\times(0.9995)^{100}\\&\approx0.95121753\\\Pr(X\ge1)&=1-0.95121753\\&\approx0.04878247\end{aligned}`,result:'100回引いてレア1個以上：約4.88％。0個：約95.12％。',note:'D9=1-G7。D10=SUM(G8:G107)でも確認できる。公式スライドの4.89％表記は丸め誤りで、4.88％が適切。'}));
slides.push(walkthrough({title:'AL 02　「期待値0.05個」の意味',given:String.raw`$X$ は100回で出るレア個数。$n=100,\ \pi=0.0005$。`,formula:String.raw`\begin{aligned}E(X)&=n\pi\\\operatorname{Var}(X)&=n\pi(1-\pi)\end{aligned}`,substitution:String.raw`\begin{aligned}E(X)&=100\times0.0005=0.05\\\operatorname{Var}(X)&=100\times0.0005\times0.9995\\&=0.049975\end{aligned}`,result:'期待値0.05個。分散0.049975個²。',note:'D12=期待値、D13=分散。100回セットを20セット行うと、合計レアの期待個数は1個。ただし必ず1個当たる保証ではない。'}));
add('AL 02　ロボットと一緒に、100回セットを引く',`**1セット＝100回のガチャ。**\n\n1セットだけでは、ほとんどレア0個。\n\n100セット・1,000セット試して、**レアが出たセットの割合** を比べよう。\n\n${link('gacha')}\n\n${N('期待個数と、1個以上出る確率は別の量。次の1回のレア率は、外れ続けても0.05％のまま。')}`,'try');
add('AL 03　3,500個を出荷するロボット工場',`<div class="w4-slide-characters"><img src="images/robot.svg" alt="検品ロボット"><span>📦 × 3500</span></div>\n\n${M(String.raw`\pi=\frac{2}{1000}=0.002,\qquad n=3500`)}\n\n$X$＝不良品の個数。**ポアソン分布で近似する** と指定されている。\n\n${N('シート「不良品の事例」。D7=2/1000、D8=3500。不良品を「起こる」と数える。')}`);
slides.push(walkthrough({title:'AL 03　平均個数が、ポアソンの母数',given:String.raw`$n=3500,\ \pi=0.002$。独立・不良率一定を仮定し、ポアソン近似。`,formula:String.raw`\begin{aligned}\lambda&=n\pi\\E(X)&=\lambda\\\operatorname{Var}(X)&=\lambda\end{aligned}`,substitution:String.raw`\begin{aligned}\lambda&=3500\times0.002=7\\E(X)&\approx7\\\operatorname{Var}(X)&\approx7\end{aligned}`,result:'予測される不良品は平均7個。近似の分散は7個²。',note:'D10=期待値、D11=分散。毎便7個と決まっているわけではない。出荷する便ごとにXは変わる。'}));
add('AL 03　なぜ分散も7でよい？',`${M(String.raw`\begin{aligned}\text{二項の正確な分散}&=3500\times0.002\times0.998=6.986\\\text{ポアソン近似の分散}&=\lambda=7\end{aligned}`)}\n\n$1-\\pi=0.998$ は、ほぼ1。だから近似では **7** を使う。\n\n**平均は、二項でもポアソン近似でも7。**\n\n${N('問題が「ポアソン分布で近似」と指定しているので、ALの分散は7。6.986と7を混ぜない。教科書 p.120。')}`,'book-reference');
add('AL 03　毎便7個とは限らない',`1便ずつ検品し、不良品が何個あったかを見る。\n\n便を増やして、**平均個数** と **便ごとの分布** を確認する。\n\n${link('defects')}\n\n${N('実験では3,500個を独立に判定する二項モデルを使い、緑のポアソン近似と比べる。近似なので完全一致を強制しない。')}`,'try');
add('提出前のチェック',`**01 打率**　0〜5本の確率を全部書いた？　合計は1？\n\n**02 ガチャ**　0.05％を0.0005にした？　個数と確率を分けた？\n\n**03 不良品**　$\\lambda=7$？　近似の分散も7？\n\nワークシートに入力し、指定セルの値を **UNIPA** の小テストで回答。\n\n${N('締切と提出方法は、授業予定ページ・UNIPAの最新案内を確認。')}`);
// The six probabilities are a data chart, paired with the worksheet's factor table.
const probs=Array.from({length:6},(_,x)=>choose(5,x)*.32**x*.68**(5-x));
writeFileSync(resolve(here,'images','batting-distribution.svg'),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 320"><rect width="460" height="320" fill="#fbfaf6"/><g font-family="Hiragino Sans,sans-serif" font-size="16" fill="#40555f"><text x="20" y="28">各安打数の確率（％）</text><path d="M25 260H440" stroke="#71848e"/>${probs.map((p,x)=>{const h=p/.4*200,cx=55+x*68;return `<rect x="${cx-20}" y="${260-h}" width="40" height="${h}" fill="#287e72"/><text x="${cx}" y="${250-h}" text-anchor="middle">${(p*100).toFixed(1)}</text><text x="${cx}" y="286" text-anchor="middle">${x}</text>`;}).join('')}<text x="440" y="315" text-anchor="end">安打数 X</text></g></svg>`);
slides[21]=slides[21].replace('<!-- _class: explained -->','<!-- _class: explained al-table -->').replace(/(\n\n)(\| \$x\$[\s\S]*?)(\n\n\$\$)/,'$1<div class="w4-table-chart"><div>\n\n$2\n\n</div><div>\n\n![width:420px](images/batting-distribution.svg)$3').replace(/\$\$\n\n<div class="note">/,()=> '$$\n\n</div></div>\n\n<div class="note">');
slides[24]=slides[24].replace('公式スライドの4.89％表記は丸め誤りで、4.88％が適切。','4.878247…％を小数第2位まで表示すると4.88％。');
// Insert after the combination review, after the index-based worksheet formatting above.
const originalLength=slides.length;
const nyt='https://www.nytimes.com/2026/02/24/technology/schoolwork-chatbot-cheating-pew.html';
const pew='https://www.pewresearch.org/internet/2026/02/24/how-teens-use-and-view-ai/';
add('宿題、どこまでAIに頼る？',`<div class="news-layout"><div>\n\n[![width:410px](images/pew-ai-report.png)](${pew})\n\n<div class="news-credit">元調査の画面 / Pew Research Center<br>写真：Hill Street Studios / Getty Images</div>\n\n</div><div>\n\n**The New York Times**　2026.02.24\n\nMore Than Half of Teens Use Chatbots for Schoolwork, Survey Finds\n\n米国の10代、**10％** が宿題の「全部・大部分」でAIの助けを借りている。\n\n[NYTの記事を読む](${nyt})　[元の調査](${pew})\n\n</div></div>\n\n${N('利用した割合を、不正をした割合と読み替えない。元調査は米国13〜17歳1,458人、2025年9〜10月実施。')}`,'news-article');
add('5人のうち、ちょうど2人？',`<div class="news-step">GIVEN / 与えられた値と問題</div>\n\n**調査の数値**：宿題の全部・大部分でAIの助けを借りる割合は10％。\n\n**授業での設定**：同じ割合の集団から5人を独立に選ぶと仮定する。\n\n${M(String.raw`n=5,\qquad\pi=0.10,\qquad x=2`)}\n\n$X$＝この使い方をしている人の数。\n\n**ちょうど2人が該当する確率 $\\Pr(X=2)$ を求めよ。**\n\n${N('5人・独立・確率一定は計算用の仮定。このクラスの実態を推定する問題ではありません。出典：Pew Research Center（2026.02.24）。')}`);
add('ニュースの数字を、二項分布へ',`<div class="news-step">FORMULA / 公式と代入</div>\n\n${M(String.raw`\Pr(X=x)={}_nC_x\pi^x(1-\pi)^{n-x}`)}\n\n${M(String.raw`\Pr(X=2)={}_5C_2\,(0.10)^2(0.90)^3`)}\n\n**5人のどの2人か** × **該当する2人** × **該当しない3人**\n\n${N('1通りの並びの確率は0.10²×0.90³。その並び方を5C2で数え、全部足します。教科書 p.118–119。')}`,'book-reference');
add('答えは7.29％。何の確率？',`<div class="news-step">SOLUTION / 計算と答え</div>\n\n${M(String.raw`{}_5C_2=\frac{5\times4}{2\times1}=10`)}\n\n${M(String.raw`\begin{aligned}\Pr(X=2)&=10\times0.01\times0.729\\&=0.0729=\boxed{7.29\%}\end{aligned}`)}\n\n**5人組を繰り返し作ったとき、ちょうど2人が該当する組は約7.29％。**\n\n${N('個人の割合10％と、5人中ちょうど2人の確率7.29％は別の量。AI利用の善悪や、不正の有無はこの計算では判断できません。')}`,'news-solution');
slides.splice(7,0,...slides.splice(originalLength));
addReviewExercises(slides);
// Replace the older schoolwork example with the complete AI-companion story.
const oldStory=slides.findIndex(s=>s.includes('## 宿題、どこまでAIに頼る？'));
if(oldStory<0||!slides[oldStory+5].includes('期待値は、確率ではなく個数'))throw Error('Unexpected old news sequence');
slides.splice(oldStory,6);
slides[1]=slides[1].replace('**チャレンジ3問**','**10分チャレンジ3問**').replace('3つのALは、同じ公式を別の場面で使う練習です。','途中の3分チェックは必要に応じて。3つのALは、同じ公式を別の場面で使う練習です。');
// The 100-pull hook belongs to its worksheet, after the review and challenges.
const gachaOpening=slides.shift().replace('今日は「当たりそう」を','ここでは「当たりそう」を');
const gachaStart=slides.findIndex(s=>s.includes('## AL 02　0.05％を、式に入る数にする'));
slides.splice(gachaStart,0,gachaOpening);
slides.splice(0,slides.length,...attachLectureVisuals(slides));
// Homework is independent work: do not include worked answers or guided labs.
const homeworkStart=slides.findIndex(s=>s.includes('AL　3つのシートを解く'));
if(homeworkStart<0)throw Error('Missing homework section');
slides.splice(homeworkStart);
add('AL 01・02・03　宿題',`ここからは、**自分で取り組む課題**です。\n\n配布ワークシートの各シートを読み、設問に答えてください。\n\n**01 打率　／　02 ガチャ　／　03 不良品**`);
add('AL 01　打率',`打率 **0.32** の選手が、**5打席**に立つ。\n\nワークシート「打率の事例_応用」の設問に答えてください。`);
add('AL 02　ガチャ',`レアの排出率は **0.05％**。**100回**引く。\n\nワークシート「ガチャの事例」の設問に答えてください。`);
add('AL 03　不良品',`不良率は **1,000個あたり2個**。**3,500個**を出荷する。\n\nワークシート「不良品の事例」の設問に答えてください。`);
add('宿題の提出',`ワークシートに入力し、指定セルの値を **UNIPA** の小テストで回答してください。\n\n締切と提出方法は、授業予定ページ・UNIPAの最新案内を確認してください。`);
// Retain the editable standalone source, but present it inside the main deck only.
const openingSource=readFileSync(resolve(here,'news-ai-companions.md'),'utf8');
const openingStart=openingSource.indexOf('<!-- _class: news-opening -->');
if(openingStart<0)throw Error('Missing AI-companion opening');
const openingSlides=openingSource.slice(openingStart).trim().split(/\n\n---\n\n/);
if(openingSlides.length!==8)throw Error('Expected complete eight-slide AI story');
const openingStyles=[...openingSource.matchAll(/<style>[\s\S]*?<\/style>/g)].slice(1).map(m=>m[0]).join('\n\n');
slides.unshift(...openingSlides);
const poissonIntro=slides.findIndex(s=>s.includes('<div class="chapter">ポアソン近似</div>'));
if(poissonIntro!==19)throw Error('Poisson section no longer starts at original slide 20');
slides.splice(poissonIntro,0,`<!-- _class: poisson-person -->

## ポアソンは、どんな人？

<div class="poisson-person-layout"><div>

![height:450px](images/poisson-portrait.jpg)

</div><div>

### シメオン＝ドニ・ポアソン

<div class="poisson-person-name">Siméon Denis Poisson<br>1781–1840 ／ フランス</div>

**数学者・物理学者。**

1837年、裁判の判断を確率で研究した著書で、いま「ポアソン分布」と呼ぶ分布を示した。

この授業では、**まれな出来事が何回起こるか** を考えるために使う。

</div></div>

<div class="poisson-person-source">肖像：F.-S. Delpech（歴史的版画）／ 略歴：<a href="https://mathshistory.st-andrews.ac.uk/Biographies/Poisson/">University of St Andrews · MacTutor</a></div>

<!-- Biography source: https://mathshistory.st-andrews.ac.uk/Biographies/Poisson/
Portrait reused unchanged from the supplied archived course asset. -->`);
// Open the Poisson section with the article and its nπ-based classroom exercise.
const bearSource=readFileSync(resolve(here,'news-poisson-bears.md'),'utf8');
const bearStart=bearSource.indexOf('<!-- _class: news-opening -->');
if(bearStart<0)throw Error('Missing bear article opening');
const bearSlides=bearSource.slice(bearStart).trim().split(/\n\n---\n\n/);
if(bearSlides.length!==8||bearSlides.some(s=>s.includes('\\lambda=rt')))throw Error('Expected eight nπ bear slides');
slides.splice(poissonIntro,0,...bearSlides);
// Keep question/answer numbering sequential across the story and review.
let exerciseNumber=0;
for(let i=0;i<slides.length;i++)if(/^## チャレンジ/m.test(slides[i])){
 const label=String.fromCodePoint(0x2460+exerciseNumber++);
 slides[i]=slides[i].replace(/(## チャレンジ)[①-⑳]/,`$1${label}`);
 slides[i+1]=slides[i+1].replace(/## 答え合わせ[①-⑳]?　/,`## 答え合わせ${label}　`);
}
add('時間が余ったら　任意のニュース演習',`本編はここまで。残り時間に合わせて、**1つだけ** 選ぼう。\n\n**二項分布**\n\n[AIニュースの正確性](https://yohman.github.io/26-2-StatsB/viewer.html?p&file=materials%2F2026-yoh%2Fweek04%2Fnews-ai-news-errors.pdf&week=W04)　／　[AIへの怒り](https://yohman.github.io/26-2-StatsB/viewer.html?p&file=materials%2F2026-yoh%2Fweek04%2Fnews-genz-ai-anger.pdf&week=W04)\n\n**ポアソン分布**\n\n[クマの人身被害](https://yohman.github.io/26-2-StatsB/viewer.html?p&file=materials%2F2026-yoh%2Fweek04%2Fnews-poisson-bears.pdf&week=W04)　／　[ネット上の不審な通信](https://yohman.github.io/26-2-StatsB/viewer.html?p&file=materials%2F2026-yoh%2Fweek04%2Fnews-poisson-cyber.pdf&week=W04)\n\n${N('どの演習も、問題・公式・代入・答え・グラフを含む。本編の理解を優先し、残りは復習に使ってよい。')}`);
// Appendix: show how to set up the homework, without supplying cell results.
add('AL 01　解答ガイド：打率',String.raw`**与えられた値**：$n=5,\ \pi=0.32$。$X$＝安打数。

${M(String.raw`\Pr(X=x)={}_nC_x\pi^x(1-\pi)^{n-x}`)}

**例：$x=3$ の行は、ここまで組み立てる。**

${M(String.raw`\Pr(X=3)={}_5C_3(0.32)^3(0.68)^2=\boxed{\phantom{0.000000}}`)}

| $x$ | 0 | 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- | --- | --- |
| $\Pr(X=x)$ | 自分で | 自分で | 自分で | 自分で | 自分で | 自分で |

${N('組合せ・成功の項・失敗の項をそれぞれ計算し、最後に掛ける。数値とExcelの各セルは自分で完成させる。')}`,'book-reference');
add('AL 02　解答ガイド：ガチャ',String.raw`**与えられた値**：$n=100,\ \pi=0.0005$。$X$＝レア個数。

${M(String.raw`\Pr(X=0)={}_nC_0\pi^0(1-\pi)^n`)}

${M(String.raw`\Pr(X\ge1)=1-\Pr(X=0)=1-(0.9995)^{100}=\boxed{\phantom{0.000000}}`)}

${M(String.raw`E(X)=n\pi=100\times0.0005=\boxed{\phantom{0.00}}`)}

${M(String.raw`\operatorname{Var}(X)=n\pi(1-\pi)=100\times0.0005\times0.9995=\boxed{\phantom{0.000000}}`)}

${N('1個以上の反対は0個。確率・期待個数・分散を混ぜずに、空欄とワークシートを自分で完成させる。')}`,'book-reference');
add('AL 03　解答ガイド：不良品',String.raw`**与えられた値**：$n=3500,\ \pi=\frac{2}{1000}=0.002$。ポアソン近似を使う。

${M(String.raw`\lambda=n\pi=3500\times0.002=\boxed{\phantom{00}}`)}

${M(String.raw`\text{ポアソンモデルでは}\qquad E(X)=\lambda,\qquad\operatorname{Var}(X)=\lambda`)}

| 求めるもの | 式の組み立て | 最終値 |
| --- | --- | --- |
| 期待値 | $n\pi$ | 自分で計算 |
| ポアソン近似の分散 | $\lambda$ | 自分で計算 |

${N('問題の「ポアソン分布で近似」という指定を確認する。最終値とExcelの各セルは自分で完成させる。教科書p.120。')}`,'book-reference');
const newsStyle=`<style>.news-layout{display:grid;grid-template-columns:370px 1fr;gap:42px;align-items:center}.news-layout img{max-width:370px;max-height:375px;object-fit:contain}.news-layout p{margin:10px 0}.news-layout a{font-size:23px}.news-credit{font-size:15px;color:#706e68}.news-step{font-size:20px;letter-spacing:.08em;color:#176d82;font-weight:700;margin-bottom:12px}section.news-article .note{font-size:17px;margin-top:15px}section.news-solution{background:#edf5ef}section.news-solution .katex-display{font-size:1.15em}section.news-solution .note{font-size:20px}</style>`;
const extraStyle=`<style>.w4-slide-characters{display:flex;justify-content:center;align-items:center;gap:40px;margin:12px 0}.w4-slide-characters img{width:130px;height:130px}.w4-slide-characters span{font-size:42px;color:#176d82;font-weight:700}.w4-table-chart{display:grid;grid-template-columns:1.15fr 1fr;gap:25px;align-items:center}.w4-table-chart img{width:100%}.al-table th,.al-table td{padding:7px 10px}.al-table .katex-display{margin:8px 0}.al-table .note{font-size:17px}</style>`;
const portraitStyle=`<style>section.poisson-person{padding:34px 62px 65px}section.poisson-person h2{font-size:43px;margin-bottom:12px}.poisson-person-layout{display:grid;grid-template-columns:350px 1fr;gap:50px;align-items:center}.poisson-person-layout img{height:450px;width:auto;max-width:350px;object-fit:contain}.poisson-person-layout p{font-size:27px;line-height:1.55;margin:16px 0}.poisson-person-layout h3{font-size:30px;color:#176d82;margin:0 0 12px}.poisson-person-name{font-size:24px;color:#60717a;line-height:1.4}.poisson-person-source{font-size:15px;color:#65747b;margin-top:8px}.poisson-person-source a{color:#176d82}</style>`;
writeFileSync(resolve(here,'w4.md'),`---\nmarp: true\ntheme: default\nsize: 16:9\npaginate: true\nmath: katex\nfooter: '統計学B · Week 4'\n---\n\n${style}\n${extraStyle}\n${newsStyle}\n${openingStyles}\n${answerVisualStyle}\n${portraitStyle}\n\n${slides.join('\n\n---\n\n')}\n`);
console.log(`Week 4: ${slides.length} slides; integrated AI story, three 10-minute challenges, three short checks, homework prompts, and optional scenarios.`);
