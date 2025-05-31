"use client";

import React from "react";
import { v4 as uuid } from "uuid";
import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { Card } from "@/core/presentations/components/card";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { TableContainer } from "@/core/presentations/components/table-container";
import { Table } from "@/core/presentations/components/table";
import { TableHeader } from "@/core/presentations/components/table-header";
import { TableBody } from "@/core/presentations/components/table-body";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { SenderInformationImpl } from "@/app/(authenticated)/invoices/outgoing/create/@review/_components/sender-information-impl";
import { InvoiceTopSummary } from "@/app/(authenticated)/invoices/outgoing/create/@review/_components/invoice-top-summary";

const REVIEW_SECTION_STEP = 3;

export default function ReviewSection() {
  const { currentStep } = useCreateOutgoingInvoice();

  if (currentStep !== REVIEW_SECTION_STEP) return null;
  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row justify-between">
          <div className="flex flex-1 flex-col">
            <h1 className="text-base font-semibold text-gray-900">Review & Kirim Invoice</h1>
            <p className="text-sm text-gray-500">
              Tinjau invoice dengan teliti dan kirim langsung ke pelanggan Anda. Pastikan tidak ada kesalahan sebelum
              tagihan dikirim.
            </p>
          </div>
          <div className="hidden flex-1 flex-row space-x-2 md:flex md:justify-end md:self-end">
            <OutlinedButton>Download PDF</OutlinedButton>
            <FilledButton>Kirim Faktur Keluaran</FilledButton>
          </div>
        </div>
        <div className="mt-4 flex flex-1 flex-row space-x-4">
          <Card className="w-full rounded-xs text-sm shadow-md">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-1 flex-row space-x-4">
                <SenderInformationImpl />
                <div className="flex-1"></div>
                <InvoiceTopSummary />
              </div>
              <div className="mt-16 flex w-1/3 flex-col space-y-1">
                <div className="flex-1 text-gray-500 italic">Tagihan Untuk</div>
                <div className="flex-1 text-base font-semibold text-gray-900">Hermawan Wijaya</div>
                <div className="flex-1 text-gray-500">Pakuwon Indah Regency Blok A No. 10, Jakarta 10110</div>
                <div className="flex-1 text-gray-500">Telp. (021) 8888 8888</div>
                <div className="flex-1 text-gray-500">Email. hermawan@wijaya.com</div>
              </div>
              <div className="flex flex-1">
                <TableContainer className="rounded-xs shadow-none">
                  <Table>
                    <TableHeader
                      items={[
                        { node: "Nama Produk", hideOnMobile: false },
                        { node: "Qty / Harga", hideOnMobile: false, className: "text-right" },
                        { node: "Diskon", hideOnMobile: false, className: "text-right" },
                        { node: "DPP", hideOnMobile: false, className: "text-right" },
                        { node: "Pajak", hideOnMobile: false, className: "text-right" },
                        { node: "Jumlah", hideOnMobile: false, className: "text-right" },
                      ]}
                    />
                    <TableBody
                      items={[
                        {
                          row: [
                            {
                              node: (
                                <div className="flex flex-col space-y-1">
                                  <div className="font-bold text-gray-900 group-hover:underline">Item 1</div>
                                  <span className="text-xs text-gray-500">Deskripsi Item Pertama</span>
                                </div>
                              ),
                              hideOnMobile: false,
                            },
                            {
                              node: `10 / ${IDRFormatter.toCurrency(100000)}`,
                              hideOnMobile: false,
                              className: "text-right",
                            },
                            {
                              node: "10%",
                              hideOnMobile: false,
                              className: "text-right",
                            },
                            {
                              node: IDRFormatter.toCurrency(100000),
                              hideOnMobile: false,
                              className: "text-right",
                            },
                            {
                              node: IDRFormatter.toCurrency(10000),
                              hideOnMobile: false,
                              className: "text-right",
                            },
                            { node: IDRFormatter.toCurrency(110000), hideOnMobile: false, className: "text-right" },
                          ],
                        },
                      ]}
                    />
                    <tfoot className="divide-y divide-gray-200 bg-gray-50">
                      <tr>
                        <td colSpan={5} className="px-3 pt-4 pb-2 text-right text-sm">
                          Dasar Pengenaan Pajak (DPP)
                        </td>
                        <td className="px-3 pt-4 pb-2 text-right text-sm">{IDRFormatter.toCurrency(100000)}</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan={5} className="px-3 py-2 text-right text-sm">
                          Total Pajak
                        </td>
                        <td className="px-3 py-2 text-right text-sm">{IDRFormatter.toCurrency(100000)}</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan={5} className="px-3 py-2 text-right text-sm">
                          Total Non-Pajak
                        </td>
                        <td className="px-3 py-2 text-right text-sm">{IDRFormatter.toCurrency(100000)}</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan={5} className="px-3 pt-2 pb-4 text-right text-sm">
                          Grand Total Faktur
                        </td>
                        <td className="px-3 pt-2 pb-4 text-right text-sm font-bold underline">
                          {IDRFormatter.toCurrency(100000)}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </Table>
                </TableContainer>
              </div>
              <div className="mt-8 flex flex-1 flex-row space-x-4">
                <div className="flex-1 flex-col space-y-4">
                  <div className="flex-1 flex-col space-y-1">
                    <div className="font-semibold text-gray-900">Keterangan</div>
                    <div className="text-gray-500">
                      Pembayaran termin kedua untuk penyelenggaraan acara "Tech Startup Day 2025", termasuk sewa venue,
                      konsumsi, dan dokumentasi.
                    </div>
                  </div>
                  <div className="flex-1 flex-col space-y-1">
                    <div className="font-semibold text-gray-900">Syarat & Ketentuan</div>
                    <div className="text-gray-500">
                      {"Pembayaran dilakukan maksimal 7 hari sejak tanggal invoice.\nKeberatan atas tagihan wajib disampaikan dalam 3 hari kerja.\nInvoice ini berlaku sebagai dokumen resmi sesuai hukum Indonesia.".replace(
                        /\n/g,
                        "<br>",
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col items-end space-y-4">
                    <div className="text-gray-500">31 Mei 2025</div>
                    <img
                      alt="signature"
                      className="w-1/2"
                      src="https://res.cloudinary.com/monosolusi/image/upload/v1748665598/loonas/dummy-signature_kbwyhn.png"
                    />
                    <div className="text-gray-500">PT. Mono Solusi Indonesia</div>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex flex-1 flex-col items-start justify-start text-xs font-light text-gray-400 italic">
                <div className="flex-1">[{uuid()}]</div>
                <div className="flex-1">Invoice ini dibuat dengan aplikasi loonas.id</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
