import { DocumentTextIcon } from "@heroicons/react/24/outline";

export function NotesEmptyBody() {
  return (
    <div className="flex flex-col items-center gap-y-3 px-6 py-12 text-center">
      <DocumentTextIcon className="size-8 text-neutral-200" aria-hidden />
      <p className="text-sm font-semibold text-neutral-300">Belum ada catatan untuk tanggal ini</p>
      <p className="max-w-sm text-sm text-neutral-300">
        Catatan atas laporan keuangan akan tersedia setelah data keuangan diisi untuk periode ini. Pastikan jurnal sudah
        diinput, atau pilih tanggal lain.
      </p>
    </div>
  );
}
