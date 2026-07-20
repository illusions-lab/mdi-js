---
title: Remark / mdast adapter
description: Connect MDI's shared document model to unified without making remark the grammar authority.
---

Remark is an ecosystem adapter, not the MDI syntax authority. It exists for applications that need unified plugins and mdast-shaped data.

```text
complete source → Rust-owned parse/IR → mdast ⇄ unified plugins
```

The adapter parses by sending the complete source to `@illusions-lab/mdi`, then maps the returned Rust IR to mdast. `remark-gfm` and `remark-frontmatter` are retained only for mdast serialization handlers; their parser hooks are not used.

`@illusions-lab/mdi-remark` does not register a micromark MDI tokenizer or an mdast MDI parser. It is a one-way compatibility adapter today: conversion of an edited mdast tree back into canonical MDI awaits the Rust serializer API.
