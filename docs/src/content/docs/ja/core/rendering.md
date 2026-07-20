---
title: レンダリングモデルと Chromium/PDF の境界
description: Rust-owned MDI semantics が baseline export、設定付き publication adapter、PDF host に流れる仕組み。
---

**前提:** [Document IR](/ja/core/document-ir/)、[Export profiles](/ja/ecosystem/export-profiles/)。

## 一つの意味、二層の設定

Rust は `.mdi` parse、diagnostic code と UTF-8 span、semantic HTML/baseline EPUB/DOCX/TXT を所有します。ruby、tate-chu-yoko、改行禁止、kern、blank paragraph、pagebreak の意味を決める唯一の authority です。

EPUB/DOCX adapter は既に parse 済みの Rust IR に metadata、chapter、typography、page setup、numbering を適用します。Chromium path や application UI preference は host の設定です。platform 固有の print policy を parser に混ぜません。

default publisher profile は A4、上下 20 mm・左右 18 mm、40 字 × 30 行、`gridMode: "strict"` です。strict は printable area と grid から body size/leading を導出し、`fontSize`/`lineSpacing` を reject して設定が grid から静かにずれないようにします。explicit size/leading を優先するなら `gridMode: "typographic"` を使います。これは renderer の sizing calculation の契約であり、content、heading、強制 break、installed font、reader/browser layout を越えて各 page が正確に 40×30 glyph slot になるという主張ではありません。

| 出力 | baseline | 設定付き route |
| --- | --- | --- |
| HTML | `renderHtml(source)` | `{ bodyOnly: true }`、または diagnostics/headings 付き `renderHtmlWithDiagnostics`。 |
| TXT | `renderTextFormat` | caller が indent を渡す。 |
| EPUB | `renderEpub(source)` | `await renderEpub(source, { profile, cover })`。 |
| DOCX | `renderDocx(source)` | `await renderDocx(source, profile)`。 |
| PDF | — | `@illusions-lab/mdi/node` が Rust HTML と profile を Chromium host に渡す。 |

## diagnostics と HTML

export UI では先に `parse(source)`/`prepareRender(source)` を呼びます。`document` は span、`diagnostics` は warning を保持します。`renderHtmlWithDiagnostics` は HTML と headings も返します。Rust ABI は serializable IR handle をまだ renderer に渡せないため、同じ source を順に validate/render し、別 parser を作りません。

`renderHtml` は stylesheet 付き page、`bodyOnly` は app shell 用の body contents を返します。ruby は `<ruby>`/`<rt>`/`<rp>`、MDI extension は predictable な `mdi-*` class です。

## EPUB/DOCX

一引数の synchronous call は Rust baseline export です。設定付き call は async で Rust IR を adapter に構造変換し、JavaScript が MDI source を再 parse することはありません。EPUB は metadata、縦書き、font、indent、chapter level、JPEG/PNG cover を、DOCX は metadata、page size/orientation/margin、font/size/line spacing/indent、page number を受け取ります。

DOCX は pagebreak、書字方向、paragraph と可能な inline/run formatting を OOXML に map します。ruby、tate-chu-yoko、禁則/改行禁止、kern、強制 blank は browser identical ではなく OOXML の近似です。重要な組版は実際の reader で確認してください。

## Chromium/PDF の境界

`@illusions-lab/mdi/node` の `preparePdfExport(source, profile)` は Rust HTML、profile、front matter の writing direction を返し、Electron は自前 BrowserWindow で print できます。`renderPdfWithChromium` は別 install の `@illusions-lab/mdi-to-pdf` (Playwright) を load するか Electron-compatible `{ renderHtmlToPdf }` adapter を使います。

PDF adapter は paper、landscape、margin、縦横、font/size/line spacing、文字数/行数、indent、page number を適用します。browser WASM は Chromium を spawn できないため request を Node/Electron/Tauri/CLI host へ送ります。Chromium が受け取るのは完成 HTML/CSS であり `.mdi` ではありません。

- [JavaScript / TypeScript](/ja/bindings/javascript/)
- [CLI](/ja/bindings/cli/)
- [Diagnostics](/ja/core/diagnostics/)
