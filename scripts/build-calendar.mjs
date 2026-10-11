// Rebuild content/calendar.md (readable plan) from content/plan.json.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const p = JSON.parse(fs.readFileSync(path.join(root, 'content/plan.json'), 'utf8'));
const P = { update: 'تحديث', issue: 'مشكلة', tip: 'نصيحة', case: 'مثال', personal: 'شخصي', offer: 'دعوة' };
const first = p.days[0].date, last = p.days.at(-1).date;
let o = `# خطة المحتوى (${first} → ${last})\n\nكل يوم = بوست انستجرام (كاروسيل) + بوست لينكدإن + تغريدة/ثريد في X، وكل منصة بصيغتها. التصاميم في \`designs/day-XX/\`.\n\n| اليوم | التاريخ | النوع | الموضوع | انستجرام | لينكدإن | X |\n|---|---|---|---|---|---|---|\n`;
for (const d of p.days) o += `| ${d.id} | ${d.date} | ${P[d.pillar] || d.pillar} | ${d.topic} | كاروسيل ${d.ig.slides.length + 2} شرائح | نص + صورة | ${d.x.tweets.length > 1 ? 'ثريد ' + d.x.tweets.length : 'تغريدة'} + صورة |\n`;
o += '\n---\n';
for (const d of p.days) {
  const n = String(d.id).padStart(2, '0');
  const tw = d.x.tweets.map((t, i) => (d.x.tweets.length > 1 ? `**${i + 1}/${d.x.tweets.length}** ` : '') + t).join('\n\n');
  o += `\n## اليوم ${d.id} — ${d.topic}\n**${d.date} · ${P[d.pillar] || d.pillar}**\n\n### انستجرام\n![](../designs/day-${n}/ig-1.png)\n\n${d.ig.caption}\n\n${d.ig.hashtags.join(' ')}\n\n### لينكدإن\n${d.li.text}\n\n${d.li.hashtags.join(' ')}\n\n### X\n${tw}\n`;
}
fs.writeFileSync(path.join(root, 'content/calendar.md'), o);
console.log('calendar.md:', p.days.length, 'days');
