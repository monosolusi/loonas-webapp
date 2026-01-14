import Image from "next/image";
import { useCallback, useMemo } from "react";
import { AccountTypeEntity } from "@/features/account/domain/types/account-type";
import { useGetAccountVerificationWork } from "@/features/account/presentation/hooks/use-get-account-verification-work";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";
import { VerificationStatus } from "@/features/account/domain/enums/verification-status";
import { VerificationOutcome } from "@/features/account/domain/enums/verification-outcome";
import { useOrganizationList } from "@clerk/nextjs";

type AccountCardActionProps = {
  account: AccountTypeEntity;
};

type ActionState = "current" | "approved" | "disabled" | "loading";

const ACTION_CONFIG: Record<
  ActionState,
  { label: string; icon: string; alt: string; className: string; disabled: boolean }
> = {
  current: {
    label: "Sedang Digunakan",
    icon: "/assets/images/check-circle-icon-primary-300-w16-h16.svg",
    alt: "Check Circle Icon",
    className: "bg-primary-300/5 border-primary-300/10 text-primary-300",
    disabled: true,
  },
  approved: {
    label: "Masuk Dashboard",
    icon: "/assets/images/arrow-tailed-right-icon-neutral-500-w16-h16.svg",
    alt: "Arrow Right Icon",
    className: "bg-white border-neutral-200 hover:bg-primary-300/10 hover:text-primary-400 cursor-pointer",
    disabled: false,
  },
  disabled: {
    label: "Masuk Dashboard",
    icon: "/assets/images/arrow-tailed-right-icon-neutral-500-w16-h16.svg",
    alt: "Arrow Right Icon",
    className: "bg-white border-neutral-200 opacity-50 cursor-not-allowed",
    disabled: true,
  },
  loading: {
    label: "Memuat...",
    icon: "/assets/images/arrow-tailed-right-icon-neutral-500-w16-h16.svg",
    alt: "Arrow Right Icon",
    className: "bg-white border-neutral-200 opacity-50 cursor-not-allowed",
    disabled: true,
  },
};

export function AccountCardAction(props: AccountCardActionProps) {
  const { verificationWork } = useGetAccountVerificationWork({ accountId: props.account.id });
  const { account: currentAccount } = useGetCurrentAccount();
  const { isLoaded, setActive } = useOrganizationList();

  const actionState = useMemo((): ActionState => {
    if (!verificationWork) return "loading";
    if (currentAccount?.id === props.account.id) return "current";

    const { latestStatus, verificationOutcome } = verificationWork;
    const isApproved =
      latestStatus === VerificationStatus.COMPLETED && verificationOutcome === VerificationOutcome.APPROVED;

    return isApproved ? "approved" : "disabled";
  }, [verificationWork, currentAccount, props.account.id]);

  const config = ACTION_CONFIG[actionState];

  const onClick = useCallback(() => {
    if (!isLoaded) return;
    setActive({ organization: props.account.metadata.clerkId, redirectUrl: "/home" });
  }, [isLoaded, setActive, props.account.metadata.clerkId]);

  return (
    <button type="button" disabled={config.disabled} onClick={actionState === "approved" ? onClick : undefined}>
      <div
        className={`flex flex-row items-center justify-between rounded-lg border px-3 py-2 text-sm leading-5 font-medium transition-all duration-100 ease-out ${config.className}`}
      >
        <span>{config.label}</span>
        <Image src={config.icon} alt={config.alt} width={16} height={16} />
      </div>
    </button>
  );
}
