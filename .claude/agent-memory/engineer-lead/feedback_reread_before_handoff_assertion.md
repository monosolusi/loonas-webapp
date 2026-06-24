---
name: reread-before-handoff-assertion
description: Before asserting a shipped value (copy, field, config) in a PR body or handoff summary, re-read the current file — an earlier-phase inspection goes stale once a later fix lands
metadata:
  type: feedback
---

**Rule:** When citing a concrete shipped value — UI copy, a field name, a config value — in a PR body, acceptance summary, or any handoff, derive it from a FRESH read of the current file (`grep` / `git show HEAD:<path>` / read), never from an earlier-phase memory of what the code said.

**Why:** LNS-371 — I wrote the PR #86 body asserting the success toast was "Jurnal berhasil disimpan," citing my Phase-6 inspection. But the copy had been changed to "diposting" (PM ruling) and QA-reverified in a later fix pass. The stale citation required a PR-body correction round-trip.

**How to apply:** At PR-open / acceptance-summary / handoff time, re-read the actual current file for every shipped value you cite — especially any surface touched by a later fix loop. Complements the authoritative-sources discipline and scope-vs-remote verification: an earlier-phase read is not an authoritative source once a change has landed after it.

Related: [[server-error-code-passthrough]]
