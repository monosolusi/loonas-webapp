"use client";

import { ImageOrDocumentFileUpload } from "@/core/presentations/components/image-or-document-file-upload";
import React from "react";
import { useCreateBusinessAccountState } from "@/features/account/presentation/providers/create-business-account";

export function DirectorNationalIdentityCard(props: { className?: string }) {
  const { directorNationalIdentityCard, setDirectorNationalIdentityCard } = useCreateBusinessAccountState();

  return (
    <ImageOrDocumentFileUpload
      className={props.className}
      title="KTP Direksi"
      acceptedFormat={["image/png", "image/jpeg", "application/pdf"]}
      file={directorNationalIdentityCard}
      onChange={setDirectorNationalIdentityCard}
    />
  );
}
