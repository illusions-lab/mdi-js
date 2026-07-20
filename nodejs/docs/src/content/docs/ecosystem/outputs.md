---
title: HTML / TXT / EPUB / DOCX / PDF outputs
description: What each output means and where layout responsibility sits.
---

All outputs should be viewed as transformations of one MDI IR. Output formatting is not a second syntax layer.

| Format | Current Node package | Output boundary |
| --- | --- | --- |
| HTML | `@illusions-lab/mdi` | Rust HTML document and MDI stylesheet |
| TXT | `@illusions-lab/mdi` / CLI | Rust plain, ruby-preserving, Narou, Kakuyomu, Aozora |
| EPUB | `@illusions-lab/mdi` | Rust EPUB 3 baseline package |
| DOCX | `@illusions-lab/mdi` | Rust baseline OOXML document |
| PDF | `@illusions-lab/mdi-to-pdf` | Rust HTML/print CSS laid out by headless Chromium |

The CLI uses the Rust routes above directly. The mdast/HAST packages remain public compatibility adapters for unified consumers. Chromium never parses MDI; it only lays out Rust-produced HTML/CSS. EPUB/DOCX profile and cover options are the remaining Rust renderer work.
