"use client";

import React from "react";
import { ProtectedPage } from "@/app/(authentication)/_presentation/_components/protected-page";
import { PageHeading } from "@/core/presentations/page-heading";
import { PageMain } from "@/core/presentations/page-main";
import { Header } from "@/app/(home)/home/_components/header";
import { PageContent } from "@/core/presentations/page-content";
import { NationalitySelect } from "@/app/(account)/accounts/create/personal/_components/nationality";
import { UploadKtp } from "@/app/(account)/accounts/create/personal/_components/upload-ktp";
import { KtpNumber } from "@/app/(account)/accounts/create/personal/_components/ktp-number";
import { FullName } from "@/app/(account)/accounts/create/personal/_components/full-name";
import { PlaceDateOfBirth } from "./_components/place-dob";
import { CompleteAddress } from "@/app/(account)/accounts/create/personal/_components/complete-address";
import { Occupation } from "@/app/(account)/accounts/create/personal/_components/occupation";

export default function CreatePersonalAccount() {
  return (
    <ProtectedPage>
      <div className="relative min-h-full">
        <Header />
        <PageMain>
          <PageHeading>Pembuatan Akun Personal</PageHeading>
          <PageContent>
            <div className="mx-auto w-3xl">
              <form>
                <div className="space-y-12">
                  <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base/7 font-semibold text-gray-900">Informasi Pribadi</h2>
                    <p className="mt-1 text-sm/6 text-gray-500">
                      Yuk, isi informasi pribadinya dengan lengkap dan benar. Kami pastikan data kamu aman terlindungi
                      sesuai standar keamanan yang berlaku.
                    </p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                      <NationalitySelect />
                      <UploadKtp />
                      <KtpNumber />
                      <FullName />
                      <Occupation />
                      <PlaceDateOfBirth />
                      <CompleteAddress />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                  <button
                    type="submit"
                    className="rounded-md bg-primary-default px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-default"
                  >
                    Buat Akun Personal
                  </button>
                </div>
              </form>
            </div>

          </PageContent>
        </PageMain>
      </div>
    </ProtectedPage>
  );
}