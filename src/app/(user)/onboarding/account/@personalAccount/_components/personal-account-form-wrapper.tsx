"use client";

import { usePersonalAccountData } from "@/app/(user)/onboarding/account/@personalAccount/_hooks/use-personal-account-data";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useRouter } from "next/navigation";

type PersonalAccountFormWrapperProps = {
  children: React.ReactNode;
};

export function PersonalAccountFormWrapper(props: PersonalAccountFormWrapperProps) {
  const { createAccount, markSubmitAttempted } = usePersonalAccountData();
  const { showToast } = useToast();
  const router = useRouter();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    markSubmitAttempted?.();

    try {
      await createAccount();
      router.push(`/onboarding/kyc-summary`);
    } catch (err) {
      console.error(err);
      if (err instanceof ServerError && err.code !== ErrorCodes.UNKNOWN.code) {
        showToast({ title: err.message, type: "error", dismissible: true });
      } else {
        showToast({
          title: "Terjadi kesalahan",
          description: "Silakan coba lagi atau hubungi dukungan kami.",
          type: "error",
          dismissible: true,
        });
      }
    }
  };

  return <form onSubmit={onSubmit}>{props.children}</form>;
}
