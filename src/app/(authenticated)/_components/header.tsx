import { HeaderTitle } from "@/app/(authenticated)/_components/header-title";
import { HeaderAccountMenu } from "@/app/(authenticated)/_components/header-account-menu";

export function Header() {
  return (
    <div className="flex flex-row items-center justify-between border-b border-b-neutral-200 px-6 py-2">
      <HeaderTitle />
      <div className="flex flex-row items-center gap-x-6">
        {/* Notification Icon */}
        {/*<div className="flex size-10 flex-col items-center justify-center">*/}
        {/*  <div className="relative">*/}
        {/*    <Image src="/assets/images/bell-icon-neutral-300-w16-h16.svg" alt="bell icon" width={16} height={16} />*/}
        {/*    <div className="bg-error-300 absolute top-[-2px] right-[-2px] size-2 rounded-full border border-2 border-white"></div>*/}
        {/*  </div>*/}
        {/*</div>*/}

        {/* Vertical Divider */}
        {/*<div className="h-6 w-[2px] bg-neutral-200"></div>*/}

        <HeaderAccountMenu />
      </div>
    </div>
  );
}
