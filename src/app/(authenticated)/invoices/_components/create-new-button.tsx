import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";

export function CreateNewInvoiceButton() {
  return (
    <Link
      href="/invoices/create"
      className="ml-auto flex items-center gap-x-1 rounded-md bg-primary-default px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-default"
    >
      <PlusIcon aria-hidden="true" className="-ml-1.5 size-5" />
      Faktur Baru
    </Link>
  );
}