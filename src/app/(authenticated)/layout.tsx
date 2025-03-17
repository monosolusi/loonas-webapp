import { Header } from "@/app/(authenticated)/home/_components/header";
import { ProtectedPage } from "@/app/(authentication)/_components/protected-page";
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