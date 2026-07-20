---
title: Export Profiles
description: Share exact PDF, DOCX, EPUB, and text export settings across applications.
---

`@illusions-lab/mdi-export-profile` is the common, validated contract for an MDI export. Keep it beside a manuscript or in an application's preferences; it is intentionally separate from MDI syntax and front matter.

```json
{
  "metadata": {
    "title": "The Last Station",
    "author": "A Writer",
    "publisher": "Example Press",
    "identifier": "isbn:9780000000000"
  },
  "typesetting": {
    "writingMode": "horizontal",
    "fontFamily": "Noto Serif JP",
    "textIndentEm": 1,
    "fullwidthSpaceIndent": false
  },
  "pagination": {
    "pageSize": "A4",
    "landscape": false,
    "charactersPerLine": 40,
    "linesPerPage": 34,
    "margins": { "top": 25, "bottom": 25, "left": 25, "right": 25 },
    "pageNumbers": {
      "enabled": true,
      "format": "simple",
      "position": "bottom-center"
    }
  },
  "epub": { "chapterSplitLevel": "h1", "coverPath": "cover.png" },
  "text": { "fullwidthSpaceIndent": true, "indentCount": 1 }
}
```

```sh
mdi build novel.mdi --to pdf --config novel.export.json -o novel.pdf
mdi build novel.mdi --to docx --config novel.export.json
mdi build novel.mdi --to epub --config novel.export.json
mdi build novel.mdi --to txt-ruby --config novel.export.json
```

The schema is shared with applications and validates all its fields. In the current Rust-first CLI, the profile is applied to PDF and text output. EPUB and DOCX intentionally use the deterministic Rust baseline plus front matter metadata; cover media, chapter splitting, and full pagination/profile parity are pending Rust API options.

## Format support

| Setting                              | PDF | EPUB / DOCX Rust baseline | TXT / TXT ruby |
| ------------------------------------ | --- | ------------------------- | -------------- |
| Print geometry, fonts, page numbers  | Yes | Pending Rust options      | —              |
| Front matter metadata / writing mode | Yes | Yes                       | —              |
| Full-width-space indent              | Yes | Pending Rust options      | Yes, 1–4 spaces |
| Cover and heading chapter split      | —   | Pending Rust options      | —              |

`pageSize` supports the complete Illusions page-size collection: ISO A, JIS B, ISO B, Japanese literary/book/envelope sizes, North American office sizes, and postcard/photo sizes. Use the exported `PAGE_SIZES` list when building a UI.
