/**
 * Classifies whether an Enter-terminated keystroke burst in the POS product picker was
 * produced by a barcode scanner or by a human typing.
 *
 * A barcode scanner emits every character of a code plus the terminating Enter in roughly
 * 10-50ms total — an order of magnitude faster than the fastest sustained human typing. That
 * speed gap is the only signal this module uses.
 *
 * Pure: the caller supplies every keystroke's timestamp (React's `KeyboardEvent.timeStamp`),
 * so this module never touches the clock and stays deterministic under test.
 */

/** Max gap (ms) between two consecutive keystrokes — including the final gap into Enter — to
 *  still count as scanner-speed. Comfortably above real scanner jitter, comfortably below the
 *  fastest plausible human inter-keystroke interval. */
const MAX_SCANNER_GAP_MS = 35;

/** Minimum number of character keystrokes (excluding the terminating Enter) required to call a
 *  burst a scan. Guards against a human's rare sub-threshold double-keystroke reading as one. */
const MIN_SCAN_LENGTH = 3;

export type KeystrokeSample = {
  /** True only for the terminating Enter keystroke; false for every character keystroke. */
  isEnter: boolean;
  /** React `KeyboardEvent.timeStamp` (ms) — monotonic, not wall-clock. */
  timeStamp: number;
};

export type CommitClassification =
  /** Consecutive gaps all at or under the scanner threshold, terminated by Enter. */
  | "scanner"
  /** Terminated by Enter, but too slow (or too short) to be a scan — ordinary human typing. */
  | "human"
  /** Not terminated by Enter — there is no commit to classify yet. */
  | "incomplete";

/**
 * `keystrokes` is the ordered sequence of samples that make up one typed-then-committed burst:
 * zero or more character samples followed by the terminating Enter sample as the LAST entry.
 */
export function classifyCommit(keystrokes: KeystrokeSample[]): CommitClassification {
  if (keystrokes.length === 0) return "incomplete";

  const last = keystrokes[keystrokes.length - 1];
  if (!last.isEnter) return "incomplete";

  const characterCount = keystrokes.length - 1;
  if (characterCount < MIN_SCAN_LENGTH) return "human";

  for (let i = 1; i < keystrokes.length; i += 1) {
    const gap = keystrokes[i].timeStamp - keystrokes[i - 1].timeStamp;
    if (gap < 0 || gap > MAX_SCANNER_GAP_MS) return "human";
  }

  return "scanner";
}
