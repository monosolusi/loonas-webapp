---
name: journal-list-param-drift
description: FE GET /accounting/journals sends page+limit but live spec expects offset+limit — pre-existing pagination drift, not LNS-384 scope
metadata:
  type: project
---

`features/accounting/data/sources/journal.ts` `list()` sends `searchParams` `page` + `limit` + `search`. Live OpenAPI (2026-06-14) for `GET /accounting/journals` declares query params `limit`, `offset`, `search` — NOT `page`. So FE `page` is silently ignored by BE; pagination likely defaults to first page regardless.

**Why:** noticed during LNS-384 grounding; out of LNS-384 scope (which is tenant-id stripping only, shapes unchanged). How to apply: flag as a separate pagination-correctness ticket (page→offset translation) — do NOT fold into a tenant-migration ticket. The journal list page (`/finance/journals`) may have a latent "page 2 returns page 1" bug worth a PM/BE confirm.
