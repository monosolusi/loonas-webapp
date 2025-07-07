"use client";

import { LogoImage } from "@/core/presentations/components/logo-image";
import { InvoiceMetadataImpl } from "./_components/invoice-metadata-impl";
import { SelectPaymentMethodImpl } from "./_components/select-payment-method-impl";
import { useState } from "react";
import { Card } from "@/core/presentations/components/card";
import { SelectSchemeImpl } from "./_components/select-scheme-impl";

export default function SelectPaymentMethodPage() {
  const [selectedScheme, setSelectedScheme] = useState<string | undefined>(undefined);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<{
    id: string;
    title: string;
    requiresSchemeSelection: boolean;
    schemes?: { id: string; imageUrl: string; name: string }[];
  }>();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-4">
        <div className="flex-1 self-start">
          <LogoImage />
        </div>
        <div className="flex-1">
          <InvoiceMetadataImpl />
        </div>
        <div className="flex flex-1 flex-col space-y-4">
          <div className="flex-1">
            <h1 className="text-base font-semibold text-gray-900">Pilih Metode Pembayaran</h1>
            <p className="mt-2 text-sm text-gray-700">
              Pilih metode pembayaran yang ingin kamu gunakan untuk membayar faktur ini.
            </p>
          </div>
          <div className="flex flex-row space-x-4">
            <div className="flex-2">
              <SelectPaymentMethodImpl
                selectedPaymentMethod={selectedPaymentMethod}
                setSelectedPaymentMethod={setSelectedPaymentMethod}
              />
              <SelectSchemeImpl
                selectedMethod={selectedPaymentMethod}
                selectedScheme={selectedScheme}
                setSelectedScheme={setSelectedScheme}
              />
            </div>
            <div className="flex-1">
              <Card>
                <div className="flex flex-col space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">Ringkasan Pembayaran</h2>
                  <p className="text-sm text-gray-700">
                    Metode pembayaran yang dipilih: {selectedPaymentMethod?.title || "Belum dipilih"}
                  </p>
                  <p className="text-sm text-gray-700">Pastikan untuk memeriksa detail sebelum melanjutkan.</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
