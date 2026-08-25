---
name: feedback-proactive-be-gap-ticket
description: When EL flags a BE-gap during Phase 7 (BE contract revalidation), PM must proactively file an fe-requested-be ticket BEFORE moving the parent issue to In Review — do not wait for orchestrator/user prompt
metadata:
  type: feedback
---

**Rule:** When EL flags a BE-gap during Phase 7 (BE contract revalidation) of `/work-on-issue` — or any time FE ships a workaround that depends on a BE change to be made permanent — PM MUST proactively file an `fe-requested-be` Linear ticket BEFORE moving the parent issue to "In Review". Do not wait for the orchestrator or user to ask.

**Why:** On 2026-05-21 during LNS-199 (UNOFEST POS receipt) Phase 7, EL flagged that `account.timezone` was not exposed by BE. FE shipped with hardcoded `"Asia/Jakarta"` + a `LNS-199-followup` code marker. PM moved LNS-199 to "In Review" and posted a summary comment but did NOT file a BE ticket. The user had to ask "Do BE know about this?" and then called out the miss directly: code markers like `LNS-199-followup` decay the moment someone else touches the file — without a Linear ticket in BE's queue, the gap will be forgotten. The mitigation FE ships is only safe if the proper fix is on BE's tracked backlog.

**How to apply:**

1. **Trigger conditions** (any of these = file an `fe-requested-be` ticket immediately):
   - EL identifies a missing/inadequate BE field, endpoint, or contract during Phase 7 BE contract revalidation.
   - FE has to hardcode a value, defer behavior, or stub a flow because BE doesn't expose what's needed.
   - A `TODO`, `FIXME`, or `{ISSUE}-followup` code marker is being added that references a BE change.
   - PR body or `/work-on-issue` summary contains language like "deferred", "BE doesn't expose X", "blocked by BE", "follow-up ticket needed".

2. **What to do** (in this order, before moving parent to "In Review"):
   - File directly via `mcp__plugin_linear_linear__save_issue` — the `/linear-*` skills do NOT exist here, see [[linear-filing-in-this-repo]]. Decide priority yourself.
   - **Mandatory labels:** `Frontend` + `fe-requested-be`. Do NOT apply `Backend` — PM cannot scope BE work.
   - **Title pattern:** `Expose {field/endpoint} on {surface} (FE-requested)` — make the BE-team scan-able from the issue list.
   - **Link with `relatedTo`** to the parent FE issue. Cross-link any greppable code marker (e.g., `LNS-199-followup`) in the body so a BE engineer or future FE can grep both directions.
   - **Body must include:** the FE consumption shape (example JSON), why it matters (user-visible impact), BE acceptance criteria in given/when/then, and the FE follow-up steps that will happen once BE ships.
   - **Then** move the parent FE issue to "In Review" and reference the new ticket in the summary comment.

3. **Do not punt this to the user or orchestrator.** PM owns Linear. The orchestrator does not have Linear access. If the user has to ask "did you file it?", PM has failed the proactive standard.

Related: [[feedback-use-linear-skills]], [[reference-fe-requested-be-label]], [[feedback-agents-are-fe-only]]
