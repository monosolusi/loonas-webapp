---
name: search-combobox-prop-gaps
description: SearchCombobox's `required` is inert under `noLabel`, and it has no error/description/aria-invalid/aria-describedby props — know the house workaround before flagging a call site
metadata:
  type: feedback
---

`core/presentations/components/search-combobox.tsx` has two contract gaps that recur at call sites.
Know both before writing a finding.

1. **`required` is inert whenever `noLabel` is set.** The prop is read in exactly one place — inside
   the `{!props.noLabel && (...)}` label block, to render the ` *` asterisk — and is **never**
   forwarded to the underlying `ComboboxInput`. So `<SearchCombobox noLabel required .../>` does
   nothing at all: no asterisk, no HTML `required`, no `aria-required`. Existing call sites already do
   this (`features/accounting/presentations/components/ledger-account-combobox.tsx`,
   `accounting/mappings/_components/coa-mapping-line-row.tsx`), so it is repo-wide inertness, not a
   new defect — report it as a dismissible Minor, not as a violation.

2. **No `error`, `description`, `aria-invalid` or `aria-describedby` props, and no prop passthrough
   to the inner `<input>`.** The house workaround is a *sibling* element beside the combobox:
   `<span className="text-xs leading-4 font-normal text-red-500">` (precedent
   `accounting/cash-entries/new/_components/cash-category-create-form-dialog.tsx`, the error strip
   under the account combobox). Consequence: **the input↔message a11y association cannot be restored
   from the call site** — it needs an edit to `search-combobox.tsx` itself. Do not ask a caller-only
   diff to fix it; `role="alert"` on the sibling is the available mitigation.

Also note `emptyMessage` is a single static string covering both "your query matched nothing" and
"the option list is empty to begin with"; branching it on `options.length === 0` is the in-repo
precedent (`cash-category-create-form-dialog.tsx` branches it on loading/error).

**Why:** LNS-782 replaced a `SelectInput` picker with `SearchCombobox` and I had to derive all of
this from the component source to judge three separate points in the diff.

**How to apply:** any diff adopting `SearchCombobox`, or any finding about a required-marker,
validation message, or a11y association on one.

Related: [[project_lns782_review_learnings]], [[feedback_in_dialog_error_copy_color]]
