# `micromark-extension-mdi`

Compatibility adapter from the Rust MDI parse result to
micromark-compatible events.

`mdi-core` receives the complete source document and decides all CommonMark,
GFM, front-matter, and MDI boundaries. This package projects that result into
micromark event shapes for tools that consume the micromark ecosystem.

```text
complete source → mdi-core → versioned Rust IR → micromark events
```

The adapter does not tokenize source, register MDI grammar rules, validate
delimiters, or provide a syntax fallback. Event positions are derived from the
UTF-8 source spans in the Rust IR, so they preserve the decisions made by
`mdi-core`.

Use [`@illusions-lab/mdi`](../mdi) as the primary JavaScript parsing and
rendering API. Use this package only when an integration specifically requires
micromark-compatible events.

Part of the [MDI](https://github.com/illusions-lab/MDI) monorepo. See the
[architecture documentation](https://mdi.illusions.app/guides/architecture/)
for ownership and wire-contract details.
