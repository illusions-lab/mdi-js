---
title: エクスポート・プロファイル
description: PDF、DOCX、EPUB、テキストの出力設定をアプリ間で共有します。
---

`@illusions-lab/mdi-export-profile` は MDI 出力の共通かつ検証済みの設定契約です。原稿の front matter や MDI 構文には入れず、JSON ファイルまたはアプリ設定として保存します。

```sh
mdi build novel.mdi --to pdf --config novel.export.json -o novel.pdf
mdi build novel.mdi --to docx --config novel.export.json
mdi build novel.mdi --to epub --config novel.export.json
mdi build novel.mdi --to txt-ruby --config novel.export.json
```

プロファイルには、書名・著者・出版社・UUID/ISBN、組方向、フォント、字下げ、用紙サイズ、用紙方向、文字数、行数、余白、ページ番号、EPUB の表紙と見出し分割、TXT の全角スペース字下げを指定できます。`coverPath` はプロファイルファイルからの相対パスで、JPEG/PNG のみです。

| 設定                         | PDF  | DOCX           | EPUB                       | TXT / TXT ruby |
| ---------------------------- | ---- | -------------- | -------------------------- | -------------- |
| 用紙・余白・文字数・行数     | 対応 | 対応           | リフロー形式のため非対応   | —              |
| 組方向・フォント・字下げ     | 対応 | 対応           | 対応                       | —              |
| 全角スペース字下げ           | 対応 | 対応           | CSS 字下げ                 | 1–4 字         |
| ページ番号                   | 対応 | 対応           | 固定ページがないため非対応 | —              |
| 表紙、出版社、識別子、章分割 | —    | 文書プロパティ | 対応                       | —              |

不正な用紙サイズ、余白、ページ番号の値、章分割レベルは黙って補正せず、明確なエラーとして返します。UI では `PAGE_SIZES` を用紙サイズセレクタに利用できます。
