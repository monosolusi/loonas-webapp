import { CartPanel } from "@/app/(pos)/pos/_components/cart-panel";
import { PosLeftPanel } from "@/app/(pos)/pos/_components/pos-left-panel";
import { PosProvider } from "@/app/(pos)/pos/_providers/pos-provider";

export default function PosPage() {
  return (
    <PosProvider>
      <div className="grid h-full grid-cols-1 gap-6 p-6 lg:grid-cols-[1fr_400px]">
        <PosLeftPanel />
        <CartPanel />
      </div>
    </PosProvider>
  );
}
