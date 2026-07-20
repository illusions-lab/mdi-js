---
title: Rust
description: Native access to mdi-core and the boundary between current APIs and Planned renderer contracts.
---

`mdi-core` is the executable syntax authority. In this checkout it is a Cargo crate with native and WASM-oriented crate types.

```rust
use mdi_core::{parse_document, parse_output};

let document = parse_document("第^12^話");
let output = parse_output("第^12^話");
assert_eq!(output.syntax_version, "2.0");
```

The current public parser surface is listed on [Rust Core API status](/core/rust-api/). `parse_mdi_syntax` is a transitional compatibility helper; prefer `parse_document` or `parse_output` for new work.

Native Rust APIs for the final validation, normalization, serialization, and renderer contract are Planned in the current source. Do not infer those functions from the architecture diagram.
