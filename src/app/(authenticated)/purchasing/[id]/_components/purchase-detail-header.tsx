"use client";

import { useState } from "react";
import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { ActionMenu } from "@/core/presentations/components/action-menu";
import { PurchaseDetailDeleteDialog } from "@/app/(authenticated)/purchasing/[id]/_components/purchase-detail-delete-dialog";

export function PurchaseDetailHeader() {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DetailPageHeader
        title="Detail Pembelian"
        backHref="/purchasing"
        action={<ActionMenu options={[{ label: "Hapus", onClick: () => setDeleteOpen(true), variant: "danger" }]} />}
      />
      <PurchaseDetailDeleteDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} />
    </>
  );
}
