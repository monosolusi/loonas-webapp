import { usePersonalAccountData } from "@/app/(user)/onboarding/account/@personalAccount/_hooks/use-personal-account-data";
import { useRouter } from "next/navigation";

type PersonalAccountFormWrapperProps = {
  children: React.ReactNode;
};

export function PersonalAccountFormWrapper(props: PersonalAccountFormWrapperProps) {
  const { createAccount } = usePersonalAccountData();
  const router = useRouter();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      event.stopPropagation();
      await createAccount();
      router.push(`/onboarding/kyc-summary`);
    } catch (err) {
      console.error(err);
    }
  };

  return <form onSubmit={onSubmit}>{props.children}</form>;
}
