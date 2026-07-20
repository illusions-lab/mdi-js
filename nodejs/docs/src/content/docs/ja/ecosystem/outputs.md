---
title: HTML / TXT / EPUB / DOCX / PDF 出力
description: 各出力形式とレイアウト境界。
---

すべての出力は同じ MDI IR の変換です。CLI の HTML、TXT、EPUB、DOCX は Rust が直接出力し、PDF の Chromium adapter は Rust HTML/print CSS をレイアウトするだけで MDI を解析しません。mdast/HAST package は unified 互換 adapter として残ります。EPUB/DOCX の完全な profile と cover option は Rust 側で追加中です。
