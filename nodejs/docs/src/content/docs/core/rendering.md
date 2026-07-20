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
| DOCX | OOXML document with profile-driven typography |
| PDF | Rust-produced HTML/print CSS, then Chromium layout |

Chromium is a layout engine, not an MDI parser. Rust owns the PDF operation boundary and asks Chromium to perform pagination and `printToPDF`; Chromium provides font shaping, vertical layout, ruby-related CSS, and page layout. It never decides whether source text is MDI.

The currently shipped Node output packages still implement their public conversion paths over mdast/HAST and Playwright/JSZip/docx. Treat those as the current Node implementation status, not as the target Rust ownership contract. A Rust-native renderer/binding integration is Planned where it is not present in this checkout.

Browser WASM cannot launch Chromium. Browser applications need a server or desktop host for PDF while parsing and non-process-bound work can run locally.
