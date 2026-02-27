"use client";

import Image from "next/image";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";

interface InvoiceDocumentListItem {
  number: number;
  invoiceNumber: string;
  note?: string;
  date: string;
  amount: string;
  file?: { name: string; url: string };
}

interface InvoiceDocumentListProps {
  documents: InvoiceDocumentListItem[];
  totalAmount: string;
}

export function InvoiceDocumentList({ documents, totalAmount }: InvoiceDocumentListProps) {
  return (
    <>
      {/* Table Header */}
      <div className="grid grid-cols-[60px_1fr_auto] border-b border-neutral-100 px-6 py-3 text-sm font-medium">
        <span>No</span>
        <span>Keterangan</span>
        <span>Jumlah</span>
      </div>

      {/* Document Rows */}
      {documents.map((doc) => (
        <div key={doc.number} className="border-b border-neutral-100 px-6 py-5">
          <div className="grid grid-cols-[60px_1fr_auto]">
            <span className="text-sm">{doc.number}</span>
            <div className="flex flex-col gap-y-1">
              <span className="text-sm leading-5 font-medium">{doc.invoiceNumber}</span>
              {doc.note && <span className="text-xs leading-4">{doc.note}</span>}
              <span className="text-xs leading-4">Tgl: {doc.date}</span>
            </div>
            <span className="text-sm leading-5 font-semibold">{doc.amount}</span>
          </div>

          {/* Attachment */}
          {doc.file && (
            <div className="mt-4 ml-[60px]">
              <div className="flex items-center gap-x-3 rounded-lg border border-dashed border-neutral-100 px-4 py-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-red-50">
                  <Image
                    src="/assets/images/document-icon-red-500-w20-h20.svg"
                    alt="file-icon"
                    width={20}
                    height={20}
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <span className="text-sm leading-5 font-medium">{doc.file.name}</span>
                </div>
                <SecondaryButton outlined label="Lihat" onClick={() => window.open(doc.file!.url, "_blank")} />
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Total */}
      <div className="flex items-center justify-end gap-x-6 px-6 py-5">
        <span className="text-sm leading-5 font-semibold">Total Tagihan</span>
        <span className="text-lg leading-5 font-semibold">{totalAmount}</span>
      </div>
    </>
  );
}
