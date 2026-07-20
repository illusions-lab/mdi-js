# illusion-markdown

Python bindings for [illusion Markdown (MDI)](../SYNTAX.md). The package is a
thin PyO3 interface over the repository's Rust `mdi-core`; it does not parse
or render MDI in Python.

```bash
pip install illusion-markdown
```

```python
import mdi

result = mdi.parse("{東京|とうきょう} ^12^")
html = mdi.render_html("# 題\n\n{東京|とうきょう}")
epub = mdi.render_epub("# Chapter\n\ntext")
```

`parse()` returns the versioned, JSON-compatible MDI document IR with UTF-8
byte spans and recoverable diagnostics. The package also exposes
`serialize_mdi`, `render_text`, `render_text_format`, `render_epub`, and
`render_docx`.

The PyPI distribution is named `illusion-markdown`; the import namespace is
`mdi`.
