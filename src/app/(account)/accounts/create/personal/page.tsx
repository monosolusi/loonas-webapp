import React from "react";
import { ProtectedPage } from "@/app/(authentication)/_presentation/_components/protected-page";
import { PageHeading } from "@/core/presentations/page-heading";
import { PageMain } from "@/core/presentations/page-main";
import { Header } from "@/app/(home)/home/_components/header";
import { PageContent } from "@/core/presentations/page-content";
import {
  CreatePersonalAccountProvider
} from "@/app/(account)/accounts/create/personal/_presentations/_providers/create-personal-account";

import {
  PersonalAccountForm
} from "@/app/(account)/accounts/create/personal/_presentations/_components/personal-account-form";

export default function CreatePersonalAccount() {
  return (
    <ProtectedPage>
      <div className="relative min-h-full">
        <Header />
        <PageMain>
          <PageHeading>Pembuatan Akun Personal</PageHeading>
          <PageContent>
            <div className="mx-auto w-3xl">
              <CreatePersonalAccountProvider>
                <PersonalAccountForm />
              </CreatePersonalAccountProvider>
            </div>
          </PageContent>
        </PageMain>
      </div>
    </ProtectedPage>
  );
}