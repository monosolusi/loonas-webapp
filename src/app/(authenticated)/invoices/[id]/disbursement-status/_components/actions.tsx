import React from "react";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { FilledButton } from "@/core/presentations/components/filled-button";


export function Actions() {
  return (
    <div className="flex space-x-4">
      <div className="flex-1">
        <OutlinedButton>
          Cek Status
        </OutlinedButton>
      </div>
      <div className="flex-1">
        <FilledButton>
          Lihat Semua Faktur
        </FilledButton>
      </div>
    </div>
  );
}