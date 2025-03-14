import React from "react";
import { ProtectedPage } from "@/app/(authentication)/_presentation/_components/protected-page";
import { Header } from "@/app/(home)/home/_components/header";
import { PageHeading } from "@/core/presentations/page-heading";
import { PageMain } from "@/core/presentations/page-main";
import { Card } from "@/core/presentations/card";
import { AccountSelector } from "@/app/(account)/accounts/create/_presentations/_coomponents/account-selector";
import { CreateAccountQuestions } from "@/app/(account)/accounts/create/_presentations/_coomponents/create-account-faq";
import { PageContent } from "@/core/presentations/page-content";

export default function CreateAccountPage() {
  return (
    <ProtectedPage>
      <div className="min-h-full">
        <Header />
        <PageMain>
          <PageHeading>Buat Akun Baru</PageHeading>
          <PageContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Card>
                  <CreateAccountQuestions />
                </Card>
              </div>
              <div className="flex-1">
                <Card>
                  <div className="flex flex-col">
                    <AccountSelector
                      href="/accounts/create/personal"
                      title="Akun Personal"
                      description="Akun untuk transaksi atas nama individu tanpa dokumen bisnis."
                      img="https://res.cloudinary.com/monosolusi/image/upload/v1741490456/loonas/web-assets/personal-account_zm1em2.svg"
                    />
                    <div className="flex my-4 items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <AccountSelector
                      href="/accounts/create/business"
                      title="Akun Bisnis"
                      description="Akun untuk transaksi atas nama perusahaan yang memerlukan verifikasi dengan dokumen bisnis."
                      img="https://res.cloudinary.com/monosolusi/image/upload/v1741490456/loonas/web-assets/business-account_aok71v.svg"
                      disabled
                    />
                  </div>
                </Card>
              </div>
            </div>
          </PageContent>
        </PageMain>
      </div>
    </ProtectedPage>
  );
}