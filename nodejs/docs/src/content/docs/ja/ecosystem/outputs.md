---
title: HTML / TXT / EPUB / DOCX / PDF 出力
description: 各出力形式とレイアウト境界。
---

すべての出力は同じ MDI IR の変換です。現在の Node package は mdast/HAST 層で実装されています。PDF の Chromium は HTML/print CSS をレイアウトするだけで、MDI を解析しません。Rust-native renderer は未公開の部分では Planned です。
