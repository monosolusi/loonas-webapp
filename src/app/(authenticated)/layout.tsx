import { Header } from "@/app/(authenticated)/_components/header";
import { ProtectedPage } from "@/core/presentations/components/protected-page";
import { PageMain } from "@/core/presentations/components/page-main";

export default function AuthenticatedLayout({ children }: { children: any }) {
  return (
    <ProtectedPage>
      <div className="min-h-full">
        <Header />
        <PageMain>
          {children}
        </PageMain>
      </div>
    </ProtectedPage>
  );
}
