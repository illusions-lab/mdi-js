import { describe, expect, it } from "vitest";
import { graphemes } from "./graphemes.js";

describe("graphemes", () => {
	it("splits plain BMP text one character at a time", () => {
		expect(graphemes("東京")).toEqual(["東", "京"]);
	});

	it("counts a surrogate-pair kanji as one grapheme", () => {
		// 𠮟 (U+20B9F) is one grapheme, two UTF-16 code units.
		expect(graphemes("𠮟る").length).toBe(2);
	});

	it("counts a ZWJ emoji sequence as one grapheme", () => {
		expect(graphemes("👨‍👩‍👧")).toEqual(["👨‍👩‍👧"]);
	});

	it("returns an empty array for an empty string", () => {
		expect(graphemes("")).toEqual([]);
	});
});
