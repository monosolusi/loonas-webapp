---
name: project-no-api-routes
description: As of 2026-05-21 the Next.js app has zero route handlers under src/app/**/api — no /api/health, no server-side endpoints of any kind. All HTTP traffic is FE-to-loonas-BE.
metadata:
  type: project
---

As of 2026-05-21, `find src/app -type d -name "api"` returns zero matches and `find src/app -name "route.ts"` returns zero matches. The Next.js app exposes no API route handlers at all — every HTTP call originates client-side via `HttpRequest` to the loonas BE (`NEXT_PUBLIC_BASE_API_URL`).

**Why:** Architecture is intentionally a pure FE talking to a separate BE service. Surfaced during LNS-226 (Docker slimdown) when planning the standalone healthcheck — there was no `/api/health` to target, so we fell back to root `/` (which Clerk redirects to sign-in, returning 307).

**How to apply:**
- For any healthcheck / liveness / readiness plan, default to root `/` and accept 2xx+3xx as healthy (Clerk auth redirect). Do not invent an `/api/health` route as a side-effect of another ticket — that's a scope addition requiring PM sign-off.
- If a future ticket genuinely needs server-side logic (webhooks, ISR-on-demand, BFF), flag that it introduces the *first* `src/app/**/api` route — it sets a precedent for layering rules (where does the use-case/repository tree live for server-side code?) and deserves its own architectural discussion before scaffolding.
