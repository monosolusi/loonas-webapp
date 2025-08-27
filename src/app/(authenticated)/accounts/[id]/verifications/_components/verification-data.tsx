"use client";

import React, { useMemo } from "react";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useGetAccountVerificationWork } from "@/features/account/presentation/hooks/use-get-account-verification-work";
import { useParams } from "next/navigation";
import { PersonalAccountEntity } from "@/features/account/domain/entities/personal-account";
import { BusinessAccountEntity } from "@/features/account/domain/entities/business-account";

export function VerificationData() {
  const { id } = useParams<{ id: string }>();
  const { verificationWork } = useGetAccountVerificationWork({ accountId: id });

  function inferNationality(nationality: string) {
    if (nationality === "WNI") return "Warga Negara Indonesia";
    else if (nationality === "WNA") return "Warga Negara Asing";
    else throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  }

  const data = useMemo(() => {
    if (!verificationWork) return [];

    if (verificationWork.account instanceof PersonalAccountEntity) {
      return [
        {
          label: "Kewarganegaraan",
          value: inferNationality(verificationWork.account.nationality),
        },
        {
          label: "Nomor Kartu Identitas",
          value: `KTP - ${verificationWork.account.idNumber}`,
        },
        {
          label: "Nama Lengkap",
          value: verificationWork.account.fullName,
        },
        {
          label: "Pekerjaan",
          value: verificationWork.account.occupation.label,
        },
        {
          label: "Tempat & Tanggal Lahir",
          value: `${verificationWork.account.pob}, ${verificationWork.account.dob.setLocale("id").toFormat("dd MMMM yyyy")}`,
        },
        {
          label: "Alamat",
          value: verificationWork.account.fullAddress,
        },
      ];
    } else if (verificationWork.account instanceof BusinessAccountEntity) {
      return [
        { label: "Nama Perusahaan", value: verificationWork.account.fullName },
        { label: "Email Perusahaan", value: verificationWork.account.company.email },
        { label: "Nomor Telepon Perusahaan", value: verificationWork.account.company.phoneNumber },
        {
          label: "Alamat",
          value: verificationWork.account.fullAddress,
        },
      ];
    } else throw new ServerError(ErrorCodes.NOT_IMPLEMENTED);
  }, [verificationWork]);

  return (
    <>
      <main className="px-4 sm:px-6 lg:flex-auto lg:px-0">
        <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
          <div>
            <h2 className="text-base/7 font-semibold text-gray-900">Berkas yang Sudah Dikirim</h2>
            <p className="mt-1 text-sm/6 text-gray-500">
              Ini adalah berkas akun yang sudah kamu kirim. Verifikasi sedang diproses, estimasi selesai pada{" "}
              {verificationWork?.estimatedVerificationComplete.setLocale("id").toFormat("dd MMMM yyyy")} Mohon ditunggu
              ya!
            </p>

            <dl className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm/6">
              {data.map((item) => (
                <VerificationItem key={item.label} title={item.label} description={item.value} />
              ))}
            </dl>
          </div>
        </div>
      </main>
      <div className="flex justify-center">
        <div className="text-center text-gray-400 sm:max-w-lg">
          Berkas yang kamu kirim akan langsung diverifikasi oleh tim Loonas. Saat proses verifikasi berlangsung, data
          tidak bisa diubah. Mohon tunggu hingga waktunya tiba, ya!
        </div>
      </div>
    </>
  );
}

function VerificationItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="py-6 sm:flex">
      <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">{title}</dt>
      <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
        <div className="text-gray-900">{description}</div>
      </dd>
    </div>
  );
}
