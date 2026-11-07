// HTML templates for every design. Tokens follow the ig-brand-identity skill.
import { visual, deco } from './visuals.mjs';
// Palette taken from the profile photo: cream backdrop, wine scarf, gold ring.
export const T = {
  cream: '#F8F3EC', sand: '#EFE5D7', ink: '#2B1D22', wine: '#8A1E38', wineDeep: '#5E1427', gold: '#C9A66B', muted: '#8E8287',
};

const THEMES = {
  light: { bg: T.cream, fg: T.ink, muted: T.muted, line: '#E4D5BC', accent: T.wine, pill: T.wine },
  sand: { bg: T.sand, fg: T.ink, muted: '#82757B', line: '#D8C3A0', accent: T.wine, pill: T.wine },
  dark: { bg: T.wineDeep, fg: T.cream, muted: '#D9C3B5', line: '#8A4A57', accent: T.gold, pill: T.gold },
};

export const themeFor = (pillar) => (pillar === 'update' ? 'dark' : pillar === 'case' ? 'sand' : 'light');

const ar = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const br = (s) => esc(s).replace(/\n/g, '<br>');

const ICONS = {
  instagram: (c) => `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="0.6" fill="${c}"/></svg>`,
  linkedin: (c) => `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 10.5v6M8 7.6v.1M11.5 16.5v-6M11.5 13c0-1.6 1-2.6 2.4-2.6s2.1.9 2.1 2.6v3.5" stroke-linecap="round"/></svg>`,
  x: (c) => `<svg viewBox="0 0 24 24" fill="${c}"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
};

function footer(h, th, size) {
  const at = (k) => (k === 'linkedin' || h[k].startsWith('@') ? h[k] : '@' + h[k]);
  const item = (k) => `<span class="fi">${ICONS[k](th.muted)}<span>${esc(at(k))}</span></span>`;
  return `<div class="footer" style="font-size:${size}px"><div class="rule"></div><div class="row">${item('instagram')}${item('linkedin')}${item('x')}</div></div>`;
}

function page({ w, h, theme, body, handles, footerSize = 22, pad = 96 }) {
  const th = THEMES[theme];
  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;700&display=block" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--accent:${th.accent}}
html,body{width:${w}px;height:${h}px;overflow:hidden}
body{background:${th.bg};color:${th.fg};font-family:'IBM Plex Sans Arabic',sans-serif;position:relative;padding:${pad}px;-webkit-font-smoothing:antialiased}
.top{display:flex;justify-content:space-between;align-items:center}
.pill{border:2px solid ${th.pill};color:${th.pill};border-radius:999px;padding:8px 26px;font-weight:500;font-size:${Math.round(footerSize * 1.2)}px}
.count{color:${th.muted};font-size:${footerSize}px;direction:ltr;letter-spacing:2px}
.accent{color:${th.accent}}
.bar{width:88px;height:8px;border-radius:4px;background:${th.accent}}
.muted{color:${th.muted}}
.footer{position:absolute;left:${pad}px;right:${pad}px;bottom:${Math.round(pad * 0.6)}px;color:${th.muted}}
.rule{height:1.5px;background:${th.line};margin-bottom:${Math.round(footerSize * 0.9)}px}
.row{display:flex;justify-content:center;gap:${footerSize * 2}px;direction:ltr}
.fi{display:flex;align-items:center;gap:${Math.round(footerSize * 0.4)}px;font-weight:500}
.fi svg{width:${Math.round(footerSize * 1.15)}px;height:${Math.round(footerSize * 1.15)}px}
</style></head><body>${body}${footer(handles, th, footerSize)}</body></html>`;
}

// step tracker at the bottom of inner slides: one segment per slide, current one in the accent color
function steps(day, cur, n) {
  const th = THEMES[themeFor(day.pillar)]; const dark = th === THEMES.dark;
  const card = dark ? 'rgba(255,255,255,.07)' : '#FFFFFF'; const line = dark ? 'rgba(255,255,255,.14)' : th.line;
  const segs = Array.from({ length: n }, (_, k) => `<div style="flex:1;height:12px;border-radius:6px;background:${k + 1 === cur ? th.accent : k + 1 < cur ? th.accent + '66' : line}"></div>`).join('');
  const names = day.ig.slides.map((x, k) => `<span style="flex:1;font-size:22px;color:${k + 1 === cur ? th.fg : th.muted};font-weight:${k + 1 === cur ? 700 : 400};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(x.t.replace(/\n/g, ' ').replace(/["“”]/g, ''))}</span>`).join('');
  return `<div style="position:absolute;left:96px;right:96px;bottom:190px;background:${card};border:2px solid ${line};border-radius:28px;padding:26px 30px">
<div style="display:flex;justify-content:space-between;margin-bottom:16px"><span style="font-size:24px;font-weight:700;color:${th.accent}">${esc(day.ig.cover.label)}</span><span style="font-size:22px;color:${th.muted}">${ar(cur)} من ${ar(n)}</span></div>
<div style="display:flex;gap:10px;margin-bottom:14px">${segs}</div><div style="display:flex;gap:10px">${names}</div></div>`;
}

// Instagram 1080x1350 -------------------------------------------------------
export function igCover(day, total, handles) {
  const c = day.ig.cover; const th = THEMES[themeFor(day.pillar)];
  return page({ w: 1080, h: 1350, theme: themeFor(day.pillar), handles, body: `
<div class="top"><span class="pill">${esc(c.label)}</span><span class="count">اسحب ← &nbsp; 01 / ${String(total).padStart(2, '0')}</span></div>
<div style="position:absolute;top:220px;left:96px;right:96px">
  <div style="font-size:80px;font-weight:700;line-height:1.28">${br(c.title)}</div>
  <div class="bar" style="margin:36px 0 28px"></div>
  <div class="muted" style="font-size:34px;line-height:1.5">${esc(c.sub)}</div>
</div>
<div style="position:absolute;top:650px;left:0;right:0;display:flex;justify-content:center">${visual(day, th, th === THEMES.dark, 1.05)}</div>` });
}

export function igSlide(day, s, i, total, handles) {
  return page({ w: 1080, h: 1350, theme: themeFor(day.pillar), handles, body: `${deco(THEMES[themeFor(day.pillar)])}
<div class="top" style="position:relative"><span class="pill">${esc(day.ig.cover.label)}</span><span class="count">${String(i).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span></div>
<div style="position:absolute;top:300px;left:96px;right:96px">
  <div class="accent" style="font-size:120px;font-weight:700;line-height:1;direction:ltr;text-align:right">${String(i - 1).padStart(2, '0')}</div>
  <div style="font-size:64px;font-weight:700;line-height:1.35;margin:48px 0 36px">${br(s.t)}</div>
  <div style="font-size:40px;line-height:1.75;opacity:.88">${br(s.b)}</div>
</div>
${steps(day, i - 1, total - 2)}` });
}

export function igCta(day, total, handles) {
  return page({ w: 1080, h: 1350, theme: themeFor(day.pillar), handles, body: `${deco(THEMES[themeFor(day.pillar)])}
<div class="top" style="position:relative"><span class="pill">${esc(day.ig.cover.label)}</span><span class="count">${String(total).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span></div>
<div style="position:absolute;top:0;bottom:0;left:96px;right:96px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center">
  <svg viewBox="0 0 24 24" width="96" height="96" fill="none" style="stroke:var(--accent)" stroke-width="1.8" stroke-linejoin="round"><path d="M6 3h12v18l-6-4.5L6 21z"/></svg>
  <div style="font-size:66px;font-weight:700;line-height:1.4;margin-top:48px">${br(day.ig.cta)}</div>
  <div class="muted" style="font-size:32px;margin-top:32px">احفظ · شارك · علّق</div>
</div>` });
}

// LinkedIn 1200x1200 --------------------------------------------------------
export function liImage(day, handles) {
  const m = day.li.image; const th = THEMES[themeFor(day.pillar)];
  return page({ w: 1200, h: 1200, theme: themeFor(day.pillar), handles, footerSize: 24, pad: 104, body: `
<div class="top"><span class="pill">${esc(m.label)}</span></div>
<div style="position:absolute;top:200px;left:104px;right:104px">
  <div style="font-size:74px;font-weight:700;line-height:1.3">${br(m.title)}</div>
  <div class="bar" style="margin:32px 0 24px"></div>
  <div class="muted" style="font-size:36px;line-height:1.5">${esc(m.sub)}</div>
</div>
<div style="position:absolute;top:590px;left:0;right:0;display:flex;justify-content:center">${visual(day, th, th === THEMES.dark, 0.92)}</div>` });
}

// X 1600x900 ----------------------------------------------------------------
export function xImage(day, handles) {
  const lines = day.x.image.title.split('\n');
  const last = lines.pop(); const th = THEMES[themeFor(day.pillar)];
  return page({ w: 1600, h: 900, theme: themeFor(day.pillar), handles, footerSize: 24, pad: 110, body: `
<div style="position:absolute;top:0;bottom:120px;right:110px;width:720px;display:flex;flex-direction:column;justify-content:center">
  <div style="font-size:84px;font-weight:700;line-height:1.35">${lines.map(esc).join('<br>')}${lines.length ? '<br>' : ''}<span class="accent">${esc(last)}</span></div>
  <div class="bar" style="margin-top:40px"></div>
</div>
<div style="position:absolute;top:0;bottom:120px;left:90px;width:680px;display:flex;align-items:center;justify-content:center">${visual(day, th, th === THEMES.dark, 0.92)}</div>` });
}

// Brand assets --------------------------------------------------------------
export function highlight(word, handles) {
  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@700&display=block" rel="stylesheet">
<style>*{margin:0}body{width:1080px;height:1080px;background:${T.cream};display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'IBM Plex Sans Arabic';color:${T.ink}}</style></head>
<body><div style="width:860px;height:860px;border-radius:50%;border:6px solid ${T.gold};display:flex;align-items:center;justify-content:center"><div style="font-size:150px;font-weight:700;color:${T.wine}">${esc(word)}</div></div></body></html>`;
}

export function brandBoard(handles) {
  const sw = (n, c, txt) => `<div style="flex:1"><div style="height:180px;border-radius:24px;background:${c};border:1.5px solid #E2D9CD"></div><div style="margin-top:18px;font-size:28px;font-weight:700">${n}</div><div style="direction:ltr;text-align:right;color:${T.muted};font-size:24px">${c}</div><div style="color:${T.muted};font-size:22px;margin-top:4px">${txt}</div></div>`;
  return page({ w: 1600, h: 1100, theme: 'light', handles, pad: 100, body: `
<div style="font-size:30px" class="muted">هوية الحساب</div>
<div style="font-size:84px;font-weight:700;margin:10px 0 50px">إعلانات تبيع، <span class="accent">مو بس تنشاف</span></div>
<div style="display:flex;gap:36px">${sw('كريمي', T.cream, 'الخلفية الأساسية')}${sw('رملي', T.sand, 'الأمثلة العملية')}${sw('عنابي', T.wine, 'لمسة وحدة بكل تصميم')}${sw('عنابي غامق', T.wineDeep, 'خلفية التحديثات')}${sw('ذهبي', T.gold, 'الخطوط واللمسة على الداكن')}</div>
<div style="display:flex;gap:80px;margin-top:64px;align-items:flex-end">
  <div><div class="muted" style="font-size:24px">الخط: IBM Plex Sans Arabic</div><div style="font-size:72px;font-weight:700">عنوان واضح</div><div style="font-size:36px">نص مريح للقراءة بدون زحمة</div></div>
  <div class="muted" style="font-size:26px;line-height:1.8">٣ عناصر بحد أقصى · مساحة فاضية كثير<br>لمسة عنابي (أو ذهبي على الداكن) بكل تصميم · اليوزرات أسفل التصميم</div>
</div>` });
}
