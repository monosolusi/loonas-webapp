"use client";

import React from "react";
import { Label } from "./label";
import { useCreatePersonalAccount } from "@/features/account/presentation/providers/create-personal-account";


export function KtpNumber() {
  const { idNumber, setIdNumber } = useCreatePersonalAccount();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let newValue = e.target.value.replace(/\D/g, "").slice(0, 16);
    setIdNumber?.(newValue);
  }

  return (
    <div className="sm:col-span-3">
      <Label
        htmlFor="id-number"
        title="Nomor Identitas / Nomor KTP"
        description="Masukan 16 digit nomor KTP kamu!"
      />
      <div className="mt-2">
        <input
          id="id-document"
          name="id-document"
          type="text"
          value={idNumber}
          onChange={handleChange}
          pattern="^[0-9]*$"
          inputMode="numeric"
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-default sm:text-sm/6"
          required
        />
      </div>
    </div>
  );
}