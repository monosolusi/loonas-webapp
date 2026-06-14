---
name: ac-phrasing-whole-surface
description: For call-site-elimination / N+1-removal ACs, assert over the whole surface (zero callers remain under dir/) not a single named file
metadata:
  type: feedback
---

When an acceptance criterion's goal is to *eliminate a call site or pattern* (N+1 removal, "drop the per-card X call", "stop calling useY"), phrase the AC against the **whole affected surface**, not one named file. Example: write "zero `useGetAccountVerificationWork` callers remain anywhere under `accounts/`" — not "`account-status-badge.tsx` no longer calls `useGetAccountVerificationWork`".

**Why:** LNS-389 (2026-06-14). AC #2 was written file-specifically ("verify `account-status-badge.tsx` no longer calls..."). The picker had a SECOND per-card caller (`account-card-action.tsx`) that org-less stuck the "Masuk Dashboard" entry button on a disabled "Memuat..." state, blocking account entry. The first pass fixed only the badge — AC #2 PASSED as literally worded while the underlying goal (no per-card verification-works call when rendering the picker) was still violated. Caught only in manual testing, requiring a scope-correction commit (`edd9095c`) on an already-open PR.

**How to apply:** Whenever an FR/AC targets removing or replacing a call, hook, import, or pattern, before finalizing the AC ask "could this same pattern exist in a sibling component I haven't named?" Then write the AC as a surface-wide assertion verifiable by grep over the directory/feature, not a single-file check. Pairs with the existing scope-enumeration discipline (enumerate every touched file in FRs) — but this is the inverse safeguard: the AC should catch instances the FR enumeration missed. Related: the LNS-384 lesson that FE-call-surface enumeration is a codebase-discovery task — delegate "find all callers of X" to EL as an explicit PRD line item rather than assuming one call site.
