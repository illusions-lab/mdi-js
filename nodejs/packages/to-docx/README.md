# @illusions-lab/mdi-to-docx

Creates a DOCX file from an MDI-flavoured mdast tree. It is a profile-aware
compatibility adapter for unified applications and does not parse MDI source.

## Install

```sh
npm install @illusions-lab/mdi-to-docx
```

## Usage

```ts
import { writeFile } from "node:fs/promises";
import { mdiToDocx } from "@illusions-lab/mdi-to-docx";

const document = await mdiToDocx(mdastTree, {
  typesetting: { writingMode: "vertical", fontFamily: "Noto Serif JP" },
});
await writeFile("book.docx", document);
```

For complete `.mdi` source, use `renderDocx(source)` from
[`@illusions-lab/mdi`](https://www.npmjs.com/package/@illusions-lab/mdi), or
its profile-aware `renderDocx(source, profile)` overload when page and
typesetting settings are required. The CLI uses the same profile-aware route
when passed `--config`.

## MDI construct mapping

DOCX is an OOXML print target, not a lossless CSS layout engine. The adapter
uses native Word constructs where they exist and intentionally documents the
remaining fallbacks:

| MDI construct | DOCX output |
| --- | --- |
| ruby | Native `<w:ruby>` run |
| tate-chu-yoko | Native East Asian combined-character run |
| `[[em:...]]` | Native Word dot emphasis; Word cannot retain arbitrary MDI mark glyphs |
| `[[kern:+/-Nem:...]]` | Signed run character spacing, calculated from the current run size |
| `[[warichu:...]]` | Preserved text at 60% size; OOXML has no portable two-line warichu primitive |
| `[[no-break:...]]` | Preserved text; OOXML cannot prohibit a line break for an arbitrary run |
| blank paragraph / pagebreak | Empty paragraph / native page break |

The source mdast remains available to the host application, so a UI can retain
source spans and render diagnostics before choosing to export. This converter
does not invent diagnostics or silently claim pixel-equivalent Japanese layout.

## Documentation

- [Output model](https://mdi.illusions.app/ecosystem/outputs/)
- [Export-profile guide](https://mdi.illusions.app/guides/export-profiles/)
- [API reference](https://mdi.illusions.app/api/to-docx/)
- [JavaScript documentation](https://mdi.illusions.app/bindings/javascript/)
