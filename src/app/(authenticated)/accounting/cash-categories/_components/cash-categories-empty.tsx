import { BanknotesIcon } from "@heroicons/react/24/outline";

type CashCategoriesEmptyProps = {
  hasFilter: boolean;
};

export function CashCategoriesEmpty({ hasFilter }: CashCategoriesEmptyProps) {
  const message = hasFilter ? "Tidak ada kategori kas pada filter ini." : "Belum ada kategori kas.";

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-100">
      <div className="flex flex-col items-center gap-y-3 px-4 py-12 text-center">
        <BanknotesIcon className="size-8 text-neutral-200" aria-hidden="true" />
        <p className="text-sm text-neutral-300">{message}</p>
      </div>
    </div>
  );
}
