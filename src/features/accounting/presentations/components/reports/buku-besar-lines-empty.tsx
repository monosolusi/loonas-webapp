import { CalendarDaysIcon } from "@heroicons/react/24/outline";

export function BukuBesarLinesEmpty() {
  return (
    <div className="flex flex-col items-center gap-y-3 px-6 py-12 text-center">
      <CalendarDaysIcon className="size-8 text-neutral-200" aria-hidden="true" />
      <p className="text-sm text-neutral-300">Tidak ada transaksi pada periode ini.</p>
    </div>
  );
}
