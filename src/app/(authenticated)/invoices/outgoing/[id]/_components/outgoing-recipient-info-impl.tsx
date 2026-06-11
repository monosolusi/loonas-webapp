"use client";

import { useParams } from "next/navigation";
import { useGetOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-get-outgoing-invoice";
import { SectionCard } from "@/core/presentations/components/section-card";
import { OutgoingRecipientInfo } from "@/app/(authenticated)/invoices/outgoing/[id]/_components/outgoing-recipient-info";

export function OutgoingRecipientInfoImpl() {
  const { id } = useParams<{ id: string }>();
  const { invoice, loading } = useGetOutgoingInvoice({ id });

  if (loading || !invoice) {
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

          {/* Address Skeleton */}
          <div className="flex flex-col gap-y-0.5">
            <div className="h-4 w-12 animate-pulse rounded bg-neutral-100" />
            <div className="h-5 w-full animate-pulse rounded bg-neutral-100" />
          </div>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Informasi Penerima" iconSrc="/assets/images/person-icon-primary-300-w16-h16.svg">
      <OutgoingRecipientInfo
        name={invoice.recipient.fullName}
        email={invoice.recipient.email}
        phoneNumber={invoice.recipient.phoneNumber}
        address={invoice.recipient.address}
      />
    </SectionCard>
  );
}
