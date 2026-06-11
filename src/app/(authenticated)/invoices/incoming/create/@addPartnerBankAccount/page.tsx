"use client";

import { useCreateIncomingInvoiceSteps } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { BankCombobox } from "@/features/bank/presentation/components/bank-combobox";
import { useCreatePartnerBankAccountProvider } from "@/features/partner/presentation/providers/create-partner-bank-account.provider";

export default function AddPartnerBankAccountPage() {
  const { currentStep } = useCreateIncomingInvoiceSteps();
  const { bank, accountNumber, accountHolderName, setBank, setAccountNumber } = useCreatePartnerBankAccountProvider();

  if (currentStep !== "client-bank-account.create-new") return null;
  return (
    <div className="flex flex-col gap-y-6">
      {/* Title & Description */}
      <div className="flex flex-col">
        <div className="text-2xl leading-8 font-semibold">Tambah Rekening Baru</div>
        <div className="leading-6">Masukan detail rekening bank penerima dana.</div>
      </div>

      <div className="flex flex-col gap-y-4">
        <BankCombobox selectedBank={bank} setSelectedBank={setBank} />

        <TextInput
          label="Nomor Rekening"
          type="text"
          placeholder="Masukan nomor rekening."
          value={accountNumber}
          onChange={setAccountNumber}
        />

        <TextInput
          label="Nama Pemilik Rekening"
          type="text"
          placeholder="Akan muncul setelah verifikasi."
          value={accountHolderName}
          disabled
        />
      </div>
    </div>
  );
}
