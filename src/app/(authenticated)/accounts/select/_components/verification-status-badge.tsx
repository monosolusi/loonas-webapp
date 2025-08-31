"use client";

import React, { useMemo } from "react";
import { VerificationStatus } from "@/features/account/domain/enums/verification-status";
import { VerificationOutcome } from "@/features/account/domain/enums/verification-outcome";
import { useGetAccountVerificationWork } from "@/features/account/presentation/hooks/use-get-account-verification-work";
import clsx from "clsx";

export function VerificationStatusBadge(props: { accountId: string }) {
  const { verificationWork } = useGetAccountVerificationWork({ accountId: props.accountId });

  const content = useMemo(() => {
    if (verificationWork?.latestStatus === VerificationStatus.NEW) return "Belum Verifikasi";
    else if (verificationWork?.latestStatus === VerificationStatus.PROCESSING) return "Sedang Verifikasi";
    else if (verificationWork?.latestStatus === VerificationStatus.COMPLETED) {
      if (verificationWork?.verificationOutcome === VerificationOutcome.APPROVED) return "Terverifikasi";
      else if (verificationWork?.verificationOutcome === VerificationOutcome.REJECTED) return "Ditolak";
      else return "Tidak Diketahui";
    } else return "Tidak Diketahui";
  }, [verificationWork]);

  const color = useMemo(() => {
    if (verificationWork?.latestStatus === VerificationStatus.NEW) return "bg-yellow-100 text-yellow-800";
    else if (verificationWork?.latestStatus === VerificationStatus.PROCESSING) return "bg-yellow-100 text-yellow-800";
    else if (verificationWork?.latestStatus === VerificationStatus.COMPLETED) {
      if (verificationWork?.verificationOutcome === VerificationOutcome.APPROVED) return "bg-green-100 text-green-800";
      else if (verificationWork?.verificationOutcome === VerificationOutcome.REJECTED) return "bg-red-100 text-red-800";
      else return "bg-gray-100 text-gray-800";
    } else return "bg-gray-100 text-gray-800";
  }, [verificationWork]);

  return (
    <span className={clsx(color, "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium")}>{content}</span>
  );
}
