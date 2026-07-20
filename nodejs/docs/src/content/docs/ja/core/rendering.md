---
title: レンダリングと Chromium/PDF 境界
description: 構文・IR の意味と出力レイアウトを分離します。
---

HTML、TXT、EPUB、DOCX、PDF は同じ IR から生成されます。Chromium は MDI を解析せず、Rust が生成した HTML と print CSS をレイアウトし、`printToPDF` を実行するだけです。

現在の Node 出力パッケージは mdast/HAST と Playwright、JSZip、docx を使う実装です。Rust-native renderer API は、crate に存在しない部分については Planned です。
