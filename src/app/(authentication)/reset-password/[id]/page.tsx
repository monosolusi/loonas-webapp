/**
 * This component is not using provider because we only handle one input here which is email.
 * In the future, you might need to change this to handle provider, you can take a look on other
 * pages such as sign-in or sign-up
 */
import React from "react";
import { Main } from "@/app/(authentication)/reset-password/[id]/_presentation/_components/main";

export default async function CreateNewPasswordPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Main resetToken={id} />
  );
}