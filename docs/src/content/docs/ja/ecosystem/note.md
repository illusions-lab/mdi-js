---
title: note 書き出し
description: "`--to note` が保持できる内容と、note の UI 操作が必要な内容。"
---

`mdi build manuscript.mdi --to note` は UTF-8 の
`manuscript_note.txt` を生成します。これは標準 Markdown や `.note`
ファイルではなく、**note エディタ入力用 profile** です。
`--to txt-all` にも、この6番目の text flavor が含まれます。

note 公式は Markdown 表記を import format ではなく editor shortcut と
説明しています。末尾の空白や Return が必要なものがあり、upload や
toolbar-only property は plain text にできません。一方ルビは
`｜親文字《よみ》` を下書き保存・公開時に反映し、全角・半角の縦線を
受け付けます。

## 自動的に表現する内容

| 入力 | note 出力 | 契約 |
| --- | --- | --- |
| H1 | `## 見出し` | note の大見出し |
| H2–H6 | `### 見出し` | note は大・小の2階層 |
| strong / GFM delete | `**太字**` / `~~取消~~` | 公式 shortcut |
| ordered / unordered list | `1. item` / `- item` | 入れ子を保持。note の上限は5階層 |
| blockquote | `> 引用` | 専用の出典欄は text で設定できない |
| code block | language 付き fence | `mermaid` を保持 |
| thematic break | `---` | 区切り線 shortcut |
| MDI ruby | `｜親文字《よみ》` | note native ruby |
| source 内の note TeX | `$${...}$$` / `$$` block | そのまま保持 |
| bare URL | bare URL | 独立段落なら note が card/embed 化できる |
| link / image | label・alt・URL を保持 | readable fallback |
| footnote | 本文番号 + 文末注 | note に footnote block はない |
| table | tab-separated text | note に table block はない |

縦中横、傍点、割注、kerning、no-break、page break、task checkbox、
italic、inline code、raw HTML には公式の対応表現がありません。本文を
残し、未対応の装飾・組版指定だけを落とします。

## note が扱う全機能との対応

| note 機能 | text 書き出し |
| --- | --- |
| 段落、改行、2階層見出し、太字、取消線、list、引用、code、区切り線 | 公式 shortcut を出力 |
| ルビ、inline/display TeX、Mermaid | native notation を保持 |
| 文字リンク | label と URL を保持。文字列への link 適用は UI |
| 中央寄せ・右寄せ | 内容のみ保持。配置は UI |
| 引用元と引用元 URL | 引用本文のみ自動。専用欄は UI |
| 目次 | heading を保持。目次の挿入・有効化は UI |
| 本文画像、ALT、caption、size、画像 link | alt と URL を保持。upload と属性は UI |
| 見出し画像・title field | body text 外。公開 UI で設定 |
| file、native audio、comic upload | text では表現不可 |
| 外部 video/music/audio/SNS/article/design/business/form/map/shopping/event/development/comic/game/crowdfunding/recruiting/news/recipe embed | bare URL を保持し、card 化は note が判断 |
| 日米株価 shortcut / note Money URL | literal を保持。Return または UI が必要 |

## 確認方法

新規 note 記事の本文へ UTF-8 出力を貼り、下書きを保存します。ルビは
保存後に確認してください。見出し、list、引用、code、区切り線は
貼り付け後に空白または Return が必要な場合があります。画像 upload、
配置、caption、引用元、目次、公開 metadata は UI で仕上げます。

公式資料：

- [エディタでできること](https://www.help-note.com/hc/ja/articles/360012426133-%E3%82%A8%E3%83%87%E3%82%A3%E3%82%BF-%E8%A8%98%E4%BA%8B%E7%B7%A8%E9%9B%86%E7%94%BB%E9%9D%A2-%E3%81%A7%E3%81%A7%E3%81%8D%E3%82%8B%E3%81%93%E3%81%A8)
- [Markdown shortcut](https://www.help-note.com/hc/ja/articles/4410617032217-Markdown%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%82%AB%E3%83%83%E3%83%88)
- [ルビ](https://www.help-note.com/hc/ja/articles/4406430353817-%E3%83%AB%E3%83%93-%E3%81%B5%E3%82%8A%E3%81%8C%E3%81%AA-%E3%82%92%E3%81%B5%E3%82%8B)
- [数式](https://www.help-note.com/hc/ja/articles/4410665086873-%E6%95%B0%E5%BC%8F%E8%A8%98%E6%B3%95%E3%81%AE%E4%BD%BF%E3%81%84%E6%96%B9)
- [Mermaid](https://www.help-note.com/hc/ja/articles/25858251439513-Mermaid%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%83%80%E3%82%A4%E3%82%A2%E3%82%B0%E3%83%A9%E3%83%A0%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B)
- [embed service 一覧](https://www.help-note.com/hc/ja/articles/360019596133-%E3%83%86%E3%82%AD%E3%82%B9%E3%83%88%E8%A8%98%E4%BA%8B%E3%81%AB%E5%9F%8B%E3%82%81%E8%BE%BC%E3%81%BF%E3%81%A7%E3%81%8D%E3%82%8B%E3%82%B5%E3%83%BC%E3%83%93%E3%82%B9%E4%B8%80%E8%A6%A7)
