"use client";

import { SectionCard } from "@/core/presentations/components/section-card";

interface BankAccountsTableErrorProps {
  headerAction: React.ReactNode;
}

export function BankAccountsTableError({ headerAction }: BankAccountsTableErrorProps) {
  return (
    <SectionCard
      title="Rekening Bank"
      iconSrc="/assets/images/credit-card-icon-primary-300-w16-h16.svg"
      headerAction={headerAction}
    >
      <div className="flex items-center justify-center py-12">
        <span className="text-sm text-neutral-300">Gagal memuat data rekening.</span>
      </div>
    </SectionCard>
  );
}
