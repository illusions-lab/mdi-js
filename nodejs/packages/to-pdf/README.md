# @illusions-lab/mdi-to-pdf

Chromium layout adapter for Rust-rendered MDI HTML. `renderHtmlToPdf()` applies
an export profile and asks Chromium for PDF bytes. It deliberately accepts
HTML, not MDI source: syntax parsing and semantic HTML rendering stay in
`mdi-core`.

```ts
import { renderHtml } from "@illusions-lab/mdi";
import { renderHtmlToPdf } from "@illusions-lab/mdi-to-pdf";

const pdf = await renderHtmlToPdf(renderHtml("# A Rust-owned document"));
```

`mdiToPdf(mdast, profile)` remains available for existing unified consumers,
but new applications should use the Rust-HTML route above.

Part of the [MDI](https://github.com/illusions-lab/MDI) monorepo. See the root README for the full package architecture.

Documentation: https://mdi.illusions.app/
