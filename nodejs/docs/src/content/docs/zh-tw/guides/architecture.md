---
title: 架構
description: Rust 作為唯一語法權威、薄語言接口，以及共享轉換器。
---

## 一個解析器，多種語言接口

MDI 正在遷移到 Rust 單一權威架構。完整的 `.mdi` 文件——CommonMark、
GFM、front matter 與 MDI 擴充——只在 Rust 解析一次，產生有版本的語言中立
文件 IR。

```text
.mdi 原始碼
    ↓
Rust parser → MDI 文件 IR → Rust renderers
    │               │              ├─ HTML / TXT / EPUB / DOCX
    │               │              └─ HTML/CSS → Chromium → PDF
    │               └─ mdast 相容 adapter
    └─ JavaScript / Python / Swift bindings
```

JavaScript、Python、Swift 接口只轉換字串、bytes、錯誤與物件形狀，不得
辨認或校驗語法。合法 `kern` 數值、巢狀 bracket macro 的結尾等規則，只能
存在於 Rust。

人類可讀的 [`SYNTAX.md`](https://github.com/illusions-lab/MDI/blob/main/SYNTAX.md)、
Rust 參考解析器與共享 conformance fixtures 共同定義契約。

## 為什麼 Rust 必須解析整份文件

MDI 的邊界依賴 Markdown 上下文：

```markdown
`^12^`                 <!-- code 裡保持 literal -->
**第^12^話**           <!-- MDI 位於 strong 裡 -->
[[em:**重要**]]        <!-- MDI 裡包含 Markdown -->
```

若各宿主語言各自解析 CommonMark，它們仍會決定一部分 MDI 邊界。因此目標
解析器會同時負責 CommonMark/GFM 與 MDI。

## 轉換器

HTML 與文字輸出是可確定重現的序列化，放在 Rust。EPUB 是 XHTML、CSS、
metadata 與 ZIP，也共享同一份 Rust IR。DOCX 等核心格式穩定後再移動，
因為 Word 的原生 ruby、直書與縱中橫需要更多整合測試。

PDF 刻意使用真正的瀏覽器。Rust 產生 HTML 與列印 CSS、啟動 Chromium、
呼叫 `printToPDF` 並回傳 bytes。`vertical-rl`、縱中橫、傍點、ruby、字型
shaping 與分頁由 Chromium 排版；MDI 不在 Rust 重造瀏覽器排版引擎。

瀏覽器 WASM 無法啟動本機 process，因此瀏覽器端的 PDF 需交給後端或桌面
host 產生。

## JavaScript API 與 remark 相容性

`@illusions-lab/mdi` 是新的薄 JavaScript binding。第一階段提供
`parseMdiSyntax`，回傳帶版本與 capability flags 的 Rust IR。目前 flags
會明確表示 CommonMark/GFM/front matter 與 source spans 尚未整合；只有在
完整文件解析都由 Rust 負責後，才會加入通用的 `parse` API。

現有 micromark/remark parser 暫時保留作差異測試的 oracle，不是第二套長期
實作。未來 Astro 或 unified 使用者若需要 mdast，則由相容 adapter 把 Rust
IR 映射成 mdast；adapter 不得判斷語法。

## 遷移順序

1. 版本化 IR 契約與 typed JavaScript binding。
2. 完整 Rust CommonMark/GFM/MDI/front-matter parser 與 source spans。
3. Rust normalization、validation、repair 與標準 `.mdi` 序列化。
4. Rust TXT、HTML、EPUB renderers。
5. Rust DOCX renderer 與由 Rust 控制 Chromium 的 PDF 管線。
6. 在同一組 API 上增加 Python、Swift bindings。

完整權責和目前遷移狀態見 repository 的
[`ARCHITECTURE.md`](https://github.com/illusions-lab/MDI/blob/main/ARCHITECTURE.md)。

## 版本策略

套件版本是 `<MDI 規範版本>.<發佈次數>`：major.minor 永遠等於對應的 MDI
規範版本，patch 是各套件獨立、從 `.1` 開始的發佈計數。
