import {readFileSync,writeFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {newsExamples} from './news-examples.mjs';
const here=dirname(fileURLToPath(import.meta.url));
const reference=readFileSync(resolve(here,'w4.md'),'utf8');
const shared=reference.match(/<style>[\s\S]*?<\/style>/)[0];
const math=text=>`$$\n${text}\n$$`;
const note=text=>`<div class="note">${text}</div>`;
const slide=(title,body,kind='')=>`${kind?`<!-- _class: ${kind} -->\n\n`:''}## ${title}\n\n${body}`;
const styles=`<style>
section.news-opening{padding:44px 64px 65px}
section.news-opening h2{font-size:43px;margin-bottom:28px}
.news-opening-layout{display:grid;grid-template-columns:510px 1fr;gap:34px;align-items:center}
.news-opening-layout img{max-width:510px;max-height:350px;object-fit:contain;border:1px solid #e1e5e5}
.news-opening-layout p{margin:12px 0}
.news-credit{font-size:16px;color:#69777c;margin-top:12px}
.news-outlet{font-size:20px;color:#176d82;font-weight:700;letter-spacing:.04em}
section.news-opening .note{font-size:18px;margin-top:18px}
.news-links a{display:inline-block;font-size:21px;margin:5px 15px 0 0;color:#176d82;text-decoration:underline}
.news-kicker{font-size:19px;color:#176d82;font-weight:700;letter-spacing:.08em;margin-bottom:14px}
section.news-given{padding:42px 64px 70px}
section.news-given h2{font-size:40px;margin-bottom:18px}
section.news-given .katex-display{margin:18px 0;font-size:1.16em}
.news-question{font-weight:700;color:#176d82;font-size:29px;margin-top:16px}
section.news-formula .katex-display{font-size:1.25em;margin:20px 0}
section.news-formula h2{margin-bottom:20px}
section.news-answer{background:#edf5ef;border-top:7px solid #388065;padding:38px 64px 65px}
section.news-answer h2{font-size:40px;color:#2b624b;margin-bottom:14px}
section.news-answer .katex-display{font-size:1.1em;margin:14px 0}
.news-result{font-size:29px;font-weight:700;color:#215d45;border-top:2px solid #b7d1c2;padding-top:12px;margin-top:14px}
section.news-answer .note{font-size:18px;margin-top:12px}
</style>`;
for(const e of newsExamples){
  const sourceNotes=`<!-- Sources: ${e.article}\nData and thumbnail: ${e.primary}\nReported p=${e.p}. Classroom model n=${e.n}, independent trials, constant p. -->`;
  const slides=[
    slide(e.titleJa,`<div class="news-opening-layout"><div>\n\n[![width:510px](images/${e.thumbnail})](${e.primary})\n\n<div class="news-credit">${e.credit}</div>\n\n</div><div>\n\n<div class="news-outlet">${e.outlet}　${e.date}</div>\n\n${e.hook}\n\n${e.finding}\n\n<div class="news-links">\n\n[記事を読む](${e.article})　[元データ](${e.primary})\n\n</div></div></div>\n\n${note(e.context)}\n\n${sourceNotes}`,'news-opening'),
    slide(e.givenTitle,`<div class="news-kicker">GIVEN / 与えられた条件と問題</div>\n\n${e.variable}\n\n${e.setup}\n\n${math(e.values)}\n\n<div class="news-question">${e.question}</div>\n\n${note(e.assumption)}`,'news-given'),
    slide('公式に、ニュースの数値を代入',`<div class="news-kicker">FORMULA / 文字の公式、そして代入</div>\n\n${math(e.formula)}\n\n${math(e.substitution)}\n\n**${e.factors}**\n\n${note(e.takeaway)}`,'book-reference news-formula'),
    slide('計算と、答えの意味',`<div class="news-kicker">SOLUTION / 途中計算と答え</div>\n\n${math(e.calculation)}\n\n<div class="news-result">${e.result}</div>\n\n${e.interpretation}\n\n${note(e.caution)}`,'news-answer')
  ];
  writeFileSync(resolve(here,`news-${e.id}.md`),`---\nmarp: true\ntheme: default\nsize: 16:9\npaginate: true\nmath: katex\nfooter: '統計学B · Week 4 · ニュース例題'\n---\n\n${shared}\n${styles}\n\n${slides.join('\n\n---\n\n')}\n`);
  console.log(`${e.id}: ${slides.length} slides`);
}
