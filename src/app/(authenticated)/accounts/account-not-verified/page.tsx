"use client";

import React from "react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { CheckBadgeIcon, UserIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useSelectedAccountProvider } from "@/features/authentication/presentation/providers/selected-account";
import { PageContent } from "@/core/presentations/components/page-content";
import clsx from "clsx";

export default function AccountNotVerifiedPage() {
  const { selectedAccount } = useSelectedAccountProvider();

  return (
    <PageContent>
      <div className="flex h-full w-full items-center justify-center">
        <div className="mx-auto max-w-lg">
          <h2 className="text-base font-semibold text-gray-900">Akun Kamu Sedang Diverifikasi</h2>
          <p className="mt-1 text-sm text-gray-500">
            Akun kamu saat ini sedang dalam proses verifikasi agar nantinya bisa digunakan untuk membuat faktur digital
            secara aman. Kamu bisa pantau status verifikasi dengan memilih tombol Cek Status di bawah ini. Setelah
            proses verifikasi selesai, kami akan langsung informasikan lewat email, ya.
          </p>
          <ul role="list" className="mt-6 divide-y divide-gray-200 border-t border-b border-gray-200">
            <li className="group">
              <div className="group relative flex items-start space-x-3 py-4">
                <div className="mt-1 shrink-0">
                  <span
                    className={clsx(
                      "group-data-[disabled=true]:grayscale",
                      "bg-primary-default",
                      "inline-flex size-10 items-center justify-center rounded-lg",
                    )}
                  >
                    <CheckBadgeIcon aria-hidden="true" className="size-6 text-white" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900 group-data-[disabled=true]:text-gray-400">
                    <Link href={`/accounts/${selectedAccount?.id}/verifications`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      Cek Status Verifikasi
                    </Link>
                  </div>
                  <p className="text-sm text-gray-500 group-data-[disabled=true]:text-gray-400">
                    Pengen tahu status terbaru akunmu? Klik tombol ini buat ngecek status verifikasi akun kamu sekarang
                    juga. Kami akan selalu update status verifikasimu secara real-time di halaman ini.
                  </p>
                </div>
                <div className="shrink-0 self-center">
                  <ChevronRightIcon
                    aria-hidden="true"
                    className="size-5 text-gray-400 group-data-[disabled=false]-hover:text-gray-500"
                  />
                </div>
              </div>
            </li>
            <li className="group">
              <div className="group relative flex items-start space-x-3 py-4">
                <div className="mt-1 shrink-0">
                  <span className="inline-flex size-10 items-center justify-center rounded-lg bg-green-600">
                    <UserIcon aria-hidden="true" className="size-6 text-white" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900 group-data-[disabled=true]:text-gray-400">
                    <Link href="/accounts/create">
                      <span aria-hidden="true" className="absolute inset-0" />
                      Tambah Akun Baru
                    </Link>
                  </div>
                  <p className="text-sm text-gray-500 group-data-[disabled=true]:text-gray-400">
                    Perlu tambah akun baru untuk kelola faktur digital lainnya? Kamu bisa tambahkan akun tambahan dengan
                    mudah lewat tombol Tambah Akun di bawah ini.
                  </p>
                </div>
                <div className="shrink-0 self-center">
                  <ChevronRightIcon
                    aria-hidden="true"
                    className="size-5 text-gray-400 group-data-[disabled=false]-hover:text-gray-500"
                  />
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </PageContent>
  );
}
