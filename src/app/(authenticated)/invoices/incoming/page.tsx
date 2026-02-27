"use client";

import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { Menu, MenuButton, MenuItem, MenuItems, Tab, TabGroup, TabList } from "@headlessui/react";
import Image from "next/image";
import { IncomingInvoiceTableImpl } from "./_components/incoming-invoice-table-impl";

const monthFilterOptions = [
  { label: "Bulan Ini", value: "this_month" },
  { label: "Bulan Lalu", value: "last_month" },
  { label: "3 Bulan Terakhir", value: "last_3_months" },
  { label: "6 Bulan Terakhir", value: "last_6_months" },
  { label: "Tahun Ini", value: "this_year" },
  { label: "Semua", value: "all" },
];

export default function IncomingInvoicePage() {
  return (
    <div className="flex flex-col gap-y-6">
      {/*  Header */}
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <span className="text-2xl leading-8 font-bold tracking-tight">Tagihan & Biaya</span>
          <span className="text-sm leading-5">Pantau semua pengeluaran dan status pembayaran faktur.</span>
        </div>
        <div className="flex flex-row gap-x-3">
          <div className="flex">
            <SecondaryButton outlined label="Export Laporan" />
          </div>
          <div className="flex">
            <PrimaryButton label="Buat Faktur Baru" />
          </div>
        </div>
      </div>

      {/*  Statistics */}
      <div className="flex flex-row gap-x-4">
        {/* Belum Dibayar */}
        <div className="border-b-warning-200/50 border-warning-50 border-warning-200/60 flex flex-1 flex-row justify-between rounded-xl border border-t border-r border-b-4 border-l bg-neutral-50 p-5">
          <div className="flex flex-col gap-y-3">
            <span className="text-sm leading-5 text-neutral-300">Belum Dibayar</span>
            <div className="flex flex-col gap-y-1.5">
              <span className="text-2xl leading-8 font-bold tracking-tight text-neutral-500">Rp 40.600.000</span>
              <span className="text-warning-400 text-xs leading-4">5 faktur menunggu</span>
            </div>
          </div>
          <div className="bg-warning-50 flex size-10 items-center justify-center rounded-lg">
            <Image
              src="/assets/images/circle-dollar-sign-icon-warning-300-w20-h20.svg"
              alt="Belum Dibayar"
              width={20}
              height={20}
            />
          </div>
        </div>

        {/* Total Faktur */}
        <div className="border-b-primary-200/50 border-primary-50 border-primary-200/60 flex flex-1 flex-row justify-between rounded-xl border border-t border-r border-b-4 border-l bg-neutral-50 p-5">
          <div className="flex flex-col gap-y-3">
            <span className="text-sm leading-5 text-neutral-300">Total Faktur</span>
            <div className="flex flex-col gap-y-1.5">
              <span className="text-2xl leading-8 font-bold tracking-tight text-neutral-500">9</span>
              <span className="text-primary-300 text-xs leading-4">Semua faktur aktif</span>
            </div>
          </div>
          <div className="bg-primary-50 flex size-10 items-center justify-center rounded-lg">
            <Image
              src="/assets/images/document-icon-primary-300-w16-h16.svg"
              alt="Total Faktur"
              width={16}
              height={16}
            />
          </div>
        </div>

        {/* Telah Dibayar */}
        <div className="border-b-success-200/50 border-success-50 border-success-200/60 flex flex-1 flex-row justify-between rounded-xl border border-t border-r border-b-4 border-l bg-neutral-50 p-5">
          <div className="flex flex-col gap-y-3">
            <span className="text-sm leading-5 text-neutral-300">Telah Dibayar</span>
            <div className="flex flex-col gap-y-1.5">
              <span className="text-2xl leading-8 font-bold tracking-tight text-neutral-500">4</span>
              <span className="text-success-400 text-xs leading-4">Pembayaran selesai</span>
            </div>
          </div>
          <div className="bg-success-50 flex size-10 items-center justify-center rounded-lg">
            <Image src="/assets/images/check-icon-success-300-w40-h40.svg" alt="Telah Dibayar" width={20} height={20} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex flex-col gap-y-4">
        {/*  Table Filter */}
        <div className="flex flex-row items-center justify-between">
          {/* Status Tabs */}
          <TabGroup>
            <TabList className="flex flex-row rounded-lg bg-neutral-100 p-1">
              {["Semua", "Belum Lunas", "Lunas"].map((label) => (
                <Tab
                  key={label}
                  className={({ selected }) =>
                    `rounded-md px-4 py-1.5 text-sm leading-5 outline-none ${
                      selected ? "bg-white text-neutral-500 shadow-sm" : "text-neutral-300 hover:text-neutral-400"
                    }`
                  }
                >
                  {label}
                </Tab>
              ))}
            </TabList>
          </TabGroup>

          <div className="flex flex-row items-center gap-x-3">
            {/* Search Input */}
            <div className="flex flex-row items-center gap-x-2 rounded-lg border border-neutral-200 px-3 py-2">
              <Image src="/assets/images/search-icon-neutral-400-w20-h20.svg" alt="Search" width={20} height={20} />
              <input
                type="text"
                placeholder="Cari nomor faktur atau nama pemasok..."
                className="w-64 text-sm leading-5 text-neutral-500 outline-none placeholder:text-neutral-300"
              />
            </div>

            {/* Month Filter Dropdown */}
            <Menu as="div" className="relative">
              <MenuButton className="flex flex-row items-center gap-x-2 rounded-lg border border-neutral-200 px-3 py-2">
                <span className="text-sm leading-5 text-neutral-500">Bulan Ini</span>
                <Image
                  src="/assets/images/chevron-down-icon-neutral-200-w20-h20.svg"
                  alt="Dropdown"
                  width={20}
                  height={20}
                />
              </MenuButton>
              <MenuItems className="absolute right-0 z-10 mt-1 w-48 rounded-lg border border-neutral-100 bg-neutral-50 py-1 shadow-lg">
                {monthFilterOptions.map((option) => (
                  <MenuItem key={option.value}>
                    {({ active }) => (
                      <button
                        className={`w-full px-4 py-2 text-left text-sm leading-5 ${
                          active ? "bg-primary-50 text-primary-300" : "text-neutral-500"
                        }`}
                      >
                        {option.label}
                      </button>
                    )}
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>
          </div>
        </div>

        {/*  Table Body */}
        <div className="overflow-hidden rounded-xl border border-neutral-100">
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_1fr] border-b border-neutral-100 bg-neutral-50 px-6 py-3">
            <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Client</span>
            <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">No. Faktur</span>
            <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Tgl. Terima</span>
            <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Status</span>
            <span className="text-right text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">
              Total Tagihan
            </span>
          </div>

          {/* Table Rows + Footer */}
          <IncomingInvoiceTableImpl />
        </div>
      </div>
    </div>
  );
}
