---
name: lns398-dup-of-117
description: LNS-398 (FE consume is_system on CoaAccount) closed as duplicate of LNS-117; is_system contract folded into LNS-117
metadata:
  type: project
---

LNS-398 (FE: consume `is_system` on `CoaAccount` for seeded-vs-tenant editor gating) was closed 2026-06-24 as a **duplicate of LNS-117** (full FE CoA editor build), which already covers `is_system` consumption + gating.

**Why:** LNS-117 is the umbrella CoA write/management editor; LNS-398's whole scope (read `is_system`, pre-flight gating, 409 fallback) is a subset of it. Redundant ticket.

**How to apply:** The `is_system` contract detail now lives in LNS-117 under a "Contract notes (from LNS-398)" section + one FR + one AC. When scoping CoA editor work, LNS-117 is the single source — do not re-file `is_system` as separate FE work. BE counterpart is LNS-396 (Done; PR loonas-api#275). See [[project_coa_mapping_shape]] and [[reference_fe_requested_be_label]].

**Linear mechanic learned:** Setting `duplicateOf` via `save_issue` **auto-flips the issue to the `Duplicate` state** and **replaces** any existing `relatedTo` relation (the related→duplicate conversion). A combined `save_issue` with both `duplicateOf` + `state: Duplicate` FAILS ("Missing duplicate relation - ... can only be moved to a duplicate state when a duplicate issue relation exists") — set `duplicateOf` alone; the state follows automatically. The `Loonas` team's canonical closed-as-dup state is `Duplicate` (type `duplicate`), distinct from `Canceled`.
