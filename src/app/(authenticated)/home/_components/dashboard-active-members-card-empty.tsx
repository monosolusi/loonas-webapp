"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { UsersIcon } from "@heroicons/react/24/outline";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";

type DashboardActiveMembersCardEmptyProps = {
  accountId: string;
};

export function DashboardActiveMembersCardEmpty({ accountId }: DashboardActiveMembersCardEmptyProps) {
  const router = useRouter();

  return (
    <div
      className={clsx(
        "flex flex-col gap-y-3 rounded-xl border border-t border-r border-b-4 border-l border-neutral-100 bg-neutral-50 p-5",
      )}
    >
      <div className="flex items-center gap-2 text-neutral-300">
        <UsersIcon className="size-5 shrink-0" />
        <span className="text-sm leading-5">Anggota Aktif</span>
      </div>
      <p className="text-sm text-neutral-300">Belum ada anggota tim.</p>
      <div className="w-fit">
        <PrimaryButton label="Undang anggota" onClick={() => router.push(`/accounts/${accountId}`)} />
      </div>
    </div>
  );
}
