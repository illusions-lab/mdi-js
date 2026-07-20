---
title: 診斷與 UTF-8 原始碼 span
description: 所有 MDI 接口都必須保留的診斷資料。
---

診斷包含 `severity`、穩定的 `code`、`message` 與可選的 `span`。span 是原始 UTF-8 source 的半開 byte 範圍，不是 JavaScript UTF-16 index。

front matter 宣告比支援版本更新的 MDI 時，parser 會輸出 `mdi.version.unsupported`。其他 malformed syntax 依規格採 literal fallback，通常直接呈現在文件樹而不是報錯。使用端仍應處理空 diagnostics，且不得自行加入 host-specific validation。
