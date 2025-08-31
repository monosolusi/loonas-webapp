"use client";

import { ImageOrDocumentFileUpload } from "@/core/presentations/components/image-or-document-file-upload";
import React from "react";
import { useCreateBusinessAccountState } from "@/features/account/presentation/providers/create-business-account";

export function CompanyDeedOfEstablishment() {
  const { companyDeedOfEstablishment, setCompanyDeedOfEstablishment } = useCreateBusinessAccountState();

  return (
    <ImageOrDocumentFileUpload
      title="Akta Pendirian"
      acceptedFormat={["image/png", "image/jpeg", "application/pdf"]}
      file={companyDeedOfEstablishment}
      onChange={setCompanyDeedOfEstablishment}
    />
  );
}
