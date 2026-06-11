"use client";

import { useState } from "react";
import Image from "next/image";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { TableToolbar } from "@/core/presentations/components/table/table-toolbar";
import { TableSearch } from "@/core/presentations/components/table/table-search";
import { useFixedCostMaster } from "@/app/(authenticated)/settings/fixed-costs/_providers/fixed-cost-master-provider";
import { FixedCostCreateDialog } from "@/app/(authenticated)/settings/fixed-costs/_components/fixed-cost-create-dialog";

export function FixedCostMasterToolbar() {
  const { search, setSearch } = useFixedCostMaster();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <>
      <TableToolbar>
        <TableSearch value={search} onChange={setSearch} placeholder="Cari biaya tetap..." />
        <div className="flex">
          <PrimaryButton
            label="Tambah Biaya Tetap"
            leftIcon={<Image src="/assets/images/plus-icon-white-w16-h16.svg" alt="" width={16} height={16} />}
            onClick={() => setCreateDialogOpen(true)}
          />
        </div>
      </TableToolbar>

      <FixedCostCreateDialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} />
    </>
  );
}
