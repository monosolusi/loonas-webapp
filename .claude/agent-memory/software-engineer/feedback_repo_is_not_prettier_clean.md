---
name: repo-is-not-prettier-clean
description: Prettier is installed but not enforced by CI or hooks, and much of the repo fails prettier --check — never reformat untouched lines to "fix" it
metadata:
  type: feedback
---

`prettier` + `prettier-plugin-tailwindcss` are devDependencies, but there is no
`format` script, no husky hook, and the CI gate is only
`lint → typecheck → test → build`. Large parts of the tree fail
`npx prettier --check` at HEAD (e.g. most of
`src/features/inventory/presentations/**` and several `_components/` files).

**Why:** running `prettier --write` on a file I was otherwise touching for one
line would have re-sorted unrelated Tailwind class strings and added trailing
newlines, burying a two-line behavioural change in formatting churn. LNS
inventory-adjustment: `negative-stock-row.tsx` and the blocked dialog were
already prettier-dirty at HEAD, so nothing new was introduced by leaving them.

**How to apply:** write NEW files prettier-clean (verify with
`npx prettier --check <new files>`), but leave pre-existing formatting in files
you only edit. Before assuming you introduced a violation, diff against HEAD:
`git show HEAD:<path> > /tmp/x.tsx && npx prettier --check /tmp/x.tsx`. Note
`prettier --check` and globs both choke on the `(authenticated)` / `[id]` parens
and brackets in app-router paths — quote the literal path, don't glob it.
