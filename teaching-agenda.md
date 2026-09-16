# 2026 Statistics B — teaching agenda

This is the instructor-facing delivery plan for the existing 2026 sequence: orientation, inference and probability, discrete and continuous distributions, estimation, testing, and regression. It preserves the curated folders in [`course-map.md`](course-map.md); the links on the course site remain the student materials library.

## Course rhythm and assessment cadence

Every meeting is 100 minutes. Explanations are deliberately broken into **12-minute mini-lessons**; no lecture block is longer than 20 minutes.

| Minutes | Regular concept meeting | Active-learning meeting |
| --- | --- | --- |
| 0–8 | Retrieval prompt / opening question | Retrieval prompt / setup check |
| 8–20 | Mini-lesson 1: the new idea | Brief model and success criteria |
| 20–38 | Paired prediction, sort, or data task | Station 1 / worksheet launch |
| 38–50 | Mini-lesson 2: method or formula | Station 2 |
| 50–68 | Guided practice with feedback | Station 3 |
| 68–80 | Mini-lesson 3: interpretation or common error | Checkpoint clinic / instructor conference |
| 80–94 | Application / share-out | Gallery walk / solution comparison |
| 94–100 | Exit ticket and homework briefing | Exit ticket and homework briefing |

### Recommended routine

- **Exit ticket every week:** one calculation/decision and one sentence explaining it. Use it to form the opening retrieval prompt next week.
- **Homework every content week:** 20–30 minutes, due before the next meeting; grade for completion plus one or two checked items. The supplied worksheets, data, tables, and notebooks are the starting point.
- **Challenge every active-learning week:** an optional or small-bonus extension. Groups submit one clearly labeled calculation and a short interpretation; it should reward transfer, not speed.
- **Feedback loop:** show two anonymized exit-ticket responses at the start of the following class—one sound method and one useful misconception.

## Week-by-week agenda

### Week 00 — Orientation / getting ready

**Content and materials.** Course expectations, textbook, UNIPA / Google Classroom routine, BYOD, calculator, and iStudio expectations. Use `materials/2026-tsumura/26_00_オリエンテーション.pptx`.

| Minutes | Plan |
| --- | --- |
| 0–10 | Arrival task: students open the site and locate the Week 01 slide deck; resolve access problems. |
| 10–20 | Mini-lesson: course arc—sample → estimate → test → explain; explain why PC and calculator are needed. |
| 20–35 | Pair activity: identify a question about campus/student life that could be answered with data; name population, possible sample, and variable. |
| 35–47 | Mini-lesson: how weekly materials, UNIPA, active-learning weeks, and homework work. |
| 47–67 | Digital readiness check: open an `.xlsx`, make one simple calculation, and submit a one-question form. Partner support first. |
| 67–79 | Mini-lesson: assessment expectations and academic integrity for spreadsheet/notebook work. |
| 79–94 | Group share: turn one proposed question into a measurable variable and identify a sampling risk. |
| 94–100 | Exit ticket: “What tool/access issue do I need to solve?” Preview Week 01. |

**Homework.** Complete the LMS/UNIPA readiness check and bring one everyday probability claim or data question (a screenshot/link is enough).  
**Challenge.** Optional: find a public statistic whose denominator or population is unclear; write the question you would ask before trusting it.

### Week 01 — Inference and probability foundations

**Content and materials.** Population, sample, random sampling, events, sample spaces, probability axioms, union/intersection, and the inference process. Use `01_Lecture_Slides_Yoh_w3.pdf`, `01_Probability_Worksheet.pdf`, `01_In-class_Data.xlsx`, and `01_Coin-tossing.ipynb`.

| Minutes | Plan |
| --- | --- |
| 0–8 | Retrieval: classify the orientation examples as population, sample, variable, or sampling concern. |
| 8–20 | Mini-lesson: population → random sample → statistic → claim about a parameter. |
| 20–38 | Pairs map a campus-data question onto that chain and flag one possible bias. |
| 38–50 | Mini-lesson: events, sample space, union/intersection, and probability bounds. |
| 50–68 | Probability worksheet: coin/die events; students draw the sample space before calculating. |
| 68–80 | Mini-lesson: additivity and why mutually exclusive events matter. |
| 80–94 | Coin-toss data/notebook: compare observed relative frequency with the expected probability; discuss variation. |
| 94–100 | Exit ticket: explain why a larger random sample is not guaranteed to match the population exactly. |

**Homework.** Finish the probability worksheet; submit two event diagrams and one calculation with a sentence defining the event.  
**Challenge.** Simulate 100, 1,000, and 10,000 coin tosses in the notebook; explain what becomes more stable and what does not.

### Week 02 — Discrete distributions I: random variables, expectation, binomial

**Content and materials.** Random variables, probability distributions, expected value, variance, Bernoulli trials, binomial distribution, and the law of large numbers. Use `02_Lecture_Slides_Yoh_w5.pdf`, `02_Distribution_Graphing_Data.xlsx`, `02_Coin.ipynb`, and `02_Roulette.ipynb`.

| Minutes | Plan |
| --- | --- |
| 0–8 | Retrieval: one union/intersection probability from Week 01. |
| 8–20 | Mini-lesson: a random variable and a probability distribution; distinguish discrete from continuous examples. |
| 20–38 | Card sort: classify variables and build a probability table whose probabilities sum to 1. |
| 38–50 | Mini-lesson: expected value and variance as long-run center and spread. |
| 50–68 | Spreadsheet graphing: calculate and graph a simple discrete distribution; identify its expected value. |
| 68–80 | Mini-lesson: Bernoulli conditions and the binomial formula. |
| 80–94 | Paired binomial task: choose (n, \pi, x), calculate (Pr(X=x)), then check a “at least” question using a complement. |
| 94–100 | Exit ticket: state which binomial condition would fail in a given scenario. |

**Homework.** Three binomial questions: exact probability, at-least probability, and expected value/variance; include the (n, \pi, x) setup before a formula.  
**Challenge.** Use the roulette notebook to compare a game’s expected value with whether it feels “fair.”

### Week 03 — Discrete distributions II: Poisson

**Content and materials.** Poisson model, rate parameter, relation to rare binomial events, Poisson table, and applied modeling. Use `03_Lecture_Slides_Yoh_w6.pdf`, `03_Poisson_Table.pdf`, and `03_Poisson.ipynb`.

| Minutes | Plan |
| --- | --- |
| 0–8 | Retrieval: decide whether last week’s scenarios meet the binomial conditions. |
| 8–20 | Mini-lesson: counts per interval, the Poisson parameter (\lambda), and when a Poisson model is plausible. |
| 20–38 | “Model choice” pairs: binomial, Poisson, or neither, with a one-sentence justification. |
| 38–50 | Mini-lesson: calculate/read (Pr(X=x)), and use (E(X)=Var(X)=\lambda). |
| 50–68 | Costco queue example: calculate one exact and one cumulative probability using the table. |
| 68–80 | Mini-lesson: rare-event binomial approximation and the complement for “one or more.” |
| 80–94 | Notebook check: vary (\lambda) and interpret the shape and center; compare group answers. |
| 94–100 | Exit ticket: choose a plausible interval and rate for one campus count process. |

**Homework.** Poisson practice: two table/formula questions and one short model-justification question.  
**Challenge.** Estimate a rate from a small observation plan (e.g., arrivals in 10 minutes) and state why the estimate may be unstable.

### Week 04 — Active learning: using discrete distributions

**Content and materials.** Consolidate binomial and Poisson distributions, complements, parameters, and interpretation. Use the Week 04 Tsumura active-learning deck and exercise files; keep the answer workbook for the debrief.

| Minutes | Plan |
| --- | --- |
| 0–8 | Individual retrieval: write the parameter(s) and model for one short scenario. |
| 8–20 | Model one worksheet question; emphasize identifying variables before calculating. |
| 20–40 | Station 1: batting-average/binomial case—complete all three parts in the workbook. |
| 40–60 | Station 2: gacha/complement case—show why “at least one” is easier through its complement. |
| 60–68 | Reset and error clinic based on common setup mistakes. |
| 68–86 | Station 3: defective-items/Poisson case; groups label their model assumptions. |
| 86–94 | Gallery walk: groups compare one solution and annotate a different method or error check. |
| 94–100 | Exit ticket: “What clue tells me binomial vs. Poisson?” |

**Homework.** Correct and submit the marked workbook cells plus a 150-word reflection on one error you fixed.  
**Challenge.** Create a four-line real-world prompt that could be solved by either a binomial or Poisson model only after making the right assumption explicit.

### Week 05 — Continuous distributions I: density and normal

**Content and materials.** Continuous probability distributions, density, integration, cumulative probability, expectation and variance, normal and standard-normal distributions, and the normal table. Use the Week 05 Tsumura deck and exercise files; Yoh density/CDF, normal, and moments PDFs remain scoped supplements.

| Minutes | Plan |
| --- | --- |
| 0–8 | Retrieval: model-choice question from Week 04. |
| 8–20 | Mini-lesson: why a point probability is zero for a continuous variable; area under a density curve. |
| 20–38 | Sketch-and-shade activity: match four probability statements to density/CDF pictures. |
| 38–50 | Mini-lesson: expectation and variance for a continuous distribution. |
| 50–68 | Mini-lesson: normal shape, mean/standard deviation, and (Z=(X-\mu)/\sigma). |
| 68–80 | Guided standardization: students calculate z-scores and use the standard normal table for upper, lower, and between probabilities. |
| 80–94 | Pair check: use the normal table and interpret the probability in original units. |
| 94–100 | Exit ticket: interpret a z-score in the context of the original units. |

**Homework.** Complete Tsumura's Week 05 exercise file.
**Challenge.** Explain a z-score and probability in the original units.

### Week 06 — Continuous distributions II: samples, CLT, t, chi-square

**Content and materials.** Samples, sample means, the central limit theorem, t distribution/table, unbiased sample variance, degrees of freedom, and chi-square distribution. Use the Week 06 Tsumura deck and exercise files; Yoh sampling/CLT, t, chi-square, and table PDFs remain scoped supplements.

| Minutes | Plan |
| --- | --- |
| 0–8 | Retrieval: convert one raw value to a z-score and identify the relevant table area. |
| 8–20 | Mini-lesson: samples, sample means, and the central limit theorem. |
| 20–38 | Small-group data task: compare individual observations and repeated sample means; then calculate both variance versions. |
| 38–50 | Mini-lesson: t distribution, unbiased variance, degrees of freedom, and reading a t table. |
| 50–68 | Guided table practice: identify df and critical t for one- and two-sided areas. |
| 68–80 | Mini-lesson: chi-square as a right-skewed distribution and its connection to squared deviations. |
| 80–94 | Category/fit discussion using the koala example; calculate one chi-square contribution and interpret a large value. |
| 94–100 | Exit ticket: explain what degrees of freedom counts in the variance context. |

**Homework.** Complete Tsumura's Week 06 exercise file.
**Challenge.** Write an explanation for a classmate: why does estimating the mean “use up” one degree of freedom?

### Week 07 — Active learning: reading continuous distributions

**Content and materials.** Standard normal table fluency, standardization, unbiased variance, and t-table use. Use the Week 07 Tsumura active-learning deck and exercise files; reserve the answer workbook for the debrief.

| Minutes | Plan |
| --- | --- |
| 0–8 | Individual retrieval: choose the correct table operation for an upper, lower, and central probability. |
| 8–20 | Model the first standard-normal item; annotate the symmetry/complement moves. |
| 20–40 | Station 1: complete the standard-normal probability set in the worksheet. |
| 40–60 | Station 2: solve the Chiba temperature unbiased-variance item; require visible intermediate steps. |
| 60–68 | Reset: compare two correct paths for a lower-tail probability. |
| 68–86 | Station 3: t-table lookup and a mixed “which distribution/table?” sorting task. |
| 86–94 | Pair check using the answer workbook; each pair corrects one answer in a contrasting color and explains the correction. |
| 94–100 | Exit ticket: solve one new probability and name the symmetry/complement rule used. |

**Homework.** Submit the completed worksheet and corrections; students explain one wrong answer rather than merely replacing it.  
**Challenge.** Make a three-question “table trap” quiz that tests a different upper/lower/symmetry mistake, with an answer key.

### Week 08 — Estimation I: parameters, estimators, point estimation

**Content and materials.** Parameters and statistics, estimator versus estimate, unbiasedness, efficiency, consistency, and point estimation of a population mean and variance. Use the Week 08 Tsumura deck and exercise files, plus the W08-only Yoh supplement.

| Minutes | Plan |
| --- | --- |
| 0–8 | Retrieval: identify the population parameter and sample statistic in a short scenario. |
| 8–20 | Mini-lesson: parameter, statistic, estimator, estimate; connect them to the course’s sample-to-claim arc. |
| 20–38 | Sorting activity: label statements/formulas as parameter, statistic, estimator, estimate, or sampling distribution. |
| 38–50 | Mini-lesson: unbiasedness and why (E(\bar X)=\mu). |
| 50–68 | Spreadsheet/notebook simulation: take repeated samples and compare their means to the known population mean. |
| 68–80 | Mini-lesson: point estimates of mean and variance; distinguish sample variance and unbiased sample variance. |
| 80–94 | Worksheet: estimate a mean from a sample and defend which variance estimator is appropriate. |
| 94–100 | Exit ticket: distinguish “an estimate was wrong” from “an estimator is biased.” |

**Homework.** Complete the estimation worksheet and submit one screenshot/table from the repeated-sampling activity with a two-sentence interpretation.  
**Challenge.** Propose two different estimators for an everyday population quantity and argue which might be less biased or more variable.

### Week 09 — Estimation II: confidence intervals for mean and variance

**Content and materials.** Confidence level, rejection region, t-based interval for a population mean, variance interval using chi-square, and reporting an interval responsibly. Use the Week 09 Tsumura deck and exercise files, plus the W09-only Yoh supplement.

| Minutes | Plan |
| --- | --- |
| 0–8 | Retrieval: label (\mu, \bar X, \sigma^2, s^2, n) in a data story. |
| 8–20 | Mini-lesson: confidence level and the repeated-sampling meaning of a confidence procedure. |
| 20–38 | Interval-capture demonstration: groups predict whether several intervals will cover a marked population value; debrief the long-run rate. |
| 38–50 | Mini-lesson: t interval for a population mean—known values, df, critical value, margin of error. |
| 50–68 | Guided class-score example: compute the unbiased variance, find t, and form/interpret the 95% interval. |
| 68–80 | Mini-lesson: interval for population variance and the chi-square table; contrast it with the mean interval. |
| 80–94 | Pairs solve a context problem, then exchange reports and check whether the interpretation names the parameter and units. |
| 94–100 | Exit ticket: name two ways to make a mean confidence interval narrower and one trade-off. |

**Homework.** One mean-CI and one variance-CI calculation, each with a complete “Given / method / interval / interpretation” report.  
**Challenge.** Compare 90%, 95%, and 99% intervals from the same summary data; explain width and confidence without saying that a particular fixed parameter has a probability of changing.

### Week 10 — Active learning: confidence intervals in context

**Content and materials.** Choosing Z/t/chi-square routes and building/communicating intervals. Use the Week 10 Tsumura active-learning deck and exercise files; Yoh #10 remains supplementary.

| Minutes | Plan |
| --- | --- |
| 0–8 | Retrieval: select the distribution/table for three short interval prompts. |
| 8–20 | Model the “known population variance” decision using the screw-length problem. |
| 20–40 | Station 1: test-score and screw-length intervals; emphasize what is known versus estimated. |
| 40–60 | Station 2: battery-life and tomato-weight intervals; require a plain-language conclusion in units. |
| 60–68 | Reset/error clinic: t versus Z and incorrect degrees of freedom. |
| 68–86 | Station 3: table relay—each group checks the critical value, arithmetic, and interpretation on a different problem. |
| 86–94 | Gallery walk: groups use a checklist to review another team’s interval report. |
| 94–100 | Exit ticket: write the first three items you would identify before calculating a CI. |

**Homework.** Submit the chosen two station problems with a corrected final report; attach the review checklist for the problem your group checked.  
**Challenge.** Design an interval-estimation prompt that intentionally tempts a student to use the wrong distribution, then explain the clue that resolves it.

### Week 11 — Hypothesis testing

**Content and materials.** The seven-step test process, null and alternative hypotheses, significance level, rejection regions, one- and two-group examples, and p values. Use the Week 11 Tsumura deck and exercise files; Yoh #11 remains supplementary.

| Minutes | Plan |
| --- | --- |
| 0–8 | Retrieval: convert a claim into a parameter statement and distinguish estimate from hypothesis. |
| 8–20 | Mini-lesson: logic of (H_0), (H_1), and “reject” versus “fail to reject.” |
| 20–38 | Claim-writing pairs: turn three media/product claims into testable null and alternative hypotheses; identify one- or two-sided form. |
| 38–50 | Mini-lesson: significance level, p-value, rejection region, and critical value. |
| 50–68 | Lady Tasting Tea activity: calculate/lookup the probability of results under chance and decide using (\alpha=0.05). |
| 68–80 | Mini-lesson: test-statistic workflow and Type I/II errors; connect errors to decisions, not personal certainty. |
| 80–94 | Practice case: groups complete a four-line report—hypotheses, method/statistic, decision, contextual conclusion. |
| 94–100 | Exit ticket: rewrite an overclaim (“we proved…”) into statistically accurate language. |

**Homework.** Hypothesis-testing practice set plus one 120–150 word decision report using the four-line structure.  
**Challenge.** For one claim, describe how lowering α changes the risk of Type I error and why the trade-off matters.

### Week 12 — Regression analysis and interpretation

**Content and materials.** Correlation versus causation, outcome/explanatory variables, simple regression, least squares, Excel regression, a testing-process review, and incorrect interpretations of results. Use both Week 12 Tsumura decks and their exercise files; Yoh #02 and #12 remain matching supplements.

| Minutes | Plan |
| --- | --- |
| 0–8 | Retrieval: decide whether three conclusions from a study are estimation, testing, or relationship questions. |
| 8–20 | Mini-lesson: association is not causation; identify response and explanatory variables. |
| 20–38 | Scatterplot gallery: groups describe direction, strength, outliers, and a plausible confounder before seeing any regression output. |
| 38–50 | Mini-lesson: (\hat y=a+bx), slope/intercept, residuals, and what (R^2) does and does not say. |
| 50–68 | Excel setup and guided regression with the supplied data; students save an output table/screenshot. |
| 68–80 | Mini-lesson: review the testing process and read regression output cautiously. |
| 80–94 | Error clinic: non-significant coefficients, variable direction, adjusted R², method choice, and spurious correlation. |
| 94–100 | Final exit ticket: name the tool you would use to answer a new data question and why. |

**Homework / culminating task.** Complete Tsumura's Week 12 exercise file.
**Challenge.** Improve a misleading regression headline by adding the missing evidence/limitation; propose one design change that would make a causal claim more credible.

### Week 13 — Final-exam preparation and integrated review

**Content and materials.** Review the central sequence: inference, probability distributions, interval estimation, hypothesis testing, and regression. Use Yoh's 2025 practice problems, answer key, and review materials. No new Tsumura lecture deck is scheduled.

| Minutes | Plan |
| --- | --- |
| 0–20 | Confirm the final scope and retrieve the course sequence. |
| 20–60 | Work representative problems across all five topic blocks. |
| 60–86 | Error clinic: identify setup, calculation, and interpretation errors. |
| 86–100 | Exam-readiness check and final questions. |

**Homework.** Complete selected practice problems and self-correct with the answer key.

### Week 14 — Final examination

**Content and materials.** Final examination. No new lecture or practice material is scheduled; follow the latest UNIPA notice.

| Minutes | Plan |
| --- | --- |
| 0–100 | Final examination. |

## Instructor setup checklist

- Before each meeting, post the primary slide deck, activity file, and submission link; never post the answer workbook until after the activity closes.
- Have a PDF fallback and a short paper version of the opening/exit task for access failures.
- Pre-open Excel/notebook files and test the data-analysis add-in before Week 12.
- Keep the same four-part reporting frame on the board: **What is the question? What is known? What method fits? What does the result mean?**
- After Weeks 04, 07, and 10, use the worksheet and exit-ticket evidence to re-teach one misconception before advancing.
