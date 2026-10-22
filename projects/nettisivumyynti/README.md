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

Sections: hero, services, case studies, pricing, process, FAQ, contact form, footer.
The contact form only shows a thank-you message; connect `handleSubmit` in
`src/components/sections/contact.tsx` to a backend or form service before going live.
Brand name, clients, prices and contact details are placeholders.

Why `components/ui`: the shadcn CLI installs every component into the folder set by
`aliases.ui` in `components.json`. Keeping hand-added components there means future
`npx shadcn add ...` components land next to them and share the same import paths.
