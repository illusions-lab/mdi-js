---
title: CLI
description: 從 shell 匯出 .mdi，並以一份 export profile 控制 EPUB、DOCX、PDF 與文字輸出。
---

**先備知識：**[快速開始](/zh-tw/guides/getting-started/)、[export profiles](/zh-tw/ecosystem/export-profiles/)。

## 安裝與 build

```bash
npm install --global @illusions-lab/mdi-cli
mdi build novel.mdi --to epub --config novel.export.json -o dist/novel.epub
```

```text
mdi build <input.mdi> --to html|pdf|epub|docx|txt|txt-ruby|narou|kakuyomu|aozora|txt-all [--config export.json] [-o <output>]
```

input 為 UTF-8。`--to` 必填；`-o` 覆寫 output path 且不可與 `txt-all` 併用；`--config` 是 [export profile](/zh-tw/ecosystem/export-profiles/) JSON。成功輸出 `Written <path>` 並以 status `0` 結束；argument/input/profile/renderer/output failure 會在 stderr 寫一行並以 status `1` 結束。

## 每種 format 的設定

| `--to` | 預設 | renderer 與 profile |
| --- | --- | --- |
| `html` | `novel.html` | Rust semantic standalone HTML；不使用 page profile。 |
| `pdf` | `novel.pdf` | Rust HTML + local Chromium；使用 print profile。 |
| `epub` | `novel.epub` | 無 config 為 Rust baseline；有 config 則用 metadata/type/chapter/cover。 |
| `docx` | `novel.docx` | 無 config 為 Rust baseline；有 config 則用 metadata/page/type/numbering。 |
| 五種 text | 對應 `.txt` | Rust text；profile 控制 indent。`aozora` 是 Shift_JIS。 |
| `txt-all` | 6 files | 輸出全部 text，拒絕 `-o`。 |

CLI 以 profile file 為基準讀取 `epub.coverPath`，只接受 PNG/JPEG；cover bytes 只放進 EPUB，不傳給 parser。`--config` 不再被 EPUB/DOCX 靜默忽略。

## profile 範例

```json
{
  "metadata": { "title": "雨の東京", "author": "Illusions", "language": "ja" },
  "typesetting": { "writingMode": "vertical", "fontFamily": "Yu Mincho", "fontSize": 11, "lineSpacing": 1.6, "textIndentEm": 1 },
  "pagination": { "pageSize": "A4", "charactersPerLine": 40, "linesPerPage": 30, "gridMode": "typographic", "margins": { "top": 20, "right": 18, "bottom": 20, "left": 18 }, "pageNumbers": { "enabled": true, "position": "bottom-center", "format": "simple" } },
  "epub": { "chapterSplitLevel": "h1", "coverPath": "cover.png" }
}
```

未提供 profile 時 publisher default 為 A4、40 字 × 30 行、上下 20 mm、左右 18 mm。`gridMode: "strict"` 是預設：它由 grid 推導 type size/leading，並拒絕明確的 `fontSize`/`lineSpacing`。本例同時指定兩者，所以選擇 `"typographic"`。grid 控制的是 sizing calculation；heading、強制 break、可用 font、target reader layout 後，並不認證每頁必定恰為 40×30 glyph slots。

MDI parse/diagnostic/span 的所有權在 Rust。profile 是 publication policy，而 PDF geometry 與 Chromium layout 是 host policy。PDF 需要 `@illusions-lab/mdi-to-pdf` 與 local Chromium；Chromium 收到的是完成 HTML，不是 `.mdi`。DOCX 支援 page/type/numbering，卻不保證 ruby、tate-chu-yoko、禁則/不換行、kern、blank paragraph 與 browser 排版像素一致，請在目標 reader 驗證。
