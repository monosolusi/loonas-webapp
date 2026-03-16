import Link from "next/link";
import Image from "next/image";
import { PaginationMeta } from "@/core/resources/paginated";
import { StatusChip } from "@/core/presentations/components/status-chip";
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
}

export function ProductTable({ rows, meta, currentPage, onPageChange }: ProductTableProps) {
  return (
    <>
      {rows.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          className="hover:border-l-primary-300 hover:bg-primary-50 grid cursor-pointer grid-cols-[2fr_1.5fr_1fr_0.7fr_1fr] items-center border-b border-l-4 border-neutral-100 border-l-transparent px-6 py-4 last:border-b-0"
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
          <div className="flex flex-row items-center gap-x-1.5">
            <StatusChip
              label={product.status === "active" ? "Aktif" : "Nonaktif"}
              variant={product.status === "active" ? "success" : "neutral"}
              compact
            />
          </div>
          <span className="text-right text-sm leading-5 font-semibold text-neutral-500">{product.displayPrice}</span>
        </Link>
      ))}

      <TablePagination displayedCount={rows.length} meta={meta} currentPage={currentPage} onPageChange={onPageChange} />
    </>
  );
}
