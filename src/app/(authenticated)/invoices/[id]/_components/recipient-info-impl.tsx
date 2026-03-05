"use client";

import { useGetInvoice } from "@/features/invoice/presentations/hooks/use-get-invoice";
import { SectionCard } from "@/core/presentations/components/section-card";
import { RecipientInfo } from "@/app/(authenticated)/invoices/[id]/_components/recipient-info";
import { isIncomingInvoice } from "@/features/invoice/domain/guards/invoice-guards";

interface RecipientInfoImplProps {
  id: string;
}

export function RecipientInfoImpl({ id }: RecipientInfoImplProps) {
  const { invoice, loading } = useGetInvoice({ id });

  if (loading || !invoice || !isIncomingInvoice(invoice)) {
    return (
      <SectionCard title="Informasi Penerima" iconSrc="/assets/images/person-icon-primary-300-w16-h16.svg">
        <div className="flex flex-col gap-y-5">
          {/* Contact Info Skeleton */}
          <div className="flex flex-col gap-y-1">
            <div className="h-5 w-40 animate-pulse rounded bg-neutral-100" />
            <div className="flex flex-col gap-y-1.5">
              <div className="h-4 w-48 animate-pulse rounded bg-neutral-100" />
              <div className="h-4 w-28 animate-pulse rounded bg-neutral-100" />
            </div>
          </div>

          <hr className="border-neutral-100" />

          {/* Bank Details Skeleton */}
          <div className="flex flex-col gap-y-3">
            <div className="flex flex-col gap-y-0.5">
              <div className="h-4 w-12 animate-pulse rounded bg-neutral-100" />
              <div className="h-5 w-20 animate-pulse rounded bg-neutral-100" />
            </div>
            <div className="flex flex-col gap-y-0.5">
              <div className="h-4 w-20 animate-pulse rounded bg-neutral-100" />
              <div className="h-5 w-40 animate-pulse rounded bg-neutral-100" />
            </div>
            <div className="flex flex-col gap-y-0.5">
              <div className="h-4 w-28 animate-pulse rounded bg-neutral-100" />
              <div className="h-10 w-full animate-pulse rounded-lg bg-neutral-100" />
            </div>
          </div>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Informasi Penerima" iconSrc="/assets/images/person-icon-primary-300-w16-h16.svg">
      <RecipientInfo
        name={invoice.receiver.name}
        email={invoice.receiver.email}
        phoneNumber={invoice.receiver.phoneNumber}
        bankName={invoice.bankAccount.bankName}
        accountHolderName={invoice.bankAccount.accountHolderName}
        accountNumber={invoice.bankAccount.accountNumber}
      />
    </SectionCard>
  );
}
