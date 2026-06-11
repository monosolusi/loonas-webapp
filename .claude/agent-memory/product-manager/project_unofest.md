---
name: project-unofest
description: Loonas Ubaya UNOFEST — POS-led GTM pilot at Ubaya Festival June 2026; FE team's current goal
metadata:
  type: project
---

**Linear project**: `Loonas Ubaya UNOFEST` (id `860282c6-f050-4552-adf3-6cb63748747f`, slug `loonas-ubaya-unofest-a645b45f3365`). Lead: Frans. Status: In Progress. Start 2026-02-27, target 2026-06-04. Tentative festival window 2026-06-02 to 2026-06-04 (final dates pending event ops).

**What it is**: Loonas' first live proving ground for POS-led GTM. Success = an F&B UMKM tenant runs the 5-step happy path end-to-end at Ubaya Festival without any P0, becoming a Tier-2 cities case study vs Moka/Majoo.

**5-step happy path (in order)**:
1. Capture production (frozen cost) — `POST /products/:product_id/variants/:variant_id/productions`
2. Add product / variant / category — `/products`, `/products/:id/variants`, `/categories`
3. Sell via POS cash — `POST /pos/sales` channel=pos, CASH, atomic PAID
4. Sell via POS QRIS dynamic — `POST /pos/sales` QRIS, PENDING_PAYMENT → PAID via callback
5. Read dashboard report — `GET /dashboard`

**Explicit out of scope for UNOFEST**: [[project-accounting-domain]] feature-completeness epic LNS-96, statement exports (LNS-103/104/105/133/134/135/136/137), opening balance wizard LNS-106, year-end close LNS-108, PKP onboarding (LNS-116, LNS-118), multi-outlet POS, WhatsApp receipt LNS-28, FE CoA editor LNS-117.

**What's done (FE-visible)**: LNS-21 POS basic UI, LNS-22 POS QRIS, LNS-23 product CRUD, LNS-24 HPP/BOM, LNS-25 inventory, LNS-27 RBAC phase 1, LNS-36 CoA/journal infra, LNS-41 product types, LNS-50 purchasing, LNS-53 production.

**What's open in UNOFEST scope**:
- BE in flight: LNS-189 (dashboard cash vs QRIS breakdown, Backlog), LNS-190 (dashboard daily revenue series, In Progress).
- BE FE-requested (2026-05-19): LNS-191 (`payInDetail.expiresAt` + EXPIRED lifecycle for QRIS dynamic; label `fe-requested-be`).
- FE batch filed 2026-05-19: LNS-193 (festival-window dashboard widget, blocked-by LNS-189/190, High), LNS-195 (QRIS expiry countdown + EXPIRED, blocked-by LNS-191, High), LNS-197 (POS kasir-mode polish pass, Medium), LNS-199 (POS receipt + Indonesian copy audit, Medium).

**Why**: Festival is the single-outlet F&B GTM proof, not the moment to launch the full accounting stack. Date pressure is real (June 2026) but scope is intentionally narrow.

**How to apply**: When asked anything UNOFEST-related, default to scoping FE work around the 5-step happy path. Anything tagged out-of-scope above is deferred. For BE dependencies, file separate tickets with the `fe-requested-be` label (see [[reference-fe-requested-be-label]]).
