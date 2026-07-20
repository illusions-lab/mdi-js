/**
 * Reverses the SYNTAX.md §13 escapes (`\{` `\}` `\|` `\^` `\[` `\]` `\:`
 * `\《` `\》`, plus a literal `\\`) inside a raw token slice.
 *
 * Most of these characters are standard CommonMark ASCII punctuation, so
 * `\{`/`\}`/`\|`/`\^`/`\[`/`\]`/`\:` are already consumed as ordinary
 * characters by our tokenizers (which don't special-case backslash beyond
 * "don't let it end the scan") rather than by micromark's own
 * `characterEscape` construct — this function is what actually removes the
 * backslash afterwards, once per MDI construct that captures raw text.
 */
const ESCAPABLE = /\\([{}|^[\]:《》\\])/g;

export function unescapeMdi(value: string): string {
	return value.replace(ESCAPABLE, "$1");
}
