"use client";

import { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/16/solid";

export type ExistingPhoto = {
  id: string;
  url: string;
};

type ProductPhotoGridProps = {
  existingPhotos: ExistingPhoto[];
  newPhotos: File[];
  onDeleteExisting?: (photoId: string) => void;
  onDeleteNew: (index: number) => void;
};

export function ProductPhotoGrid({ existingPhotos, newPhotos, onDeleteExisting, onDeleteNew }: ProductPhotoGridProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const urls = newPhotos.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => urls.forEach(URL.revokeObjectURL);
  }, [newPhotos]);

  if (existingPhotos.length === 0 && newPhotos.length === 0) return null;

  return (
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
            onClick={() => onDeleteNew(index)}
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
  );
}
