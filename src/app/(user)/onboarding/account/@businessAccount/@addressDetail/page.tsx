"use client";

import {useCreateAccount} from "@/app/(user)/onboarding/account/_providers/create-account";
import {ProvinceInput} from "@/app/(user)/onboarding/_components/province-input";
import {CityInput} from "@/app/(user)/onboarding/_components/city-input";
import {DistrictInput} from "@/app/(user)/onboarding/_components/district-input";
import {SubdistrictInput} from "@/app/(user)/onboarding/_components/subdistrict-input";
import {TextAreaInput} from "@/core/presentations/components/text-area-input";

export default function AddressDetailPage() {
  const { type, currentStep } = useCreateAccount();

  if (!(type === "business" && currentStep === "business.address")) return null;
  return (
    <>
      <div className="mb-6 flex flex-col">
        <span className="text-lg leading-6 font-medium text-neutral-500">Alamat Perusahaan</span>
        <span className="text-sm leading-5 font-medium text-neutral-200">Lengkapi detail alamat kantor perusahaan</span>
      </div>
      <div className="mb-8 flex flex-col gap-4">
        <ProvinceInput />
        <CityInput />
        <DistrictInput />
        <SubdistrictInput />
        <TextAreaInput label="Alamat" placeholder="Masukkan alamat lengkap" />
      </div>
    </>
  );
}
