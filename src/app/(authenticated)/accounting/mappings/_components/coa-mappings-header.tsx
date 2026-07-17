"use client";

import Image from "next/image";
import { ListPageHeader } from "@/core/presentations/components/list-page-header";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { useCoaMappings } from "@/app/(authenticated)/accounting/mappings/_providers/coa-mappings-provider";

export function CoaMappingsHeader() {
  const { meta, setCreatingOpen } = useCoaMappings();

  return (
    <ListPageHeader
      title="Pemetaan Akun"
      subtitle={meta ? `${meta.total} pemetaan akun` : "Memuat..."}
      action={
        <PrimaryButton
          label="Tambah Pemetaan"
          leftIcon={<Image src="/assets/images/plus-icon-white-w16-h16.svg" alt="" width={16} height={16} />}
          onClick={() => setCreatingOpen(true)}
          className="w-full sm:w-auto"
        />
      }
    />
  );
}
