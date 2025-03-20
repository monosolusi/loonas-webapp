import React from "react";
import { Checkbox, Field } from "@headlessui/react";
import Link from "next/link";

export function AgreementCheckbox({ checked, onChange }: {
  checked?: boolean,
  onChange?: (checked: boolean) => void;
}) {
  return (
    <Field className="flex items-center gap-2">
      <Checkbox
        checked={checked}
        onChange={onChange}
        className="group block size-4 rounded border bg-white data-[checked]:bg-primary-default"
      >
        <svg
          fill="none"
          viewBox="0 0 14 14"
          className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
        >
          <path
            d="M3 8L6 11L11 3.5"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-0 group-data-[checked]:opacity-100"
          />
          <path
            d="M3 7H11"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-0 group-has-indeterminate:opacity-100"
          />
        </svg>
      </Checkbox>
      <div className="text-sm/6">
        <label htmlFor="comments" className="font-medium text-gray-500">
          Saya sudah baca dan setuju sama&nbsp;
          <Link href="#" className="text-primary-default">
            Kebijakan Privasi
          </Link> &nbsp;serta&nbsp;
          <Link href="#" className="text-primary-default">
            Syarat & Ketentuan.
          </Link>
        </label>
      </div>
    </Field>
  );
}