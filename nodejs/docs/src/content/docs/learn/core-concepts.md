---
title: Core concepts
description: The shared concepts that every MDI language interface must preserve.
---

MDI has one shared vocabulary across languages. A host package may rename a function idiomatically, but it must preserve the same source, IR, diagnostic, and rendering semantics.

## Source and grammar

`mdi-core` receives the complete UTF-8 document. MDI boundaries depend on Markdown context, so an implementation must not tokenize isolated fragments or let a host parser decide whether `^12^` or `[[em:...]]` is syntax.

## Document IR

The IR carries syntax and IR versions, front matter, tagged document nodes, and source spans. Bindings map this wire shape to native objects; Rust enum names are not a second language-level specification. See [Document IR](/core/document-ir/).

## Diagnostics

Recoverable problems are data: severity, stable code, message, and an optional half-open UTF-8 byte span. See [Diagnostics](/core/diagnostics/).

## Profiles and output

An export profile controls presentation such as page size, writing mode, fonts, margins, metadata, and text flavor. It does not alter grammar. Renderers consume the IR; [Chromium only performs PDF layout](/core/rendering/).

## Thin interfaces

JavaScript/TypeScript is the currently usable package surface. Python and Swift are Planned bindings. Remark is an adapter to mdast, not an MDI parser.
