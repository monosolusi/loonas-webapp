"use client";

import { SectionCard } from "@/core/presentations/components/section-card";
import { BankAccountRow, BankAccountsTable } from "@/app/(authenticated)/accounts/[id]/_components/bank-accounts-table";

interface BankAccountsTableContentProps {
  rows: BankAccountRow[];
  headerAction: React.ReactNode;
}

export function BankAccountsTableContent({ rows, headerAction }: BankAccountsTableContentProps) {
  return (
    <SectionCard
      title="Rekening Bank"
      iconSrc="/assets/images/credit-card-icon-primary-300-w16-h16.svg"
      headerAction={headerAction}
      bodyClassName="p-0"
    >
      <BankAccountsTable rows={rows} />
    </SectionCard>
  );
}
