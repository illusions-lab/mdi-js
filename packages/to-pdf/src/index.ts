import { chromium } from "playwright";
import type { Root } from "mdast";
import { mdiToHtml } from "@illusions-lab/mdi-to-html";

export const MDI_SPEC_VERSION = "2.0";

export async function mdiToPdf(tree: Root): Promise<Buffer> {
	const browser = await chromium.launch({ headless: true });
	try {
		const page = await browser.newPage();
		await page.setContent(mdiToHtml(tree));
		return Buffer.from(await page.pdf());
	} finally {
		await browser.close();
	}
}
