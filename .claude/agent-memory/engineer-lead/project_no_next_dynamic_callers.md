---
name: no-next-dynamic-callers
description: As of 2026-05-21 the repo has zero next/dynamic users — introducing it for client-only libs (Recharts, etc.) is a new pattern, keep imports leaf-only
metadata:
  type: project
---

`grep -rn 'next/dynamic' src --include='*.ts*'` returns nothing. LNS-193 (Recharts dashboard widget) is the first introduction.

**Why:** No prior FE feature needed client-only React libs; everything has been SSR-safe up to now.

**How to apply:** When planning a feature that uses a non-SSR-safe lib (Recharts, anything touching `window`/`document` at import time), spec the `next/dynamic({ ssr: false })` import in the wrapper file only — keep the `import { ... } from "lib"` in a leaf component file that nothing else imports directly. Otherwise the bundler traces the lib into shared chunks and you lose the lazy-chunk win. Don't centralise a generic dynamic-chart helper until there's a second consumer to justify it. See also [[dashboard-feature-shape]].
