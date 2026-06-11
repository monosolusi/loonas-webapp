"use client";

import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { useCreateNewPartnerProvider } from "@/features/partner/presentation/providers/create-new-partner";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { EmailInput } from "@/core/presentations/components/text-inputs/email-input";
import PhoneNumberInput from "@/core/presentations/components/text-inputs/phone-number-input";

export default function AddClientSection() {
  const { currentStep } = useCreateOutgoingInvoice();
  const { name, email, phone, setName, setEmail, setPhone } = useCreateNewPartnerProvider();

  if (currentStep !== "select-recipient.create-new") return null;

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-col">
        <h1 className="text-base font-semibold text-neutral-500">Tambah Klien Baru</h1>
        <p className="text-sm text-neutral-300">Masukan detail informasi klien Anda.</p>
      </div>
      <div className="flex flex-col gap-y-4">
        <TextInput label="Nama" placeholder="Masukan nama klien" value={name} onChange={setName} required />
        <EmailInput value={email} onChange={setEmail} required />
        <PhoneNumberInput value={phone} onChange={setPhone} required />
      </div>
    </div>
  );
}
