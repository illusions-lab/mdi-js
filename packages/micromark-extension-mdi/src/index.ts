import type { Extension } from "micromark-util-types";
import { codes } from "micromark-util-symbol";
import { ruby } from "./syntax/ruby.js";

export const MDI_SPEC_VERSION = "2.0";

export type { MdiConstructFamily, MdiContentType, MdiConstructInfo } from "./types.js";
export { mdiConstructs } from "./types.js";

/**
 * micromark syntax extension for MDI 2.0. Only ruby is wired up so far;
 * the remaining constructs from `mdiConstructs` land incrementally.
 */
export function mdi(): Extension {
	return {
		text: {
			[codes.leftCurlyBrace]: ruby,
		},
	};
}
