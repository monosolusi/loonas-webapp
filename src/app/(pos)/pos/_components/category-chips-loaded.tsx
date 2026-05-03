"use client";

import { Chip } from "@/core/presentations/components/chip";
import { ProductCategoryEntity } from "@/features/product/domain/entities/product-category";
import { usePos } from "@/app/(pos)/pos/_providers/pos-provider";

type CategoryChipsLoadedProps = {
  categories: ProductCategoryEntity[];
};

export function CategoryChipsLoaded({ categories }: CategoryChipsLoadedProps) {
  const { selectedCategoryId, setSelectedCategoryId } = usePos();

  return (
    <div className="flex flex-row gap-x-2 overflow-x-auto py-1">
      <Chip label="Semua" active={selectedCategoryId === null} onClick={() => setSelectedCategoryId(null)} />
      {categories.map((cat) => (
        <Chip
          key={cat.id}
          label={cat.name}
          active={selectedCategoryId === cat.id}
          onClick={() => setSelectedCategoryId(cat.id)}
        />
      ))}
    </div>
  );
}
