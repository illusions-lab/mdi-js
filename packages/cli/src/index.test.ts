import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { build, parseArgs } from "./index.js";

describe("mdi CLI library", () => it("builds HTML and DOCX output", async () => {
	const directory = await mkdtemp(join(tmpdir(), "mdi-cli-"));
	try {
		const input = join(directory, "book.mdi");
		await writeFile(input, "---\ntitle: Book\n---\n{東京|とうきょう}");
		const html = await build(input, "html");
		expect(await readFile(html, "utf8")).toContain("<title>Book</title>");
		const docx = await build(input, "docx");
		expect((await readFile(docx)).subarray(0, 2).toString()).toBe("PK");
	} finally { await rm(directory, { recursive: true, force: true }); }
}));

describe("parseArgs", () => {
	it("requires an output format", () => expect(parseArgs(["book.mdi"])).toBeUndefined());
	it("parses a supported format", () => expect(parseArgs(["book.mdi", "--to", "html"])).toEqual({ input: "book.mdi", format: "html" }));
});
