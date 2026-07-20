---
title: Rust Core API status
description: The public Rust API currently available in mdi-core, without speculative binding claims.
---

This page documents only symbols present in `mdi-core/src/lib.rs` today. It is a landing page rather than generated rustdoc. Automated `cargo doc` integration is Planned; until then, the source and this status page are the reliable entry points.

## Implemented public surface

- `MDI_SPEC_VERSION` = `"2.0"`
- `MDI_IR_VERSION` = `"1.0"`
- `parse_mdi_syntax(&str) -> MdiSyntaxDocument` — transitional MDI-only compatibility helper
- `parse_document(&str) -> Document` — Rust document parser and IR construction
- `parse_output(&str) -> ParseOutput` — versioned envelope with capabilities and diagnostics
- `parse_json(&str) -> String` — serialized parse output
- `parse_inlines(&str) -> Vec<Inline>` — inline parsing helper
- `serialize_mdi(&str) -> String` / `serialize_mdi_document(&Document) -> String` — canonical MDI serialization
- `render_html(&str) -> String` / `render_html_document(&Document) -> String` — standalone Rust HTML rendering
- `render_text(&str) -> String` / `render_text_document(&Document) -> String` — deterministic plain-text rendering

The public data types include `ParseOutput`, `ParserCapabilities`, `Diagnostic`, `DiagnosticSeverity`, `SourceSpan`, `Document`, `Frontmatter`, `FrontmatterEntry`, `MdiSyntaxDocument`, `MdiBlock`, `PagebreakVariant`, `Inline`, and `RubyReading`.

## Not documented as implemented

Validation diagnostics are exposed by `parse_output`; a separate validation-only API is not yet public. Rust `serialize_mdi`, `render_html`, and baseline `render_text` are available now. Export-profile-specific TXT, EPUB, DOCX, and Chromium-controlled PDF APIs remain Planned.

See [Bindings: Rust](/bindings/rust/) for usage and [ARCHITECTURE.md](https://github.com/illusions-lab/MDI/blob/main/ARCHITECTURE.md) for the intended contract.
