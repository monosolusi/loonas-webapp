"use client";

import { useListProductCategories } from "@/features/product/presentations/hooks/use-list-product-categories";
import { CategoryChipsLoaded } from "@/app/(pos)/pos/_components/category-chips-loaded";
import { CategoryChipsLoading } from "@/app/(pos)/pos/_components/category-chips-loading";
import { usePos } from "@/app/(pos)/pos/_providers/pos-provider";

export function CategoryChips() {
  const { drilldownProduct } = usePos();
  const { categories, loading } = useListProductCategories();

  if (drilldownProduct !== null) return null;
  if (loading) return <CategoryChipsLoading />;
  return <CategoryChipsLoaded categories={categories} />;
}
