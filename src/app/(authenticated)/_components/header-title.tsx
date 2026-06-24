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
  "/finance/reports": { title: "Laporan Keuangan" },
  "/finance/journals": { title: "Jurnal Umum" },
  "/finance/journals/new": { title: "Jurnal Baru" },
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
