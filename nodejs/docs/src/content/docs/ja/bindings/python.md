---
title: Python
description: illusion Markdown の PyO3 Python バインディング。
---

PyPI から PyO3 バインディングをインストールします。

```bash
pip install illusion-markdown
```

配布名は `illusion-markdown`、import namespace は `mdi` です。

```python
import mdi

result = mdi.parse("{東京|とうきょう} ^12^")
html = mdi.render_html("# 題\n\n{東京|とうきょう}")
```

`parse()` は Rust が所有するバージョン付き IR と回復可能な diagnostics を JSON-compatible な Python dictionary として返します。source span は UTF-8 byte offset です。`serialize_mdi`、`render_text`、`render_text_format`、`render_epub`、`render_docx` もすべて `mdi-core` に直接委譲され、Python 側に MDI tokenizer や renderer はありません。
