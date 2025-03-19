"use client";

import React from "react";
import { useAccountVerificationWork } from "@/features/account/presentation/providers/account-verification-work";
import { AccountVerificationWorkEntity } from "@/features/account/domain/entities/account-verification-work";
import { VerificationStatus } from "@/features/account/domain/enums/verification-status";
import { VerificationOutcome } from "@/features/account/domain/enums/verification-outcome";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export function VerificationStatusBadge() {
  const [accountVerificationWork] = useAccountVerificationWork();

  function generateContent(work?: AccountVerificationWorkEntity) {
    if (work?.latestStatus === VerificationStatus.NEW) return "Belum Verifikasi";
    else if (work?.latestStatus === VerificationStatus.PROCESSING) return "Sedang Verifikasi";
    else if (work?.latestStatus === VerificationStatus.COMPLETED) {
      if (work?.verificationOutcome === VerificationOutcome.APPROVED) return "Terverifikasi";
      else if (work?.verificationOutcome === VerificationOutcome.REJECTED) return "Ditolak";
      else return "Tidak Diketahui";
    } else return "Tidak Diketahui";
  }

  function generateColor(work?: AccountVerificationWorkEntity) {
    if (work?.latestStatus === VerificationStatus.NEW) return "bg-yellow-100 text-yellow-800";
    else if (work?.latestStatus === VerificationStatus.PROCESSING) return "bg-yellow-100 text-yellow-800";
    else if (work?.latestStatus === VerificationStatus.COMPLETED) {
      if (work?.verificationOutcome === VerificationOutcome.APPROVED) return "bg-green-100 text-green-800";
      else if (work?.verificationOutcome === VerificationOutcome.REJECTED) return "bg-red-100 text-red-800";
      else return "bg-gray-100 text-gray-800";
    } else return "bg-gray-100 text-gray-800";
  }

  return (
    <span
      className={classNames(
        generateColor(accountVerificationWork),
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium"
      )}
    >
      {generateContent(accountVerificationWork)}
    </span>
  );
}