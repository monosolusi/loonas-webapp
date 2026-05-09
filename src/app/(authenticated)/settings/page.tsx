"use client";

import Link from "next/link";
import Image from "next/image";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";

interface SettingsCategoryCardProps {
  href: string;
  iconSrc: string;
  title: string;
  description: string;
  active: boolean;
}

interface SettingsCategoryItem extends SettingsCategoryCardProps {
  feature?: string;
}

function SettingsCategoryCard(props: SettingsCategoryCardProps) {
  if (!props.active) {
    return (
      <div className="flex h-full cursor-not-allowed flex-col gap-y-3 rounded-lg border border-neutral-200 bg-white p-6 opacity-50">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-50">
          <Image src={props.iconSrc} alt={props.title} width={20} height={20} />
        </div>
        <div className="flex flex-col gap-y-1">
          <div className="text-sm leading-5 font-semibold text-neutral-500">{props.title}</div>
          <div className="text-sm leading-5 text-neutral-300">{props.description}</div>
        </div>
        <div className="mt-auto">
          <span className="rounded-sm bg-neutral-100 px-2 py-0.5 text-xs leading-4 font-medium text-neutral-300">
            Segera Hadir
          </span>
        </div>
      </div>
    );
  }

  return (
    <Link href={props.href} className="h-full">
      <div className="group flex h-full cursor-pointer flex-col gap-y-3 rounded-lg border border-neutral-200 bg-white p-6 transition-all duration-200 hover:border-primary-300/30 hover:shadow-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-300/10">
          <Image src={props.iconSrc} alt={props.title} width={20} height={20} />
        </div>
        <div className="flex flex-col gap-y-1">
          <div className="text-sm leading-5 font-semibold text-neutral-500">{props.title}</div>
          <div className="text-sm leading-5 text-neutral-300">{props.description}</div>
        </div>
      </div>
    </Link>
  );
}

export default function SettingsPage() {
  const { account } = useGetCurrentAccount();

  const accountHref = account ? `/accounts/${account.id}` : "/accounts";

  const categories: SettingsCategoryItem[] = [
    {
      href: accountHref,
      iconSrc: "/assets/images/people-icon-primary-300-w16-h16.svg",
      title: "Pengaturan Akun",
      description: "Kelola anggota, rekening bank, dan informasi akun.",
      active: true,
    },
    {
      href: "/settings/business-profile",
      iconSrc: "/assets/images/building-icon-neutral-400-w16-h16.svg",
      title: "Profil Bisnis",
      description: "Atur informasi bisnis, logo, dan detail kontak perusahaan.",
      active: false,
    },
    {
      href: "/settings/clients",
      iconSrc: "/assets/images/people-icon-neutral-300-w16-h16.svg",
      title: "Klien",
      description: "Kelola daftar klien dan informasi kontak untuk pembuatan faktur.",
      active: false,
    },
    {
      href: "/settings/categories",
      iconSrc: "/assets/images/box-icon-primary-300-w16-h16.svg",
      title: "Kategori Produk",
      description: "Kelola kategori untuk mengorganisasi katalog produk Anda.",
      active: true,
    },
    {
      href: "/settings/raw-materials",
      iconSrc: "/assets/images/box-icon-primary-300-w16-h16.svg",
      title: "Bahan Baku",
      description: "Kelola daftar bahan baku untuk resep produk olahan.",
      active: true,
    },
    {
      href: "/settings/fixed-costs",
      iconSrc: "/assets/images/chart-icon-primary-300-w16-h16.svg",
      title: "Biaya Tetap",
      description: "Kelola jenis biaya tetap bulanan seperti sewa, gaji, dan listrik.",
      active: true,
      feature: "accounting",
    },
    {
      href: "/settings/coa-mappings",
      iconSrc: "/assets/images/chart-icon-primary-300-w16-h16.svg",
      title: "Pemetaan Akun",
      description: "Kelola pemetaan akun debit dan kredit untuk setiap jenis transaksi.",
      active: true,
      feature: "accounting",
    },
  ];

  const visibleCategories = categories.filter((c) => !c.feature || account?.hasFeature(c.feature));

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-1">
        <h2 className="text-base font-semibold text-neutral-500">Pengaturan</h2>
        <p className="text-sm text-neutral-300">Kelola preferensi dan konfigurasi bisnis kamu.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleCategories.map((category) => (
          <SettingsCategoryCard key={category.href} {...category} />
        ))}
      </div>
    </div>
  );
}
