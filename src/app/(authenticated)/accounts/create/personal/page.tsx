import React from "react";
import { PageContent } from "@/core/presentations/components/page-content";
import { CreatePersonalAccountProvider } from "@/features/account/presentation/providers/create-personal-account";
import { PersonalAccountForm } from "./_components/personal-account-form";
import { TextHeadingWithUnderline } from "@/core/presentations/components/text-heading-with-underline";
import { BackButton } from "@/core/presentations/components/back-button";

export default function CreatePersonalAccount() {
  return (
    <PageContent>
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-row items-start">
          <BackButton />
        </div>
        <TextHeadingWithUnderline>Pembuatan Akun Personal</TextHeadingWithUnderline>
        <div className="mx-auto md:max-w-3xl">
          <CreatePersonalAccountProvider>
            <PersonalAccountForm />
          </CreatePersonalAccountProvider>
        </div>
      </div>
    </PageContent>
  );
}
