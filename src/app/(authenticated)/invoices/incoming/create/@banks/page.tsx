"use client";

import React from "react";
import {
  NewBankAccountButton
} from "@/app/(authenticated)/invoices/incoming/create/@banks/_components/new-bank-account-button";
import { BankAccountProvider, useBankAccount } from "@/features/bank/presentation/providers/bank-account";
import { RowItem } from "@/app/(authenticated)/invoices/incoming/create/@banks/_components/row-item";
import {
  useCreateIncomingInvoiceSteps
} from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
import { ListBankProvider } from "@/features/bank/presentation/providers/list-bank";
import { useCreateIncomingInvoice } from "@/features/invoice/presentations/providers/create-incoming-invoice";

function SelectBankAccountContent() {
  const { bankAccounts, loading } = useBankAccount();
  const { receiver } = useCreateIncomingInvoice();

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Rekening Tujuan</h1>
          <p className="mt-2 text-sm text-gray-700">
            Pilih rekening tujuan untuk {receiver?.name || "klien"}, yuk!
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <NewBankAccountButton />
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
                    Bank
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Nomor Rekening
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Nama Pemilik Rekening
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
                ) : bankAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-sm text-gray-500">
                      Tidak ada rekening yang ditemukan
                    </td>
                  </tr>
                ) : (
                  bankAccounts.map((bankAccount) => (
                    <RowItem key={bankAccount.id} bankAccount={bankAccount} />
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

export default function SelectBankAccountPage() {
  const { currentStep } = useCreateIncomingInvoiceSteps();
  const { receiver } = useCreateIncomingInvoice();

  if (currentStep !== 2) return null;
  return (
    <ListBankProvider>
      <BankAccountProvider receiver={receiver}>
        <SelectBankAccountContent />
      </BankAccountProvider>
    </ListBankProvider>
  );
}