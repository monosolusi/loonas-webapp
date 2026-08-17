"use client";

import clsx from "clsx";

type SelectFieldRetryButtonProps = {
  /** SWR's bound `mutate`. It triggers a REFETCH, so its promise rejects when the retry fails too. */
  onRetry: () => Promise<unknown>;
};

/**
 * Retry affordance for an onboarding select whose option list failed to load. Rendered as a sibling
 * BELOW the field rather than inside it, so `SelectInput`'s API does not have to grow a retry slot
 * for this one flow.
 *
 * An inline text button, not the `h-11` `SecondaryButton outlined` from CLAUDE.md's in-card error
 * pattern: that one is page/card-scoped, and five of them stacked under five address fields would be
 * visually heavy. The house form for an inline retry is sentence-case "Coba lagi" (see
 * `dashboard-range-*-error.tsx`, `trial-balance-drill-error.tsx`); title-case "Coba Lagi" is the
 * `SecondaryButton label` form. `text-primary-400` (#005ABB, 6.61:1), never `primary-300` (3.98:1,
 * which fails AA for text), and underlined by default rather than on hover only, since a user who
 * never hovers needs a non-color cue (WCAG 1.4.1).
 *
 * `text-xs leading-4` deliberately matches `SelectInput`'s own error/description typography so the
 * row lands on the existing rhythm. The `-my-1 py-1` pair lifts the hit box to ~24px tall WITHOUT
 * changing the layout box, clearing WCAG 2.2's 2.5.8 AA minimum; the 44px floor (2.5.5) is AAA in
 * WCAG 2.1 and CLAUDE.md exempts inline text links from the `h-11` rule anyway.
 */
export function SelectFieldRetryButton({ onRetry }: SelectFieldRetryButtonProps) {
  const onClick = () => {
    // A bound SWR `mutate()` triggers a refetch and defaults to `throwOnError: true`, so a bare
    // `onRetry()` on a still-failing list becomes an unhandled promise rejection — React does not
    // await onClick. Same mechanism as CLAUDE.md's `revalidateSWRKey()` rule. The catch needs no UI:
    // SWR repopulates `error` itself, so the field keeps its copy and this button stays on screen.
    void onRetry().catch(() => {});
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "text-primary-400 hover:text-primary-500 self-start text-xs leading-4 font-medium underline underline-offset-2 hover:no-underline",
        "-my-1 appearance-none border-0 bg-transparent px-0 py-1",
        "focus-visible:ring-primary-300 rounded focus-visible:ring-2",
      )}
    >
      Coba lagi
    </button>
  );
}
