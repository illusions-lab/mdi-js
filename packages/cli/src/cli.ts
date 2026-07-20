#!/usr/bin/env node
import { build, loadExportProfile, parseArgs } from "./index.js";

const args = parseArgs(process.argv.slice(3));
if (!args || process.argv[2] !== "build") {
  console.error(
    "Usage: mdi build <input.mdi> --to html|pdf|epub|docx|txt|txt-ruby|narou|kakuyomu|aozora|txt-all [--config export.json] [-o <output>]"
  );
  process.exitCode = 1;
} else {
  try {
    const output = await build(args.input, args.format, {
      output: args.output,
      profile: await loadExportProfile(args.config),
    });
    for (const path of Array.isArray(output) ? output : [output]) console.log(`Written ${path}`);
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
