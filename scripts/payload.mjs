// Prints the Buffer create_post args for one plan day and channel. Usage: node scripts/payload.mjs <day> <linkedin|twitter|instagram> <dueAt>
import fs from 'node:fs';
const [,, id, ch, dueAt] = process.argv;
const plan = JSON.parse(fs.readFileSync('content/plan.json','utf8'));
const st = JSON.parse(fs.readFileSync('state/scheduled.json','utf8'));
const d = plan.days.find(x=>x.id==id); const dd=String(id).padStart(2,'0');
const u=f=>`https://raw.githubusercontent.com/raneemali94/raneemRepo/${st.image_ref}/designs/day-${dd}/${f}`;
let p={channelId:st.channels[ch],schedulingType:'automatic',mode:'customScheduled',dueAt};
if(ch==='linkedin'){p.text=d.li.text+(d.li.hashtags?.length?'\n\n'+d.li.hashtags.join(' '):'');p.assets=[{image:{url:u('li.png'),metadata:{altText:d.li.image.title}}}];}
if(ch==='instagram'){p.text=d.ig.caption+'\n\n'+d.ig.hashtags.join(' ');const n=fs.readdirSync(`designs/day-${dd}`).filter(f=>/^ig-\d+\.png$/.test(f)).length;
 const alts=[d.ig.cover.title,...d.ig.slides.map(s=>s.t),d.ig.cta?.title||d.ig.cta?.t||d.ig.cta||'CTA'];
 p.assets=Array.from({length:n},(_,i)=>({image:{url:u(`ig-${i+1}.png`),metadata:{altText:String(alts[i]??d.ig.cover.title)}}}));p.metadata={instagram:{type:'post',shouldShareToFeed:true}};}
if(ch==='twitter'){const a=[{image:{url:u('x.png'),metadata:{altText:d.x.image.title}}}];p.text=d.x.tweets[0];
 if(d.x.tweets.length===1)p.assets=a;else p.metadata={twitter:{thread:d.x.tweets.map((t,i)=>i?{text:t}:{text:t,assets:a})}};}
console.log(JSON.stringify(p).replace(/("altText":"[^"]*?)\\n/g,"$1 "));
