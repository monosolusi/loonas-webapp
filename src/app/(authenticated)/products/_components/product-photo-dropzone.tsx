"use client";

import { useState } from "react";
import Image from "next/image";
import { Dropzone } from "@/core/presentations/components/dropzone";

type ProductPhotoDropzoneProps = {
  onFilesSelected: (files: File[]) => void;
};

export function ProductPhotoDropzone({ onFilesSelected }: ProductPhotoDropzoneProps) {
  const [error, setError] = useState<string | null>(null);

  const handleFiles = (files: File[]) => {
    const images = files.filter((f) => f.type.startsWith("image/"));
    if (images.length > 0) onFilesSelected(images);
  };

  return (
    <div className="flex flex-col gap-y-2">
      <Dropzone
        accept="image/png, image/jpeg, image/webp"
        multiple
        maxSize={10 * 1024 * 1024}
        onFiles={handleFiles}
        onError={setError}
      >
        <Image src="/assets/images/upload-icon-primary-w20-h20.svg" alt="" width={20} height={20} />
        <div className="flex flex-col items-center">
          <span className="text-sm text-neutral-500">Klik atau drag foto ke sini</span>
          <span className="text-xs text-neutral-200">JPEG, PNG, atau WebP, maks 10MB per foto</span>
        </div>
      </Dropzone>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
