import {
	parseMdiSyntaxJson,
	renderHtml as renderHtmlFromRust,
	renderEpub as renderEpubFromRust,
	renderDocx as renderDocxFromRust,
	renderText as renderTextFromRust,
	renderTextFormat as renderTextFormatFromRust,
	serializeMdi as serializeMdiFromRust,
} from "@illusions-lab/mdi-core";

/** MDI specification version implemented by this binding. */
export const MDI_SPEC_VERSION = "2.0" as const;

/** Version of the complete Rust-owned document IR. */
export const MDI_IR_VERSION = "1.0" as const;

export interface MdiParserCapabilities {
	mdi: boolean;
	commonMark: boolean;
	gfm: boolean;
	frontMatter: boolean;
	sourceSpans: boolean;
}

export interface MdiSourceSpan {
	/** Inclusive UTF-8 byte offset. */
	startByte: number;
	/** Exclusive UTF-8 byte offset. */
	endByte: number;
}

export interface MdiDiagnostic {
	severity: "warning" | "error";
	code: string;
	message: string;
	span?: MdiSourceSpan;
}

export type MdiRubyReading =
	| { type: "group"; value: string }
	| { type: "split"; value: string[] };

/** A tagged CommonMark, GFM, or MDI node produced by Rust. */
export interface MdiNode {
	type: string;
	span?: MdiSourceSpan;
	children?: MdiNode[];
	[key: string]: unknown;
}

export interface MdiFrontmatter {
	span: MdiSourceSpan;
	raw: string;
	entries: Array<{ key: string; value: unknown }>;
}

export interface MdiDocument {
	span: MdiSourceSpan;
	frontmatter?: MdiFrontmatter;
	children: MdiNode[];
}

/**
 * Versioned result returned by the Rust parser.
 *
 * Capability flags describe the grammar and source information included in
 * this complete Rust-owned document tree.
 */
export interface MdiSyntaxParseResult {
	irVersion: typeof MDI_IR_VERSION;
	syntaxVersion: typeof MDI_SPEC_VERSION;
	capabilities: MdiParserCapabilities;
	document: MdiDocument;
	diagnostics: MdiDiagnostic[];
}

/** @deprecated Use {@link MdiDocument}. */
export type MdiSyntaxDocument = MdiDocument;

/**
 * Parse the complete `.mdi` source in Rust and return the versioned
 * language-neutral document IR. JavaScript performs no grammar work.
 */
export function parse(source: string): MdiSyntaxParseResult {
	if (typeof source !== "string") throw new TypeError("source must be a string");
	const result = JSON.parse(parseMdiSyntaxJson(source)) as MdiSyntaxParseResult;
	if (result.irVersion !== MDI_IR_VERSION) {
		throw new Error(`Unsupported MDI IR version: ${String(result.irVersion)}`);
	}
	return result;
}

/** Render complete `.mdi` source to standalone HTML in Rust. */
export function renderHtml(source: string): string {
	if (typeof source !== "string") throw new TypeError("source must be a string");
	return renderHtmlFromRust(source);
}

/** Build a baseline EPUB 3 archive from complete source in Rust. */
export function renderEpub(source: string): Uint8Array {
	if (typeof source !== "string") throw new TypeError("source must be a string");
	return renderEpubFromRust(source);
}

/** Build a baseline DOCX archive from complete source in Rust. */
export function renderDocx(source: string): Uint8Array {
	if (typeof source !== "string") throw new TypeError("source must be a string");
	return renderDocxFromRust(source);
}

/** Parse and normalize complete `.mdi` source with Rust's serializer. */
export function serializeMdi(source: string): string {
	if (typeof source !== "string") throw new TypeError("source must be a string");
	return serializeMdiFromRust(source);
}

/** Render complete `.mdi` source to deterministic plain text in Rust. */
export function renderText(source: string): string {
	if (typeof source !== "string") throw new TypeError("source must be a string");
	return renderTextFromRust(source);
}

export type MdiTextFormat = "txt" | "txt-ruby" | "narou" | "kakuyomu" | "aozora";

/** Render a named publication-text convention through Rust. */
export function renderTextFormat(
	source: string,
	format: MdiTextFormat,
	indentPrefix = "",
): string {
	if (typeof source !== "string" || typeof indentPrefix !== "string") {
		throw new TypeError("source and indentPrefix must be strings");
	}
	return renderTextFormatFromRust(source, format, indentPrefix);
}

/** @deprecated Use {@link parse}; it now parses the complete document. */
export const parseMdiSyntax = parse;
