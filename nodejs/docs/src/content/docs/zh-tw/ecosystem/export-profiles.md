---
title: 匯出設定檔
description: 各輸出格式共享的呈現設定。
---

Export profile 可設定 metadata、writing mode、font、margin、page size、page number、EPUB 分章與 text flavor，但不改變語法。

```json
{ "typesetting": { "writingMode": "vertical" }, "pagination": { "pageSize": "A4" } }
```

目前 TypeScript package 的範例請看[既有指南](/zh-tw/guides/export-profiles/)。
