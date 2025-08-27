"use client";

import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { useParams } from "next/navigation";
import { useGetOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-get-outgoing-invoice";

export function DownloadPdfButton() {
  const { id } = useParams<{ id: string }>();
  const { invoice, loading } = useGetOutgoingInvoice({ id });

  if (!invoice || loading) return null;
  const pdfUrl = invoice.pdf?.publicUrl;
  const fileName = invoice.pdf?.name ?? `${invoice.invoiceNumber ?? "invoice"}.pdf`;

  if (!pdfUrl) return null;

  const onDownload = async () => {
    try {
      const response = await fetch(pdfUrl, { credentials: "omit", mode: "cors" });
      if (!response.ok) throw new Error("Failed to fetch PDF");
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = fileName;
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(objectUrl);
    } catch (_) {
      // Fallback: open in new tab (won't replace current window)
      window.open(pdfUrl, "_blank", "noopener,noreferrer");
    }
  };

  return <OutlinedButton onClick={onDownload}>Download PDF</OutlinedButton>;
}
