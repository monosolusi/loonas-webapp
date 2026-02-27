import { ProtectedPage } from "@/app/(authenticated)/_components/protected-page";
import { NavigationBar } from "@/app/(authenticated)/_components/navigation-bar";
import { Header } from "@/app/(authenticated)/_components/header";

export default function AuthenticatedLayout(props: { children: React.ReactNode }) {
  return (
    <ProtectedPage>
      <div className="flex h-screen flex-row overflow-hidden">
        <NavigationBar />
        <div className="flex flex-1 flex-col overflow-hidden bg-white">
          <Header />
          <div className="flex-1 overflow-y-auto p-8">{props.children}</div>
        </div>
      </div>
    </ProtectedPage>
  );
}
