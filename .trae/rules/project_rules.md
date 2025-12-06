# Trae Rules: User & Project

## Project Profile
- Stack: React 18 + TypeScript + Vite 6
- UI: Radix UI, Lucide Icons, Motion animations
- Routing: `react-router-dom`
- Content: Markdown via `react-markdown`, rehype/remark plugins
- Dev server: `http://localhost:3000` (Vite, auto-open)
- Build output: `dist/` (copied from `public/` + compiled assets)

## Key Commands
- Start dev: `npm run dev`
- Build: `npm run build`
- Deploy (GitHub Pages): `npm run deploy`
- Predeploy builds automatically via `predeploy`

References:
- Scripts defined in `package.json:65-70`
- Dev server port in `vite.config.ts:57-60`

## Source Layout
- App entry: `src/main.tsx`, `src/App.tsx`
- Pages: `src/pages/*`
- Components: `src/components/*` and `src/components/ui/*`
- Data: `src/data/posts/*`, `src/data/projects/*`
- Styles: `src/styles/globals.css`, `src/index.css`

## Import Conventions
- Use path alias `@` for `src` (configured in `vite.config.ts:18-36`).
- Keep version-pinned imports as used in UI components (e.g., `@radix-ui/react-checkbox@1.1.4`, `lucide-react@0.487.0`). Aliases map these to actual packages (`vite.config.ts:18-36`).
- Prefer named exports and tree-shaking-friendly imports.

## Component Guidelines
- Use functional components and hooks.
- Do not add comments to code unless explicitly requested.
- Reuse existing UI primitives in `src/components/ui/*`.
- Maintain accessibility (ARIA, keyboard nav) consistent with `src/README.md:338-356`.
- Keep animations minimal and responsive using `motion`.

## Styling Rules
- Reuse existing utility classes and CSS variables.
- Avoid introducing new CSS frameworks without prior rule updates.
- Prefer component-scoped classnames over global rules.

## Data & Content
- Author posts/projects in Markdown under `src/data/*`.
- Use code fences and headings consistent with existing content.
- Keep external links HTTPS and validated.

## Performance & Accessibility
- Follow Lighthouse targets: Perf 95+, A11y 100, SEO 100 (`src/README.md:314-332`).
- Use lazy loading, code splitting, and optimized images.
- Maintain semantic HTML and focus indicators.

## Security
- Do not embed secrets; never commit tokens/keys.
- Avoid inline scripts; prefer CSP-friendly patterns (`src/README.md:360-368`).

## Deployment Rules
- GitHub Pages: `npm run deploy` pushes `dist/` to `gh-pages`.
- Cloudflare Workers: static assets served with SPA fallback.
  - Config: `wrangler.jsonc` with `assets.directory: ./dist` and `main: src/worker.ts`.
  - Script: `npm run deploy:cf` builds and deploys via Wrangler.
  - Worker URL is generated on deploy.
  - Keep `CNAME` and assets in `dist/`.

## Verification Workflow
- Before finishing changes:
  - Run `npm run typecheck` (static types) and fix errors.
  - Run `npm run lint` (code quality) and fix errors.
  - Run `npm run build` and fix errors.
  - Perform local smoke test on `npm run dev` at `http://localhost:3000`.

## Project QA Commands
- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Lint (fix): `npm run lint:fix`
- Format: `npm run format`

## Assistant (User) Rules
- Prefer editing existing files over adding new ones.
- Avoid introducing new dependencies; reuse installed libraries.
- Follow import alias `@` and version-pinned import style.
- Provide precise code references like `file_path:line_number` when explaining.
- Do not commit changes unless explicitly requested.
- After implementing changes, run build and verify locally.
- Maintain security best practices and do not log secrets.
- Keep explanations clear and concise; avoid heavy formatting.

## Future Enhancements (non-blocking)
- Add `typecheck` and `lint` scripts in `package.json`.
- Replace the Jekyll GitHub Pages workflow with a Vite build/deploy action if desired.
- Introduce basic tests for critical components and pages.
