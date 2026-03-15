"use client";

import { useMemo } from "react";
import { AccountCard } from "@/app/(authenticated)/accounts/_components/account-card";
import { InvitationCard } from "@/app/(authenticated)/accounts/_components/invitation-card";
import { useListAccount } from "@/features/account/presentation/hooks/use-list-account";
import { AddAccountCard } from "@/app/(authenticated)/accounts/_components/add-account-card";

export default function AccountManagementPage() {
  const { accounts } = useListAccount();

  const { activeAccounts, pendingInvitations } = useMemo(() => {
    if (!accounts) return { activeAccounts: [], pendingInvitations: [] };
    return {
      activeAccounts: accounts.filter((a) => !a.membership || a.membership.isOwner || a.membership.isAccepted),
      pendingInvitations: accounts.filter((a) => a.membership && !a.membership.isOwner && a.membership.isPending),
    };
  }, [accounts]);

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex flex-col gap-y-2">
        <div className="text-3xl leading-9 font-bold tracking-tight">Daftar Akun</div>
        <div className="leading-6 text-neutral-300">
          Lihat ringkasan dan kelola semua akun yang terhubung dengan profil Anda di sini.
        </div>
      </div>

      {pendingInvitations.length > 0 && (
        <div className="flex flex-col gap-y-4">
          <h3 className="text-sm font-semibold text-neutral-300">Undangan Menunggu</h3>
          <div className="flex w-full flex-row flex-wrap gap-6">
            {pendingInvitations.map((account) => (
              <InvitationCard key={account.id} account={account} />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-y-4">
        {pendingInvitations.length > 0 && (
          <h3 className="text-sm font-semibold text-neutral-300">Akun Anda</h3>
        )}
        <div className="flex w-full flex-row flex-wrap gap-6">
          <AddAccountCard />
          {activeAccounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      </div>
    </div>
  );
}
