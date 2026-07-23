"use client";

import { useState } from "react";
import Image from "next/image";
import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { useRawMaterialMaster } from "@/app/(authenticated)/settings/raw-materials/_providers/raw-material-master-provider";
import { RawMaterialCreateDialog } from "@/app/(authenticated)/settings/raw-materials/_components/raw-material-create-dialog";

export function RawMaterialMasterHeader() {
  const { meta } = useRawMaterialMaster();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <>
      <DetailPageHeader
        backHref="/settings"
        title="Bahan Baku"
        subtitle={meta ? `${meta.total} bahan baku` : "Memuat..."}
        action={
          <PrimaryButton
            label="Tambah Bahan Baku"
            leftIcon={<Image src="/assets/images/plus-icon-white-w16-h16.svg" alt="" width={16} height={16} />}
            onClick={() => setCreateDialogOpen(true)}
            className="w-full sm:w-auto"
          />
        }
      />

      <RawMaterialCreateDialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} />
    </>
  );
}
