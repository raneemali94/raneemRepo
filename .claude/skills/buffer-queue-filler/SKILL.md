---
name: buffer-queue-filler
description: How to create Buffer posts for a plan day on Instagram, LinkedIn and X (payload shapes, image URLs, limits). Used by the content-autopilot skill; use directly when asked to schedule specific days.
---

# Filling the Buffer queue

Buffer free plan: **3 channels, max 10 scheduled posts per channel**. Each channel holds 10 days ahead; every day one post per channel goes out and frees one slot, so the daily routine adds the next day for each channel.

## Steps
1. `get_account` → org "My organization" (`6acaca87a23ecf0487e59713`). Note `currentTime` and the scheduled-post limit.
2. `list_channels`. Map service → channel id (instagram, linkedin, twitter). If none are connected, stop and tell the user to connect them in Buffer; do nothing else.
3. Handles: if `brand/handles.json` still differs from the connected channel names (`name`/`displayName`), update it, run `node scripts/render.mjs`, commit and push to the working branch so image URLs serve the new designs.
4. `list_posts` with status `scheduled`,`sending` → count per channel. `free[channel] = 10 - count[channel]`.
5. Read `state/scheduled.json` (`{"done": {"<dayId>": {"instagram": postId, ...}}}`). Also check `list_posts` (scheduled + sent) text so nothing is posted twice.
6. Which days and which `dueAt`: run `node scripts/queue-status.mjs '<counts json>'` and use its output as-is (it handles the per-channel limit, past dates and ordering; times are LinkedIn 09:15, X 13:30, Instagram 20:45, +03:00).
   - Instagram: `metadata.instagram = {type: "post", shouldShareToFeed: true}`, assets = the day's `ig-*.png` in order (carousel), text = caption + hashtags.
   - LinkedIn: text = `li.text`, asset `li.png`.
   - X: single tweet → text + asset `x.png`; thread → `metadata.twitter.thread` with the image on the first item, outer text = first item.
   - Image URL: `https://raw.githubusercontent.com/raneemali94/raneemRepo/<ref>/designs/day-XX/<file>.png`, where `<ref>` is `image_ref` in `state/scheduled.json` (a pushed commit SHA, so images never change after scheduling; set it to the new SHA whenever you re-render and push). Each image needs `altText`.
   - `schedulingType: "automatic"`, `mode: "customScheduled"`, `dueAt` with `+03:00`.
7. Record each created post id in `state/scheduled.json.done` and the latest dueAt in `lastDue[channel]`, commit, push.
8. Running out of days is handled by the `content-autopilot` skill (it writes new days before scheduling).
