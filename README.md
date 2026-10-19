# raneemRepo

## Executive profile — `portfolio/`

- **`portfolio/Raneem-Ali-Profile.pdf`**: the redesigned profile (A4 landscape, 15 pages, live links).
- `portfolio/index.html` + `styles.css`: the source. Open it in a browser to preview.
- `portfolio/DESIGN-SYSTEM.md`: grid, colour, type scale and page types.
- `portfolio/source/`: the original PDF, kept for reference.

Rebuild the PDF (requires Node + Playwright with Chromium):

```sh
cd portfolio && node build.mjs            # add --previews <dir> for PNG page previews
```
