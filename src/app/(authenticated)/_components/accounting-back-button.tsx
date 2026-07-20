"use client";

import Image from "next/image";
import clsx from "clsx";
import { useRouter } from "next/navigation";

/**
 * "Kembali ke Menu Utama" — the exit affordance pinned at the top of the
 * Akuntansi sidebar. Deliberately styled as a bordered neutral control, distinct
 * from the blue-wash navigation items below it, so leaving the workspace never
 * reads as "just another menu link" (and never competes for Lunas Blue, the One
 * Signal). Mirrors the POS shell's neutral outlined exit (`SecondaryButton
 * outlined` → `/home`), adapted to the sidebar. The two-tier label keeps the full
 * phrase on one line (it wraps as a single string in the 256px rail); the arrow
 * eases left on hover to signal the way back.
 */
export function AccountingBackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/home")}
      aria-label="Kembali ke Menu Utama"
      className={clsx(
        "group flex h-11 w-full cursor-pointer items-center gap-x-2.5 rounded-lg px-3",
        "border border-neutral-100 bg-neutral-50",
        "transition-colors duration-200",
        "hover:border-neutral-200 hover:bg-neutral-100/40",
        "focus-visible:border-primary-300 focus-visible:ring-2 focus-visible:ring-primary-300/20 focus-visible:outline-none",
      )}
    >
      <Image
        src="/assets/images/arrow-left-icon-neutral-500-w16-h16.svg"
        alt=""
        width={16}
        height={16}
        aria-hidden
        className="shrink-0 transition-transform duration-200 ease-out group-hover:-translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none"
      />
      <span className="flex flex-col text-left">
        <span className="text-xs leading-4 font-medium text-neutral-300">Kembali ke</span>
        <span className="text-sm leading-5 font-semibold text-neutral-500">Menu Utama</span>
      </span>
    </button>
  );
}
