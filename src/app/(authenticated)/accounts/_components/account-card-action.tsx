import Image from "next/image";
import { useCallback, useMemo } from "react";
import clsx from "clsx";
import { AccountTypeEntity } from "@/features/account/domain/types/account-type";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";
import { useOrganizationList } from "@clerk/nextjs";
import {
  AccountCardActionState,
  resolveAccountCardAction,
} from "@/app/(authenticated)/accounts/_utils/account-card-action-state";

type AccountCardActionProps = {
  account: AccountTypeEntity;
};

const ACTION_CONFIG: Record<
  AccountCardActionState,
  { label: string; icon: string; alt: string; className: string; disabled: boolean; redirectUrl: string | null }
> = {
  current: {
    label: "Sedang Digunakan",
    icon: "/assets/images/check-circle-icon-primary-300-w16-h16.svg",
    alt: "Check Circle Icon",
    className: "bg-primary-300/5 border-primary-300/10 text-primary-300",
    disabled: true,
    redirectUrl: null,
  },
  "enter-dashboard": {
    label: "Masuk Dashboard",
    icon: "/assets/images/arrow-tailed-right-icon-neutral-500-w16-h16.svg",
    alt: "Arrow Right Icon",
    className: "bg-white border-neutral-200 hover:bg-primary-300/10 hover:text-primary-400 cursor-pointer",
    disabled: false,
    redirectUrl: "/home",
  },
  "view-verification": {
    label: "Lihat Status Verifikasi",
    icon: "/assets/images/arrow-tailed-right-icon-neutral-500-w16-h16.svg",
    alt: "Arrow Right Icon",
    className: "bg-white border-neutral-200 hover:bg-primary-300/10 hover:text-primary-400 cursor-pointer",
    disabled: false,
    redirectUrl: "/onboarding/kyc-summary",
  },
};

export function AccountCardAction(props: AccountCardActionProps) {
  const { account: currentAccount } = useGetCurrentAccount();
  const { isLoaded, setActive } = useOrganizationList();

  const actionState = useMemo(
    () =>
      resolveAccountCardAction({
        isCurrent: currentAccount?.id === props.account.id,
        isApproved: props.account.isApproved,
      }),
    [currentAccount, props.account.id, props.account.isApproved],
  );

  const config = ACTION_CONFIG[actionState];

  const onClick = useCallback(() => {
    if (!isLoaded || !config.redirectUrl) return;
    setActive({ organization: props.account.metadata.clerkId, redirectUrl: config.redirectUrl });
  }, [isLoaded, setActive, props.account.metadata.clerkId, config.redirectUrl]);

  return (
    <button type="button" disabled={config.disabled} onClick={config.disabled ? undefined : onClick}>
      <div
        className={clsx(
          "flex flex-row items-center justify-between rounded-lg border px-3 py-2 text-sm leading-5 font-medium transition-all duration-100 ease-out",
          config.className,
        )}
      >
        <span>{config.label}</span>
        <Image src={config.icon} alt={config.alt} width={16} height={16} />
      </div>
    </button>
  );
}
