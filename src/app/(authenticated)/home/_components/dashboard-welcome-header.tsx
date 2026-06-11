"use client";

import Image from "next/image";
import { DateTime } from "luxon";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";

export function DashboardWelcomeHeader() {
  const { account, loading } = useGetCurrentAccount();
  const today = DateTime.now().setLocale("id").toFormat("dd MMMM yyyy");

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-500">
          Selamat Datang,{" "}
          {loading ? <span className="inline-block h-7 w-32 animate-pulse rounded bg-neutral-100" /> : account?.fullName}{" "}
          👋
        </h1>
        <p className="text-sm text-neutral-300">Berikut ringkasan keuangan bisnis Anda hari ini.</p>
      </div>
      <div className="flex items-center gap-x-2 rounded-lg bg-neutral-50 px-3 py-2">
        <Image src="/assets/images/calendar-icon-neutral-400-w16-h16.svg" alt="" width={16} height={16} />
        <span className="text-sm text-neutral-400">{today}</span>
      </div>
    </div>
  );
}
