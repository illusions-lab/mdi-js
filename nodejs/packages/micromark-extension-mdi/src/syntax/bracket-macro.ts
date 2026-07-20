import type { Code, Construct, Event, Effects, State, Token, TokenizeContext } from "micromark-util-types";
import { codes } from "micromark-util-symbol";

type MacroName = "br" | "no-break" | "em" | "warichu" | "kern";

interface MacroToken extends Token {
	_mdiBracketMacro?: true;
	_mdiBalanced?: true;
	_mdiName?: MacroName;
	_mdiClose?: true;
}

export const bracketMacro: Construct = {
	name: "mdiBracketMacro",
	resolveAll,
	tokenize: tokenizeOpen,
};

export const bracketMacroClose: Construct = {
	name: "mdiBracketMacroClose",
	resolveTo,
	tokenize: tokenizeClose,
};

function tokenizeOpen(this: TokenizeContext, effects: Effects, ok: State, nok: State): State {
	const self = this;
	let name = "";
	let amount = "";
	let macro: MacroToken;

	return start;

	function start(code: Code): State | undefined {
		effects.enter("mdiBracketMacro");
		macro = self.events[self.events.length - 1]![1] as MacroToken;
		macro._mdiBracketMacro = true;
		effects.enter("mdiBracketMacroMarker");
		effects.consume(code);
		return secondOpen;
	}

	function secondOpen(code: Code): State | undefined {
		if (code !== codes.leftSquareBracket) return nok(code);
		effects.consume(code);
		effects.exit("mdiBracketMacroMarker");
		effects.enter("mdiBracketMacroName");
		return readName;
	}

	function readName(code: Code): State | undefined {
		if (code !== null && ((code >= codes.lowercaseA && code <= codes.lowercaseZ) || code === codes.dash)) {
			name += String.fromCodePoint(code);
			effects.consume(code);
			return readName;
		}
		effects.exit("mdiBracketMacroName");
		if (!isMacroName(name)) return nok(code);
		macro._mdiName = name;
		if (name === "br") return code === codes.rightSquareBracket ? brFirstClose(code) : nok(code);
		if (code !== codes.colon) return nok(code);
		effects.enter("mdiBracketMacroParamMarker");
		effects.consume(code);
		effects.exit("mdiBracketMacroParamMarker");
		if (name === "kern") {
			effects.enter("mdiBracketMacroParam");
			return readAmount;
		}
		effects.exit("mdiBracketMacro");
		return ok;
	}

	function brFirstClose(code: Code): State | undefined {
		effects.enter("mdiBracketMacroMarker");
		effects.consume(code);
		return brSecondClose;
	}

	function brSecondClose(code: Code): State | undefined {
		if (code !== codes.rightSquareBracket) return nok(code);
		effects.consume(code);
		effects.exit("mdiBracketMacroMarker");
		effects.exit("mdiBracketMacro");
		// Mark balanced but immediately drop the bracket-macro marker itself:
		// unlike the other macros (whose open token gets spliced away by
		// resolveTo once THEY close), br's fast self-contained close never
		// goes through resolveTo, so its token would otherwise sit in the
		// event stream forever still flagged `_mdiBracketMacro && _mdiBalanced`
		// - a false-positive match for a *later* macro's resolveTo/findOpen
		// scan, which only look at those two flags to find "the nearest
		// still-relevant bracket-macro token".
		macro._mdiBalanced = true;
		macro._mdiBracketMacro = undefined;
		return ok;
	}

	function readAmount(code: Code): State | undefined {
		if (code === codes.colon) {
			effects.exit("mdiBracketMacroParam");
			if (!/^[+-]?\d+(\.\d+)?em$/.test(amount)) return nok(code);
			effects.enter("mdiBracketMacroParamMarker");
			effects.consume(code);
			effects.exit("mdiBracketMacroParamMarker");
			effects.exit("mdiBracketMacro");
			return ok;
		}
		if (code === codes.eof || code === null) return nok(code);
		amount += String.fromCodePoint(code);
		effects.consume(code);
		return readAmount;
	}
}

function tokenizeClose(this: TokenizeContext, effects: Effects, ok: State, nok: State): State {
	const self = this;
	const open = findOpen(self.events);
	return start;

	function start(code: Code): State | undefined {
		if (!open || code !== codes.rightSquareBracket) return nok(code);
		if (open._mdiName === "no-break" && self.sliceSerialize({ start: open.end, end: self.now() }).length === 0) {
			return nok(code);
		}
		effects.enter("mdiBracketMacroMarker");
		const close = self.events[self.events.length - 1]![1] as MacroToken;
		close._mdiClose = true;
		effects.consume(code);
		return secondClose;
	}

	function secondClose(code: Code): State | undefined {
		if (code !== codes.rightSquareBracket) return nok(code);
		effects.consume(code);
		effects.exit("mdiBracketMacroMarker");
		open!._mdiBalanced = true;
		return ok;
	}
}

function resolveTo(events: Event[], context: TokenizeContext): Event[] {
	let closeIndex = events.length;
	while (closeIndex-- && !(events[closeIndex]![1] as MacroToken)._mdiClose) {}
	const close = events[closeIndex]![1] as MacroToken;
	// Nearest preceding balanced open, not the first one anywhere: once any
	// earlier bracket macro in the same paragraph has already closed (e.g. a
	// standalone [[br]]), its token is also `_mdiBracketMacro && _mdiBalanced`,
	// so a forward findIndex would wrongly pair this close with that unrelated,
	// already-resolved macro instead of the one it actually belongs to.
	let openIndex = closeIndex;
	while (openIndex-- && !(events[openIndex]![0] === "enter" && (events[openIndex]![1] as MacroToken)._mdiBracketMacro && (events[openIndex]![1] as MacroToken)._mdiBalanced)) {}
	const open = events[openIndex]![1] as MacroToken;
	const headerEnd = events.findIndex((event, index) => index > openIndex && event[0] === "exit" && event[1] === open);
	const group: Token = { type: "mdiBracketMacro", start: { ...open.start }, end: { ...close.end } };
	const content: Token = { type: "mdiBracketMacroContent", start: { ...open.end }, end: { ...close.start } };
	const replacement: Event[] = [
		["enter", group, context],
		...events.slice(openIndex + 1, headerEnd),
		["enter", content, context],
		...events.slice(headerEnd + 1, closeIndex),
		["exit", content, context],
		...events.slice(closeIndex),
		["exit", group, context],
	];
	events.splice(openIndex, events.length - openIndex, ...replacement);
	return events;
}

function resolveAll(events: Event[]): Event[] {
	for (const [, token] of events) {
		if ((token as MacroToken)._mdiBracketMacro && !(token as MacroToken)._mdiBalanced) token.type = "data";
	}
	return events;
}

function findOpen(events: Event[]): MacroToken | undefined {
	for (let index = events.length - 1; index >= 0; index--) {
		const token = events[index]![1] as MacroToken;
		if (token._mdiBracketMacro && !token._mdiBalanced) return token;
	}
}

function isMacroName(value: string): value is MacroName {
	return value === "br" || value === "no-break" || value === "em" || value === "warichu" || value === "kern";
}
