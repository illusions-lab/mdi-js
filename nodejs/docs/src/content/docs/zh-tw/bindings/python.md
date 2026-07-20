---
title: Python
description: Python binding 的狀態與預期契約。
---

**Planned。** repository 的 `python/README.md` 明確寫著尚未實作。目前沒有可安裝的 package 或公開 API，因此本網站不建立虛假的 API reference。

預期 binding 會透過 PyO3 等方式呼叫 `mdi-core`，保留相同的 IR、診斷、UTF-8 byte span 與例外契約；Python 不會自行實作 tokenizer。
