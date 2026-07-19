import { toHtml } from "hast-util-to-html";
import type { Root } from "mdast";
import { MDI_STYLESHEET, mdiToHast } from "@illusions-lab/mdi-to-hast";

export const MDI_SPEC_VERSION = "2.0";

export function mdiToHtml(tree: Root): string {
	const { hast, frontmatter } = mdiToHast(tree);
	const lang = frontmatter?.lang ?? "ja";
	const title = frontmatter?.title ? `<title>${escapeHtml(frontmatter.title)}</title>` : "";
	const vertical = frontmatter?.writingMode === "vertical" ? ' style="writing-mode: vertical-rl;"' : "";
	return `<!DOCTYPE html><html lang="${escapeHtml(lang)}"${vertical}><head><meta charset="utf-8">${title}<style>${MDI_STYLESHEET}</style></head><body>${toHtml(hast)}</body></html>`;
}

function escapeHtml(value: string): string {
	return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
}
