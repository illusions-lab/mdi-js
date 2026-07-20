import { describe, expect, it } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdi from "@illusions-lab/mdi-remark";
import { resolveExportProfile } from "@illusions-lab/mdi-export-profile";
import type { Root } from "mdast";
import { applyPdfProfile, mdiToPdf, renderHtmlToPdf } from "./index.js";

describe("mdiToPdf", () =>
  it("generates a browser-rendered PDF", async () => {
    const p = unified().use(remarkParse).use(remarkMdi);
    const tree = p.runSync(
      p.parse("---\nwriting-mode: vertical\n---\n{東京|とうきょう}")
    ) as Root;
    const pdf = await mdiToPdf(tree);
    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
    expect(pdf.length).toBeGreaterThan(500);
  }, 30_000));

describe("mdiToPdf edge cases", () => {
  it("renders plain Markdown and can be called repeatedly", async () => {
    const p = unified().use(remarkParse).use(remarkMdi);
    const tree = p.runSync(
      p.parse("# Plain heading\n\nA regular paragraph.")
    ) as Root;
    const [first, second] = await Promise.all([mdiToPdf(tree), mdiToPdf(tree)]);

    for (const pdf of [first, second]) {
      expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
      expect(pdf.length).toBeGreaterThan(500);
    }
  }, 30_000);
});

describe("renderHtmlToPdf", () =>
  it("acts as a Chromium-only layout adapter for Rust-owned HTML", async () => {
    const pdf = await renderHtmlToPdf(
      "<html><head></head><body><h1>Rust HTML</h1><p>東京</p></body></html>",
      undefined,
      "vertical"
    );
    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
    expect(pdf.length).toBeGreaterThan(500);
  }, 30_000));

describe("PDF page-number layout", () => {
  const profile = (format: "simple" | "dash" | "fraction", position: "top-left" | "bottom-right") => ({
    metadata: {},
    typesetting: { writingMode: "horizontal" as const, fontFamily: "serif", textIndentEm: 1, fullwidthSpaceIndent: false },
    pagination: {
      pageSize: "A4" as const,
      landscape: false,
      charactersPerLine: 40,
      linesPerPage: 30,
      gridMode: "strict" as const,
      margins: { top: 25.4, right: 25.4, bottom: 25.4, left: 25.4 },
      pageNumbers: { enabled: true, format, position },
    },
    epub: { chapterSplitLevel: "h1" as const },
    text: { fullwidthSpaceIndent: false, indentCount: 1 },
  });

  it.each([
    ["dash", "top-left"],
    ["fraction", "bottom-right"],
  ] as const)("renders %s numbering at %s", async (format, position) => {
    const pdf = await renderHtmlToPdf(
      "<html><head></head><body><p>numbered</p></body></html>",
      profile(format, position),
    );
    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
  }, 30_000);
});

describe("PDF export profile", () => {
  it("uses a readable A4 portrait baseline for horizontal documents", () => {
    const html = applyPdfProfile(
      "<html><head></head><body><p>本文</p></body></html>",
      resolveExportProfile()
    );
    expect(html).toContain("@page{size:210mm 297mm");
    expect(html).toContain("@page{size:210mm 297mm;margin:20mm 18mm 20mm 18mm}");
    expect(html).not.toContain("body{padding:");
    expect(html).toContain("html{writing-mode:horizontal-tb!important");
    expect(html).not.toContain("p+h1,p+h2,p+h3,p+h4,p+h5,p+h6{padding-top:.75em}");
  });
  it("applies margins through @page so every forced page receives them", () => {
    const html = applyPdfProfile(
      "<html><head></head><body><p>first</p><div class=\"mdi-pagebreak\"></div><p>second</p></body></html>",
      resolveExportProfile()
    );
    expect(html).toContain("@page{size:210mm 297mm;margin:20mm 18mm 20mm 18mm}");
    expect(html).toContain("mdi-pagebreak");
    expect(html).not.toContain("padding:20mm");
  });
  it("applies geometry, composition, full-width indentation, and page options", () => {
    const html = applyPdfProfile(
      "<html><head></head><body><p>本文</p></body></html>",
      {
        metadata: {},
        typesetting: {
          writingMode: "vertical",
          fontFamily: "Noto Serif JP",
          textIndentEm: 2,
          fullwidthSpaceIndent: true,
        },
        pagination: {
          pageSize: "A4",
          landscape: false,
          charactersPerLine: 40,
          linesPerPage: 30,
          gridMode: "strict",
          margins: { top: 34, bottom: 28, left: 28, right: 45 },
          pageNumbers: {
            enabled: true,
            format: "fraction",
            position: "bottom-center",
          },
        },
        epub: { chapterSplitLevel: "h1" },
        text: { fullwidthSpaceIndent: false, indentCount: 1 },
      }
    );
    expect(html).toContain("@page{size:210mm 297mm");
    expect(html).toContain("writing-mode:vertical-rl");
    expect(html).toContain("font-family:Noto Serif JP");
    expect(html).toContain("<p>　　本文");
  });
  it("uses physical CJK grid CSS by default", () => {
    const html = applyPdfProfile(
      "<html><head></head><body><p>本文</p></body></html>",
      resolveExportProfile()
    );
    // Printable height is 257 mm; strict 30 lines use a fixed 8.566… mm pitch.
    expect(html).toContain("--mdi-grid-mode:strict");
    expect(html).toContain("--mdi-characters-per-line:40");
    expect(html).toContain("--mdi-lines-per-page:30");
    expect(html).toMatch(/line-height:8\.566(?:6+)?mm/);
    expect(html).toContain("p{margin:0;text-indent:1em}");
  });
  it("uses explicit point size and line spacing only in typographic mode", () => {
    const html = applyPdfProfile(
      "<html><head></head><body><p>本文</p></body></html>",
      resolveExportProfile({
        typesetting: { fontSize: 12, lineSpacing: 1.5 },
        pagination: { gridMode: "typographic", charactersPerLine: 60, linesPerPage: 50 },
      })
    );
    expect(html).toMatch(/font-size:4\.23\d+mm;line-height:1\.5/);
    expect(html).toContain("line-height:1.5");
  });
});
