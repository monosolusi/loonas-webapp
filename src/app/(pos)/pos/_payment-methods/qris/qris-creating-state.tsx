"use client";

export function QrisCreatingState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-y-4 px-6 py-10">
      <div className="size-48 animate-pulse rounded-lg bg-neutral-100" />
      <div className="text-sm text-neutral-300">Membuat kode QR…</div>
    </div>
  );
}
