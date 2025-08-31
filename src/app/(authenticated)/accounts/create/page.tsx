import React from "react";
import { PageContent } from "@/core/presentations/components/page-content";
import { CreateAccountQuestions } from "@/app/(authenticated)/accounts/create/_components/create-account-faq";
import { Card } from "@/core/presentations/components/card";
import { TextHeadingWithUnderline } from "@/core/presentations/components/text-heading-with-underline";
import { AccountTypes } from "@/app/(authenticated)/accounts/create/_components/account-types";

export default function CreateAccountPage() {
  return (
    <PageContent>
      <div className="flex flex-col space-y-4">
        <div className="mb-8 flex-1">
          <TextHeadingWithUnderline>Buat Akun Baru</TextHeadingWithUnderline>
        </div>
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-6 sm:flex-row sm:space-y-0 sm:space-x-6">
            <div className="flex flex-1 flex-row space-x-4">
              <AccountTypes />
            </div>
          </div>
          <div className="sm:col-span-2">
            <Card>
              <div className="px-6 py-4">
                <CreateAccountQuestions />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageContent>
  );
}
