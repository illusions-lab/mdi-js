---
title: HTML / TXT / EPUB / DOCX / PDF outputs
description: What each output means and where layout responsibility sits.
---

All outputs should be viewed as transformations of one MDI IR. Output formatting is not a second syntax layer.

| Format | Current Node package | Output boundary |
| --- | --- | --- |
| HTML | `@illusions-lab/mdi-to-html` | HTML document and MDI stylesheet |
| TXT | `@illusions-lab/mdi-cli` text formats | Plain, ruby-preserving, Narou, Kakuyomu, Aozora |
| EPUB | `@illusions-lab/mdi-to-epub` | EPUB 3 package with reflowable XHTML |
| DOCX | `@illusions-lab/mdi-to-docx` | OOXML document |
| PDF | `@illusions-lab/mdi-to-pdf` | HTML/print CSS laid out by headless Chromium |

The current packages are TypeScript implementations over the existing mdast/HAST layer. Rust-native renderer APIs are part of the product contract but are Planned where the current crate does not expose them. Chromium never parses MDI; it only lays out the HTML/CSS it receives.
