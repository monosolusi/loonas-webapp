"use client";

import React, { useRef, useState } from "react";
import {
  InvoiceDetailsDialog
} from "@/app/(authenticated)/invoices/incoming/create/@upload/_components/invoice-details-dialog";
import { FilledButton } from "@/core/presentations/components/filled-button";

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
      <FilledButton onClick={handleClick}>
        Upload Faktur
      </FilledButton>
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