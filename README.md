# carlytesnor.com

Portfolio for Carly Tesnor. Next.js App Router, React 19, TypeScript, CSS
Modules. No UI framework, no CSS framework, no animation library.

## Running it

```bash
npm install && npm run dev
```

Then `npm run build` for production, `npm run lint` and `npm run typecheck`
before pushing.

Set `NEXT_PUBLIC_SITE_URL` in the deploy environment. It only affects absolute
URLs — canonical tags, Open Graph, `sitemap.xml` — but those are wrong without
it.

## The design

The direction is called **SIGNAL**: the old print-shop misregistration,
translated to a display. RGB channels split and converge into register, the
halftone became scanlines and a grid floor, and the registration crosshair
became a targeting reticle. Night ops (dark) is the default; day ops inverts
the console. Nothing is rounded, everything glows only on interaction.

Everything themeable is a custom property in `app/globals.css`, declared three
times: once for night ops (the default), once under
`prefers-color-scheme: light`, and once under `:root[data-theme]` so the
toggle wins in both directions. Components never reference a colour directly.

- `--ground` / `--ground-2` grounds, `--fg` / `--fg-2` text, `--line` hairlines
- `--mag` hot magenta and `--cyn` electric cyan share every emphasis;
  `--glow-*` variants power the interaction blooms
- Type: Archivo does display and body duty (body at light weight,
  `font-stretch: 125%` for titles), JetBrains Mono for anything a machine
  produced, both self-hosted by `next/font`

## Layout

```
app/                 routes — home, work, work/[slug], writing, writing/[slug], about
components/          nav, footer, panel, reticle, telemetry, boot, scroll-reveal,
                     command palette, social, page-header, code
content/             the actual content: site, projects, timeline, writing, articles/
lib/                 theme toggle, palette event, media-query hook
public/img/          project screenshots
public/resume.pdf    the résumé, served at /resume.pdf
```

### Content

`content/projects.ts` is the source of truth for the work. Each project carries
a `panel: { cols, rows }` — its span on the six-column, 104px-row grid. **These
are authored, not generated**: the size says how much there is to say about a
project, and because it is data rather than a random number the grid never
shifts between renders.

Writing is a metadata row in `content/writing.ts` plus a component in
`content/articles/`. That is deliberately low-tech for one article — when there
are five or six, move it to MDX.

### The reticle

`components/reticle.tsx`. A targeting ring with slowly rotating ticks that
follows the pointer, corner-locks onto anything carrying a `data-cursor`
attribute, and names the target in brackets (the brackets are added by CSS, so
attribute values stay bare words).

To give an element a cursor label, add the attribute:

```tsx
<Link href="/work/reperem" data-cursor="Case study">
```

It mounts only for `pointer: fine`, so touch keeps the system cursor, and
`cursor: none` is applied by JS — without JS the normal cursor stays.

### Boot, reveal, telemetry

- `components/boot.tsx` types two console lines on the home hero, then stamps
  `booted` on `<body>` so the name's channel-split converges. It runs once per
  session (`sessionStorage`), and every other title animates without it —
  the hero is the only boot-gated element.
- `components/scroll-reveal.tsx` gives `.rise` elements one quiet lift as they
  enter the viewport, re-scanning after client-side navigation. Hidden states
  exist only under `html.js` — without JS everything is simply visible.
- `components/telemetry.tsx` is the fixed console strip: local time, scroll
  depth, pointer coordinates, ops mode. Values are written to the DOM directly;
  the ops-mode label is a CSS decision, correct before JS runs.

## Deliberate choices

- **No CSS framework.** The old build shipped 152 KB of Bootstrap for a grid and
  four utilities. This is grid, flexbox and hairlines.
- **No animation library.** Every move is CSS, all honouring
  `prefers-reduced-motion`.
- **Own command palette** rather than a dependency, so it matches the design and
  can search projects by stack.
- **Contact is a `mailto:`**, not a form. One less thing to break, and it puts
  the address in the visitor's own client.
- **The theme is never React state.** It lives on `data-theme`, an inline script
  in `<head>` applies the remembered value before first paint, and which label
  the toggle shows is a CSS decision — so there is no flash and no hydration
  mismatch.
- **Numbering is telemetry, not a ceiling.** Panels read `01//14`, case studies
  `01//14`, articles `TX-001` — coordinates in a transmission, not a count of
  how much work exists.
