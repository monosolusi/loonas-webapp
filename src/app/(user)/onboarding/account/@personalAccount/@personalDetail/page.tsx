"use client";

import { useCreateAccount } from "@/app/(user)/onboarding/account/_providers/create-account";
import { NationalityRadioGroup } from "@/app/(user)/onboarding/account/@personalAccount/@personalDetail/_components/nationality-radio-group";
import { FullNameInput } from "@/app/(user)/onboarding/account/@personalAccount/@personalDetail/_components/full-name-input";
import { IdentityNumberInput } from "@/app/(user)/onboarding/account/@personalAccount/@personalDetail/_components/identity-number-input";
import { PlaceOfBirthInput } from "@/app/(user)/onboarding/account/@personalAccount/@personalDetail/_components/place-of-birth-input";
import { DateOfBirthInput } from "@/app/(user)/onboarding/account/@personalAccount/@personalDetail/_components/date-of-birth-input";
import { usePersonalAccountData } from "@/app/(user)/onboarding/account/@personalAccount/_providers/use-personal-account-data";
import { OccupationInput } from "@/app/(user)/onboarding/_components/occupation-input";

export default function PersonalDetailInputPage() {
  const { currentStep, type } = useCreateAccount();
  const { data, update } = usePersonalAccountData();

  if (!(type === "personal" && currentStep === "personal.personal")) return null;
  return (
    <>
      <div className="mb-6 flex flex-col">
        <span className="text-lg leading-6 font-medium text-neutral-500">Data Diri</span>
        <span className="text-sm leading-5 font-medium text-neutral-200">
          Isi data diri sesuai kartu identitas Anda
        </span>
      </div>
      <div className="mb-8 flex flex-col gap-4">
        {/* Nationality Radio Input Group */}
        <NationalityRadioGroup />

        {/*  Full Name Input */}
        <FullNameInput />

        {/*  Identity Number Input */}
        <IdentityNumberInput />

        {/* Occupation Input */}
        <OccupationInput value={data.occupation} onChange={(value) => update?.({ occupation: value })} />

        {/*  Place of Birth Input */}
        <PlaceOfBirthInput />

        {/*  Date of Birth Input */}
        <DateOfBirthInput />
      </div>
    </>
  );
}
