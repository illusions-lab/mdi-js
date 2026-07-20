---
title: エクスポート・プロファイル
description: 出力形式で共有する表示設定。
---

Export profile は metadata、writing mode、font、margin、page size、page number、EPUB 分割、text flavor を設定します。構文を変更するものではありません。

```json
{ "typesetting": { "writingMode": "vertical" }, "pagination": { "pageSize": "A4" } }
```

[既存のガイド](/ja/guides/export-profiles/)には現在の TypeScript package の例があります。
