---
title: アーキテクチャ
description: Rust を唯一の構文権威とし、各言語を薄いバインディングにする設計。
---

## 1 つのパーサ、複数言語のバインディング

MDI は Rust を唯一の実行可能な構文権威とする構成へ移行しています。
CommonMark、GFM、フロントマター、MDI 拡張を含む `.mdi` 文書全体を Rust
で一度だけ解析し、バージョン付きの言語中立な文書 IR を生成します。

```text
.mdi ソース
    ↓
Rust parser → MDI document IR → Rust renderers
    │                  │              ├─ HTML / TXT / EPUB / DOCX
    │                  │              └─ HTML/CSS → Chromium → PDF
    │                  └─ mdast compatibility adapter
    └─ JavaScript / Python / Swift bindings
```

各言語のバインディングは文字列、バイト列、エラー、オブジェクト形状だけを
変換し、構文を認識・検証しません。`kern` の妥当性や入れ子マクロの対応する
閉じ位置などの規則は Rust にだけ実装します。

## 文書全体を Rust で解析する理由

MDI の境界は Markdown の文脈に依存します。

```markdown
`^12^`                 <!-- code 内ではリテラル -->
**第^12^話**           <!-- strong 内の MDI -->
[[em:**重要**]]        <!-- MDI 内の Markdown -->
```

CommonMark の解析を各ホスト言語に任せると、MDI 境界の一部も各言語が決める
ことになります。そのため、目標の Rust パーサは CommonMark/GFM と MDI を
一緒に扱います。

## レンダラー

HTML とテキスト出力は決定的なシリアライズなので Rust に置きます。EPUB も
XHTML、CSS、メタデータ、ZIP の組み立てです。DOCX は Word 固有のルビ・縦書き
互換性テストが必要なため、コア形式の安定後に移行します。

PDF は意図的に実ブラウザを使います。Rust が HTML と印刷 CSS を生成し、
Chromium を起動して `printToPDF` を呼び、PDF バイト列を返します。日本語の
縦書き、縦中横、傍点、ルビ、フォント shaping、ページ分割は Chromium が
担当し、Rust でブラウザのレイアウトエンジンを作り直しません。

## JavaScript API と remark 互換

`@illusions-lab/mdi` が新しい薄い JavaScript バインディングです。第 1 段階の
`parseMdiSyntax` は、Rust のバージョン付き IR と capability flags を返します。
完全な CommonMark/GFM/MDI パーサが Rust に移るまで、汎用 `parse` API は公開
しません。

既存の micromark/remark パーサは差分テスト用の oracle として一時的に残します。
長期的な第 2 実装ではありません。必要なら Rust IR から mdast への互換 adapter
を提供しますが、そこに構文規則は置きません。

## 移行順序

1. バージョン付き IR 契約と型付き JavaScript binding。
2. Rust による完全な CommonMark/GFM/MDI/front-matter parser。
3. Rust の正規化、検証、修復、`.mdi` シリアライズ。
4. Rust の TXT、HTML、EPUB renderer。
5. Rust の DOCX renderer と Rust 制御の Chromium PDF パイプライン。
6. 同じ API に対する Python、Swift binding。

詳細はリポジトリの
[`ARCHITECTURE.md`](https://github.com/illusions-lab/MDI/blob/main/ARCHITECTURE.md)
を参照してください。

## バージョニング

パッケージのバージョンは `<MDI 仕様バージョン>.<リリース回数>` です。
major.minor は対象の MDI 仕様、patch は各パッケージ独自の `.1` から始まる
リリースカウンタです。
