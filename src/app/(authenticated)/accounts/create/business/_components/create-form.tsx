"use client";

import { CompanyName } from "@/app/(authenticated)/accounts/create/business/_components/company-name";
import { CompanyEmail } from "@/app/(authenticated)/accounts/create/business/_components/company-email";
import { CompanyPhoneNumber } from "@/app/(authenticated)/accounts/create/business/_components/company-phone-number";
import { CompanyProvince } from "@/app/(authenticated)/accounts/create/business/_components/company-province";
import { CompanyCity } from "@/app/(authenticated)/accounts/create/business/_components/company-city";
import { CompanyDistrict } from "@/app/(authenticated)/accounts/create/business/_components/company-district";
import { CompanySubdistrict } from "@/app/(authenticated)/accounts/create/business/_components/company-subdistrict";
import { CompanyAddress } from "@/app/(authenticated)/accounts/create/business/_components/company-address";
import { CompanyDeedOfEstablishment } from "@/app/(authenticated)/accounts/create/business/_components/company-deed-of-establishment";
import { CompanyMostRecentDeedOfAmendment } from "@/app/(authenticated)/accounts/create/business/_components/company-most-recent-deed-of-amendment";
import { CompanyBusinessIdentificationNumber } from "@/app/(authenticated)/accounts/create/business/_components/company-business-identification-number";
import { DirectorNationalIdentityCard } from "@/app/(authenticated)/accounts/create/business/_components/director-nic";
import { CompanyFinancialStatement } from "@/app/(authenticated)/accounts/create/business/_components/company-financial-statement";
import { CompanyBankStatement } from "@/app/(authenticated)/accounts/create/business/_components/company-bank-statement";
import { CreateButton } from "@/app/(authenticated)/accounts/create/business/_components/create-button";
import { useCreateBusinessAccountState } from "@/features/account/presentation/providers/create-business-account";
import { InputErrorAlert } from "@/app/(authenticated)/accounts/create/business/_components/input-error-alert";
import { DemoButton } from "@/app/(authenticated)/accounts/create/business/_components/demo-button";

export function CreateForm() {
  const { isInputClean, setOpenConfirmationDialog } = useCreateBusinessAccountState();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isInputClean) return;
    if (!setOpenConfirmationDialog) return;

    if (isInputClean()) setOpenConfirmationDialog(true);
  };

  return (
    <form className="flex flex-col space-y-12" onSubmit={handleSubmit}>
      <InputErrorAlert />
      <div className="flex flex-col space-y-8 border-b border-gray-900/10 pb-12">
        <div className="flex flex-col">
          <h2 className="text-base/7 font-semibold text-gray-900">Dokumen Legal Perusahaan</h2>
          <p className="mt-1 text-sm/6 text-gray-500">
            Lengkapi Akta Pendirian, NIB, SIUP atau izin operasional, dan NPWP perusahaan kamu. Data dijamin aman dan
            terenkripsi sesuai regulasi yang berlaku.
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <CompanyName className="col-span-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <CompanyEmail />
            <CompanyPhoneNumber />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <CompanyProvince />
            <CompanyCity />
            <CompanyDistrict />
            <CompanySubdistrict />
            <CompanyAddress className="col-span-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CompanyDeedOfEstablishment />
            <CompanyMostRecentDeedOfAmendment />
            <CompanyBusinessIdentificationNumber />
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-8 border-b border-gray-900/10 pb-12">
        <div className="flex flex-col">
          <h2 className="text-base/7 font-semibold text-gray-900">Identifikasi Pengurus Perusahaan</h2>
          <p className="mt-1 text-sm/6 text-gray-500">
            Unggah KTP Direksi serta data identitas pemegang saham dan/atau pemilik manfaat utama. Informasi ini penting
            untuk verifikasi dan kami jaga sepenuhnya sesuai standar keamanan dan regulasi yang berlaku.
          </p>
        </div>
        <div className="flex flex-col">
          <DirectorNationalIdentityCard className="flex-1" />
        </div>
      </div>
      <div className="flex flex-col space-y-8 border-b border-gray-900/10 pb-12">
        <div className="flex flex-col">
          <h2 className="text-base/7 font-semibold text-gray-900">Bukti Operasional Perusahaan</h2>
          <p className="mt-1 text-sm/6 text-gray-500">
            Unggah laporan keuangan terbaru atau rekening koran 3 bulan terakhir. Dokumen ini membantu kami memahami
            aktivitas bisnis kamu, dan tentu saja, datanya aman dan terproteksi.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <CompanyFinancialStatement />
          <CompanyBankStatement />
        </div>
      </div>
      <div className="flex flex-row justify-end space-x-4">
        <DemoButton />
        <CreateButton />
      </div>
    </form>
  );
}
