import { StatusChip, StatusChipVariant } from "@/core/presentations/components/status-chip";
import { AccountType, ACCOUNT_TYPE_LABELS } from "@/features/accounting/domain/enums/account-type";

const TYPE_VARIANT: Record<AccountType, StatusChipVariant> = {
  [AccountType.ASSET]: "primary",
  [AccountType.CONTRA_ASSET]: "primary",
  [AccountType.LIABILITY]: "warning",
  [AccountType.EQUITY]: "success",
  [AccountType.CONTRA_EQUITY]: "success",
  [AccountType.REVENUE]: "success",
  [AccountType.CONTRA_REVENUE]: "success",
  [AccountType.COGS]: "error",
  [AccountType.EXPENSE]: "neutral",
  [AccountType.CONTRA_EXPENSE]: "neutral",
};

type AccountTypeBadgeProps = { type: AccountType };

export function AccountTypeBadge({ type }: AccountTypeBadgeProps) {
  return <StatusChip label={ACCOUNT_TYPE_LABELS[type]} variant={TYPE_VARIANT[type]} compact />;
}
