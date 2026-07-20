---
title: HTML / TXT / EPUB / DOCX / PDF 輸出
description: 各輸出格式與排版邊界。
---

所有輸出都是同一份 MDI IR 的轉換。CLI 的 HTML、TXT、EPUB、DOCX 由 Rust 直接輸出；PDF 的 Chromium adapter 只排版 Rust HTML/print CSS，不解析 MDI。mdast/HAST package 保留為 unified 相容 adapter；EPUB/DOCX 的完整 profile 與 cover options 仍待補入 Rust。
