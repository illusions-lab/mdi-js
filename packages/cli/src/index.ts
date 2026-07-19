import { readFile, writeFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdi from "@illusions-lab/mdi-remark";
import { mdiToHtml } from "@illusions-lab/mdi-to-html";
import { mdiToPdf } from "@illusions-lab/mdi-to-pdf";
import { mdiToEpub } from "@illusions-lab/mdi-to-epub";
import { mdiToDocx } from "@illusions-lab/mdi-to-docx";
import type { Root } from "mdast";

export const MDI_SPEC_VERSION = "2.0";
export type OutputFormat = "html" | "pdf" | "epub" | "docx";

export async function build(input: string, format: OutputFormat, output?: string): Promise<string> {
	const source = await readFile(input, "utf8");
	const processor = unified().use(remarkParse).use(remarkMdi);
	const tree = processor.runSync(processor.parse(source)) as Root;
	const result = format === "html" ? mdiToHtml(tree) : format === "pdf" ? await mdiToPdf(tree) : format === "epub" ? await mdiToEpub(tree) : await mdiToDocx(tree);
	const destination = output ?? input.slice(0, input.length - extname(input).length) + `.${format}`;
	await writeFile(destination, result);
	return resolve(destination);
}

export function parseArgs(args: string[]): { input: string; format: OutputFormat; output?: string } | undefined {
	const [input, flag, format, ...rest] = args;
	if (!input || flag !== "--to" || !isFormat(format)) return undefined;
	if (rest.length === 0) return { input, format };
	if (rest.length === 2 && rest[0] === "-o") return { input, format, output: rest[1] };
	return undefined;
}
function isFormat(value: string | undefined): value is OutputFormat { return value === "html" || value === "pdf" || value === "epub" || value === "docx"; }
