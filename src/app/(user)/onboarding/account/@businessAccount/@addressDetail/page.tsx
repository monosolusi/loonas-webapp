"use client";

import { useCreateAccount } from "@/app/(user)/onboarding/account/_providers/create-account";
import { ProvinceInput } from "@/app/(user)/onboarding/_components/province-input";
import { CityInput } from "@/app/(user)/onboarding/_components/city-input";
import { DistrictInput } from "@/app/(user)/onboarding/_components/district-input";
import { SubdistrictInput } from "@/app/(user)/onboarding/_components/subdistrict-input";
import { TextAreaInput } from "@/core/presentations/components/text-area-input";
import { useBusinessAccountData } from "@/app/(user)/onboarding/account/@businessAccount/_hooks/use-business-account-data";

export default function AddressDetailPage() {
  const { type, currentStep } = useCreateAccount();
  const { data, update, fieldError } = useBusinessAccountData();

  if (!(type === "business" && currentStep === "business.address")) return null;
  return (
    <>
      <div className="mb-6 flex flex-col">
        <span className="text-lg leading-6 font-medium text-neutral-500">Alamat Perusahaan</span>
        <span className="text-sm leading-5 font-medium text-neutral-200">Lengkapi detail alamat kantor perusahaan</span>
      </div>
      <div className="mb-8 flex flex-col gap-4">
        <ProvinceInput
          value={data?.companyProvince}
          onChange={(value) => update?.({ companyProvince: value })}
          error={fieldError("companyProvince")}
          required
        />

        <CityInput
          value={data?.companyCity}
          onChange={(value) => update?.({ companyCity: value })}
          province={data?.companyProvince}
          error={fieldError("companyCity")}
          required
        />

        <DistrictInput
          value={data?.companyDistrict}
          onChange={(value) => update?.({ companyDistrict: value })}
          city={data?.companyCity}
          error={fieldError("companyDistrict")}
          required
        />

        <SubdistrictInput
          value={data?.companySubdistrict}
          onChange={(value) => update?.({ companySubdistrict: value })}
          district={data?.companyDistrict}
          error={fieldError("companySubdistrict")}
          required
        />

        <TextAreaInput
          label="Alamat"
          placeholder="Masukkan alamat lengkap"
          value={data?.companyAddress ?? ""}
          onChange={(value) => update?.({ companyAddress: value })}
          error={fieldError("companyAddress")}
          required
        />
      </div>
    </>
  );
}
