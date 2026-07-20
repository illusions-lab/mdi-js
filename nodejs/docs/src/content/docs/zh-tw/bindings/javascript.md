---
title: JavaScript / TypeScript
description: 目前的型別化 JavaScript 接口。
---

以 `npm install @illusions-lab/mdi` 安裝，將完整 source 傳給 `parse`：

```ts
import { parse } from '@illusions-lab/mdi';
const result = parse('第^12^話');
console.log(result.document, result.diagnostics);
```

接口保留 IR version 與 UTF-8 byte span。Remark adapter 也使用這個 Rust 結果映射 mdast，因此一般 CLI 與 renderer 的入口不讓 micromark 決定 MDI 語法。既有 Node output package 仍是消費該 mdast 相容形狀的 JavaScript renderer；Rust-native renderer 是另一個里程碑。
