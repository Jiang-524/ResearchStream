---
id: demo-attention-revisited
title: "Attention, revisited"
abstract: "A closer look at how tokens exchange information, why attention works, and what to keep in mind when reading a Transformer paper."
date: "2026-10-07"
lang: en
topic: Machine learning
tags: [attention, transformers, reading]
demo: true
paper:
  title: "Attention Is All You Need"
  authors: ["Ashish Vaswani et al."]
  url: "https://arxiv.org/abs/1706.03762"
---

## The central idea

Attention lets each token gather information from other tokens. Instead of treating every position equally, a query selects a **weighted combination of values** using its compatibility with a set of keys.

The scaled dot-product operation is:

$$
\operatorname{Attention}(Q,K,V)=\operatorname{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right)V
$$

The matrix $QK^\top$ holds the compatibility scores. Softmax turns each row into weights that sum to one. The final matrix multiplication aggregates the values.

> A useful reading question: what information can each position access, and what is it prevented from seeing?

## Reading notes

The following NumPy example shows the core operation. It uses stable softmax by subtracting the maximum score in each row.

```python
import numpy as np

def attention(q, k, v):
    scores = q @ k.T / np.sqrt(k.shape[-1])
    scores -= scores.max(axis=-1, keepdims=True)
    weights = np.exp(scores)
    weights /= weights.sum(axis=-1, keepdims=True)
    return weights @ v
```

### Shapes before intuition

| Tensor | Shape | Role |
| --- | --- | --- |
| Query $Q$ | $n_q \times d_k$ | What each position looks for |
| Key $K$ | $n_k \times d_k$ | How positions are matched |
| Value $V$ | $n_k \times d_v$ | What gets aggregated |
| Output | $n_q \times d_v$ | A context-dependent representation |

Keeping the shapes explicit makes it easier to distinguish self-attention from cross-attention.[^shapes]

## Open questions

- [x] Trace the dimensions through the operation.
- [x] Separate the roles of keys and values.
- [ ] Compare the effect of different masking patterns.
- [ ] Read an implementation alongside the paper.

This is a small demonstration note, not a comprehensive paper review. The original paper is linked above.

[^shapes]: The number of queries and the number of keys need not match in cross-attention.
