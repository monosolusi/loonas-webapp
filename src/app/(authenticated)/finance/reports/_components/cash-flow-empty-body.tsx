import { DocumentChartBarIcon } from "@heroicons/react/24/outline";

export function CashFlowEmptyBody() {
  return (
    <div className="flex flex-col items-center gap-y-3 px-6 py-12 text-center">
      <DocumentChartBarIcon className="size-8 text-neutral-200" aria-hidden="true" />
      <p className="text-sm font-semibold text-neutral-300">Belum ada data arus kas untuk periode ini</p>
      <p className="max-w-sm text-sm text-neutral-300">
        Tidak ditemukan transaksi kas untuk rentang tanggal yang dipilih. Pastikan jurnal sudah diisi, atau pilih periode
        lain.
      </p>
    </div>
  );
}
