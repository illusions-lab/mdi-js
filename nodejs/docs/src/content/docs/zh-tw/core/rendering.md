---
title: 渲染模型與 Chromium/PDF 邊界
description: 分離語法與 IR 意義和輸出排版。
---

HTML、TXT、EPUB、DOCX、PDF 都從同一份 IR 轉換。Chromium 不解析 MDI，只負責 Rust 產生的 HTML 加上 print CSS 的排版和 `printToPDF`。

CLI 的 HTML、TXT、EPUB、DOCX 都直接走 Rust；PDF 則將 Rust HTML 交給 Chromium adapter。mdast/HAST package 保留為 unified 使用者的公開相容 adapter，不是 CLI 的語法或語意渲染路徑。EPUB/DOCX 的完整 export-profile 與 cover options 仍待補入 Rust。
