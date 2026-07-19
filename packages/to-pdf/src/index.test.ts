import { describe, expect, it } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdi from "@illusions-lab/mdi-remark";
import type { Root } from "mdast";
import { mdiToPdf } from "./index.js";

describe("mdiToPdf", () => it("generates a browser-rendered PDF", async () => {
	const p = unified().use(remarkParse).use(remarkMdi);
	const tree = p.runSync(p.parse("---\nwriting-mode: vertical\n---\n{東京|とうきょう}")) as Root;
	const pdf = await mdiToPdf(tree);
	expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
	expect(pdf.length).toBeGreaterThan(500);
}, 30_000));
