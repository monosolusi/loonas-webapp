"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

type RouteConfig = {
  title: string;
  description?: string;
};

// Static route mappings
const ROUTE_MAP: Record<string, RouteConfig> = {
  "/home": { title: "Dashboard" },
  "/accounting": { title: "Akuntansi", description: "Beranda Akuntansi" },
  "/accounts": { title: "Manajemen Akun" },
  "/invoices/incoming": { title: "Faktur Masukan" },
  "/invoices/incoming/create": { title: "Faktur Masukan" },
  "/invoices/outgoing": { title: "Faktur Keluaran" },
  "/invoices/outgoing/create": { title: "Faktur Keluaran" },
  "/invoices/outgoing/overdue": { title: "Faktur Keluaran" },
  "/settings": { title: "Pengaturan" },
  "/settings/bank-accounts": { title: "Pengaturan" },
  "/accounting/tax-posture": { title: "Postur Pajak" },
  "/accounting/fixed-costs": { title: "Biaya Tetap" },
  "/accounting/fixed-cost-types": { title: "Jenis Biaya Tetap" },
  "/accounting/reports": { title: "Laporan Keuangan" },
  "/accounting/reports/cost-valuation-gaps": { title: "HPP Belum Tercatat" },
  "/accounting/journals": { title: "Jurnal Umum" },
  "/accounting/journals/new": { title: "Jurnal Baru" },
  "/accounting/periods": { title: "Periode Akuntansi" },
  "/accounting/opening-balance": { title: "Saldo Awal" },
  "/accounting/cash-entries": { title: "Kas Masuk & Kas Keluar" },
  "/accounting/cash-entries/new": { title: "Catat Kas" },
  "/accounting/cash-categories": { title: "Kategori Kas" },
  "/accounting/pph-final": { title: "PPh Final UMKM" },
  "/accounting/profitability": { title: "Profitabilitas Varian" },
  "/accounting/accounts": { title: "Bagan Akun" },
  "/accounting/mappings": { title: "Bagan Akun" },
  "/inventory/stock-adjustment": { title: "Penyesuaian Stok", description: "Penyesuaian stok manual" },
  "/inventory/negative-stock": { title: "Stok Negatif", description: "Penyelesaian stok negatif" },
};

export function HeaderTitle() {
  const pathname = usePathname();

  const { title, description } = useMemo((): RouteConfig => {
    // Check for exact match first
    if (ROUTE_MAP[pathname]) {
      return ROUTE_MAP[pathname];
    }

    // Check for dynamic routes
    const segments = pathname.split("/").filter(Boolean);

    // /accounts/:id
    if (segments[0] === "accounts" && segments[1]) {
      return { title: "Manajemen Akun", description: segments[1] };
    }

    // /invoices/incoming/:id
    if (segments[0] === "invoices" && segments[1] === "incoming" && segments[2]) {
      return { title: "Faktur Masukan", description: segments[2] };
    }

    // /invoices/outgoing/:id
    if (segments[0] === "invoices" && segments[1] === "outgoing" && segments[2]) {
      return { title: "Faktur Keluaran", description: segments[2] };
    }

    // /accounting/journals/:id
    if (segments[0] === "accounting" && segments[1] === "journals" && segments[2] && segments[2] !== "new") {
      return { title: "Detail Jurnal" };
    }

    // /accounting/cash-entries/:id
    if (segments[0] === "accounting" && segments[1] === "cash-entries" && segments[2] && segments[2] !== "new") {
      return { title: "Detail Kas" };
    }

    // /accounting/profitability/:productId/:variantId
    if (segments[0] === "accounting" && segments[1] === "profitability" && segments[2] && segments[3]) {
      return { title: "Profitabilitas Varian" };
    }

    // Fallback: find closest parent route
    for (let i = segments.length; i > 0; i--) {
      const parentPath = "/" + segments.slice(0, i).join("/");
      if (ROUTE_MAP[parentPath]) {
        return ROUTE_MAP[parentPath];
      }
    }

    return { title: "Dashboard" };
  }, [pathname]);

  return (
    <div className="flex flex-col">
      <div className="text-xl leading-5 font-bold tracking-tight">{title}</div>
      {description && <p className="text-sm text-neutral-400">{description}</p>}
    </div>
  );
}
