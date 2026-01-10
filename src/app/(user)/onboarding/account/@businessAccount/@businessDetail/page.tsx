"use client";

import { TextInput } from "@/core/presentations/components/text-input";
import React from "react";
import PhoneNumberInput from "@/core/presentations/components/phone-number-input";
import { useCreateAccount } from "@/app/(user)/onboarding/account/_providers/create-account";
import { useBusinessAccountData } from "@/app/(user)/onboarding/account/@businessAccount/_hooks/use-business-account-data";
import { EmailInput } from "@/core/presentations/components/email-input";

export default function BusinessDetailPage() {
  const { type, currentStep } = useCreateAccount();
  const { data, update } = useBusinessAccountData();

  if (!(type === "business" && currentStep === "business.personal")) return null;
  return (
    <>
      <div className="mb-6 flex flex-col">
        <span className="text-lg leading-6 font-medium text-neutral-500">Profil Perusahaan</span>
        <span className="text-sm leading-5 font-medium text-neutral-200">Lengkapi identitas dasar perusahaan.</span>
      </div>
      <div className="mb-8 flex flex-col gap-4">
        <TextInput
          label="Nama Perusahaan"
          type="text"
          placeholder="Masukan nama perusahaan Anda."
          value={data.companyName ?? ""}
          onChange={(value) => update?.({ companyName: value })}
        />

        <EmailInput value={data.companyEmail ?? ""} onChange={(value) => update?.({ companyEmail: value })} />

        <PhoneNumberInput value={data.companyPhone ?? ""} onChange={(value) => update?.({ companyPhone: value })} />
      </div>
    </>
  );
}
