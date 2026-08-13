"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCreateUser } from "@/app/(user)/onboarding/user/_providers/create-user";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

type CreateUserFormProps = {
  children: React.ReactNode;
};

export function CreateUserForm(props: CreateUserFormProps) {
  const router = useRouter();
  const { createUser, isClean, isCreating } = useCreateUser();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      event.stopPropagation();

      if (!isClean) return;
      if (!createUser) return;
      if (isCreating) return;

      await createUser();
      router.push("/onboarding/account");
    } catch (err) {
      if (err instanceof ServerError) {
        if (err.code === ErrorCodes.USER_SIGNED_IN.code) router.replace("/home");
        else setErrorMessage(err.message);
      } else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {errorMessage && (
        <div className="border-error-300/20 bg-error-300/5 flex flex-row items-start gap-3 rounded-lg border p-4">
          <span className="text-error-300/90 text-sm leading-5 font-normal">{errorMessage}</span>
        </div>
      )}
      {props.children}
    </form>
  );
}
