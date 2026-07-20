---
name: profitability-auth-wall
description: /finance/profitability is Clerk auth-walled; headless Playwright smoke redirects to Dashboard, so QA must verify layout source-level.
metadata:
  type: project
---

The `/finance/profitability` route lives under `(authenticated)` and is protected by Clerk middleware. An unauthenticated headless Playwright session is redirected to `/` (Dashboard) when requesting `http://localhost:3000/finance/profitability`, so viewport screenshots cannot render the actual page.

**Why:** Clerk requires a signed-in session for any route under `(authenticated)`. There is no headless workaround that bypasses the middleware wall without a real user session.

**How to apply:** For future QA on this route, do not attempt Playwright harnesses or browser smoke. Verify layout changes source-level by reading the changed components, CSS grid definitions, SectionCard usage, and alignment classes. Flag any observation that needs manual human smoke with an authenticated browser.
