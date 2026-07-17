import Link from "next/link";
import Image from "next/image";

interface AccountingLink {
  href: string;
  iconSrc: string;
  title: string;
  description: string;
}

interface AccountingSection {
  title: string;
  links: AccountingLink[];
}

/**
 * Beranda Akuntansi — the landing page for the "Akuntansi" workspace. Reached from
 * the main menu's "Akuntansi" launcher (which flips the sidebar into accounting
 * mode). Mirrors the sidebar's 5-section grouping as quick-link cards so an
 * accounting operator can jump straight to any task.
 */
const SECTIONS: AccountingSection[] = [
  {
    title: "Jurnal & Buku Besar",
    links: [
      {
        href: "/finance/journals",
        iconSrc: "/assets/images/document-icon-primary-300-w16-h16.svg",
        title: "Jurnal Umum",
        description: "Catat dan telusuri jurnal umum transaksi.",
      },
      {
        href: "/finance/ledger",
        iconSrc: "/assets/images/chart-icon-primary-300-w16-h16.svg",
        title: "Buku Besar",
        description: "Lihat mutasi dan saldo per akun.",
      },
      {
        href: "/finance/opening-balance",
        iconSrc: "/assets/images/wallet-icon-primary-300-w16-h16.svg",
        title: "Saldo Awal",
        description: "Tetapkan saldo awal untuk memulai pembukuan.",
      },
    ],
  },
  {
    title: "Biaya & Profitabilitas",
    links: [
      {
        href: "/finance/fixed-costs",
        iconSrc: "/assets/images/dollar-icon-primary-300-w16-h16.svg",
        title: "Biaya Tetap",
        description: "Catat biaya tetap bulanan seperti sewa dan gaji.",
      },
      {
        href: "/settings/fixed-costs",
        iconSrc: "/assets/images/chart-icon-primary-300-w16-h16.svg",
        title: "Jenis Biaya Tetap",
        description: "Kelola daftar jenis biaya tetap.",
      },
      {
        href: "/finance/profitability",
        iconSrc: "/assets/images/chart-icon-primary-300-w16-h16.svg",
        title: "Profitabilitas",
        description: "Analisis margin per produk dan varian.",
      },
    ],
  },
  {
    title: "Pajak",
    links: [
      {
        href: "/finance/pph-final",
        iconSrc: "/assets/images/document-icon-primary-300-w16-h16.svg",
        title: "PPh Final UMKM",
        description: "Hitung dan kelola PPh Final UMKM.",
      },
      {
        href: "/settings/tax-posture",
        iconSrc: "/assets/images/credit-card-icon-primary-300-w16-h16.svg",
        title: "Postur Pajak",
        description: "Atur bentuk usaha, NPWP, dan status pajak.",
      },
    ],
  },
  {
    title: "Bagan Akun",
    links: [
      {
        href: "/chart-of-accounts/accounts",
        iconSrc: "/assets/images/chart-icon-primary-300-w16-h16.svg",
        title: "Daftar Akun",
        description: "Kelola bagan akun (chart of accounts).",
      },
      {
        href: "/chart-of-accounts/mappings",
        iconSrc: "/assets/images/chart-icon-primary-300-w16-h16.svg",
        title: "Pemetaan Akun",
        description: "Petakan akun ke transaksi otomatis.",
      },
    ],
  },
  {
    title: "Periode & Laporan",
    links: [
      {
        href: "/finance/periods",
        iconSrc: "/assets/images/clock-icon-primary-300-w16-h16.svg",
        title: "Periode Akuntansi",
        description: "Buka dan tutup periode akuntansi.",
      },
      {
        href: "/finance/reports",
        iconSrc: "/assets/images/document-icon-primary-300-w16-h16.svg",
        title: "Laporan Keuangan",
        description: "Neraca, Laba Rugi, Arus Kas, dan lainnya.",
      },
    ],
  },
];

function AccountingLinkCard({ href, iconSrc, title, description }: AccountingLink) {
  return (
    <Link href={href} className="h-full">
      <div className="group flex h-full cursor-pointer flex-col gap-y-3 rounded-lg border border-neutral-200 bg-white p-6 transition-all duration-200 hover:border-primary-300/30 hover:shadow-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-300/10">
          <Image src={iconSrc} alt={title} width={20} height={20} />
        </div>
        <div className="flex flex-col gap-y-1">
          <div className="text-sm leading-5 font-semibold text-neutral-500">{title}</div>
          <div className="text-sm leading-5 text-neutral-300">{description}</div>
        </div>
      </div>
    </Link>
  );
}

export default function AccountingHomePage() {
  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex flex-col gap-y-1">
        <h2 className="text-base font-semibold text-neutral-500">Beranda Akuntansi</h2>
        <p className="text-sm text-neutral-300">Pusat kerja akuntansi — pilih menu untuk mulai mencatat, merekonsiliasi, dan melapor.</p>
      </div>

      {SECTIONS.map((section) => (
        <div key={section.title} className="flex flex-col gap-y-3">
          <h3 className="text-xs font-semibold tracking-wide text-neutral-300 uppercase">{section.title}</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {section.links.map((link) => (
              <AccountingLinkCard key={link.href} {...link} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
