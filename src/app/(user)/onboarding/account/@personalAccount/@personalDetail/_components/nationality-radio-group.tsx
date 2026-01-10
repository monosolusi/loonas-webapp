"use client";

import { NationalityRadioItem } from "@/app/(user)/onboarding/account/@personalAccount/@personalDetail/_components/nationality-radio-item";
import { usePersonalAccountData } from "@/app/(user)/onboarding/account/@personalAccount/_providers/use-personal-account-data";

type Nationality = "WNI" | "WNA";

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
  const { data, update } = usePersonalAccountData();

  const onChange = (value: Nationality) => (checked: boolean) => {
    if (checked && update) update({ nationality: value });
  };

  return (
    <div className="flex flex-col gap-2">
      <legend>Status Kewarganegaraan</legend>
      <fieldset className="flex flex-row gap-3">
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
      </fieldset>
    </div>
  );
}
