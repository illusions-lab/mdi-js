---
title: 匯出設定檔
description: 在應用程式間共用精確的 PDF、DOCX、EPUB 與文字匯出設定。
---

`@illusions-lab/mdi-export-profile` 是 MDI 匯出的共用、已驗證設定契約。它刻意與 MDI 語法及 front matter 分離，可儲存為 JSON 檔或應用程式偏好設定。

```sh
mdi build novel.mdi --to pdf --config novel.export.json -o novel.pdf
mdi build novel.mdi --to docx --config novel.export.json
mdi build novel.mdi --to epub --config novel.export.json
mdi build novel.mdi --to txt-ruby --config novel.export.json
```

設定檔 schema 可描述書名、作者、出版社、UUID/ISBN、組方向、字體、字下げ、紙張尺寸、頁碼、EPUB 封面與見出し切章，以及 TXT 的全形空格字下げ。現行 Rust-first CLI 會將設定檔套用到 PDF 與文字輸出；EPUB/DOCX 刻意使用可重現的 Rust baseline 和 front matter metadata。封面、切章、完整 pagination/profile parity 會隨 Rust API options 補齊。

| 設定                           | PDF  | EPUB / DOCX Rust baseline | TXT / TXT ruby |
| ------------------------------ | ---- | ------------------------- | -------------- |
| 印刷版面、字體、頁碼           | 支援 | 等待 Rust options         | —              |
| front matter metadata、組方向  | 支援 | 支援                      | —              |
| 全形空格字下げ                 | 支援 | 等待 Rust options         | 1–4 個空格     |
| 封面、章節切分                 | —    | 等待 Rust options         | —              |

不合法的紙張尺寸、邊界、頁碼設定或章節切分層級會明確報錯，不會悄悄產生不同版面。UI 可使用匯出的 `PAGE_SIZES` 建立紙張尺寸選擇器。
