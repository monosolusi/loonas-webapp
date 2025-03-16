import React from "react";
import { PageContent } from "@/core/presentations/components/page-content";
import { CreateAccountQuestions } from "@/app/(authenticated)/(account)/accounts/create/_components/create-account-faq";
import { Card } from "@/core/presentations/components/card";
import { AccountSelector } from "@/app/(authenticated)/(account)/accounts/create/_components/account-selector";

export default function CreateAccountPage() {
  return (
    <PageContent>
      <div className="grid grid-cols-1 space-y-6">
        <div className="flex flex-col space-y-6 sm:flex-row sm:space-x-6 sm:space-y-0">
          <div className="flex-1">
            <Card className="h-full flex items-center">
              <AccountSelector
                href="/accounts/create/personal"
                title="Akun Personal"
                description="Akun untuk transaksi atas nama individu tanpa dokumen bisnis."
                img="https://res.cloudinary.com/monosolusi/image/upload/v1741490456/loonas/web-assets/personal-account_zm1em2.svg"
              />
            </Card>
          </div>
          <div className="flex-1">
            <Card className="h-full flex items-center">
              <AccountSelector
                href="/accounts/create/business"
                title="Akun Bisnis"
                description="Akun untuk transaksi atas nama perusahaan yang memerlukan verifikasi dengan dokumen bisnis."
                img="https://res.cloudinary.com/monosolusi/image/upload/v1741490456/loonas/web-assets/business-account_aok71v.svg"
                disabled />
            </Card>
          </div>
        </div>
        <div className="sm:col-span-2">
          <Card>
            <div className="py-4 px-6">
              <CreateAccountQuestions />
            </div>
          </Card>
        </div>
      </div>
    </PageContent>
  );
}