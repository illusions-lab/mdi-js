import type { Code, Construct, Effects, State } from "micromark-util-types";
import { codes, types } from "micromark-util-symbol";
import { CJK_LEFT_DOUBLE_ANGLE, CJK_RIGHT_DOUBLE_ANGLE } from "../types.js";

/**
 * `\《` / `\》` — SYNTAX.md §13. These aren't ASCII punctuation, so
 * micromark-core-commonmark's own `characterEscape` construct (which only
 * covers the ASCII punctuation set) never touches them, and every other
 * MDI construct that captures raw text (ruby, tcy, boten alias) does its
 * own local unescaping on its own captured span — but bracket macro
 * content (em/no-break/warichu/kern) is never captured as one span; it
 * flows through the ambient text scanner, so nothing else in the pipeline
 * would ever unescape `\《`/`\》` there.
 *
 * Reuses CommonMark's own `characterEscape`/`characterEscapeValue` token
 * names (not new MDI-specific ones) so mdast-util-from-markdown's built-in
 * handlers for those two types - already wired to merge into the ambient
 * text run - apply here for free, with no fromMarkdown-side code needed.
 */
export const cjkEscape: Construct = {
	name: "mdiCjkEscape",
	tokenize: tokenizeCjkEscape,
};

function tokenizeCjkEscape(effects: Effects, ok: State, nok: State): State {
	return start;

	function start(code: Code): State | undefined {
		effects.enter(types.characterEscape);
		effects.enter(types.escapeMarker);
		effects.consume(code);
		effects.exit(types.escapeMarker);
		return inside;
	}

	function inside(code: Code): State | undefined {
		if (code !== CJK_LEFT_DOUBLE_ANGLE && code !== CJK_RIGHT_DOUBLE_ANGLE) {
			return nok(code);
		}
		effects.enter(types.characterEscapeValue);
		effects.consume(code);
		effects.exit(types.characterEscapeValue);
		effects.exit(types.characterEscape);
		return ok;
	}
}
