"use client";

import Image from "next/image";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { TableToolbar } from "@/core/presentations/components/table/table-toolbar";
import { useCoaMappings } from "@/app/(authenticated)/settings/chart-of-accounts/mappings/_providers/coa-mappings-provider";

export function CoaMappingsToolbar() {
  const { setCreatingOpen } = useCoaMappings();

  return (
    <TableToolbar>
      <div />
      <div className="flex">
        <PrimaryButton
          label="Tambah Pemetaan"
          leftIcon={<Image src="/assets/images/plus-icon-white-w16-h16.svg" alt="" width={16} height={16} />}
          onClick={() => setCreatingOpen(true)}
        />
      </div>
    </TableToolbar>
  );
}
