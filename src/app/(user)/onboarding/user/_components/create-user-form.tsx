"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCreateUser } from "@/app/(user)/onboarding/user/_providers/create-user";

type CreateUserFormProps = {
  children: React.ReactNode;
};

export function CreateUserForm(props: CreateUserFormProps) {
  const router = useRouter();
  const { createUser, isClean, isCreating } = useCreateUser();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isClean) return;
    if (!createUser) return;
    if (isCreating) return;

    await createUser();
    router.push("/onboarding/account");
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {props.children}
    </form>
  );
}
