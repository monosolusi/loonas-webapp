"use client";

import React from "react";

/**
 * Hosts `#clerk-captcha` — the ONLY place this node exists. Clerk injects its Turnstile
 * challenge into it at `signUp.create()` click time, not on page load, so the container must
 * always be mounted and must NEVER be visually hidden (a hidden container can fail to
 * render/measure the widget). We detect the injection via MutationObserver and reveal a hint +
 * scroll the challenge into view so it can't be missed below the fold.
 */
export function CreateUserCaptcha() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [challengeVisible, setChallengeVisible] = React.useState(false);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new MutationObserver(() => {
      setChallengeVisible(true);
      container.scrollIntoView({ block: "center", behavior: "smooth" });
      observer.disconnect();
    });

    observer.observe(container, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {challengeVisible && (
        <p aria-live="polite" className="text-xs leading-4 text-neutral-300">
          Selesaikan verifikasi keamanan di bawah ini untuk melanjutkan.
        </p>
      )}
      <div ref={containerRef} id="clerk-captcha" data-cl-theme="light" data-cl-language="id" />
    </div>
  );
}
