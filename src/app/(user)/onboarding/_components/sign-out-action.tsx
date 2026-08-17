"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import clsx from "clsx";

/**
 * The one exit that must never depend on account/verification state. Every other escape hatch on
 * the onboarding flow (`UseOtherAccountAction`) is correctly gated on having at least one approved
 * account to switch to — but that meant a user whose only account was still awaiting KYC had *no*
 * way out at all, since the onboarding layout renders no header/nav. This component renders
 * whenever the user is signed in, full stop: it must never read `approvedAccount.count` or any
 * other verification signal, and it must never `return null` for a signed-in user — a vanishing
 * escape hatch is exactly what shipped last time.
 */
export function SignOutAction() {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    if (!isLoaded || isSigningOut) return;
    setError(null);
    setIsSigningOut(true);
    try {
      await signOut({ redirectUrl: "/sign-in" });
    } catch {
      // Never let an async handler throw — React does not await onClick, so a throw here would
      // become an invisible unhandled rejection. Surface it instead and let the user retry.
      setIsSigningOut(false);
      setError("Gagal keluar. Silakan coba lagi.");
    }
  };

  // Nothing to sign out of once we know for certain there is no session.
  if (isLoaded && !isSignedIn) return null;

  const pending = !isLoaded || isSigningOut;

  return (
    <div className="flex w-full flex-col items-center gap-y-1">
      <button
        type="button"
        disabled={pending}
        aria-busy={pending}
        onClick={onClick}
        className={clsx(
          "w-full text-sm leading-5 text-primary-400 underline hover:text-primary-500",
          "appearance-none border-0 bg-transparent p-0",
          "focus-visible:ring-2 focus-visible:ring-primary-300 rounded",
          pending && "cursor-not-allowed opacity-60",
        )}
      >
        {isSigningOut ? "Sedang keluar..." : "Keluar & masuk dengan akun lain"}
      </button>
      {error && (
        <span role="alert" className="text-xs leading-4 font-normal text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}
