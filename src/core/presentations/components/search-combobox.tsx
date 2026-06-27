"use client";

import { useMemo, useState } from "react";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

export type SearchComboboxOption = {
  id: string;
  label: string;
  description?: string;
};

type SearchComboboxBaseProps<T extends SearchComboboxOption> = {
  options: T[];
  value: T | null;
  onChange: (value: T | null) => void;
  placeholder?: string;
  disabled?: boolean;
  onCreateNew?: () => void;
  createNewLabel?: string;
  required?: boolean;
  autoFocus?: boolean;
  emptyMessage?: string;
};

type SearchComboboxWithLabel<T extends SearchComboboxOption> = SearchComboboxBaseProps<T> & {
  label: string;
  noLabel?: false;
};

type SearchComboboxWithoutLabel<T extends SearchComboboxOption> = SearchComboboxBaseProps<T> & {
  label?: string;
  noLabel: true;
};

export type SearchComboboxProps<T extends SearchComboboxOption> =
  | SearchComboboxWithLabel<T>
  | SearchComboboxWithoutLabel<T>;

export function SearchCombobox<T extends SearchComboboxOption>(props: SearchComboboxProps<T>) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return props.options;
    return props.options.filter((opt) => opt.label.toLowerCase().includes(query.toLowerCase()));
  }, [props.options, query]);

  return (
    <Combobox
      as="div"
      value={props.value}
      onChange={(val) => {
        setQuery("");
        props.onChange(val);
      }}
      disabled={props.disabled}
      className={clsx("flex flex-col gap-2", props.disabled && "opacity-50")}
    >
      {!props.noLabel && (
        <span className="text-base">
          {props.label}
          {props.required && <span className="text-red-500"> *</span>}
        </span>
      )}
      <div className="relative">
        <ComboboxInput
          className={clsx(
            "block h-11 w-full rounded-lg border border-neutral-100 px-3 text-sm outline-none placeholder:text-neutral-200",
            props.disabled
              ? "cursor-not-allowed bg-neutral-50"
              : "focus:border-primary-300 focus:ring-primary-300/20 focus:ring-2",
          )}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={() => setQuery("")}
          displayValue={(opt: T | null) => opt?.label ?? ""}
          placeholder={props.placeholder}
          autoFocus={props.autoFocus ?? false}
        />
        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-hidden">
          <ChevronUpDownIcon className="size-5 text-neutral-200" aria-hidden="true" />
        </ComboboxButton>

        <ComboboxOptions
          anchor={{ to: "bottom start", gap: 4 }}
          className="z-50 max-h-60 w-[var(--input-width)] overflow-auto rounded-lg border border-neutral-100 bg-white py-1 text-base shadow-lg focus:outline-hidden"
        >
          {filtered.map((opt) => (
            <ComboboxOption
              key={opt.id}
              value={opt}
              className="group data-focus:bg-primary-50 data-focus:text-primary-300 relative cursor-pointer py-2 pr-9 pl-3 text-neutral-500 transition-colors select-none"
            >
              <div className="flex flex-col">
                <span className="block truncate group-data-selected:font-semibold">{opt.label}</span>
                {opt.description && (
                  <span className="group-data-focus:text-primary-200 text-sm text-neutral-200">{opt.description}</span>
                )}
              </div>
              <span className="text-primary-300 absolute inset-y-0 right-0 hidden items-center pr-3 group-data-selected:flex">
                <CheckIcon className="size-5" aria-hidden="true" />
              </span>
            </ComboboxOption>
          ))}

          {filtered.length === 0 && (
            <div className="px-3 py-2 text-sm text-neutral-200">{props.emptyMessage ?? "Tidak ditemukan"}</div>
          )}

          {props.onCreateNew && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                props.onCreateNew?.();
              }}
              className="text-primary-300 hover:bg-primary-50 w-full border-t border-neutral-100 px-3 py-2 text-left text-sm font-medium transition-colors"
            >
              {props.createNewLabel ?? "+ Buat baru"}
            </button>
          )}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
}
