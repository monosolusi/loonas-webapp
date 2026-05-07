"use client";

import { StatusChip } from "@/core/presentations/components/status-chip";
import { PosSaleEntity } from "@/features/pos/domain/entities/pos-sale";
import { derivePosSaleSettlementKind } from "@/features/pos/presentations/components/pos-sale-status-helpers";

type PosSaleSettlementChipProps = {
  sale: PosSaleEntity;
};

export function PosSaleSettlementChip({ sale }: PosSaleSettlementChipProps) {
  const kind = derivePosSaleSettlementKind(sale);
  if (kind === "settled") return <StatusChip label="Masuk" variant="success" compact />;
  if (kind === "settling") return <StatusChip label="Proses" variant="warning" compact />;
  return <span className="text-sm text-neutral-300">—</span>;
}
