"use client";

import { ActionMenu } from "@/core/presentations/components/action-menu";
import { MobileListCard } from "@/core/presentations/components/table/mobile-list-card";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { FixedCostEntity } from "@/features/fixed-cost/domain/entities/fixed-cost";
import { useFixedCostMaster } from "@/app/(authenticated)/settings/fixed-costs/_providers/fixed-cost-master-provider";

type FixedCostMasterCardProps = {
  item: FixedCostEntity;
};

export function FixedCostMasterCard({ item }: FixedCostMasterCardProps) {
  const { setEditingItem, setDeletingItem } = useFixedCostMaster();

  return (
    <MobileListCard
      title={item.name}
      chevron={false}
      trailingTop={item.category === "production" ? <StatusChip label="Produksi" variant="primary" compact /> : undefined}
      trailingBottom={
        <ActionMenu
          options={[
            { label: "Edit", onClick: () => setEditingItem(item) },
            { label: "Hapus", onClick: () => setDeletingItem(item), variant: "danger" },
          ]}
        />
      }
    />
  );
}
