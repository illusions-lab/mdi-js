---
title: CLI
description: 一つの export profile を EPUB、DOCX、PDF、text に適用して .mdi を shell から出力する方法。
---

**前提:** [Getting Started](/ja/guides/getting-started/)、[Export profiles](/ja/ecosystem/export-profiles/)。

## Install と build

```bash
npm install --global @illusions-lab/mdi-cli
mdi build novel.mdi --to epub --config novel.export.json -o dist/novel.epub
```

```text
mdi build <input.mdi> --to html|pdf|epub|docx|txt|txt-ruby|narou|kakuyomu|aozora|txt-all [--config export.json] [-o <output>]
```

input は UTF-8 です。`--to` は必須、`-o` は output path を上書きし `txt-all` とは併用不可、`--config` は [export profile](/ja/ecosystem/export-profiles/) JSON です。成功は `Written <path>` と status `0`、argument/input/profile/renderer/output の failure は stderr 一行と status `1` です。

## format ごとの設定

| `--to` | default | renderer と profile |
| --- | --- | --- |
| `html` | `novel.html` | Rust semantic standalone HTML。page profile は使わない。 |
| `pdf` | `novel.pdf` | Rust HTML + local Chromium。print profile を使う。 |
| `epub` | `novel.epub` | config なしは Rust baseline。config があれば metadata/type/chapter/cover を使う。 |
| `docx` | `novel.docx` | config なしは Rust baseline。config があれば metadata/page/type/numbering を使う。 |
| text 5 形式 | 各 `.txt` | Rust text。profile は indent を決める。`aozora` は Shift_JIS。 |
| `txt-all` | 6 files | 全 text を書き、`-o` を reject。 |

`epub.coverPath` は profile file からの相対 path として読み、PNG/JPEG でなければ error です。cover bytes は EPUB にのみ入り parser には渡りません。EPUB/DOCX で `--config` が静かに無視されることはもうありません。

## profile 例

```json
{
  "metadata": { "title": "雨の東京", "author": "Illusions", "language": "ja" },
  "typesetting": { "writingMode": "vertical", "fontFamily": "Yu Mincho", "fontSize": 11, "lineSpacing": 1.6, "textIndentEm": 1 },
  "pagination": { "pageSize": "A4", "charactersPerLine": 40, "linesPerPage": 30, "gridMode": "typographic", "margins": { "top": 20, "right": 18, "bottom": 20, "left": 18 }, "pageNumbers": { "enabled": true, "position": "bottom-center", "format": "simple" } },
  "epub": { "chapterSplitLevel": "h1", "coverPath": "cover.png" }
}
```

profile なしの publisher default は A4、40 字 × 30 行、上下 20 mm・左右 18 mm です。`gridMode: "strict"` が default で、grid から type size/leading を導出し、明示的な `fontSize`/`lineSpacing` を reject します。この例は両方を指定するため `"typographic"` を選びます。grid は sizing calculation を決めるもので、heading、強制 break、利用 font、reader layout の後も各 page が厳密に 40×30 glyph slot になる証明ではありません。

MDI parsing/diagnostic/span は Rust の責務です。profile は publication policy、PDF geometry と Chromium layout は host policy です。PDF は `@illusions-lab/mdi-to-pdf` と local Chromium を要し、Chromium は `.mdi` ではなく完成 HTML を受け取ります。DOCX は page/type/numbering を設定できますが、ruby、tate-chu-yoko、禁則/改行禁止、kern、blank paragraph が browser と pixel-identical である保証はありません。対象 reader で確認してください。
