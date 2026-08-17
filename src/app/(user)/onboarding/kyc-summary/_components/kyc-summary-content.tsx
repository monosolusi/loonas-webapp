import { StepHeader } from "@/app/(user)/onboarding/_components/step-header";
import { StatusBoxImpl } from "@/app/(user)/onboarding/kyc-summary/_components/status-box-impl";
import { EmailAddressCard } from "@/app/(user)/onboarding/kyc-summary/_components/email-address-card";
import { AccountTypeCard } from "@/app/(user)/onboarding/kyc-summary/_components/account-type-card";
import { VerificationTimelineCard } from "@/app/(user)/onboarding/kyc-summary/_components/verification-timeline-card";
import { NextActionSection } from "@/app/(user)/onboarding/kyc-summary/_components/next-action-section";

type KycSummaryContentProps = {
  organizationId: string;
};

export function KycSummaryContent(props: KycSummaryContentProps) {
  const account = { id: props.organizationId };

  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <StepHeader title="Status Verifikasi KYC" description="Terima kasih! Kami sedang memproses verifikasi Anda" />
      <div className="flex w-full flex-col gap-8">
        {/*  Status Box */}
        <StatusBoxImpl account={account} />

        {/*  Account Type Card */}
        <AccountTypeCard account={account} />

        {/*  Email Address Card */}
        <EmailAddressCard />

        {/*  Verification Process Card */}
        <VerificationTimelineCard account={account} />

        {/*  Next Action Section */}
        <NextActionSection account={account} />

        {/*  Support Card */}
        <div className="rounded-xl border border-neutral-100 bg-neutral-200/30 p-5">
          <div className="text-center text-sm leading-5 font-normal text-neutral-200">
            Ada pertanyaan? Hubungi kami di&nbsp;
            <span className="text-primary-300">
              <a href="mailto:support@loonas.com">support@loonas.com</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
