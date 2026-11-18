// Preserve the lecture's original order. [page, demo] makes the corresponding
// interactive review exercise available on that original lecture scene.
window.fullLecturePlans = {
  1: {
    total:58, sections:[[1,'モンティ・ホール'],[11,'推測統計・無作為抽出'],[25,'事象と確率'],[43,'確率の公理と加法'],[49,'条件付き確率と独立']],
    reveals:['2>3>4','12>13>14>15>16>17>18>19>20>21','27>28>29>30','38>39>40>41>42'],
    demos:[[5,1],[5,2],[21,3],[36,5],[55,9],[58,10],[58,12]]
  },
  2: {
    total:30, sections:[[1,'くじ・確率変数'],[10,'期待値'],[15,'ルーレット'],[19,'確率分布・AL']],
    demos:[[4,2],[11,4],[13,6],[18,7],[25,8],[30,10],[30,11]]
  },
  3: {
    total:38, sections:[[1,'NBA・成功の回数'],[7,'組合せと二項分布'],[23,'到着とポアソン分布'],[38,'AL']],
    challenges:[10,21,36],
    demos:[[8,3],[16,7],[20,9],[31,14],[35,18]]
  },
  4: {
    total:47, sections:[[1,'AIコンパニオン'],[9,'二項分布・復習'],[20,'クマの出現日とポアソン近似'],[33,'配送・ガチャ・検品'],[42,'ALと追加演習']],
    challenges:[3,6,16,22,25,33,36,39],
    demos:[[5,4],[8,6],[27,10],[32,11]]
  },
  5: {
    total:75, sections:[[1,'写真判定と1秒'],[9,'確率密度と面積'],[25,'正規分布と標準化'],[43,'上側確率表'],[60,'試験形式とAL']],
    challenges:[34,36,49,52,55,58,60,62],
    reveals:['37>38>39>40>41>42','45>46>47>48','63>64>65>66>67>68','69>70>71>72>73>74'],
    demos:[[4,3],[19,5],[24,7],[28,10],[42,12],[48,13],[57,14]]
  },
  6: {
    total:76, sections:[[1,'ガルトンボードと中心極限定理'],[19,'標本平均の標準化'],[34,'Curry・不偏分散・t'],[62,'t分布表'],[70,'χ²とAL']],
    challenges:[32,51,56,68], reveals:['8>9>10>11>12>13','52>53>54>55','57>58>59'],
    demos:[[1,2],[13,3],[63,14],[74,17]]
  },
  7: {
    total:82, sections:[[1,'1秒チャレンジ'],[7,'標本平均と不偏分散'],[31,'正規分布表'],[52,'3つの標準化'],[70,'AL'],[73,'任意：反応速度ゲーム']],
    challenges:[21,47,75], reveals:['15>16>17>18','22>23>24>25','48>49>50','54>55>56>57>58','61>62>63>64','65>66>67>68','76>77>78>79>80>81>82'],
    demos:[[2,2],[18,6],[51,14],[69,13]]
  },
  8: {
    total:55, sections:[[1,'ニュース：世界から日本へ'],[11,'前回の復習とマグロ'],[25,'不偏性・有効性・一致性'],[40,'母平均と母分散の点推定'],[52,'20分クイズとAL']],
    challenges:[23,48,52], reveals:['26>27>28>29','35>36>37','43>44>45>46','49>50'],
    demos:[[3,2],[18,6],[37,12],[39,13],[46,15]]
  },
  10: {
    total:31, sections:[[1,'売場のマグロ・区間の選択'],[7,'母分散が既知：Z'],[13,'母分散が未知：t'],[21,'母分散：χ²'],[28,'結果の説明とAL']],
    challenges:[10,18,25], demos:[[2,1],[5,2],[11,5],[19,11],[26,16]]
  },
  11: {
    total:38, sections:[[1,'紅茶と仮説検定'],[8,'仮説・有意水準・棄却域'],[15,'母平均の検定'],[20,'p値と信頼区間'],[27,'母比率の差とAL']],
    challenges:[24,33], demos:[[2,1],[14,3],[19,6],[22,7],[31,11]]
  },
  12: {
    total:35, sections:[[1,'Galton・NBAの散布図'],[7,'回帰式・最小二乗法'],[14,'得点の予測'],[19,'Excel出力'],[30,'自分のデータとAL']],
    challenges:[17,28], demos:[[6,2],[12,6],[15,7],[21,10],[26,11]]
  },
  13: {
    total:43, sections:[[1,'結果の解釈'],[5,'単位・係数・モデルの選択'],[15,'疑似相関と母集団'],[23,'総合復習と練習問題'],[42,'期末試験']],
    challenges:[27,32,38], demos:[[8,3],[10,4],[12,5],[13,6],[14,7],[17,8],[24,13],[35,11]]
  }
};

window.completeLecture = (week, review) => {
  const plan = window.fullLecturePlans[week];
  if (!plan) return review;
  const nativeSlides = review.sections.flatMap(section => section.items);
  const insertions = new Map();
  for (const [page, demo] of plan.demos) {
    const items = insertions.get(page) || [];
    items.push(nativeSlides[demo - 1]);
    insertions.set(page, items);
  }
  const sequences = new Map((plan.reveals || []).map(sequence => [parseInt(sequence, 10), sequence]));
  const sections = plan.sections.map(([first, title], i) => {
    const end = (plan.sections[i+1]?.[0] || plan.total + 1) - 1;
    const items = [];
    for (let page = first; page <= end; page++) {
      const pages = (sequences.get(page) || String(page)).split('>').map(Number);
      const exercises = pages.flatMap(original => insertions.get(original) || []);
      const worked = Boolean(plan.challenges?.includes(page - 1));
      items.push({pages,exercises,worked});
      page = pages.at(-1);
    }
    return {title, items};
  });
  return {...review, sections, challenges:plan.challenges || []};
};
