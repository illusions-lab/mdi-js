---
title: Architecture
description: Rust as the single syntax authority, thin language bindings, and shared renderers.
---

## One parser, many language bindings

MDI is moving to a Rust-authoritative architecture. The complete `.mdi`
document — CommonMark, GFM, front matter, and MDI extensions — is parsed once
in Rust into a versioned, language-neutral document IR.

```text
.mdi source
    ↓
Rust parser → MDI document IR → Rust renderers
    │                  │              ├─ HTML / text / EPUB / DOCX
    │                  │              └─ HTML/CSS → Chromium → PDF
    │                  └─ mdast compatibility adapter
    └─ JavaScript / Python / Swift bindings
```

JavaScript, Python, and Swift bindings convert strings, byte arrays, errors,
and object shapes. They do not recognize or validate syntax. A rule such as a
valid `kern` amount or the matching close of a nested bracket macro must exist
in Rust only.

The human-readable [`SYNTAX.md`](https://github.com/illusions-lab/MDI/blob/main/SYNTAX.md),
the Rust reference parser, and shared conformance fixtures together define the
contract.

## Why Rust parses the whole document

MDI boundaries depend on Markdown context:

```markdown
`^12^`                 <!-- literal inside code -->
**第^12^話**           <!-- MDI inside strong text -->
[[em:**重要**]]        <!-- Markdown inside an MDI construct -->
```

Leaving CommonMark parsing to every host language would make those languages,
not Rust, responsible for part of the boundary decision. The target parser
therefore owns CommonMark/GFM and MDI together.

## Renderers

HTML and text output are deterministic serialization and belong in Rust. EPUB
is XHTML, CSS, metadata, and ZIP packaging, so it also shares the Rust IR and
renderer code. DOCX moves after the core formats stabilize because Word's
native ruby and vertical-writing behavior needs more integration testing.

PDF uses a real browser deliberately. Rust generates HTML and print CSS,
starts Chromium, invokes `printToPDF`, and returns the bytes. Chromium remains
the layout engine for `vertical-rl`, tate-chu-yoko, text emphasis, ruby, font
shaping, and pagination; MDI does not attempt to rebuild a browser layout
engine in Rust.

Browser WASM cannot start a local process, so browser clients use a backend or
desktop host for PDF generation.

## JavaScript API and remark compatibility

`@illusions-lab/mdi` is the new thin JavaScript binding. Stage 1 exposes
`parseMdiSyntax`, which returns an explicitly versioned Rust IR plus capability
flags. The flags currently state that CommonMark/GFM/front matter and source
spans are not integrated; the general `parse` API will be added only when Rust
owns the complete document parser.

The existing micromark/remark parser remains temporarily as a differential
test oracle. It is not a second long-term implementation. If Astro or unified
users need mdast after migration, a compatibility adapter will map the Rust IR
to mdast without making syntax decisions.

## Migration order

1. Versioned IR contract and typed JavaScript binding.
2. Full Rust CommonMark/GFM/MDI/front-matter parser and source spans.
3. Rust normalization, validation, repair, and canonical `.mdi` serialization.
4. Rust text, HTML, and EPUB renderers.
5. Rust DOCX renderer and Rust-controlled Chromium PDF pipeline.
6. Python and Swift bindings over the same APIs.

See the repository's
[`ARCHITECTURE.md`](https://github.com/illusions-lab/MDI/blob/main/ARCHITECTURE.md)
for the complete ownership rules and current transition status.

## Versioning

Package versions are `<MDI spec version>.<release>` — major.minor always equals
the targeted MDI spec version, and patch is each package's independent release
counter starting at `.1`.
