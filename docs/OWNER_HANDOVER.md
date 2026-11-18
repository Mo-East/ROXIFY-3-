# Roxify owner handover

## What is complete

- Complete React/Vite source export is included.
- `npm ci && npm run build` succeeds.
- Production output is generated in `dist/`.
- All routes are client-side React routes and are declared in `public/manus-routes.json`.
- Cloudflare Pages configuration is included in `wrangler.toml`.
- SPA fallback is included in `public/_redirects`.
- AI Concierge, Vault demo, voice agent, CTAs, and mailto flows are client-side and do not require Manus APIs or a database.
- `.env.example` is included. Current source requires no secrets.

## What is not completed in this sandbox

The site has **not** been independently deployed because no Cloudflare account was authorized. `roxify.site` has **not** been switched at Namecheap. The Manus-hosted version should remain live until the independent deployment passes QA.

## Developer deployment commands

From the repository root:

```bash
npm ci
npm run build
npx wrangler pages project create roxify
npx wrangler pages deploy dist --project-name roxify
```

Or connect the repository in Cloudflare Pages with:

- Build command: `npm ci && npm run build`
- Build output directory: `dist`
- Root directory: repository root
- Node: 22 LTS or the project-supported current LTS

Use a temporary Cloudflare API token with `Account → Cloudflare Pages → Edit`, restricted to the correct account. Do not commit the token. Revoke it after deployment.

## DNS cutover

The exact Cloudflare Pages hostname and assigned nameservers do not exist until the developer creates the Pages project and adds `roxify.site` as a custom domain. Do not invent A-record IPs.

For the apex `roxify.site`, Cloudflare Pages currently requires the domain to be a Cloudflare zone. Cloudflare will assign two nameservers. At Namecheap, change only the domain nameservers to those assigned Cloudflare nameservers. Before doing so, copy every existing DNS record into Cloudflare, especially:

- MX records for email
- SPF TXT
- DKIM TXT/CNAME
- DMARC TXT
- Google/Microsoft/other verification TXT records
- Any existing subdomain records

For `www`, after the Pages project exists, the typical Pages record is:

```text
Type: CNAME
Name: www
Target: <actual-project-name>.pages.dev
```

The developer must add `roxify.site` and `www.roxify.site` under Cloudflare Pages → Custom domains before relying on the DNS records. Pick one canonical host and redirect the other to it. Enable HTTPS/SSL in Cloudflare and verify the certificate before changing canonical redirects.

## Owner access to retain

The owner should retain access to:

1. The Git repository containing this source.
2. The Cloudflare account, Pages project, DNS zone, and billing/security settings.
3. The Namecheap registrar account and domain renewal settings.
4. The email provider account represented by the existing MX/TXT records.
5. The backup ZIP files delivered with this handover.

## Production QA

Before DNS cutover, test the temporary `pages.dev` URL on desktop and mobile:

- `/`
- `/vault`
- `/personal`
- `/corporate`
- `/partners`
- `/pricing`
- `/dashboard`
- `/privacy`
- `/terms`

Complete both AI Concierge paths and verify their mailto links. Test the Vault request CTA, dashboard demo interaction, voice play/pause behavior, mobile navigation, video/poster assets, direct route refreshes, HTTPS, and browser console errors. Confirm that email still works after DNS migration by checking MX/TXT records.

## Environment inventory

Current required environment variables: **none**.

If future code adds a provider API, store values only in Cloudflare Pages project secrets or CI secrets. Keep the variable name and purpose in `.env.example`; never commit secret values.

## Rollback

If the independent site fails, keep the Manus site live and remove or disable only the new Pages custom-domain mapping. Restore the previous DNS records or canonical target from the exported DNS zone. Cloudflare Pages can redeploy the previous successful deployment or Git commit. Do not delete the Manus project until the independent site has been stable and backed up.

## Source references

- Cloudflare Pages custom domains: https://developers.cloudflare.com/pages/configuration/custom-domains/
- Cloudflare Pages redirects: https://developers.cloudflare.com/pages/configuration/redirects/
- Namecheap Cloudflare DNS setup: https://www.namecheap.com/support/knowledgebase/article.aspx/9607/2210/how-to-set-up-dns-records-for-your-domain-in-a-cloudflare-account/
