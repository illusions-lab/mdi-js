---
title: Remark / mdast adapter
description: 將 MDI 文件模型接到 unified，但不讓 remark 成為語法權威。
---

Remark 是需要 unified plugin 與 mdast 時使用的 adapter，不是 MDI parser。它把完整 source 交給 `@illusions-lab/mdi`，再把 Rust IR 映射為 mdast。

它不註冊 micromark MDI tokenizer 或 mdast MDI parser。`remark-gfm` 與 `remark-frontmatter` 只保留 mdast 序列化 handler；其 parser hook 不會被使用。由編輯後 mdast 回寫 canonical MDI 仍等待 Rust serializer API。
