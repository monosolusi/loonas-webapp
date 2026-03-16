"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import clsx from "clsx";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { SectionCard } from "@/core/presentations/components/section-card";
import { ProductPhotoEntity } from "@/features/product/domain/entities/product-photo";

export type ExistingPhoto = {
  id: string;
  url: string;
};

type ProductPhotoCardProps = {
  existingPhotos?: ExistingPhoto[];
  newPhotos: File[];
  onNewPhotosChange: (photos: File[]) => void;
  onDeleteExisting?: (photoId: string) => void;
  maxFiles?: number;
  maxSize?: number;
};

export function ProductPhotoCard({
  existingPhotos = [],
  newPhotos,
  onNewPhotosChange,
  onDeleteExisting,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024,
}: ProductPhotoCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const urls = newPhotos.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => urls.forEach(URL.revokeObjectURL);
  }, [newPhotos]);

  const totalCount = existingPhotos.length + newPhotos.length;

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setError(null);

    const added: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;
      if (file.size > maxSize) {
        setError(`File terlalu besar. Maksimal ${(maxSize / (1024 * 1024)).toFixed(0)}MB`);
        continue;
      }
      added.push(file);
    }

    const remaining = maxFiles - existingPhotos.length;
    const combined = [...newPhotos, ...added].slice(0, remaining);
    onNewPhotosChange(combined);
  };

  const handleRemoveNew = (index: number) => {
    onNewPhotosChange(newPhotos.filter((_, i) => i !== index));
  };

  return (
    <SectionCard title="Foto Produk" iconSrc="/assets/images/box-icon-primary-300-w16-h16.svg">
      <div className="flex flex-col gap-y-3">
        {totalCount > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {existingPhotos.map((photo, index) => (
              <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-lg border border-neutral-100">
                <img src={photo.url} alt="" className="size-full object-cover" />
                {onDeleteExisting && (
                  <button
                    type="button"
                    onClick={() => onDeleteExisting(photo.id)}
                    className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <XMarkIcon className="size-4" />
                  </button>
                )}
                {index === 0 && (
                  <span className="absolute bottom-1.5 left-1.5 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    Utama
                  </span>
                )}
              </div>
            ))}

            {previewUrls.map((url, index) => (
              <div key={url} className="group relative aspect-square overflow-hidden rounded-lg border border-dashed border-primary-300/30">
                <img src={url} alt="" className="size-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveNew(index)}
                  className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <XMarkIcon className="size-4" />
                </button>
                {existingPhotos.length === 0 && index === 0 && (
                  <span className="absolute bottom-1.5 left-1.5 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    Utama
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {totalCount < maxFiles && (
          <div
            onClick={() => inputRef.current?.click()}
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
              accept="image/png, image/jpeg, image/webp"
              multiple
              onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
              className="hidden"
            />
            <Image src="/assets/images/upload-icon-primary-w20-h20.svg" alt="" width={20} height={20} />
            <div className="flex flex-col items-center">
              <span className="text-sm text-neutral-500">Klik atau drag foto ke sini</span>
              <span className="text-xs text-neutral-200">JPEG, PNG, atau WebP, maks 10MB per foto</span>
            </div>
          </div>
        )}

        {error && <span className="text-xs text-red-500">{error}</span>}
        {totalCount > 0 && (
          <span className="text-xs text-neutral-200">{totalCount} dari {maxFiles} foto</span>
        )}
      </div>
    </SectionCard>
  );
}

export function productPhotosToExisting(photos: ProductPhotoEntity[]): ExistingPhoto[] {
  return photos.map((p) => ({ id: p.id, url: p.publicUrl }));
}
