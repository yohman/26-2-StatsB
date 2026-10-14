// Shared answer composition for the lecture and optional practice deck.
export const walkthroughStyle = `
section.worked-answer {font-size:25px; padding:32px 60px 70px;}
section.worked-answer h2 {font-size:38px; margin-bottom:10px;}
.worked-label {font-size:20px; font-weight:800; color:#2b624b; margin:4px 0;}
.worked-given {font-size:23px; margin:0 0 8px;}
.worked-columns {display:grid; grid-template-columns:1fr 1.15fr; gap:26px; align-items:start;}
.worked-columns > div + div {border-left:2px solid #b7d1c2; padding-left:26px;}
section.worked-answer .katex-display {font-size:.83em; margin:8px 0; text-align:left;}
.worked-result {border-top:2px solid #b7d1c2; margin-top:9px; padding-top:6px;}
.worked-result p {font-size:26px; color:#215d45; font-weight:700; margin:4px 0;}
section.worked-answer .note {font-size:17px; margin-top:6px;}
section.worked-answer .note a {font-size:17px; padding:0; background:none; color:#176d82; text-decoration:underline;}
`;
export function walkthrough({title,given,formula,substitution,result,note=''}) {
  return `<!-- _class: challenge-check worked-answer -->

## ${title}

<div class="worked-label">① 与えられた条件</div>
<div class="worked-given">

${given}

</div>
<div class="worked-columns"><div>
<div class="worked-label">② 公式（文字のまま）</div>

$$
${formula}
$$

</div><div>
<div class="worked-label">③ 数値を代入・計算</div>

$$
${substitution}
$$

</div></div>
<div class="worked-result">
<div class="worked-label">④ 答え・意味</div>

${result}

</div>
${note ? `<div class="note">${note}</div>` : ''}`;
}
