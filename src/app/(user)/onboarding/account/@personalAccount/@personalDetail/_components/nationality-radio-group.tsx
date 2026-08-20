"use client";

import { useId } from "react";
import { NationalityRadioItem } from "@/app/(user)/onboarding/account/@personalAccount/@personalDetail/_components/nationality-radio-item";
import { usePersonalAccountData } from "@/app/(user)/onboarding/account/@personalAccount/_providers/personal-account-provider";
import { Nationality } from "@/app/(user)/onboarding/account/_utils/personal-account-completeness";
import {
  NATIONALITY_OPTIONS,
  isNationalitySelectable,
} from "@/app/(user)/onboarding/account/_utils/nationality-options";

export function NationalityRadioGroup() {
  const { data, changeNationality, fieldError } = usePersonalAccountData();
  const errorId = useId();

  // Only one option is selectable today (see `NATIONALITY_OPTIONS`), so this never carries a
  // default — the user has to choose WNI actively, which makes an unchosen nationality a real
  // step-1 blocker. That blocker is now explained on the card itself rather than by silence.
  const errorCopy = fieldError("nationality");

  // `changeNationality` owns the nationality/identityNumber invariant (see
  // `resolveNationalityChange` — QA finding F9: a first selection must NOT clear an
  // already-typed identity number). This component only reports the click, and asks the option
  // catalogue — the single owner — whether the value may reach the buffer at all.
  const onChange = (value: Nationality) => (checked: boolean) => {
    if (checked && isNationalitySelectable(value)) changeNationality?.(value);
  };

  return (
    <fieldset
      className="m-0 min-w-0 border-0 p-0"
      aria-invalid={!!errorCopy}
      aria-describedby={errorCopy ? errorId : undefined}
    >
      <legend className="mb-2 flex items-center gap-x-1.5 p-0 text-base">
        Status Kewarganegaraan
        <span className="text-red-500"> *</span>
      </legend>
      {/*
        Stacked below `sm`: at 360px each card gets ~112px of content width, where "Warga Negara
        Indonesia" already wraps to three lines — a chip plus a reason sentence on top of that is
        illegible side by side.
      */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {NATIONALITY_OPTIONS.map((option) => (
          <div key={option.value} className="flex-1">
            <NationalityRadioItem
              name="nationality"
              title={option.title}
              description={option.description}
              uncheckedIconPath={option.uncheckedIconPath}
              checkedIconPath={option.checkedIconPath}
              checked={data.nationality === option.value}
              onChange={onChange(option.value)}
              availability={option.availability}
            />
          </div>
        ))}
      </div>
      {errorCopy && (
        <span id={errorId} className="mt-2 block text-xs leading-4 font-normal text-red-500">
          {errorCopy}
        </span>
      )}
    </fieldset>
  );
}
