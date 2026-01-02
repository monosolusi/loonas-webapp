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
      } else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {props.children}
    </form>
  );
}
