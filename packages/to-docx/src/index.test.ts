import JSZip from "jszip";
import { describe, expect, it } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdi from "@illusions-lab/mdi-remark";
import type { Root } from "mdast";
import { mdiToDocx } from "./index.js";

describe("mdiToDocx", () => it("creates a DOCX containing ordinary, ruby, and tcy runs", async () => {
	const p = unified().use(remarkParse).use(remarkMdi);
	const zip = await JSZip.loadAsync(await mdiToDocx(p.runSync(p.parse("# Heading\n\nplain {東京|とうきょう} ^12^")) as Root));
	const document = await zip.file("word/document.xml")!.async("string");
	expect(document).toContain("<w:document");
	expect(document).toContain("<w:ruby>");
	expect(document).toContain("<w:eastAsianLayout");
}));
