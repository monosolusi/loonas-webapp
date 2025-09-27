"use client";

import React, { useMemo } from "react";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { useAddItem } from "@/app/(authenticated)/invoices/outgoing/create/@items/_providers/add-item";

export function SaveItemButton() {
  const { name, mustRecalculateTax } = useAddItem();

  const isDisabled: boolean = useMemo(() => {
    return name.trim() === "" || mustRecalculateTax;
  }, [name, mustRecalculateTax]);

  return (
    <FilledButton type="submit" disabled={isDisabled}>
      Simpan Item
    </FilledButton>
  );
}
