"use client";

import { useState } from "react";
import { CartDrawer } from "@/app/(pos)/pos/_components/cart-drawer";
import { CartPanel } from "@/app/(pos)/pos/_components/cart-panel";
import { PeekStrip } from "@/app/(pos)/pos/_components/peek-strip";
import { PosLeftPanel } from "@/app/(pos)/pos/_components/pos-left-panel";
import { PosProvider } from "@/app/(pos)/pos/_providers/pos-provider";
import { RequireAccountBankAccount } from "@/features/bank/presentation/components/require-account-bank-account";

function PosPageContent() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* lg+ desktop: full two-column grid */}
      <div className="grid h-full min-h-0 grid-cols-1 grid-rows-[minmax(0,1fr)] gap-6 overflow-hidden p-6 lg:grid-cols-[1fr_400px]">
        <PosLeftPanel />
        {/* CartPanel hides itself on < lg via hidden lg:flex */}
        <CartPanel />
      </div>

      {/* < lg mobile/tablet: peek strip fixed at bottom + sliding drawer */}
      <PeekStrip drawerOpen={drawerOpen} onToggleDrawer={() => setDrawerOpen((prev) => !prev)} />
      <CartDrawer open={drawerOpen} />
    </>
  );
}

export default function PosPage() {
  return (
    <RequireAccountBankAccount>
      <PosProvider>
        <PosPageContent />
      </PosProvider>
    </RequireAccountBankAccount>
  );
}
