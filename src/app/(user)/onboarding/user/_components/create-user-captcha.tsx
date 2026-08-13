"use client";

import React from "react";
import clsx from "clsx";

/**
 * Hosts `#clerk-captcha` — the ONLY place this node exists. Clerk injects its Turnstile
 * challenge into it at `signUp.create()` click time, not on page load, so the container must
 * always be mounted and must NEVER be visually hidden (a hidden container can fail to
 * render/measure the widget).
 *
 * Clerk injects a container into `#clerk-captcha` on EVERY submit — including the invisible /
 * not-flagged path most legitimate users hit — so "a mutation happened" is not the same signal
 * as "a visible challenge appeared". We watch the container's rendered HEIGHT via
 * ResizeObserver instead: only a non-zero height means a real, visible challenge was mounted.
 * A zero-height resize (or none at all) means the invisible path succeeded silently, and we
 * must keep observing rather than disconnect, since Turnstile can grow the node later via style
 * after first injecting it at 0 height.
 */
export function CreateUserCaptcha() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [challengeVisible, setChallengeVisible] = React.useState(false);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const becameVisible = entries.some((entry) => entry.contentRect.height > 0);
      if (!becameVisible) return; // invisible path — keep observing, the widget may grow later

      setChallengeVisible(true);
      container.scrollIntoView({ block: "center", behavior: "smooth" });
      observer.disconnect();
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Always mounted so the live region exists before its content changes — an aria-live
          element that arrives in the same commit as its text is generally not announced. The
          gap to the container below is applied only once there's text, so there's no dead
          space while the region is empty (never hide it — that removes it from the a11y tree). */}
      <p aria-live="polite" className={clsx("text-xs leading-4 text-neutral-300", challengeVisible && "mb-2")}>
        {challengeVisible ? "Selesaikan verifikasi keamanan di bawah ini untuk melanjutkan." : null}
      </p>
      <div ref={containerRef} id="clerk-captcha" data-cl-theme="light" data-cl-language="id" />
    </div>
  );
}
