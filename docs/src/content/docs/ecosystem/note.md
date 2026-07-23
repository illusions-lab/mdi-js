---
title: note export
description: What `--to note` can preserve, what note only accepts through its editor UI, and how to verify a paste.
---

`mdi build manuscript.mdi --to note` writes `manuscript_note.txt` in UTF-8.
The result is a **note-editor input profile**, not a standard Markdown document
and not a `.note` file. `--to txt-all` includes this sixth text flavor.

The distinction matters: note documents its Markdown spellings as editor
shortcuts. Some require a trailing space or Return key, while uploads and
toolbar-only properties cannot be encoded in a plain-text file. Ruby is
different: note applies `｜base《reading》` when the draft is saved or
published, and accepts either a fullwidth or ASCII vertical bar.

## Automatically represented

| MDI / Markdown input | note output | Contract |
| --- | --- | --- |
| Heading depth 1 | `## heading` | note's large heading |
| Heading depth 2–6 | `### heading` | note has only large and small headings |
| Strong / GFM deletion | `**strong**` / `~~deleted~~` | note Markdown shortcuts |
| Ordered or unordered list | `1. item` / `- item` | nesting is retained; note supports up to five levels |
| Block quote | `> quote` | quote source has no plain-text notation |
| Code block | fenced code with its language | `mermaid` is retained for note's Mermaid code mode |
| Thematic break | `---` | note divider shortcut |
| MDI ruby | `｜base《reading》` | note's native ruby notation |
| note TeX already present in source | `$${...}$$` or a `$$` block | preserved literally; note performs the TeX rendering |
| Bare URL | bare URL | note may turn a URL in its own paragraph into a card/embed |
| Link or image | label/alt and URL retained | readable fallback; note does not document Markdown link/image import |
| Footnote | numbered reference plus end notes | readable fallback; note has no footnote block |
| Table | tab-separated text | readable fallback; note has no table block |

Tate-chu-yoko, boten, warichu, kerning, no-break, page breaks, task-list
checkboxes, italic emphasis, inline code, and raw HTML have no documented note
equivalent. Their readable content is retained, while the unsupported styling
or pagination instruction is dropped. note explicitly disables HTML inside
TeX.

## Everything note supports, including editor-only features

The exporter accounts for all current editor content categories, but a text
file cannot apply all of them:

| note capability | Text export status |
| --- | --- |
| Paragraphs, line breaks, two heading levels, bold, strike, lists, quote, code, divider | Emitted using note's documented shortcuts |
| Ruby, inline/display TeX, Mermaid code | Native notation is preserved |
| Text links | Label and URL are preserved; applying a link to selected text is editor-only |
| Center/right alignment | Content retained; alignment is toolbar-only |
| Quote source and source URL | Quote retained; the dedicated source field is editor-only |
| Table of contents | Headings retained; inserting/enabling the TOC is editor-only |
| Body image, alt text, caption, size, and image link | Alt text and URL retained; upload and image properties are editor-only |
| Cover image and title field | Front matter remains outside the body text; set these in the publishing UI |
| File, native audio, and comic upload | Cannot be represented by a text export |
| External video, music, audio, SNS, article, design, business, form, map, shopping, event, development, comic/game, crowdfunding, recruiting, news, and recipe embeds | A source bare URL is preserved; note decides whether it can create a card |
| Japanese/US stock chart shortcuts and note Money URLs | Literal source is preserved; the editor still needs Return or its chart UI |

The external-provider list changes independently of MDI; use note's live
provider page instead of treating a hard-coded list as a file-format grammar.

## Verification

Open a new note article, paste the UTF-8 output into the body, then save the
draft. Verify ruby after saving. Markdown shortcuts may require typing a space
or Return at the affected block, so confirm headings, lists, quotes, code, and
the divider in the editor. Uploads, alignment, captions, quote sources, TOC,
and publishing metadata must be completed in the UI.

Authoritative references:

- [Editor capabilities](https://www.help-note.com/hc/ja/articles/360012426133-%E3%82%A8%E3%83%87%E3%82%A3%E3%82%BF-%E8%A8%98%E4%BA%8B%E7%B7%A8%E9%9B%86%E7%94%BB%E9%9D%A2-%E3%81%A7%E3%81%A7%E3%81%8D%E3%82%8B%E3%81%93%E3%81%A8)
- [Markdown shortcuts](https://www.help-note.com/hc/ja/articles/4410617032217-Markdown%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%82%AB%E3%83%83%E3%83%88)
- [Ruby notation](https://www.help-note.com/hc/ja/articles/4406430353817-%E3%83%AB%E3%83%93-%E3%81%B5%E3%82%8A%E3%81%8C%E3%81%AA-%E3%82%92%E3%81%B5%E3%82%8B)
- [TeX notation](https://www.help-note.com/hc/ja/articles/4410665086873-%E6%95%B0%E5%BC%8F%E8%A8%98%E6%B3%95%E3%81%AE%E4%BD%BF%E3%81%84%E6%96%B9)
- [Mermaid diagrams](https://www.help-note.com/hc/ja/articles/25858251439513-Mermaid%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%83%80%E3%82%A4%E3%82%A2%E3%82%B0%E3%83%A9%E3%83%A0%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B)
- [Supported embed services](https://www.help-note.com/hc/ja/articles/360019596133-%E3%83%86%E3%82%AD%E3%82%B9%E3%83%88%E8%A8%98%E4%BA%8B%E3%81%AB%E5%9F%8B%E3%82%81%E8%BE%BC%E3%81%BF%E3%81%A7%E3%81%8D%E3%82%8B%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9%E4%B8%80%E8%A6%A7)
