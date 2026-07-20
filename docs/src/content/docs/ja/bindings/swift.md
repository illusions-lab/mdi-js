---
title: Swift
description: Rust を正とする MDI grammar と Document IR を利用する Swift binding。
---

Swift はサポート済みの MDI binding です。Rust、Node.js、Kotlin、Python と同じ Rust-authoritative grammar と versioned Document IR を使い、Swift 側に別の parser は持ちません。

## SwiftPM から使う

この repository の Swift package を SwiftPM project に追加し、application target から `MDI` を import します。package manifest は [`swift/Package.swift`](https://github.com/illusions-lab/MDI/blob/main/swift/Package.swift) にあります。

## Binding contract

- 完全な `.mdi` source を共通 Rust grammar で parse します。
- syntax version、IR version、diagnostics、UTF-8 byte span をそのまま保持します。
- 他の MDI binding と同じ Document IR から render します。
- grammar、delimiter fallback、renderer semantics を Swift に再実装しません。

言語共通の動作は [Document IR](/ja/core/document-ir/)、[Diagnostics](/ja/core/diagnostics/)、[Rendering model](/ja/core/rendering/) を参照してください。
