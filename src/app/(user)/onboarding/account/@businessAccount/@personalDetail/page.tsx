import { TextInput } from "@/core/presentations/components/text-input";
import Image from "next/image";
import React from "react";
import PhoneNumberInput from "@/core/presentations/components/phone-number-input";

export default function BusinessDetailPage() {
  return (
    <>
      <div className="mb-6 flex flex-col">
        <span className="text-lg leading-6 font-medium text-neutral-500">Profil Perusahaan</span>
        <span className="text-sm leading-5 font-medium text-neutral-200">Lengkapi identitas dasar perusahaan.</span>
      </div>
      <div className="mb-8 flex flex-col gap-4">
        <TextInput label="Nama Perusahaan" type="text" placeholder="Masukan nama perusahaan Anda." />
        <TextInput
          label="Email Perusahaan"
          type="email"
          placeholder="Masukan email perusahaan Anda."
          leftIcon={<Image src="/assets/images/email-icon-w20-h20.svg" alt="Email Icon" width={20} height={20} />}
        />
        <PhoneNumberInput />
      </div>
    </>
  );
}
