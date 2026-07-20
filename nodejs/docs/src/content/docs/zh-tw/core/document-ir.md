---
title: 文件 IR
description: 各語言接口共享的版本化、中立表示。
---

IR 包含 `syntaxVersion`、`irVersion`、`capabilities`、`document` 與 `diagnostics`。目前 Rust crate 宣告 MDI `2.0` 與 IR `1.0`。

文件包含 front matter、tagged children 與原始 UTF-8 source 的半開 byte span。binding 應映射 wire shape，不應猜測未知 IR version 的意義。

`parse_mdi_syntax` 是過渡相容 helper；新的整合應使用 `parse_document` 或 `parse_output`。
