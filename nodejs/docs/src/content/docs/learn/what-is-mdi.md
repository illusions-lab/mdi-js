---
title: What is MDI?
description: MDI is a Markdown-based format for Japanese typography with one Rust-owned grammar.
---

MDI (illusion Markdown) is a Markdown extension for Japanese typography: ruby, vertical writing, tate-chu-yoko, emphasis dots, warichu, page breaks, and related document features.

The important product boundary is ownership: `mdi-core` is the executable authority for MDI syntax and document meaning. `SYNTAX.md` is the normative human-readable specification. JavaScript, Python, Swift, CLI, editors, and ecosystem adapters are interfaces around that contract.

## A small document

```mdi
---
mdi: "2.0"
title: 雪女
writing-mode: vertical
---

# 第一章

{雪女|ゆきおんな}が第^12^話に現れた。[[em:決して]]忘れない。
```

The source is still Markdown. MDI constructs are meaningful only where the syntax specification permits them; code spans and fenced code keep MDI-looking text literal.

## Three layers

1. **Syntax**: the source notation and its boundary/fallback rules.
2. **Concepts and IR**: the versioned, language-neutral document tree and diagnostics.
3. **Rendering output**: deterministic transformations from the IR to HTML, text, EPUB, DOCX, and PDF.

Start with [Core concepts](/learn/core-concepts/) and then read the [full syntax reference](/syntax/reference/).
