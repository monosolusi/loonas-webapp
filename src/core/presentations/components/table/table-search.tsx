"use client";

import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";

type TableSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function TableSearch({ value, onChange, placeholder = "Cari..." }: TableSearchProps) {
  // Standard: search is always right-pinned in the toolbar row. `sm:ml-auto` keeps it
  // right even when it is the sole toolbar control (no left-hand filters).
  return (
    <div className="w-full sm:ml-auto sm:w-[280px]">
      <TextInput
        label=""
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        leftIcon={<Image src="/assets/images/search-icon-neutral-400-w20-h20.svg" alt="" width={20} height={20} />}
        rightIcon={
          value ? (
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex items-center justify-center text-neutral-200 hover:text-neutral-400"
            >
              <XMarkIcon className="size-4" />
            </button>
          ) : undefined
        }
      />
    </div>
  );
}
