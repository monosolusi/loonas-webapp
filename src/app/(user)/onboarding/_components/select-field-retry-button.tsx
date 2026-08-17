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
 * An inline text link, not the `h-11` `SecondaryButton outlined "Coba Lagi"` from CLAUDE.md's
 * in-card error pattern: that one is page/card-scoped, and five of them stacked under five address
 * fields would be visually heavy. CLAUDE.md exempts inline text links from the `h-11` rule, and the
 * 44px target floor (WCAG 2.5.5) is AAA in WCAG 2.1 — so the ~32px target `py-2` yields still meets
 * the AA bar PRODUCT.md sets. `text-primary-400` (#005ABB, 6.61:1), never `primary-300` (3.98:1,
 * fails AA for text), and underlined by default rather than on hover only, since a user who never
 * hovers needs a non-color cue (WCAG 1.4.1).
 */
export function SelectFieldRetryButton({ onRetry }: SelectFieldRetryButtonProps) {
  const onClick = () => {
    // React does not await onClick, so letting this reject would be an invisible unhandled
    // rejection. Swallowing is correct here and not a silent failure: a retry that fails again
    // leaves the hook's `error` set, so the field keeps showing its "Gagal memuat..." copy and this
    // button stays on screen for another attempt.
    void onRetry().catch(() => {});
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "text-primary-400 hover:text-primary-500 self-start text-xs font-medium underline",
        "appearance-none border-0 bg-transparent px-0 py-2",
        "focus-visible:ring-primary-300 rounded focus-visible:ring-2",
      )}
    >
      Coba Lagi
    </button>
  );
}
