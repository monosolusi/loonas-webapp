"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";

export function PosExitButton() {
  const router = useRouter();
  const goHome = () => router.push("/home");
  const icon = (
    <Image src="/assets/images/sign-out-icon-neutral-500-w16-h16.svg" alt="" width={16} height={16} aria-hidden />
  );

  return (
    <>
      {/* Full label — sm and up, where the top bar has room for it. */}
      <div className="hidden sm:block">
        <SecondaryButton outlined label="Keluar POS" leftIcon={icon} className="w-auto px-4 text-sm" onClick={goHome} />
      </div>

      {/* Icon-only — below sm, mirrors SecondaryButton's outlined styling. */}
      <button
        type="button"
        onClick={goHome}
        aria-label="Keluar POS"
        className="flex size-9 items-center justify-center rounded-md border-2 border-neutral-100 text-neutral-500 transition-colors duration-200 hover:bg-neutral-100/10 sm:hidden"
      >
        {icon}
      </button>
    </>
  );
}
