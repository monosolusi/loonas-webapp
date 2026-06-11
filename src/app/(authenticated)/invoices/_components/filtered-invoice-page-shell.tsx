import React from "react";
import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";

interface FilteredInvoicePageShellProps {
  backHref: string;
  title: string;
  children: React.ReactNode;
}

export function FilteredInvoicePageShell({ backHref, title, children }: FilteredInvoicePageShellProps) {
  return (
    <div className="flex flex-col gap-y-6">
      <DetailPageHeader backHref={backHref} title={title} />
      <div className="flex flex-col gap-y-4">{children}</div>
    </div>
  );
}
