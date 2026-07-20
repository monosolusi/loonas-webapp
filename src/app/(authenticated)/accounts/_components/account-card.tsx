import Link from "next/link";
import { AccountTypeEntity } from "@/features/account/domain/types/account-type";
import { AccountStatusBadge } from "@/app/(authenticated)/accounts/_components/account-status-badge";
import { AccountCardIcon } from "@/app/(authenticated)/accounts/_components/account-card-icon";
import { AccountCardAction } from "@/app/(authenticated)/accounts/_components/account-card-action";

type AccountCardProps = {
  account: AccountTypeEntity;
};

export function AccountCard(props: AccountCardProps) {
  return (
    <div className="flex w-full flex-col gap-y-6 rounded-lg border border-neutral-200 bg-white p-6 sm:w-[256px]">
      <AccountCardIcon account={props.account} />

      <div className="flex flex-col gap-y-1">
        <Link
          href={`/accounts/${props.account.id}`}
          className="truncate text-xl leading-7 font-bold transition-colors hover:text-primary-300"
        >
          {props.account.fullName}
        </Link>
        <AccountStatusBadge account={props.account} />
      </div>

      <AccountCardAction account={props.account} />
    </div>
  );
}
