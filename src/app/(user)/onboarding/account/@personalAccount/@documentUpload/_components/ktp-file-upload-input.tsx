"use client";

import React from "react";
import { FileUploadInput } from "@/core/presentations/components/file-upload-input";
import {
  usePersonalAccountData
} from "@/app/(user)/onboarding/account/@personalAccount/_providers/use-create-personal-account-data";

export function KtpFileUploadInput() {
  const { update } = usePersonalAccountData();

  const onChange = (file: File | null) => {
    update?.({ identityFile: file });
  };

  return (
    <FileUploadInput
      label="Dokumen Identitas / KTP"
      accept=".jpg,.jpeg,.png,.pdf"
      maxSize={5 * 1024 * 1024}
      onChange={onChange}
    />
  );
}
