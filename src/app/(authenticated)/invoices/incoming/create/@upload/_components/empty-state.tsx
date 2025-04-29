import React from "react";
import { DocumentIcon } from "@heroicons/react/24/solid";
import { UploadButton } from "@/app/(authenticated)/invoices/incoming/create/@upload/_components/upload-button";

export function EmptyState() {
  return (
    <div
      className="mt-8 text-center py-12 px-4 sm:px-6 lg:px-8 bg-white rounded-lg border border-dashed border-gray-300"
    >
      <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        Belum ada faktur
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Mulai dengan mengupload faktur yang ingin kamu bayarkan.
      </p>
      <div className="mt-6">
        <div className="flex justify-center">
          <UploadButton />
        </div>
      </div>
    </div>
  );
}