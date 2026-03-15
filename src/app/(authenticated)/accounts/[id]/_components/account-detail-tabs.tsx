"use client";

import { useState } from "react";
import clsx from "clsx";
import { MembersTab } from "@/app/(authenticated)/accounts/[id]/_components/members-tab";
import { BankAccountsTableImpl } from "@/app/(authenticated)/accounts/[id]/_components/bank-accounts-table-impl";

type Tab = "anggota" | "rekening" | "klien";

const TABS: { id: Tab; label: string }[] = [
  { id: "anggota", label: "Anggota" },
  { id: "rekening", label: "Rekening" },
  { id: "klien", label: "Klien" },
];

type AccountDetailTabsProps = {
  isOwner: boolean;
};

export function AccountDetailTabs({ isOwner }: AccountDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("anggota");

  return (
    <div className="flex flex-col gap-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-row gap-x-1 rounded-lg border border-neutral-200 bg-white p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-primary-300 text-white"
                : "text-neutral-300 hover:bg-neutral-50 hover:text-neutral-500",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "anggota" && isOwner && <MembersTab />}
      {activeTab === "anggota" && !isOwner && (
        <div className="flex flex-col items-center justify-center gap-y-2 rounded-lg border border-neutral-200 bg-white py-16">
          <p className="text-sm font-semibold text-neutral-500">Akses Terbatas</p>
          <p className="text-sm text-neutral-200">Hanya pemilik akun yang dapat mengelola anggota.</p>
        </div>
      )}
      {activeTab === "rekening" && <BankAccountsTableImpl />}
      {activeTab === "klien" && (
        <div className="flex flex-col items-center justify-center gap-y-2 rounded-lg border border-neutral-200 bg-white py-16">
          <span className="rounded-md bg-warning-300/10 px-3 py-1 text-xs font-medium text-warning-300">
            Segera Hadir
          </span>
          <p className="text-sm text-neutral-200">Fitur klien akan tersedia segera.</p>
        </div>
      )}
    </div>
  );
}
