# Sivuseppä – nettisivujen myyntisivu

Finnish landing page for a web-design agency, built around the
`ResponsiveHeroBanner` component (`src/components/ui/responsive-hero-banner.tsx`).

Stack: Vite + React 18 + TypeScript + Tailwind CSS 4, shadcn project structure
(`components.json`, `@/` alias, `src/lib/utils.ts`, components in `src/components/ui`).

```bash
npm install
npm run dev     # http://localhost:5173
npm run build
```

The page uses the MIT-licensed NexaCore template by Mohammad Shehadeh
(`src/components/templates/nexacore/`, see its LICENSE and ATTRIBUTION.md),
translated to Finnish and extended with pricing, FAQ, contact and footer sections.
The earlier dark design built on `ResponsiveHeroBanner` is kept in `src/DarkApp.tsx`;
render it from `src/App.tsx` to switch back.

Sections: hero (video background, CSS-drawn browser and phone mockups of an example
client site), 30-second video, services bento grid, "Ei kahta samanlaista" scroll gallery
of eight example site designs, portfolio of three example concepts (each button
pre-fills the demo order), why us, process, pricing with "every package includes",
FAQ, "describe your site" chat box (`RuixenMoonChat`), demo order form, contact
form, footer. The example sites are drawn with CSS in
`src/components/templates/nexacore/site-mockups.tsx`, so they need no images.
The contact form only shows a thank-you message; connect `handleSubmit` in
`src/components/templates/nexacore/contact.tsx` to a backend or form service before going live.
Brand name, clients, prices and contact details are placeholders.

Why `components/ui`: the shadcn CLI installs every component into the folder set by
`aliases.ui` in `components.json`. Keeping hand-added components there means future
`npx shadcn add ...` components land next to them and share the same import paths.

## Automatic demo service

`api/` holds two Vercel functions: `demo-request.ts` validates the "Ilmainen demosivusto"
form, rate-limits it, answers immediately and then (via `waitUntil`) asks Claude to build a
one-page demo, stores it in private Vercel Blob storage and emails the link with Resend.
`demo.ts` serves `/demo/<id>` under a sandboxed, script-free Content-Security-Policy.
When the page is opened as a claude.ai artifact, the form instead builds the demo in the page
with the artifact `sample` capability (same prompt, `src/lib/demo-prompt.ts`) and shows it in a
sandboxed frame. Setup steps (in Finnish): `KAYTTOONOTTO.md`. Environment variables: `.env.example`.

### Design knowledge used by the demos

Every demo is designed with the same UI UX Pro Max data and workflow as this repo's skill.
`npm run build:design-data` exports products (with their reasoning profiles), active styles,
palettes, font pairings, landing patterns and web UX rules from `src/ui-ux-pro-max/data` into
`src/lib/design-data.ts`; `src/lib/design-search.ts` is a small BM25 search over it, offered to
Claude as the `search_design_database` tool (server tool loop, and the artifact `sample` tools in
preview), together with the skill's condensed workflow and pre-delivery checklist. Re-run the
export after the CSV data changes.

### Home-page video

The 30-second motion graphic under the hero is rendered from `motion/scene.html` with
`npm run render:motion` (see `motion/README.md`). Output lives in `public/media/`.

### Example-site gallery

The "Ei kahta samanlaista" section (`src/components/templates/nexacore/stack-gallery.tsx`) uses
`StackSpread` (`src/components/ui/stack-spread.tsx`, from Hyperiux Vault, built on `motion`): a pile
of cards that scatters as you scroll, with pointer parallax on desktop and a two-column layout on
touch screens. Additions to the original: title, subtitle, scroll-hint text, card shadow, section
`id` and `cardAspect`, which keeps every card at one shape (square here) so images are never
cropped. `src/demo-stack-spread.tsx` shows the component with its original sample images.

The eight cards are example website designs drawn in `art/stack-cards.html` and rendered to
`public/media/stack/*.jpg` with `npm run render:stack`. To use photos instead, change the `src`
values in `stack-gallery.tsx` (square images work best).
