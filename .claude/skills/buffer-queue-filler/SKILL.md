---
name: buffer-queue-filler
description: Fill free slots in the Buffer queue with the next unscheduled days from content/plan.json (Instagram, LinkedIn, X). Use when asked to schedule the content plan, or when the daily refill routine fires.
---

# Filling the Buffer queue

Buffer free plan: **3 channels, max 10 scheduled posts at once**. One day = 3 posts (IG + LI + X), so at most 3 days fit. A daily routine tops the queue up as posts go out.

## Steps
1. `get_account` → org "My organization" (`6acaca87a23ecf0487e59713`). Note `currentTime` and the scheduled-post limit.
2. `list_channels`. Map service → channel id (instagram, linkedin, twitter). If none are connected, stop and tell the user to connect them in Buffer; do nothing else.
3. Handles: if `brand/handles.json` still differs from the connected channel names (`name`/`displayName`), update it, run `node scripts/render.mjs`, commit and push to the working branch so image URLs serve the new designs.
4. `list_posts` with status `scheduled`,`sending` → count. `free = limit - count`.
5. Read `state/scheduled.json` (`{"done": {"<dayId>": {"instagram": postId, ...}}}`). Also check `list_posts` (scheduled + sent) text so nothing is posted twice.
6. Take days in order whose posts aren't done; schedule while `free > 0`. Times (Asia/Riyadh, +03:00) on the day's date — LinkedIn 09:15, X 13:30, Instagram 20:45. If that time has passed, use the next free date after the last scheduled day, keeping the order.
   - Instagram: `metadata.instagram = {type: "post", shouldShareToFeed: true}`, assets = the day's `ig-*.png` in order (carousel), text = caption + hashtags.
   - LinkedIn: text = `li.text`, asset `li.png`.
   - X: single tweet → text + asset `x.png`; thread → `metadata.twitter.thread` with the image on the first item, outer text = first item.
   - Image URL: `https://raw.githubusercontent.com/raneemali94/raneemRepo/<ref>/designs/day-XX/<file>.png`, where `<ref>` is `image_ref` in `state/scheduled.json` (a pushed commit SHA, so images never change after scheduling; set it to the new SHA whenever you re-render and push). Each image needs `altText`.
   - Only schedule whole days (3 free slots); a leftover slot waits for the next run.
   - `schedulingType: "automatic"`, `mode: "customScheduled"`, `dueAt` with `+03:00`.
7. Record each created post id in `state/scheduled.json`, commit, push.
8. When all 20 days are done, report it and suggest writing the next batch with the `saudi-ads-content` skill.
