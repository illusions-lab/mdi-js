import type { Extension as FromMarkdownExtension } from "mdast-util-from-markdown";
import type { MdiEm, MdiKern, MdiNoBreak, MdiRuby, MdiTcy, MdiWarichu } from "./types.js";
import { unescapeMdi } from "./unescape.js";
import { graphemes } from "./graphemes.js";

/**
 * mdast-util-from-markdown extension for the constructs tokenized by
 * micromark-extension-mdi's `mdi()`.
 *
 * Implements the MDI inline constructs currently supported by the syntax
 * extension; remaining MDI constructs are added incrementally.
 */
export function mdiFromMarkdown(): FromMarkdownExtension {
	return {
		enter: {
			mdiBracketMacro(token) {
				const source = this.sliceSerialize(token);
				if (source.startsWith("[[br")) {
					this.enter({ type: "mdiBreak" }, token);
				} else if (source.startsWith("[[no-break:")) {
					this.enter({ type: "mdiNoBreak", children: [] }, token);
				} else if (source.startsWith("[[em:")) {
					this.enter({ type: "mdiEm", mark: "﹅", children: [] }, token);
				} else if (source.startsWith("[[warichu:")) {
					this.enter({ type: "mdiWarichu", children: [] }, token);
				} else {
					const amount = source.slice("[[kern:".length).split(":", 1)[0]!;
					this.enter({ type: "mdiKern", amount: unescapeMdi(amount), children: [] }, token);
				}
			},
			mdiRuby(token) {
				this.enter({ type: "mdiRuby", base: "", ruby: "" }, token);
			},
			mdiTcy(token) {
				this.enter({ type: "mdiTcy", value: "" }, token);
			},
			mdiBotenAlias(token) {
				this.enter({ type: "mdiEm", mark: "﹅", children: [] }, token);
			},
		},
		exit: {
			mdiBracketMacro(token) {
				const node = this.stack[this.stack.length - 1] as MdiEm | MdiKern | MdiNoBreak | MdiWarichu | { type: "mdiBreak" };
				if (node.type === "mdiEm") resolveEm(node, this.sliceSerialize(token));
				this.exit(token);
			},
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
			mdiTcyText(token) {
				const node = this.stack[this.stack.length - 1] as MdiTcy;
				node.value = unescapeMdi(this.sliceSerialize(token));
			},
			mdiTcy(token) {
				this.exit(token);
			},
			mdiBotenAliasText(token) {
				const node = this.stack[this.stack.length - 1] as MdiEm;
				node.children = [{ type: "text", value: unescapeMdi(this.sliceSerialize(token)) }];
			},
			mdiBotenAlias(token) {
				this.exit(token);
			},
		},
	};
}

function resolveEm(node: MdiEm, source: string): void {
	const raw = source.slice("[[em:".length, -2);
	const first = bareColon(raw);
	if (first < 0) return;
	const mark = raw.slice(0, first);
	if (graphemes(mark).length !== 1 || /[\s\p{Cc}]/u.test(mark)) return;
	node.mark = unescapeMdi(mark);
	const prefix = mark + ":";
	const firstChild = node.children[0];
	if (firstChild?.type === "text" && firstChild.value.startsWith(prefix)) {
		firstChild.value = firstChild.value.slice(prefix.length);
		if (firstChild.value.length === 0) node.children.shift();
	}
}

function bareColon(value: string, start = 0): number {
	for (let index = start; index < value.length; index++) {
		if (value[index] === "\\") {
			index++;
		} else if (value[index] === ":") {
			return index;
		}
	}
	return -1;
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
