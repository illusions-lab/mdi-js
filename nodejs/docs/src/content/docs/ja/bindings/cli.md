---
title: CLI
description: 現在実装されている mdi build コマンド。
---

`npm install --global @illusions-lab/mdi-cli` でインストールします。

```text
mdi build <input.mdi> --to html|pdf|epub|docx|txt|txt-ruby|narou|kakuyomu|aozora|txt-all [--config export.json] [-o <output>]
```

現在の CLI は remark/micromark と既存の Node 出力 package を使います。Rust を薄く呼び出す将来の境界は Planned であり、CLI は独自の構文権威ではありません。個別の `help` / `version` command は現在の source にありません。
