---
title: Swift
description: Native Swift support for using the Rust-authoritative MDI grammar and document IR.
---

Swift is a supported MDI binding for Apple-platform applications. It uses the same Rust-authoritative grammar and versioned Document IR as Rust, Node.js, Kotlin, and Python; it does not carry a separate Swift parser.

## Use it from SwiftPM

Add the MDI Swift package from this repository to your SwiftPM project, then import `MDI` from your application target. The package manifest is in [`swift/Package.swift`](https://github.com/illusions-lab/MDI/blob/main/swift/Package.swift).

## Binding contract

- Parse complete `.mdi` source with the shared Rust grammar.
- Preserve the shared syntax version, IR version, diagnostics, and UTF-8 byte spans.
- Render through the same document IR as the other MDI bindings.
- Keep grammar rules, delimiter fallback, and renderer semantics in Rust rather than reimplementing them in Swift.

For the language-independent behaviour, see [Document IR](/core/document-ir/), [Diagnostics](/core/diagnostics/), and [Rendering model](/core/rendering/).

## Related bindings

- [Android / Kotlin](/bindings/android/)
- [Node.js](/bindings/javascript/)
- [Python](/bindings/python/)
- [Rust](/bindings/rust/)
