import {walkthrough} from '../week03/challenge-walkthrough.mjs';
const math=s=>`$$\n${s}\n$$`;
const slide=(title,body,kind)=>`<!-- _class: ${kind} -->\n\n## ${title}\n\n${body}`;
export const companionStyle=`<style>
section.worked-answer{padding-top:24px}
section.worked-answer .katex-display{font-size:.78em;margin:5px 0}
section.companion-given{font-size:25px} section.companion-given .news-question{font-size:27px;line-height:1.5}
section.companion-given .katex-display{font-size:1.02em;margin:17px 0}
section.companion-formula .katex-display{font-size:1.06em;margin:16px 0}
section.companion-chart{padding:35px 62px 60px;background:#fbfaf6}
section.companion-chart h2{font-size:40px;margin-bottom:14px}
section.companion-chart .katex-display{font-size:1.04em;margin:10px 0}
.companion-chart-legend{font-size:21px;margin:4px 0 8px}
.companion-chart-legend strong{color:#176d82} .companion-chart-legend em{color:#92641c;font-style:normal;font-weight:700}
.companion-distribution{width:100%;height:315px;display:block}
section.companion-chart .note{font-size:17px;margin-top:5px}
</style>`;
export function companionProbabilitySlides(e){return [
 slide(e.givenTitle,`${e.setup}\n\n${e.variable}\n\n${math(e.values)}\n\n<div class="news-question">\n\n(1) ちょうど5人：$\\Pr(X=5)$ は？\n\n(2) 5人以上：$\\Pr(X\\ge5)$ は？\n\n</div>\n\n<div class="note">${e.assumption}</div>`,'news-given companion-given'),
 slide('チャレンジ①　「5人」と「5人以上」',`<div class="challenge-time">自分で解く　5分 ／ 教科書 p.118–119</div>\n\n${math(e.formula)}\n\n**ヒント：「ちょうど」と「以上」で、含める人数はどう違う？**\n\n前のスライドから $n$・$\\pi$・$x$ を読み取り、自分で公式に代入しよう。\n\n<div class="note">「以上」に含まれる人数をすべて書き出し、それぞれの確率をどう組み合わせるか考えよう。</div>`,'book-reference companion-formula'),
 walkthrough({title:'答え合わせ　同じ分母で、2つの確率を足す',given:String.raw`$n=6,\ \pi=\frac34$。独立・確率一定の授業モデル。$3^5=243,\ 3^6=729,\ 4^6=4096$。`,formula:String.raw`\begin{aligned}\Pr(X=x)&={}_nC_x\pi^x(1-\pi)^{n-x}\\\Pr(X\ge k)&=\sum_{x=k}^{n}\Pr(X=x)\end{aligned}`,substitution:e.calculation,result:e.result,note:'分数のままで正解。％表示は参考。記事の72％と、授業モデルの75％を区別する。'})
];}
export function companionChart(e){
 const choose=(n,k)=>{let v=1;for(let j=1;j<=k;j++)v=v*(n-j+1)/j;return v;};
 const probabilities=Array.from({length:e.n+1},(_,x)=>choose(e.n,x)*e.p**x*(1-e.p)**(e.n-x));
 // Editable data chart: a separate bar for every possible class count, including tiny tails.
 const chart=`<svg class="companion-distribution" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1120 315" role="img" aria-label="6人のクラスの二項分布。ちょうど5人は35.60％。5人と6人の合計は53.39％。"><g font-family="Hiragino Sans,Noto Sans JP,sans-serif" font-size="20" fill="#40555f">${Array.from({length:5},(_,i)=>{const y=240-i*47.5;return `<path d="M90 ${y}H1070" stroke="#d9e1e3"/><text x="76" y="${y+7}" text-anchor="end">${i*10}%</text>`;}).join('')}${probabilities.map((p,x)=>{const center=155+x*140,h=p/.4*190,color=x===e.x?'#176d82':x>e.x?'#be8530':'#bdcbd0';return `<rect data-count="${x}" data-probability="${p}" x="${center-40}" y="${240-h}" width="80" height="${h}" fill="${color}"/><text x="${center}" y="${226-h}" text-anchor="middle" font-weight="700" fill="${x>=e.x?color:'#40555f'}">${(p*100).toFixed(2)}%</text><text x="${center}" y="268" text-anchor="middle">${x}</text>`;}).join('')}<path d="M90 240H1070" stroke="#71848e"/><text x="1068" y="305" text-anchor="end">利用経験者数 X（人）</text></g></svg>`;
 return slide('「5人以上」は、この2本の棒を足す',`${math(String.raw`\Pr(X=5)\approx35.60\%,\qquad\Pr(X\ge5)\approx53.39\%`)}\n\n<div class="companion-chart-legend"><strong>青：ちょうど5人</strong>　＋　<em>黄：6人全員</em>　＝　5人以上</div>\n\n${chart}\n\n<div class="note">6人の選択授業。利用経験率75％は手計算用の仮定。記事の実測値は72％。0〜6人の全ての確率を足すと100％。</div>`,'companion-chart');
}
