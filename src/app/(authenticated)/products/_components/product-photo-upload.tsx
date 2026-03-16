"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import clsx from "clsx";
import { XMarkIcon } from "@heroicons/react/16/solid";

type ProductPhotoUploadProps = {
  photos: File[];
  onChange: (photos: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
};

export function ProductPhotoUpload({ photos, onChange, maxFiles = 5, maxSize = 2 * 1024 * 1024 }: ProductPhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const urls = photos.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => urls.forEach(URL.revokeObjectURL);
  }, [photos]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setError(null);

    const newFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;
      if (file.size > maxSize) {
        setError(`File terlalu besar. Maksimal ${(maxSize / (1024 * 1024)).toFixed(0)}MB`);
        continue;
      }
      newFiles.push(file);
    }

    const combined = [...photos, ...newFiles].slice(0, maxFiles);
    onChange(combined);
  };

  const handleRemove = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  const handleClick = () => inputRef.current?.click();

  return (
    <div className="flex flex-col gap-y-3">
      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {previewUrls.map((url, index) => (
            <div key={url} className="group relative aspect-square overflow-hidden rounded-lg border border-neutral-100">
              <img src={url} alt="" className="size-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <XMarkIcon className="size-4" />
              </button>
              {index === 0 && (
                <span className="absolute bottom-1.5 left-1.5 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  Utama
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {photos.length < maxFiles && (
        <div
          onClick={handleClick}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
          className={clsx(
            "flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed p-6 transition-colors",
            isDragging ? "border-primary-300 bg-primary-300/5" : "border-neutral-200 bg-neutral-50 hover:border-neutral-300",
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/png, image/jpeg"
            multiple
            onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
            className="hidden"
          />
          <Image src="/assets/images/upload-icon-primary-w20-h20.svg" alt="" width={20} height={20} />
          <div className="flex flex-col items-center">
            <span className="text-sm text-neutral-500">Klik atau drag foto ke sini</span>
            <span className="text-xs text-neutral-200">PNG atau JPG, maks 2MB per foto</span>
          </div>
        </div>
      )}

      {error && <span className="text-xs text-red-500">{error}</span>}
      {photos.length > 0 && (
        <span className="text-xs text-neutral-200">{photos.length} dari {maxFiles} foto</span>
      )}
    </div>
  );
}
