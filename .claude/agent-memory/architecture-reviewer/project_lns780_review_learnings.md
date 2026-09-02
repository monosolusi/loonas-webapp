---
name: project-lns780-review-learnings
description: LNS-780 cash-entry-settings copy fix — verify a copy module's stated trigger condition is REACHABLE in the product, not just spec-quoted; display-mapper in domain/helpers/ is fine here
metadata:
  type: project
---

LNS-780 (`fix/cash-entry-settings-offset-account-copy`) was a copy fix plus a 5-site mapper
extraction. Three things worth carrying forward.

**1. A copy string quoting the spec can still name an UNREACHABLE condition.** The new
`cash-entry-settings-copy.ts` description said the defaults apply "saat transaksi kas dicatat
tanpa kategori" — lifted from the spec, but `POST /accounting/cash-entries` marks `category_id`
**required**, and the FE provider blocks submit with "Pilih kategori kas.". The spec's own
sentence has a second clause the copy dropped ("**or for curated categories that fall back to
defaults**"), and that clause is the only reachable trigger. **Why:** the copy makes a live
setting read as inert to the user. **How to apply:** when a diff adds copy describing *when* a
setting takes effect, diff the copy against the FULL spec sentence AND check the named condition
is producible by the request schema + the FE's own submit gate — a required field in the create
body invalidates any "when X is omitted" copy. Same family as
[[feedback_error_copy_names_real_recovery]] (copy promising a recovery the code never performs).

**2. `domain/helpers/` for a display-label mapper is acceptable in this repo** — do not flag it.
`toLedgerAccountOptionParts(LedgerAccountEntity)` builds `{id, label, description}` and lives in
`features/accounting/domain/helpers/`. It passes every CLAUDE.md disqualifier (pure, entity input,
no I/O callbacks, no `presentations/` import, returns its own plain type not `SearchComboboxOption`),
and the repo already puts display formatting in domain (`ACCOUNT_TYPE_LABELS` in `domain/enums/`,
`LedgerAccountEntity.displayBalance`). Proposing a move names no defect. See
[[project_lns570_review_learnings]] for the disqualifier list that DOES apply.

**3. Grep method for "did the extraction hit every site":** intersect the two file sets —
`grep -rln "SearchComboboxOption" --include="*.tsx" src | xargs grep -ln "LedgerAccountEntity"` —
rather than counting the sites the ticket listed. It found exactly the three files, confirming
5/5 (each combobox has an option-map memo AND a stale-selection fallback memo; the fallback is the
one that gets missed).

**4. Field-hint color token:** the house `text-xs leading-4` field hint is `text-neutral-300`
(`coa-account-form-dialog.tsx#coa-code-range-hint`, `cash-category-edit-form-dialog.tsx`), not
`text-neutral-400` (`#1B1B1B`, the body/foreground weight). Both pass AA comfortably — this is a
hierarchy convention, Minor only.

**5. Round-2 (fix round) additions.** Two things the fix round taught:

- **"Restore the dropped clause" is not the same remedy as "remove the unreachable one."** The
  round-1 MAJOR was *named an unreachable trigger*; the fix ADDED the reachable curated clause but
  KEPT the unreachable "tidak menyertakan kategori" one, and its own code comment now asserts
  "sentence 3 names both **reachable** trigger conditions." **How to apply:** when a finding says
  "clause X was dropped, restore it", re-check on round 2 that the *originally flagged* defect is
  gone too — a restored clause sitting beside the flagged one satisfies the prescribed fix while
  leaving the reported defect standing.
- **Extracting a string to a copy module creates a second-source-of-truth risk in the SKELETON.**
  `cash-entry-settings-form.tsx` moved to `CASH_ENTRY_SETTINGS_COPY.defaultAccountCard.title` while
  `cash-entry-settings-skeleton.tsx` still hardcodes `<SectionCard title="Akun Default">` — the same
  route renders both. **How to apply:** whenever a card/page title is centralized into a `_utils/`
  copy module, grep the page's `*-skeleton.tsx`, `*-empty.tsx` and `*-error.tsx` siblings for the
  same literal; loading/empty/error shells routinely repeat the title and are outside the diff.
- **Spec prose can contradict itself; say which layer you trusted.** `CashEntrySettingsResponse`'s
  parent description (and the `GET` path description, verbatim) say the defaults serve "curated
  categories that fall back to defaults", but the two *per-field* descriptions say only "entries
  with no explicit category", and `CashEntryResponse` says flatly "the offset side is the account
  linked to the entry's category" while curated categories keep a remappable `account_id`. The
  curated-fallback behaviour is therefore spec-stated but not spec-confirmed. Reinforces the
  CLAUDE.md rule to read error codes/semantics **per operation**, one level down: read
  descriptions per FIELD, not just per schema.
