# Naji Sazan Amin — Next.js static site

A static Next.js 16 export of the Naji Sazan Amin engineering-consultancy site. The generated
`out/` directory is plain HTML, CSS, JavaScript and assets; it needs no Node.js runtime in
production.

## Stack

- Next.js 16.4.2 (App Router, `output: 'export'`, `trailingSlash: true`)
- React 19.3.1 and TypeScript 5.9
- Playwright 1.64 for end-to-end and visual-parity tests
- Nginx for static hosting (`deploy/nginx.conf`)

## Requirements

- Node.js 26.x and npm 11.x (the repository is tested with Node 26.7.0 / npm 11.17.0)
- Python 3 on `PATH` for the Playwright static servers
- Chromium for Playwright: `npx playwright install chromium`

## Commands

```bash
npm ci
npm run dev          # development server on http://localhost:3000
npm run build        # static export to out/
npm run preview      # serve out/ on http://127.0.0.1:4174 (Python convenience server)
npm run typecheck    # tsc --noEmit
npm run lint         # eslint .
npm run test:e2e     # build both exports and run the Playwright suite
```

`next start` is not supported with `output: 'export'`; serve `out/` with Nginx or another static
server. `npm run preview` is for local inspection only.

## Contact endpoint

The contact form reads `NEXT_PUBLIC_CONTACT_ENDPOINT` at **build time**:

- Empty (default): the form validates, shows the success message and resets, but sends nothing.
  This is the demo export.
- `/api/contact` or an absolute URL: the form sends `POST` with `Content-Type: application/json`
  and this body:

  ```json
  {
    "name": "…",
    "phone": "…",
    "email": "…",
    "city": "…",
    "message": "…",
    "type": "…",
    "scale": "…"
  }
  ```

  Any non-2xx response or network failure shows the error message and keeps the entered values so
  the visitor can retry. The `company_website` field is a client-side honeypot; it is not a
  security control. Validate and rate-limit submissions on the server.

A static export has no API routes. Deploy the endpoint separately (or reverse-proxy
`/api/contact` to the backend) and update the CSP `connect-src` directive if it is cross-origin.

## Tests

`npm run test:e2e` does the following:

1. Builds the endpoint export with `NEXT_PUBLIC_CONTACT_ENDPOINT=/api/contact` and copies it to
   `out-endpoint/` (test-only; never deploy it).
2. Rebuilds the default demo export into `out/`.
3. Starts the legacy site on `127.0.0.1:4173`, the demo export on `:4174`, and the endpoint export
   on `:4175`, then runs Playwright with one worker.

The Playwright config expects the legacy site at `../naji-sazan-amin` relative to this repository
(a sibling checkout). Create that sibling before running the suite; in CI, `reuseExistingServer`
is disabled, so the servers must be startable from the configured paths.

The suite covers the four routes, the shared shell, navigation, the mobile drawer, the contact
form and endpoint contract, plus 32 live visual comparisons (four routes × two viewports × two
themes × viewport/full-page). Visual tests compare against the legacy render, not stored
snapshots. The hero video is hidden during comparison because it is time-based. Thresholds are 2%
of viewport pixels and 3% of full-page pixels; failure screenshots are written to
`test-results/visual/`.

At 390 px the mobile header is usable. Below 600 px the header consultation button is hidden on
purpose and the drawer carries the same call to action; the menu button and theme toggle stay
fully inside the viewport and the document does not overflow horizontally. `navigation.spec.ts`
asserts this on every route, including the menu and theme-toggle bounds, the hidden header CTA, the
visible drawer CTA and `document.documentElement.scrollWidth <= window.innerWidth + 1`. Mobile
visual comparisons mask `.site-header` because the legacy header still overflows, while the rest of
each page is still compared pixel for pixel.

## Deployment

```bash
npm ci
NEXT_PUBLIC_CONTACT_ENDPOINT=/api/contact npm run build
sudo mkdir -p /var/www/naji-sazan-amin-next
sudo rsync -a --delete out/ /var/www/naji-sazan-amin-next/out/
sudo cp deploy/nginx.conf /etc/nginx/conf.d/naji-sazan-amin.conf
sudo nginx -t && sudo systemctl reload nginx
```

The build above targets the production same-origin endpoint. On PowerShell, set it first:
`$env:NEXT_PUBLIC_CONTACT_ENDPOINT='/api/contact'; npm run build`. For a demo deployment without a
backend, use the plain demo build `npm run build` instead; the form validates and reports success
but sends nothing. The value is inlined at build time, so rebuild to change it.

Because the export is static, a same-origin `/api/contact` needs a reverse proxy in front of the
static files that forwards that path to the backend; the supplied nginx config serves static files
only. If the endpoint is cross-origin, add its origin to the CSP `connect-src` directive.

Before enabling the config, replace `server_name`, `root` and the log paths. The provided file is
a `server {}` block intended for `http {}` (for example `/etc/nginx/conf.d/`); it assumes the
standard `mime.types` include. Add the same security headers to the TLS server or terminate TLS in
a separate 443 block.

Behaviour of the supplied config:

- `/` and `/about/`, `/projects/`, `/contact/` are served from directory indexes.
- `/about.html`, `/projects.html`, `/contact.html` redirect with `301` to the trailing-slash
  routes; `/index.html` redirects to `/`.
- Unknown paths return the internal `404.html` with status 404; there is no SPA fallback.
- `/_next/static/` is immutable for one year; `/assets/` is cached for thirty days; HTML is
  revalidated (`Cache-Control: no-cache`).
- Gzip is enabled for text, JSON, JavaScript, XML and SVG.
- Dotfiles other than `/.well-known/` are denied.
- The CSP allows only same-origin scripts, styles, fonts, images, media and `fetch`. Next.js
  requires `'unsafe-inline'` for its bootstrap/theme scripts and inline styles. If you add
  analytics, a cross-origin contact endpoint, or embedded maps, extend the relevant directives.

The site is RTL Persian and uses locally hosted Vazirmatn fonts; no external font or map tile
requests are required. The map widget is CSS/SVG, and its navigation buttons are ordinary outbound
links.
