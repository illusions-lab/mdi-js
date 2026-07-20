---
title: Full syntax reference
description: The complete MDI 2.0 syntax contract, with a readable quick reference and canonical source.
---

This page is the website entry point for the complete MDI 2.0 syntax. The normative reference is maintained as [`SYNTAX.md`](https://github.com/illusions-lab/MDI/blob/main/SYNTAX.md) in the repository so the specification has one source and cannot drift between locales or generated site copies.

## Quick reference

| Feature | Recommended form | Meaning |
| --- | --- | --- |
| Front matter | YAML between `---` markers | Document metadata and writing mode |
| Ruby | `{base|reading}` | Reading attached to a base string |
| Tate-chu-yoko | `^12^` | Short horizontal run in vertical text |
| Boten | `[[em:text]]` | Emphasis dots; `[[em:○:text]]` selects a mark |
| No-break | `[[no-break:text]]` | Keep a phrase together |
| Line break | `[[br]]` | Explicit break inside a paragraph |
| Blank paragraph | `[[blank]]` | Preserve an empty paragraph |
| Warichu | `[[warichu:text]]` | Inline split annotation |
| Kerning | `[[kern:-0.1em:text]]` | Explicit character spacing |
| Block alignment | `[[align:center]]` etc. | Align a block |
| Page break | `[[pagebreak]]` | Start a new page |
| Footnotes | Markdown footnote syntax | Define and reference notes |
| Escapes | `\^`, `\[`, `\{` and documented CJK escapes | Keep delimiters literal |

## Read the specification by concern

- **Syntax**: delimiters, nesting, grapheme counting, escaping, fallback, and parsing order are defined only by `SYNTAX.md`.
- **Concepts**: the resulting document tree and diagnostics are described in [Document IR](/core/document-ir/) and [Diagnostics](/core/diagnostics/).
- **Rendering output**: HTML/CSS examples in the specification describe an output contract, not another parser. See [outputs](/ecosystem/outputs/).

## A copyable example

```markdown
---
mdi: "2.0"
title: サンプル
lang: ja
writing-mode: vertical
---

# 章題

{東京|とうきょう}の第^12^話。[[em:○:重要]]な語を
[[no-break:ひとまとまり]]として扱う。[[br]]次の行。
```

For every edge case and the exact normative wording, use the [complete `SYNTAX.md` reference](https://github.com/illusions-lab/MDI/blob/main/SYNTAX.md). The [live showcase](/syntax/showcase/) is illustrative output, not the grammar authority.
