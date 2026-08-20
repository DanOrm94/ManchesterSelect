# Manchester Select

Static charity marketing site for Manchester Select, built with Astro 7 and Tailwind CSS 4 for Cloudflare Pages.

## Local development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Cloudflare Pages

The repository is designed for Cloudflare Pages native Git integration: pushing to `main` should trigger the production build.

- Build command: `npm run build`
- Build output directory: `dist`
- Functions: `/functions`

`wrangler.toml` documents the Pages output directory. No manual deployment command is required.

## Contact form

`functions/api/contact.ts` handles `POST /api/contact`.

Set these as Cloudflare Pages encrypted environment variables/secrets:

- `TURNSTILE_SECRET_KEY` — Cloudflare Turnstile secret key
- `RESEND_API_KEY` — Resend API key
- `CONTACT_TO_EMAIL` — inbox that should receive enquiries
- `RESEND_FROM_EMAIL` — verified Resend sender, e.g. `Manchester Select <hello@your-domain.co.uk>`
- `PUBLIC_TURNSTILE_SITE_KEY` — Turnstile site key, available at build time

For production email, verify your sending domain in Resend and set `RESEND_FROM_EMAIL` to that verified address.

## Images

The redesign uses the real Manchester Select assets already present in the repository for the logo, event photography and supporting imagery. The current implementation references those assets from the public GitHub repository so the redesign does not introduce placeholder photography. For the final production setup, migrate the event images to Cloudflare Images or R2 and update the asset URLs without changing the page structure.

## Cookie preferences

The cookie banner is intentionally lightweight and stores essential/statistics/marketing preferences locally. No analytics or marketing script is enabled by default.

## Site structure

- `/` — charity homepage, story, impact, events, gallery, sponsorship and contact
- `/our-story` — founding story
- `/privacy-cookies-policy`
- `/fundraising-policy`
- `/volunteer-policy`
