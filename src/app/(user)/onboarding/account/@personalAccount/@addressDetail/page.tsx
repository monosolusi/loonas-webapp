"use client";

import { useCreateAccount } from "@/app/(user)/onboarding/account/_providers/create-account";
import { ProvinceInput } from "@/app/(user)/onboarding/_components/province-input";
import { CityInput } from "@/app/(user)/onboarding/_components/city-input";
import { DistrictInput } from "@/app/(user)/onboarding/_components/district-input";
import { SubdistrictInput } from "@/app/(user)/onboarding/_components/subdistrict-input";
import { AddressInput } from "@/app/(user)/onboarding/account/@personalAccount/@addressDetail/_components/address-input";
import { usePersonalAccountData } from "@/app/(user)/onboarding/account/@personalAccount/_hooks/use-personal-account-data";

export default function AddressDetailInputPage() {
  const { type, currentStep } = useCreateAccount();
  const { data, update, fieldError } = usePersonalAccountData();

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
          <ProvinceInput
            value={data.province}
            onChange={(value) => update?.({ province: value })}
            error={fieldError("province")}
            required
          />

          {/* City Input */}
          <CityInput
            value={data.city}
            onChange={(value) => update?.({ city: value })}
            province={data.province}
            error={fieldError("city")}
            required
          />

          {/* District Input */}
          <DistrictInput
            value={data.district}
            onChange={(value) => update?.({ district: value })}
            city={data.city}
            error={fieldError("district")}
            required
          />

          {/* Subdistrict Input */}
          <SubdistrictInput
            value={data.subDistrict}
            onChange={(value) => update?.({ subDistrict: value })}
            district={data.district}
            error={fieldError("subDistrict")}
            required
          />

          {/* Address Input */}
          <AddressInput />
        </div>
      </>
    );
}
