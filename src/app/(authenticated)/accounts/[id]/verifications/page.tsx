import { PageContent } from "@/core/presentations/components/page-content";
import { VerificationData } from "@/app/(authenticated)/accounts/[id]/verifications/_components/verification-data";
import { BackArrow } from "@/core/presentations/components/back-arrow";
import { AccountVerificationWorkProvider } from "@/features/account/presentation/providers/account-verification-work";
import {
  VerificationProgress
} from "@/app/(authenticated)/accounts/[id]/verifications/_components/verification-progress";

export default async function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
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
  );
}