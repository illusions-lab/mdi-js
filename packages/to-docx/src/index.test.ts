import JSZip from "jszip";
import { describe, expect, it } from "vitest";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdi from "@illusions-lab/mdi-remark";
import type { Root } from "mdast";
import { mdiToDocx } from "./index.js";

function parse(source: string): Root {
  const p = unified().use(remarkParse).use(remarkMdi);
  return p.runSync(p.parse(source)) as Root;
}

describe("mdiToDocx", () =>
  it("creates a DOCX containing ordinary, ruby, and tcy runs", async () => {
    const p = unified().use(remarkParse).use(remarkMdi);
    const zip = await JSZip.loadAsync(
      await mdiToDocx(
        p.runSync(p.parse("# Heading\n\nplain {東京|とうきょう} ^12^")) as Root
      )
    );
    const document = await zip.file("word/document.xml")!.async("string");
    expect(document).toContain("<w:document");
    expect(document).toContain("<w:ruby>");
    expect(document).toContain("<w:eastAsianLayout");
  }));

describe("mdiToDocx edge cases", () => {
  it("keeps supported GFM list and inline content while table blocks are skipped", async () => {
    const zip = await JSZip.loadAsync(
      await mdiToDocx(
        parse(
          "- [x] done ~~old~~ {東京|とうきょう}\n\n| A | B |\n| - | - |\n| dropped | table |"
        )
      )
    );
    const document = await zip.file("word/document.xml")!.async("string");
    expect(document).toContain("done");
    expect(document).toContain("<w:strike/>");
    expect(document).toContain("<w:ruby>");
    expect(document).not.toContain("dropped");
  });

  it("serializes split ruby readings as a dot-joined Word ruby reading", async () => {
    const zip = await JSZip.loadAsync(
      await mdiToDocx(parse("{東京|とう.きょう}"))
    );
    const document = await zip.file("word/document.xml")!.async("string");
    expect(document).toContain("<w:rt><w:r><w:t>とう.きょう</w:t>");
  });

  it("generates ordinary DOCX content without ruby or tcy XML", async () => {
    const zip = await JSZip.loadAsync(
      await mdiToDocx(parse("# Heading\n\nPlain text"))
    );
    const document = await zip.file("word/document.xml")!.async("string");
    expect(document).toContain("Plain text");
    expect(document).not.toContain("<w:ruby>");
    expect(document).not.toContain("<w:eastAsianLayout");
  });

  it("maps paper, typography, margins, full-width indentation, and page numbers to OOXML", async () => {
    const zip = await JSZip.loadAsync(
      await mdiToDocx(parse("paragraph"), {
        typesetting: {
          writingMode: "horizontal",
          fontFamily: "Noto Serif JP",
          textIndentEm: 2,
          fullwidthSpaceIndent: true,
        },
        pagination: {
          pageSize: "A4",
          landscape: false,
          charactersPerLine: 40,
          linesPerPage: 30,
          margins: { top: 10, bottom: 11, left: 12, right: 13 },
          pageNumbers: {
            enabled: true,
            format: "fraction",
            position: "top-right",
          },
        },
      })
    );
    const document = await zip.file("word/document.xml")!.async("string");
    const header = await zip.file("word/header1.xml")!.async("string");
    expect(document).toContain('w:w="11906"'); // A4 width in twips
    expect(document).toContain('w:top="567"');
    expect(document).toContain('<w:t xml:space="preserve">　　</w:t>');
    expect(document).toContain("paragraph");
    expect(header).toContain(">PAGE<");
    expect(header).toContain("NUMPAGES");
  });
});
