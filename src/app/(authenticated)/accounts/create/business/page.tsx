import React from "react";
import { PageContent } from "@/core/presentations/components/page-content";
import { BackButton } from "@/core/presentations/components/back-button";
import { TextHeadingWithUnderline } from "@/core/presentations/components/text-heading-with-underline";
import { CreateForm } from "@/app/(authenticated)/accounts/create/business/_components/create-form";
import { CreateBusinessAccountProvider } from "@/features/account/presentation/providers/create-business-account";

export default function CreateBusinessAccount() {
  return (
    <PageContent>
      <div className="flex flex-col space-y-4">
        <div className="flex flex-row items-start">
          <BackButton />
        </div>
        <TextHeadingWithUnderline className="mb-6">Pembuatan Akun Bisnis</TextHeadingWithUnderline>
        <div className="mx-auto md:max-w-3xl">
          <CreateBusinessAccountProvider>
            <CreateForm />
          </CreateBusinessAccountProvider>
        </div>
      </div>
    </PageContent>
  );
}
