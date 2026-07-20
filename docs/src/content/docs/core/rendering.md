---
title: Rendering model and the Chromium/PDF boundary
description: How Rust-owned MDI semantics flow to baseline exports, configured publication adapters, and a host PDF engine.
---

**Prerequisites:** [Document IR](/core/document-ir/) and [Export profiles](/ecosystem/export-profiles/).

## One semantic source, two layers of settings

Rust owns the `.mdi` parse, diagnostic codes and UTF-8 spans, and semantic HTML/baseline EPUB/DOCX/TXT output. It is the authority for ruby, tate-chu-yoko, no-break, kerning, blank paragraphs, page breaks, and all other MDI meaning.

Publication settings are deliberately separate. EPUB/DOCX adapters apply metadata, chapters, typography, page setup, and numbering to that already-parsed IR. A host applies browser/PDF settings such as Chromium location and application UI preferences. This avoids putting platform-specific print policy into the parser.

The default publisher profile is A4 with 20 mm top/bottom and 18 mm left/right margins, a 40-character × 30-line grid, and `gridMode: "strict"`. Strict mode derives body size and leading from that printable area, and rejects explicit `fontSize`/`lineSpacing` so a profile cannot quietly drift from its requested grid. Use `gridMode: "typographic"` for an explicit size or leading. This governs the renderer's sizing calculation; page content, headings, forced breaks, installed fonts, and reader/browser layout mean it is not a blanket assertion that every resulting page has exactly 40×30 visible slots.

| Output | Baseline API | Configured route |
| --- | --- | --- |
| HTML | `renderHtml(source)` | `{ bodyOnly: true }`, or `renderHtmlWithDiagnostics` for output + headings/spans. |
| TXT | `renderTextFormat(source, format, indentPrefix)` | caller supplies text indentation. |
| EPUB | `renderEpub(source)` | `await renderEpub(source, { profile, cover })` or aliases such as `title`, `chapterSplitLevel`, and `coverImage`. |
| DOCX | `renderDocx(source)` | `await renderDocx(source, profile)` with metadata, page, type, and page-number values. |
| PDF | — | `@illusions-lab/mdi/node` hands Rust HTML and an `ExportProfile` to a Chromium-capable host. |

## Diagnostics, headings, and semantic HTML

Call `parse(source)` or `prepareRender(source)` before offering export when the UI must display warnings. Its `document` preserves spans and `diagnostics`; source errors do not become exceptions merely because an export can fall back to literal text. `renderHtmlWithDiagnostics(source, options)` retains the same information with the HTML plus source-order headings. The renderer cannot yet take a serialized IR handle, so this helper validates and renders from the same source in sequence rather than inventing a second parser.

HTML is semantic and stable: `renderHtml` returns a complete page including MDI CSS, while `bodyOnly` returns only `<body>` contents for an app shell. Ruby uses `<ruby>`, `<rt>`, and `<rp>`; MDI extensions have predictable `mdi-*` classes for host styling.

## EPUB and DOCX

The single-argument calls are synchronous Rust baseline exports: useful when front matter is enough and no publication profile is required. The configured calls are asynchronous because the package structurally converts the Rust IR to the EPUB/DOCX publication adapters — MDI source is not reparsed in JavaScript.

Configured EPUB accepts title/author/publisher/language/date/identifier, vertical writing, font family, text indent, `h1`/`h2`/`h3`/`none` chapter splitting, and a JPEG/PNG cover. Configured DOCX accepts metadata; page size, orientation and four margins; writing direction, font family, font size, line spacing and indent; and page-number visibility, position and `simple`/`dash`/`fraction` format.

DOCX maps page breaks, writing direction, ordinary paragraphs, and available inline/run formatting to OOXML. Its ruby, tate-chu-yoko, kinsoku/no-break, kerning, and forced-blank behavior is necessarily an OOXML approximation, not a claim of browser-identical typography. Verify a target reader when those features determine layout.

## The Chromium/PDF boundary

`preparePdfExport(source, profile)` in `@illusions-lab/mdi/node` returns Rust-produced HTML, the profile, and front-matter writing direction. Electron can print that request through its own BrowserWindow. `renderPdfWithChromium(source, profile)` instead loads the optional, separately installable `@illusions-lab/mdi-to-pdf` Node adapter (Playwright) unless you pass an Electron-compatible `{ renderHtmlToPdf }` adapter.

The PDF adapter owns Chromium execution and applies paper size, landscape, margins, vertical/horizontal flow, font family/size/line spacing, characters-per-line, lines-per-page, first-line indentation, and page numbers. Browser WASM cannot spawn Chromium; browser code should prepare the request and send it to a Node, Electron, Tauri, or CLI host. Chromium receives completed HTML/CSS, never `.mdi` source, so it cannot change MDI syntax meaning.

## Next steps

- [JavaScript / TypeScript](/bindings/javascript/) for executable API examples.
- [CLI](/bindings/cli/) for profile-driven shell exports.
- [Diagnostics](/core/diagnostics/) for error codes and byte spans.
