// Content-matched illustrations for the designs (UI-style mini mockups, brand colors only).
// Each widget is drawn on a 720x400 base box and scaled with CSS zoom by the template.
// A day picks one with `visual: {type, ...}` in plan.json; without it, pickVisual() guesses from the topic.

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const ico = {
  spark: (c) => `<svg viewBox="0 0 24 24" width="28" height="28" fill="${c}"><path d="M12 2l2.2 6.3L20.5 10l-6.3 2.2L12 18.5l-2.2-6.3L3.5 10l6.3-1.7z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z"/></svg>`,
  search: (c) => `<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>`,
  check: (c) => `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`,
  x: (c) => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
  play: (c) => `<svg viewBox="0 0 24 24" width="40" height="40" fill="${c}"><path d="M8 5.5v13l11-6.5z"/></svg>`,
};

// card colors per theme
function C(th, dark) {
  return dark
    ? { card: 'rgba(255,255,255,.07)', cardLine: 'rgba(255,255,255,.14)', soft: 'rgba(255,255,255,.12)', ink: th.fg, muted: th.muted, accent: th.accent, onAccent: '#3A0F1B' }
    : { card: '#FFFFFF', cardLine: th.line, soft: th.line, ink: th.fg, muted: th.muted, accent: th.accent, onAccent: '#FFFFFF' };
}

const box = (c, inner, extra = '') => `<div style="background:${c.card};border:2px solid ${c.cardLine};border-radius:28px;${extra}">${inner}</div>`;
const bar = (c, w, color, h = 14) => `<div style="height:${h}px;width:${w}%;border-radius:${h}px;background:${color || c.soft}"></div>`;

const W = {
  // search bar + AI suggestions
  search: (c, v) => `
<div style="display:flex;flex-direction:column;gap:22px">
  ${box(c, `<div style="display:flex;align-items:center;gap:18px;padding:22px 30px">${ico.search(c.muted)}<div style="font-size:32px;color:${c.ink};flex:1">${esc(v.query || 'عبارة بحث')}</div><div style="display:flex;align-items:center;gap:8px;background:${c.accent};color:${c.onAccent};border-radius:999px;padding:6px 18px;font-size:22px;font-weight:700;direction:ltr">${ico.spark(c.onAccent)}${esc(v.chip || 'AI')}</div></div>`, 'border-radius:999px')}
  ${box(c, (v.items || ['اقتراح ١', 'اقتراح ٢', 'اقتراح ٣']).map((t, i) => `<div style="display:flex;align-items:center;gap:16px;padding:16px 30px;${i ? `border-top:2px solid ${c.cardLine}` : ''}"><span style="width:14px;height:14px;border-radius:50%;background:${i === 0 ? c.accent : c.soft}"></span><span style="font-size:27px;color:${i === 2 ? c.muted : c.ink}">${esc(t)}</span>${i === 2 ? `<span style="margin-inline-start:auto">${ico.x(c.muted)}</span>` : ''}</div>`).join(''), 'padding:8px 0')}
</div>`,

  // lead form card
  form: (c, v) => box(c, `
<div style="font-size:30px;font-weight:700;color:${c.ink};margin-bottom:22px">${esc(v.title || 'سجّل بياناتك')}</div>
${(v.fields || ['الاسم', 'رقم الجوال', 'متى تبي تبدأ؟']).map((f, i) => `<div style="border:2px solid ${i === 2 ? c.accent : c.cardLine};border-radius:16px;padding:14px 22px;margin-bottom:14px;font-size:25px;color:${i === 2 ? c.ink : c.muted};display:flex;justify-content:space-between"><span>${esc(f)}</span>${i === 2 ? `<span style="color:${c.accent};font-weight:700">جديد</span>` : ''}</div>`).join('')}
<div style="background:${c.accent};color:${c.onAccent};border-radius:16px;padding:14px;text-align:center;font-size:27px;font-weight:700;margin-top:6px">${esc(v.button || 'إرسال')}</div>`, 'padding:30px 34px;width:560px;margin:0 auto'),

  // A vs B test cards
  ab: (c, v) => {
    const card = (k, win, rows) => box(c, `
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px"><span style="font-size:44px;font-weight:700;color:${win ? c.accent : c.muted};direction:ltr">${k}</span>${win ? `<span style="width:46px;height:46px;border-radius:50%;background:${c.accent};display:flex;align-items:center;justify-content:center">${ico.check(c.onAccent)}</span>` : ''}</div>
<div style="height:120px;border-radius:18px;background:${win ? c.accent : c.soft};opacity:${win ? 0.9 : 1};margin-bottom:22px"></div>
${rows.map((w) => `<div style="margin-bottom:12px">${bar(c, w, win ? c.accent : null, 12)}</div>`).join('')}
<div style="font-size:24px;color:${c.muted};margin-top:14px">${esc(win ? v.win || 'الفائز' : v.lose || 'التحكم')}</div>`, `padding:26px 30px;flex:1;${win ? `border-color:${c.accent}` : ''}`);
    return `<div style="display:flex;gap:28px;direction:ltr">${card('A', false, [70, 45])}${card('B', true, [92, 64])}</div>`;
  },

  // phone mockup with generated variants
  phone: (c, v) => `
<div style="display:flex;gap:34px;align-items:center;justify-content:center;direction:ltr">
  <div style="width:220px;height:400px;border-radius:40px;border:3px solid ${c.ink};padding:16px;background:${c.card};position:relative">
    <div style="height:100%;border-radius:26px;background:${c.accent};display:flex;align-items:center;justify-content:center">${ico.play(c.onAccent)}</div>
    <div style="position:absolute;top:-22px;right:-26px;background:${c.bgSolid};border:2px solid ${c.accent};border-radius:999px;padding:8px 16px;display:flex;gap:6px;align-items:center;font-size:22px;font-weight:700;color:${c.accent}">${ico.spark(c.accent)}${esc(v.chip || 'AI')}</div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(2,140px);gap:18px">
    ${(v.labels || ['9:16', '1:1', '4:5', 'EN']).map((l, i) => `<div style="height:${i % 2 ? 120 : 160}px;border-radius:20px;background:${i === 0 ? c.soft : c.card};border:2px solid ${c.cardLine};display:flex;align-items:flex-end;padding:12px 14px;font-size:22px;color:${c.muted};font-weight:700">${esc(l)}</div>`).join('')}
  </div>
</div>`,

  // KPI tiles
  metrics: (c, v) => `
<div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;direction:ltr">
${(v.items || [['ROAS', '4.0'], ['MER', '2.0'], ['CAC', '?'], ['LTV', '?']]).map(([k, n], i) => box(c, `<div style="font-size:24px;color:${c.muted};font-weight:700;letter-spacing:1px">${esc(k)}</div><div style="font-size:64px;font-weight:700;color:${i === (v.hi ?? 1) ? c.accent : c.ink};line-height:1.2">${esc(n)}</div>${i === (v.hi ?? 1) ? `<div style="margin-top:6px">${bar(c, 55, c.accent, 10)}</div>` : `<div style="margin-top:6px">${bar(c, 80, null, 10)}</div>`}`, `padding:22px 28px;${i === (v.hi ?? 1) ? `border-color:${c.accent}` : ''}`)).join('')}
</div>`,

  // chat bubbles
  chat: (c, v) => box(c, `
${(v.msgs || [['in', 'السلام عليكم، كم السعر؟'], ['out', 'هلا! السعر ...'], ['in', 'طيب فيه توصيل؟']]).map(([d, t]) => `<div style="display:flex;justify-content:${d === 'in' ? 'flex-start' : 'flex-end'};margin-bottom:16px"><div style="max-width:78%;padding:14px 22px;border-radius:22px;font-size:27px;line-height:1.5;${d === 'in' ? `background:${c.soft};color:${c.ink}` : `background:${c.accent};color:${c.onAccent}`}">${esc(t)}</div></div>`).join('')}
<div style="display:flex;align-items:center;gap:10px;font-size:22px;color:${c.muted};margin-top:4px"><span style="width:12px;height:12px;border-radius:50%;background:${c.accent}"></span>${esc(v.status || 'آخر رد: قبل ساعتين')}</div>`, 'padding:28px 30px;width:600px;margin:0 auto'),

  // donut + legend
  donut: (c, v) => {
    const parts = v.parts || [['بحث', 45], ['يوتيوب', 25], ['عرض', 20], ['أخرى', 10]];
    const cols = [c.accent, c.ink, c.muted, c.soft];
    let acc = 0;
    const stops = parts.map(([, p], i) => { const s = `${cols[i]} ${acc}% ${acc + p}%`; acc += p; return s; }).join(',');
    return `<div style="display:flex;align-items:center;gap:56px;justify-content:center">
<div style="width:300px;height:300px;border-radius:50%;background:conic-gradient(${stops});display:flex;align-items:center;justify-content:center"><div style="width:170px;height:170px;border-radius:50%;background:${c.bgSolid};display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:700;color:${c.ink};direction:ltr">${esc(v.center || 'PMax')}</div></div>
<div style="display:flex;flex-direction:column;gap:20px">${parts.map(([n, p], i) => `<div style="display:flex;align-items:center;gap:16px;font-size:30px;color:${c.ink}"><span style="width:22px;height:22px;border-radius:6px;background:${cols[i]}"></span><span style="min-width:120px">${esc(n)}</span><span style="color:${c.muted};direction:ltr">${p}%</span></div>`).join('')}</div></div>`;
  },

  // line chart (up or flat/down)
  chart: (c, v) => {
    const pts = v.points || [20, 26, 24, 34, 40, 58, 85];
    const w = 640, h = 260, max = Math.max(...pts) * 1.1;
    const xy = pts.map((p, i) => [Math.round((i / (pts.length - 1)) * w), Math.round(h - (p / max) * h)]);
    const d = xy.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
    const [lx, ly] = xy[xy.length - 1];
    return box(c, `
<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:18px"><span style="font-size:26px;color:${c.muted};font-weight:700;direction:ltr">${esc(v.label || 'CPM')}</span><span style="font-size:40px;font-weight:700;color:${c.accent}">${esc(v.value || '↑')}</span></div>
<svg viewBox="-10 -20 ${w + 20} ${h + 40}" width="100%" height="${h}" style="direction:ltr;overflow:visible">
${[0.25, 0.5, 0.75].map((f) => `<line x1="0" x2="${w}" y1="${h * f}" y2="${h * f}" stroke="${c.cardLine}" stroke-width="2" stroke-dasharray="6 8"/>`).join('')}
<path d="${d} L${w} ${h} L0 ${h}Z" fill="${c.accent}" opacity=".12"/>
<path d="${d}" fill="none" stroke="${c.accent}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="${lx}" cy="${ly}" r="12" fill="${c.accent}"/>
</svg>
${v.marks ? `<div style="display:flex;justify-content:space-between;font-size:22px;color:${c.muted};margin-top:10px;direction:ltr">${v.marks.map((m) => `<span>${esc(m)}</span>`).join('')}</div>` : ''}`, 'padding:26px 34px');
  },

  // brief / checklist document
  doc: (c, v) => box(c, `
<div style="display:flex;align-items:center;gap:14px;margin-bottom:24px"><span style="width:52px;height:52px;border-radius:14px;background:${c.accent};display:flex;align-items:center;justify-content:center;color:${c.onAccent};font-size:26px;font-weight:700">${esc(v.badge || '✎')}</span><span style="font-size:32px;font-weight:700;color:${c.ink}">${esc(v.title || 'قائمة')}</span></div>
${(v.items || ['بند ١', 'بند ٢', 'بند ٣', 'بند ٤']).map((t, i) => `<div style="display:flex;align-items:center;gap:16px;padding:12px 0;${i ? `border-top:2px dashed ${c.cardLine}` : ''}"><span style="width:38px;height:38px;border-radius:10px;border:2.5px solid ${c.accent};display:flex;align-items:center;justify-content:center;flex:none">${i < (v.done ?? 99) ? ico.check(c.accent) : ''}</span><span style="font-size:27px;color:${c.ink}">${esc(t)}</span></div>`).join('')}`, 'padding:30px 36px;width:600px;margin:0 auto'),
};

export function pickVisual(day) {
  if (day.visual) return day.visual;
  const t = `${day.topic} ${day.pillar}`;
  if (/واتساب|محادث/.test(t)) return { type: 'chat' };
  if (/اختبار|A\/B/.test(t)) return { type: 'ab' };
  if (/Lead|ليد|نموذج/.test(t)) return { type: 'form' };
  if (/ROAS|CPA|CPM|MER|أرقام|مؤشر/.test(t)) return { type: 'metrics' };
  if (/قوقل|بحث|Search/.test(t)) return { type: 'search' };
  if (/ذكاء|AI|كرييتف|تيك توك|سناب/.test(t)) return { type: 'phone' };
  if (/PMax|Performance|قنوات/.test(t)) return { type: 'donut' };
  return { type: day.pillar === 'tip' || day.pillar === 'personal' ? 'doc' : 'chart', title: day.topic, items: day.ig.slides.map((s) => s.t.replace(/\n/g, ' ')) };
}

// th = theme tokens from templates; dark = theme is the dark one
export function visual(day, th, dark, zoom = 1) {
  const v = pickVisual(day);
  const c = { ...C(th, dark), bgSolid: th.bg };
  const f = W[v.type] || W.chart;
  return `<div style="width:720px;zoom:${zoom}">${f(c, v)}</div>`;
}

// tiny matching icon for inner slides
export function deco(th) {
  const dots = `radial-gradient(${th.line} 2.5px, transparent 2.6px)`;
  return `<div style="position:absolute;width:420px;height:420px;border-radius:50%;border:2px solid ${th.line};top:-170px;left:-150px;opacity:.9"></div>
<div style="position:absolute;width:250px;height:170px;top:150px;left:60px;background-image:${dots};background-size:28px 28px;opacity:.9"></div>`;
}
