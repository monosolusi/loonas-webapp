"use client";

import { Label } from "@/core/presentations/components/label";
import { XCircleIcon } from "@heroicons/react/20/solid";
import React, { useRef } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";

type AcceptedFormat = "image/png" | "image/jpeg" | "application/pdf";

interface ImageFileUploadProps {
  title: string;
  description?: string;
  file?: File | null;
  onChange?: (file: File | null) => void | Promise<void>;
  acceptedFormatDescription?: string;
  acceptedFormat: AcceptedFormat[];
  className?: string;
}

interface FullStateImageProps {
  file?: File | null;
  onDeleteFile?: () => void;
}

interface FullStatePdfProps extends FullStateImageProps {}

type EmptyStateProps = Pick<ImageFileUploadProps, "onChange" | "file" | "acceptedFormatDescription" | "acceptedFormat">;

function FullStateImage(props: FullStateImageProps) {
  if (!props.file) return null;
  if (!["image/jpeg", "image/png"].includes(props.file.type)) return null;
  return (
    <div className="mt-2 flex flex-col items-start">
      <div className="relative inline-block w-auto overflow-hidden rounded-md">
        <img
          alt="Loonas"
          src={(props.file && URL.createObjectURL(props.file)) || ""}
          className="h-auto w-full lg:h-60 lg:w-auto"
        />
        <XCircleIcon
          aria-hidden="true"
          className="absolute top-2 right-2 hidden size-7 cursor-pointer text-red-400 sm:block"
          onClick={props.onDeleteFile}
        />
      </div>

      <button
        type="button"
        className="mt-2 w-full rounded-md bg-red-50 px-2.5 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-100 sm:hidden"
        onClick={props.onDeleteFile}
      >
        Hapus Dokumen
      </button>
    </div>
  );
}

function FullStatePdf(props: FullStatePdfProps) {
  if (!props.file) return null;
  if (!(props.file.type === "application/pdf")) return null;
  return (
    <div className="mt-2 flex flex-col md:items-start">
      <div className="border-primary-default flex flex-row items-center rounded-md border bg-white px-6 py-4">
        <span>{props.file && props.file.name}</span>
        <XCircleIcon
          aria-hidden="true"
          className="-mt-1 ml-4 hidden size-6 cursor-pointer text-red-400 sm:block"
          onClick={props.onDeleteFile}
        />
      </div>
      <button
        type="button"
        className="mt-2 w-full rounded-md bg-red-50 px-2.5 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-100 sm:hidden"
        onClick={props.onDeleteFile}
      >
        Hapus Dokumen
      </button>
    </div>
  );
}

function EmptyState(props: EmptyStateProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => inputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    if (!props.onChange) return;

    const file = e.target.files[0];
    props.onChange(file);
  };

  if (props.file) return null;
  return (
    <div
      className="mt-2 flex cursor-pointer justify-center rounded-lg border border-dashed border-gray-900/25 bg-white px-6 py-10"
      onClick={handleClick}
    >
      <div className="text-center">
        <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />
        <div className="mt-4 flex text-sm/6 text-gray-600">
          <label
            htmlFor="id-document"
            className="text-primary-default foc-within:ring-primary-default hover:text-primary-default relative cursor-pointer rounded-md font-semibold focus-within:ring-2 focus-within:ring-offset-2 focus-within:outline-hidden"
          >
            <span>Unggah Dokumen</span>
            <input
              ref={inputRef}
              onChange={handleFileChange}
              type="file"
              accept={props.acceptedFormat.join(", ")}
              className="sr-only"
            />
          </label>
          <p className="pl-1">kamu disini.</p>
        </div>
        <p className="text-xs/5 text-gray-600">{props.acceptedFormatDescription}</p>
      </div>
    </div>
  );
}

export function ImageOrDocumentFileUpload(props: ImageFileUploadProps) {
  const handleDeleteFile = () => {
    if (props.onChange) props.onChange(null);
  };

  return (
    <div className={props.className}>
      <Label title={props.title} description={props.description} />
      <FullStateImage file={props.file} onDeleteFile={handleDeleteFile} />
      <FullStatePdf file={props.file} onDeleteFile={handleDeleteFile} />
      <EmptyState
        file={props.file}
        onChange={props.onChange}
        acceptedFormatDescription={props.acceptedFormatDescription}
        acceptedFormat={props.acceptedFormat}
      />
    </div>
  );
}
