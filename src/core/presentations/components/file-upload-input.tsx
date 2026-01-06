"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";

type FileUploadInputBaseProps = {
  description?: string;
  onChange?: (file: File | null) => void;
  accept?: string;
  icon?: React.ReactNode;
  maxSize?: number;
  onError?: (error: string) => void;
};

type FileUploadInputWithLabel = FileUploadInputBaseProps & {
  label: string;
  noLabel?: false;
};

type FileUploadInputWithoutLabel = FileUploadInputBaseProps & {
  label?: string;
  noLabel: true;
};

export type FileUploadInputProps = FileUploadInputWithLabel | FileUploadInputWithoutLabel;

/**
 * File upload input component with drag and drop support.
 *
 * @param props
 * @constructor
 */
export function FileUploadInput(props: FileUploadInputProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (selectedFile: File | null) => {
      setError(null);

      if (selectedFile && props.maxSize && selectedFile.size > props.maxSize) {
        const maxSizeMB = (props.maxSize / (1024 * 1024)).toFixed(0);
        const errorMessage = `File terlalu besar. Maksimal ${maxSizeMB}MB`;
        setError(errorMessage);
        props.onError?.(errorMessage);
        return;
      }

      setFile(selectedFile);
      props.onChange?.(selectedFile);
    },
    [props],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    handleFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0] || null;
    handleFile(droppedFile);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2 transition-all">
      {!props.noLabel && <span className="text-base">{props.label}</span>}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col rounded-[10px] border border-solid bg-neutral-50 p-[22px] transition-colors ${
          isDragging ? "border-primary-300 bg-primary-50" : "border-neutral-100"
        }`}
      >
        <input ref={inputRef} type="file" accept={props.accept} onChange={handleInputChange} className="hidden" />

        {!file ? (
          // Empty State
          <div className="flex flex-col items-center gap-2">
            <div className="bg-primary-300/10 flex size-10 flex-col items-center justify-center rounded-full">
              <Image src="/assets/images/upload-icon-primary-w20-h20.svg" alt="Upload icon" width={20} height={20} />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-center text-base leading-6 font-normal text-neutral-500">
                Klik untuk upload file
              </span>
              <span className="text-center text-base leading-6 font-normal text-neutral-200">atau drag and drop</span>
            </div>
          </div>
        ) : (
          // File Selected State
          <div className="flex flex-row items-center gap-3">
            <div className="bg-primary-300/10 flex size-8 flex-col items-center justify-center rounded-lg">
              <Image src="/assets/images/file-icon-primary-w16-h16.svg" alt="File icon" width={16} height={16} />
            </div>
            <span className="flex-1 truncate text-base leading-6 font-normal text-neutral-500">{file.name}</span>
            <button type="button" onClick={handleRemove} className="shrink-0 cursor-pointer">
              <Image src="/assets/images/cross-icon-neutral-500-w16-h16.svg" alt="Remove file" width={16} height={16} />
            </button>
          </div>
        )}
      </div>
      {props.description && <span className="text-xs leading-4 font-normal text-neutral-200">{props.description}</span>}
      {error && <span className="text-xs leading-4 font-normal text-red-500">{error}</span>}
    </div>
  );
}
