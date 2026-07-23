import clsx from "clsx";

type TableContainerProps = {
  loading?: boolean;
  error?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  filteredEmpty?: boolean;
  filteredEmptyMessage?: string;
  /**
   * Wrap the table content in a horizontal-scroll region. Use for dense,
   * inherently wide tables (ledger, reports, profitability, COA) whose columns
   * must keep their desktop widths on mobile. The wide content sets its own
   * `min-w-[…]`; the container scrolls it. Leave off for browse lists that
   * reflow into stacked cards on mobile.
   */
  scrollable?: boolean;
  children: React.ReactNode;
};

export function TableContainer({
  loading,
  error,
  empty,
  emptyMessage = "Belum ada data.",
  filteredEmpty,
  filteredEmptyMessage = "Tidak ada data yang cocok dengan pencarian.",
  scrollable,
  children,
}: TableContainerProps) {
  const statusMessage = loading
    ? "Memuat data..."
    : error
      ? "Gagal memuat data."
      : empty
        ? emptyMessage
        : null;

  const message = statusMessage ?? (filteredEmpty ? filteredEmptyMessage : null);

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-100">
      {message ? (
        <div className="flex items-center justify-center px-4 py-12 text-center">
          <span className="text-sm text-neutral-300">{message}</span>
        </div>
      ) : (
        <div className={clsx(scrollable && "overflow-x-auto")}>{children}</div>
      )}
    </div>
  );
}
