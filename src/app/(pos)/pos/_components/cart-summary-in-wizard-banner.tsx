import { InformationCircleIcon } from "@heroicons/react/16/solid";

export function CartSummaryInWizardBanner() {
  return (
    <div className="flex flex-row items-center gap-x-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-400">
      <InformationCircleIcon className="size-4 shrink-0" />
      <span>Sedang membayar — selesaikan di sebelah kiri</span>
    </div>
  );
}
