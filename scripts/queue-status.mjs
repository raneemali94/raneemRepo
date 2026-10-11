// What the daily routine should do next. Usage:
//   node scripts/queue-status.mjs '{"instagram":7,"linkedin":7,"twitter":7}' [nowISO]
// The JSON is the current count of scheduled+sending posts per channel (from Buffer list_posts).
// Prints how many days still need writing and, per channel, the posts to schedule with their dueAt.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(fs.readFileSync(path.join(root, 'content/plan.json'), 'utf8'));
const state = JSON.parse(fs.readFileSync(path.join(root, 'state/scheduled.json'), 'utf8'));

const LIMIT = 10; // Buffer free plan: scheduled posts per channel
const MIN_UNSCHEDULED_DAYS = 10; // write new days when fewer than this are left unscheduled
const counts = JSON.parse(process.argv[2] || '{}');
const now = new Date(process.argv[3] || Date.now());
const TZ = plan.meta.timezone; // "+03:00"
const TIMES = { linkedin: plan.meta.times.linkedin, twitter: plan.meta.times.x, instagram: plan.meta.times.instagram };

const iso = (date, hm) => `${date}T${hm}:00${TZ}`;
const addDays = (date, n) => {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const done = state.done || {};
const lastDue = state.lastDue || {}; // channel -> last scheduled dueAt (ISO)

const out = { now: now.toISOString(), channels: {} };
let unscheduledDays = 0;
for (const day of plan.days) if (!['instagram', 'linkedin', 'twitter'].every((c) => done[day.id]?.[c])) unscheduledDays++;
out.unscheduledDays = unscheduledDays;
out.writeNewDays = unscheduledDays < MIN_UNSCHEDULED_DAYS ? MIN_UNSCHEDULED_DAYS : 0;
out.nextDayId = Math.max(...plan.days.map((d) => d.id)) + 1;
out.nextDate = addDays(plan.days.at(-1).date, 1);

for (const ch of ['linkedin', 'twitter', 'instagram']) {
  const free = Math.max(0, LIMIT - (counts[ch] ?? LIMIT));
  const todo = [];
  let prev = lastDue[ch] ? new Date(lastDue[ch]) : null;
  for (const day of plan.days) {
    if (todo.length >= free) break;
    if (done[day.id]?.[ch]) continue;
    let date = day.date;
    // never in the past, never before or on the same day as this channel's last scheduled post
    while (new Date(iso(date, TIMES[ch])) <= now || (prev && date <= prev.toISOString().slice(0, 10))) date = addDays(date, 1);
    const dueAt = iso(date, TIMES[ch]);
    todo.push({ day: day.id, dueAt });
    prev = new Date(dueAt);
  }
  out.channels[ch] = { free, schedule: todo };
}
console.log(JSON.stringify(out, null, 2));
