"use client";

import { ImageOrDocumentFileUpload } from "@/core/presentations/components/image-or-document-file-upload";
import React from "react";
import { useCreateBusinessAccountState } from "@/features/account/presentation/providers/create-business-account";

export function CompanyFinancialStatement() {
  const { companyFinancialStatement, setCompanyFinancialStatement } = useCreateBusinessAccountState();

  return (
    <ImageOrDocumentFileUpload
      title="Laporan Keuangan"
      acceptedFormat={["image/png", "image/jpeg", "application/pdf"]}
      file={companyFinancialStatement}
      onChange={setCompanyFinancialStatement}
    />
  );
}
