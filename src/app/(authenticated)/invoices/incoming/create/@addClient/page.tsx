"use client";

import { useCreateIncomingInvoiceSteps } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { EmailInput } from "@/core/presentations/components/text-inputs/email-input";
import PhoneNumberInput from "@/core/presentations/components/text-inputs/phone-number-input";
import { useCreateNewPartnerProvider } from "@/features/partner/presentation/providers/create-new-partner";

export default function AddClientPage() {
  const { currentStep } = useCreateIncomingInvoiceSteps();
  const { name, email, phone, setName, setEmail, setPhone } = useCreateNewPartnerProvider();

  if (currentStep !== "select-client.create-new") return null;
  return (
    <div className="flex flex-col gap-y-6">
      {/* Title & Description */}
      <div className="flex flex-col">
        <div className="text-2xl leading-8 font-semibold">Tambah Klien Baru</div>
        <div className="leading-6">Masukan detail informasi klien Anda.</div>
      </div>

      <div className="flex flex-col gap-y-4">
        <TextInput
          label="Nama Lengkap / Perusahaan"
          type="text"
          placeholder="Masukan nama lengkap atau perusahaan Klien Anda."
          value={name}
          onChange={setName}
        />

        <EmailInput label="Email" placeholder="Masukan email Klien Anda." value={email} onChange={setEmail} />

        <PhoneNumberInput
          label="No. Telpon"
          placeholder="Masukan nomor telepon Klien Anda."
          value={phone}
          onChange={setPhone}
        />
      </div>
    </div>
  );
}
