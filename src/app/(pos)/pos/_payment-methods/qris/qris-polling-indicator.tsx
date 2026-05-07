"use client";

export function QrisPollingIndicator() {
  return (
    <div
      className="flex flex-row items-center gap-x-2 text-sm text-neutral-400"
      aria-live="polite"
    >
      <span className="size-2 animate-pulse rounded-full bg-primary-500" />
      <span>Menunggu pembayaran</span>
    </div>
  );
}
