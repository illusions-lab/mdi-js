# `@illusions-lab/mdi-export-profile`

Typed export-profile schema shared by MDI output adapters. A profile controls
presentation and metadata—page geometry, typography, page numbers, EPUB
chapters, and publication-text options—without changing MDI syntax.

## Install

```sh
npm install @illusions-lab/mdi-export-profile
```

## Usage

```ts
import { parseExportProfileJson, resolveExportProfile } from "@illusions-lab/mdi-export-profile";

const profile = resolveExportProfile({
  metadata: { title: "A short work", language: "ja" },
  typesetting: {
    writingMode: "vertical",
    fontFamily: "Noto Serif JP",
    // Point sizes belong to typographic mode; strict is the default manuscript grid.
    fontSize: 11,
    lineSpacing: 1.5,
  },
  pagination: { gridMode: "typographic" },
});

const fromFile = parseExportProfileJson('{"pagination":{"pageSize":"A5"}}');
```

Use the resolved profile with the JavaScript PDF/mdast adapters or pass a JSON
profile to `mdi build --config export.json`. Rust remains responsible for MDI
syntax and document semantics.

The default is a strict publisher manuscript grid: A4, 40 characters × 30
lines, with 20 mm top/bottom and 18 mm left/right margins. In
`pagination.gridMode: "strict"`, `charactersPerLine` and `linesPerPage` are
the physical page contract; supplying `fontSize` or `lineSpacing` is rejected
so no renderer can silently change the promised count. Set
`pagination.gridMode: "typographic"` only when a point size and a CSS/Word
line-spacing multiplier deliberately take priority instead.

The strict character count is a full-width CJK manuscript grid. It fixes the
printable inline extent, body cell pitch, and line pitch in DOCX/PDF; it does
not falsely treat proportional Latin glyphs, ruby, or inline media as one
fixed-width character each. Applications that need a submission-specific
count should run their own source validation as well.
The older `fontSizePt` and `lineHeight` spellings are accepted as aliases when
reading existing JSON, but new profiles should use `fontSize` and
`lineSpacing`.

## Documentation

- [Export-profile guide](https://mdi.illusions.app/guides/export-profiles/)
- [API reference](https://mdi.illusions.app/api/export-profile/)
- [JavaScript documentation](https://mdi.illusions.app/bindings/javascript/)
