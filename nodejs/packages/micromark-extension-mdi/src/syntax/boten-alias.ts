import type { Code, Construct, Effects, State } from "micromark-util-types";
import { markdownLineEnding } from "micromark-util-character";
import { codes } from "micromark-util-symbol";
import { CJK_LEFT_DOUBLE_ANGLE, CJK_RIGHT_DOUBLE_ANGLE } from "../types.js";

export const botenAlias: Construct = {
	name: "mdiBotenAlias",
	tokenize: tokenizeBotenAlias,
};

function tokenizeBotenAlias(effects: Effects, ok: State, nok: State): State {
	return start;

	function start(code: Code): State | undefined {
		effects.enter("mdiBotenAlias");
		effects.enter("mdiBotenAliasMarker");
		effects.consume(code);
		return open;
	}

	function open(code: Code): State | undefined {
		if (code !== CJK_LEFT_DOUBLE_ANGLE) {
			return nok(code);
		}
		effects.consume(code);
		effects.exit("mdiBotenAliasMarker");
		effects.enter("mdiBotenAliasText");
		return text;
	}

	function text(code: Code): State | undefined {
		if (code === codes.eof || markdownLineEnding(code) || code === CJK_LEFT_DOUBLE_ANGLE) {
			return nok(code);
		}
		if (code === codes.backslash) {
			effects.consume(code);
			return escape;
		}
		if (code === CJK_RIGHT_DOUBLE_ANGLE) {
			effects.exit("mdiBotenAliasText");
			effects.enter("mdiBotenAliasMarker");
			effects.consume(code);
			return close;
		}
		effects.consume(code);
		return text;
	}

	function escape(code: Code): State | undefined {
		if (code === codes.eof || markdownLineEnding(code)) {
			return nok(code);
		}
		effects.consume(code);
		return text;
	}

	function close(code: Code): State | undefined {
		if (code !== CJK_RIGHT_DOUBLE_ANGLE) {
			return nok(code);
		}
		effects.consume(code);
		effects.exit("mdiBotenAliasMarker");
		effects.exit("mdiBotenAlias");
		return ok;
	}
}
