---
title: Migration and compatibility
description: How to move from transitional JavaScript helpers toward the Rust-authoritative contract.
---

MDI 2.0 syntax is specified in one place: [`SYNTAX.md`](https://github.com/illusions-lab/MDI/blob/main/SYNTAX.md). Package versions use the `2.0.x` line for releases implementing that specification.

## Current migration notes

- Prefer `parse` from `@illusions-lab/mdi` over the deprecated `parseMdiSyntax` alias.
- Prefer Rust `parse_document` or `parse_output` over the transitional `parse_mdi_syntax` helper for new native integrations.
- Treat `irVersion` as a wire-protocol version and reject versions a consumer does not support.
- Preserve UTF-8 byte spans; do not reinterpret them as host-language character indexes.
- Use remark only when unified plugins are needed; it is an adapter, not a grammar owner.
- Python and Swift are Planned and have no API reference yet.

The current docs build uses the JavaScript micromark integration to render site examples. This is an implementation detail of building the website and does not change the architecture described above.
