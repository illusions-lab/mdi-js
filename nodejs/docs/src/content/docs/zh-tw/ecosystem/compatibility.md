---
title: 遷移與相容性
description: 移向 Rust 權威契約時的注意事項。
---

MDI 2.0 規範只有一份：[`SYNTAX.md`](https://github.com/illusions-lab/MDI/blob/main/SYNTAX.md)。新的 JavaScript 整合優先用 `parse`，Rust 優先用 `parse_document` 或 `parse_output`。

請檢查 IR version、保留 UTF-8 byte span，只有需要 unified plugin 時才使用 remark。Python 與 Swift 尚為 Planned。文件站建置中的 JavaScript parser 註冊只是暫時實作細節。
