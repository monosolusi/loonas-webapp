import { useRouter } from "next/navigation";
import { useBusinessAccountData } from "@/app/(user)/onboarding/account/@businessAccount/_hooks/use-business-account-data";

type BusinessAccountFormWrapperProps = {
  children: React.ReactNode;
};

export function BusinessAccountFormWrapper(props: BusinessAccountFormWrapperProps) {
  const { createAccount } = useBusinessAccountData();
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
