import { PosExitButton } from "@/app/(pos)/_components/pos-exit-button";
import { PosTopBarBrand } from "@/app/(pos)/_components/pos-top-bar-brand";
import { PosTopBarUser } from "@/app/(pos)/_components/pos-top-bar-user";

export function PosTopBar() {
  return (
    <header className="flex h-16 shrink-0 flex-row items-center justify-between border-b border-b-neutral-200 bg-white px-6">
      <PosTopBarBrand />
      <div className="flex flex-row items-center gap-x-4">
        <PosTopBarUser />
        <PosExitButton />
      </div>
    </header>
  );
}
