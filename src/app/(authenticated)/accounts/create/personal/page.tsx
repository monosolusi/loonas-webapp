import React from "react";
import { PageHeading } from "@/core/presentations/components/page-heading";
import { PageContent } from "@/core/presentations/components/page-content";
import { CreatePersonalAccountProvider } from "@/features/account/presentation/providers/create-personal-account";
import { PersonalAccountForm } from "./_components/personal-account-form";

export default function CreatePersonalAccount() {
  return (
    <>
      <PageHeading>Pembuatan Akun Personal</PageHeading>
      <PageContent>
        <div className="mx-auto md:max-w-3xl">
          <CreatePersonalAccountProvider>
            <PersonalAccountForm />
          </CreatePersonalAccountProvider>
        </div>
      </PageContent>
    </>
  );
}