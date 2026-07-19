import { describe, expect, it } from "vitest";
import { unescapeMdi } from "./unescape.js";

describe("unescapeMdi", () => {
	it.each([
		[String.raw`\{`, "{"],
		[String.raw`\}`, "}"],
		[String.raw`\|`, "|"],
		[String.raw`\^`, "^"],
		[String.raw`\[`, "["],
		[String.raw`\]`, "]"],
		[String.raw`\:`, ":"],
		[String.raw`\《`, "《"],
		[String.raw`\》`, "》"],
		[String.raw`\\`, "\\"],
	])("unescapes %s to %s", (input, expected) => {
		expect(unescapeMdi(input)).toBe(expected);
	});

	it("leaves a backslash before a non-escapable character alone", () => {
		expect(unescapeMdi(String.raw`\n`)).toBe(String.raw`\n`);
	});

	it("unescapes multiple occurrences in one string", () => {
		expect(unescapeMdi(String.raw`\{東\|京\}`)).toBe("{東|京}");
	});
});
