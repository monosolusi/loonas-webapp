---
name: error-copy-names-real-recovery
description: Error-state copy must name a recovery the code actually performs; SWR's global auto-retry (swr-provider.tsx shouldRetryOnError) decides whether "no retry button" is a defect or a wait-state
metadata:
  type: feedback
---

Two linked rules for judging fetch-error states in dialogs and inline strips:

1. **Check `src/core/presentations/providers/swr-provider.tsx` before calling a missing retry affordance a defect.** It sets a global `shouldRetryOnError` that returns true for every code except `RESOURCE_EXPIRED` / `NOT_FOUND`. So a failed fetch self-heals via SWR's automatic backoff retry (~5s) or window refocus — "no retry button" is usually a *wait-state*, not a dead end. It becomes a real defect only when the code is terminal (those two codes) or the state also blocks all further action.
2. **The copy must not describe a manual recovery the code does not perform.** LNS-740 shipped "Tutup dialog ini lalu coba lagi" over a failed ledger-accounts fetch — but the hook lived in the always-mounted dialog impl component, so closing/reopening the modal never re-ran it (only LoonasDialog's `open` prop toggled). Recovery actually came from the auto-retry the copy never mentioned, and on a terminal code the instruction was permanently dead.

**Why:** Both halves cost real review time: establishing that auto-retry is even on (nowhere documented), and tracing the mount lifetime to prove the instructed action was a no-op.

**How to apply:** When a diff renders copy over a failed fetch, (a) read swr-provider's `shouldRetryOnError` first; (b) trace which component owns the hook and whether the copy's suggested action (close/reopen, retry, reload) re-runs it — a modal toggle does not re-mount its hook owner; (c) require the copy to match the real mechanism, or expose `mutate` from the hook (typed `KeyedMutator`, mirror `useListCashCategories.refresh`) and wire the standard swallowed-retry button. See [[revalidate-swr-key-throws-in-catch]] for the swallow shape.
