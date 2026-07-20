---
title: Rust 權威架構
description: 單一可執行語法、版本化 IR 與薄接口。
---

`SYNTAX.md` 是人類可讀的規範，`mdi-core` 是可執行的語法與 IR 實作。所有 binding 與 adapter 都不得持有語法規則或 renderer 意義。

```text
.mdi → mdi-core → versioned document IR → bindings / adapters / renderers
                                      └→ HTML + print CSS → Chromium → PDF
```

Astro 文件建置目前註冊 JavaScript micromark/mdast 整合以顯示 MDI 範例；這是暫時的文件建置實作，不代表 JavaScript 是語法權威。
