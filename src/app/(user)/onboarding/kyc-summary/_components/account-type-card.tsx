"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useGetAccountVerificationWork } from "@/features/account/presentation/hooks/use-get-account-verification-work";

type AccountTypeCardProps = {
  account: { id: string };
};

export function AccountTypeCard(props: AccountTypeCardProps) {
  const { verificationWork } = useGetAccountVerificationWork({ accountId: props.account.id });

  const accountType = useMemo(() => {
    if (!verificationWork) return "";
    switch (verificationWork.account.type) {
      case "PERSONAL":
        return "Personal";
      case "BUSINESS":
        return "Business";
      default:
        return "Tidak Diketahui";
    }
  }, [verificationWork]);

  return (
    <div className="flex flex-row items-center gap-x-4 rounded-xl border border-neutral-100 bg-white p-5">
      {/*  Icon */}
      <div className="bg-primary-300/5 flex flex-col items-center justify-center rounded-lg p-3">
        <Image src="/assets/images/document-icon-primary-300-w24-h24.svg" alt="Email Icon" width={24} height={24} />
      </div>

      {/*  Title and Description */}
      <div className="flex w-full flex-col gap-1">
        <div className="text-sm leading-5 font-medium">Jenis Akun</div>
        <div className="text-base leading-6 font-semibold">{accountType}</div>
      </div>
    </div>
  );
}
