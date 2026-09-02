---
marp: true
theme: uncover
headingDivider: 3
# footer: 統計学入門 | Intro to Statistics ![width:30px](images/w9/yoh%20with%20globe.png)
paginate: true
---


<style>
section { font-family: 'Ubuntu Condensed', sans-serif; }

small {font-size:0.6em}
medium {font-size:1.2em}
large {font-size:2em}
xlarge {font-size:4em}
gray {padding:20px;background-color:whitesmoke;font-weight:800;line-height:2.5}
plum {padding:20px;background-color:plum;line-height:3;font-weight:800}
t1 { font-size:4em;font-weight:100;line-height:1}
l { font-size:2em;font-weight:100;line-height:1.5}
xl { font-size:2.2em;font-weight:100;line-height:1.5}
xxl { font-size:4em;font-weight:100;line-height:1.5}
xxxl { font-size:8em;font-weight:100;line-height:1.5}
xls { font-size:1.5em;font-weight:100;line-height:1}

section {font-size:2em;font-weight:300;}
left {text-align:left;}
latex {font-size:2em;color:#444;line-height:1;font-weight:lighter}

.small {font-size:0.6em}
.large {font-size:2em}
.gray {padding:20px;background-color:whitesmoke;}
green {padding:20px;background-color:#5D8D4F;}
plum {padding:20px;background-color:plum;}
.plum {padding:20px;background-color:plum;}
red {color:red}
white {color:white}



red {color:red;}
center {width:600px; margin: 0 auto;}

hr {
  border: none;
  border-top: 2px dotted #444;
  width: 80%;
  margin: 40px auto;
  display: block;
}

</style>

![bg opacity:.1](image.png)


<xlarge>

統計学B

</xlarge>

Week 8

# 
標本不偏分散 p126


<!-- show the forumula with the hat and sigma squared to the x -->
<xl>

$\hat{\sigma}^2_x=\frac{1}{n-1}\sum(X_i-\bar{X})^2$

#

![alt text](image.png)
https://www.espn.com/nba/player/_/id/3975/stephen-curry

#
![width:500](image-1.png)


## Steph Curry's Last 5 Games

| Game | Score |
|------|-------|
| 1 | 9 |
| 2 | 49 |
| 3 | 46 |
| 4 | 11 |
| 5 | 28 |

#

<xl>

$\bar{X} = \frac{9+49+46+11+28}{5} = 28.6$

</xl>

#


$$\begin{align}
\hat{\sigma}^2_x &= \frac{1}{n-1}\sum(X_i-\bar{X})^2 \\
&= \frac{(9-28.6)^2+(49-28.6)^2+(46-28.6)^2+(11-28.6)^2+(28-28.6)^2}{4} \\
&= \frac{384.16+416.16+302.76+309.76+0.36}{4} \\
&= \frac{1413.2}{4} = 353.3
\end{align}$$

#
| Game | Score (Xi) | Mean (X̄) | Xi − X̄ | (Xi − X̄)² |
|------|-----------:|---------:|--------:|----------:|
| 1 | 9 | 28.6 | -19.6 | 384.16 |
| 2 | 49 | 28.6 | 20.4 | 416.16 |
| 3 | 46 | 28.6 | 17.4 | 302.76 |
| 4 | 11 | 28.6 | -17.6 | 309.76 |
| 5 | 28 | 28.6 | -0.6 | 0.36 |
| **Sum** | 142 |  |  | **1413.2** |
| **Sample variance** (1/(n−1) Σ) |  |  |  | **353.3** |



#

In other words, Steph Curry's sample variance over the last 5 games is 353.3 points squared.



# クラス内活動：好きな選手の標本分散を計算しよう

## ステップ1：選手を選ぶ

[ESPN](https://www.espn.com/nba/stats)から好きなNBA選手の過去5試合のスコアデータを探してください。

**選手名：** ________________

| Game | Score |
|------|-------|
| 1 | |
| 2 | |
| 3 | |
| 4 | |
| 5 | |

## ステップ2：平均値を計算する

<xl>

$$\bar{X} = \frac{}{5} = $$

</xl>

## ステップ3：分散表を完成させる

| Game | Score (Xi) | Mean (X̄) | Xi − X̄ | (Xi − X̄)² |
|------|-----------:|---------:|--------:|----------:|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |
| **合計** | | | | |


## ステップ4：標本分散を計算する

$$\hat{\sigma}^2_x = \frac{1}{n-1}\sum(X_i-\bar{X})^2 = \frac{}{4} = $$

**結果：** 標本分散は **______** ポイント²


# t分布

##
![bg left width:300](images/w10/gosset.jpg)

William Sealy Gosset (1876-1937)
- Irish statistician
- Worked at Guinness brewery
- Published under pen name "Student"
- Developed t-distribution for small samples

## なぜt分布が必要？

<medium>

標本サイズが小さいとき、
正規分布は使えない

</medium>

<hr>

- Z分布：母集団の標準偏差σを知っているとき
- <red>t分布：母集団の標準偏差σを知らないとき



## t値の計算 p125

<xl>

$$t = \frac{\bar{X} - \mu}{\sqrt{\hat{\sigma}^2_x/n}}$$

</xl>

- $\bar{X}$ は標本平均
- $\mu$ は母平均（帰無仮説の値）
- $\hat{\sigma}^2_x$ は標本不偏分散（$\displaystyle\hat{\sigma}^2_x=\frac{1}{n-1}\sum(X_i-\bar{X})^2$）
- $\sqrt{\hat{\sigma}^2_x/n}$ は標本平均の標準誤差（= $s/\sqrt{n}$、ここで $s=\sqrt{\hat{\sigma}^2_x}$）
- $n$ は標本サイズ

##

Now let's look at Steph Curry's example again.🏀

## 95% 信頼区間（DF = 4）

<medium>

t分布表から DF=4 のとき、
95% CI の t値は <red><b>2.776</b>

</medium>

<hr>

つまり、帰無仮説を棄却する境界値は **±2.776**

| α | 0.10 | 0.05 | 0.01 |
|---|---|---|---|
| DF=4 | 2.132 | <red>2.776</red> | 4.604 |
| DF=5 | 2.015 | 2.571 | 4.032 |
| DF=10 | 1.812 | 2.228 | 3.169 |
| DF=30 | 1.697 | 2.042 | 2.750 |
| DF=∞ | 1.645 | 1.960 | 2.576 |


# Z検定 vs t検定：Steph Curryの例

## Z検定 (Z-test)
- 母集団の標準偏差 σ を知っているとき
- 標本サイズが大きいとき (n > 30)

## t検定 (t-test)
- 母集団の標準偏差 σ を知らないとき
- 標本サイズが小さいとき (n < 30) ← Steph Curryの例

## Steph Curryのt値を計算
- 帰無仮説：Steph Curryのシーズン平均スコアは μ = 27.4 ポイント

標本データ (過去5試合)：$\bar{X} = 28.6$, $\hat{\sigma}^2_x = 353.3$

##

<medium>

$$t = \frac{\bar{X} - \mu}{\sqrt{\hat{\sigma}^2_x/n}} = \frac{28.6 - 27.4}{\sqrt{353.3/5}}$$

<br>

$$t = \frac{1.2}{\sqrt{70.66}} = \frac{1.2}{8.41} = 0.143$$

</medium>

## 結論
- 計算されたt値：**0.143**
- 自由度：**4** (n − 1 = 5 − 1)
- 95% CI の臨界値：**±2.776**
- 0.143 < 2.776 なので帰無仮説は**棄却できない**

帰無仮説 $H_0: \mu = 27.4$  
計算されたt値は**0.143**で、自由度4における95%信頼区間の臨界値±2.776より小さいため、帰無仮説は棄却できない。Steph Curryの真の平均スコアが27.4ではないとは統計的に言えない。

#


Now you try it! 


##

もう一度、t値の公式を確認しよう：

<xl>

$$t = \frac{\bar{X} - \mu}{\sqrt{\hat{\sigma}^2_x/n}}$$

</xl>

- $\bar{X}$：自分の選手の「過去5試合の平均スコア」
- $\mu$：シーズン平均スコア（仮定する母平均）
- $\hat{\sigma}^2_x$：さっき計算した標本不偏分散
- $n = 5$

#
自分の値を代入して、ノートに書こう：

- $\bar{X} = \_\_\_\_\_$
- $\mu = \_\_\_\_\_$
- $\hat{\sigma}^2_x = \_\_\_\_\_$
- $t = \dfrac{\bar{X} - \mu}{\sqrt{\hat{\sigma}^2_x/5}} = \_\_\_\_\_$


##

t値からどう結論を出すか？

- この活動では、いつも **n = 5 → 自由度 df = 4**
- 95% 信頼水準（両側検定）の臨界値は **±2.776**

<gray>

- $|t| > 2.776$ のとき  
  → 帰無仮説 $H_0:\mu=\text{シーズン平均}$ を **棄却できる**

- $|t| \le 2.776$ のとき  
  → 帰無仮説を **棄却できない**

</gray>

#
ノートにまとめよう：

- 計算した $t$ 値：＿＿＿＿  
- 結論（日本語で一文）：

「この5試合の平均スコアは、シーズン平均と比べて  
統計的に（異なると言える／異なるとは言えない）。」



# カイ二乗分布

##
![bg left width:600](images/w9/karl.jpg)


Karl Pearson (1857-1936)
- English mathematician
- big boss of stats
- but... also one of the fathers of eugenics 「優生学」

## 「優生学」
> Eugenics is the scientifically erroneous and immoral theory of “racial improvement” and “planned breeding,” which gained popularity during the early 20th century. Eugenicists worldwide believed that they could perfect human beings and eliminate so-called social ills through genetics and heredity.

優生学とは、20世紀初頭に人気を博した「人種改良」と「計画的繁殖」に関する科学的に誤った不道徳な理論です。 世界中の優生学者は、遺伝学と遺伝によって人間を完璧にし、いわゆる社会的悪を排除できると信じていました。


### カイ二乗分布の定義

- $𝜒^2$ 分布　（chi-squared distribution）
  - 自由度𝜈のカイ二乗分布
  - 標準正規分布𝑁(0,1)にしたがう
    独立な𝜈個の確率変数𝑋_𝑖の
    平方和に関する確率分布
    - $𝜒^2 (𝜈)~𝑋_1^2+𝑋_2^2+𝑋_3^2+…+𝑋_𝜈^2$
  - <red>平均値		𝜈	自由度と等しい
  - <red>分散		2𝜈	自由度の2倍
  - 自由度が小さいとき左右非対称
    - 自由度が大きくなるにつれて左右対称に変化
  - 自由度の値が大きいときに<red>正規分布に近似


### 自由度 degree of freedom

<medium>

$n-1$

</medium>

- 自由に動くことのできる変数の数
- 与えられた等式（条件）の分だけ減る

  - 例	データ（4, x, 1, 1）	xは未知
    条件	平均値は2
    ⇒　4+𝑥+1+1=2×4
  - データの個数n個に
平均値を与える（条件1つ）と
データ<red>n-1</red>個がわかれば、すべてのデータがわかる
（残りの1つは必然的に決まる）

### 自由度10のカイ二乗分布

![width:900](images/w9/chi1.png)

### 自由度10～50のカイ二乗分布

![width:900](images/w9/chi2.png)

### 平方和の分解

![width:900](images/w9/chi3.png)

##

<small>
教科書ではわかりにくいので…
</small>

<hr>
<xl>

カイ二乗分析はなんで使うの？

##

![width:250](images/w9/image-5.png)
<hr>
<xl>

$60:40$

</xl>

🤷🏻男子：女子👩🏻‍🎓

##
本当かな？では、無作為で20人の学生を抽出したら…

<xl>
🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻<br>
🤷🏻🤷🏻‍♀️🤷🏻‍♀️🤷🏻‍♀️🤷🏻‍♀️🤷🏻‍♀️🤷🏻‍♀️🤷🏻‍♀️🤷🏻‍♀️🤷🏻‍♀️<br>
<hr>

$11:9$

</xl>

##
本当かな？では、無作為で20人の学生を抽出したら…

<xl>
🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻<br>
🤷🏻🤷🏻🤷🏻‍♀️🤷🏻‍♀️🤷🏻‍♀️🤷🏻‍♀️🤷🏻‍♀️🤷🏻‍♀️🤷🏻‍♀️🤷🏻‍♀️<br>
<hr>

$12:8$

</xl>

##
本当かな？では、無作為で20人の学生を抽出したら…

<xl>
🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻<br>
🤷🏻🤷🏻🤷🏻🤷🏻‍♀️🤷🏻‍♀️🤷🏻‍♀️🤷🏻‍♀️🤷🏻‍♀️🤷🏻‍♀️🤷🏻‍♀️<br>
<hr>

$13:7$

</xl>

##
本当かな？では、無作為で20人の学生を抽出したら…

<xl>
🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻<br>
🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻‍♀️🤷🏻‍♀️🤷🏻‍♀️🤷🏻‍♀️🤷🏻‍♀️🤷🏻‍♀️<br>
<hr>

$14:6$

</xl>

##
本当かな？では、無作為で20人の学生を抽出したら…

<xl>
🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻<br>
🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻🤷🏻‍♀️🤷🏻‍♀️🤷🏻‍♀️🤷🏻‍♀️🤷🏻‍♀️<br>
<hr>

$15:5$

</xl>

##

なんとなく、直感（gut feeling）では解決できない…

<xl>

カイ二乗検定

</xl>
Chi Squared Test
<hr>

<xl>
<b>集めたデータ　↔︎　予測データ</b>

##

<xl>

$H_0$ 帰無仮説＝$60:40$

</xl>
<hr>

帰無仮説を棄却（ききゃく）できるでしょうか?
Can we reject the null hypthesis?

##

In other words... 

<medium>

このクラスは、母集団（全校の比率）と比べて、有意に、
そして統計的に異なると言えるのか？

</medium>

Is this class significantly, and statistically different from the population?


##

ではカイ二乗を求めよう：

<xl>

$\chi^2=\sum\frac{(O_i-E_i)^2}{E_i}$

</xl>

- $\chi^2$ はカイ二乗検定統計量
- $O_i$ はカテゴリ $i$ の観測度数 (Observed)
- $E_i$ はカテゴリ $i$ の期待度数 (Expected)


## 自由度は？

<medium>

$n-1$

</medium>

<hr>

この場合の「n」はカテゴリーの数{男子,女子}が２なので<red><b>自由度は１</b></red>である

Degree of Freedom (DF) = 2-1 = 1


##

![bg fit](images/w9/image-3.png)

#

![alt text](images/w9/image-6.png)

[Here](https://docs.google.com/spreadsheets/d/1VOAvzr1cxXftwnLYJQCR94gZRTPtK60kzjA8Ej0A5Xw/edit?gid=1412999600#gid=1412999600)



##

![width:800](images/w9/inclass2.jpg)
<hr>

従って、帰無仮説は棄却　<medium>できる・できない

##

![Alt text](images/w9/koala1.png)

<hr>

<medium>

コアラのマーチ「激レアキャラ」は都市伝説？

</medium>

３６５種類の絵柄は全て同じ数だけ作ってると言われている。本当かな？

##


https://www.lotte.co.jp/products/brand/koala/book/

## ご当地コアラ(51)

![bg right width:250](<images/w9/koala gotouchi.jpg>)


- 51種類
- 出る確率は$\frac{51}{365}$or <l><red>$14\%$

## スポーツコアラ(47)

![bg right width:290](images/w9/koala3.jpg)

- 47種類
- 出る確率は$\frac{47}{365}$or <l><red>$13\%$

## おあそび＆おでかけ（29種類）

![bg right width:290](images/w9/image-2.png)

- 29種類
- 出る確率は$\frac{29}{365}$or <l><red>$8\%$

## お仕事（28種類）

![bg right width:410](images/w9/koala2.jpg)

- 28種類
- 出る確率は$\frac{28}{365}$or <l><red>$8\%$

##

$H_0$ 帰無仮説


コアラの<b><red>ご当地・スポーツ・仕事・おあそび＆おでかけ・その他</red></b>の比率は
<xl>$51:47:29:28:210$</xl>
<xl><red>14% : 13% : 8% : 8% : 58%</xl>
である
<hr>

帰無仮説を棄却できるでしょうか?
Can we reject the null hypthesis?

- 自由度(DF)：$5-1=4$

## $\chi^2=\sum\frac{(O_i-E_i)^2}{E_i}$

![alt text](images/w9/image-4.png)

[Enter!](https://docs.google.com/spreadsheets/d/1VOAvzr1cxXftwnLYJQCR94gZRTPtK60kzjA8Ej0A5Xw/edit?usp=sharing)

##

![bg fit](images/w9/image-3.png)

