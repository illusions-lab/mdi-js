import { chromium } from "playwright";
import type { Root } from "mdast";
import { mdiToHtml } from "@illusions-lab/mdi-to-html";
import {
  PAGE_DIMENSIONS,
  resolveExportProfile,
  type ExportProfile,
  type ResolvedExportProfile,
} from "@illusions-lab/mdi-export-profile";

export const MDI_SPEC_VERSION = "2.0";

/** Renders an MDI document with the complete Illusions PDF export profile. */
export async function mdiToPdf(
  tree: Root,
  profile?: ExportProfile
): Promise<Buffer> {
  const sourceWritingMode = (
    tree.data as { frontmatter?: { writingMode?: unknown } } | undefined
  )?.frontmatter?.writingMode;
  const resolved = resolveExportProfile(
    profile ?? {
      typesetting: {
        writingMode:
          sourceWritingMode === "vertical" ? "vertical" : "horizontal",
      },
    }
  );
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(applyPdfProfile(mdiToHtml(tree), resolved));
    const dimensions = PAGE_DIMENSIONS[resolved.pagination.pageSize];
    const width = resolved.pagination.landscape
      ? dimensions.height
      : dimensions.width;
    const height = resolved.pagination.landscape
      ? dimensions.width
      : dimensions.height;
    const pageNumber = resolved.pagination.pageNumbers;
    return Buffer.from(
      await page.pdf({
        width: `${width}mm`,
        height: `${height}mm`,
        printBackground: true,
        margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
        displayHeaderFooter: pageNumber.enabled,
        headerTemplate:
          pageNumber.enabled && pageNumber.position.startsWith("top-")
            ? pageNumberTemplate(pageNumber.format, pageNumber.position)
            : "<span></span>",
        footerTemplate:
          pageNumber.enabled && pageNumber.position.startsWith("bottom-")
            ? pageNumberTemplate(pageNumber.format, pageNumber.position)
            : "<span></span>",
      })
    );
  } finally {
    await browser.close();
  }
}

/** Converts page geometry and Japanese composition settings into isolated print CSS. */
export function applyPdfProfile(
  html: string,
  profile: ResolvedExportProfile
): string {
  const { pagination, typesetting } = profile;
  const dimensions = PAGE_DIMENSIONS[pagination.pageSize];
  const width = pagination.landscape ? dimensions.height : dimensions.width;
  const height = pagination.landscape ? dimensions.width : dimensions.height;
  const primary =
    typesetting.writingMode === "vertical"
      ? height - pagination.margins.top - pagination.margins.bottom
      : width - pagination.margins.left - pagination.margins.right;
  const cross =
    typesetting.writingMode === "vertical"
      ? width - pagination.margins.left - pagination.margins.right
      : height - pagination.margins.top - pagination.margins.bottom;
  const fontSize = primary / pagination.charactersPerLine;
  const lineHeight = cross / pagination.linesPerPage / fontSize;
  const fullwidth = typesetting.fullwidthSpaceIndent
    ? "　".repeat(Math.round(typesetting.textIndentEm))
    : "";
  const css = `<style id="mdi-export-profile">@page{size:${width}mm ${height}mm;margin:0}html,body{width:${width}mm;height:${height}mm;margin:0;box-sizing:border-box}body{padding:${
    pagination.margins.top
  }mm ${pagination.margins.right}mm ${pagination.margins.bottom}mm ${
    pagination.margins.left
  }mm;font-family:${cssValue(
    typesetting.fontFamily
  )};font-size:${fontSize}mm;line-height:${lineHeight};writing-mode:${
    typesetting.writingMode === "vertical" ? "vertical-rl" : "horizontal-tb"
  };text-orientation:mixed}p{text-indent:${
    typesetting.fullwidthSpaceIndent ? "0" : `${typesetting.textIndentEm}em`
  }}</style>`;
  return html
    .replace("</head>", `${css}</head>`)
    .replace(/(<p(?:\s[^>]*)?>)(?!\s*<\/p>)/g, `$1${fullwidth}`);
}

function pageNumberTemplate(
  format: ResolvedExportProfile["pagination"]["pageNumbers"]["format"],
  position: ResolvedExportProfile["pagination"]["pageNumbers"]["position"]
): string {
  const align = position.endsWith("left")
    ? "left"
    : position.endsWith("right")
    ? "right"
    : "center";
  const page = '<span class="pageNumber"></span>';
  const value =
    format === "dash"
      ? `— ${page} —`
      : format === "fraction"
      ? `${page} / <span class="totalPages"></span>`
      : page;
  return `<div style="width:100%;font-size:8pt;text-align:${align};padding:0 8mm">${value}</div>`;
}

function cssValue(value: string): string {
  return value.replace(/[{}<>;]/g, "") || "serif";
}
