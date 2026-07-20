"use client";

import { CartDrawer } from "@/app/(pos)/pos/_components/cart-drawer";
import { CartPanel } from "@/app/(pos)/pos/_components/cart-panel";
import { PeekStrip } from "@/app/(pos)/pos/_components/peek-strip";
import { PosLeftPanel } from "@/app/(pos)/pos/_components/pos-left-panel";
import { PosProvider } from "@/app/(pos)/pos/_providers/pos-provider";
import { RequireAccountBankAccount } from "@/features/bank/presentation/components/require-account-bank-account";

export default function PosPage() {
  return (
    <RequireAccountBankAccount>
      <PosProvider>
        {/* lg+ desktop: full two-column grid. Mobile: full-bleed single-column catalog. */}
        <div className="grid h-full min-h-0 grid-cols-1 grid-rows-[minmax(0,1fr)] gap-6 overflow-hidden p-0 sm:p-4 lg:grid-cols-[1fr_400px] lg:p-6">
          <PosLeftPanel />
          {/* CartPanel hides itself on < lg via hidden lg:flex */}
          <CartPanel />
        </div>

        {/* < lg mobile/tablet: peek strip fixed at bottom + sliding drawer */}
        <PeekStrip />
        <CartDrawer />
      </PosProvider>
    </RequireAccountBankAccount>
  );
}
