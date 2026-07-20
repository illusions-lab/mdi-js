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

`txt-all` writes all text variants beside the input and does not accept `-o`. The current CLI implementation reads through its remark/micromark pipeline and calls the existing Node output packages. The intended future boundary is a thin CLI over Rust; the current implementation should not be read as a competing grammar authority.

There is no separate `help` or `version` command in the current `cli.ts`; the usage line above is taken from the source.
