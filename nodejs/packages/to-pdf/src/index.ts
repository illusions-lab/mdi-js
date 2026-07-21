import { chromium } from "playwright";
import type { Root } from "mdast";
import { mdiToHtml } from "@illusions-lab/mdi-to-html";
import {
  PAGE_DIMENSIONS,
  resolvePrintProfile,
  type ExportProfile,
  type ResolvedExportProfile,
} from "@illusions-lab/mdi-export-profile";

export const MDI_SPEC_VERSION = "2.0";

/**
 * Print a complete, already-rendered MDI HTML document through Chromium.
 *
 * This is deliberately a layout adapter: callers must obtain the HTML from
 * the Rust core and must not supply an alternative MDI parser or renderer.
 */
export async function renderHtmlToPdf(
  html: string,
  profile?: ExportProfile,
  sourceWritingMode?: unknown
): Promise<Buffer> {
  const resolved = resolvePrintProfile(profile, sourceWritingMode);
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(applyPdfProfile(html, resolved));
    const pageNumber = resolved.pagination.pageNumbers;
    return Buffer.from(
      await page.pdf({
        preferCSSPageSize: true,
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

/** Renders an MDI document with the complete Illusions PDF export profile. */
export async function mdiToPdf(
  tree: Root,
  profile?: ExportProfile
): Promise<Buffer> {
  const sourceWritingMode = (
    tree.data as { frontmatter?: { writingMode?: unknown } } | undefined
  )?.frontmatter?.writingMode;
  return renderHtmlToPdf(mdiToHtml(tree), profile, sourceWritingMode);
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
  const cross =
    typesetting.writingMode === "vertical"
      ? width - pagination.margins.left - pagination.margins.right
      : height - pagination.margins.top - pagination.margins.bottom;
  // The profile resolver always provides a physical point size. PDF layout
  // must use that same value as DOCX/EPUB rather than retain a dead fallback.
  const fontSize = (typesetting.fontSize! / 72) * 25.4;
  const strictGrid = pagination.gridMode === "strict";
  const inline =
    typesetting.writingMode === "vertical"
      ? height - pagination.margins.top - pagination.margins.bottom
      : width - pagination.margins.left - pagination.margins.right;
  const characterPitch = inline / pagination.charactersPerLine;
  // CSS character spacing is placed between glyphs, so use N - 1 intervals.
  // This makes ordinary full-width CJK body text occupy the resolved manuscript
  // inline extent without changing the requested body type size.
  const rawCharacterSpacing = strictGrid
    ? (inline - fontSize * pagination.charactersPerLine) /
      Math.max(1, pagination.charactersPerLine - 1)
    : 0;
  const characterSpacing = Math.abs(rawCharacterSpacing) < 1e-9
    ? 0
    : rawCharacterSpacing;
  const linePitch = cross / pagination.linesPerPage;
  // A physical length, rather than a multiplier, prevents browser font-metric
  // differences from changing the number of manuscript lines in strict mode.
  const lineHeight = strictGrid
    ? `${linePitch}mm`
    : typesetting.lineSpacing === undefined
    ? cross / pagination.linesPerPage / fontSize
    : typesetting.lineSpacing;
  const fullwidth = typesetting.fullwidthSpaceIndent
    ? "　".repeat(Math.round(typesetting.textIndentEm))
    : "";
  const writingMode =
    typesetting.writingMode === "vertical" ? "vertical-rl" : "horizontal-tb";
  const strictBlockCss = strictGrid
    ? `p{margin:0;text-indent:${typesetting.fullwidthSpaceIndent ? "0" : `${typesetting.textIndentEm}em`}}h1,h2,h3,h4,h5,h6{font-size:1em;line-height:inherit;color:#000;break-after:avoid;margin:0;font-weight:bold}`
    : `p{margin:0 0 .75em;text-indent:${typesetting.fullwidthSpaceIndent ? "0" : `${typesetting.textIndentEm}em`}}h1,h2,h3,h4,h5,h6{color:#000;break-after:avoid;margin:0 0 .75em;line-height:1.25}p+h1,p+h2,p+h3,p+h4,p+h5,p+h6{padding-top:.75em}h1{font-size:1.6em}h2{font-size:1.35em}h3{font-size:1.15em}`;
  const css = `<style id="mdi-export-profile">${pageRules(width, height, profile)}html{writing-mode:${writingMode}!important;background:#fff;color:#000;--mdi-grid-mode:${pagination.gridMode};--mdi-character-pitch:${characterPitch}mm;--mdi-character-spacing:${characterSpacing}mm;--mdi-line-pitch:${linePitch}mm;--mdi-characters-per-line:${pagination.charactersPerLine};--mdi-lines-per-page:${pagination.linesPerPage}}html,body{margin:0;box-sizing:border-box}body{font-family:${cssValue(
    typesetting.fontFamily
  )};font-size:${fontSize}mm;line-height:${lineHeight};letter-spacing:${characterSpacing}mm;writing-mode:${writingMode};text-orientation:mixed;color:#000}${strictBlockCss}a{color:inherit;text-decoration:none}.mdi-pagebreak,.mdi-pagebreak-right,.mdi-pagebreak-left{background:transparent}</style>`;
  return html
    .replace("</head>", `${css}</head>`)
    .replace(/(<p(?:\s[^>]*)?>)(?!\s*<\/p>)/g, `$1${fullwidth}`);
}

/** Emit physical mirror margins for book spreads; `bindingSide` describes odd pages. */
function pageRules(
  width: number,
  height: number,
  profile: ResolvedExportProfile,
): string {
  const { top, right, bottom, left } = profile.pagination.margins;
  const base = `@page{size:${width}mm ${height}mm;margin:${top}mm ${right}mm ${bottom}mm ${left}mm}`;
  if (profile.layout.marginMode !== "mirror") return base;
  const odd = profile.layout.bindingSide === "right"
    ? `${top}mm ${right}mm ${bottom}mm ${left}mm`
    : `${top}mm ${left}mm ${bottom}mm ${right}mm`;
  const even = profile.layout.bindingSide === "right"
    ? `${top}mm ${left}mm ${bottom}mm ${right}mm`
    : `${top}mm ${right}mm ${bottom}mm ${left}mm`;
  return `${base}@page :right{margin:${odd}}@page :left{margin:${even}}`;
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
  return value.replace(/[{}<>;]/g, "");
}
