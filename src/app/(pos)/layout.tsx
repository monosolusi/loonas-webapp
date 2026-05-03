import { ProtectedPage } from "@/app/(authenticated)/_components/protected-page";
import { PosTopBar } from "@/app/(pos)/_components/pos-top-bar";

export default function PosLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedPage>
      <div className="flex h-screen flex-col overflow-hidden bg-neutral-50">
        <PosTopBar />
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </ProtectedPage>
  );
}
