import { SectionCard } from "@/core/presentations/components/section-card";
import { ProductPhotoUpload } from "@/app/(authenticated)/products/_components/product-photo-upload";

type ProductPhotoCardProps = {
  photos: File[];
  onPhotosChange: (photos: File[]) => void;
};

export function ProductPhotoCard({ photos, onPhotosChange }: ProductPhotoCardProps) {
  return (
    <SectionCard title="Foto Produk" iconSrc="/assets/images/box-icon-primary-300-w16-h16.svg">
      <ProductPhotoUpload photos={photos} onChange={onPhotosChange} />
    </SectionCard>
  );
}
