import { describe, expect, it } from "vitest";
import { fromMarkdown } from "mdast-util-from-markdown";
import { mdi } from "micromark-extension-mdi";
import type { Paragraph, Root, Text } from "mdast";
import { mdiFromMarkdown } from "./from-markdown.js";
import type { MdiRuby } from "./types.js";

function parse(value: string): Root {
	return fromMarkdown(value, {
		extensions: [mdi()],
		mdastExtensions: [mdiFromMarkdown()],
	});
}

function firstParagraphChildren(tree: Root) {
	const paragraph = tree.children[0] as Paragraph;
	expect(paragraph.type).toBe("paragraph");
	return paragraph.children;
}

describe("mdiRuby", () => {
	it("parses group ruby", () => {
		const children = firstParagraphChildren(parse("{東京|とうきょう}"));
		expect(children).toHaveLength(1);
		const node = children[0] as MdiRuby;
		expect(node.type).toBe("mdiRuby");
		expect(node.base).toBe("東京");
		expect(node.ruby).toBe("とうきょう");
	});

	it("parses split ruby when segment count matches base grapheme count", () => {
		const children = firstParagraphChildren(parse("{東京|とう.きょう}"));
		const node = children[0] as MdiRuby;
		expect(node.base).toBe("東京");
		expect(node.ruby).toEqual(["とう", "きょう"]);
	});

	it("falls back to group ruby when a split segment is empty", () => {
		// SYNTAX.md §2 Edge Cases' own example.
		const children = firstParagraphChildren(parse("{東京|.きょう}"));
		const node = children[0] as MdiRuby;
		expect(node.base).toBe("東京");
		expect(node.ruby).toBe("きょう");
	});

	it("falls back to group ruby when segment count doesn't match base length", () => {
		const children = firstParagraphChildren(parse("{東京|と.う.きょう}"));
		const node = children[0] as MdiRuby;
		expect(node.ruby).toBe("とうきょう");
	});

	it("unescapes a literal separator inside the base", () => {
		const children = firstParagraphChildren(parse(String.raw`{東\|京|とうきょう}`));
		const node = children[0] as MdiRuby;
		expect(node.base).toBe("東|京");
		expect(node.ruby).toBe("とうきょう");
	});

	it("treats an unclosed ruby as literal text", () => {
		const children = firstParagraphChildren(parse("{東京|とうきょう"));
		expect(children.every((child) => child.type === "text")).toBe(true);
		expect((children[0] as Text).value).toBe("{東京|とうきょう");
	});

	it("treats a brace pair with no separator as literal text", () => {
		const children = firstParagraphChildren(parse("{plain}"));
		expect(children).toHaveLength(1);
		expect(children[0].type).toBe("text");
		expect((children[0] as Text).value).toBe("{plain}");
	});

	it("counts split segments in grapheme clusters, not UTF-16 code units", () => {
		// 𠮟 is a surrogate pair (one grapheme, two UTF-16 code units).
		const children = firstParagraphChildren(parse("{𠮟る|しか.る}"));
		const node = children[0] as MdiRuby;
		expect(node.ruby).toEqual(["しか", "る"]);
	});
});
