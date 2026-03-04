import Link from "next/link";
import Image from "next/image";

interface SettingsCategoryCardProps {
  href: string;
  iconSrc: string;
  title: string;
  description: string;
  active: boolean;
}

function SettingsCategoryCard(props: SettingsCategoryCardProps) {
  if (!props.active) {
    return (
      <div className="flex cursor-not-allowed flex-col gap-y-3 rounded-xl border border-neutral-100 bg-white p-6 opacity-50">
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
    <Link href={props.href}>
      <div className="group flex cursor-pointer flex-col gap-y-3 rounded-xl border border-neutral-100 bg-white p-6 transition-all duration-200 hover:border-primary-300/30 hover:shadow-sm">
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

const SETTINGS_CATEGORIES: SettingsCategoryCardProps[] = [
  {
    href: "/settings/bank-accounts",
    iconSrc: "/assets/images/credit-card-icon-primary-300-w16-h16.svg",
    title: "Rekening Bank",
    description: "Kelola rekening bank bisnis yang terdaftar untuk pembayaran faktur.",
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
];

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-1">
        <h2 className="text-base font-semibold text-neutral-500">Pengaturan</h2>
        <p className="text-sm text-neutral-300">Kelola preferensi dan konfigurasi bisnis kamu.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SETTINGS_CATEGORIES.map((category) => (
          <SettingsCategoryCard key={category.href} {...category} />
        ))}
      </div>
    </div>
  );
}
