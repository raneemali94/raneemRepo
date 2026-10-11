---
name: social-design-render
description: Render the post designs (Instagram carousels, LinkedIn squares, X banners, highlight covers, brand board) from content/plan.json to PNG with headless Chromium. Use after editing content or handles.
---

# Rendering designs

```bash
cd scripts && npm install --no-audit --no-fund   # once (playwright only, uses preinstalled Chromium)
node scripts/render.mjs            # all days + brand assets
node scripts/render.mjs 3 4        # only days 3 and 4
```

Output: `designs/day-XX/{ig-1..n.png, li.png, x.png}` and `designs/brand/*.png`.

- Templates live in `scripts/templates.mjs`; tokens come from the `ig-brand-identity` skill.
- Handles are read from `brand/handles.json` at render time. If you change handles, re-render everything and commit.
- Check a few PNGs visually (Read the image) before committing: Arabic should be right-to-left, nothing clipped, footer readable.
