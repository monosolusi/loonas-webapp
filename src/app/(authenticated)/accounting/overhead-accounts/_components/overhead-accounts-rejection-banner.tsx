"use client";

import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useOverheadAccounts } from "@/app/(authenticated)/accounting/overhead-accounts/_providers/overhead-accounts-provider";

export function OverheadAccountsRejectionBanner() {
  const { rejection, dismissRejection } = useOverheadAccounts();

  if (!rejection) return null;

  return (
    <div role="alert" className="flex items-start gap-x-3 rounded-lg border border-error-400 bg-error-50 px-4 py-3">
      <ExclamationTriangleIcon className="mt-0.5 size-4 shrink-0 text-error-400" aria-hidden="true" />
      <div className="flex-1">
        {rejection.kind === "not-selectable" ? (
          <>
            <p className="text-sm font-semibold text-error-500">
              Beberapa akun tidak dapat disimpan sebagai akun overhead
            </p>
            <ul className="mt-1 list-disc pl-4 text-sm text-error-500">
              {rejection.accounts.map((a) => (
                <li key={a.id}>
                  <span className="font-medium">
                    {a.code} — {a.name}
                  </span>
                  : {a.message}
                </li>
              ))}
            </ul>
            <p className="mt-1.5 text-xs text-error-400">Hapus akun tersebut dari daftar lalu simpan kembali.</p>
          </>
        ) : (
          <p className="text-sm text-error-500">{rejection.message}</p>
        )}
      </div>
      <button
        type="button"
        onClick={dismissRejection}
        aria-label="Tutup pesan"
        className="text-error-400 hover:text-error-500"
      >
        <XMarkIcon className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
