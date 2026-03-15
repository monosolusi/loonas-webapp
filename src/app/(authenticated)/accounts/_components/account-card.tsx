import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { AccountTypeEntity } from "@/features/account/domain/types/account-type";
import { AccountStatusBadge } from "@/app/(authenticated)/accounts/_components/account-status-badge";
import { AccountCardIcon } from "@/app/(authenticated)/accounts/_components/account-card-icon";
import { AccountCardAction } from "@/app/(authenticated)/accounts/_components/account-card-action";

type AccountCardProps = {
  account: AccountTypeEntity;
};

export function AccountCard(props: AccountCardProps) {
  return (
    <div className="flex w-[256px] flex-col gap-y-6 rounded-lg border border-neutral-200 bg-white p-6">
      {/* Icons */}
      <AccountCardIcon account={props.account} />

      {/*  Account Information */}
      <div className="flex flex-col gap-y-1">
        <div className="truncate text-xl leading-7 font-bold">{props.account.fullName}</div>
        <AccountStatusBadge account={props.account} />
        <Link
          href={`/accounts/${props.account.id}`}
          className="text-primary-300 hover:text-primary-400 mt-1 flex items-center gap-x-1 text-sm font-medium"
        >
          Lihat Detail
          <ChevronRightIcon className="size-4" />
        </Link>
      </div>

      {/*  Action */}
      <AccountCardAction account={props.account} />
    </div>
  );
}
