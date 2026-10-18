import fs from 'node:fs';
// node record.mjs day channel postId dueAt
const [,, day, ch, id, due] = process.argv;
const f='state/scheduled.json'; const s=JSON.parse(fs.readFileSync(f,'utf8'));
(s.done[day] ??= {})[ch]=id; s.lastDue[ch]=due;
fs.writeFileSync(f, JSON.stringify(s,null,2)+'\n');
