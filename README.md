# vigil-web

Landing page for [Vigil](https://github.com/AdiN737/vigil) — a dot in the corner
of your screen that tells you the moment Claude Code needs you.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · Tailwind 4 · Motion 13 ·
IBM Plex Mono.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

For the production build:

```bash
npm run build && npm start
```

## Where things are

| Path | What |
|---|---|
| `app/page.tsx` | The whole page — six sections, in order |
| `app/components/Frame.tsx` | The section shell every block uses: rule, index, content |
| `app/lib/site.ts` | Download URL, version, size. **Change these on a new release.** |
| `app/globals.css` | The palette. The seven status colours are copied from `vigil_widget.py` |
| `public/shots/` | The two desk renders |

## Two rules worth keeping

**Colour means status.** The page is monochrome except for the seven tier
colours the app itself uses. If something new needs colour, it probably needs a
rule instead — the constraint is what stops this looking like every other
landing page.

**Every number is measured.** `500 events → 0 pop-ups`, `0.33 s per turn`,
`171 ms` and the pixel sizes in the renders all come from real measurements of
the shipped app. Don't add a number that hasn't been measured, and re-check the
existing ones against the source before changing them.

## Deploying

Connected to Vercel from the `main` branch — pushing deploys.

The download button points at the GitHub **release**, not a file in `public/`.
A new release only needs `VERSION` and `SIZE` updated in `app/lib/site.ts`;
`DOWNLOAD_URL` uses the `/releases/latest/download/` form and keeps working.
