import { describe, expect, it } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdi from "@illusions-lab/mdi-remark";
import type { Root } from "mdast";
import { mdiToHtml } from "./index.js";

function parse(source: string): Root {
	const processor = unified().use(remarkParse).use(remarkMdi);
	return processor.runSync(processor.parse(source)) as Root;
}
describe("mdiToHtml", () => it("wraps rendered MDI in a vertical HTML document", () => {
	const html = mdiToHtml(parse("---\ntitle: 雪女\nlang: ja\nwriting-mode: vertical\n---\n{東京|とうきょう} ^12^"));
	expect(html).toContain('<html lang="ja" style="writing-mode: vertical-rl;">');
	expect(html).toContain("<title>雪女</title>");
	expect(html).toContain("<style>");
	expect(html).toContain('<ruby class="mdi-ruby">東京<rp>（</rp><rt>とうきょう</rt>');
}));
