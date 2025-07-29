"use client";

import React, { useState } from "react";
import { PageContent } from "@/core/presentations/components/page-content";
import { PageHeading } from "@/core/presentations/components/page-heading";
import { Accounts } from "@/app/(authenticated)/accounts/select/_components/accounts";
import { ChangedDialog } from "@/app/(authenticated)/accounts/select/_components/changed-dialog";

export default function SelectAccountPage() {
  const [changedDialog, setChangedDialog] = useState<boolean>(false);

  function handleChanged() {
    setChangedDialog(true);
  }

  return (
    <>
      <ChangedDialog open={changedDialog} setOpen={setChangedDialog} />
      <PageHeading>Akun Kamu</PageHeading>
      <PageContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Accounts onAccountChanged={handleChanged} />
        </div>
      </PageContent>
    </>
  );
}
