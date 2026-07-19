/**
 * Splits a string into extended grapheme clusters (Unicode UAX #29), per
 * SYNTAX.md Design Principle 4 — used to align split-ruby dot segments
 * with base characters.
 */
export function graphemes(value: string): string[] {
	const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
	return Array.from(segmenter.segment(value), (entry) => entry.segment);
}
