"use client";

import React, {useRef, useState} from "react";
import {OutlinedButton} from "@/core/presentations/components/outlined-button";
import {
  InvoiceDetailsDialogImpl
} from "@/app/(authenticated)/invoices/incoming/create/@upload/_components/invoice-details-dialog-impl";
import {
  MaxInvoiceErrorDialog
} from "@/app/(authenticated)/invoices/incoming/create/@upload/_components/max-invoice-error-dialog";
import {useCreateIncomingInvoice} from "@/features/invoice/presentations/providers/create-incoming-invoice";

export function UploadButton() {
  const {invoiceDocuments} = useCreateIncomingInvoice();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [maxInvoiceDialogOpen, setMaxInvoiceDialogOpen] = useState<boolean>(false);

  const handleClick = () => {
    if (!fileInputRef.current) return;
    if (invoiceDocuments.length >= 5) {
      setMaxInvoiceDialogOpen(true);
      return;
    }

    fileInputRef.current.click();
  }

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
      <OutlinedButton onClick={handleClick}>
        Upload Faktur
      </OutlinedButton>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept=".pdf,.png,.jpg,.jpeg"
      />

      <InvoiceDetailsDialogImpl open={isDialogOpen} setOpen={setIsDialogOpen} selectedFile={selectedFile}/>
      <MaxInvoiceErrorDialog open={maxInvoiceDialogOpen} onClose={() => setMaxInvoiceDialogOpen(false)}/>
    </>
  );
}
