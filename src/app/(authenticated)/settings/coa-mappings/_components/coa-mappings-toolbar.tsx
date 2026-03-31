"use client";

import { useState } from "react";
import Image from "next/image";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import {
  CoaMappingCreateDialog
} from "@/app/(authenticated)/settings/coa-mappings/_components/coa-mapping-create-dialog";

export function CoaMappingsToolbar() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end">
        <div className="flex">
          <PrimaryButton
            label="Tambah Pemetaan"
            leftIcon={<Image src="/assets/images/plus-icon-white-w16-h16.svg" alt="" width={16} height={16} />}
            onClick={() => setCreateDialogOpen(true)}
          />
        </div>
      </div>

      <CoaMappingCreateDialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} />
    </>
  );
}
