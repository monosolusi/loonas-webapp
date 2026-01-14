"use client";

import { AccountCard } from "@/app/(authenticated)/accounts/_components/account-card";
import { useListAccount } from "@/features/account/presentation/hooks/use-list-account";
import { AddAccountCard } from "@/app/(authenticated)/accounts/_components/add-account-card";

export default function AccountManagementPage() {
  const { accounts } = useListAccount();

  return (
    <div className="flex flex-col gap-y-8">
      {/*  Header Title & Description */}
      <div className="flex flex-col gap-y-2">
        <div className="text-3xl leading-9 font-bold tracking-tight">Daftar Akun</div>
        <div className="leading-6 text-neutral-300">
          Lihat ringkasan dan kelola semua akun yang terhubung dengan profil Anda di sini.
        </div>
      </div>

      {/*  List of Account */}
      <div className="flex w-full flex-row flex-wrap gap-6">
        <AddAccountCard />

        {accounts?.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
}
