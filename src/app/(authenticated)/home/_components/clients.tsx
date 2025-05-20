import React from "react";
import Link from "next/link";
import { ListPartnerProvider } from "@/features/partner/presentation/providers/list-partner";
import { ClientListImpl } from "@/app/(authenticated)/home/_components/client-list-impl";

export function Clients() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
        <div className="flex items-center justify-between">
          <h2 className="text-base/7 font-semibold text-gray-900">Klien Terbaru</h2>
          <Link href="/partners" className="text-sm/6 font-semibold text-primary-600 hover:text-primary-500">
            Lihat semua
          </Link>
        </div>
        <ListPartnerProvider>
          <ClientListImpl />
        </ListPartnerProvider>
      </div>
    </div>
  );
}
