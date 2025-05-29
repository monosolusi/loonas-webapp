"use client";

import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { ImageOrDocumentFileUpload } from "@/core/presentations/components/image-or-document-file-upload";
import React from "react";

export function SignatureInput() {
  const { signature, setSignature } = useCreateOutgoingInvoice();

  return (
    <ImageOrDocumentFileUpload
      title="Tanda Tangan"
      file={signature}
      onChange={setSignature}
      acceptedFormat={["image/png", "image/jpeg"]}
      acceptedFormatDescription="JPG, JPEG, PNG up to 10MB"
    />
  );
}
