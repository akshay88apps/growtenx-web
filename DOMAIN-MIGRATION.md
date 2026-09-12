# AIPrism domain migration

## Deployment

- Repository: `akshay88apps/growtenx-web`, production branch `main`.
- Vercel team: `akshay88apps-projects`.
- Website project: `iamai-website` (`prj_RiKAu1QFOI1v8WtQx9x7OGObHMur`).
- Existing website: `https://www.growtenx.in/` (not `growtex.in`).
- New primary address: `https://aiprismllp.com/`.
- Last deployment before migration: `b703b4cbb7db03693ec36e500f7881d358c2994b`.

Both `aiprismllp.com` and `www.aiprismllp.com` are attached to this project. On September 12, 2026, GoDaddy DNS was updated and Vercel verified both names. Both authoritative nameservers and public resolvers (1.1.1.1 and 8.8.8.8) returned the correct records. HTTPS certificates were verified against the Vercel endpoints, and the new domain served the existing production homepage. Some local DNS caches can temporarily retain the previous parking addresses.

Permanent (308) domain redirects are configured in Vercel for `growtenx.in`, `www.growtenx.in`, and `www.aiprismllp.com` → `aiprismllp.com`.

## GoDaddy DNS

In GoDaddy → My Products → aiprismllp.com → DNS, replace the parked website records with the following values returned by `vercel domains verify` for this project:

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 216.198.79.1 |
| A | @ | 64.29.17.1 |
| CNAME | www | 7b32865a55db58e9.vercel-dns-017.com |

Replace the parked A values `76.223.105.230` and `13.248.243.5`, and the existing `www` CNAME pointing to `aiprismllp.com`. Keep the default TTL, GoDaddy nameservers, and other records. These values are project-specific; recheck Vercel if configuring this later.

## Rollout and verification sequence

1. Verify public DNS for the apex and `www` and run `vercel domains verify` for both under `--scope akshay88apps-projects`.
2. Confirm a valid HTTPS certificate and the AIPrism homepage at the new address.
3. Publish the prepared canonical/social URL updates, `robots.txt`, and `sitemap.xml` via `main`; verify the resulting production deployment and all pages/assets.
4. Set project-domain permanent (308) redirects for `growtenx.in`, `www.growtenx.in`, and `www.aiprismllp.com` to `aiprismllp.com`. Configure these in Vercel project domain settings, consistent with the existing domain redirect setup. Preserve paths and query strings, and test them publicly.
5. Check navigation, mobile layout, and contact-form behavior at the new origin. Use intercepted form requests unless a real test enquiry is explicitly authorized.

The sitemap lists the 16 current pages; the legacy `ai-platformold.html` remains accessible but is omitted from the sitemap. Existing email addresses remain until replacement mailboxes are verified.

## Completed validation

Migration commit `f36301b` was pushed to `main` and Vercel reported successful production deployments. All 17 HTML pages and 14 supporting assets/files (including the sitemap and robots file) matched the repository at the new HTTPS origin. Each of the three redirected domains returned 308 for both the homepage and a secondary page with a query string, preserving the full destination path and query.

Browser checks at 375 and 1440 pixels passed without overflow or JavaScript errors. Navigation, service tabs, contextual enquiry selection, article dialogs, focus restoration, mocked form success/retry, reduced motion, and no-JavaScript fallbacks passed. Axe found no A/AA violations; gradient contrast remains covered by the prior palette review in `DESIGN.md`. No real enquiries were sent.

These checks used the publicly verified Vercel DNS address explicitly because the local operating system still cached a GoDaddy parking address during rollout. TLS certificate validation remained enabled. Both authoritative nameservers, Cloudflare DNS, and Google DNS returned the correct apex records; no conflicting apex AAAA record was present. A cached parking page can persist until a visitor's DNS cache refreshes.

## Recovery

If the new address fails, restore `www.growtenx.in` to serve the production deployment (remove its redirect), then restore `growtenx.in` → `www.growtenx.in`. Only redirect new-domain traffic to the old domain after removing old-to-new redirects, to prevent loops. Revert the migration commit if the page metadata also needs to return to the previous domain.

References: [Vercel domain setup](https://vercel.com/docs/domains/working-with-domains/add-a-domain), [project domain update API](https://vercel.com/docs/rest-api/projects/update-a-project-domain).
