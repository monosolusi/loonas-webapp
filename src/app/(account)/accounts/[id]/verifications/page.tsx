import { ProtectedPage } from "@/app/(authentication)/_presentation/_components/protected-page";
import { Header } from "@/app/(home)/home/_components/header";
import { PageMain } from "@/core/presentations/page-main";
import { PageContent } from "@/core/presentations/page-content";
import {
  VerificationProgress
} from "@/app/(account)/accounts/[id]/verifications/_presentations/_components/verification-progress";
import { VerificationData } from "./_presentations/_components/verification-data";
import {
  AccountVerificationWorkProvider
} from "@/app/(account)/accounts/[id]/verifications/_presentations/_providers/account-verification-works";


export default async function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <ProtectedPage>
      <div className="min-h-full">
        <Header />
        <PageMain>
          {/*<PageHeading withBackground={false}>Sedang Verifikasi</PageHeading>*/}
          <PageContent>
            <AccountVerificationWorkProvider id={id}>
              {/* Make a minus margin, to compensate the margin from PageContent because of Progress*/}
              <div className="-my-4 -mx-4 sm:-mx-6 lg:-mx-8">
                <VerificationProgress />
              </div>
              <VerificationData />
            </AccountVerificationWorkProvider>
          </PageContent>
        </PageMain>
      </div>
    </ProtectedPage>
  );
}