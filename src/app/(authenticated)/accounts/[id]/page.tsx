"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useListAccount } from "@/features/account/presentation/hooks/use-list-account";
import { AccountDetailLeftPanel } from "@/app/(authenticated)/accounts/[id]/_components/account-detail-left-panel";
import { AccountDetailTabs } from "@/app/(authenticated)/accounts/[id]/_components/account-detail-tabs";

type AccountDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default function AccountDetailPage(props: AccountDetailPageProps) {
  const { id } = use(props.params);
  const { accounts, loading } = useListAccount();

  const account = accounts?.find((a) => a.id === id);

  if (loading) {
    return (
      <div className="flex flex-col gap-y-6">
        <div className="h-5 w-48 animate-pulse rounded bg-neutral-100" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="h-64 animate-pulse rounded-lg bg-neutral-100" />
          </div>
          <div className="lg:col-span-8">
            <div className="h-96 animate-pulse rounded-lg bg-neutral-100" />
          </div>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center gap-y-4 py-16">
        <p className="text-lg font-semibold text-neutral-500">Akun tidak ditemukan</p>
        <Link href="/accounts" className="text-sm text-primary-300 hover:underline">
          Kembali ke Daftar Akun
        </Link>
      </div>
    );
  }

  const isOwner = account.membership?.isOwner ?? true;

  return (
    <div className="flex flex-col gap-y-6">
      {/* Back Navigation */}
      <Link href="/accounts" className="flex flex-row items-center gap-x-2 text-sm text-neutral-300 hover:text-primary-300">
        <Image src="/assets/images/arrow-left-icon-neutral-500-w16-h16.svg" alt="back" width={16} height={16} />
        <span>Kembali ke Daftar Akun</span>
      </Link>

      {/* Split Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Panel */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-8">
            <AccountDetailLeftPanel account={account} />
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-8">
          <AccountDetailTabs isOwner={isOwner} />
        </div>
      </div>
    </div>
  );
}
