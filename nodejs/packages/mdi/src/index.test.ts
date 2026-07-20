import { describe, expect, it } from "vitest";
import { MDI_IR_VERSION, MDI_SPEC_VERSION, parseMdiSyntax } from "./index.js";

describe("Rust MDI JavaScript binding", () => {
	it("returns a versioned result with explicit transitional capabilities", () => {
		const result = parseMdiSyntax("第^12^話");

		expect(result.irVersion).toBe(MDI_IR_VERSION);
		expect(result.syntaxVersion).toBe(MDI_SPEC_VERSION);
		expect(result.capabilities).toEqual({
			mdi: true,
			commonMark: false,
			gfm: false,
			frontMatter: false,
			sourceSpans: false,
		});
		expect(result.diagnostics).toEqual([]);
		expect(result.document.blocks).toEqual([
			{
				type: "paragraph",
				inlines: [
					{ type: "text", value: "第" },
					{ type: "tcy", value: "12" },
					{ type: "text", value: "話" },
				],
				indent: null,
				bottom: null,
			},
		]);
	});

	it("exposes nested syntax decisions made by Rust", () => {
		const result = parseMdiSyntax("[[em:●:{東京|とう.きょう}[[no-break:^12^]]]]");

		expect(result.document.blocks[0]).toEqual({
			type: "paragraph",
			inlines: [
				{
					type: "em",
					mark: "●",
					children: [
						{
							type: "ruby",
							base: "東京",
							ruby: { type: "split", value: ["とう", "きょう"] },
						},
						{
							type: "noBreak",
							children: [{ type: "tcy", value: "12" }],
						},
					],
				},
			],
			indent: null,
			bottom: null,
		});
	});

	it("does not perform JavaScript-side syntax fallback", () => {
		const result = parseMdiSyntax("[[kern:wide:text]]");
		expect(result.document.blocks[0]).toMatchObject({
			type: "paragraph",
			inlines: [{ type: "text", value: "[[kern:wide:text]]" }],
		});
	});

	it("rejects non-string input at the host boundary", () => {
		expect(() => parseMdiSyntax(null as never)).toThrow("source must be a string");
	});
});
