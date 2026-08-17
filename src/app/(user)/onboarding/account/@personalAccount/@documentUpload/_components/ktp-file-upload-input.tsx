"use client";

import React from "react";
import { FileUploadInput } from "@/core/presentations/components/file-upload-input";
import { usePersonalAccountData } from "@/app/(user)/onboarding/account/@personalAccount/_hooks/use-personal-account-data";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export function KtpFileUploadInput() {
  const { data, update, fieldError } = usePersonalAccountData();

  const onChange = (file: File | null) => update?.({ identityFile: file });

  return (
    <FileUploadInput
      label="Dokumen Identitas / KTP"
      required
      accept=".jpg,.jpeg,.png,.pdf"
      maxSize={MAX_SIZE_BYTES}
      // Controlled by the provider. Left uncontrolled, `FileUploadInput` kept its own copy of the
      // file, and because this step unmounts whenever the user steps away, coming back re-rendered
      // the empty "Klik untuk upload file" state while the provider still held the File — so the
      // dropzone looked empty and the old file was submitted anyway.
      value={data.identityFile ?? null}
      onChange={onChange}
      // A rejected pick (over the size cap) deliberately leaves the previously accepted file in
      // place rather than destroying a valid selection over a fat-finger — the component's own
      // size error says what happened, and `value` above means the file still on record is the
      // one on screen. Previously neither was true and the stale file went to the server silently.
      error={fieldError("identityFile")}
    />
  );
}
