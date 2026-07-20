---
title: Diagnostics and UTF-8 source spans
description: Stable error data that survives every MDI interface.
---

Diagnostics are part of the IR contract. A diagnostic has `severity` (`warning` or `error`), a stable `code`, a human-readable `message`, and an optional `span`.

Spans are half-open byte ranges into the original UTF-8 source: `startByte` is inclusive and `endByte` is exclusive. They are not JavaScript UTF-16 offsets and must not be silently converted into character indexes.

```json
{
  "severity": "warning",
  "code": "MDI001",
  "message": "example diagnostic",
  "span": { "startByte": 10, "endByte": 16 }
}
```

The parser currently emits `mdi.version.unsupported` when front matter declares a newer MDI version. Malformed syntax follows the specification's literal-fallback rules and is normally represented in the document tree rather than reported as an error. Consumers should still handle an empty diagnostics list and must not invent host-specific validation.
