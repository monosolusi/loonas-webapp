import Image from "next/image";
import { AccountTypeEntity } from "@/features/account/domain/types/account-type";
import { AccountStatusBadge } from "@/app/(authenticated)/accounts/_components/account-status-badge";
import { AccountCardIcon } from "@/app/(authenticated)/accounts/_components/account-card-icon";

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
      </div>

      {/*  Action */}
      <button type="button">
        <div className="hover:bg-primary-300/10 hover:text-primary-400 flex cursor-pointer flex-row justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 transition transition-all duration-100 ease-in-out ease-out focus:outline-none data-closed:opacity-0">
          <div className="text-sm leading-5 font-medium">Masuk Dashboard</div>
          <Image
            src="/assets/images/arrow-tailed-right-icon-neutral-500-w16-h16.svg"
            alt="Arrow Right Icon"
            width={16}
            height={16}
          />
        </div>
      </button>
    </div>
  );
}
