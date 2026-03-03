"use client";

import React from "react";
import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { ListPartnerProvider, useListPartnerProvider } from "@/features/partner/presentation/providers/list-partner";
import { ListClientSearchBar } from "@/features/invoice/presentations/components/list-client-search-bar";
import { Selector } from "@/features/invoice/presentations/components/selector";
import { SelectorItem } from "@/features/invoice/presentations/components/selector-item";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";

function RecipientSectionContent() {
  const { recipient, setRecipient, setCurrentStep } = useCreateOutgoingInvoice();
  const { partners } = useListPartnerProvider();

  const handleSelect = (partner: (typeof partners)[number]) => {
    setRecipient?.(partner);
  };

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col">
        <h1 className="text-base font-semibold text-gray-900">Klien</h1>
        <p className="text-sm text-gray-500">Pilih klien tujuan agar kamu bisa mengirimkan invoice dengan mudah.</p>
      </div>
      <ListClientSearchBar />
      <Selector>
        {partners.map((partner, index) => (
          <SelectorItem
            key={partner.id}
            title={partner.name}
            description={partner.email}
            state={recipient?.id === partner.id ? "active" : "default"}
            showBorder={index < partners.length - 1}
            onClick={() => handleSelect(partner)}
          />
        ))}
      </Selector>
      <div className="flex flex-row justify-end">
        <SecondaryButton
          outlined
          label="Tambah Klien Baru"
          onClick={() => setCurrentStep?.("select-recipient.create-new")}
        />
      </div>
    </div>
  );
}

export default function RecipientSection() {
  const { currentStep } = useCreateOutgoingInvoice();

  if (currentStep !== "select-recipient") return null;

  return (
    <ListPartnerProvider>
      <RecipientSectionContent />
    </ListPartnerProvider>
  );
}
