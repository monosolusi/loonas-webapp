import { HeaderTitle } from "@/app/(authenticated)/_components/header-title";
import { HeaderAccountMenu } from "@/app/(authenticated)/_components/header-account-menu";
import { NotificationBell } from "@/features/notification/presentations/components/notification-bell";

export function Header() {
  return (
    <div className="flex flex-row items-center justify-between border-b border-b-neutral-200 px-4 py-2 sm:px-6">
      <HeaderTitle />
      <div className="flex flex-row items-center gap-x-3 sm:gap-x-6">
        <NotificationBell />
        <div className="h-6 w-[2px] bg-neutral-200"></div>
        <HeaderAccountMenu />
      </div>
    </div>
  );
}
