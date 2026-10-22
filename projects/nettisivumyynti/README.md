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

Sections: hero (video), services, why us, process, pricing, FAQ, "describe your site" chat box (`RuixenMoonChat`, fills the contact form), contact form, footer.
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
