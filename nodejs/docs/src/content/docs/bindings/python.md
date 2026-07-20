---
title: Python
description: Status and expected contract for the Python binding.
---

**Planned.** The repository's [`python/README.md`](https://github.com/illusions-lab/MDI/blob/main/python/README.md) currently says the Python implementation is not yet implemented. There is no public Python API reference to install or call, so this site intentionally does not show one.

## Expected contract

The planned binding is expected to use PyO3 or an equivalent native bridge to call `mdi-core`. It should accept complete UTF-8 source, expose the versioned IR and diagnostics, map Rust errors/resources to idiomatic Python exceptions, and preserve UTF-8 byte spans. It must not implement a Python tokenizer or a second renderer.

The exact package name, installation command, type mapping, and exception classes will be documented here when they exist.
