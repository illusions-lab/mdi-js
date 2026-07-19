import { mdiFromMarkdown, mdiToMarkdown } from "mdast-util-mdi";
import { mdi } from "micromark-extension-mdi";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import type {} from "remark-parse";
import type {} from "remark-stringify";
import type { Processor } from "unified";
import { resolveFrontmatter } from "./frontmatter.js";

export const MDI_SPEC_VERSION = "2.0";
export type { MdiFrontmatter } from "./frontmatter.js";

export default function remarkMdi(this: Processor): void {
	const data = this.data();

	(data.micromarkExtensions ??= []).push(mdi());
	(data.fromMarkdownExtensions ??= []).push(mdiFromMarkdown());
	(data.toMarkdownExtensions ??= []).push(mdiToMarkdown());

	this.use(remarkGfm);
	this.use(remarkFrontmatter, ["yaml"]);
	this.use(() => resolveFrontmatter);
}
