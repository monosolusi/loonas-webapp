export function OverheadAccountsEmpty() {
  return (
    <div className="flex flex-col items-center gap-y-1 py-8 text-center">
      <p className="text-sm font-medium text-neutral-400">Belum ada akun overhead yang dipilih.</p>
      <p className="text-sm text-neutral-300">
        Cari dan tambahkan akun di atas untuk mulai menandai biaya overhead produksi.
      </p>
    </div>
  );
}
