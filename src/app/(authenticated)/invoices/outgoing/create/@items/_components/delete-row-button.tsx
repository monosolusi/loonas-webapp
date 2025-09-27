"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { useState } from "react";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { FilledButton } from "@/core/presentations/components/filled-button";

export function DeleteRowButton() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleDialog = () => setDialogOpen((prev) => !prev);

  return (
    <>
      <LoonasDialog open={dialogOpen} title="Hapus Item?" width="md" onClose={toggleDialog}>
        <p className="text-base text-gray-500">Apakah Anda yakin ingin menghapus item ini?</p>
        <div className="my-4"></div>
        <div className="-mx-4 flex flex-row justify-end space-x-4 border-t border-gray-200 px-4 pt-4 sm:-mx-6 sm:px-6">
          <OutlinedButton type="button" onClick={toggleDialog}>
            Batal
          </OutlinedButton>
          <FilledButton type="button" onClick={toggleDialog}>
            Hapus
          </FilledButton>
        </div>
      </LoonasDialog>
      <TrashIcon className="size-5 text-gray-500" onClick={toggleDialog} />
    </>
  );
}
