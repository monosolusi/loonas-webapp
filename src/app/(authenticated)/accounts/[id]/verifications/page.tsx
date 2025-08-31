import { PageContent } from "@/core/presentations/components/page-content";
import { VerificationData } from "@/app/(authenticated)/accounts/[id]/verifications/_components/verification-data";
import { VerificationProgress } from "@/app/(authenticated)/accounts/[id]/verifications/_components/verification-progress";
import { BackButton } from "@/core/presentations/components/back-button";

export default async function AccountDetailPage() {
  return (
    <PageContent>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col items-start space-y-4">
          <BackButton />
        </div>
        {/* Make a minus margin, to compensate the margin from PageContent because of Progress*/}
        <div className="-mx-4 sm:-mx-6 lg:-mx-8">
          <VerificationProgress />
        </div>
        <div className="mt-8 flex-1">
          <VerificationData />
        </div>
      </div>
    </PageContent>
  );
}
