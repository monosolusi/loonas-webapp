"use client";

type SelectFieldAnnouncerProps = {
  /** The message `SelectInput` is currently rendering — its `error`, else its `description`. */
  message?: string;
};

/**
 * Announces an onboarding select's current message to assistive tech. A select's option list loads
 * asynchronously and can fail long after the user has moved past the field, so the outcome has to
 * reach them without re-navigating back to it.
 *
 * Two deliberate choices:
 *
 * - **Always mounted, never conditionally rendered.** A live region inserted into the DOM in the same
 *   commit as its content is announced unreliably; the region has to exist first and be filled after.
 *   Callers pass `undefined` for "nothing to say", they do not skip rendering this.
 * - **Scoped to the message text, not the field row.** Putting `aria-live` on the row that holds the
 *   `<select>` would place the option list inside the live region, so replacing an empty list with 38
 *   provinces would read all 38 aloud. This mirrors the copy `SelectInput` shows visually instead.
 *
 * `sr-only` is absolutely positioned, so this is not a flex item and contributes no `gap` — the
 * field's layout is unchanged whether or not there is a message.
 */
export function SelectFieldAnnouncer({ message }: SelectFieldAnnouncerProps) {
  return (
    <span aria-live="polite" className="sr-only">
      {message ?? ""}
    </span>
  );
}
