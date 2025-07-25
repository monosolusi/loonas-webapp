"use client";

import { ImageOrDocumentFileUpload } from "@/core/presentations/components/image-or-document-file-upload";
import React from "react";
import { useCreateBusinessAccountState } from "@/features/account/presentation/providers/create-business-account";

export function CompanyMostRecentDeedOfAmendment() {
  const { companyMostRecentDeedOfAmendment, setCompanyMostRecentDeedOfAmendment } = useCreateBusinessAccountState();

  return (
    <ImageOrDocumentFileUpload
      title="Perubahan Terbaru"
      acceptedFormat={["image/png", "image/jpeg", "application/pdf"]}
      file={companyMostRecentDeedOfAmendment}
      onChange={setCompanyMostRecentDeedOfAmendment}
    />
  );
}
