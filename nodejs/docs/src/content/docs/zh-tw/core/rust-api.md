---
title: Rust Core API 狀態
description: mdi-core 目前公開的 API 與尚未完成的契約。
---

本頁只記錄 `mdi-core/src/lib.rs` 目前存在的公開 API。自動 rustdoc 整合是 Planned。

目前主要函式包括 `parse_mdi_syntax`（過渡 helper）、`parse_document`、`parse_output`、`parse_json`、`parse_inlines`、`serialize_mdi`、`serialize_mdi_document`、`render_html`、`render_html_document`、`render_text`、`render_text_document`、`render_text_format`、`render_epub`、`render_docx` 與 `render_pdf`；`MDI_SPEC_VERSION` 為 `2.0`，`MDI_IR_VERSION` 為 `1.0`。

`parse_output` 提供 validation diagnostics；獨立 validate API 尚未公開。Rust 已為所有現有輸出格式提供 baseline serializer/renderer；cover media、DOCX 細部排版與完整 export-profile/pagination parity 是這些 API 後續的擴充。
