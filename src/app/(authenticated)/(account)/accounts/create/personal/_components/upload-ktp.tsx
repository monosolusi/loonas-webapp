"use client";

import React, { useRef } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { useCreatePersonalAccount } from "@/features/account/presentation/providers/create-personal-account";
import { Label } from "./label";

export function UploadKtp() {
  const { identityDocument, setIdentityDocument } = useCreatePersonalAccount();

  function handleDeleteFile() {
    setIdentityDocument?.(null);
  }

  return (
    <div className="col-span-full">
      <Label
        htmlFor="id-document"
        title="Kartu Identitas / KTP"
        description="Yuk, unggah dokumen KTP kamu. Boleh foto ataupun PDF!"
      />
      {(identityDocument && ["image/jpeg", "image/png"].includes(identityDocument.type)) &&
        <FullStateImage file={identityDocument} onDeleteFile={handleDeleteFile} />}

      {(identityDocument && identityDocument.type === "application/pdf") &&
        <FullStatePdf file={identityDocument} onDeleteFile={handleDeleteFile} />}

      {!identityDocument && <EmptyState onFileChange={setIdentityDocument} />}
    </div>
  );
}

function FullStatePdf({ file, onDeleteFile }: { file?: File | null, onDeleteFile?: () => void }) {
  return (
    <div className="mt-2 flex flex-col md:items-start">
      <div className="flex flex-row items-center bg-white px-6 py-4 rounded-md border border-primary-default">
        <span>{file && file.name}</span>
        <XCircleIcon
          aria-hidden="true"
          className="hidden sm:block ml-4 size-6 -mt-1 text-red-400 cursor-pointer"
          onClick={onDeleteFile}
        />
      </div>
      <button
        type="button"
        className="sm:hidden mt-2 w-full rounded-md bg-red-50 px-2.5 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-100"
        onClick={onDeleteFile}
      >
        Hapus Dokumen
      </button>
    </div>
  );
}

function FullStateImage({ file, onDeleteFile }: { file?: File | null, onDeleteFile?: () => void }) {
  return (
    <div className="mt-2 flex flex-col items-start">
      <div className="relative rounded-md w-auto overflow-hidden inline-block">
        <img
          alt="Loonas"
          src={(file && URL.createObjectURL(file)) || ""}
          className="w-full h-auto lg:w-auto lg:h-60"
        />
        <XCircleIcon
          aria-hidden="true"
          className="hidden sm:block absolute top-2 right-2 size-7 text-red-400 cursor-pointer"
          onClick={onDeleteFile}
        />
      </div>

      <button
        type="button"
        className="sm:hidden mt-2 w-full rounded-md bg-red-50 px-2.5 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-100"
        onClick={onDeleteFile}
      >
        Hapus Dokumen
      </button>
    </div>
  );
}

function EmptyState({ onFileChange }: { onFileChange?: (file: File | null) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFileChange?.(file);
  }

  return (
    <div
      className="cursor-pointer mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 bg-white"
      onClick={handleClick}
    >
      <div className="text-center">
        <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />
        <div className="mt-4 flex text-sm/6 text-gray-600">
          <label
            htmlFor="id-document"
            className="relative cursor-pointer rounded-md font-semibold text-primary-default focus-within:ring-2 foc-within:ring-primary-default focus-within:ring-offset-2 focus-within:outline-hidden hover:text-primary-default"
          >
            <span>Unggah KTP</span>
            <input
              ref={fileInputRef}
              onChange={handleFileChange}
              id="id-document"
              name="id-document"
              type="file"
              accept="image/jpeg, image/png, application/pdf"
              className="sr-only"
            />
          </label>
          <p className="pl-1">kamu disini.</p>
        </div>
        <p className="text-xs/5 text-gray-600">PNG, JPG, PDF up to 10MB</p>
      </div>
    </div>
  );
}