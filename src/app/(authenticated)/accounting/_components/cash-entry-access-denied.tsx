"use client";

export function CashEntryAccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4 py-24">
      <div className="flex flex-col items-center gap-y-1 text-center">
        <p className="text-base font-semibold text-neutral-400">Anda tidak memiliki akses ke fitur Kas Masuk & Kas Keluar.</p>
        <p className="max-w-sm text-sm text-neutral-300">Fitur ini tidak tersedia untuk akun Anda.</p>
      </div>
    </div>
  );
}