"use client";

import clsx from "clsx";
import { SELECT_FIELD_COPY } from "@/app/(user)/onboarding/_utils/select-field-copy";

type SelectFieldRetryButtonProps = {
  /** `"hidden"` is handled by the caller not rendering this at all. */
  state: "available" | "pending";
  /** SWR's bound `mutate`. It triggers a REFETCH, so its promise rejects when the retry fails too. */
  onRetry: () => Promise<unknown>;
};

/**
 * Retry affordance for an onboarding select whose option list failed to load. Rendered as a sibling
 * BELOW the field rather than inside it, so `SelectInput`'s API does not have to grow a retry slot
 * for this one flow.
 *
 * **`"pending"` stays mounted and disabled rather than unmounting.** The earlier version disappeared
 * the moment the retry started — while focused, which drops focus to `<body>` and makes a keyboard
 * user re-navigate the whole step to get back. It also contradicted the "a pending state renders
 * rather than vanishes" rule that `sign-out-action.tsx` and `use-other-account-action.tsx` follow one
 * directory over. The pending state carries its own label, because a bare disabled button says
 * nothing about what is happening.
 *
 * An inline text button, not the `h-11` `SecondaryButton outlined` from CLAUDE.md's in-card error
 * pattern: that one is page/card-scoped, and five stacked under five address fields would be
 * visually heavy. `text-primary-400` (#005ABB, 6.61:1), never `primary-300` (3.98:1, which fails AA
 * for text), underlined by default rather than on hover only (a user who never hovers needs a
 * non-color cue, WCAG 1.4.1). `text-xs leading-4` matches `SelectInput`'s own message typography so
 * the row lands on the existing rhythm, and the `-my-1 py-1` pair lifts the hit box to ~24px tall
 * WITHOUT changing the layout box, clearing WCAG 2.2's 2.5.8 AA minimum; the 44px floor (2.5.5) is
 * AAA in WCAG 2.1 and CLAUDE.md exempts inline text links from the `h-11` rule anyway.
 *
 * The pending state recedes by colour, not `opacity` — same rule as the disabled select and the
 * unselectable nationality card: `text-neutral-300` is 11.9:1, where any opacity fade on white
 * would drop the label under the AA floor.
 */
export function SelectFieldRetryButton({ state, onRetry }: SelectFieldRetryButtonProps) {
  const pending = state === "pending";

  const onClick = () => {
    if (pending) return;
    // A bound SWR `mutate()` triggers a refetch and defaults to `throwOnError: true`, so a bare
    // `onRetry()` on a still-failing list becomes an unhandled promise rejection — React does not
    // await onClick. Same mechanism as CLAUDE.md's `revalidateSWRKey()` rule. Swallowing is correct
    // for the UI (SWR repopulates `error`, so the field keeps its copy and this button stays on
    // screen) but the failure should not be undiagnosable — log the raw error object, never
    // `JSON.stringify`, which yields `{}` for a native Error since `message`/`stack` are
    // non-enumerable.
    void onRetry().catch((error) => {
      console.error("Failed to reload an onboarding select option list", error);
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-busy={pending}
      className={clsx(
        "self-start text-xs leading-4 font-medium",
        "-my-1 appearance-none border-0 bg-transparent px-0 py-1",
        "focus-visible:ring-primary-300 rounded focus-visible:ring-2",
        pending
          ? "cursor-not-allowed text-neutral-300 no-underline"
          : "text-primary-400 hover:text-primary-500 underline underline-offset-2 hover:no-underline",
      )}
    >
      {pending ? SELECT_FIELD_COPY.retryPending : SELECT_FIELD_COPY.retry}
    </button>
  );
}
