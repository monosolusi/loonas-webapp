import { SectionCard } from "@/core/presentations/components/section-card";
import { CategorySelect } from "@/app/(authenticated)/products/_components/category-select";

type ProductCategoryCardProps = {
  categoryId: string | undefined;
  onCategoryChange: (categoryId: string | undefined) => void;
};

export function ProductCategoryCard({ categoryId, onCategoryChange }: ProductCategoryCardProps) {
  return (
    <SectionCard title="Kategori" iconSrc="/assets/images/box-icon-primary-300-w16-h16.svg">
      <CategorySelect value={categoryId} onChange={onCategoryChange} />
    </SectionCard>
  );
}
