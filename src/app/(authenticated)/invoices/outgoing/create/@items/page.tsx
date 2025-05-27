"use client";

import React from "react";
import {
  useCreateOutgoingInvoice
} from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { TableContainer } from "@/core/presentations/components/table-container";
import { Table } from "@/core/presentations/components/table";
import { TableHeader } from "@/core/presentations/components/table-header";
import { TableBody } from "@/core/presentations/components/table-body";
import { Card } from "@/core/presentations/components/card";
import { TextInput } from "@/core/presentations/components/text-input";
import { PencilSquareIcon, PhotoIcon } from "@heroicons/react/24/solid";

const ITEMS_SECTION_STEP = 1;

export default function ItemsSection() {
  const { currentStep, recipient } = useCreateOutgoingInvoice();

  if (currentStep !== ITEMS_SECTION_STEP) return null;
  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row justify-between">
          <div className="flex flex-1 flex-col">
            <h1 className="text-base font-semibold text-gray-900">Item dalam Invoice</h1>
            <p className="text-sm text-gray-500">
              Tambahkan item dalam invoice Anda untuk&nbsp;
              <span className="underline text-gray-700 font-bold">{recipient?.name}</span> secara detail.
            </p>
          </div>
          <div className="flex-1 flex justify-end self-end">
            <FilledButton>
              Tambah Item
            </FilledButton>
          </div>
        </div>
        <div className="flex-1 mt-4">
          <Card>
            <div className="flex flex-col space-y-4">
              <div>
                <h1 className="text-base font-semibold text-gray-900">Data Faktur</h1>
                <p className="text-sm text-gray-500">Masukkan data dasar faktur untuk pencatatan dan pelacakan yang
                  akurat.</p>
              </div>
              <div className="flex flex-row justify-between space-x-4">
                <div className="flex-1">
                  <TextInput title="No. Faktur" />
                </div>
                <div className="flex-1">
                  <TextInput title="Tanggal Faktur" />
                </div>
                <div className="flex-1">
                  <TextInput title="Tanggal Jatuh Tempo" />
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="flex-1 mt-4">
          <TableContainer>
            <Table>
              <TableHeader items={[
                { node: "Nama Produk", hideOnMobile: false },
                { node: "Qty / Harga", hideOnMobile: false, className: "text-right" },
                { node: "Diskon", hideOnMobile: false, className: "text-right" },
                { node: "DPP", hideOnMobile: false, className: "text-right" },
                { node: "Pajak", hideOnMobile: false, className: "text-right" },
                { node: "Jumlah", hideOnMobile: false, className: "text-right" },
                { node: "", hideOnMobile: false }
              ]} />
              <TableBody items={[
                {
                  className: "group hover:bg-gray-50 cursor-pointer",
                  row: [
                    {
                      node: (
                        <div className="flex flex-col space-y-1">
                          <div className="text-gray-900 font-bold group-hover:underline">
                            Produk 1
                          </div>
                          <span className="text-xs text-gray-500">Keterangan</span>
                        </div>
                      ),
                      hideOnMobile: false
                    },
                    { node: "10 / Rp 100.000", hideOnMobile: false, className: "text-right" },
                    { node: "10%", hideOnMobile: false, className: "text-right" },
                    { node: "Rp 900.000", hideOnMobile: false, className: "text-right" },
                    { node: "Rp 90.000", hideOnMobile: false, className: "text-right" },
                    { node: "Rp 990.000", hideOnMobile: false, className: "text-right" },
                    {
                      node: (
                        <div className="flex justify-center">
                          <PencilSquareIcon className="size-5 text-gray-500" />
                        </div>
                      ),
                      hideOnMobile: false
                    }
                  ]
                },
                {
                  className: "group hover:bg-gray-50 cursor-pointer",
                  row: [
                    {
                      node: (
                        <div className="flex flex-col space-y-1">
                          <div className="text-gray-900 font-bold group-hover:underline">
                            Produk 2
                          </div>
                          <span className="text-xs text-gray-500">Keterangan</span>
                        </div>
                      ),
                      hideOnMobile: false
                    },
                    { node: "10 / Rp 100.000", hideOnMobile: false, className: "text-right" },
                    { node: "10%", hideOnMobile: false, className: "text-right" },
                    { node: "Rp 900.000", hideOnMobile: false, className: "text-right" },
                    { node: "Rp 90.000", hideOnMobile: false, className: "text-right" },
                    { node: "Rp 990.000", hideOnMobile: false, className: "text-right" },
                    {
                      node: (
                        <div className="flex justify-center">
                          <PencilSquareIcon className="size-5 text-gray-500" />
                        </div>
                      ),
                      hideOnMobile: false
                    }
                  ]
                },
                {
                  className: "cursor-pointer",
                  row: [
                    {
                      node: (
                        <div className="flex flex-col items-center justify-center">
                          <div
                            className="group flex flex-row items-center space-x-1 rounded-sm px-6 py-3 hover:bg-gray-50"
                          >
                            <span className="text-primary-default">
                              Tambah Item
                            </span>
                          </div>
                        </div>
                      ),
                      hideOnMobile: false,
                      colSpan: 7
                    }
                  ]
                }
              ]} />
              <tfoot className="divide-y divide-gray-200 bg-gray-50">
              <tr>
                <td colSpan={5} className="text-sm text-right px-3 pt-4 pb-2">
                  Dasar Pengenaan Pajak (DPP)
                </td>
                <td className="text-sm text-right px-3 pt-4 pb-2">
                  Rp 1.800.000
                </td>
                <td></td>
              </tr>
              <tr>
                <td colSpan={5} className="text-sm text-right px-3 py-2">
                  Total Pajak
                </td>
                <td className="text-sm text-right px-3 py-2">
                  Rp 180.000
                </td>
                <td></td>
              </tr>
              <tr>
                <td colSpan={5} className="text-sm text-right px-3 pt-2 pb-4">
                  Grand Total Faktur
                </td>
                <td className="text-sm text-right font-bold underline px-3 pt-2 pb-4">
                  Rp 1.980.000
                </td>
                <td></td>
              </tr>
              </tfoot>
            </Table>
          </TableContainer>
        </div>
        <div className="flex-1 mt-4">
          <Card>
            <div className="flex flex-row space-x-4">
              <div className="flex-1 flex-col space-y-4">
                <div className="flex-1">
                  <div>
                    <label htmlFor="comment" className="block text-sm/6 font-medium text-gray-900">
                      Keterangan
                    </label>
                    <div className="mt-2">
                    <textarea
                      id="comment"
                      name="comment"
                      rows={4}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-default sm:text-sm/6"
                      defaultValue={""}
                    />
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div>
                    <label htmlFor="comment" className="block text-sm/6 font-medium text-gray-900">
                      Syarat & Ketentuan
                    </label>
                    <div className="mt-2">
                    <textarea
                      id="comment"
                      name="comment"
                      rows={4}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-default sm:text-sm/6"
                      defaultValue={""}
                    />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="col-span-full">
                  <label htmlFor="cover-photo" className="block text-sm/6 font-medium text-gray-900">
                    Tanda Tangan
                  </label>
                  <div
                    className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />
                      <div className="mt-4 flex text-sm/6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-primary-default focus-within:ring-2 focus-within:ring-primary-default focus-within:ring-offset-2 focus-within:outline-hidden hover:text-primary-500"
                        >
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs/5 text-gray-600">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="mt-4 flex-1 flex flex-row justify-end gap-x-4">
          <OutlinedButton>
            Simpan Draft
          </OutlinedButton>
          <FilledButton>
            Selanjutnya
          </FilledButton>
        </div>
      </div>
    </>
  );
}
