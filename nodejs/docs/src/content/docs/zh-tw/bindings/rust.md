---
title: Rust
description: mdi-core 的原生 API。
---

`mdi-core` 是 MDI 語法的可執行權威。

```rust
use mdi_core::{parse_document, parse_output};
let document = parse_document("第^12^話");
let output = parse_output("第^12^話");
```

目前 API 請看[Rust Core API 狀態](/zh-tw/core/rust-api/)。最終 renderer API 尚為 Planned。
