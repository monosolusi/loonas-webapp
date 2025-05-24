"use client";

import React from "react";
import {
  UpdatePartnerDialogImpl
} from "@/app/(authenticated)/clients/[id]/detail/_components/update-partner-dialog-impl";

export interface PartnerDetailItem {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

interface PartnerDetailProps {
  data: PartnerDetailItem;
}

export function PartnerDetail(props: PartnerDetailProps) {
  const [updateDialogOpen, setUpdateDialogOpen] = React.useState(false);


  const ModifyButton = () => {
    return (
      <button
        type="button"
        className="font-semibold text-primary-default hover:text-primary-500"
        onClick={() => setUpdateDialogOpen(true)}
      >
        Ubah
      </button>
    );
  };

  return (
    <>
      <main className="flex px-4 sm:px-6 lg:flex-auto py-4">
        <div className="w-full">
          <h2 className="text-base/7 font-semibold text-gray-900">Detail Klien</h2>
          <p className="mt-1 text-sm/6 text-gray-500">
            Informasi lengkap tentang klien Anda dalam satu tempat. Pantau status pembayaran, histori transaksi, dan
            data penting lainnya dengan mudah.
          </p>

          <dl className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm/6">
            <div className="py-6 sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Nama Lengkap</dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="text-gray-900">{props.data.fullName}</div>
                <ModifyButton />
              </dd>
            </div>
            <div className="py-6 sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Alamat Email</dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="text-gray-900">{props.data.email}</div>
                <ModifyButton />
              </dd>
            </div>
            <div className="py-6 sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">Nomor Telpon</dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="text-gray-900">{props.data.phoneNumber}</div>
                <ModifyButton />
              </dd>
            </div>
          </dl>
        </div>
      </main>

      <UpdatePartnerDialogImpl open={updateDialogOpen} setOpen={setUpdateDialogOpen} />
    </>
  );
}
