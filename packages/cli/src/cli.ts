#!/usr/bin/env node
import { build, parseArgs } from "./index.js";

const args = parseArgs(process.argv.slice(3));
if (!args || process.argv[2] !== "build") {
	console.error("Usage: mdi build <input.mdi> --to html|pdf|epub|docx [-o <output>]");
	process.exitCode = 1;
} else {
	build(args.input, args.format, args.output).catch((error: unknown) => {
		console.error(error instanceof Error ? error.message : String(error));
		process.exitCode = 1;
	});
}
