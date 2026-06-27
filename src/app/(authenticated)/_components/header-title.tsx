"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useGetProduct } from "@/features/product/presentations/hooks/use-get-product";

type RouteConfig = {
  title: string;
  description?: string;
};

// Static route mappings
const ROUTE_MAP: Record<string, RouteConfig> = {
  "/home": { title: "Dashboard" },
  "/accounts": { title: "Manajemen Akun" },
  "/invoices/incoming": { title: "Faktur Masukan" },
  "/invoices/incoming/create": { title: "Faktur Masukan" },
  "/invoices/incoming/unpaid": { title: "Faktur Masukan" },
  "/invoices/incoming/paid": { title: "Faktur Masukan" },
  "/invoices/incoming/waiting-settlement": { title: "Faktur Masukan" },
  "/invoices/outgoing": { title: "Faktur Keluaran" },
  "/invoices/outgoing/create": { title: "Faktur Keluaran" },
  "/invoices/outgoing/unpaid": { title: "Faktur Keluaran" },
  "/invoices/outgoing/overdue": { title: "Faktur Keluaran" },
  "/invoices/outgoing/paid": { title: "Faktur Keluaran" },
  "/invoices/outgoing/waiting-settlement": { title: "Faktur Keluaran" },
  "/settings": { title: "Pengaturan" },
  "/settings/bank-accounts": { title: "Pengaturan" },
  "/settings/tax-posture": { title: "Pengaturan" },
  "/finance/reports": { title: "Laporan Keuangan" },
  "/finance/journals": { title: "Jurnal Umum" },
  "/finance/journals/new": { title: "Jurnal Baru" },
  "/finance/periods": { title: "Periode Akuntansi" },
  "/finance/opening-balance": { title: "Saldo Awal" },
  "/finance/pph-final": { title: "PPh Final UMKM" },
  "/finance/profitability": { title: "Profitabilitas Varian" },
  "/settings/chart-of-accounts/accounts": { title: "Pengaturan" },
  "/settings/chart-of-accounts/mappings": { title: "Pengaturan" },
};

export function HeaderTitle() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const productId = segments[0] === "finance" && segments[1] === "profitability" && segments[2] ? segments[2] : "";
  const { product } = useGetProduct(productId);

  const { title, description } = useMemo((): RouteConfig => {
    // Check for exact match first
    if (ROUTE_MAP[pathname]) {
      return ROUTE_MAP[pathname];
    }

    // Check for dynamic routes
    const segs = pathname.split("/").filter(Boolean);

    // /accounts/:id
    if (segs[0] === "accounts" && segs[1]) {
      return { title: "Manajemen Akun", description: segs[1] };
    }

    // /invoices/incoming/:id
    if (segs[0] === "invoices" && segs[1] === "incoming" && segs[2]) {
      return { title: "Faktur Masukan", description: segs[2] };
    }

    // /invoices/outgoing/:id
    if (segs[0] === "invoices" && segs[1] === "outgoing" && segs[2]) {
      return { title: "Faktur Keluaran", description: segs[2] };
    }

    // /finance/journals/:id
    if (segs[0] === "finance" && segs[1] === "journals" && segs[2] && segs[2] !== "new") {
      return { title: "Detail Jurnal" };
    }

    // /finance/profitability/:productId/:variantId
    if (segs[0] === "finance" && segs[1] === "profitability" && segs[2] && segs[3]) {
      return { title: "Profitabilitas Varian", description: product?.name ?? "-" };
    }

    // Fallback: find closest parent route
    for (let i = segs.length; i > 0; i--) {
      const parentPath = "/" + segs.slice(0, i).join("/");
      if (ROUTE_MAP[parentPath]) {
        return ROUTE_MAP[parentPath];
      }
    }

    return { title: "Dashboard" };
  }, [pathname, product]);

  return (
    <div className="flex flex-col">
      <div className="text-xl leading-5 font-bold tracking-tight">{title}</div>
      {description && <p className="text-sm text-neutral-400">{description}</p>}
    </div>
  );
}
