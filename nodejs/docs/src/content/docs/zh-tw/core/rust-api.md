---
title: Rust Core API 狀態
description: mdi-core 目前公開的 API 與尚未完成的契約。
---

本頁只記錄 `mdi-core/src/lib.rs` 目前存在的公開 API。自動 rustdoc 整合是 Planned。

目前主要函式包括 `parse_mdi_syntax`（過渡 helper）、`parse_document`、`parse_output`、`parse_json`、`parse_inlines`、`serialize_mdi`、`serialize_mdi_document`、`render_html`、`render_html_document`、`render_text` 與 `render_text_document`；`MDI_SPEC_VERSION` 為 `2.0`，`MDI_IR_VERSION` 為 `1.0`。

`parse_output` 提供 validation diagnostics；獨立 validate API 尚未公開。Rust 的 MDI serializer、HTML renderer 與 baseline plain-text renderer 已可使用；export-profile-specific TXT、EPUB、DOCX 及 Rust 控制 Chromium 的 PDF API 仍是 Planned。
