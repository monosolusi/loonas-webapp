---
name: second-instance-means-extract
description: When a second page needs the same table row or the same rule, extract instead of writing a correct copy — and grep for every existing site of that rule before claiming single ownership
metadata:
  type: feedback
---

Two habits arch-review pushed back on in the same pass, both about the moment a
rule gets its second instance:

1. **A divergence you noticed is the argument for extracting, not for a careful
   copy.** I wrote a new stock-item list row, spotted that the sibling
   `negative-stock-row.tsx` disagreed with its own header on column alignment,
   got the new one right and reported the divergence as a "leave it or fold it
   in?" question. The review's answer: the divergence *is* the evidence the two
   rows should be one component. Shared markup goes to
   `features/*/presentations/components/`; each page keeps only what genuinely
   differs (its action `useMemo`, a tone class). Do NOT share the list impls —
   they differ on hook and filters, and the table primitives are already the
   shared abstraction.

2. **"Single owner" is a claim you must grep before writing it in a docstring.**
   I extracted the negative-balance recovery rule from the blocked dialog into a
   helper and documented it as the one owner — while a **fourth** call site,
   `stock-adjustment-form-dialog.tsx`, still hardcoded its own purchasing-only
   copy of the same rule. Extracting from the sites you happen to be editing is
   not extraction; grep the rule's *values* (the label, the route, the error
   code) across the repo, not just the files in your diff.

**Why:** LNS inventory stock-adjustment. Both landed as review findings that a
mechanical check before reporting would have caught — the alignment mismatch was
already in my report as an open question, and the fourth call site was one grep
for `"Catat Pembelian"` away.

**How to apply:** when adding the second instance of a row/card/rule, grep the
literal strings and routes it contains. If another site has them, fold it into
the extraction in the same PR. Related: [[feedback_move_means_delete_source]].
