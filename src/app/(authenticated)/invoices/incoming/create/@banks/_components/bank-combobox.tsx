"use client";

import React, { useState } from "react";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Label } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { BankEntity } from "@/features/bank/domain/entities/bank";
import { useListBank } from "@/features/bank/presentation/hooks/use-list-bank";

export function BankCombobox({ selectedBank, setSelectedBank }: {
  selectedBank: BankEntity | null,
  setSelectedBank: React.Dispatch<React.SetStateAction<BankEntity | null>>
}) {
  const { banks } = useListBank();
  const [query, setQuery] = useState("");
  const filteredBank =
    query === ""
      ? banks
      : banks.filter((bank) => {
        return bank.name.toLowerCase().includes(query.toLowerCase());
      });


  return (
    <Combobox
      as="div"
      value={selectedBank}
      onChange={(bank) => {
        setQuery("");
        setSelectedBank(bank);
      }}
    >
      <Label className="block text-sm/6 font-medium text-gray-900">Nama Bank</Label>
      <div className="relative mt-2">
        <ComboboxInput
          className="block w-full rounded-md bg-white py-1.5 pr-12 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-default sm:text-sm/6"
          onChange={(event) => setQuery(event.target.value)}
          onBlur={() => setQuery("")}
          displayValue={(person: any) => person?.name}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-hidden">
          <ChevronUpDownIcon className="size-5 text-gray-400" aria-hidden="true" />
        </ComboboxButton>

        {filteredBank.length > 0 && (
          <ComboboxOptions
            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden sm:text-sm">
            {filteredBank.map((bank) => (
              <ComboboxOption
                key={bank.id}
                value={bank}
                className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-primary-default data-focus:text-white data-focus:outline-hidden"
              >
                <span className="block truncate group-data-selected:font-semibold">{bank.name}</span>

                <span
                  className="absolute inset-y-0 right-0 hidden items-center pr-4 text-primary-default group-data-focus:text-white group-data-selected:flex">
                  <CheckIcon className="size-5" aria-hidden="true" />
                </span>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  );
}
