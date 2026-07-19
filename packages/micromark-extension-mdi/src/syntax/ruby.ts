import type { Code, Construct, Effects, State } from "micromark-util-types";
import { markdownLineEnding } from "micromark-util-character";
import { codes } from "micromark-util-symbol";

/**
 * `{base|ruby}` / `{base|r.u.by}` — SYNTAX.md §2.
 *
 * Scans base/ruby text as opaque runs, distinguishing only the `|`
 * separator and the closing `}`. Backslash-escaped delimiters (`\{` `\}`
 * `\|`) are consumed here as ordinary two-character pairs — this
 * tokenizer doesn't hand off to micromark-core-commonmark's
 * `characterEscape` construct, since ruby content never triggers other
 * MDI/CommonMark inline constructs (SYNTAX.md "Inline Nesting": ruby
 * content is plain text). Unescaping happens afterwards, in
 * mdast-util-mdi's fromMarkdown handler.
 *
 * Bails (`nok`) on end-of-file or a line ending before the closing `}` is
 * found, and on hitting `}` before any `|` (no separator means it isn't
 * ruby — the `{` stays literal text).
 */
export const ruby: Construct = {
	name: "mdiRuby",
	tokenize: tokenizeRuby,
};

function tokenizeRuby(effects: Effects, ok: State, nok: State): State {
	return start;

	function start(code: Code): State | undefined {
		effects.enter("mdiRuby");
		effects.enter("mdiRubyMarker");
		effects.consume(code);
		effects.exit("mdiRubyMarker");
		effects.enter("mdiRubyBase");
		return base;
	}

	function base(code: Code): State | undefined {
		if (code === codes.eof || markdownLineEnding(code)) {
			return nok(code);
		}
		if (code === codes.backslash) {
			effects.consume(code);
			return baseEscape;
		}
		if (code === codes.rightCurlyBrace) {
			// Closed before any `|` — not ruby.
			return nok(code);
		}
		if (code === codes.verticalBar) {
			effects.exit("mdiRubyBase");
			effects.enter("mdiRubySeparatorMarker");
			effects.consume(code);
			effects.exit("mdiRubySeparatorMarker");
			effects.enter("mdiRubyText");
			return text;
		}
		effects.consume(code);
		return base;
	}

	function baseEscape(code: Code): State | undefined {
		if (code === codes.eof || markdownLineEnding(code)) {
			return nok(code);
		}
		effects.consume(code);
		return base;
	}

	function text(code: Code): State | undefined {
		if (code === codes.eof || markdownLineEnding(code)) {
			return nok(code);
		}
		if (code === codes.backslash) {
			effects.consume(code);
			return textEscape;
		}
		if (code === codes.rightCurlyBrace) {
			effects.exit("mdiRubyText");
			effects.enter("mdiRubyMarker");
			effects.consume(code);
			effects.exit("mdiRubyMarker");
			effects.exit("mdiRuby");
			return ok;
		}
		effects.consume(code);
		return text;
	}

	function textEscape(code: Code): State | undefined {
		if (code === codes.eof || markdownLineEnding(code)) {
			return nok(code);
		}
		effects.consume(code);
		return text;
	}
}
