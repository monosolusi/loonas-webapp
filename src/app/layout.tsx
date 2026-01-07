import React from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SWRProvider } from "@/core/presentations/providers/swr-provider";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Loonas – Solusi Pembayaran Invoice Lunas dan Aman",
  description:
    "Loonas adalah platform fintech Indonesia yang menyederhanakan proses pembayaran invoice dengan metode PayLater, Kartu Kredit, Debit, Virtual Account (VA), dan QRIS. Pastikan setiap invoice lunas dengan sistem kami yang aman, cepat, dan terpercaya",
  keywords:
    "Loonas, fintech, pembayaran invoice, invoice lunas, PayLater, Kartu Kredit, Kartu Debit, Virtual Account, QRIS, KYC, transaction monitoring",
  authors: { name: "Loonas" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html className="scrollbar-hide h-full" lang="id">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="h-full">
          <SWRProvider>{children}</SWRProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
