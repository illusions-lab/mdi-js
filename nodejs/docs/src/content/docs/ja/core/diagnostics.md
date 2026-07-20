---
title: 診断と UTF-8 ソーススパン
description: すべての MDI インターフェースで保持する診断データです。
---

診断は `severity`、安定した `code`、`message`、任意の `span` を持ちます。span は元の UTF-8 ソースに対する半開 byte 範囲であり、JavaScript の UTF-16 index ではありません。

現在の移行中 Rust parser は診断フィールドを wire contract に保持しますが、通常の不正入力に対する診断をまだ出力しません。利用側は空の配列を含め、将来の安定した code を受け取れるようにしてください。
