---
name: settings-route-siblings
description: Actual /settings/* route siblings in loonas-webapp-2 — chart-of-accounts is NOT one of them
metadata:
  type: project
---

The real `/settings/*` route children in this repo are: `coa-mappings`, `fixed-costs`, `categories`, `raw-materials` (+ `bank-accounts` in ROUTE_MAP). There is **no** `/settings/chart-of-accounts` route.

**Why:** LNS-380's ticket body described the new `/settings/tax-posture` page as a "sibling of /settings/coa-mappings and /settings/chart-of-accounts" — the chart-of-accounts half is wrong; CoA lives under the finance/accounting surface, not settings. Caught during LNS-380 intake by listing the real settings dir.

**How to apply:** When a ticket anchors a new settings page to a named sibling, verify the sibling route actually exists before propagating it into the PRD. The accounting-gated settings cards (`fixed-costs`, `coa-mappings`) carry `feature: "accounting"` and are gated by `account?.hasFeature("accounting")` on the settings landing page — new accounting settings pages follow that same gate. Related: [[project_finance_nav_ia]].
