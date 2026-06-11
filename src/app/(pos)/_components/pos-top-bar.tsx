import { PosExitButton } from "@/app/(pos)/_components/pos-exit-button";
import { PosTopBarBrand } from "@/app/(pos)/_components/pos-top-bar-brand";
import { PosTopBarNavLink } from "@/app/(pos)/_components/pos-top-bar-nav-link";
import { PosTopBarUser } from "@/app/(pos)/_components/pos-top-bar-user";

export function PosTopBar() {
  return (
    <header className="flex h-16 shrink-0 flex-row items-center justify-between border-b border-b-neutral-200 bg-white px-6">
      <div className="flex flex-row items-center gap-x-6">
        <PosTopBarBrand />
        <nav className="flex flex-row items-center gap-x-1">
          <PosTopBarNavLink href="/pos" label="Kasir" exact />
          <PosTopBarNavLink href="/pos/sales" label="Riwayat" />
        </nav>
      </div>
      <div className="flex flex-row items-center gap-x-4">
        <PosTopBarUser />
        <PosExitButton />
      </div>
    </header>
  );
}
