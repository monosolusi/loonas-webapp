---
name: didinitref-pattern
description: Ref-based initial-mount-suppression pattern is the in-repo blueprint for one-shot effects under React 19 StrictMode
metadata:
  type: project
---

The canonical pattern for "fire this effect on change but NOT on initial mount" lives in `src/app/(authenticated)/home/_providers/dashboard-range-provider.tsx` (`didInitRef`). Mirror it for new one-shot effects.

Variant for change-fires-on-diff (prev-value guard):
```ts
const prevRef = useRef<T | null>(null);
useEffect(() => {
  if (prevRef.current === null) { prevRef.current = value; return; }
  if (deepEqual(prevRef.current, value)) return; // StrictMode re-run safety
  prevRef.current = value;
  doTheThing();
}, [value]);
```

Variant for one-shot-per-key (Set-based dedupe):
```ts
const seenRef = useRef<Set<string>>(new Set());
useEffect(() => {
  const key = computeKey(...);
  if (seenRef.current.has(key)) return;
  seenRef.current.add(key);
  fireOnce();
}, [deps]);
```

**Why:** React 19 StrictMode double-invokes effects in dev. A naked `useEffect([dep])` will fire twice on mount AND once per dep change, both of which break "fire only on user-driven change" semantics. Refs sidestep this without changing render output.

**How to apply:** Any time the requirement is "fire once on N" or "fire on change after mount", reach for these two variants first. State-based equivalents trigger re-renders for no UI reason — refs are strictly better here.
