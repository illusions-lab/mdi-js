---
title: Rust-authoritative architecture
description: One executable grammar, one versioned IR, and thin host-language interfaces.
---

MDI has two complementary authorities: `SYNTAX.md` is the normative human-readable specification, and `mdi-core` is the executable syntax/IR implementation. Shared conformance fixtures are the observable compatibility contract.

```text
.mdi source
    ↓
mdi-core → versioned MDI document IR → Rust-owned renderers
    │                         ├─ JavaScript / TypeScript / WASM
    │                         ├─ Planned Python / Swift bindings
    │                         └─ remark / mdast adapter
    └─ HTML + print CSS → Chromium → PDF layout
```

No binding or adapter may add grammar tables, tokenizers, literal-fallback rules, or renderer semantics. A host can convert strings, bytes, options, and object shapes only.

The current Node documentation build still registers the JavaScript micromark/mdast integration so Astro can render MDI examples. This is a **temporary documentation-build implementation detail**, not a claim that JavaScript is syntax authority. The product contract remains Rust-authoritative.

See the repository [ARCHITECTURE.md](https://github.com/illusions-lab/MDI/blob/main/ARCHITECTURE.md) for the complete contract.
