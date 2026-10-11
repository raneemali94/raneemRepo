---
name: saudi-ads-content
description: Write social content in Saudi dialect for a paid-ads / campaign-management specialist (Meta, Google, TikTok, Snapchat, X, LinkedIn ads). Use when drafting posts, captions, threads, or a content calendar for Instagram, LinkedIn or X, or when adding new days to content/plan.json.
---

# Saudi ads-specialist content

The voice is a real Saudi woman who runs ad campaigns for a living, writing her own posts. Content lives in `content/plan.json`; read it before adding days so topics don't repeat.

## Voice (sound human, not generated)
- Saudi dialect, everyday words: وش، ليش، الحين، كذا، مره، عشان، ترا، أبي، زي، صراحة، يعني، بس، خلاص، يا جماعة.
- First person, feminine: "جربت"، "لاحظت"، "أنا شخصيًا"، "مرّ علي عميل".
- Vary sentence length. Mix a short punchy line with a longer one. A small aside or opinion is fine.
- Max 2–3 emojis per post. No emoji at the start of every line.
- Never stack generic phrases ("في عالم التسويق الرقمي المتسارع…"). Start with the point.
- No invented statistics or client names. Examples are framed as "مثال" or "حالة تتكرر عندي". Platform updates must match what the platform announced; when unsure, say "أعلنت/بدأت تطرح" not exact numbers.

## Platform formats (each platform differs)
| | Instagram | LinkedIn | X |
|---|---|---|---|
| Format | Carousel 1080×1350 (cover + 3–5 slides + CTA) or single | Text-first post + square image 1200×1200 | Single tweet or thread (≤ 260 chars each) + 1600×900 image |
| Tone | Friendly, practical, "احفظيه/احفظه" | Calmer, professional Saudi white dialect, a lesson or opinion | Sharp, opinionated, conversational |
| Hook | Cover headline ≤ 7 words | First line ≤ 12 words, then a line break | First tweet must stand alone |
| Length | Caption 80–180 words | 120–250 words, short paragraphs | 1 tweet or 3–6 tweet thread |
| Hashtags | 5–8 at the end | 3 max | 0–1 |
| CTA | Save / share / comment a word | Question for discussion | Reply / repost |

## Content pillars
`update` platform updates · `issue` real problems & mistakes · `tip` how-to · `case` worked example · `personal` behind the scenes / trust · `offer` soft call to work together. Rotate so no pillar repeats more than twice in a row.

## Adding a day to plan.json
Copy the shape of an existing day (`id`, `pillar`, `topic`, `ig`, `li`, `x`). Then render with the `social-design-render` skill.
