"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { ListPageHeader } from "@/core/presentations/components/list-page-header";

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
      <ListPageHeader
        title={title}
        subtitle={description}
        action={
          <PrimaryButton
            label="Buat Faktur Baru"
            onClick={() => router.push(createHref)}
            leftIcon={<Image src="/assets/images/plus-icon-white-w16-h16.svg" alt="" width={16} height={16} />}
            className="w-full sm:w-auto"
          />
        }
      />

      {statistics}

      <div className="flex flex-col gap-y-4">{children}</div>
    </div>
  );
}
