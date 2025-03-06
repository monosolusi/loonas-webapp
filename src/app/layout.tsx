import type {Metadata, Viewport} from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Loonas – Solusi Pembayaran Invoice Lunas dan Aman",
  description: "Loonas adalah platform fintech Indonesia yang menyederhanakan proses pembayaran invoice dengan metode PayLater, Kartu Kredit, Debit, Virtual Account (VA), dan QRIS. Pastikan setiap invoice lunas dengan sistem kami yang aman, cepat, dan terpercaya",
  keywords: "Loonas, fintech, pembayaran invoice, invoice lunas, PayLater, Kartu Kredit, Kartu Debit, Virtual Account, QRIS, KYC, transaction monitoring",
  authors: {name: "Loonas"},
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className="bg-white h-full" lang="id">
    <body className="h-full">
    {children}
    </body>
    </html>
  );
}