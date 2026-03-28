"use client";

import { useState } from "react";
import Image from "next/image";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { TableToolbar } from "@/core/presentations/components/table/table-toolbar";
import { TableSearch } from "@/core/presentations/components/table/table-search";
import {
  useRawMaterialMaster
} from "@/app/(authenticated)/settings/raw-materials/_providers/raw-material-master-provider";
import {
  RawMaterialCreateDialog
} from "@/app/(authenticated)/settings/raw-materials/_components/raw-material-create-dialog";

export function RawMaterialMasterToolbar() {
  const { search, setSearch } = useRawMaterialMaster();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <>
      <TableToolbar>
        <TableSearch value={search} onChange={setSearch} placeholder="Cari bahan baku..." />
        <div className="flex">
          <PrimaryButton
            label="Tambah Bahan Baku"
            leftIcon={<Image src="/assets/images/plus-icon-white-w16-h16.svg" alt="" width={16} height={16} />}
            onClick={() => setCreateDialogOpen(true)}
          />
        </div>
      </TableToolbar>

      <RawMaterialCreateDialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} />
    </>
  );
}
