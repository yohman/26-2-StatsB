---
marp: true
theme: uncover
headingDivider: 3
# footer: 統計学入門 | Intro to Statistics ![width:30px](../09%20母集団の信頼区間/images/w9/yoh%20with%20globe.png)
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

gray { padding: 20px; background-color: whitesmoke; font-weight: 800; line-height: 2.5; }
.columns {
  display: flex;
  justify-content: space-between;
}
.column {
  width: 48%; /* Adjust width as needed */
}

</style>

![bg opacity:.1](image.png)


<xlarge>

統計学B

</xlarge>

Week 10

# 2章3節 母平均の区間推定

Confidence interval estimation for the population mean
<hr>

![width:200](<../09%20母集団の信頼区間/images/tie.png>)



# 
母平均の信頼区間の式p133

<hr>
<!-- formula -->

<medium>

$\left[ \bar{x} - t_{\alpha}(n-1)\sqrt{\frac{\hat{\sigma}_{\bar{x}}^{2}}{n}} \; , \; \bar{x} + t_{\alpha}(n-1)\sqrt{\frac{\hat{\sigma}_{\bar{x}}^{2}}{n}} \right]$

</medium>


###

![Alt text](../09%20母集団の信頼区間/images/eq2.jpg)

###

![Alt text](../09%20母集団の信頼区間/images/eq3.jpg)




## 母平均の区間推定に関する計算

#

<!-- formula -->

<medium>

$\left[ \bar{x} - t_{\alpha}(n-1)\sqrt{\frac{\hat{\sigma}_{\bar{x}}^{2}}{n}} \; , \; \bar{x} + t_{\alpha}(n-1)\sqrt{\frac{\hat{\sigma}_{\bar{x}}^{2}}{n}} \right]$

</medium>

すなわち

<large>

$\bar{x} \pm t_{\alpha}(n-1)\sqrt{\frac{\hat{\sigma}_{\bar{x}}^{2}}{n}}$

</large>

#
![width:600](<../09%20母集団の信頼区間/images/reidai 9-1.jpg>)

#
![width:900](<../09%20母集団の信頼区間/images/reidai 9-1.jpg>)

###
ポイントカード所有者2万人の母集団から50人を無作為抽出

<hr>
標本数

<xl><b>50</b></xl>

標本平均
<xl><b>1.98</b></xl>

標本分散
<xl><b>2.6196</b></xl>

母平均の95% 信頼区間を求める

##

![bg left:35% width:400](<../09%20母集団の信頼区間/images/reidai9-1 legend.jpg>)

<medium>

$\textcolor{red}{\bar{\chi}}\pm t_{0.025}(n-1)\sqrt{\frac{{\hat{\sigma_x^2}}}{n}}$

</medium>

<hr>

❶平均値

##

![bg left:35% width:400](<../09%20母集団の信頼区間/images/reidai9-1 legend.jpg>)

<medium>

$\textcolor{green}{1.98}\pm \textcolor{red}{t_{0.025}(n-1)}\sqrt{\frac{{\hat{\sigma_x^2}}}{n}}$

</medium>

<hr>

❷ 95%信頼区間の場合：$\frac{1-0.95}{2}=\frac{0.05}{2}=0.025$

$\textcolor{red}{t_{0.025}(49)}=2.0096$ 

##

![bg left:35% width:400](<../09%20母集団の信頼区間/images/reidai9-1 legend.jpg>)

<medium>

$\textcolor{green}{1.98}\pm \textcolor{green}{2.0096}\sqrt{\frac{\textcolor{red}{\hat{\sigma_x^2}}}{n}}$

</medium>

<hr>

❸標本不偏分散（赤い部分）を求める

これが結構厄介！

##

![bg left:30% width:400](<../09%20母集団の信頼区間/images/reidai9-1 legend.jpg>)
p132

$\textcolor{red}{\hat{\sigma_x^2}}=\frac{1}{n-1}\Sigma(x_i-\bar{x})^2=\frac{n}{n-1}\frac{1}{n}\Sigma(x_i-\bar{x})^2=\frac{n}{n-1}S_x^2$

<medium>

↓

$\textcolor{red}{\hat{\sigma_x^2}}=\frac{n}{n-1}S_x^2=\frac{50}{49}\times2.6196$

↓

$\textcolor{red}{\hat{\sigma_x^2}}=2.6731$

##

![bg left:35% width:400](<../09%20母集団の信頼区間/images/reidai9-1 legend.jpg>)

<medium>

$\textcolor{green}{1.98}\pm \textcolor{green}{2.0096}\sqrt{\frac{\textcolor{green}{2.6731}}{\textcolor{red}{50}}}$

</medium>

<hr>

❹ $n$を代入して計算！

${1.98\pm 0.46466}$

$=(1.98-0.46466,1.98+0.46466)$

<medium>

$\approx(1.52,2.44)$

</medium>

## 信頼区間を計算してみよう

### 手順：

1. Google Sheets の寿司打スコア一覧から、**ランダムに5人分**のスコアを選ぶ。

2. 次の統計量を計算する：

- 平均（$\bar{x}$）
- 分散（$\hat{\sigma}_{\bar{x}}^{2}$）：  
  $\hat{\sigma}_{\bar{x}}^{2} = \frac{1}{n - 1} \sum_{i=1}^{n} (x_i - \bar{x})^2$
- 標準誤差：$\sqrt{\frac{\hat{\sigma}_{\bar{x}}^{2}}{n}}$
- t値：$t_{\alpha}(n - 1)$（教科書の表を参照）

3. 信頼区間を計算する：

$\bar{x} \pm t_{\alpha}(n-1)\sqrt{\frac{\hat{\sigma}_{\bar{x}}^{2}}{n}}$

## 結果報告 Slack に投稿！

- 選んだ5人の名前：
  - ①＿＿＿＿＿＿＿
  - ②＿＿＿＿＿＿＿
  - ③＿＿＿＿＿＿＿
  - ④＿＿＿＿＿＿＿
  - ⑤＿＿＿＿＿＿＿

- 平均（$\bar{x}$）：＿＿＿＿＿＿  
- 分散（$\hat{\sigma}_{\bar{x}}^{2}$）：＿＿＿＿＿＿  
- 信頼区間（95%）：


= （＿＿＿＿＿＿ , ＿＿＿＿＿＿）

※ 小数第2位まで書いてください。


# Let's practice

### Yoh's class 期末試験

<hr>
標本数

<xl><b>5</b></xl>

標本平均
<xl><b>75</b></xl>

標本分散
<xl><b>10</b></xl>

母平均の95% 信頼区間を求める

##

<div class="columns">
<div class="column gray">
標本数

<xl><b>5</b></xl>

標本平均
<xl><b>75</b></xl>

標本分散
<xl><b>10</b></xl>

母平均の95% 信頼区間を求める

</div>
<div class="column">

<medium>

$\textcolor{red}{\bar{\chi}}\pm t_{0.025}(n-1)\sqrt{\frac{{\hat{\sigma_x^2}}}{n}}$

</medium>

<hr>

❶平均値

</div>
</div>

##

<div class="columns">
<div class="column gray">
標本数

<xl><b>5</b></xl>

標本平均
<xl><b>75</b></xl>

標本分散
<xl><b>10</b></xl>

母平均の95% 信頼区間を求める

</div>
<div class="column">


<medium>

$\textcolor{green}{75}\pm \textcolor{red}{t_{0.025}(n-1)}\sqrt{\frac{{\hat{\sigma_x^2}}}{n}}$

</medium>

<hr>

❷ 95%信頼区間の場合：

<br>
<medium>

$\frac{1-0.95}{2}=\frac{0.05}{2}=0.025$

$\textcolor{red}{t_{0.025}(4)}=2.7764$ 

</medium>

</div>
</div>

##

<div class="columns">
<div class="column gray">
標本数

<xl><b>5</b></xl>

標本平均
<xl><b>75</b></xl>

標本分散
<xl><b>10</b></xl>

母平均の95% 信頼区間を求める

</div>
<div class="column">

<medium>

$\textcolor{green}{75}\pm \textcolor{green}{2.7764}\sqrt{\frac{\textcolor{red}{\hat{\sigma_x^2}}}{n}}$

</medium>

<hr>

❸標本不偏分散（赤い部分）を求める

これが結構厄介！


</div>
</div>

##

<div class="columns">
<div class="column gray">
標本数

<xl><b>5</b></xl>

標本平均
<xl><b>75</b></xl>

標本分散
<xl><b>10</b></xl>

母平均の95% 信頼区間を求める

</div>
<div class="column">



<medium>

$\textcolor{red}{\hat{\sigma_x^2}}=\frac{n}{n-1}S_x^2$

↓

$\textcolor{red}{\hat{\sigma_x^2}}=\frac{5}{4}\times10$

↓

$\textcolor{red}{\hat{\sigma_x^2}}=12.5$



</div>
</div>

##

<div class="columns">
<div class="column gray">
標本数

<xl><b>5</b></xl>

標本平均
<xl><b>75</b></xl>

標本分散
<xl><b>10</b></xl>

母平均の95% 信頼区間を求める

</div>
<div class="column">


<medium>

$\textcolor{green}{75}\pm \textcolor{green}{2.7764}\sqrt{\frac{\textcolor{green}{12.5}}{\textcolor{red}{5}}}$

</medium>

<hr>

❹ $n$を代入して計算！

<medium>

${75\pm 4.39}$

$=(75-4.39,75+4.39)$


$\approx(70.61, 79.39)$

</medium>



</div>
</div>





#

[![alt text](../Last%20year/Week12%20母分散の区間推定/image.png)](https://en.wikipedia.org/wiki/Blohm_%26_Voss_BV_141)

# Ch 9 母分散の区間推定

Confidence interval estimation for variance
<hr>

Trying to estimate <medium>$\sigma^2$</medium> from <medium>$s^2$</medium>

## （復習）区間推定の考え方

- 区間推定
  - 推定量の確率分布における区間を用いて母数を推定
  - ある区間内に母数が含まれることを信頼度で示す

- 推定した区間
  - 信頼係数100(1−𝛼)%の信頼区間
    - <red>信頼係数</red>	confidence coefficient
    - <red>信頼区間</red>	conidence interval
  - 信頼係数95%の信頼区間のことを95%信頼区間ともいう
  - 信頼区間は（<red>下限値，上限値</red>）で表す

## （復讐）母平均の区間推定

![Alt text](../Last%20year/Week11%20母平均の区間推定/images/eq2.jpg)

## What is 分散？

![width:400](../Week11%20母平均の区間推定/images/tuna.webp) ![width:400](<images/many fish.jpg>)

## Let's see it in Python

![width:1000](<../Last year/Week12 母分散の区間推定/images/python fish variance.png>)

##

しかし...標本分散の標本分布は正規*ではありません*

え？どういうこと？

<hr>

![width:800](<../Last year/Week12 母分散の区間推定/images/sample variance distributions.png>)

##

なので、母分散の推定をする時に使う分布はt分布ではなく、
<xl>
カイ二乗分布を使う
</xl>

##

まず…母分散の区間推定に使う分布はカイ二乗分布...覚えてる？

##

![width:1000](../Last%20year/Week12%20母分散の区間推定/images/chi1.jpg)

##

![width:1000](../Last%20year/Week12%20母分散の区間推定/images/chi2.jpg)

##

![width:1000](../Last%20year/Week12%20母分散の区間推定/images/chi3.jpg)

## 

ピンとこないな〜

## 病院滞在日数

<medium>

<pre>

Y-axis: Patients  
^
|           *
|        *
|     *
|   *
| *
+------------------------------> X-axis: Days in Hospital
 0    3     7     14     30     40

</pre>

</medium>

## 収入

<medium>

<pre>

Y-axis: Frequency  
^
|           *
|         *
|      *
|    *
|  *
| *
+-----------------------------> X-axis: Income (万円)
  0     200     400     800    1500

</pre>

</medium>

## 車の保険

<medium>

<pre>

Y-axis: Number of Claims  
^
|           *
|        *
|     *
|   *
| *
+-------------------------------> X-axis: Claim Amount (万円)
 0    20     50     100    200

</pre>

</medium>

#

![width:800](image.png)

Page 135

#

![width:800](image-1.png)

Page 136



## カイ二乗分布表をつかう

![width:900](<../Last year/Week12 母分散の区間推定/images/chi table1.jpg>)

## カイ二乗分布表をつかう

![width:900](<../Last year/Week12 母分散の区間推定/images/chi table2.jpg>)

## やってみよう

# あるクラスの反応時間を測定したところ：

<center>

- 標本サイズ：$n = 6$
- 標本平均：$\bar{X} = 0.52$ 秒
- **標本不偏分散**：$\hat{\sigma}^2 = 4$

<hr>

母分散 $\sigma^2$ の 95% 信頼区間を求めよ。

# Step 1：偏差二乗和の計算

![width:400](image-2.png)

標本不偏分散の定義：

$$
\hat{\sigma}^2 = \frac{1}{n-1}\sum (x_i - \bar{x})^2
$$

したがって：

$$
\sum (x_i - \bar{x})^2 = \hat{\sigma}^2 (n-1)
$$

$$
= 4 \times 5 = 20
$$

# Step 2：カイ二乗値の確認（df = 5）

95% CI では：

<center>

- 下側：$\chi^2_{0.025}(5) = 12.833$
- 上側：$\chi^2_{0.975}(5) = 0.831$

</center>

<hr>

（χ²分布表より）

# Step 3：公式に代入

母分散の95%信頼区間：

$$
\left(
\frac{\sum (x_i - \bar{x})^2}{\chi^2_{0.025}(n-1)},\;
\frac{\sum (x_i - \bar{x})^2}{\chi^2_{0.975}(n-1)}
\right)
$$

数値を代入：

$$
\left(
\frac{20}{12.833},\;
\frac{20}{0.831}
\right)
$$

# 結果（95% 信頼区間）

$$
(1.56,\; 24.07)
$$

母分散 $\sigma^2$ の 95% 信頼区間は **1.56 〜 24.07** である。
