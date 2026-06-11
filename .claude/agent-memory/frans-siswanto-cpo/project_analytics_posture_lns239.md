---
name: analytics-posture-lns239
description: Loonas product-telemetry posture set during LNS-239 — PostHog EU, opaque IDs only, full capture, legitimate-interest basis with privacy-notice + disclosure + opt-out guardrails
metadata:
  type: project
---

Locked during LNS-239 (Recent Activity instrumentation) sign-off.

**Decisions (canonical until revisited):**
- **Vendor:** PostHog, EU Cloud region. Chose over Segment (no fan-out need yet) and in-house (scope creep). EU region selected because PostHog has no SG region; EU is the textbook "adequate jurisdiction" for UU PDP cross-border transfer.
- **PII boundary:** Clerk `user_id` and `account_id`/`orgId` OK on the wire (opaque). Raw resource IDs in URLs are NOT OK — always send the redacted route pattern (`/sales/pos/:id`, not `/sales/pos/abc123`). No merchant names, customer names, phones, emails, or raw monetary amounts in event properties — use buckets for monetary signals.
- **Sampling:** Full capture in v1. Revisit at ~1M events/month or ~$300/mo PostHog spend.
- **Consent basis:** Legitimate interest, NOT explicit consent banner. Three non-negotiable guardrails ship with any analytics PR: (1) privacy policy disclosure (controller + processor + categories + opt-out), (2) one-time in-app disclosure on first session post-launch, (3) PostHog `opt_out_capturing()` plumbing wired for support to flip per user.

**Why:**
UU PDP transition ended 2024-10-17; we're in full-enforcement territory. Lembaga PDP regulator expected to stand up mid-2026 — enforcement posture sharpens then. Three guardrails are minimum defensible position. Full consent banner is GDPR-cargo-culting for behavioural telemetry with opaque IDs in an EU-hosted processor — would hurt activation for no compliance gain.

**How to apply:**
- Any future analytics/telemetry feature inherits these defaults unless the context changes (e.g., marketing-purpose tracking → hard switch to explicit consent).
- EL must wrap PostHog SDK behind a thin abstraction so taxonomy is portable — vendor lock-in mitigation.
- The moment we cross PostHog free tier into paid, trigger DPA legal cycle (~1 week) before hitting the ceiling.
- Pilot-cohort (UNOFEST) signal is not generalisable to SME GA cohort — caveat must live in any PRD that ships analytics-derived conclusions.

Related: [[terminology-lock-struk]] (other product-wide locked decisions).
