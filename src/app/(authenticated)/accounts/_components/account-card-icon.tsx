import Image from "next/image";
import { useMemo } from "react";
import { AccountTypeEntity } from "@/features/account/domain/types/account-type";
import { AccountType } from "@/features/account/domain/enums/account-type";
import { ACCOUNT_AVATAR_COLOR_MAP } from "@/core/utilities/global-vars";

type AccountCardIconProps = {
  account: AccountTypeEntity;
};

const ACCOUNT_ICON_MAP = {
  [AccountType.PERSONAL]: "/assets/images/person-icon-primary-400.w24-h24.svg",
  [AccountType.BUSINESS]: "/assets/images/suitcase-icon-success-400-w24-h24.svg",
};

const ACCOUNT_LABEL_MAP = {
  [AccountType.PERSONAL]: "Personal",
  [AccountType.BUSINESS]: "Bisnis",
};

export function AccountCardIcon(props: AccountCardIconProps) {
  const { type } = props.account;

  const { icon, label, colorClass } = useMemo(() => {
    return {
      icon: ACCOUNT_ICON_MAP[type],
      label: ACCOUNT_LABEL_MAP[type],
      colorClass: ACCOUNT_AVATAR_COLOR_MAP[type],
    };
  }, [type]);

  return (
    <div className="flex flex-row items-start justify-between">
      <div className={`flex size-12 flex-col items-center justify-center rounded-lg border shadow-sm ${colorClass}`}>
        <Image src={icon} alt="Icon" width={24} height={24} />
      </div>
      <div className={`rounded-md border px-2 py-1 ${colorClass}`}>
        <div className="text-xs leading-4">{label}</div>
      </div>
    </div>
  );
}
