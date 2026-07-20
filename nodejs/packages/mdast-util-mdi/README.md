# `mdast-util-mdi`

Bidirectional adapter between the versioned Rust MDI document IR and mdast.

```text
Rust document IR ⇄ mdast
```

The IR-to-mdast direction creates CommonMark, GFM, front-matter, and MDI node
shapes for unified-compatible tools. The mdast-to-IR direction converts a
modified tree back into the stable wire representation; Rust then validates,
normalizes, serializes, or renders it.

This package does not parse MDI source and contains no tokenizer, grammar
tables, delimiter matching, or literal-fallback rules. `mdi-core` remains the
sole executable syntax authority in both directions.

Use [`@illusions-lab/mdi`](../mdi) to parse complete source documents. Use this
package when an application needs to run mdast or unified tooling over a Rust
parse result.

Part of the [MDI](https://github.com/illusions-lab/MDI) monorepo. See the
[architecture documentation](https://mdi.illusions.app/guides/architecture/)
for ownership and wire-contract details.
