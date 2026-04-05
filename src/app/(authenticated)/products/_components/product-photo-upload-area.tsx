"use client";

import { ProductPhotoGrid, ExistingPhoto } from "@/app/(authenticated)/products/_components/product-photo-grid";
import { ProductPhotoDropzone } from "@/app/(authenticated)/products/_components/product-photo-dropzone";

export type { ExistingPhoto };

type ProductPhotoUploadAreaProps = {
  existingPhotos?: ExistingPhoto[];
  newPhotos: File[];
  onNewPhotosChange: (photos: File[]) => void;
  onDeleteExisting?: (photoId: string) => void;
  maxFiles?: number;
};

export function ProductPhotoUploadArea({
  existingPhotos = [],
  newPhotos,
  onNewPhotosChange,
  onDeleteExisting,
  maxFiles = 5,
}: ProductPhotoUploadAreaProps) {
  const totalCount = existingPhotos.length + newPhotos.length;

  const handleFilesSelected = (files: File[]) => {
    const remaining = maxFiles - existingPhotos.length;
    const combined = [...newPhotos, ...files].slice(0, remaining);
    onNewPhotosChange(combined);
  };

  const handleDeleteNew = (index: number) => {
    onNewPhotosChange(newPhotos.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-y-3">
      <ProductPhotoGrid
        existingPhotos={existingPhotos}
        newPhotos={newPhotos}
        onDeleteExisting={onDeleteExisting}
        onDeleteNew={handleDeleteNew}
      />
      {totalCount < maxFiles && <ProductPhotoDropzone onFilesSelected={handleFilesSelected} />}
      {totalCount > 0 && (
        <span className="text-xs text-neutral-200">
          {totalCount} dari {maxFiles} foto
        </span>
      )}
    </div>
  );
}
