import type { Code, Construct, Effects, State } from "micromark-util-types";
import { markdownLineEnding } from "micromark-util-character";
import { codes } from "micromark-util-symbol";

export const tcy: Construct = {
	name: "mdiTcy",
	tokenize: tokenizeTcy,
};

function tokenizeTcy(effects: Effects, ok: State, nok: State): State {
	let size = 0;

	return start;

	function start(code: Code): State | undefined {
		effects.enter("mdiTcy");
		effects.enter("mdiTcyMarker");
		effects.consume(code);
		effects.exit("mdiTcyMarker");
		effects.enter("mdiTcyText");
		return text;
	}

	function text(code: Code): State | undefined {
		if (code === codes.eof || markdownLineEnding(code)) {
			return nok(code);
		}
		if (code === codes.caret && size > 0) {
			effects.exit("mdiTcyText");
			effects.enter("mdiTcyMarker");
			effects.consume(code);
			effects.exit("mdiTcyMarker");
			effects.exit("mdiTcy");
			return ok;
		}
		if (size === 6 || !isTcyCharacter(code)) {
			return nok(code);
		}
		size++;
		effects.consume(code);
		return text;
	}
}

function isTcyCharacter(code: Code): boolean {
	return (
		(code !== null && code >= codes.digit0 && code <= codes.digit9) ||
		(code !== null && code >= codes.uppercaseA && code <= codes.uppercaseZ) ||
		(code !== null && code >= codes.lowercaseA && code <= codes.lowercaseZ) ||
		code === codes.exclamationMark ||
		code === codes.questionMark
	);
}
