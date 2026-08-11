import { useEffect, useState } from "react";

/**
 * Remembers the last non-null value it was handed.
 *
 * For dialog bodies. `LoonasDialog` wraps a Headless UI `Dialog` whose panel
 * stays mounted for the ~200ms `data-leave` transition, but the parent nulls the
 * entity the instant it closes — so the body renders one final pass with nothing
 * to render from, and its content visibly empties while the panel is still
 * fading. Latching the entity keeps the closing dialog showing what the user was
 * just looking at.
 *
 * Returns the current value when there is one, so a newly-arrived value is
 * available on the same render rather than a frame late.
 */
export function useLatchedValue<T>(value: T | null): T | null {
  const [latched, setLatched] = useState<T | null>(value);

  useEffect(() => {
    if (value !== null) setLatched(value);
  }, [value]);

  return value ?? latched;
}
