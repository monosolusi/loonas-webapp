"use client";

import { StatusChip } from "@/core/presentations/components/status-chip";
import { PosSaleEntity } from "@/features/pos/domain/entities/pos-sale";
import { derivePosSaleStatusKind } from "@/features/pos/presentations/components/pos-sale-status-helpers";

type PosSaleStatusChipProps = {
  sale: PosSaleEntity;
};

export function PosSaleStatusChip({ sale }: PosSaleStatusChipProps) {
  const kind = derivePosSaleStatusKind(sale);
  if (kind === "paid") return <StatusChip label="Lunas" variant="success" compact />;
  return <StatusChip label="Menunggu" variant="warning" compact />;
}
