# `@illusions-lab/mdi`

Thin JavaScript binding for the Rust-authoritative MDI parser.

```ts
import { parseMdiSyntax } from "@illusions-lab/mdi";

const result = parseMdiSyntax("第^12^話");
console.log(result.document.blocks);
```

## Stage-1 scope

`parseMdiSyntax` exposes the current Rust MDI-only syntax tree. The returned
`capabilities` object explicitly reports that CommonMark, GFM, front matter,
and source spans are not integrated yet. The future whole-document `parse`
API will only be added when those features are owned by Rust as well.

This package contains no MDI grammar rules. It validates the host-language
argument, calls the generated WebAssembly binding, checks the IR version, and
returns typed JavaScript objects.

The existing remark/micromark packages remain temporarily available as the
differential-test oracle during migration. They are not used by this API.
