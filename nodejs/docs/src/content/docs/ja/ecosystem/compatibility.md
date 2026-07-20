---
title: 移行と互換性
description: Rust 主導契約へ移行する際の注意点。
---

MDI 2.0 の規範は [`SYNTAX.md`](https://github.com/illusions-lab/MDI/blob/main/SYNTAX.md) 一つです。新しい JavaScript 統合では `parseMdiSyntax` より `parse`、Rust では `parse_mdi_syntax` より `parse_document` または `parse_output` を優先します。

IR version を検査し、UTF-8 byte span を保持してください。Python と Swift は Planned で、API reference はまだありません。サイトビルドの JavaScript parser 登録は一時的な実装詳細です。
