"use client";

import React, { useRef, useState } from "react";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";
import {
  InvoiceDetailsDialog
} from "@/app/(authenticated)/invoices/incoming/create/@upload/_components/invoice-details-dialog";

export function UploadButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return null;

    const file = files.item(0);
    const acceptedFileTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!file) return null;
    if (!acceptedFileTypes.includes(file.type)) return null;

    setSelectedFile(file);
    setIsDialogOpen(true);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center rounded-md bg-primary-default px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-default"
      >
        <DocumentPlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
        Upload Faktur
      </button>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept=".pdf,.png,.jpg,.jpeg"
      />

      <InvoiceDetailsDialog open={isDialogOpen} setOpen={setIsDialogOpen} selectedFile={selectedFile} />
    </>
  );
}