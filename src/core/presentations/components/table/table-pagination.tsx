import clsx from "clsx";
import { PaginationMeta } from "@/core/resources/paginated";

interface TablePaginationProps {
  displayedCount: number;
  meta: PaginationMeta;
  currentPage: number;
  onPageChange: (page: number) => void;
  countLabel?: string;
}

export function TablePagination({ displayedCount, meta, currentPage, onPageChange, countLabel = "data" }: TablePaginationProps) {
  const totalPages = meta.totalPages;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-row items-center justify-between border-t border-neutral-100 px-6 py-3">
      <span className="text-sm leading-5 text-neutral-300">
        Menampilkan {displayedCount} dari {meta.total} {countLabel}
      </span>
      <div className="flex flex-row items-center gap-x-2">
        <button
          className="flex size-8 items-center justify-center rounded-lg text-neutral-200 hover:bg-neutral-100 disabled:opacity-50"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          &#8249;
        </button>
        {pageNumbers.map((page) => (
          <button
            key={page}
            className={clsx(
              "flex size-8 items-center justify-center rounded-full text-sm font-medium",
              page === currentPage ? "bg-neutral-500 text-neutral-50" : "text-neutral-200 hover:bg-neutral-100",
            )}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="flex size-8 items-center justify-center rounded-lg text-neutral-200 hover:bg-neutral-100 disabled:opacity-50"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          &#8250;
        </button>
      </div>
    </div>
  );
}
