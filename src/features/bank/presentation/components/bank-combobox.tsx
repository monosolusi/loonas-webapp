"use client";

import React, { useMemo, useState } from "react";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Label } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { BankComboboxProps } from "@/features/bank/presentation/components/bank-combobox.types";
import { useListBank } from "@/features/bank/presentation/hooks/use-list-bank";

export function BankCombobox(props: BankComboboxProps) {
  const { banks } = useListBank();
  const [query, setQuery] = useState("");

  const filteredBank = useMemo(() => {
    if (!query) return banks;
    return banks.filter((bank) => bank.name.toLowerCase().includes(query.toLowerCase()));
  }, [banks, query]);

  return (
    <Combobox
      as="div"
      value={props.selectedBank || null}
      onChange={(bank) => {
        setQuery("");

        if (!props.setSelectedBank) return;
        if (bank) props.setSelectedBank(bank);
        else props.setSelectedBank(undefined);
      }}
      className="flex flex-col gap-2"
    >
      <Label className="text-base">Nama Bank</Label>
      <div className="relative">
        <ComboboxInput
          className="focus:border-primary-300 focus:ring-primary-300/20 block w-full rounded-lg border border-neutral-100 p-3 text-base outline-none placeholder:text-neutral-200 focus:ring-2"
          onChange={(event) => setQuery(event.target.value)}
          onBlur={() => setQuery("")}
          displayValue={(person: any) => person?.name}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-hidden">
          <ChevronUpDownIcon className="size-5 text-gray-400" aria-hidden="true" />
        </ComboboxButton>

        {filteredBank.length > 0 && (
          <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden sm:text-sm">
            {filteredBank.map((bank) => (
              <ComboboxOption
                key={bank.id}
                value={bank}
                className="group data-focus:bg-primary-300 relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:text-white data-focus:outline-hidden"
              >
                <span className="block truncate group-data-selected:font-semibold">{bank.name}</span>

                <span className="text-primary-300 absolute inset-y-0 right-0 hidden items-center pr-4 group-data-focus:text-white group-data-selected:flex">
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
