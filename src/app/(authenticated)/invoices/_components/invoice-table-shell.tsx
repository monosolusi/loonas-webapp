import React from "react";

interface InvoiceTableShellProps {
  toolbar: React.ReactNode;
  header: React.ReactNode;
  loading: boolean;
  error: boolean;
  empty: boolean;
  emptyMessage: string;
  filteredEmpty?: boolean;
  filteredEmptyMessage?: string;
  children: React.ReactNode;
}

export function InvoiceTableShell({
  toolbar,
  header,
  loading,
  error,
  empty,
  emptyMessage,
  filteredEmpty,
  filteredEmptyMessage = "Tidak ada data yang cocok dengan pencarian.",
  children,
}: InvoiceTableShellProps) {
  const statusMessage = loading ? "Memuat data..." : error ? "Gagal memuat data faktur." : empty ? emptyMessage : null;

  return (
    <>
      {toolbar}
      <div className="overflow-hidden rounded-xl border border-neutral-100">
        {header}
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
    </>
  );
}
