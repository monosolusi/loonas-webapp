import { LogoImage } from "@/core/presentations/components/logo-image";
import { NavigationItem } from "@/app/(authenticated)/_components/navigation-item";
import { NavigationGroup } from "@/app/(authenticated)/_components/navigation-group";
import { NavigationChildItem } from "@/app/(authenticated)/_components/navigation-child-item";
import { KycReviewNavItem } from "@/app/(authenticated)/_components/kyc-review-nav-item";
import { FinanceNavGroup } from "@/app/(authenticated)/_components/finance-nav-group";
import { PurchasingNavGroup } from "@/app/(authenticated)/_components/purchasing-nav-group";
import { SalesNavGroup } from "@/app/(authenticated)/_components/sales-nav-group";

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
        <PurchasingNavGroup />
        <SalesNavGroup />
        <NavigationGroup
          label="Produk"
          iconPath="/assets/images/box-icon-neutral-300-w16-h16.svg"
          selectedIconPath="/assets/images/box-icon-primary-300-w16-h16.svg"
          matchPrefixes={["/products", "/productions"]}
        >
          <NavigationChildItem href="/products" label="Semua Produk" />
          <NavigationChildItem href="/productions" label="Produksi" />
        </NavigationGroup>
        <FinanceNavGroup />
        <NavigationItem
          href="/accounts"
          label="Manajemen Akun"
          iconPath="/assets/images/people-icon-neutral-300-w16-h16.svg"
          selectedIconPath="/assets/images/people-icon-primary-300-w16-h16.svg"
        />
        <KycReviewNavItem />
        <NavigationItem
          href="/settings"
          label="Pengaturan"
          iconPath="/assets/images/gear-icon-neutral-300-w16-h16.svg"
          selectedIconPath="/assets/images/gear-icon-primary-300-w16-h16.svg"
        />
      </div>
      <div className="flex text-xs leading-4 text-neutral-300">Loonas</div>
    </nav>
  );
}
