---
title: コア概念
description: すべての MDI インターフェースが共有する概念です。
---

MDI は、構文、バージョン付き文書 IR、診断、レンダリング出力の 3 層で考えます。バインディングは型名を各言語に合わせても、意味を変更しません。

- 完全な UTF-8 ソースは Rust コアへ渡します。
- IR には構文バージョン、IR バージョン、ノード、フロントマター、ソーススパンが含まれます。
- 診断は severity、安定した code、message、UTF-8 byte span を持ちます。
- Export profile は表示設定であり、構文を変更しません。

[Document IR](/ja/core/document-ir/)、[診断](/ja/core/diagnostics/)、[レンダリング](/ja/core/rendering/)へ進んでください。
