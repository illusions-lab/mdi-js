---
title: Rust Core API の状態
description: 現在の mdi-core 公開 API と未実装の契約。
---

このページは `mdi-core/src/lib.rs` に現在存在する公開 API だけを記載します。自動 rustdoc のサイト統合は Planned です。

実装済みの主な関数は `parse_mdi_syntax`（移行用）、`parse_document`、`parse_output`、`parse_json`、`parse_inlines` です。`MDI_SPEC_VERSION` は `2.0`、`MDI_IR_VERSION` は `1.0` です。

最終的な validate、normalize、serialize、Rust-native renderer 関数は現在の crate にないため、実装済み API としては扱いません。
