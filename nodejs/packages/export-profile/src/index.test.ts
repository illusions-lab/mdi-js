import { describe, expect, it } from "vitest";
import {
  PAGE_SIZES,
  parseExportProfileJson,
  resolveExportProfile,
  resolvePrintProfile,
} from "./index.js";

describe("export profiles", () => {
  it("resolves every supported paper size", () => {
    for (const pageSize of PAGE_SIZES)
      expect(
        resolveExportProfile({ pagination: { pageSize } }).pagination.pageSize
      ).toBe(pageSize);
  });
  it("uses the publisher A4 40 × 30 strict manuscript grid by default", () => {
    const profile = resolveExportProfile();
    expect(profile.typesetting.writingMode).toBe("horizontal");
    expect(profile.pagination).toMatchObject({
      pageSize: "A4",
      landscape: false,
      charactersPerLine: 40,
      linesPerPage: 30,
      gridMode: "strict",
      margins: { top: 20, bottom: 20, left: 18, right: 18 },
    });
  });
  it("uses front matter for the writing-mode default without overriding explicit settings", () => {
    expect(resolvePrintProfile({}, "vertical").typesetting.writingMode).toBe(
      "vertical"
    );
    expect(resolvePrintProfile({}, "vertical").pagination.landscape).toBe(true);
    const explicit = resolvePrintProfile(
      {
        typesetting: { writingMode: "horizontal" },
        pagination: { landscape: false },
      },
      "vertical"
    );
    expect(explicit.typesetting.writingMode).toBe("horizontal");
    expect(explicit.pagination.landscape).toBe(false);
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
  it("normalizes explicit point sizes and baseline multipliers", () => {
    const profile = resolveExportProfile({
      typesetting: { fontSize: 11, lineSpacing: 1.5 },
      pagination: { gridMode: "typographic" },
    });
    expect(profile.typesetting).toMatchObject({
      fontSize: 11,
      lineSpacing: 1.5,
    });
    expect(
      resolveExportProfile({
        typesetting: { fontSizePt: 10.5, lineHeight: 1.2 },
        pagination: { gridMode: "typographic" },
      }).typesetting
    ).toMatchObject({ fontSize: 10.5, lineSpacing: 1.2 });
    expect(resolveExportProfile().typesetting.fontSize).toBeUndefined();
    expect(resolveExportProfile().typesetting.lineSpacing).toBeUndefined();
  });
  it("does not silently break a strict publisher grid", () => {
    expect(() =>
      resolveExportProfile({ typesetting: { fontSize: 11 } })
    ).toThrow("gridMode: typographic");
    expect(() =>
      resolveExportProfile({ typesetting: { lineSpacing: 1.5 } })
    ).toThrow("gridMode: typographic");
    expect(
      resolveExportProfile({
        pagination: { gridMode: "typographic", charactersPerLine: 32, linesPerPage: 28 },
        typesetting: { fontSize: 11, lineSpacing: 1.4 },
      }).pagination
    ).toMatchObject({ gridMode: "typographic", charactersPerLine: 32, linesPerPage: 28 });
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
  it("rejects every invalid structured profile option", () => {
    expect(() => resolveExportProfile(null as never)).toThrow(
      "Export profile must be an object"
    );
    expect(() => resolveExportProfile({ typesetting: [] as never })).toThrow(
      "typesetting must be an object"
    );
    expect(() => resolveExportProfile({ metadata: { author: 1 } as never })).toThrow(
      "metadata.author must be a string"
    );
    expect(() => resolveExportProfile({ typesetting: { fontFamily: 1 as never } })).toThrow(
      "fontFamily must be a string"
    );
    expect(() => resolveExportProfile({ typesetting: { fontSize: 3 } })).toThrow(
      "fontSize"
    );
    expect(() => resolveExportProfile({ typesetting: { lineSpacing: 4 } })).toThrow(
      "lineSpacing"
    );
    expect(() => resolveExportProfile({ pagination: { gridMode: "flexible" as never } })).toThrow(
      "gridMode"
    );
    expect(() => resolveExportProfile({ typesetting: { fontSize: 11, fontSizePt: 12 } })).toThrow(
      "fontSize and fontSizePt"
    );
    expect(() => resolveExportProfile({ epub: { coverPath: 1 as never } })).toThrow(
      "coverPath must be a string"
    );
    expect(() => resolveExportProfile({ typesetting: { writingMode: "sideways" as never } })).toThrow(
      "writingMode must be vertical or horizontal"
    );
    expect(() => resolveExportProfile({ epub: { chapterSplitLevel: "h4" as never } })).toThrow(
      "chapterSplitLevel must be h1, h2, h3, or none"
    );
    expect(() => resolveExportProfile({ pagination: { pageNumbers: { format: "roman" as never } } })).toThrow(
      "Unsupported page number format"
    );
    expect(() => resolveExportProfile({ pagination: { pageNumbers: { position: "middle" as never } } })).toThrow(
      "Unsupported page number position"
    );
  });
});
