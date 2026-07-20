---
title: 渲染模型與 Chromium/PDF 邊界
description: 分離語法與 IR 意義和輸出排版。
---

HTML、TXT、EPUB、DOCX、PDF 都從同一份 IR 轉換。Chromium 不解析 MDI，只負責 Rust 產生的 HTML 與 print CSS 的排版和 `printToPDF`。

目前 Node 輸出 package 使用 mdast/HAST、Playwright、JSZip 與 docx。Rust-native renderer API 在目前 crate 尚未提供的部分均為 Planned。
