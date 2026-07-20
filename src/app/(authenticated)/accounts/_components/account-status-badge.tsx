import { VerificationStatus } from "@/features/account/domain/enums/verification-status";
import { VerificationOutcome } from "@/features/account/domain/enums/verification-outcome";
import { AccountTypeEntity } from "@/features/account/domain/types/account-type";
import { useMemo } from "react";
import clsx from "clsx";

type AccountStatusBadgeProps = {
  account: AccountTypeEntity;
};

const ACCOUNT_STYLE_STATUS_MAP: Record<string, string> = {
  [`${VerificationStatus.NEW}.${VerificationOutcome.PENDING}`]: "bg-warning-300",
  [`${VerificationStatus.PROCESSING}.${VerificationOutcome.PENDING}`]: "bg-warning-300",
  [`${VerificationStatus.COMPLETED}.${VerificationOutcome.APPROVED}`]: "bg-success-300",
  [`${VerificationStatus.COMPLETED}.${VerificationOutcome.REJECTED}`]: "bg-error-300",
};

const ACCOUNT_LABEL_STATUS_MAP: Record<string, string> = {
  [`${VerificationStatus.NEW}.${VerificationOutcome.PENDING}`]: "Menunggu Verifikasi",
  [`${VerificationStatus.PROCESSING}.${VerificationOutcome.PENDING}`]: "Sedang Diproses",
  [`${VerificationStatus.COMPLETED}.${VerificationOutcome.APPROVED}`]: "Aktif",
  [`${VerificationStatus.COMPLETED}.${VerificationOutcome.REJECTED}`]: "Ditolak",
};

export function AccountStatusBadge(props: AccountStatusBadgeProps) {
  const { color, label } = useMemo(() => {
    const key = `${props.account.latestStatus}.${props.account.verificationOutcome}`;
    return {
      color: ACCOUNT_STYLE_STATUS_MAP[key] ?? "bg-neutral-300",
      label: ACCOUNT_LABEL_STATUS_MAP[key] ?? "Status Tidak Diketahui",
    };
  }, [props.account.latestStatus, props.account.verificationOutcome]);

  return (
    <div className="flex flex-row items-center gap-x-2">
      <div className={clsx("size-2 rounded-full", color)}></div>
      <div className="text-sm leading-5 text-neutral-300">{label}</div>
    </div>
  );
}
