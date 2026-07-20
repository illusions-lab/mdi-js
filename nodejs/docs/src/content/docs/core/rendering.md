---
title: Rendering model and Chromium/PDF boundary
description: Separate syntax and IR semantics from output layout.
---

Renderers consume the Rust document IR. Syntax is parsed once; a renderer never reparses source text or reconstructs MDI boundaries.

| Output | Role |
| --- | --- |
| HTML | Semantic document plus MDI CSS |
| TXT | Plain or publication-profile text |
| EPUB | Reflowable XHTML, metadata, CSS, and package |
| DOCX | Rust-generated baseline OOXML document |
| PDF | Rust-produced HTML, then Chromium layout with print CSS |

Chromium is a layout engine, not an MDI parser. The host PDF adapter asks Chromium to perform pagination and `printToPDF` on Rust-produced HTML; Chromium provides font shaping, vertical layout, ruby-related CSS, and page layout. It never decides whether source text is MDI.

The CLI calls Rust directly for HTML, TXT, EPUB, and DOCX. Its PDF path calls the Chromium adapter with Rust HTML. Legacy mdast/HAST packages remain as public compatibility adapters, not as CLI syntax or semantic-rendering paths. Full export-profile parity for Rust EPUB/DOCX is still pending.

Browser WASM cannot launch Chromium. Browser applications need a server or desktop host for PDF while parsing and non-process-bound work can run locally.
