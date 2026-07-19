import { DocumentChartBarIcon } from "@heroicons/react/24/outline";

export function BalanceSheetEmptyBody() {
  return (
    <div className="flex flex-col items-center gap-y-3 px-6 py-12 text-center">
      <DocumentChartBarIcon className="size-8 text-neutral-200" />
      <p className="text-sm font-semibold text-neutral-300">Belum ada saldo per tanggal ini</p>
      <p className="max-w-sm text-sm text-neutral-300">
        Tidak ditemukan data akuntansi untuk tanggal yang dipilih. Pastikan jurnal sudah diisi untuk periode ini, atau
        pilih tanggal lain.
      </p>
    </div>
  );
}
