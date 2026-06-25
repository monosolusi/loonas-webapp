---
name: presentation-imports-data-models
description: Presentation-layer code (providers, hooks, app components) must not import from data/models/ — only domain/sources/ has that exemption
metadata:
  type: feedback
---

Presentation-layer files (`presentations/`, `app/`) must never import from `features/**/data/models/`. The `data/models/` exemption in CLAUDE.md applies exclusively to `domain/sources/` (the service contract layer). Found in LNS-379: `opening-balance-wizard-provider.tsx` (an app-level provider) imported `parseNormalBalanceHintLines` from `@/features/accounting/data/models/normal-balance-hint`.

**Why:** Clean Architecture layer boundary — presentation must cross the seam via domain entities/types only. The `domain/sources/` exemption exists because those interfaces define the data contract the data layer implements, not because presentation code has a right to reach into models.

**How to apply:** When reviewing any file in `app/`, `presentations/hooks/`, or `presentations/providers/`, grep for `from "@/features/**/data/models"` imports. Flag every hit as a Blocker. The fix is usually to move the utility function to `presentations/helpers/` or `domain/` — model-parsing utilities typically have no true model dependency and can live in the presentation helper layer.

[[feature-imports-app-layer]]
