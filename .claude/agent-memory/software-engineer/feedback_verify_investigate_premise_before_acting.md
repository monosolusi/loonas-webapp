---
name: verify-investigate-premise-before-acting
description: A brief's factual claim about a specific file (e.g. "file X imports hook Y") can be wrong — grep-verify before acting on an "investigate" instruction, don't assume the premise
metadata:
  type: feedback
---

An EL/orchestrator brief asserted that `_components/next-button.tsx` (the SHARED display
component in `onboarding/account/_components/`) "imports the personal hook — which would throw
for a business account," and asked me to investigate/rewire it. Grepping its actual imports
showed it only imports `PrimaryButton`, `Image`, and `React` — no hook import at all. The hook
import lived in the SIMILARLY-NAMED but different file `@personalAccount/_components/
personal-next-button.tsx`, which already correctly wraps the shared `NextButton` display
component. The brief's premise was simply wrong (likely conflated the two files by name).

**Why:** acting on the stated premise without checking would have meant "fixing" a component that
had no bug, or worse, coupling the shared display component to a feature-specific hook it never
needed.

**How to apply:** whenever a brief says "investigate whether file X does/imports Y" as a
sub-task, grep the actual file's imports FIRST before writing any fix — do not assume the premise
is correct just because it's specific and detailed. If the grep contradicts the brief, report the
correction plainly in the completion report rather than silently either fixing a non-bug or
skipping the investigation. Same discipline as [[feedback_second_instance_means_extract]]
("grep a rule's literal strings/routes before claiming single ownership") — briefs, like code
comments, can be stale or mistaken, and grep is the check.
