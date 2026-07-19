import { describe, expect, it } from "vitest";
import { codes } from "micromark-util-symbol";
import { mdiConstructs } from "./types.js";

describe("mdiConstructs", () => {
	it("keeps the bracketMacro (inline) and blockMacro (flow) families separate", () => {
		// Both are triggered by `[[`, but must stay distinct constructs —
		// SYNTAX.md parses them at different stages (inline vs block).
		expect(mdiConstructs.bracketMacro.contentType).toBe("text");
		expect(mdiConstructs.blockMacro.contentType).toBe("flow");
		expect(mdiConstructs.bracketMacro.triggers).toContain(codes.leftSquareBracket);
		expect(mdiConstructs.blockMacro.triggers).toContain(codes.leftSquareBracket);
	});

	it("marks every flow construct as paragraph-interrupting", () => {
		for (const info of Object.values(mdiConstructs)) {
			if (info.contentType === "flow") {
				expect(info.interruptsParagraph).toBe(true);
			}
		}
	});

	it("marks no construct as needing resolveAll", () => {
		for (const info of Object.values(mdiConstructs)) {
			expect(info.needsResolveAll).toBe(false);
		}
	});

	it("registers the blank family under all three alternate-spelling triggers", () => {
		expect(mdiConstructs.blank.triggers).toEqual(
			expect.arrayContaining([codes.backslash, codes.lessThan, codes.leftSquareBracket]),
		);
	});
});
