"use client";

import { useState } from "react";
import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { ActionMenu } from "@/core/presentations/components/action-menu";
import { ProductionDetailDeleteDialog } from "@/app/(authenticated)/productions/[id]/_components/production-detail-delete-dialog";

export function ProductionDetailHeader() {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DetailPageHeader
        title="Detail Produksi"
        backHref="/productions"
        action={<ActionMenu options={[{ label: "Hapus", onClick: () => setDeleteOpen(true), variant: "danger" }]} />}
      />
      <ProductionDetailDeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} />
    </>
  );
}
