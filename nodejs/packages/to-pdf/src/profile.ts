import {
  PAGE_DIMENSIONS,
  resolvePrintProfile,
  type ExportProfile,
  type ResolvedExportProfile,
} from "@illusions-lab/mdi-export-profile";

export interface ChromiumPrintPageNumber {
  enabled: boolean;
  format: ResolvedExportProfile["pagination"]["pageNumbers"]["format"];
  position: ResolvedExportProfile["pagination"]["pageNumbers"]["position"];
  /** HTML for Chromium's header or footer print slot, when one is needed. */
  headerTemplate?: string;
  /** HTML for Chromium's header or footer print slot, when one is needed. */
  footerTemplate?: string;
}

/**
 * Browser-safe data needed to print Rust-rendered HTML with Chromium.
 *
 * `html` already contains all layout CSS, so it can be used directly with an
 * Electron BrowserWindow or a document opened for `window.print()`. The
 * remaining values are physical print metadata for hosts such as
 * `webContents.printToPDF()`. No browser is launched by this module.
 */
export interface ChromiumPrintProfile {
  html: string;
  profile: ResolvedExportProfile;
  page: {
    widthMm: number;
    heightMm: number;
    marginsMm: ResolvedExportProfile["pagination"]["margins"];
    landscape: boolean;
  };
  pageNumbers: ChromiumPrintPageNumber;
}

/**
 * Apply an export profile and expose the Chromium print metadata without
 * importing Playwright, Node built-ins, or any Chromium launcher.
 */
export function prepareChromiumPrintProfile(
  html: string,
  profile?: ExportProfile,
  sourceWritingMode?: unknown,
): ChromiumPrintProfile {
  if (typeof html !== "string") throw new TypeError("html must be a string");
  const resolved = resolvePrintProfile(profile, sourceWritingMode);
  const dimensions = PAGE_DIMENSIONS[resolved.pagination.pageSize];
  const widthMm = resolved.pagination.landscape ? dimensions.height : dimensions.width;
  const heightMm = resolved.pagination.landscape ? dimensions.width : dimensions.height;
  const pageNumbers = resolved.pagination.pageNumbers;
  const template = pageNumbers.enabled
    ? pageNumberTemplate(pageNumbers.format, pageNumbers.position)
    : undefined;

  return {
    html: applyPdfProfile(html, resolved),
    profile: resolved,
    page: {
      widthMm,
      heightMm,
      marginsMm: resolved.pagination.margins,
      landscape: resolved.pagination.landscape,
    },
    pageNumbers: {
      ...pageNumbers,
      ...(template && pageNumbers.position.startsWith("top-")
        ? { headerTemplate: template }
        : template
          ? { footerTemplate: template }
          : {}),
    },
  };
}

/** Converts page geometry and Japanese composition settings into isolated print CSS. */
export function applyPdfProfile(
  html: string,
  profile: ResolvedExportProfile,
): string {
  const { pagination, typesetting } = profile;
  const dimensions = PAGE_DIMENSIONS[pagination.pageSize];
  const width = pagination.landscape ? dimensions.height : dimensions.width;
  const height = pagination.landscape ? dimensions.width : dimensions.height;
  const cross =
    typesetting.writingMode === "vertical"
      ? width - pagination.margins.left - pagination.margins.right
      : height - pagination.margins.top - pagination.margins.bottom;
  const fontSize = (typesetting.fontSize! / 72) * 25.4;
  const strictGrid = pagination.gridMode === "strict";
  const inline =
    typesetting.writingMode === "vertical"
      ? height - pagination.margins.top - pagination.margins.bottom
      : width - pagination.margins.left - pagination.margins.right;
  const characterPitch = inline / pagination.charactersPerLine;
  const rawCharacterSpacing = strictGrid
    ? (inline - fontSize * pagination.charactersPerLine) /
      Math.max(1, pagination.charactersPerLine - 1)
    : 0;
  const characterSpacing = Math.abs(rawCharacterSpacing) < 1e-9
    ? 0
    : rawCharacterSpacing;
  const linePitch = cross / pagination.linesPerPage;
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
  return injectProfileStyle(html, css)
    .replace(/(<p(?:\s[^>]*)?>)(?!\s*<\/p>)/g, `$1${fullwidth}`);
}

function injectProfileStyle(html: string, css: string): string {
  if (/<\/head\s*>/i.test(html))
    return html.replace(/<\/head\s*>/i, `${css}</head>`);
  if (/<html(?:\s[^>]*)?>/i.test(html))
    return html.replace(/<html(?:\s[^>]*)?>/i, `$&<head>${css}</head>`);
  return `${css}${html}`;
}

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
  position: ResolvedExportProfile["pagination"]["pageNumbers"]["position"],
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
