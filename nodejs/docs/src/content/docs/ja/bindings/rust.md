---
title: Rust
description: mdi-core のネイティブ API。
---

`mdi-core` は MDI 構文の実行可能な権威です。

```rust
use mdi_core::{parse_document, parse_output};
let document = parse_document("第^12^話");
let output = parse_output("第^12^話");
```

現在の API は[Core API の状態](/ja/core/rust-api/)に記載しています。最終的な renderer API は Planned です。
