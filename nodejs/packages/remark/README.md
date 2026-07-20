# `@illusions-lab/mdi-remark`

Unified/remark adapter for the Rust-authoritative MDI engine.

The adapter sends the complete source document to `mdi-core`, exposes the
resulting versioned document IR as mdast to a unified pipeline, and converts a
modified mdast tree back to Rust IR when the pipeline needs MDI serialization
or another output format.

```text
source → mdi-core → Rust IR ⇄ mdast → unified plugins
```

It does not extend remark's tokenizer and does not implement CommonMark, GFM,
front matter, or MDI syntax. All parsing, boundary decisions, validation,
normalization, serialization, and renderer semantics remain in Rust.

Use [`@illusions-lab/mdi`](../mdi) directly when unified plugins are not
required. This package exists only to connect the same Rust parse result to the
remark ecosystem.

Part of the [MDI](https://github.com/illusions-lab/MDI) monorepo. See the
[architecture documentation](https://mdi.illusions.app/guides/architecture/)
for ownership and wire-contract details.
