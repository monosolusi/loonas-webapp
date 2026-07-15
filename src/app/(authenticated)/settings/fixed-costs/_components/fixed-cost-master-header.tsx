"use client";

import { useState } from "react";
import Image from "next/image";
import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { useFixedCostMaster } from "@/app/(authenticated)/settings/fixed-costs/_providers/fixed-cost-master-provider";
import { FixedCostCreateDialog } from "@/app/(authenticated)/settings/fixed-costs/_components/fixed-cost-create-dialog";

export function FixedCostMasterHeader() {
  const { meta } = useFixedCostMaster();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <>
      <DetailPageHeader
        backHref="/settings"
        title="Biaya Tetap"
        subtitle={meta ? `${meta.total} biaya tetap` : "Memuat..."}
        action={
          <PrimaryButton
            label="Tambah Biaya Tetap"
            leftIcon={<Image src="/assets/images/plus-icon-white-w16-h16.svg" alt="" width={16} height={16} />}
            onClick={() => setCreateDialogOpen(true)}
            className="w-full sm:w-auto"
          />
        }
      />

      <FixedCostCreateDialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} />
    </>
  );
}
