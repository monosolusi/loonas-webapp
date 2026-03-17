"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { PaginationMeta } from "@/core/resources/paginated";
import { ProductStatus } from "@/features/product/domain/enums/product-status";
import { TablePagination } from "@/app/(authenticated)/invoices/_components/table-pagination";

export interface ProductTableRow {
  id: string;
  name: string;
  sku: string;
  category: string | null;
  status: string;
  displayPrice: string;
  variantCount: number;
  primaryPhotoUrl: string | null;
}

interface ProductTableProps {
  rows: ProductTableRow[];
  meta: PaginationMeta;
  currentPage: number;
  onPageChange: (page: number) => void;
  onToggleStatus?: (id: string, newStatus: string) => Promise<void>;
}

function MiniToggle({ active }: { active: boolean }) {
  return (
    <div
      className={clsx(
        "relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200",
        active ? "bg-success-300" : "bg-neutral-200",
      )}
    >
      <span
        className={clsx(
          "pointer-events-none mt-0.5 ml-0.5 inline-block size-4 transform rounded-full bg-white shadow transition duration-200",
          active ? "translate-x-4" : "translate-x-0",
        )}
      />
    </div>
  );
}

function ProductRow({
  product,
  onToggleStatus,
}: {
  product: ProductTableRow;
  onToggleStatus?: (id: string, newStatus: string) => Promise<void>;
}) {
  const [optimisticStatus, setOptimisticStatus] = useState(product.status);
  const prevServerStatus = useRef(product.status);
  const isActive = optimisticStatus === ProductStatus.ACTIVE;

  // Sync when server data actually changes (after revalidation)
  useEffect(() => {
    if (product.status !== prevServerStatus.current) {
      setOptimisticStatus(product.status);
      prevServerStatus.current = product.status;
    }
  }, [product.status]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onToggleStatus) return;

    const newStatus = isActive ? ProductStatus.INACTIVE : ProductStatus.ACTIVE;
    setOptimisticStatus(newStatus);

    try {
      await onToggleStatus(product.id, newStatus);
    } catch {
      setOptimisticStatus(product.status);
    }
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className={clsx(
        "hover:border-l-primary-300 hover:bg-primary-50 grid cursor-pointer grid-cols-[2fr_1.5fr_1fr_0.7fr_1fr] items-center border-b border-l-4 border-neutral-100 border-l-transparent px-6 py-4 last:border-b-0 transition-opacity",
        !isActive && "opacity-50",
      )}
    >
      <div className="flex flex-row items-center gap-x-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-neutral-50">
          {product.primaryPhotoUrl ? (
            <img src={product.primaryPhotoUrl} alt="" className="size-8 rounded-md object-cover" />
          ) : (
            <Image src="/assets/images/box-icon-neutral-300-w16-h16.svg" alt="" width={14} height={14} />
          )}
        </div>
        <div className="flex flex-col">
          <span className="truncate text-sm leading-5 font-semibold text-neutral-500">{product.name}</span>
          <span className="text-xs leading-4 text-neutral-200">{product.variantCount} varian</span>
        </div>
      </div>
      <span className="text-sm leading-5 text-neutral-400">{product.sku}</span>
      <span className="text-sm leading-5 text-neutral-400">{product.category ?? "-"}</span>
      <button
        type="button"
        onClick={handleToggle}
        className="flex flex-row items-center gap-x-2"
      >
        <MiniToggle active={isActive} />
        <span className={clsx("text-xs font-medium", isActive ? "text-success-300" : "text-neutral-300")}>
          {isActive ? "Aktif" : "Nonaktif"}
        </span>
      </button>
      <span className="text-right text-sm leading-5 font-semibold text-neutral-500">{product.displayPrice}</span>
    </Link>
  );
}

export function ProductTable({ rows, meta, currentPage, onPageChange, onToggleStatus }: ProductTableProps) {
  return (
    <>
      {rows.map((product) => (
        <ProductRow key={product.id} product={product} onToggleStatus={onToggleStatus} />
      ))}
      <TablePagination displayedCount={rows.length} meta={meta} currentPage={currentPage} onPageChange={onPageChange} />
    </>
  );
}
