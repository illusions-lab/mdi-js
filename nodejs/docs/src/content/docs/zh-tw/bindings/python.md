---
title: Python
description: illusion Markdown 的 PyO3 Python binding。
---

從 PyPI 安裝 PyO3 binding：

```bash
pip install illusion-markdown
```

發布名稱是 `illusion-markdown`，import namespace 是 `mdi`。

```python
import mdi

result = mdi.parse("{東京|とうきょう} ^12^")
html = mdi.render_html("# 題\n\n{東京|とうきょう}")
```

`parse()` 會回傳 Rust 擁有、具版本的 IR 與可恢復 diagnostics 的 JSON-compatible Python dictionary；source span 是 UTF-8 byte offset。`serialize_mdi`、`render_text`、`render_text_format`、`render_epub` 與 `render_docx` 也全都直接委派給 `mdi-core`。Python 不含 MDI tokenizer 或 renderer。
