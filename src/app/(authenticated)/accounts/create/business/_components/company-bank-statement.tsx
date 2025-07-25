"use client";

import { ImageOrDocumentFileUpload } from "@/core/presentations/components/image-or-document-file-upload";
import React from "react";
import { useCreateBusinessAccountState } from "@/features/account/presentation/providers/create-business-account";

export function CompanyBankStatement() {
  const { companyBankStatement, setCompanyBankStatement } = useCreateBusinessAccountState();

  return (
    <ImageOrDocumentFileUpload
      title="Rekening Koran"
      acceptedFormat={["image/png", "image/jpeg", "application/pdf"]}
      file={companyBankStatement}
      onChange={setCompanyBankStatement}
    />
  );
}
