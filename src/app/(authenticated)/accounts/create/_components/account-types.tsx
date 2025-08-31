"use client";

import { AccountTypeItem } from "@/app/(authenticated)/accounts/create/_components/account-type-item";
import { useMemo } from "react";

export function AccountTypes() {
  const data = useMemo(() => {
    return [
      {
        title: "Untuk Personal",
        description: "Akun untuk transaksi atas nama individu atau personal tanpa perlu dokumen bisnis.",
        img: {
          alt: "Personal",
          src: "https://res.cloudinary.com/monosolusi/image/upload/v1741490456/loonas/web-assets/personal-account_zm1em2.svg",
        },
        route: { path: "/accounts/create/personal" },
      },
      {
        title: "Untuk Bisnis",
        description: "Akun untuk transaksi atas nama perusahaan yang memerlukan verifikasi dengan dokumen bisnis.",
        img: {
          alt: "Business",
          src: "https://res.cloudinary.com/monosolusi/image/upload/v1741490456/loonas/web-assets/business-account_aok71v.svg",
        },
        route: { path: "/accounts/create/business" },
      },
    ];
  }, []);

  return data.map((type) => (
    <AccountTypeItem
      key={type.route.path}
      description={type.description}
      img={type.img}
      route={type.route}
      title={type.title}
    />
  ));
}
