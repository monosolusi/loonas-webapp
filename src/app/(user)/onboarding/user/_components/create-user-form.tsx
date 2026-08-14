"use client";

import React from "react";
import { useCreateUser } from "@/app/(user)/onboarding/user/_providers/create-user";
import { CreateUserErrorBanner } from "@/app/(user)/onboarding/user/_components/create-user-error-banner";

type CreateUserFormProps = {
  children: React.ReactNode;
};

export function CreateUserForm(props: CreateUserFormProps) {
  const { submit } = useCreateUser();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    // `submit()` never throws — it records status/error state itself — so this handler stays a
    // plain fire-and-forget void call rather than an async handler that could otherwise become
    // an invisible unhandled rejection.
    void submit?.();
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <CreateUserErrorBanner />
      {props.children}
    </form>
  );
}
