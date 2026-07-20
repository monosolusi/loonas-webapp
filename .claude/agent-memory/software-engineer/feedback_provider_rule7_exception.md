---
name: provider-rule7-exception
description: NARROW exception — a co-located page-level gate provider may import its own loading/error leaf from sibling _components/; not a general license
metadata:
  type: feedback
---

Rule 7 (provider must not import from `_components/`) holds by default. There is ONE narrow exception: a **page-level orchestrator provider** may import a sibling `_components/` leaf directly — but ONLY when ALL of these hold:

1. The provider lives in that route's `_providers/` and is used by exactly **one** page (not feature-level, not reused across routes / shared contexts).
2. It owns the full loading/error/ready **gate** and imports the component solely to render that gate.
3. The imported component is a **pure presentational leaf** (loading skeleton / error state) co-located in the same route's `_components/` — not a data-consuming or business component.

Example: `journal-detail-provider.tsx` (LNS-372) imports and renders `<JournalDetailError onRetry={...} />` directly when `journalState` is in error — no injected `error: React.ReactNode` prop needed.

**Why:** EL's FIX-4 ruling on LNS-372 reversed the injected-prop approach for this case — a single-page provider that owns the state machine naturally owns its loading/error gate. Rule 7's real target is coupling a **reusable/feature-level** provider to specific UI; that concern does not apply to a one-page, co-located gate provider.

**How to apply:** This is the exception, not the norm — when in doubt, keep the import out. If the provider is (or might become) reused across pages or lives in `features/.../providers/`, do NOT import `_components/`; use the injected `loading`/`error: React.ReactNode` prop pattern instead. Never use this exception to justify importing data/business components into a provider.
