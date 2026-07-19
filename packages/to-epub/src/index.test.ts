import JSZip from "jszip";
import { describe, expect, it } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdi from "@illusions-lab/mdi-remark";
import type { Root } from "mdast";
import { mdiToEpub } from "./index.js";

describe("mdiToEpub", () => it("packages pagebreak segments as EPUB spine chapters", async () => {
	const p = unified().use(remarkParse).use(remarkMdi);
	const zip = await JSZip.loadAsync(await mdiToEpub(p.runSync(p.parse("---\ntitle: Test\n---\none\n\n[[pagebreak]]\n\ntwo")) as Root));
	expect(await zip.file("mimetype")!.async("string")).toBe("application/epub+zip");
	// JSZip drops `.options.compression` on reload; compressed === uncompressed
	// size is the reliable signal that STORE (no compression) was used.
	const mimetypeData = (zip.file("mimetype") as unknown as { _data: { compressedSize: number; uncompressedSize: number } })._data;
	expect(mimetypeData.compressedSize).toBe(mimetypeData.uncompressedSize);
	expect(zip.file("META-INF/container.xml")).toBeTruthy();
	const opf = await zip.file("OEBPS/package.opf")!.async("string");
	expect(opf).toContain('<itemref idref="chapter-1"/>');
	expect(opf).toContain('<itemref idref="chapter-2"/>');
	expect(Object.keys(zip.files).filter(name => name.startsWith("OEBPS/chapter-")).length).toBe(2);
}));
