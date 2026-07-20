---
title: 完整語法參考
description: MDI 2.0 規範語法的網站入口。
---

完整規範只維護在 repository 的 [`SYNTAX.md`](https://github.com/illusions-lab/MDI/blob/main/SYNTAX.md)，避免不同 locale 產生漂移。本頁是網站入口與快速參考。

| 功能 | 建議寫法 | 意義 |
| --- | --- | --- |
| Ruby | `{base|reading}` | 為文字附加讀音 |
| 縱中橫 | `^12^` | 直排中的短橫排文字 |
| 傍點 | `[[em:text]]` | 加上強調點 |
| 禁止斷行 | `[[no-break:text]]` | 保持片語完整 |
| 分頁 | `[[pagebreak]]` | 開始新頁 |

```markdown
{東京|とうきょう}的第^12^話。[[em:重要]]的文字。[[br]]下一行。
```

精確的邊界、巢狀、escape 與 fallback 請以[完整 `SYNTAX.md`](https://github.com/illusions-lab/MDI/blob/main/SYNTAX.md)為準。[展示頁](/zh-tw/syntax/showcase/)只是輸出示例，不是語法權威。
