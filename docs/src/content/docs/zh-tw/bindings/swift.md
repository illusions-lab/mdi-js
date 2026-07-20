---
title: Swift
description: 使用 Rust-authoritative MDI grammar 與 Document IR 的原生 Swift binding。
---

Swift 是已支援的 MDI binding。它與 Rust、Node.js、Kotlin、Python 共用同一個 Rust-authoritative grammar 與 versioned Document IR；Swift 端不維護另一份 parser。

## 從 SwiftPM 使用

將此 repository 的 Swift package 加入 SwiftPM project，並在 application target 中 `import MDI`。package manifest 位於 [`swift/Package.swift`](https://github.com/illusions-lab/MDI/blob/main/swift/Package.swift)。

## Binding contract

- 以共用 Rust grammar 解析完整 `.mdi` source。
- 保留共用的 syntax version、IR version、diagnostics 與 UTF-8 byte span。
- 與其他 MDI binding 一樣，從同一份 Document IR 進行 render。
- 不在 Swift 重作 grammar、delimiter fallback 或 renderer semantics。

語言無關的行為請見 [Document IR](/zh-tw/core/document-ir/)、[Diagnostics](/zh-tw/core/diagnostics/)、[Rendering model](/zh-tw/core/rendering/)。
