"use client";

import { SelectInput } from "@/core/presentations/components/select-input";
import { TextAreaInput } from "@/core/presentations/components/text-area-input";
import { useCreateAccount } from "@/app/(user)/onboarding/account/_providers/create-account";
import { ProvinceInput } from "@/app/(user)/onboarding/account/@personalAccount/@addressDetail/_components/province-input";
import { CityInput } from "@/app/(user)/onboarding/account/@personalAccount/@addressDetail/_components/city-input";

export default function AddressDetailInputPage() {
  const { type, currentStep } = useCreateAccount();

  if (!(type === "personal" && currentStep === "personal.address")) return null;
  else
    return (
      <>
        <div className="mb-6 flex flex-col">
          <span className="text-lg leading-6 font-medium text-neutral-500">Alamat Domisili</span>
          <span className="text-sm leading-5 font-medium text-neutral-200">
            Lengkapi detail alamat tempat tinggal Anda
          </span>
        </div>
        <div className="mb-8 flex flex-col gap-4">
          {/* Province Input */}
          <ProvinceInput />

          {/* City Input */}
          <CityInput />

          {/* District Input */}
          <SelectInput options={[]} label="Kecamatan" placeholder="Pilih Kecamatan" />

          {/* Subdistrict Input */}
          <SelectInput options={[]} label="Kelurahan" placeholder="Pilih Kelurahan" />

          {/* Address Input */}
          <TextAreaInput label="Alamat" placeholder="Masukkan alamat lengkap" />
        </div>
      </>
    );
}
