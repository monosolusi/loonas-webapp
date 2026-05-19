---
name: reference-fe-requested-be-label
description: Linear label `fe-requested-be` for BE tickets filed by the FE team as dependencies
metadata:
  type: reference
---

**Label**: `fe-requested-be` (workspace-level, id `f69b326e-6f3e-4c5c-89c0-cf1d2ececdd1`, color `#5E6AD2`).

**Meaning**: A backend ticket the FE team filed because FE work is blocked or downgraded without it. The FE-side PM owns the spec; the BE team owns implementation.

**How to apply**:
- Pair with the existing `Backend` label (id `8595232d-55dc-4220-b496-99b7da707bf7`), not in place of it.
- Use whenever the FE team needs an endpoint, field, behavior, or contract change that doesn't yet exist on BE — instead of blocking FE work, create the BE ticket with this label and defer the FE side.
- Filtering Linear by `label:fe-requested-be` should give the BE team a clean view of all FE-originated requests across projects.
- Naming convention chosen 2026-05-19 by the FE PM. Existing scope labels in this workspace are capitalized (`Backend`, `Frontend`, `Feature`); this is intentionally lowercase-kebab so it visually reads as a meta-tag rather than a domain scope.

Related: [[project-unofest]] — current project where this label is being actively applied.
