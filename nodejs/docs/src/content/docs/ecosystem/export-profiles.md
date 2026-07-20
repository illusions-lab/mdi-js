---
title: Export profiles
description: Presentation settings shared by MDI output formats.
---

An export profile configures presentation; it does not change MDI syntax. The current package is `@illusions-lab/mdi-export-profile`.

```json
{
  "metadata": { "title": "雪女", "author": "小泉八雲" },
  "typesetting": { "writingMode": "vertical", "fontFamily": "Noto Serif JP" },
  "pagination": { "pageSize": "A4", "charactersPerLine": 40, "linesPerPage": 34 }
}
```

Profiles can carry metadata, writing mode, fonts, indentation, page geometry, page numbers, EPUB chapter splitting, and text-flavor settings. See the [format guide](/guides/export-profiles/) for the current TypeScript package examples.
