import { DocumentIcon, XCircleIcon } from "@heroicons/react/24/solid";
import React, { useMemo } from "react";
import { useCreateIncomingInvoice } from "@/features/invoice/presentations/providers/create-incoming-invoice";

export function UploadedInvoiceTable() {
  const { invoiceDocuments, removeInvoiceDocument } = useCreateIncomingInvoice();

  const handleDeleteDocument = (index: number) => removeInvoiceDocument?.(index);

  const totalAmount = useMemo(() => {
    return invoiceDocuments.reduce((sum, doc) => sum + doc.amount, 0);
  }, [invoiceDocuments]);


  if (invoiceDocuments.length === 0) return null;
  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow-sm ring-1 ring-black/5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                  Dokumen
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Nomor Faktur
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Jumlah
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Tanggal Jatuh Tempo
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Hapus</span>
                </th>
              </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
              {invoiceDocuments.map((doc, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    <div className="flex items-center">
                      <DocumentIcon className="h-5 w-5 text-gray-400 mr-2" aria-hidden="true" />
                      {doc.file.name}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{doc.invoiceNumber}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(doc.amount)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {new Date(doc.dueDate).toLocaleDateString("id-ID")}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button
                      type="button"
                      onClick={() => handleDeleteDocument(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <XCircleIcon className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Hapus</span>
                    </button>
                  </td>
                </tr>
              ))}
              </tbody>
              <tfoot className="bg-gray-100">
              <tr>
                <td colSpan={2}
                    className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6 text-right">
                  Total
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-gray-900">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(totalAmount)}
                </td>
                <td colSpan={2}></td>
              </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}