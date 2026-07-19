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
    "writingMode": "vertical",
    "fontFamily": "Noto Serif JP",
    "textIndentEm": 1,
    "fullwidthSpaceIndent": false
  },
  "pagination": {
    "pageSize": "A4",
    "landscape": true,
    "charactersPerLine": 40,
    "linesPerPage": 30,
    "margins": { "top": 34, "bottom": 28, "left": 28, "right": 45 },
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

The CLI resolves a relative `coverPath` against the profile file and accepts JPEG and PNG covers only. Invalid dimensions, ranges, page-number values, and chapter split levels fail clearly instead of producing a different layout.

## Format support

| Setting                              | PDF               | DOCX              | EPUB                                         | TXT / TXT ruby  |
| ------------------------------------ | ----------------- | ----------------- | -------------------------------------------- | --------------- |
| Paper size, orientation, margins     | Yes               | Yes               | Reflowable EPUB has no paper geometry        | —               |
| Writing direction, font, em indent   | Yes               | Yes               | Yes                                          | —               |
| Characters per line / lines per page | Yes               | Yes               | Reflowable EPUB cannot guarantee fixed pages | —               |
| Full-width-space indent              | Yes               | Yes               | CSS `em` indent only                         | Yes, 1–4 spaces |
| Page number format and position      | Yes               | Yes               | Reflowable EPUB has no stable page number    | —               |
| Title, author, publisher, identifier | Document metadata | Document metadata | OPF metadata                                 | —               |
| Cover and heading chapter split      | —                 | —                 | Yes                                          | —               |

`pageSize` supports the complete Illusions page-size collection: ISO A, JIS B, ISO B, Japanese literary/book/envelope sizes, North American office sizes, and postcard/photo sizes. Use the exported `PAGE_SIZES` list when building a UI.
