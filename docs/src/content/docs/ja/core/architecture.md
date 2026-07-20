---
title: Rust を正とするアーキテクチャ
description: 実行可能な文法は一つ、バージョン付き IR も一つです。
---

**前提:** [コア概念](/ja/learn/core-concepts/)。

## ルール

`mdi-core` 以外の binding、adapter、editor、renderer は MDI 文法の第二実装を持ってはいけません。トークナイザ、WASM 非ロード時の正規表現フォールバック、言語ごとの手書き実装のいずれも不可です。すべての `.mdi` は Rust の一回の解析で CommonMark、GFM、front matter、MDI を同じ木へ変換します。

## 二つの権威

1. [`SYNTAX.md`](https://github.com/illusions-lab/MDI/blob/main/SYNTAX.md) は人が読む規範仕様です。
2. `mdi-core` はその唯一の実行可能な実装です。
3. 共有 conformance fixture が両者の検証可能な契約です。

## 全体像

```text
.mdi source → mdi-core (Rust) → versioned Document IR
                              ├→ Rust: HTML / TXT / EPUB / DOCX / PDF
                              ├→ Node.js / Python / Swift / Kotlin（実装済み）
                              └→ remark/mdast adapter (実装済み)
HTML + print CSS → Chromium → PDF
```

Rust、Node.js、Swift、Kotlin、Python はいずれもこの同じ Rust core を呼びます。具体的な API は [Bindings](/ja/bindings/javascript/) を参照してください。

## なぜ一回の解析なのか

MDI の境界は Markdown の文脈に依存します。

```markdown
`^12^`                 <!-- code span 内ではリテラル -->
**第^12^話**            <!-- strong 内では tate-chu-yoko -->
[[em:**重要**]]        <!-- MDI macro 内に Markdown -->
```

二段階解析ではこの境界を再現して食い違う危険があります。binding は文字列・バイト列・エラー・オブジェクト形状を変換してよい一方、独自の文法や renderer 意味論を追加してはいけません。

## 実装状況

| 層 | 状態 |
| --- | --- |
| `mdi-core` の完全な一回解析 | **実装済み** |
| Rust の HTML / TXT / EPUB / DOCX renderer | **実装済み**（baseline） |
| Chromium を Rust が起動する PDF | **実装済み**。 [レンダリング](/ja/core/rendering/#the-chromiumpdf-boundary) |
| JavaScript/WASM、CLI、remark adapter | **実装済み** |
| Python PyO3 binding | **実装済み**。PyPI: `illusion-markdown` |
| Swift binding | **実装済み**。 [Swift](/ja/bindings/swift/) |
| Android / Kotlin binding | **実装済み**。 [Android / Kotlin](/ja/bindings/android/) |

## 次へ

- [Document IR](/ja/core/document-ir/)
- [Rust Core API](/ja/core/rust-api/)
- [レンダリングモデル](/ja/core/rendering/)
