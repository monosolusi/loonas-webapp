"use client";

import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import Image from "next/image";
import { useCreateIncomingInvoiceSteps } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
import { ListPartnerBankAccountProvider } from "@/features/partner/presentation/providers/list-partner-bank-account";
import { PartnerBankAccountSelector } from "@/features/invoice/presentations/components/partner-bank-account-selector";

export default function ClientBankAccountPage() {
  const { currentStep, setCurrentStep } = useCreateIncomingInvoiceSteps();

  const onAddBankAccountClick = () => {
    setCurrentStep?.("client-bank-account.create-new");
  };

  if (currentStep !== "client-bank-account") return null;
  return (
    <ListPartnerBankAccountProvider>
      <div className="flex flex-col gap-y-6">
        {/* Title & Description */}
        <div className="flex flex-col">
          <div className="text-2xl leading-8 font-bold text-neutral-400">Pilih Rekening</div>
          <div className="text-base leading-6 font-normal">Kemana pembayaran ini akan diteruskan?</div>
        </div>

        {/*  Search Bar */}
        {/*<SearchBar placeholder="Cari nama pemilik rekening..." />*/}

        {/*  List of Client */}
        <PartnerBankAccountSelector />

        <SecondaryButton
          label="Tambah Rekening Baru"
          leftIcon={
            <Image src="/assets/images/plus-icon-neutral-400-w24-h24.svg" alt="Plus Icon" width={16} height={16} />
          }
          onClick={onAddBankAccountClick}
          outlined
        />
      </div>
    </ListPartnerBankAccountProvider>
  );
}
