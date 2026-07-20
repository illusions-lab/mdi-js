import { parseMdiSyntaxJson } from "@illusions-lab/mdi-core";

/** MDI specification version implemented by this binding. */
export const MDI_SPEC_VERSION = "2.0" as const;

/** Transitional document-IR version used by the stage-1 binding. */
export const MDI_IR_VERSION = "0.1" as const;

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

export type MdiInline =
	| { type: "text"; value: string }
	| { type: "ruby"; base: string; ruby: MdiRubyReading }
	| { type: "tcy"; value: string }
	| { type: "break" }
	| { type: "em"; mark: string; children: MdiInline[] }
	| { type: "noBreak"; children: MdiInline[] }
	| { type: "warichu"; children: MdiInline[] }
	| { type: "kern"; amount: string; children: MdiInline[] };

export type MdiBlock =
	| {
			type: "paragraph";
			inlines: MdiInline[];
			indent: number | null;
			bottom: number | null;
	  }
	| { type: "blank" }
	| { type: "pagebreak"; variant: "left" | "right" | null };

export interface MdiSyntaxDocument {
	blocks: MdiBlock[];
}

/**
 * Versioned result returned by the Rust parser.
 *
 * Capability flags are part of the contract so callers cannot accidentally
 * treat the stage-1 MDI-only syntax tree as a finished CommonMark document.
 */
export interface MdiSyntaxParseResult {
	irVersion: typeof MDI_IR_VERSION;
	syntaxVersion: typeof MDI_SPEC_VERSION;
	capabilities: MdiParserCapabilities;
	document: MdiSyntaxDocument;
	diagnostics: MdiDiagnostic[];
}

/**
 * Parse MDI syntax in Rust and return the versioned language-neutral IR.
 *
 * This stage-1 API intentionally has a distinct name from the future
 * whole-document `parse`: CommonMark, GFM, front matter, and source spans are
 * not represented yet. Inspect `capabilities` instead of assuming support.
 */
export function parseMdiSyntax(source: string): MdiSyntaxParseResult {
	if (typeof source !== "string") throw new TypeError("source must be a string");
	const result = JSON.parse(parseMdiSyntaxJson(source)) as MdiSyntaxParseResult;
	if (result.irVersion !== MDI_IR_VERSION) {
		throw new Error(`Unsupported MDI IR version: ${String(result.irVersion)}`);
	}
	return result;
}
