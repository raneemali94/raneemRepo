// Render all designs from content/plan.json to designs/. Usage: node scripts/render.mjs [dayId ...]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { igCover, igSlide, igCta, liImage, xImage, highlight, brandBoard } from './templates.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(fs.readFileSync(path.join(root, 'content/plan.json'), 'utf8'));
const handles = JSON.parse(fs.readFileSync(path.join(root, 'brand/handles.json'), 'utf8'));
const only = process.argv.slice(2).map(Number);

const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage();

async function shot(html, w, h, out) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await page.screenshot({ path: out });
}

for (const day of plan.days) {
  if (only.length && !only.includes(day.id)) continue;
  const dir = path.join(root, 'designs', `day-${String(day.id).padStart(2, '0')}`);
  fs.rmSync(dir, { recursive: true, force: true });
  const total = day.ig.slides.length + 2;
  await shot(igCover(day, total, handles), 1080, 1350, path.join(dir, 'ig-1.png'));
  for (const [i, s] of day.ig.slides.entries()) await shot(igSlide(day, s, i + 2, total, handles), 1080, 1350, path.join(dir, `ig-${i + 2}.png`));
  await shot(igCta(day, total, handles), 1080, 1350, path.join(dir, `ig-${total}.png`));
  await shot(liImage(day, handles), 1200, 1200, path.join(dir, 'li.png'));
  await shot(xImage(day, handles), 1600, 900, path.join(dir, 'x.png'));
  console.log('day', day.id, 'done');
}

if (!only.length) {
  const b = path.join(root, 'designs', 'brand');
  await shot(brandBoard(handles), 1600, 1100, path.join(b, 'brand-board.png'));
  const hl = [['تحديثات', 'updates'], ['نصايح', 'tips'], ['أمثلة', 'cases'], ['خدماتي', 'services'], ['آراء', 'reviews']];
  for (const [w, f] of hl) await shot(highlight(w, handles), 1080, 1080, path.join(b, `highlight-${f}.png`));
  console.log('brand done');
}
await browser.close();
