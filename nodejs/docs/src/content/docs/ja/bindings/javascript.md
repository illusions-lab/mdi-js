---
title: JavaScript / TypeScript
description: 現在の型付き JavaScript インターフェース。
---

`@illusions-lab/mdi` を `npm install @illusions-lab/mdi` でインストールし、完全なソースを `parse` に渡します。

```ts
import { parse } from '@illusions-lab/mdi';
const result = parse('第^12^話');
console.log(result.document, result.diagnostics);
```

IR version と UTF-8 byte span を保持します。remark/micromark と CLI の既存 TypeScript 経路は互換性のため残っていますが、独立した構文権威ではありません。
