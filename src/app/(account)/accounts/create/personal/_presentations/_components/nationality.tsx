"use client";
import React from "react";
import { Radio, RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { Label } from "@/app/(account)/accounts/create/personal/_presentations/_components/label";
import {
  useCreatePersonalAccount
} from "@/app/(account)/accounts/create/personal/_presentations/_providers/create-personal-account";

export function NationalitySelect() {
  const { nationality } = useCreatePersonalAccount();

  return (
    <fieldset className="col-span-full">
      <Label
        title="Status Kewarganegaraan"
        description="Yuk, pilih status kewarganegaraan yang sesuai dengankondisi kamu sekarang ya."
      />
      <RadioGroup
        value={nationality}
        className="mt-2 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4"
      >
        <Radio
          value="WNI"
          aria-label="WNI"
          aira-description="Kamu sudah memegang KTP dan berstatus sebagai Warga Negara Indonesia."
          className="group relative flex cursor-pointer rounded-lg border border-gray-300 bg-white p-4 shadow-xs focus:outline-hidden data-focus:border-primary-default data-focus:ring-2 data-focus:ring-primary-default"
        >
          <span className="flex flex-1">
            <span className="flex flex-col">
              <span className="block text-sm font-medium text-gray-900">WNI</span>
              <span className="mt-1 flex items-center text-sm text-gray-500 whitespace-normal break-words">
                Kamu sudah memegang KTP dan berstatus sebagai Warga Negara Indonesia.
              </span>
            </span>
          </span>
          <CheckCircleIcon
            aria-hidden="true"
            className="size-5 text-primary-default group-not-data-checked:invisible"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent group-data-checked:border-primary-default group-data-focus:border"
          />
        </Radio>

        <Radio
          disabled
          value="WNA"
          aria-label="WNA"
          aira-description="Kamu memegang paspor WNA dan memiliki dokumen KITAS, KITAP, atau izin tinggal resmi."
          className="group relative flex cursor-pointer rounded-lg border border-gray-300 bg-white p-4 shadow-xs focus:outline-hidden data-focus:border-primary-default data-focus:ring-2 data-focus:ring-primary-default data-disabled:bg-gray-50 data-disabled:shadow-none data-disabled:border-gray-200 "
        >
          <span className="flex flex-1">
            <span className="flex flex-col">
              <span className="block text-sm font-medium text-gray-900 group-data-disabled:text-gray-300">WNA</span>
              <span
                className="mt-1 flex items-center text-sm text-gray-500 group-data-disabled:text-gray-300 whitespace-normal break-words">
                Kamu memegang paspor WNA dan memiliki dokumen KITAS, KITAP, atau izin tinggal resmi.
              </span>
            </span>
          </span>
          <CheckCircleIcon
            aria-hidden="true"
            className="size-5 text-primary-default group-not-data-checked:invisible"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent group-data-checked:border-primary-default group-data-focus:border"
          />
        </Radio>
      </RadioGroup>
    </fieldset>
  );
}