import { ProtectedPage } from "@/app/(authenticated)/_components/protected-page";
import { NavigationBar } from "@/app/(authenticated)/_components/navigation-bar";
import { MobileNavigation } from "@/app/(authenticated)/_components/mobile-navigation";
import { Header } from "@/app/(authenticated)/_components/header";

export default function AuthenticatedLayout(props: { children: React.ReactNode }) {
  return (
    <ProtectedPage>
      <div className="flex h-screen flex-row overflow-hidden">
        <NavigationBar />
        <div className="flex flex-1 flex-col overflow-hidden bg-white">
          <Header />
          {/* Bottom padding clears the fixed mobile tab bar (h-16 + safe area); reset at lg. */}
          <div className="flex-1 overflow-y-auto px-4 py-4 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:px-6 lg:p-8">
            {props.children}
          </div>
        </div>
        <MobileNavigation />
      </div>
    </ProtectedPage>
  );
}
