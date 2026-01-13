"use client";

import { AccountCard } from "@/app/(authenticated)/accounts/_components/account-card";
import Image from "next/image";
import { useListAccount } from "@/features/account/presentation/hooks/use-list-account";

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
        {/* Add Account Button */}
        <div className="group hover:bg-primary-300/10 hover:border-primary-300/20 flex w-[256px] cursor-pointer flex-col items-center justify-center gap-y-4 rounded-lg border border-neutral-200 bg-white p-6 transition-all ease-out">
          <div className="group-hover:border-primary-300/20 flex size-14 flex-col items-center justify-center rounded-full border border-neutral-200 bg-white shadow-md transition-all ease-out group-hover:size-15">
            <Image src="/assets/images/plus-icon-neutral-400-w24-h24.svg" alt="Tambah Akun" width={24} height={24} />
          </div>
          <div className="flex flex-col items-center gap-y-1">
            <div className="leading-6 font-semibold">Buat Akun Baru</div>
            <div className="text-center text-sm leading-5 text-neutral-300">
              Tambahkan entitas bisnis atau personal lain
            </div>
          </div>
        </div>
        {accounts?.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
}
