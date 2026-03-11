"use client";

import { MenuItem } from "@headlessui/react";
import { AccountTypeEntity } from "@/features/account/domain/types/account-type";
import { AccountType } from "@/features/account/domain/enums/account-type";
import { AccountAvatar } from "@/app/(authenticated)/_components/account-avatar";
import { useOrganizationList } from "@clerk/nextjs";

type HeaderAccountItemProps = {
  account: AccountTypeEntity;
};

const ACCOUNT_TYPE_MAP = {
  [AccountType.PERSONAL]: "Akun Personal",
  [AccountType.BUSINESS]: "Akun Bisnis",
};

export function HeaderAccountItem(props: HeaderAccountItemProps) {
  const { setActive, isLoaded } = useOrganizationList();

  const onClick = async () => {
    if (!isLoaded) return;
    await setActive({ organization: props.account.metadata.clerkId, redirectUrl: "/home" });
  };

  return (
    <MenuItem as="div" className="flex cursor-pointer flex-row items-center gap-x-3 p-3" onClick={onClick}>
      <AccountAvatar type={props.account.type} name={props.account.fullName} />

      <div className="flex flex-col">
        <div className="text-sm leading-4 font-semibold">{props.account.fullName}</div>
        <div className="text-xs leading-4 font-normal text-neutral-300 capitalize">
          {ACCOUNT_TYPE_MAP[props.account.type]}
        </div>
      </div>
    </MenuItem>
  );
}
