---
title: CLI
description: "Export a .mdi file from the shell, with one shared profile for EPUB, DOCX, PDF, and text."
---

**Prerequisites:** [Getting Started](/guides/getting-started/) and [Export profiles](/ecosystem/export-profiles/).

## Install and build

```bash
npm install --global @illusions-lab/mdi-cli
mdi build novel.mdi --to epub --config novel.export.json -o dist/novel.epub
```

```text
mdi build <input.mdi> --to html|pdf|epub|docx|txt|txt-ruby|narou|kakuyomu|aozora|txt-all [--config export.json] [-o <output>]
```

`<input.mdi>` is UTF-8. `--to` is required; `-o` overrides the derived output path and cannot be used with `txt-all`; `--config` points to an [export profile](/ecosystem/export-profiles/) JSON file. Success prints `Written <path>` and exits `0`. Any argument, input, profile, renderer, or output failure writes one message to stderr and exits `1`.

## Which output you get

| `--to` | Default | Renderer and profile behavior |
| --- | --- | --- |
| `html` | `novel.html` | Rust semantic standalone HTML; no page profile is applied. |
| `pdf` | `novel.pdf` | Rust HTML plus local Chromium; consumes the print profile. |
| `epub` | `novel.epub` | Baseline Rust EPUB without `--config`; configured profile export with metadata, typography, chapter split, and optional cover with `--config`. |
| `docx` | `novel.docx` | Baseline Rust DOCX without `--config`; configured profile export with metadata, page setup, typography, and numbering with `--config`. |
| `txt` / `txt-ruby` / `narou` / `kakuyomu` / `aozora` | matching `.txt` suffix | Rust text convention; profile controls indentation. `aozora` is Shift_JIS. |
| `txt-all` | six text files | Writes every text flavor and rejects `-o`. |

The CLI reads `epub.coverPath` relative to the profile file. It must name a PNG or JPEG; the bytes are included in the EPUB only, never sent to the parser. `--config` is no longer silently ignored for EPUB or DOCX.

## A useful profile

```json
{
  "metadata": { "title": "雨の東京", "author": "Illusions", "language": "ja" },
  "typesetting": { "writingMode": "vertical", "fontFamily": "Yu Mincho", "fontSize": 11, "lineSpacing": 1.6, "textIndentEm": 1 },
  "pagination": {
    "pageSize": "A4", "charactersPerLine": 40, "linesPerPage": 30, "gridMode": "typographic",
    "margins": { "top": 20, "right": 18, "bottom": 20, "left": 18 },
    "pageNumbers": { "enabled": true, "position": "bottom-center", "format": "simple" }
  },
  "epub": { "chapterSplitLevel": "h1", "coverPath": "cover.png" }
}
```

Without a profile, the publisher default is A4, 40 characters × 30 lines, and 20 mm top/bottom plus 18 mm left/right margins. `gridMode: "strict"` is the default: it derives type size/leading from that printable grid and rejects explicit `fontSize` or `lineSpacing`. The example selects `"typographic"` because it supplies both. A grid controls the sizing calculation; it does not certify that every page after headings, forced breaks, available fonts, and a target reader's layout contains exactly 40×30 visible glyph slots.

Semantic MDI parsing and source-span diagnostics remain Rust-owned. Profile values are publication policy: EPUB/DOCX adapters use them to package the parsed IR, while PDF geometry and Chromium layout are host concerns. This keeps application UI preferences and machine-specific browser behavior out of the parser.

## PDF and DOCX limits

PDF requires a Chromium-family browser through `@illusions-lab/mdi-to-pdf`; Chromium receives Rust-rendered HTML, never `.mdi` syntax. It applies paper size, orientation, margins, vertical writing, fonts, type/line grid, indentation, and page numbering. Use [Rendering model](/core/rendering/#the-chromiumpdf-boundary) for the host boundary.

Configured DOCX supports the same practical page, type, and numbering controls, but OOXML cannot promise pixel-identical browser composition. Ruby, tate-chu-yoko, no-break/kern, and forced blank paragraphs are represented using DOCX's available runs, directions, and paragraph constructs; validate in the Word-compatible reader you ship against. For parser diagnostics in an editor, call `@illusions-lab/mdi`'s `parse()` before invoking the CLI.
