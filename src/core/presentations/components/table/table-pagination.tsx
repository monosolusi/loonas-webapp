import clsx from "clsx";
import { PaginationMeta } from "@/core/resources/paginated";

interface TablePaginationProps {
  displayedCount: number;
  meta: PaginationMeta;
  currentPage: number;
  onPageChange: (page: number) => void;
  countLabel?: string;
}

/**
 * Compact page window: first · … · current±1 · … · last (max ~7 slots) so the
 * control never overflows on mobile, however many pages there are.
 */
function pageWindow(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "ellipsis")[] = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  if (left > 2) pages.push("ellipsis");
  for (let page = left; page <= right; page++) pages.push(page);
  if (right < total - 1) pages.push("ellipsis");

  pages.push(total);
  return pages;
}

export function TablePagination({ displayedCount, meta, currentPage, onPageChange, countLabel = "data" }: TablePaginationProps) {
  const totalPages = meta.totalPages;
  const pages = pageWindow(currentPage, totalPages);

  return (
    <div className="flex flex-col gap-3 border-t border-neutral-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <span className="text-sm leading-5 text-neutral-300">
        Menampilkan {displayedCount} dari {meta.total} {countLabel}
      </span>
      <div className="flex flex-row items-center gap-x-1 sm:gap-x-2">
        <button
          className="flex size-8 items-center justify-center rounded-lg text-neutral-200 hover:bg-neutral-100 disabled:opacity-50"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Halaman sebelumnya"
        >
          &#8249;
        </button>
        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="flex size-8 items-center justify-center text-sm text-neutral-200">
              &#8230;
            </span>
          ) : (
            <button
              key={page}
              className={clsx(
                "flex size-8 items-center justify-center rounded-full text-sm font-medium",
                page === currentPage ? "bg-neutral-500 text-neutral-50" : "text-neutral-200 hover:bg-neutral-100",
              )}
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          ),
        )}
        <button
          className="flex size-8 items-center justify-center rounded-lg text-neutral-200 hover:bg-neutral-100 disabled:opacity-50"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Halaman berikutnya"
        >
          &#8250;
        </button>
      </div>
    </div>
  );
}
