import { describe, expect, it } from "vitest";
import {
  PAGE_SIZES,
  parseExportProfileJson,
  resolveExportProfile,
} from "./index.js";

describe("export profiles", () => {
  it("resolves every supported paper size", () => {
    for (const pageSize of PAGE_SIZES)
      expect(
        resolveExportProfile({ pagination: { pageSize } }).pagination.pageSize
      ).toBe(pageSize);
  });
  it("rejects invalid values instead of silently changing print layout", () => {
    expect(() =>
      resolveExportProfile({ pagination: { pageSize: "A11" as never } })
    ).toThrow("Unsupported page size");
    expect(() =>
      resolveExportProfile({ pagination: { charactersPerLine: 9 } })
    ).toThrow("charactersPerLine");
    expect(() =>
      resolveExportProfile({ typesetting: { textIndentEm: 4.1 } })
    ).toThrow("textIndentEm");
    expect(() => resolveExportProfile({ text: { indentCount: 0 } })).toThrow(
      "text.indentCount"
    );
  });
  it("parses nested profile settings", () => {
    const profile = parseExportProfileJson(
      '{"typesetting":{"writingMode":"horizontal","fullwidthSpaceIndent":true},"pagination":{"pageNumbers":{"format":"fraction","position":"top-right"}},"epub":{"chapterSplitLevel":"h3"}}'
    );
    expect(profile.typesetting.writingMode).toBe("horizontal");
    expect(profile.pagination.pageNumbers).toEqual({
      enabled: true,
      format: "fraction",
      position: "top-right",
    });
    expect(profile.epub.chapterSplitLevel).toBe("h3");
  });
  it("rejects malformed profiles", () => {
    expect(() => parseExportProfileJson("[]")).toThrow("JSON object");
    expect(() => parseExportProfileJson("{")).toThrow("valid JSON");
  });
  it("rejects runtime JSON values with the wrong primitive type", () => {
    expect(() =>
      parseExportProfileJson('{"pagination":{"landscape":"yes"}}')
    ).toThrow("landscape must be a boolean");
    expect(() => parseExportProfileJson('{"metadata":{"title":42}}')).toThrow(
      "metadata.title must be a string"
    );
    expect(() =>
      parseExportProfileJson('{"pagination":{"margins":[]}}')
    ).toThrow("pagination.margins must be an object");
  });
});
