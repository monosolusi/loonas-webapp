import React from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { Label } from "@/app/(account)/accounts/create/personal/_components/label";

export function UploadKtp() {
  return (
    <div className="col-span-full">
      <Label
        htmlFor="id-document"
        title="Kartu Identitas / KTP"
        description="Yuk, unggah dokumen KTP kamu. Boleh foto ataupun PDF!"
      />
      <div
        className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 bg-white">
        <div className="text-center">
          <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />
          <div className="mt-4 flex text-sm/6 text-gray-600">
            <label
              htmlFor="id-document"
              className="relative cursor-pointer rounded-md font-semibold text-primary-default focus-within:ring-2 foc-within:ring-primary-default focus-within:ring-offset-2 focus-within:outline-hidden hover:text-primary-default"
            >
              <span>Unggah KTP</span>
              <input
                id="id-document"
                name="id-document"
                type="file"
                accept="image/*, application/pdf"
                className="sr-only"
              />
            </label>
            <p className="pl-1">kamu disini.</p>
          </div>
          <p className="text-xs/5 text-gray-600">PNG, JPG, PDF up to 10MB</p>
        </div>
      </div>
    </div>
  );
}