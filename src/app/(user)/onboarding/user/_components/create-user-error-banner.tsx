"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCreateUser } from "@/app/(user)/onboarding/user/_providers/create-user";

export function CreateUserErrorBanner() {
  const { error } = useCreateUser();
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (error) wrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [error]);

  // Always-mounted wrapper (mirrors `onboarding/account/@personalAccount/_components/submit-error-banner.tsx`)
  // so the live region exists before its content changes, not in the same commit as it.
  return (
    <div ref={wrapperRef} role="alert" aria-live="polite">
      {error && (
        <div className="border-error-100 bg-error-50 flex flex-row gap-3 rounded-lg border p-4">
          <Image src="/assets/images/exclamation-circle-w20-h20.svg" alt="" aria-hidden="true" width={20} height={20} />
          <span className="text-error-500 text-base">
            {error.kind === "email-exists" ? (
              // Keep verbatim to EMAIL_EXISTS_MESSAGE in classify-submit-error.ts — "Masuk ke akun
              // Anda" is hyperlinked here as the call to action.
              <>
                Email ini sudah terdaftar.{" "}
                <Link href="/sign-in" className="text-primary-400 hover:text-primary-500 underline">
                  Masuk ke akun Anda
                </Link>
                , atau gunakan email lain untuk mendaftar.
              </>
            ) : (
              error.message
            )}
          </span>
        </div>
      )}
    </div>
  );
}
