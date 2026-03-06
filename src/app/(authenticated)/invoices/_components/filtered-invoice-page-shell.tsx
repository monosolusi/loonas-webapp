import React from "react";
import Image from "next/image";
import Link from "next/link";

interface FilteredInvoicePageShellProps {
  backHref: string;
  title: string;
  children: React.ReactNode;
}

export function FilteredInvoicePageShell({ backHref, title, children }: FilteredInvoicePageShellProps) {
  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-row items-center gap-x-3">
        <Link
          href={backHref}
          className="flex size-9 items-center justify-center rounded-lg border border-neutral-100 hover:bg-neutral-50"
        >
          <Image src="/assets/images/arrow-left-icon-neutral-500-w16-h16.svg" alt="Back" width={16} height={16} />
        </Link>
        <div className="flex flex-col gap-y-1">
          <span className="text-2xl leading-8 font-bold tracking-tight">{title}</span>
        </div>
      </div>

      <div className="flex flex-col gap-y-4">{children}</div>
    </div>
  );
}
