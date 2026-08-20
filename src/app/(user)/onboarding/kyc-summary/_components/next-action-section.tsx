import { WaitNextAction } from "@/app/(user)/onboarding/kyc-summary/_components/wait-next-action";
import { ApprovedAction } from "@/app/(user)/onboarding/kyc-summary/_components/approved-action";
import { RejectedAction } from "@/app/(user)/onboarding/kyc-summary/_components/rejected-action";
import { SignOutAction } from "@/app/(user)/onboarding/_components/sign-out-action";

type NextActionSectionProps = {
  account: { id: string };
};

export function NextActionSection(props: NextActionSectionProps) {
  return (
    <div className="flex flex-col items-center gap-y-3 text-center">
      {/* Exactly one of these renders substantive content per verification state. `SignOutAction`
          always renders beneath it — a secondary exit under the "Mulai Gunakan Loonas" CTA on the
          approved path, and the ONLY exit on submitted/reviewing/rejected when there is no
          approved account to switch to yet. */}
      <WaitNextAction account={props.account} />
      <ApprovedAction account={props.account} />
      <RejectedAction account={props.account} />
      <SignOutAction />
    </div>
  );
}
