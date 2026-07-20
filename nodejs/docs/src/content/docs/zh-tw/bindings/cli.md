---
title: CLI
description: 目前實作的 mdi build 指令。
---

以 `npm install --global @illusions-lab/mdi-cli` 安裝。

```text
mdi build <input.mdi> --to html|pdf|epub|docx|txt|txt-ruby|narou|kakuyomu|aozora|txt-all [--config export.json] [-o <output>]
```

目前 CLI 使用 remark/micromark 與既有 Node 輸出 package。未來以 Rust 為後端的薄 CLI 邊界是 Planned；CLI 不是獨立語法權威。目前 source 沒有獨立的 `help` / `version` command。
