import { ProtectedPage } from "@/app/(authentication)/_presentation/_components/protected-page";
import { Header } from "@/app/(home)/home/_components/header";
import { PageMain } from "@/core/presentations/components/page-main";
import { PageContent } from "@/core/presentations/components/page-content";

export default function CreateInvoiceLayout({ children }: { children: any }) {
  return (
    <ProtectedPage>
      <div className="min-h-full">
        <Header />
        <PageMain>
          <PageContent>
            <div className="w-full h-full flex items-center justify-center">
              {children}
            </div>
          </PageContent>
        </PageMain>
      </div>
    </ProtectedPage>
  );
}