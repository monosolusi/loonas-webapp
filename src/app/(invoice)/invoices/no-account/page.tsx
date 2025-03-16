import React from "react";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { BuildingOffice2Icon, UserIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const items = [
  {
    name: "Buat Akun Personal",
    description: "Akun untuk transaksi atas nama individu tanpa dokumen bisnis.",
    href: "/accounts/create/personal",
    iconColor: "bg-primary-default",
    icon: UserIcon,
    disabled: false
  },
  {
    name: "Buat Akun Bisnis",
    description: "Akun untuk transaksi atas nama perusahaan yang memerlukan verifikasi dengan dokumen bisnis.",
    href: "#",
    iconColor: "bg-purple-500",
    icon: BuildingOffice2Icon,
    disabled: true
  }
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}


export default function InvoiceNoAccountPage() {
  return (
    <div className="mx-auto max-w-lg">
      <h2 className="text-base font-semibold text-gray-900">Harus Punya Akun Dulu!</h2>
      <p className="mt-1 text-sm text-gray-500">
        Untuk mulai menggunakan fitur Faktur Digital, pastikan kamu sudah memiliki akun, ya. Kalau belum punya, langsung
        aja daftar lewat link berikut ini.
      </p>
      <ul role="list" className="mt-6 divide-y divide-gray-200 border-t border-b border-gray-200">
        {items.map((item, itemIdx) => (
          <li key={itemIdx} className="group" data-disabled={item.disabled}>
            <div
              className="group relative flex items-start space-x-3 py-4">
              <div className="shrink-0">
                <span
                  className={classNames(
                    "group-data-[disabled=true]:grayscale",
                    item.iconColor,
                    "inline-flex size-10 items-center justify-center rounded-lg"
                  )}
                >
                  <item.icon aria-hidden="true" className="size-6 text-white" />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-900 group-data-[disabled=true]:text-gray-400">
                  {item.disabled ? (
                    <div>
                      <span aria-hidden="true" className="absolute inset-0 cursor-not-allowed" />
                      {item.name}
                    </div>
                  ) : (
                    <Link href={item.href}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {item.name}
                    </Link>
                  )}
                </div>
                <p className="text-sm text-gray-500 group-data-[disabled=true]:text-gray-400">{item.description}</p>
              </div>
              <div className="shrink-0 self-center">
                <ChevronRightIcon
                  aria-hidden="true"
                  className="size-5 text-gray-400 group-data-[disabled=false]-hover:text-gray-500"
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}