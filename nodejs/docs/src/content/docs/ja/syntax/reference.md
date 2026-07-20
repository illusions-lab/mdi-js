---
title: 完全構文リファレンス
description: MDI 2.0 の規範的な構文仕様への入口です。
---

完全な規範はリポジトリの [`SYNTAX.md`](https://github.com/illusions-lab/MDI/blob/main/SYNTAX.md) に一つだけ維持しています。このページはサイトの入口とクイックリファレンスです。

| 機能 | 推奨記法 | 意味 |
| --- | --- | --- |
| ルビ | `{base|reading}` | 親文字に読みを付ける |
| 縦中横 | `^12^` | 縦書き内の短い横組み |
| 傍点 | `[[em:text]]` | 強調点を付ける |
| 改行抑止 | `[[no-break:text]]` | 句の途中で改行しない |
| 改ページ | `[[pagebreak]]` | 新しいページを開始する |

```markdown
{東京|とうきょう}の第^12^話。[[em:重要]]な語です。[[br]]次の行。
```

正確な境界、入れ子、エスケープ、フォールバックは[完全な `SYNTAX.md`](https://github.com/illusions-lab/MDI/blob/main/SYNTAX.md)だけを参照してください。[ショーケース](/ja/syntax/showcase/)は出力例であり、構文の権威ではありません。
