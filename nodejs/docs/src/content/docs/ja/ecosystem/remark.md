---
title: Remark / mdast アダプター
description: remark は MDI 構文の権威ではありません。
---

Remark は unified plugin と mdast が必要な場合の adapter です。理想的な境界は `source → Rust IR → mdast ⇄ unified plugins` です。remark 自身が MDI tokenizer、grammar、fallback を持つことはありません。

現在の Node checkout では互換性のため micromark/mdast 統合を登録しています。これは移行中の実装詳細です。
