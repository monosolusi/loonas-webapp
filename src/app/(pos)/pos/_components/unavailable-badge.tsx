import { StatusChip } from "@/core/presentations/components/status-chip";
import { UnavailableReason } from "@/features/product/domain/enums/unavailable-reason";
import { unavailableChipVariant, unavailableShortLabel } from "@/app/(pos)/pos/_components/availability-helpers";

type UnavailableBadgeProps = {
  reason: UnavailableReason;
};

export function UnavailableBadge({ reason }: UnavailableBadgeProps) {
  return <StatusChip label={unavailableShortLabel(reason)} variant={unavailableChipVariant(reason)} compact />;
}
