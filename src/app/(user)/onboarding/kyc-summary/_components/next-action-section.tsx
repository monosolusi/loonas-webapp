import { WaitNextAction } from "@/app/(user)/onboarding/kyc-summary/_components/wait-next-action";
import { ApprovedAction } from "@/app/(user)/onboarding/kyc-summary/_components/approved-action";

type NextActionSectionProps = {
  account: { id: string };
};

export function NextActionSection(props: NextActionSectionProps) {
  return (
    <>
      <WaitNextAction account={props.account} />
      <ApprovedAction account={props.account} />
    </>
  );
}
