import { InformationCircleIcon } from "@heroicons/react/24/outline";

export function IncomeStatementMigrationNotice() {
  return (
    <div
      role="note"
      aria-label="Informasi periode migrasi"
      className="rounded-lg border border-primary-100 bg-primary-50 px-4 py-3"
    >
      <div className="flex gap-3">
        <InformationCircleIcon className="mt-0.5 size-5 shrink-0 text-primary-300" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-primary-400">
            Periode migrasi — laporan dimulai dari tanggal pindah
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            Laba Rugi ini hanya mencakup aktivitas sejak tanggal migrasi Anda ke Loonas. Laba atau rugi sebelum tanggal
            tersebut sudah tercatat di akun Saldo Laba Ditahan Periode Sebelumnya (ekuitas), sehingga tidak ada data
            yang hilang.
          </p>
        </div>
      </div>
    </div>
  );
}
