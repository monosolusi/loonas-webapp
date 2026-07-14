"use client";

import { usePathname } from "next/navigation";
import { CalculatorIcon, CubeIcon, HomeIcon, ShoppingCartIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { MobileTabBarItem } from "@/app/(authenticated)/_components/mobile-tab-bar-item";

type MobileTabBarProps = {
  moreOpen: boolean;
  onMoreClick: () => void;
};

/**
 * Primary destinations are the always-available sections; feature-gated areas
 * (Keuangan, Bagan Akun, KYC, Faktur) live in the "Lainnya" sheet, which mirrors
 * the desktop sidebar exactly. Edit this array to re-tune the primary tabs.
 */
const TABS: { label: string; href: string; icon: React.ComponentType<{ className?: string }>; prefixes: string[] }[] = [
  { label: "Beranda", href: "/home", icon: HomeIcon, prefixes: ["/home"] },
  { label: "Pembelian", href: "/purchasing", icon: ShoppingCartIcon, prefixes: ["/purchasing", "/invoices/incoming"] },
  { label: "POS", href: "/pos", icon: CalculatorIcon, prefixes: ["/pos", "/sales", "/invoices/outgoing"] },
  { label: "Produk", href: "/products", icon: CubeIcon, prefixes: ["/products", "/productions"] },
];

export function MobileTabBar({ moreOpen, onMoreClick }: MobileTabBarProps) {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-100 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
      <nav className="flex h-16">
        {TABS.map((tab) => (
          <MobileTabBarItem
            key={tab.href}
            icon={tab.icon}
            label={tab.label}
            href={tab.href}
            active={!moreOpen && tab.prefixes.some((prefix) => pathname.startsWith(prefix))}
          />
        ))}
        <MobileTabBarItem icon={Squares2X2Icon} label="Lainnya" onClick={onMoreClick} active={moreOpen} />
      </nav>
    </div>
  );
}
