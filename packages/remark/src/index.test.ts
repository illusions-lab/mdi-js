import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import type { Root } from "mdast";
import remarkMdi from "./index.js";

function processor() {
	return unified().use(remarkParse).use(remarkMdi).use(remarkStringify);
}

function parse(value: string): Root {
	const remark = processor();
	return remark.runSync(remark.parse(value)) as Root;
}

function nodeTypes(node: { type: string; children?: unknown[] }): string[] {
	return [
		node.type,
		...(node.children ?? []).flatMap((child) =>
			nodeTypes(child as { type: string; children?: unknown[] }),
		),
	];
}

function withoutPosition(value: unknown): unknown {
	if (Array.isArray(value)) return value.map(withoutPosition);
	if (value && typeof value === "object") {
		const { position: _position, ...rest } = value as Record<string, unknown>;
		for (const key of Object.keys(rest)) rest[key] = withoutPosition(rest[key]);
		return rest;
	}
	return value;
}

describe("remarkMdi", () => {
	it("combines front matter, GFM, and MDI parsing", () => {
		const tree = parse(`---
title: Example
---

| Name | Mark |
| --- | --- |
| Tokyo | ordinary |

{東京|とうきょう} ~~old~~ [[em:important]] 《《also important》》`);
		const types = nodeTypes(tree);

		expect(tree.data?.frontmatter?.title).toBe("Example");
		expect(types).toEqual(
			expect.arrayContaining(["yaml", "table", "delete", "mdiRuby", "mdiEm"]),
		);
		expect(types.filter((type) => type === "mdiEm")).toHaveLength(2);
	});

	it("resolves front matter defaults and vertical page progression", () => {
		expect(parse("---\nwriting-mode: vertical\n---\n").data?.frontmatter)
			.toMatchObject({ writingMode: "vertical", pageProgression: "rtl" });
		expect(parse("plain text").data?.frontmatter).toEqual({
			mdi: "2.0",
			title: undefined,
			author: undefined,
			lang: "ja",
			date: undefined,
			writingMode: "horizontal",
			pageProgression: "ltr",
		});
	});

	it("includes GFM footnotes", () => {
		const types = nodeTypes(parse("A note[^1].\n\n[^1]: note"));

		expect(types).toEqual(
			expect.arrayContaining(["footnoteReference", "footnoteDefinition"]),
		);
	});

	it("round-trips through the full remark processor", () => {
		const source = `---
writing-mode: vertical
---

{東京|とうきょう} and ~~old~~ [[em:important]].`;
		const remark = processor();
		const tree = remark.runSync(remark.parse(source)) as Root;
		const serialized = remark.stringify(tree);
		if (typeof serialized !== "string") throw new Error("Expected markdown");
		const reparsed = parse(serialized);

		expect(withoutPosition(reparsed)).toEqual(withoutPosition(tree));
	});

	it("parses the kitchen-sink fixture", () => {
		const fixture = readFileSync(
			new URL("../../../examples/kitchen-sink.mdi", import.meta.url),
			"utf8",
		);

		expect(parse(fixture).children.length).toBeGreaterThan(2);
	});
});
