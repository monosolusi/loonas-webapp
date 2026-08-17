"use client";

import { useId } from "react";
import { NationalityRadioItem } from "@/app/(user)/onboarding/account/@personalAccount/@personalDetail/_components/nationality-radio-item";
import { usePersonalAccountData } from "@/app/(user)/onboarding/account/@personalAccount/_hooks/use-personal-account-data";
import { Nationality } from "@/app/(user)/onboarding/account/_utils/personal-account-completeness";

type NationalityOption = {
  value: Nationality;
  title: string;
  description: string;
  uncheckedIconPath: string;
  checkedIconPath: string;
  disabled?: boolean;
};

const NATIONALITY_OPTIONS: NationalityOption[] = [
  {
    value: "WNI",
    title: "WNI",
    description: "Warga Negara Indonesia",
    uncheckedIconPath: "/assets/images/flag-icon-neutral-200-w20-h20.svg",
    checkedIconPath: "/assets/images/flag-icon-primary-w20-h20.svg",
  },
  {
    value: "WNA",
    title: "WNA",
    description: "Warga Negara Asing",
    uncheckedIconPath: "/assets/images/globe-icon-neutral-200-w20-h20.svg",
    checkedIconPath: "/assets/images/globe-icon-primary-w20-h20.svg",
    disabled: true,
  },
];

export function NationalityRadioGroup() {
  const { data, changeNationality, fieldError } = usePersonalAccountData();
  const errorId = useId();

  // WNA is disabled, so this never carries a default — the user has to choose WNI actively, which
  // makes an unchosen nationality a real (and previously unexplained) step-1 blocker.
  const errorCopy = fieldError("nationality");

  // `changeNationality` owns the nationality/identityNumber invariant (see
  // `resolveNationalityChange` — QA finding F9: a first selection must NOT clear an
  // already-typed identity number). This component only reports the click.
  const onChange = (value: Nationality) => (checked: boolean) => {
    if (checked) changeNationality?.(value);
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
      <div className="flex flex-row gap-3">
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
              disabled={option.disabled}
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
