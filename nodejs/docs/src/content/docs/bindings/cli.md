---
title: CLI
description: The currently shipped mdi build command and its real output formats.
---

The CLI package is `@illusions-lab/mdi-cli`. Install it with `npm install --global @illusions-lab/mdi-cli`.

The implemented command shape is:

```text
mdi build <input.mdi> --to html|pdf|epub|docx|txt|txt-ruby|narou|kakuyomu|aozora|txt-all [--config export.json] [-o <output>]
```

Examples:

```bash
mdi build novel.mdi --to html
mdi build novel.mdi --to pdf --config novel.export.json -o dist/novel.pdf
mdi build novel.mdi --to txt-all
```

`txt-all` writes all text variants beside the input and does not accept `-o`. HTML, EPUB, DOCX, and every text format are rendered directly by the Rust core. PDF receives Rust-rendered HTML and uses Chromium only for final page layout; it never parses MDI. The current profile adapter applies PDF and text settings. EPUB and DOCX use the Rust baseline and their front matter metadata while full profile parity is added to the Rust API.

There is no separate `help` or `version` command in the current `cli.ts`; the usage line above is taken from the source.
