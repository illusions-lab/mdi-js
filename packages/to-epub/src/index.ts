import JSZip from "jszip";
import { toHtml } from "hast-util-to-html";
import type { Root } from "mdast";
import type { RootContent as HastRootContent } from "hast";
import { MDI_STYLESHEET, mdiToHast } from "@illusions-lab/mdi-to-hast";

export const MDI_SPEC_VERSION = "2.0";

export async function mdiToEpub(tree: Root): Promise<Buffer> {
	const zip = new JSZip();
	const { hast, frontmatter } = mdiToHast(tree);
	const chapters = splitChapters(hast.children);
	const title = frontmatter?.title ?? "Untitled";
	const lang = frontmatter?.lang ?? "ja";
	const id = "urn:uuid:mdi-document";
	zip.file("mimetype", "application/epub+zip", { compression: "STORE" });
	zip.file("META-INF/container.xml", '<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/package.opf" media-type="application/oebps-package+xml"/></rootfiles></container>');
	zip.file("OEBPS/style.css", MDI_STYLESHEET);
	zip.file("OEBPS/nav.xhtml", xhtml("Contents", lang, `<nav epub:type="toc" id="toc"><ol>${chapters.map((_, i) => `<li><a href="chapter-${i + 1}.xhtml">Chapter ${i + 1}</a></li>`).join("")}</ol></nav>`));
	chapters.forEach((children, index) => zip.file(`OEBPS/chapter-${index + 1}.xhtml`, xhtml(title, lang, toHtml({ type: "root", children }))));
	const metadata = `<dc:title>${xml(title)}</dc:title>${frontmatter?.author ? `<dc:creator>${xml(frontmatter.author)}</dc:creator>` : ""}<dc:language>${xml(lang)}</dc:language>${frontmatter?.date ? `<dc:date>${xml(String(frontmatter.date))}</dc:date>` : ""}`;
	const manifest = `<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="css" href="style.css" media-type="text/css"/>${chapters.map((_, i) => `<item id="chapter-${i + 1}" href="chapter-${i + 1}.xhtml" media-type="application/xhtml+xml"/>`).join("")}`;
	zip.file("OEBPS/package.opf", `<?xml version="1.0" encoding="UTF-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">${id}</dc:identifier>${metadata}</metadata><manifest>${manifest}</manifest><spine>${chapters.map((_, i) => `<itemref idref="chapter-${i + 1}"/>`).join("")}</spine></package>`);
	return zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
}

function splitChapters(children: HastRootContent[]): HastRootContent[][] {
	const chapters: HastRootContent[][] = [[]];
	for (const child of children) {
		if (isPagebreak(child)) chapters.push([]);
		else chapters.at(-1)!.push(child);
	}
	return chapters;
}

// mdiToHast() has already turned mdast `mdiPagebreak` nodes into
// `<div class="mdi-pagebreak">` hast elements by the time we see this tree.
function isPagebreak(node: HastRootContent): boolean {
	return (
		node.type === "element" &&
		node.tagName === "div" &&
		Array.isArray(node.properties?.className) &&
		node.properties.className.includes("mdi-pagebreak")
	);
}
function xhtml(title: string, lang: string, body: string): string {
	return `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${xml(lang)}" lang="${xml(lang)}"><head><title>${xml(title)}</title><link rel="stylesheet" type="text/css" href="style.css"/></head><body>${body}</body></html>`;
}
function xml(value: string): string { return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;"); }
