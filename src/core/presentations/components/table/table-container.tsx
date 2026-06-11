type TableContainerProps = {
  loading?: boolean;
  error?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  filteredEmpty?: boolean;
  filteredEmptyMessage?: string;
  children: React.ReactNode;
};

export function TableContainer({
  loading,
  error,
  empty,
  emptyMessage = "Belum ada data.",
  filteredEmpty,
  filteredEmptyMessage = "Tidak ada data yang cocok dengan pencarian.",
  children,
}: TableContainerProps) {
  const statusMessage = loading
    ? "Memuat data..."
    : error
      ? "Gagal memuat data."
      : empty
        ? emptyMessage
        : null;

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-100">
      {statusMessage ? (
        <div className="flex items-center justify-center py-12">
          <span className="text-sm text-neutral-300">{statusMessage}</span>
        </div>
      ) : filteredEmpty ? (
        <div className="flex items-center justify-center py-12">
          <span className="text-sm text-neutral-300">{filteredEmptyMessage}</span>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
