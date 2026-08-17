"use client";

import { useState } from "react";
import { useGetUserStatus } from "@/features/user/presentation/hooks/use-get-user-status";
import { useOrganizationList } from "@clerk/nextjs";
import clsx from "clsx";

/**
 * The account switcher on the onboarding flow. Same defect family as QA F10: it used to swallow the
 * click twice — `if (!isLoaded) return;` discarded it with no pending state and no message, and
 * `setActive(...)` was called un-awaited with no `try/catch`, so a rejection became an invisible
 * unhandled promise rejection. Either way the user tapped and literally nothing happened.
 *
 * Follows the shape its sibling `SignOutAction` already uses: `await` inside `try/catch`, a pending
 * state that RENDERS rather than vanishes, `disabled` + `aria-busy` while pending, and an error line
 * on failure. Per CLAUDE.md, every branch of the handler either navigates or sets error state, and
 * never throws.
 *
 * The two `return null` guards below are correct and deliberate: an account SWITCHER genuinely has
 * nothing to offer when there is nothing to switch to, and `SignOutAction` is the unconditional exit
 * that must never vanish. Do not gate this component's escape-hatch sibling the same way.
 */
export function UseOtherAccountAction() {
  const { status } = useGetUserStatus();
  const { isLoaded, setActive } = useOrganizationList();
  const [isSwitching, setIsSwitching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    if (!isLoaded || isSwitching) return;
    setError(null);
    setIsSwitching(true);
    try {
      await setActive({ organization: null, redirectUrl: "/accounts" });
      // No success reset: `redirectUrl` navigates away, so "switching" is terminal here and
      // re-arming the button mid-navigation would only invite a second click.
    } catch {
      setIsSwitching(false);
      setError("Gagal berpindah akun. Silakan coba lagi.");
    }
  };

  if (!status) return null;
  if (status.approvedAccount.count === 0) return null;

  // Covers the discarded-click case: while Clerk is still loading the button is visibly pending
  // instead of silently ignoring a tap.
  const pending = !isLoaded || isSwitching;

  return (
    <div className="flex w-full flex-col items-center gap-y-1">
      <button
        type="button"
        disabled={pending}
        aria-busy={pending}
        onClick={onClick}
        className={clsx(
          // `text-primary-400` (#005ABB, 6.61:1), not `primary-300` (3.98:1 — fails AA for text),
          // and underlined by default rather than on hover only. Matches `SignOutAction`.
          "text-primary-400 hover:text-primary-500 w-full text-sm leading-5 underline",
          "appearance-none border-0 bg-transparent p-0",
          "focus-visible:ring-primary-300 rounded focus-visible:ring-2",
          pending && "cursor-not-allowed opacity-60",
        )}
      >
        {isSwitching ? "Berpindah akun..." : "Pakai Akun Lainnya"}
      </button>
      {error && (
        <span role="alert" className="text-xs leading-4 font-normal text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}
