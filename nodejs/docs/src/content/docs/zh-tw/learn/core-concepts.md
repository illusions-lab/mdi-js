---
title: 核心概念
description: 所有 MDI 語言接口都必須共享的概念。
---

MDI 分成語法、版本化文件 IR、診斷與 rendering output 三層。binding 可以使用主機語言慣用的名稱，但不能改變意義。

- 完整 UTF-8 原始碼交給 Rust core。
- IR 包含 syntax version、IR version、節點、front matter 與 source spans。
- 診斷包含 severity、穩定 code、message 與 UTF-8 byte span。
- export profile 是呈現設定，不會改變語法。

請閱讀[文件 IR](/zh-tw/core/document-ir/)、[診斷](/zh-tw/core/diagnostics/)與[渲染模型](/zh-tw/core/rendering/)。
