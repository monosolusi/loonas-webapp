"use client";

import { useRouter } from "next/navigation";
import { SWRConfig } from "swr";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSignOut } from "@/features/authentication/presentation/hooks/use-sign-out";

type SWRProviderProps = {
  children: React.ReactNode;
};

export function SWRProvider(props: SWRProviderProps) {
  const router = useRouter();
  const { trigger: triggerSignOut } = useSignOut();

  const TERMINAL_ERROR_CODES = [ErrorCodes.RESOURCE_EXPIRED.code, ErrorCodes.NOT_FOUND.code];

  const shouldRetryOnError = (error: Error) => {
    if (error instanceof ServerError) return !TERMINAL_ERROR_CODES.includes(error.code);
    else return true;
  };

  const onError = async (error: Error) => {
    if (error instanceof ServerError) {
      switch (error.code) {
        case ErrorCodes.RESOURCE_EXPIRED.code:
          await triggerSignOut();
          router.replace("/sign-in");
          break;
        case ErrorCodes.NO_VALID_SESSION.code:
          // The handling of NO_VALID_SESSION is handled by a respective component
          break;
        case ErrorCodes.DUPLICATE_ENTRY.code:
          // The handling of DUPLICATE_ENTRY is handled by a respective component
          break;
        default:
          console.log(error);
          break;
      }
    } else throw error;
  };

  return (
    <SWRConfig
      value={{
        shouldRetryOnError,
        onError,
      }}
    >
      {props.children}
    </SWRConfig>
  );
}
