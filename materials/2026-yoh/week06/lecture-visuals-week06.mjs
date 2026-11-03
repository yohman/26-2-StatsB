import {writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

export function heightPair(here){
 const X=x=>180+(x-150)/20*760;
 const rows=[{y:105,x:155,c:'#176d82',z:'−1'},{y:270,x:165,c:'#b96930',z:'+1'}];
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 420" role="img" aria-label="架空の2人の身長155cmと165cm。母平均160cm、母標準偏差5cm。ずれはマイナス5cmとプラス5cm。"><g font-family="Arial,Hiragino Sans,sans-serif" fill="#222"><text x="${X(160)}" y="29" text-anchor="middle" font-size="23">母平均160cm</text><path d="M${X(160)} 40V330" stroke="#777" stroke-dasharray="6 5"/>${rows.map(({y,x,c,z},i)=>`<circle cx="65" cy="${y-12}" r="18" fill="${c}"/><path d="M40 ${y+40}q0-35 25-35t25 35" stroke="${c}" stroke-width="12" fill="none"/><text x="65" y="${y+77}" text-anchor="middle" font-size="20">学生${i+1}</text><path d="M${X(150)} ${y+20}H${X(170)}" stroke="#ddd"/><circle cx="${X(x)}" cy="${y+20}" r="10" fill="${c}"/><text x="${X(x)}" y="${y-4}" text-anchor="middle" fill="${c}" font-size="29">${x}cm</text><path d="M${X(Math.min(x,160))} ${y+61}H${X(Math.max(x,160))} M${X(x)} ${y+54}v14 M${X(160)} ${y+54}v14" stroke="${c}" stroke-width="2"/><text x="${(X(x)+X(160))/2}" y="${y+90}" text-anchor="middle" fill="${c}" font-size="22">${x-160}cm ／ z=${z}</text>`).join('')}${[150,155,160,165,170].map(v=>`<text x="${X(v)}" y="398" text-anchor="middle" font-size="21">${v}</text>`).join('')}<text x="1040" y="398" font-size="20">cm</text></g></svg>`;
 writeFileSync(resolve(here,'images/student-height-pair.svg'),svg);return '\n\n![width:1060px](images/student-height-pair.svg)\n\n';
}

export function decompositionGraphic(here){
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 330" role="img" aria-label="身長160、165、170cm。母平均160、標本平均165。標準化した平方和5は、標本内2と平均のずれ3に分かれる。"><g font-family="Arial,Hiragino Sans,sans-serif" font-size="24" fill="#222"><text x="40" y="40">同じ3人：160、165、170cm ／ 母分散25cm²</text><text x="40" y="80">母平均160cm ／ 標本平均165cm</text><rect x="160" y="120" width="300" height="85" fill="#176d82"/><rect x="460" y="120" width="450" height="85" fill="#b96930"/><g fill="white" font-size="36" text-anchor="middle"><text x="310" y="175">2</text><text x="685" y="175">3</text></g><text x="310" y="244" text-anchor="middle" fill="#176d82">標本内のずれ</text><text x="685" y="244" text-anchor="middle" fill="#b96930">標本平均のずれ</text><text x="950" y="175" font-size="37">＝5</text><text x="40" y="306">自由度も、全体3 ＝ 標本内2 ＋ 平均の部分1</text></g></svg>`;
 writeFileSync(resolve(here,'images/chi-decomposition-parts.svg'),svg);return '\n\n![width:1060px](images/chi-decomposition-parts.svg)\n\n';
}
