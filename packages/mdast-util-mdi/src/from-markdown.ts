import type { Extension as FromMarkdownExtension } from "mdast-util-from-markdown";
import type { MdiRuby } from "./types.js";
import { unescapeMdi } from "./unescape.js";
import { graphemes } from "./graphemes.js";

/**
 * mdast-util-from-markdown extension for the constructs tokenized by
 * micromark-extension-mdi's `mdi()`.
 *
 * Currently implements ruby (SYNTAX.md §2) only; the remaining 11
 * extensions are added incrementally as their tokenizers land.
 */
export function mdiFromMarkdown(): FromMarkdownExtension {
	return {
		enter: {
			mdiRuby(token) {
				this.enter({ type: "mdiRuby", base: "", ruby: "" }, token);
			},
		},
		exit: {
			mdiRubyBase(token) {
				const node = this.stack[this.stack.length - 1] as MdiRuby;
				node.base = unescapeMdi(this.sliceSerialize(token));
			},
			mdiRubyText(token) {
				const node = this.stack[this.stack.length - 1] as MdiRuby;
				node.ruby = resolveRuby(node.base, unescapeMdi(this.sliceSerialize(token)));
			},
			mdiRuby(token) {
				this.exit(token);
			},
		},
	};
}

/**
 * Split-ruby dot segments must line up 1:1 with the base's grapheme
 * clusters, with no empty segment — otherwise fall back to group ruby
 * (dots removed), per SYNTAX.md §2 "Edge Cases".
 */
function resolveRuby(base: string, rawRuby: string): string | string[] {
	if (!rawRuby.includes(".")) {
		return rawRuby;
	}

	const segments = rawRuby.split(".");
	const baseChars = graphemes(base);
	const isValidSplit = segments.length === baseChars.length && segments.every((segment) => segment.length > 0);

	return isValidSplit ? segments : segments.join("");
}
