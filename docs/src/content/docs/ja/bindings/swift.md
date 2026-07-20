---
title: Swift
description: Swift から MDI の Rust コアと文書 IR を利用する
---

Swift バインディングは、他の MDI バインディングと同じ Rust 製コアを使用する。Swift 側で MDI 構文やレンダリング規則を再実装することはない。

## SwiftPM から導入する

SwiftPM プロジェクトにこのリポジトリの Swift パッケージを追加し、アプリケーションターゲットから `MDI` を import する。パッケージ定義は [`swift/Package.swift`](https://github.com/illusions-lab/MDI/blob/main/swift/Package.swift) を参照のこと。

[TODO: Package.swift に記載された依存関係、対応プラットフォーム、および公開モジュール名をリリースごとに確認すること。]

## 共通の動作

- 完全な `.mdi` ソースを共通の Rust コアで解析する。
- 構文バージョン、IR バージョン、診断情報、UTF-8 バイト単位のソース位置を保持する。
- 文書 IR を基に各出力を生成する。
- 区切り記号の解釈やリテラルフォールバックを Swift 側で再実装しない。

言語共通のモデルは、[ドキュメント IR](/ja/core/document-ir/)、[診断とソース位置](/ja/core/diagnostics/)、[レンダリングモデル](/ja/core/rendering/)を参照のこと。
