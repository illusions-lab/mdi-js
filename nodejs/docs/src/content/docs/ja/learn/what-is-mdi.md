---
title: MDI とは？
description: Rust を唯一の構文実装とする、日本語組版向け Markdown 拡張です。
---

MDI（illusion Markdown）は、標準 Markdown にルビ、縦書き、縦中横、傍点、割注、改ページなどの日本語組版機能を加えた形式です。

構文と文書の意味は `mdi-core` が決定します。`SYNTAX.md` は規範的な仕様書であり、JavaScript、Python、Swift、CLI、remark はその契約を利用する薄いインターフェースです。

```mdi
---
mdi: "2.0"
title: 雪女
writing-mode: vertical
---

{雪女|ゆきおんな}が第^12^話に現れた。
```

構文、概念、出力を分けて学ぶには、[コア概念](/ja/learn/core-concepts/)と[完全構文リファレンス](/ja/syntax/reference/)を参照してください。
