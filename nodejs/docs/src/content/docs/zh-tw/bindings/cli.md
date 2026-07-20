---
title: CLI
description: 目前實作的 mdi build 指令。
---

以 `npm install --global @illusions-lab/mdi-cli` 安裝。

```text
mdi build <input.mdi> --to html|pdf|epub|docx|txt|txt-ruby|narou|kakuyomu|aozora|txt-all [--config export.json] [-o <output>]
```

HTML、EPUB、DOCX 和所有文字格式都直接由 Rust core 輸出。PDF 則只把 Rust 生成的 HTML 交給 Chromium 做最終分頁，Chromium 不會解析 MDI。設定檔目前套用於 PDF 與文字格式；EPUB/DOCX 使用 Rust baseline 與 front matter metadata，完整 profile parity 會在 Rust API 補齊。CLI 不是獨立語法權威。目前 source 沒有獨立的 `help` / `version` command。
