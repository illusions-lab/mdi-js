---
title: HTML / TXT / EPUB / DOCX / PDF 輸出
description: 各輸出格式與排版邊界。
---

所有輸出都是同一份 MDI IR 的轉換。現有 Node package 在 mdast/HAST 層實作；PDF 的 Chromium 只排版 HTML/print CSS，不解析 MDI。尚未由 crate 提供的 Rust-native renderer 均為 Planned。
