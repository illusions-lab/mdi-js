---
title: CLI
description: 現在実装されている mdi build コマンド。
---

`npm install --global @illusions-lab/mdi-cli` でインストールします。

```text
mdi build <input.mdi> --to html|pdf|epub|docx|txt|txt-ruby|narou|kakuyomu|aozora|txt-all [--config export.json] [-o <output>]
```

HTML、EPUB、DOCX とすべてのテキスト形式は Rust core が直接出力します。PDF は Rust が生成した HTML を Chromium に渡して最終レイアウトするだけで、Chromium は MDI を解析しません。profile は現在 PDF とテキスト出力に適用され、EPUB/DOCX の完全な profile parity は Rust API に追加中です。CLI は独自の構文権威ではありません。個別の `help` / `version` command は現在の source にありません。
