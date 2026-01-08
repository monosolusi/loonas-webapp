"use client";

import { StepHeader } from "@/app/(user)/onboarding/_components/step-header";
import { StatusBoxImpl } from "@/app/(user)/onboarding/kyc-summary/_components/status-box-impl";
import { EmailAddressCard } from "@/app/(user)/onboarding/kyc-summary/_components/email-address-card";
import { useOrganization } from "@clerk/nextjs";
import { AccountTypeCard } from "./_components/account-type-card";
import { VerificationTimelineCard } from "@/app/(user)/onboarding/kyc-summary/_components/verification-timeline-card";

export default function KycSummaryPage() {
  const { isLoaded, organization } = useOrganization();

  if (!isLoaded || !organization) return null;
  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <StepHeader title="Status Verifikasi KYC" description="Terima kasih! Kami sedang memproses verifikasi Anda" />
      <div className="flex w-full flex-col gap-8">
        {/*  Status Box */}
        <StatusBoxImpl account={{ id: organization.id }} />

        {/*  Account Type Card */}
        <AccountTypeCard account={{ id: organization.id }} />

        {/*  Email Address Card */}
        <EmailAddressCard />

        {/*  Verification Process Card */}
        <VerificationTimelineCard account={{ id: organization.id }} />

        {/*  Next Action Section */}
        <div className="flex flex-row text-center">
          <div className="w-full text-sm leading-5 font-normal text-neutral-200">Mohon tunggu verifikasi selesai.</div>
        </div>

        {/*  Support Card */}
        <div className="rounded-xl border border-neutral-100 bg-neutral-200/30 p-5">
          <div className="text-sm leading-5 font-normal text-neutral-200">
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
