import { LogoImage } from "@/core/presentations/components/logo-image";
import { NavigationItem } from "@/app/(authenticated)/_components/navigation-item";

export function NavigationBar() {
  return (
    <nav className="bg-background flex h-full w-[256px] shrink-0 flex-col gap-y-8 border-r border-r-neutral-200 p-6">
      <LogoImage className="h-auto w-24" />
      <div className="flex flex-1 flex-col gap-y-1">
        <NavigationItem
          href="/home"
          label="Dashboard"
          iconPath="/assets/images/dashboard-icon-neutral-300-w16-h16.svg"
          selectedIconPath="/assets/images/dashboard-icon-primary-300-w16-h16.svg"
        />
        <NavigationItem
          href="/invoices/incoming"
          label="Faktur Masukan"
          iconPath="/assets/images/invoice-in-icon-neutral-300-w16-h16.svg"
          selectedIconPath="/assets/images/invoice-in-icon-primary-300-w16-h16.svg"
        />
        <NavigationItem
          href="/invoices/outgoing/create"
          label="Faktur Keluaran"
          iconPath="/assets/images/invoice-out-icon-neutral-300-w16-h16.svg"
          selectedIconPath="/assets/images/invoice-out-icon-primary-300-w16-h16.svg"
        />
        <NavigationItem
          href="/accounts"
          label="Manajemen Akun"
          iconPath="/assets/images/people-icon-neutral-300-w16-h16.svg"
          selectedIconPath="/assets/images/people-icon-primary-300-w16-h16.svg"
        />
      </div>
      <div className="flex text-xs leading-4 text-neutral-300">Loonas</div>
    </nav>
  );
}
