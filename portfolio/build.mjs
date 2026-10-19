// Renders index.html to the print-ready PDF (and optional page previews).
// Usage: node build.mjs [--previews <dir>]
import { chromium } from "playwright";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, "Raneem-Ali-Profile.pdf");
const previewIdx = process.argv.indexOf("--previews");
const previewDir = previewIdx > -1 ? process.argv[previewIdx + 1] : null;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1123, height: 794 } });
await page.goto(pathToFileURL(path.join(here, "index.html")).href, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

await page.pdf({ path: out, width: "297mm", height: "210mm", printBackground: true, preferCSSPageSize: true });
console.log("PDF →", out);

if (previewDir) {
  fs.mkdirSync(previewDir, { recursive: true });
  await page.emulateMedia({ media: "print" });
  const pages = await page.$$(".page");
  for (let i = 0; i < pages.length; i++) {
    await pages[i].screenshot({ path: path.join(previewDir, `p${String(i + 1).padStart(2, "0")}.png`) });
  }
  console.log("Previews →", previewDir);
}
await browser.close();
