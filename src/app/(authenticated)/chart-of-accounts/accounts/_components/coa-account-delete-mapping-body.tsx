"use client";

import Link from "next/link";

type CoaAccountDeleteMappingBodyProps = {
  accountName: string;
  accountCode: string;
};

export function CoaAccountDeleteMappingBody({ accountName }: CoaAccountDeleteMappingBodyProps) {
  return (
    <div className="flex flex-col gap-y-3">
      <p className="text-sm font-semibold text-neutral-500">Akun ini tidak dapat dihapus.</p>
      <p className="text-sm text-neutral-400">
        Akun &ldquo;{accountName}&rdquo; digunakan dalam Pemetaan Akun. Perbarui pemetaan akun terlebih dahulu sebelum
        menghapus akun ini.
      </p>
      <Link
        href="/chart-of-accounts/mappings"
        className="text-sm text-primary-300 underline hover:text-primary-500"
      >
        Buka Pemetaan Akun
      </Link>
    </div>
  );
}
