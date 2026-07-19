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
	it("rejects malformed and unrecognized argument forms", () => {
		for (const args of [[], ["book.mdi", "--to", "html", "extra"], ["book.mdi", "-o", "out.html"], ["book.mdi", "--to", "html", "-o"], ["book.mdi", "--wat", "html"], ["book.mdi", "--to", "txt"]]) {
			expect(parseArgs(args)).toBeUndefined();
		}
	});
	it("parses an explicit output path", () => expect(parseArgs(["book.mdi", "--to", "epub", "-o", "out/book.epub"])).toEqual({ input: "book.mdi", format: "epub", output: "out/book.epub" }));
});

describe("build edge cases", () => {
	it("rejects a missing input with the readable filesystem error", async () => {
		const missing = join(tmpdir(), "mdi-cli-missing-input.mdi");
		await expect(build(missing, "html")).rejects.toThrow(/ENOENT.*mdi-cli-missing-input\.mdi/);
	});

	it("writes an explicit output in a different directory", async () => {
		const directory = await mkdtemp(join(tmpdir(), "mdi-cli-output-"));
		try {
			const input = join(directory, "input", "book.mdi");
			const output = join(directory, "output", "book.html");
			await (await import("node:fs/promises")).mkdir(join(directory, "input"));
			await (await import("node:fs/promises")).mkdir(join(directory, "output"));
			await writeFile(input, "# Elsewhere");
			expect(await build(input, "html", output)).toBe(output);
			expect(await readFile(output, "utf8")).toContain("<h1>Elsewhere</h1>");
		} finally { await rm(directory, { recursive: true, force: true }); }
	});
});
