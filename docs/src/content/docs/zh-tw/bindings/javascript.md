---
title: JavaScript / TypeScript
description: 從 JavaScript 使用 Rust 決定的 MDI 語意，並選擇 baseline 或可設定的匯出。
---

**先備知識：**[快速開始](/zh-tw/guides/getting-started/)、[Document IR](/zh-tw/core/document-ir/)。

## 安裝與先 parse

```bash
npm install @illusions-lab/mdi
```

此 package 以預建 WASM 執行 `mdi-core`。可用於 Node.js 與支援 WASM import 的 bundler，consumer machine 不需 native build。編輯器或匯出 UI 應先 `parse()`，讓 warning 與 span 可被顯示：

```ts
import { parse, renderHtmlWithDiagnostics } from "@illusions-lab/mdi";

const source = "# 第一章\n{東京|とうきょう}は雨だった。";
const parsed = parse(source);
if (parsed.diagnostics.some((item) => item.severity === "error")) {
  // 用 code 與 UTF-8 byte span 標示 editor
}
const result = renderHtmlWithDiagnostics(source, { bodyOnly: true });
console.log(result.output);   // <body> 的 semantic contents
console.log(result.headings); // source-order heading 的 depth、text、span
```

`parse` 回傳 Rust-owned `document`、`diagnostics` 與 UTF-8 byte span。目前唯一已實作 diagnostic code 為 `mdi.version.unsupported`；多數格式錯誤採 literal fallback，不會 throw。`prepareRender(source)` 也適合 parse-first workflow。`*WithDiagnostics` 會保留 output 與 parser result，但不會自動把 warning 變成 error。

`renderHtml(source)` 回傳含 MDI stylesheet 的 standalone HTML；app 擁有外層頁面時傳 `{ bodyOnly: true }`。semantic HTML 有穩定的 `mdi-ruby`、`mdi-tcy`、`mdi-em`、`mdi-pagebreak` 等 class。

## baseline 與可設定 EPUB/DOCX

一個參數的 API 是 synchronous Rust baseline export：

```ts
import { renderEpub, renderDocx } from "@illusions-lab/mdi";
await writeFile("book.epub", renderEpub(source));
await writeFile("book.docx", renderDocx(source));
```

需要出版設定時，使用兩個參數的 overload（或明確的 `WithProfile` 名稱）並 `await`。它會把已 parse 的 Rust IR 結構轉換給 Node publication adapters，不會在 JavaScript 重新 parse MDI source。

```ts
const epub = await renderEpub(source, {
  title: "雨の東京", author: "Illusions", language: "ja",
  publisher: "Illusions Lab", identifier: "urn:isbn:example", date: "2026-07-21",
  verticalWriting: true, fontFamily: "Yu Mincho", textIndent: 1,
  chapterSplitLevel: "h1", coverImage: coverBytes, coverMediaType: "image/png",
});

const docx = await renderDocx(source, {
  title: "雨の東京", author: "Illusions", verticalWriting: true,
  fontFamily: "Yu Mincho", fontSize: 11, lineSpacing: 1.6, textIndent: 1,
  pagination: { gridMode: "typographic" },
  pageSize: "A5", landscape: false,
  margins: { top: 18, right: 15, bottom: 18, left: 15 },
  showPageNumbers: true, pageNumberPosition: "bottom-center", pageNumberFormat: "simple",
});
```

EPUB 支援 metadata、直排、font、indent、`h1`/`h2`/`h3`/`none` chapter split，以及 PNG/JPEG `Uint8Array` cover。DOCX 支援 metadata、page size/orientation/margin、font/size/line spacing/indent、page number（`simple`/`dash`/`fraction`）。兩者亦支援完整 nested `ExportProfile`；完整 JSON schema 見 [export profiles](/zh-tw/ecosystem/export-profiles/)。

預設 publication profile 是 A4、40 字 × 30 行、上下 20 mm、左右 18 mm。`pagination.gridMode` 預設為 `"strict"`：adapter 從 printable area/grid 推導 body size 與 line height，並拒絕 `fontSize` 或 `lineSpacing`，避免設定無聲偏離 grid。若 point size/line spacing 比 grid 更重要，設 `gridMode: "typographic"`。這是 sizing contract，不保證 heading、強制 break、font、reader layout 等實際因素後的每一頁都恰有 40×30 glyph slots。

## 設定的所有權與 DOCX 限制

Rust 擁有 grammar、diagnostic、span、semantic HTML/baseline export。EPUB/DOCX profile 屬 publication adapter；紙張、Chromium 與 app UI preference 屬 host。DOCX 可將 page break、直排及一般 paragraph/run 對應到 OOXML，但不承諾 ruby、tate-chu-yoko、禁則/不換行、kern、強制 blank paragraph 與 browser HTML 像素一致。這些日文排版很重要時，請在目標 Word-compatible reader 驗證。

## HTML/PDF host

```ts
import { preparePdfExport, renderPdfWithChromium } from "@illusions-lab/mdi/node";

const request = preparePdfExport(source, profile); // 可交給 Electron print API
const pdf = await renderPdfWithChromium(source, profile);
```

Node 的 default PDF adapter 要另外 `npm install @illusions-lab/mdi-to-pdf`。Electron 可傳入 `{ renderHtmlToPdf(html, profile, sourceWritingMode) }` adapter。PDF profile 支援紙張、橫向、邊距、直/橫排、font、font size/line spacing、每行字數/每頁行數、indent、page number。browser/WASM 無法啟動 Chromium，應把 `preparePdfExport()` 交給 Node/Electron/Tauri/CLI host。

非字串 source 與無效 option 都是 `TypeError`。diagnostic 應作為 document feedback；只有 I/O/archive/host renderer failure 才適合 `try`/`catch`。span 是 UTF-8 **byte** offset，不是 JavaScript string index。
