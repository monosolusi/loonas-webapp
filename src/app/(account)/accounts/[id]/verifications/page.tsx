import { ProtectedPage } from "@/app/(authentication)/_presentation/_components/protected-page";
import { Header } from "@/app/(home)/home/_components/header";
import { PageMain } from "@/core/presentations/components/page-main";
import { PageContent } from "@/core/presentations/components/page-content";
import {
  VerificationProgress
} from "@/app/(account)/accounts/[id]/verifications/_presentations/_components/verification-progress";
import { VerificationData } from "./_presentations/_components/verification-data";
import {
  AccountVerificationWorkProvider
} from "@/app/(account)/accounts/[id]/verifications/_presentations/_providers/account-verification-works";
import { BackArrow } from "./_presentations/_components/back-arrow";

export default async function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <ProtectedPage>
      <div className="min-h-full">
        <Header />
        <PageMain>
          <PageContent>
            <AccountVerificationWorkProvider id={id}>
              <BackArrow />
              {/* Make a minus margin, to compensate the margin from PageContent because of Progress*/}
              <div className="-mx-4 sm:-mx-6 lg:-mx-8">
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