import React from "react";
import { Label } from "@/app/(account)/accounts/create/personal/_components/label";

export function FullName() {
  return (
    <div className="sm:col-span-full grid grid-cols-6">
      <div className="sm:col-span-4">
        <Label
          htmlFor="full-name"
          title="Nama Lengkap"
          description="Isi nama lengkapmu persis seperti yang tertera di kartu identitas."
        />
        <div className="mt-2">
          <input
            id="full-name"
            name="full-name"
            type="text"
            autoComplete="name"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-default sm:text-sm/6"
          />
        </div>
      </div>
    </div>
  );
}