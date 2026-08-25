import { InformationCircleIcon } from "@heroicons/react/20/solid";

export function OverheadAccountsAdvisoryNote() {
  return (
    <div className="flex items-start gap-x-3 rounded-lg border border-primary-100 bg-primary-50 px-4 py-3">
      <InformationCircleIcon className="mt-0.5 size-4 shrink-0 text-primary-400" aria-hidden="true" />
      <p className="text-sm text-primary-500">
        Anda dapat memilih akun jenis apa pun sebagai akun overhead. Akun yang dicadangkan sistem, digunakan untuk
        posting otomatis, atau menjadi target Pemetaan Akun tidak dapat dipilih.
      </p>
    </div>
  );
}
