---
title: 轉譯模型與 Chromium/PDF 邊界
description: Rust-owned MDI 語意如何流向 baseline export、可設定 publication adapter 與 PDF host。
---

**先備知識：**[Document IR](/zh-tw/core/document-ir/)、[export profiles](/zh-tw/ecosystem/export-profiles/)。

## 一份語意、兩層設定

Rust 擁有 `.mdi` parse、diagnostic code、UTF-8 span，以及 semantic HTML/baseline EPUB/DOCX/TXT。它是 ruby、tate-chu-yoko、不換行、kern、blank paragraph、pagebreak 等 MDI 意義的唯一 authority。

EPUB/DOCX adapter 對已 parse 的 Rust IR 套用 metadata、chapter、typography、page setup、numbering。Chromium path 與 app UI preference 是 host 設定。這樣不把 platform-specific print policy 塞入 parser。

預設 publisher profile 為 A4、上下 20 mm、左右 18 mm、40 字 × 30 行及 `gridMode: "strict"`。strict 從 printable area/grid 推導 body size/leading，並拒絕 `fontSize`/`lineSpacing`，避免設定無聲偏離要求的 grid。需要明確 size/leading 時使用 `gridMode: "typographic"`。它是 renderer sizing calculation 的契約；內容、heading、強制 break、已安裝 font、reader/browser layout 都可能影響頁面，因此不宣稱每個結果頁面精確有 40×30 glyph slots。

| 輸出 | baseline | 可設定 route |
| --- | --- | --- |
| HTML | `renderHtml(source)` | `{ bodyOnly: true }` 或附 diagnostics/headings 的 `renderHtmlWithDiagnostics`。 |
| TXT | `renderTextFormat` | caller 傳入 indent。 |
| EPUB | `renderEpub(source)` | `await renderEpub(source, { profile, cover })`。 |
| DOCX | `renderDocx(source)` | `await renderDocx(source, profile)`。 |
| PDF | — | `@illusions-lab/mdi/node` 將 Rust HTML 與 profile 交給 Chromium-capable host。 |

## diagnostics 與 HTML

匯出 UI 先呼叫 `parse(source)`/`prepareRender(source)`。`document` 保留 span，`diagnostics` 保留 warning。`renderHtmlWithDiagnostics` 另回傳 HTML 與 headings。Rust ABI 尚不能讓 renderer 接受 serialized IR handle，因此 helper 依序以同一份 source validate/render，而不創造第二個 parser。

`renderHtml` 回傳有 stylesheet 的完整 page；`bodyOnly` 回傳供 app shell 使用的 body contents。ruby 使用 `<ruby>`/`<rt>`/`<rp>`，MDI extension 有可預期的 `mdi-*` class。

## EPUB/DOCX

單一參數的 synchronous call 是 Rust baseline export。可設定 call 為 async，會把 Rust IR 結構轉換至 Node adapter，JavaScript 不會重新 parse MDI source。EPUB 接受 metadata、直排、font、indent、chapter level、JPEG/PNG cover；DOCX 接受 metadata、page size/orientation/margin、font/size/line spacing/indent、page number。

DOCX 將 pagebreak、書寫方向、paragraph 與可用 inline/run formatting map 到 OOXML。ruby、tate-chu-yoko、禁則/不換行、kern、強制 blank 的結果是 OOXML approximation，不是 browser-identical。重要組版請在實際 reader 驗證。

## Chromium/PDF 邊界

`@illusions-lab/mdi/node` 的 `preparePdfExport(source, profile)` 回傳 Rust HTML、profile 與 front matter writing direction；Electron 可在自己的 BrowserWindow print。`renderPdfWithChromium` 會 load 另外安裝的 `@illusions-lab/mdi-to-pdf` (Playwright)，或使用 Electron-compatible `{ renderHtmlToPdf }` adapter。

PDF adapter 套用紙張、橫向、邊距、直/橫排、font/size/line spacing、每行字數/每頁行數、indent、page number。browser WASM 不能 spawn Chromium，須把 request 交給 Node/Electron/Tauri/CLI host。Chromium 收到的是完成 HTML/CSS，從不接觸 `.mdi`。

- [JavaScript / TypeScript](/zh-tw/bindings/javascript/)
- [CLI](/zh-tw/bindings/cli/)
- [Diagnostics](/zh-tw/core/diagnostics/)
