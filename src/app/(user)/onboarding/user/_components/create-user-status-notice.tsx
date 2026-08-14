"use client";

import React from "react";
import { ClockIcon } from "@heroicons/react/20/solid";
import { useCreateUser } from "@/app/(user)/onboarding/user/_providers/create-user";
import { resolveWaitPhase } from "@/app/(user)/onboarding/user/_utils/submit-wait-phase";

const TICK_MS = 1_000;

const SLOW_TEXT = "Proses ini butuh waktu sedikit lebih lama dari biasanya. Mohon tunggu sebentar.";

// Deliberately uncertain — we genuinely don't know whether `signUp.create()`/`setActive()` are
// still pending or already succeeded server-side with the response lost. Asserting either
// outcome here would be a lie in one of the two cases. Do not tighten this hedge.
const STALLED_TEXT_PREFIX =
  "Proses ini memakan waktu lebih lama dari biasanya. Akun Anda mungkin sudah berhasil dibuat di latar belakang.";
const STALLED_TEXT_SUFFIX = "untuk melihat status terbaru.";
const RELOAD_LINK_TEXT = "Muat ulang halaman";

/**
 * Below-button, elapsed-time-driven notice. Distinct from `CreateUserButton`'s own
 * `loadingLabel` ("Memproses...") — that stays constant through this notice's slow/stalled
 * escalation on purpose (see the resolver's doc comment), so there's exactly one place that
 * explains "why is this slow".
 */
export function CreateUserStatusNotice() {
  const { status } = useCreateUser();
  const [elapsedMs, setElapsedMs] = React.useState(0);

  React.useEffect(() => {
    if (status !== "submitting") {
      setElapsedMs(0);
      return;
    }

    const startedAt = Date.now();
    const intervalId = setInterval(() => setElapsedMs(Date.now() - startedAt), TICK_MS);
    return () => clearInterval(intervalId);
  }, [status]);

  // Both notices clear the instant a real outcome arrives — `phase` collapses to "none" the
  // moment `status` leaves "submitting", regardless of how long `elapsedMs` had climbed.
  const phase = status === "submitting" ? resolveWaitPhase(elapsedMs) : "none";

  // Unmounted for "idle" — the pre-submit page — so it contributes no flex gap/height before the
  // user has ever clicked "Buat User". `SubmitStatus` never returns to "idle" once left, so this
  // check flips at most once: from that point on the slow-caption `<p>` below stays mounted (even
  // between retries) so its content updates are announced as changes to an EXISTING live region
  // rather than a region appearing with content already in the same commit, which some assistive
  // tech misses (same reasoning as `CreateUserCaptcha`'s always-mounted `<p aria-live>`). The
  // stalled card is safe to mount/unmount freely — `role="status"` is designed to be announced on
  // insertion, unlike a bare `aria-live` region.
  if (status === "idle") return null;

  return (
    <>
      <p aria-live="polite" className="text-center text-xs leading-4 text-neutral-300">
        {phase === "slow" ? SLOW_TEXT : null}
      </p>
      {phase === "stalled" && (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="border-warning-400 bg-warning-50 flex flex-row items-start gap-3 rounded-lg border p-4"
        >
          <ClockIcon aria-hidden="true" className="text-warning-500 mt-0.5 size-5 shrink-0" />
          <p className="text-warning-500 text-sm leading-5 font-normal">
            {STALLED_TEXT_PREFIX}{" "}
            <a href="/onboarding/user" className="text-primary-400 underline">
              {RELOAD_LINK_TEXT}
            </a>{" "}
            {STALLED_TEXT_SUFFIX}
          </p>
        </div>
      )}
    </>
  );
}
