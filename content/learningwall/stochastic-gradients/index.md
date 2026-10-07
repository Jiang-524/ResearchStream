---
id: demo-stochastic-gradients
title: "When the gradient is an estimate"
abstract: "A short follow-up on mini-batches, noisy updates, and keeping the objective in view."
date: "2026-09-28"
lang: en
topic: Mathematics
tags: [optimization, gradients]
series: Optimization notes
order: 2
demo: true
---

## One batch at a time

Computing a gradient over an entire dataset can be expensive. A mini-batch uses a subset of the examples to estimate the update direction.

$$
g_t=\frac{1}{|B_t|}\sum_{i\in B_t}\nabla_\theta\ell_i(\theta_t)
$$

The estimate depends on which examples are sampled. A noisy step does not by itself tell us whether the overall procedure is making progress.

## What to record

Keep the batch size, learning rate, sampling procedure, and evaluation protocol in the notebook. A plotted curve is much easier to interpret with these details nearby.

## Return to the original question

Compare the estimate to the full gradient on a small dataset where both are cheap to calculate. This is an experiment to perform, not a result already measured in this example.
