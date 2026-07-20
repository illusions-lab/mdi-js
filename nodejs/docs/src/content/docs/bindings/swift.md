---
title: Swift
description: Status and expected contract for the Swift binding.
---

**Planned.** The repository's [`swift/README.md`](https://github.com/illusions-lab/MDI/blob/main/swift/README.md) currently says the Swift implementation is not yet implemented. There is no Swift package, XCFramework, or generated API reference to document yet.

## Expected contract

The planned binding is expected to use UniFFI or a small C ABI around `mdi-core`. It should expose the same syntax/IR versions, document nodes, diagnostics, and UTF-8 byte spans as the other bindings, with Swift-native value types and error handling. It must not own grammar or renderer semantics.

Installation, module names, type mapping, and resource-error behavior will be added once the binding is implemented.
