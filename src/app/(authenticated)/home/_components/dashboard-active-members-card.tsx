"use client";

import clsx from "clsx";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { UsersIcon } from "@heroicons/react/24/outline";
import { useListMembers } from "@/features/member/presentations/hooks/use-list-members";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";
import { DashboardActiveMembersCardLoading } from "@/app/(authenticated)/home/_components/dashboard-active-members-card-loading";
import { DashboardActiveMembersCardError } from "@/app/(authenticated)/home/_components/dashboard-active-members-card-error";
import { DashboardActiveMembersCardEmpty } from "@/app/(authenticated)/home/_components/dashboard-active-members-card-empty";

export function DashboardActiveMembersCard() {
  const router = useRouter();
  const { members, loading: membersLoading, error: membersError } = useListMembers();
  const { account, loading: accountLoading } = useGetCurrentAccount();

  const activeCount = useMemo(() => {
    if (!members) return 0;
    return members.filter((m) => m.isAccepted).length;
  }, [members]);

  if (membersLoading || accountLoading) {
    return <DashboardActiveMembersCardLoading />;
  }

  if (membersError) {
    return <DashboardActiveMembersCardError />;
  }

  if (!account) {
    return <DashboardActiveMembersCardLoading />;
  }

  if (members?.length === 0) {
    return <DashboardActiveMembersCardEmpty accountId={account.id} />;
  }

  return (
    <div
      onClick={() => router.push(`/accounts/${account.id}`)}
      className={clsx(
        "flex cursor-pointer flex-col gap-y-3 rounded-xl border border-t border-r border-b-4 border-l border-neutral-100 bg-neutral-50 p-5",
        "hover:border-neutral-200 hover:bg-white",
        "transition-colors duration-150",
      )}
    >
      <div className="flex items-center gap-2 text-neutral-300">
        <UsersIcon className="size-5 shrink-0" />
        <span className="text-sm leading-5">Anggota Aktif</span>
      </div>
      <span className="text-2xl leading-8 font-bold tracking-tight text-neutral-500">{activeCount}</span>
    </div>
  );
}
