"use client";

import { useCreatePersonalAccount } from "@/features/account/presentation/providers/create-personal-account";
import React from "react";
import { InvalidFormAlert } from "./invalid-form-alert";
import { ConfirmationDialog } from "./confirmation-dialog";
import { NationalitySelect } from "./nationality";
import { UploadKtp } from "./upload-ktp";
import { KtpNumber } from "./ktp-number";
import { FullName } from "./full-name";
import { Occupation } from "./occupation";
import { CompleteAddress } from "./complete-address";
import { PlaceDateOfBirth } from "./place-dob";

export function PersonalAccountForm() {
  const { setOpenConfirmationDialog } = useCreatePersonalAccount();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOpenConfirmationDialog?.(true);
  }

  return (
    <>
      <div className="my-6 sm:mx-auto w-full">
        <InvalidFormAlert />
      </div>

      <form onSubmit={handleSubmit}>
        <ConfirmationDialog />
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
    </>
  );
}