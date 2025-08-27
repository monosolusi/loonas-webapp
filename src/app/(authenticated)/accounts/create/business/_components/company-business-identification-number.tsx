"use client";

import { ImageOrDocumentFileUpload } from "@/core/presentations/components/image-or-document-file-upload";
import React from "react";
import { useCreateBusinessAccountState } from "@/features/account/presentation/providers/create-business-account";

export function CompanyBusinessIdentificationNumber() {
  const { companyBusinessIdentificationNumber, setCompanyBusinessIdentificationNumber } =
    useCreateBusinessAccountState();

  return (
    <ImageOrDocumentFileUpload
      title="NIB (Nomor Induk Berusaha)"
      acceptedFormat={["image/png", "image/jpeg", "application/pdf"]}
      file={companyBusinessIdentificationNumber}
      onChange={setCompanyBusinessIdentificationNumber}
    />
  );
}
