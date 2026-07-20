---
title: ドキュメント IR
description: 言語に依存しない、バージョン付きの MDI 表現です。
---

IR は `syntaxVersion`、`irVersion`、`capabilities`、`document`、`diagnostics` を含みます。現在の Rust crate は MDI `2.0` と IR `1.0` を宣言します。

文書にはフロントマター、タグ付きの子ノード、元の UTF-8 ソースに対する半開 byte span が含まれます。バインディングはこの wire shape を各言語の型へ写像し、未知の IR バージョンを推測で受け入れてはいけません。

互換用の `parse_mdi_syntax` は移行用です。新しい統合では `parse_document` または `parse_output` を使用します。
