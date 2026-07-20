---
title: レンダリングと Chromium/PDF 境界
description: 構文・IR の意味と出力レイアウトを分離します。
---

HTML、TXT、EPUB、DOCX、PDF は同じ IR から生成されます。Chromium は MDI を解析せず、Rust が生成した HTML と print CSS をレイアウトし、`printToPDF` を実行するだけです。

CLI の HTML、TXT、EPUB、DOCX は Rust を直接呼び出し、PDF は Rust HTML を Chromium adapter に渡します。mdast/HAST package は unified 利用者向けの公開互換 adapter として残ります。EPUB/DOCX の完全な profile と cover option は Rust 側で追加中です。
