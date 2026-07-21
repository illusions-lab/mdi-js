# `@illusions-lab/mdi`

The JavaScript interface to the Rust-authoritative MDI engine. Give it a
complete `.mdi` source document and it returns the versioned document IR and
diagnostics produced by `mdi-core`.

## Install

```sh
npm install @illusions-lab/mdi
```

```ts
import { parse } from "@illusions-lab/mdi";

const result = parse(`---
title: 短篇
---

# 第一章

第^12^話に[[em:傍点]]を付ける。`);

console.log(result.document);
console.log(result.diagnostics);
```

## What the binding does

The package has deliberately narrow responsibilities:

1. accept JavaScript strings, byte arrays, and options;
2. call `mdi-core` through the generated Rust binding;
3. check the returned IR schema version;
4. expose typed JavaScript objects, diagnostics, and renderer results.

It does not tokenize Markdown or MDI, repair malformed syntax, reinterpret
source spans, or maintain a JavaScript copy of the grammar. CommonMark, GFM,
front matter, MDI extensions, escapes, nesting, literal fallback, and all
syntax validation are decided by Rust.

```text
complete source
      ↓
JavaScript binding
      ↓
mdi-core parser
      ↓
versioned document IR + diagnostics
```

## Parse result

Every result carries the syntax version and IR schema version alongside the
document. Source-backed nodes use half-open UTF-8 byte spans. Recoverable
problems are returned as ordered diagnostics with stable codes, severity,
messages, and source spans.

Applications should treat the IR version as a wire-protocol version. They
must not infer grammar rules from object shapes or silently accept an
unsupported version.

## Rendering

Rendering starts from the same Rust IR. Canonical MDI, plain text, HTML, and
the one-argument baseline EPUB/DOCX renderers execute in Rust and are exposed
through this package. PDF uses Rust HTML as its input to a host layout adapter such as
`@illusions-lab/mdi-to-pdf`; the adapter may control Chromium, but it never
parses MDI or produces semantic HTML.

Browser WebAssembly cannot start Chromium. Browser code sends Rust-rendered
HTML to a server or desktop host when it needs PDF output.

### HTML, diagnostics, and host workflows

`renderHtml(source)` returns a standalone HTML document with the stable MDI
classes emitted by Rust. Pass `{ bodyOnly: true }` to embed its semantic body
in an application shell; this changes only the outer document wrapper, never
the MDI-to-HTML semantics.

```ts
import { renderHtmlWithDiagnostics } from "@illusions-lab/mdi";

const result = renderHtmlWithDiagnostics(source, { bodyOnly: true });
preview.replaceChildren(htmlToDom(result.output));
showDiagnostics(result.diagnostics); // stable codes and UTF-8 source spans
buildOutline(result.headings);       // source-backed heading nodes, not HTML scraping
```

For a parse-first flow, call `prepareRender(source)` (or `parse(source)`) and
display `diagnostics` before choosing an exporter. The public Rust ABI accepts
source text for renderer calls today, so renderers re-enter the same
Rust-authoritative parser rather than accepting mutable JavaScript IR. This
keeps the source spans and error codes predictable and prevents JavaScript from
becoming a second syntax implementation.

Configuration ownership is deliberately split: Rust owns MDI parsing and
semantic HTML; publication profiles own EPUB/DOCX metadata and typesetting;
the host owns Chromium/Electron, paper-printer integration, and application UI
preferences. This keeps platform-specific pagination controls out of the
parser and lets Electron supply its own PDF adapter.

### Configured EPUB and DOCX

For publication output, pass an export profile to the overloads (or use the
explicit `WithProfile` functions). These Node.js-only async paths map the
Rust-owned IR through the publication adapters and retain configuration for
metadata, chapter splitting, vertical writing, font selection, paper size,
margins, and page numbers. EPUB also accepts in-memory PNG or JPEG cover art.

```ts
import { renderDocxWithProfile, renderEpubWithProfile } from "@illusions-lab/mdi";

const epub = await renderEpubWithProfile(source, {
  profile: {
    metadata: { title: "Book", author: "Author" },
    typesetting: { writingMode: "vertical", fontFamily: "Noto Serif JP" },
    epub: { chapterSplitLevel: "h1" },
  },
  cover: { data: coverBytes, mediaType: "image/png" },
});

const docx = await renderDocxWithProfile(source, {
  pagination: { pageSize: "A5", margins: { top: 12, bottom: 12, left: 14, right: 14 } },
});
```

`renderEpub(source)` and `renderDocx(source)` remain synchronous,
backward-compatible Rust baseline exports. `renderEpub(source, options)` and
`renderDocx(source, profile)` are equivalent async overloads for configured
publication output.

## Remark compatibility

Remark support is an optional adapter between Rust IR and mdast. It exists for
applications that need unified plugins:

```text
source → mdi-core → Rust IR ⇄ mdast → unified plugins
```

The adapter contains no tokenizer, grammar, or syntax fallback. When an mdast
pipeline needs MDI output, it is converted back to Rust IR and Rust performs
validation and serialization.

The normative human-readable syntax is defined in
[`SYNTAX.md`](https://github.com/illusions-lab/MDI/blob/main/SYNTAX.md). The
executable syntax authority is `mdi-core`.

## Documentation

- [JavaScript binding guide](https://mdi.illusions.app/bindings/javascript/)
- [Document IR and diagnostics](https://mdi.illusions.app/core/document-ir/)
- [Rendering model](https://mdi.illusions.app/core/rendering/)
- [JavaScript documentation](https://mdi.illusions.app/bindings/javascript/)
