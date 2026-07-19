import { describe, expect, it } from "vitest";
import { fromMarkdown } from "mdast-util-from-markdown";
import { mdi } from "micromark-extension-mdi";
import type { Paragraph, Root, Text } from "mdast";
import { mdiFromMarkdown } from "./from-markdown.js";
import type { MdiEm, MdiRuby, MdiTcy } from "./types.js";

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

describe("mdiTcy", () => {
	it("parses tate-chu-yoko within text", () => {
		const children = firstParagraphChildren(parse("第^12^話"));
		expect(children).toHaveLength(3);
		const node = children[1] as MdiTcy;
		expect(node.type).toBe("mdiTcy");
		expect(node.value).toBe("12");
	});

	it("parses tate-chu-yoko at the start of text", () => {
		const children = firstParagraphChildren(parse("^OK^"));
		const node = children[0] as MdiTcy;
		expect(node.type).toBe("mdiTcy");
		expect(node.value).toBe("OK");
	});

	it("treats invalid tate-chu-yoko content as literal text", () => {
		const children = firstParagraphChildren(parse("(^_^)"));
		expect(children).toHaveLength(1);
		expect((children[0] as Text).value).toBe("(^_^)");
	});

	it("treats tate-chu-yoko with more than six characters as literal text", () => {
		const children = firstParagraphChildren(parse("^1234567^"));
		expect(children).toHaveLength(1);
		expect((children[0] as Text).value).toBe("^1234567^");
	});

	it("treats empty tate-chu-yoko as literal text", () => {
		const children = firstParagraphChildren(parse("^^"));
		expect(children).toHaveLength(1);
		expect((children[0] as Text).value).toBe("^^");
	});

	it("treats tate-chu-yoko unclosed at a line ending as literal text", () => {
		const children = firstParagraphChildren(parse("^12\nnext"));
		expect((children[0] as Text).value).toBe("^12\nnext");
	});
});

describe("mdiBotenAlias", () => {
	it("parses the boten alias", () => {
		const children = firstParagraphChildren(parse("彼は《《それ》》を見た。"));
		expect(children).toHaveLength(3);
		const node = children[1] as MdiEm;
		expect(node.type).toBe("mdiEm");
		expect(node.mark).toBe("﹅");
		expect(node.children).toEqual([{ type: "text", value: "それ" }]);
	});

	it("treats title quotes inside the boten alias as literal text", () => {
		const children = firstParagraphChildren(parse("《《雪》考》"));
		expect(children).toHaveLength(1);
		expect((children[0] as Text).value).toBe("《《雪》考》");
	});

	it("treats a bare opening title quote inside the boten alias as literal text", () => {
		const children = firstParagraphChildren(parse("《《雪《考》》"));
		expect(children).toHaveLength(1);
		expect((children[0] as Text).value).toBe("《《雪《考》》");
	});

	it("leaves a single opening title quote as literal text", () => {
		const children = firstParagraphChildren(parse("《それ》"));
		expect(children).toHaveLength(1);
		expect((children[0] as Text).value).toBe("《それ》");
	});

	it("treats an unclosed boten alias as literal text", () => {
		const children = firstParagraphChildren(parse("《《それ"));
		expect(children).toHaveLength(1);
		expect((children[0] as Text).value).toBe("《《それ");
	});

	it("unescapes title quotes inside the boten alias", () => {
		const children = firstParagraphChildren(parse(String.raw`《《a\《b》》`));
		expect((children[0] as MdiEm).children).toEqual([{ type: "text", value: "a《b" }]);
	});

	it("keeps alias content as plain text", () => {
		const children = firstParagraphChildren(parse("《《^12^》》"));
		expect((children[0] as MdiEm).children).toEqual([{ type: "text", value: "^12^" }]);
	});
});
