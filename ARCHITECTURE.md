# MDI architecture

This document describes the architecture MDI is moving toward. It deliberately
separates the public contract from temporary implementation details so that a
JavaScript, Python, or Swift user can understand which component decides what.

> **Short version:** Rust is the only executable authority for MDI syntax and
> document semantics. Language packages are thin bindings. Deterministic
> renderers also live in Rust. PDF is orchestrated by Rust but laid out by
> Chromium, because a browser already implements the Japanese text layout that
> MDI needs.
>
> **簡短說明：** Rust 是 MDI 語法與文件語義唯一的可執行權威；JavaScript、
> Python、Swift 套件都只是薄接口。可確定重現的轉換器也放在 Rust。
> PDF 流程由 Rust 控制，但實際排版交給 Chromium，以使用成熟的日文直書、
> ruby、縱中橫、傍點與分頁能力。

## Sources of truth

MDI has three complementary sources of truth:

1. [`SYNTAX.md`](./SYNTAX.md) is the human-readable normative specification.
2. The Rust parser is the only executable reference implementation.
3. Shared conformance fixtures prove that every binding observes the same
   syntax tree and diagnostics.

A language binding must not recognize, validate, or repair MDI syntax on its
own. In particular, JavaScript code must not contain a second implementation
of rules such as ruby boundaries, valid `kern` amounts, or balanced bracket
macros.

## Target pipeline

```text
                               .mdi source
                                    │
                                    ▼
                    ┌─────────────────────────────┐
                    │ Rust parser                 │
                    │ CommonMark + GFM + MDI      │
                    │ front matter + diagnostics  │
                    └──────────────┬──────────────┘
                                   │
                         versioned MDI document IR
                                   │
             ┌─────────────────────┼─────────────────────┐
             │                     │                     │
             ▼                     ▼                     ▼
      Rust renderers        language bindings     compatibility adapters
      HTML/TXT/EPUB/        JS/Python/Swift       mdast/remark when needed
      DOCX/MDI              (no grammar rules)    (no grammar rules)
             │
             └── HTML + print CSS ──▶ Chromium ──▶ PDF
```

The parser consumes the whole document, not isolated MDI fragments. This is
necessary to make the correct decision in all of these cases:

```markdown
`^12^`                 <!-- code: literal -->
**第^12^話**           <!-- MDI inside CommonMark strong -->
[[em:**重要**]]        <!-- CommonMark inside an MDI construct -->
```

If CommonMark context were decided independently in every host language, Rust
would not actually control MDI boundaries.

## The document IR

The Rust parser returns a versioned, language-neutral document IR. Its public
contract includes:

- the MDI syntax version and IR schema version;
- CommonMark/GFM and MDI nodes in one tree;
- source spans measured in UTF-8 bytes;
- front matter, including unknown keys that must round-trip;
- recoverable diagnostics rather than host-language exceptions for ordinary
  malformed input;
- enough source information for canonical serialization and editor tooling.

Rust enums are an internal implementation detail. Bindings exchange the
versioned wire representation and map it to idiomatic objects in their host
language. This prevents Rust refactors from silently breaking every SDK.

## Responsibility by layer

| Responsibility | Owner |
|---|---|
| CommonMark, GFM, front matter, and MDI parsing | Rust |
| MDI boundary decisions and validation | Rust |
| Normalization and semantic tree repair | Rust |
| Canonical `.mdi` serialization | Rust |
| HTML and text-family output | Rust |
| EPUB packaging | Rust |
| DOCX generation | Rust, after the core formats are stable |
| PDF orchestration | Rust |
| Japanese PDF layout and painting | Chromium |
| Filesystem, UI, and platform integration | Host language |
| Mapping the IR to mdast or native classes | Host binding |

Generating HTML is serialization, not graphics rendering, and therefore
belongs in Rust. EPUB is XHTML, metadata, CSS, and ZIP packaging, so it also
belongs in Rust. DOCX is OOXML in a ZIP container and can move to Rust, though
it comes later because Microsoft Word compatibility requires more integration
testing.

Rust does not implement a new PDF layout engine. It renders HTML and print CSS,
starts a compatible Chromium executable, invokes the DevTools `printToPDF`
operation, and returns the resulting bytes. Browser WASM cannot start a local
process, so browser clients call a server or desktop host for PDF generation.

## Language bindings

Every binding exposes the same conceptual API:

```text
parse(source, options) -> document + diagnostics
validate(document) -> diagnostics
normalize(document) -> document
serializeMdi(document) -> string
renderHtml(document, profile) -> string
renderText(document, flavor, profile) -> string
renderEpub(document, profile) -> bytes
renderDocx(document, profile) -> bytes
renderPdf(document, profile) -> bytes
```

Planned binding technologies are:

| Host | Binding |
|---|---|
| Browser JavaScript | WebAssembly |
| Node.js | WebAssembly first; N-API may be added for native distribution |
| Python | PyO3 |
| Swift | UniFFI or a small C ABI packaged as an XCFramework |
| Rust | Native crates |

The binding may convert strings, byte arrays, errors, and object shapes. It
must not implement syntax rules.

## What happens to remark?

Remark is a JavaScript ecosystem for parsing Markdown into mdast and running
AST plugins. It is not part of the target parser core. The primary JavaScript
API will call Rust directly.

If existing Astro, unified, or remark users need mdast, a compatibility adapter
will map the Rust document IR to mdast. That adapter may participate in a
remark pipeline, but it cannot tokenize MDI or make syntax decisions.

## Migration stages

The architecture changes immediately, while implementation moves in verified
vertical slices:

1. **Contract and JavaScript binding.** Define the versioned wire format,
   expose the Rust parser through WASM, and provide a typed JavaScript API.
   The initial parser result is explicitly transitional until full CommonMark
   integration lands.
2. **One Rust parser.** Integrate CommonMark/GFM/front matter and all MDI
   constructs in the Rust tokenizer. Run the same fixtures against the old JS
   pipeline and the new Rust pipeline, then remove the JS tokenizer.
3. **Canonical transforms and serialization.** Move validation, normalization,
   tree repair, and `.mdi` writing into Rust.
4. **Deterministic renderers.** Move text-family output, HTML, and EPUB into
   Rust. Keep compatibility adapters only where users need ecosystem ASTs.
5. **Document and print formats.** Move DOCX generation, then replace the
   Playwright wrapper with Rust-controlled Chromium for PDF.
6. **Native bindings.** Add Python and Swift bindings over the same IR and
   renderer APIs.

The old JavaScript implementation remains only as a differential-test oracle
until the Rust parser reaches conformance. It is not a second long-term
implementation.

## Current transition status

At the start of stage 1, `mdi-core` already parses an MDI-only subset in Rust,
but its full parser is not exposed through WASM. JavaScript micromark constructs
still decide token boundaries, and the JavaScript converters still consume
mdast. This is migration state, not the intended architecture.

The first binding introduced in stage 1 exposes that Rust-owned MDI syntax
tree with an explicit IR version. It establishes the cross-language contract;
stage 2 replaces the transitional line-oriented document parser with the full
CommonMark/GFM/MDI parser without moving syntax authority back into JavaScript.
