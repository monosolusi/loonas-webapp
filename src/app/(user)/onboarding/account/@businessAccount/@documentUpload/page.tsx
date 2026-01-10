"use client";

import React from "react";
import { useCreateAccount } from "@/app/(user)/onboarding/account/_providers/create-account";
import { FileUploadInput } from "@/core/presentations/components/file-upload-input";

export default function DocumentUploadPage() {
  const { type, currentStep } = useCreateAccount();

  if (!(type === "business" && currentStep === "business.documents")) return null;
  return (
    <>
      <div className="mb-6 flex flex-col">
        <span className="text-lg leading-6 font-medium text-neutral-500">Dokumen Legal</span>
        <span className="text-sm leading-5 font-medium text-neutral-200">Unggah dokumen legalitas perusahaan</span>
      </div>
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex flex-col gap-1 rounded-xl border border-neutral-200 bg-[#F8F9FA] p-4">
          <span className="text-base leading-6 font-medium text-neutral-500">Panduan Upload:</span>
          <ul className="list-none gap-1 pl-5 text-sm leading-5 font-normal text-neutral-200">
            <li>Pastikan dokumen terbaca jelas</li>
            <li>Format yang didukung: JPG, PNG, PDF (Max 5MB)</li>
          </ul>
        </div>
        <FileUploadInput label="Akta Pendirian" accept=".jpg,.jpeg,.png,.pdf" maxSize={5 * 1024 * 1024} />
        <FileUploadInput label="Perubahan Terbaru" accept=".jpg,.jpeg,.png,.pdf" maxSize={5 * 1024 * 1024} />
        <FileUploadInput label="NIB (Nomor Induk Berusaha)" accept=".jpg,.jpeg,.png,.pdf" maxSize={5 * 1024 * 1024} />
        <FileUploadInput label="KTP Direksi" accept=".jpg,.jpeg,.png,.pdf" maxSize={5 * 1024 * 1024} />
        <FileUploadInput label="Laporan Keuangan" accept=".jpg,.jpeg,.png,.pdf" maxSize={5 * 1024 * 1024} />
      </div>
    </>
  );
}
