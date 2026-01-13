import { MenuItem } from "@headlessui/react";
import { AccountTypeEntity } from "@/features/account/domain/types/account-type";
import { AccountType } from "@/features/account/domain/enums/account-type";
import { AccountAvatar } from "@/app/(authenticated)/_components/account-avatar";

type HeaderAccountItemProps = {
  account: AccountTypeEntity;
};

const ACCOUNT_TYPE_MAP = {
  [AccountType.PERSONAL]: "Akun Personal",
  [AccountType.BUSINESS]: "Akun Bisnis",
};

export function HeaderAccountItem(props: HeaderAccountItemProps) {
  return (
    <MenuItem as="div" className="flex cursor-pointer flex-row items-center gap-x-3 p-3">
      <AccountAvatar type={props.account.type} />

      <div className="flex flex-col">
        <div className="text-sm leading-4 font-semibold">{props.account.fullName}</div>
        <div className="text-xs leading-4 font-normal text-neutral-300 capitalize">
          {ACCOUNT_TYPE_MAP[props.account.type]}
        </div>
      </div>
    </MenuItem>
  );
}
