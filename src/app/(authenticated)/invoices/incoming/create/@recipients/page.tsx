"use client";

import Image from "next/image";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { ClientSelector } from "@/features/invoice/presentations/components/client-selector";
import { useCreateIncomingInvoiceSteps } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
import { ListPartnerProvider } from "@/features/partner/presentation/providers/list-partner";
import { ListClientSearchBar } from "@/features/invoice/presentations/components/list-client-search-bar";

export default function SelectClientSection() {
  const { setCurrentStep, currentStep } = useCreateIncomingInvoiceSteps();

  const onAddClientClick = () => {
    setCurrentStep?.("select-client.create-new");
  };

  if (currentStep !== "select-client") return null;
  return (
    <ListPartnerProvider>
      <div className="flex flex-col gap-y-6">
        {/* Title & Description */}
        <div className="flex flex-col">
          <div className="text-2xl leading-8 font-bold text-neutral-400">Pilih Klien</div>
          <div className="text-base leading-6 font-normal">Siapa yang mengirim faktur ini?</div>
        </div>

        {/*  Search Bar */}
        <ListClientSearchBar />

        {/*  List of Client */}
        <ClientSelector />

        <SecondaryButton
          label="Tambah Klien Baru"
          leftIcon={
            <Image src="/assets/images/plus-icon-neutral-400-w24-h24.svg" alt="Plus Icon" width={16} height={16} />
          }
          onClick={onAddClientClick}
          outlined
        />
      </div>
    </ListPartnerProvider>
  );
}
