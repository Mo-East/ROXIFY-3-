# Roxify independent hosting handover

## Current audit

Roxify is a self-contained React 19 + Vite single-page application. The production build is generated with `npm run build` into `dist/`, and it is suitable for Cloudflare Pages static hosting. The current dependency set is `react`, `react-dom`, `vite`, `@vitejs/plugin-react`, `framer-motion`, and `jspdf`. The lockfile is committed, so deployment should use `npm ci && npm run build`.

The site does not currently require a backend server, database, API route, OAuth provider, or runtime secret. The AI Concierge is local React state that builds `mailto:` links. The Mercury dashboard is explicitly a demo environment and does not move funds. The voice agent uses the browser Web Speech API. No `fetch`, Axios, database client, Manus API, WebDev runtime API, or server endpoint was found in the application source.

The only Manus-specific item found is the project metadata file `app.config.ts`, whose `logoUrl` points to a Manus-hosted favicon. It is not used by the Vite application at runtime. Before final production branding, replace that URL with a durable public HTTPS logo asset or remove the metadata file from the independent-hosting branch after confirming it is not needed.

## Files prepared for independent hosting

- `wrangler.toml` declares the Cloudflare Pages output directory as `dist/`.
- `public/_redirects` rewrites unknown page paths to `index.html` with status `200`, preserving the React SPA routes such as `/vault`, `/personal`, `/corporate`, `/partners`, and `/dashboard`.
- `.env.example` documents that no secrets are currently required.
- `.gitignore` excludes `.env` files and Wrangler state while retaining `.env.example`.

## Cloudflare Pages deployment

Create a Cloudflare Pages project named `roxify`, then use either the Git integration or Wrangler.

### Git integration

Use the repository containing this project and set:

- Build command: `npm ci && npm run build`
- Build output directory: `dist`
- Node version: `22` or the current project-supported LTS version
- Root directory: repository root

### Wrangler

After authenticating Wrangler with the owner’s Cloudflare account, run:

```bash
npm ci
npm run build
npx wrangler pages project create roxify
npx wrangler pages deploy dist --project-name roxify
```

Do not put Cloudflare API tokens in this repository. Use `wrangler login` interactively or a protected CI secret such as `CLOUDFLARE_API_TOKEN` with the minimum Pages deployment permissions.

## DNS and domain cutover

Cloudflare’s current Pages documentation requires the custom domain to be added in the Pages project before DNS is changed. For the apex domain `roxify.site`, Cloudflare requires the domain to be added as a Cloudflare zone and the registrar nameservers to be changed to the two nameservers Cloudflare assigns. Cloudflare then creates the Pages CNAME for the zone. For `www.roxify.site`, the usual record is:

```text
Type: CNAME
Name: www
Target: <your-pages-project>.pages.dev
Proxy: Proxied when Cloudflare manages the zone
```

The exact apex records and assigned nameservers cannot be generated until the Cloudflare account creates the zone and Pages project. Do not invent A-record IPs for Pages. Before changing Namecheap nameservers, export the existing DNS zone and copy every existing MX, TXT, SPF, DKIM, DMARC, verification, and other required record into Cloudflare. Do not delete mail records. Namecheap’s own guidance warns that records at the old DNS provider stop being authoritative after the nameserver change.

Once Cloudflare reports the zone as active, add both `roxify.site` and `www.roxify.site` under Pages > Custom domains. Choose one canonical hostname and configure a redirect from the other. Confirm HTTPS is active before changing any canonical redirect. Keep the Manus site available until the independent hostname has passed QA.

## QA before cutover

Run the following checks against the temporary `pages.dev` deployment and then repeat them against `https://roxify.site` after DNS activation:

1. Open `/`, `/vault`, `/personal`, `/corporate`, `/partners`, `/pricing`, `/dashboard`, `/privacy`, and `/terms` directly in a new browser tab.
2. Confirm the homepage, mobile layout, video poster/video, glass cards, and all CTA links render.
3. Open the AI Concierge, complete both Personal and Corporate paths, and verify the generated mailto links.
4. Click the Vault CTA and confirm the request mailto subject/body.
5. Open the dashboard demo and confirm the demo disclaimer and interactive state work without network APIs.
6. On a browser that supports it, verify voice controls, speech cancellation, and waveform state. Remember that browsers may block unprompted speech until a user gesture; the manual Play control is the reliable fallback.
7. Run `npm ci && npm run build` from a clean checkout and inspect the output for missing assets.
8. Check HTTPS, canonical redirects, browser console errors, mobile viewport behavior, and static asset caching.

## Backup and rollback

Keep the source repository and a release ZIP containing the source, `package-lock.json`, `public/media`, and this document. Tag the production commit after the first successful independent deployment. To roll back, redeploy the previous Git commit or select the previous Cloudflare Pages deployment. Keep the Manus checkpoint available until DNS and the first independent production release have been stable.

## Environment-variable inventory

Current inventory: **none required**. `.env.example` is intentionally documentation-only. If a future integration adds a provider, add only the variable name and purpose to `.env.example`; store the value in Cloudflare Pages project secrets, never in Git or a client bundle unless it is explicitly public.

## Sources

[1]: https://developers.cloudflare.com/pages/configuration/custom-domains/ "Cloudflare Pages custom domains"
[2]: https://developers.cloudflare.com/pages/configuration/redirects/ "Cloudflare Pages redirects"
[3]: https://www.namecheap.com/support/knowledgebase/article.aspx/9607/2210/how-to-set-up-dns-records-for-your-domain-in-a-cloudflare-account/ "Namecheap DNS records and Cloudflare nameservers"
