"use client";

import { Fragment, useState } from "react";
import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";

export type FilterOption = {
  label: string;
  value: string;
};

type FilterDropdownProps = {
  label: string;
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiple?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
};

export function FilterDropdown({
  label,
  options,
  selected,
  onChange,
  multiple = false,
  searchable = false,
  searchPlaceholder = "Cari...",
}: FilterDropdownProps) {
  const [search, setSearch] = useState("");

  const filteredOptions = searchable && search
    ? options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  const isActive = selected.length > 0;

  const handleToggle = (value: string) => {
    if (multiple) {
      const next = selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value];
      onChange(next);
    } else {
      onChange(selected.includes(value) ? [] : [value]);
    }
  };

  return (
    <Popover className="relative">
      <PopoverButton
        className={clsx(
          "flex flex-row items-center gap-x-1.5 rounded-lg border px-3 py-2 text-sm outline-none transition-colors",
          isActive
            ? "border-primary-300/30 bg-primary-300/5 text-primary-300"
            : "border-neutral-200 text-neutral-400 hover:border-neutral-300",
        )}
      >
        <span>{label}</span>
        <ChevronDownIcon className="size-4" />
      </PopoverButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-150"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <PopoverPanel className="absolute left-0 z-20 mt-2 w-[220px] rounded-lg border border-neutral-200 bg-white shadow-lg">
          {({ close }) => (
          <div className="flex flex-col">
            {searchable && (
              <div className="border-b border-neutral-100 px-3 py-2">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full text-sm text-neutral-500 outline-none placeholder:text-neutral-200"
                  autoFocus
                />
              </div>
            )}

            <div className="max-h-[240px] overflow-y-auto py-1">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-4 text-center text-sm text-neutral-200">Tidak ditemukan</div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = selected.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => { handleToggle(option.value); if (!multiple) close(); }}
                      className={clsx(
                        "flex w-full flex-row items-center gap-x-2.5 px-3 py-2 text-left text-sm transition-colors",
                        isSelected ? "bg-primary-300/5 text-primary-300" : "text-neutral-500 hover:bg-neutral-50",
                      )}
                    >
                      {multiple && (
                        <div
                          className={clsx(
                            "flex size-4 shrink-0 items-center justify-center rounded border",
                            isSelected ? "border-primary-300 bg-primary-300" : "border-neutral-200",
                          )}
                        >
                          {isSelected && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                      )}
                      <span className="truncate">{option.label}</span>
                    </button>
                  );
                })
              )}
            </div>

            {isActive && (
              <div className="border-t border-neutral-100 px-3 py-2">
                <button
                  type="button"
                  onClick={() => { onChange([]); setSearch(""); close(); }}
                  className="text-xs font-medium text-neutral-300 transition-colors hover:text-neutral-500"
                >
                  Hapus filter
                </button>
              </div>
            )}
          </div>
          )}
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}

type FilterPillProps = {
  label: string;
  onRemove: () => void;
};

export function FilterPill({ label, onRemove }: FilterPillProps) {
  return (
    <span className="inline-flex items-center gap-x-1 rounded-md bg-primary-300/10 px-2 py-0.5 text-xs font-medium text-primary-300">
      {label}
      <button type="button" onClick={onRemove} className="transition-colors hover:text-primary-400">
        <XMarkIcon className="size-3.5" />
      </button>
    </span>
  );
}
