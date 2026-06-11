"use client";

import { use } from "react";
import Link from "next/link";
import { useListAccount } from "@/features/account/presentation/hooks/use-list-account";
import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { AccountDetailLeftPanel } from "@/app/(authenticated)/accounts/[id]/_components/account-detail-left-panel";
import { AccountDetailTabs } from "@/app/(authenticated)/accounts/[id]/_components/account-detail-tabs";
import { AccountType } from "@/features/account/domain/enums/account-type";

const ACCOUNT_TYPE_LABEL = {
  [AccountType.PERSONAL]: "Personal",
  [AccountType.BUSINESS]: "Bisnis",
};

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
        <div className="flex flex-row items-center gap-x-4">
          <div className="size-9 animate-pulse rounded-lg bg-neutral-100" />
          <div className="flex flex-col gap-y-1">
            <div className="h-5 w-32 animate-pulse rounded bg-neutral-100" />
            <div className="h-4 w-48 animate-pulse rounded bg-neutral-100" />
          </div>
        </div>
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
  const typeLabel = ACCOUNT_TYPE_LABEL[account.type];
  const shortId = account.generateShortAccountId();

  return (
    <div className="flex flex-col gap-y-6">
      <DetailPageHeader
        backHref="/accounts"
        title="Detail Akun"
        subtitle={`${typeLabel} · ID: ${shortId}`}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-8">
            <AccountDetailLeftPanel account={account} />
          </div>
        </div>

        <div className="lg:col-span-8">
          <AccountDetailTabs isOwner={isOwner} />
        </div>
      </div>
    </div>
  );
}
