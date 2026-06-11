"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";

interface InvoiceListPageShellProps {
  title: string;
  description: string;
  createHref: string;
  statistics: React.ReactNode;
  children: React.ReactNode;
}

export function InvoiceListPageShell({ title, description, createHref, statistics, children }: InvoiceListPageShellProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <span className="text-2xl leading-8 font-bold tracking-tight">{title}</span>
          <span className="text-sm leading-5">{description}</span>
        </div>
        <div className="flex">
          <PrimaryButton label="Buat Faktur Baru" onClick={() => router.push(createHref)} />
        </div>
      </div>

      {statistics}

      <div className="flex flex-col gap-y-4">{children}</div>
    </div>
  );
}
