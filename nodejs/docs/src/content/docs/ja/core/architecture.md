---
title: Rust 主導アーキテクチャ
description: 一つの実行可能な構文、バージョン付き IR、薄いインターフェース。
---

`SYNTAX.md` は人間向けの規範、`mdi-core` は実行可能な構文と IR の実装です。各バインディングと adapter は、構文規則や renderer の意味を持ちません。

```text
.mdi → mdi-core → versioned document IR → bindings / adapters / renderers
                                      └→ HTML + print CSS → Chromium → PDF
```

Astro のドキュメントビルドでは MDI 例を表示するため JavaScript の micromark/mdast 統合を登録しています。これは一時的なビルド実装であり、JavaScript が構文の権威だという意味ではありません。
