---
name: content-autopilot
description: The daily never-stop loop for Raneem's accounts - write new Saudi-dialect content when the plan runs low, render the designs, and fill every free Buffer slot on Instagram, LinkedIn and X. Use when the daily routine fires or when asked to run/refresh the content autopilot.
---

# Content autopilot (write → design → schedule)

Goal: every platform posts **every day, forever**. Buffer free plan holds 10 scheduled posts per channel, so each day one slot per channel frees up and this loop refills it. When fewer than 10 planned days are left unscheduled, it writes 10 new days first.

Repo: `raneemali94/raneemRepo`, branch `claude/laughing-fermat-4r1rtb`. Buffer org "My organization" `6acaca87a23ecf0487e59713`.

## 0. Setup
```bash
git fetch origin claude/laughing-fermat-4r1rtb && git checkout claude/laughing-fermat-4r1rtb && git pull --ff-only origin claude/laughing-fermat-4r1rtb
[ -d scripts/node_modules ] || (cd scripts && npm install --no-audit --no-fund)
```

## 1. Read the queue
- `list_channels` → ids must match `state/scheduled.json.channels`. A channel that is disconnected/locked: skip it and tell the user to reconnect it in Buffer.
- `list_posts` status `scheduled`,`sending` (first: 100) → count per channel.
- Also `list_posts` status `error`: if any, report them to the user (one line each) — don't silently retry.
- `node scripts/queue-status.mjs '{"instagram":N,"linkedin":N,"twitter":N}'` → tells you `writeNewDays`, `nextDayId`, `nextDate`, and per channel which day ids to schedule and their exact `dueAt`.

## 2. Write new days (only if `writeNewDays > 0`)
Follow the `saudi-ads-content` skill exactly (voice, platform formats, pillars, seasonal calendar).
1. Read every `topic` already in `content/plan.json` and `content/past-topics.md` (posts that went out before this plan) — never repeat a topic or a hook; if you revisit one, bring a new angle or a real update.
2. Research fresh material: run 2–4 `WebSearch` queries for updates from the last ~30 days (Meta ads, Google Ads, TikTok ads, Snapchat ads Saudi, X/LinkedIn ads, Saudi digital-ads market/regulation). Only use facts you can attribute; otherwise phrase as opinion/experience. No invented stats or client names.
3. Append `writeNewDays` days to `plan.json` with ids from `nextDayId` and consecutive dates from `nextDate`, same shape as existing days (`ig.cover/slides/cta/caption/hashtags`, `li.image/text/hashtags`, `x.image/tweets`). Mix: ~3 update, 3 issue, 2 tip, 1 case, 1 personal/offer per 10 days. Check each tweet ≤ 270 characters.
4. Render only the new days: `node scripts/render.mjs <id> <id> ...`. Open 2 of the new PNGs with Read to check Arabic, layout and footer.
5. Rebuild the readable calendar: `node scripts/build-calendar.mjs`.
6. Commit (`Add days X-Y to the content plan`) and push. Set `state/scheduled.json.image_ref` to the pushed commit SHA (images are served from `https://raw.githubusercontent.com/raneemali94/raneemRepo/<image_ref>/designs/...`). Confirm one URL returns 200 with curl before scheduling.
7. Re-run `queue-status.mjs` (the plan changed).

## 3. Schedule
For each channel and each `{day, dueAt}` the script returned, create the post exactly as the `buffer-queue-filler` skill describes (IG carousel with `metadata.instagram = {type:"post", shouldShareToFeed:true}`; LI text + `li.png`; X single tweet or `metadata.twitter.thread` with the image on the first item). Always `schedulingType:"automatic"`, `mode:"customScheduled"`, the given `dueAt`, every image with `altText`.
If Buffer answers "Limit reached", stop that channel — not an error.

## 4. Save state
Write each new post id to `state/scheduled.json.done[day][channel]` and the latest `dueAt` per channel to `state/scheduled.json.lastDue[channel]`. Commit (`Schedule day(s) …`) and push. Never leave scheduled posts unrecorded — that causes duplicates.

## 5. Report
One or two short Arabic lines: what was written (topics) and what was scheduled (day → platform → date). If nothing was free and nothing written, say nothing.
