"use client";

import Image from "next/image";
import Link from "next/link";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";

export function FixedCostEmptyState() {
  return (
    <div className="flex flex-col items-center rounded-xl border border-neutral-100 px-6 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary-50 text-primary-300">
        <BanknotesIcon className="size-6" />
      </div>
      <h2 className="mt-4 text-base font-semibold text-neutral-500">Belum ada jenis biaya tetap</h2>
      <p className="mt-1 max-w-md text-sm text-neutral-300">
        Buat jenis biaya tetap terlebih dahulu — seperti sewa tempat atau gaji karyawan — sebelum mengisi data biaya
        bulanan.
      </p>
      <Link href="/settings/fixed-costs" className="mt-6">
        <PrimaryButton
          label="Tambah Biaya Tetap"
          leftIcon={<Image src="/assets/images/plus-icon-white-w16-h16.svg" alt="" width={16} height={16} />}
          className="w-auto px-6"
        />
      </Link>
    </div>
  );
}
