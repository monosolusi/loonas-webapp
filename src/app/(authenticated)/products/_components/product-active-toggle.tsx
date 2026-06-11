"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { MiniToggle } from "@/core/presentations/components/mini-toggle";
import { ProductType } from "@/features/product/domain/enums/product-type";
import { ProductEntity } from "@/features/product/domain/entities/product";
import { useProductList } from "@/app/(authenticated)/products/_providers/product-list-provider";

type ProductActiveToggleProps = {
  product: ProductEntity;
};

export function ProductActiveToggle({ product }: ProductActiveToggleProps) {
  const { handleToggleActive, handleToggleBlocked } = useProductList();

  const toggleState = product.metadata?.userActive ?? product.active;
  const [optimisticActive, setOptimisticActive] = useState(toggleState);
  const prevServerState = useRef(toggleState);

  useEffect(() => {
    const current = product.metadata?.userActive ?? product.active;
    if (current !== prevServerState.current) {
      setOptimisticActive(current);
      prevServerState.current = current;
    }
  }, [product.active, product.metadata?.userActive]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newActive = !optimisticActive;

    if (newActive && product.type === ProductType.MANUFACTURED && product.metadata?.recipeComplete === false) {
      const missingVariants = product.variants.filter((v) => v.metadata?.hasRecipe === false).map((v) => v.name);
      handleToggleBlocked(missingVariants);
      return;
    }

    setOptimisticActive(newActive);
    try {
      await handleToggleActive(product.id, newActive);
    } catch {
      setOptimisticActive(toggleState);
    }
  };

  return (
    <button type="button" onClick={handleToggle} className="flex flex-row items-center gap-x-2">
      <MiniToggle active={optimisticActive} />
      <span className={clsx("text-xs font-medium", optimisticActive ? "text-success-300" : "text-neutral-300")}>
        {optimisticActive ? "Aktif" : "Nonaktif"}
      </span>
    </button>
  );
}
