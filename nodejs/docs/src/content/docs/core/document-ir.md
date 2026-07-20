---
title: Document IR
description: The versioned language-neutral representation shared by MDI interfaces.
---

The Rust core exposes a binding-friendly envelope with `syntaxVersion`, `irVersion`, `capabilities`, `document`, and `diagnostics`. The current crate declares MDI `2.0` and IR `1.0`.

The document contains a full-source span, optional ordered YAML front matter (including unknown keys), and tagged children. Source-backed nodes carry half-open UTF-8 byte spans. Inline MDI nodes include ruby, tate-chu-yoko, breaks, emphasis, no-break, warichu, and kerning; block markers include blank paragraphs and page breaks.

```json
{
  "irVersion": "1.0",
  "syntaxVersion": "2.0",
  "document": { "span": { "startByte": 0, "endByte": 42 }, "children": [] },
  "diagnostics": []
}
```

This is a wire contract, not permission for a binding to infer grammar from object shapes. Unsupported IR versions must be rejected explicitly.

Rust's `Document` uses mdast's tagged JSON shape for the document children while lowering MDI nodes in Rust. The compatibility `MdiSyntaxDocument`/`parse_mdi_syntax` helper is transitional; new integrations should use `parse_document` or `parse_output`.
