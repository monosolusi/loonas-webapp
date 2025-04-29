"use client";

import React, { useRef, useState, useMemo } from "react";
import { DocumentIcon, DocumentPlusIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useCreateIncomingInvoice, InvoiceDocument } from "@/features/invoice/presentations/providers/create-incoming-invoice";
import { useCreateIncomingInvoiceSteps } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
import { InvoiceDetailsDialog } from "./_components/invoice-details-dialog";

export default function UploadInvoicePage() {
  const { currentStep } = useCreateIncomingInvoiceSteps();
  const { invoiceDocuments, addInvoiceDocument, removeInvoiceDocument } = useCreateIncomingInvoice();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate total amount of all invoices
  const totalAmount = useMemo(() => {
    return invoiceDocuments.reduce((sum, doc) => sum + doc.amount, 0);
  }, [invoiceDocuments]);

  if (currentStep !== 3) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check if file type is valid (PDF, PNG, JPG)
      if (file.type === "application/pdf" || file.type === "image/png" || file.type === "image/jpeg") {
        setSelectedFile(file);
        setIsDialogOpen(true);
      } else {
        alert("Hanya file PDF, PNG, dan JPG yang diperbolehkan.");
      }
      // Reset the file input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDialogSubmit = (details: Omit<InvoiceDocument, "file">) => {
    if (selectedFile) {
      addInvoiceDocument?.({
        file: selectedFile,
        ...details
      });
      setSelectedFile(null);
      setIsDialogOpen(false);
    }
  };

  const handleDialogClose = () => {
    setSelectedFile(null);
    setIsDialogOpen(false);
  };

  const handleDeleteDocument = (index: number) => {
    removeInvoiceDocument?.(index);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Upload Faktur</h1>
          <p className="mt-2 text-sm text-gray-700">
            Upload faktur yang ingin kamu bayarkan. Kamu bisa upload lebih dari satu faktur.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={handleUploadClick}
            className="inline-flex items-center rounded-md bg-primary-default px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-default"
          >
            <DocumentPlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Upload Faktur
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.png,.jpg,.jpeg"
          />
        </div>
      </div>

      {invoiceDocuments.length > 0 ? (
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
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(doc.amount)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(doc.dueDate).toLocaleDateString('id-ID')}
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
                      <td colSpan={2} className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6 text-right">
                        Total
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-gray-900">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalAmount)}
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 text-center py-12 px-4 sm:px-6 lg:px-8 bg-white rounded-lg border border-dashed border-gray-300">
          <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Belum ada faktur</h3>
          <p className="mt-1 text-sm text-gray-500">Mulai dengan mengupload faktur yang ingin kamu bayarkan.</p>
          <div className="mt-6">
            <button
              type="button"
              onClick={handleUploadClick}
              className="inline-flex items-center rounded-md bg-primary-default px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-default"
            >
              <DocumentPlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Upload Faktur
            </button>
          </div>
        </div>
      )}

      <InvoiceDetailsDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
      />
    </div>
  );
}