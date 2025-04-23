"use client";

import React from "react";
import {
  NewClientButton
} from "@/app/(authenticated)/invoices/incoming/create/@recipients/_components/new-client-button";
import { ListPartnerProvider, useListPartner } from "@/features/partner/presentation/providers/list-partner";
import { RowItem } from "@/app/(authenticated)/invoices/incoming/create/@recipients/_components/row-item";
import {
  useCreateIncomingInvoiceSteps
} from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";

function SelectRecipientContent() {
  const { partners, loading } = useListPartner();

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Klien</h1>
          <p className="mt-2 text-sm text-gray-700">
            Pilih klien yang ingin kamu lakukan pembayaran, yuk!
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <NewClientButton />
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow-sm ring-1 ring-black/5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Nama
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    No. Telpon
                  </th>
                  <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-6">
                    <span className="sr-only">Pilih</span>
                  </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-sm text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : partners.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-sm text-gray-500">
                      Tidak ada klien yang ditemukan
                    </td>
                  </tr>
                ) : (
                  partners.map((partner) => (
                    <RowItem partner={partner} key={partner.id} />
                  ))
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SelectRecipientPage() {
  const { currentStep } = useCreateIncomingInvoiceSteps();

  if (currentStep !== 1) return null;
  return (
    <ListPartnerProvider>
      <SelectRecipientContent />
    </ListPartnerProvider>
  );
}