---
title: JavaScript / TypeScript
description: The current typed Node/browser-facing interface and its Rust migration boundary.
---

`@illusions-lab/mdi` is the primary typed JavaScript package in this checkout. Install it with `npm install @illusions-lab/mdi`.

```ts
import { parse } from '@illusions-lab/mdi';

const result = parse('第^12^話');
console.log(result.syntaxVersion, result.irVersion);
console.log(result.document, result.diagnostics);
```

The package checks the IR version and exposes `MdiSyntaxParseResult`, `MdiParserCapabilities`, `MdiSourceSpan`, `MdiDiagnostic`, and document/node types. Source spans are UTF-8 byte offsets.

## Status boundary

The WASM bridge calls the complete Rust parser. The Remark adapter also maps this Rust result into mdast, so normal CLI and renderer entry paths do not let micromark decide MDI syntax. Existing Node output packages remain JavaScript renderers over that mdast compatibility shape; their eventual Rust-native replacements are a separate renderer milestone.

Use [Rust Core API status](/core/rust-api/) for implemented symbols and [Remark adapter](/ecosystem/remark/) when a unified pipeline is required.
