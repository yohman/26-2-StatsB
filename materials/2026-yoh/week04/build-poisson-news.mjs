import {readFileSync,writeFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {poissonExamples} from './poisson-news-examples.mjs';
import {newsMoments} from './news-moments.mjs';
import {newsAnswerVisual,answerVisualStyle} from './result-charts.mjs';
const here=dirname(fileURLToPath(import.meta.url));
const shared=readFileSync(resolve(here,'w4.md'),'utf8').match(/<style>[\s\S]*?<\/style>/)[0];
const math=s=>`$$\n${s}\n$$`;
const note=s=>`<div class="note">${s}</div>`;
const slide=(title,body,style)=>`<!-- _class: ${style} -->\n\n## ${title}\n\n${body}`;
const tableFile='other material/2025 yoh/06_[AL]確率分布_1_離散確率分布 ポアソン/ポアソン分布表.pdf';
const tableLink=`https://yohman.github.io/26-2-StatsB/viewer.html?${new URLSearchParams({p:'',file:tableFile,title:'ポアソン分布表',week:'W04',return:'agenda.html?p#week-04'})}`;
const styles=`<style>
section.news-opening{padding:42px 62px 65px} section.news-opening h2{font-size:42px;margin-bottom:25px}
.news-opening-layout{display:grid;grid-template-columns:510px 1fr;gap:32px;align-items:center}
.news-opening-layout img{max-width:510px;max-height:335px;object-fit:contain;border:1px solid #e1e5e5}
.news-credit{font-size:16px;color:#69777c} .news-outlet{font-size:20px;color:#176d82;font-weight:700}
.news-links a{font-size:21px;color:#176d82;margin-right:18px}
section.news-opening .note{font-size:18px;margin-top:18px}
section.news-given{padding:42px 62px 65px} section.news-given h2{font-size:40px}
section.news-given .katex-display{font-size:.94em;margin:24px 0}
.news-question{font-weight:700;font-size:29px;color:#176d82}
section.news-formula .katex-display{font-size:1.03em;margin:20px 0}
section.news-answer{background:#edf5ef;border-top:7px solid #388065;padding:35px 62px 65px}
section.news-answer h2{font-size:40px;margin-bottom:12px;color:#2b624b}
section.news-answer .katex-display{font-size:.96em;margin:14px 0}
section.news-answer .note{font-size:18px;margin-top:10px}
.table-explanation{font-size:21px} .table-explanation a{color:#176d82;text-decoration:underline}
section.news-answer table{font-size:23px;margin:8px 0} section.news-answer th,section.news-answer td{padding:6px 12px}
.news-result{font-size:25px;font-weight:700;color:#215d45;border-top:2px solid #b7d1c2;padding-top:12px;margin-top:12px}
</style>`;
for(const e of poissonExamples){
 const table=`<table class="poisson-lookup"><thead><tr><th>行 x ／ 列 μ</th><th class="lookup-column">${e.lambda.toFixed(1)}</th></tr></thead><tbody>${e.rows.map((x,i)=>`<tr><th class="lookup-row">${x}</th><td class="lookup-cell">${e.cells[i].toFixed(3)}</td></tr>`).join('')}</tbody></table>`;
 const slides=[
  slide(e.titleJa,`<div class="news-opening-layout"><div>\n\n[![width:510px](images/${e.thumbnail})](${e.article})\n\n<div class="news-credit">${e.credit}</div>\n\n</div><div>\n\n<div class="news-outlet">${e.outlet}</div>\n\n${e.hook}\n\n${e.finding}\n\n<div class="news-links">\n\n[記事を読む](${e.article})　[元データ](${e.primary})\n\n</div></div></div>\n\n${note(e.context)}\n\n<!-- Sources: ${e.article} | ${e.primary} -->`,'news-opening'),
  slide(e.givenTitle,`${e.given}\n\n${math(e.values)}\n\n<div class="news-question">${e.question}</div>\n\n${note(e.assumption)}`,'news-given'),
  slide('チャレンジ①　公式に代入して、表へ',`<div class="challenge-time">自分で解く　3〜5分 ／ 教科書 p.120</div>\n\n${math(String.raw`\Pr(X=x)=\frac{e^{-\lambda}\lambda^x}{x!},\qquad\lambda=rt`)}\n\n${math(e.event)}\n\n${math(e.substitution)}\n\n${note(e.instruction+'　eの値は計算せず、配布のポアソン分布表を使う。')}`,'book-reference news-formula'),
  slide('分布表を読んで、答えを出す',`<div class="lookup-layout"><div>${table}</div><div class="table-explanation">\n\n配布表の抜粋。表の $\\mu$ は、公式の $\\lambda$ と同じ「期間内の平均」。\n\n[ポアソン分布表を開く](${tableLink})\n\n</div></div>\n\n${math(e.calculation)}\n\n<div class="news-result">${e.interpretation}</div>\n\n${note(e.caution)}\n\n${note('表は小数第3位に丸められているため、答えは近似値。')}`,'news-answer')
 ];
 slides.push(...newsMoments(e,true));
 slides.splice(4,0,newsAnswerVisual(e,false,true));
 slides.push(newsAnswerVisual(e,true,true));
 writeFileSync(resolve(here,`news-${e.id}.md`),`---\nmarp: true\ntheme: default\nsize: 16:9\npaginate: true\nmath: katex\nfooter: '統計学B · Week 4 · ポアソンのニュース演習'\n---\n\n${shared}\n${styles}\n${answerVisualStyle}\n\n${slides.join('\n\n---\n\n')}\n`);
 console.log(`${e.id}: ${slides.length} slides`);
}
