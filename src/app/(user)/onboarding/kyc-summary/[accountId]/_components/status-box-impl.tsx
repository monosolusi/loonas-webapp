"use client";

import { StatusBox } from "@/app/(user)/onboarding/kyc-summary/[accountId]/_components/status-box";
import { useGetAccountVerificationWork } from "@/features/account/presentation/hooks/use-get-account-verification-work";
import { useParams } from "next/navigation";
import { useMemo } from "react";

type PossibleStatus = "NEW.PENDING" | "PROCESSING.PENDING" | "COMPLETED.APPROVED" | "COMPLETED.REJECTED";
type StatusBoxStatus = "SUBMITTED" | "REVIEWING" | "APPROVED" | "REJECTED";
const STATUS_MAP: Record<PossibleStatus, StatusBoxStatus> = {
  "NEW.PENDING": "SUBMITTED",
  "PROCESSING.PENDING": "REVIEWING",
  "COMPLETED.APPROVED": "APPROVED",
  "COMPLETED.REJECTED": "REJECTED",
};

export function StatusBoxImpl() {
  const { accountId } = useParams<{ accountId: string }>();
  const { verificationWork } = useGetAccountVerificationWork({ accountId });

  const status = useMemo(() => {
    if (!verificationWork) return null;
    const latestStatus = verificationWork.latestStatus;
    const outcome = verificationWork.verificationOutcome;
    const combinedStatus = `${latestStatus}.${outcome}`.toUpperCase() as PossibleStatus;

    if (!STATUS_MAP[combinedStatus]) return null;
    return STATUS_MAP[combinedStatus];
  }, [verificationWork]);

  if (!status) return null;
  return <StatusBox status={status} />;
}
