# @illusions-lab/mdi-cli

Thin command-line adapter for the Rust-authoritative MDI engine.

```sh
mdi build input.mdi --to html|pdf|epub|docx|txt|txt-ruby|narou|kakuyomu|aozora|txt-all \
  [--config export.json] [-o output]
```

HTML, EPUB, DOCX, and text output call `mdi-core` directly through the
JavaScript binding. PDF passes Rust-rendered HTML to Chromium solely for page
layout; Chromium never receives or parses MDI source. `--config` currently
applies PDF and text settings. EPUB and DOCX use Rust's deterministic baseline
and front matter metadata while their full profile options move into Rust.

`txt-all` writes every text variant next to the input and does not accept `-o`.

Part of the [MDI](https://github.com/illusions-lab/MDI) monorepo. See the root README for the full package architecture.

Documentation: https://mdi.illusions.app/
