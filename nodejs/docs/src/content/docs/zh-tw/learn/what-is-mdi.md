---
title: 什麼是 MDI？
description: 以 Rust 為唯一語法實作的日本語組版 Markdown 擴充格式。
---

MDI（illusion Markdown）在標準 Markdown 上加入 ruby、直排、縱中橫、傍點、割注與分頁等日本語組版功能。

`mdi-core` 決定語法與文件意義；`SYNTAX.md` 是規範文件。JavaScript、Python、Swift、CLI 與 remark 都只是使用這份契約的薄接口。

```mdi
---
mdi: "2.0"
title: 雪女
writing-mode: vertical
---

{雪女|ゆきおんな}が第^12^話に現れた。
```

請從[核心概念](/zh-tw/learn/core-concepts/)與[完整語法參考](/zh-tw/syntax/reference/)開始。
