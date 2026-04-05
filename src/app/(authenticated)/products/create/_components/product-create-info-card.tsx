"use client";

import { SectionCard } from "@/core/presentations/components/section-card";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { ProductType } from "@/features/product/domain/enums/product-type";
import { ProductPhotoUploadArea } from "@/app/(authenticated)/products/_components/product-photo-upload-area";
import { useProductCreate } from "@/app/(authenticated)/products/create/_providers/product-create-provider";

export function ProductCreateInfoCard() {
  const { form } = useProductCreate();

  const showPhotos = form.type !== ProductType.SERVICE;

  return (
    <SectionCard title="Informasi Produk" iconSrc="/assets/images/box-icon-primary-300-w16-h16.svg">
      <div className="flex flex-col gap-y-6">
        <div className="flex flex-col gap-y-4">
          <TextInput label="Nama Produk" placeholder="Masukkan nama produk" value={form.name} onChange={form.setName} required />
          <TextInput label="SKU" placeholder="Masukkan SKU produk" value={form.sku} onChange={form.setSku} required />
        </div>
        {showPhotos && (
          <div className="flex flex-col gap-y-2">
            <span className="text-sm font-medium text-neutral-500">Foto Produk</span>
            <ProductPhotoUploadArea
              newPhotos={form.photos}
              onNewPhotosChange={form.setPhotos}
            />
          </div>
        )}
      </div>
    </SectionCard>
  );
}
